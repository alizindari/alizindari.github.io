import type { BufferAttribute, DataTexture } from 'three';
import { FloatVertexAttributeTexture, MeshBVHUniformStruct } from 'three-mesh-bvh';
import type { MeshBVH } from 'three-mesh-bvh';

// The library builds the shader's texture layout. A refit changes positions and
// bounds, never triangle indices or node links, so keep the allocated textures.
export function createJellyOpticsBuffers(bvh: MeshBVH) {
  // These two shader fields exist at runtime but aren't in the package's declarations.
  const uniform = new MeshBVHUniformStruct() as MeshBVHUniformStruct & {
    position: DataTexture; bvhBounds: DataTexture;
  };
  const normals = new FloatVertexAttributeTexture();
  const positions = bvh.geometry.getAttribute('position') as BufferAttribute;
  const normalAttr = bvh.geometry.getAttribute('normal') as BufferAttribute;
  uniform.updateFrom(bvh);
  normals.updateFrom(normalAttr);

  const updatePositions = xyzWriter(positions, uniform.position);
  const updateNormals = xyzWriter(normalAttr, normals);
  const packed = uniform.bvhBounds.image.data as Float32Array;
  const nodes: Float32Array[] = [];
  bvh.traverse((_depth, _leaf, bounds) => {
    // traverse provides live six-float views into the tree that refit updates in place.
    if (!(bounds instanceof Float32Array)) throw new Error('Unexpected BVH bounds format');
    nodes.push(bounds);
  });

  return {
    uniform, normals,
    update() {
      updatePositions();
      updateNormals();
      for (let i = 0; i < nodes.length; i++) {
        const b = nodes[i], k = 8 * i;
        // Two RGBA texels per node: min.xyz and max.xyz, each with one padding float.
        packed[k] = b[0]; packed[k + 1] = b[1]; packed[k + 2] = b[2];
        packed[k + 4] = b[3]; packed[k + 5] = b[4]; packed[k + 6] = b[5];
      }
      uniform.bvhBounds.needsUpdate = true;
    },
    dispose() { uniform.dispose(); normals.dispose(); },
  };
}

function xyzWriter(attribute: BufferAttribute, texture: DataTexture) {
  const src = attribute.array, dst = texture.image.data as Float32Array;
  return () => {
    for (let i = 0, j = 0; i < src.length; i += 3, j += 4) {
      dst[j] = src[i]; dst[j + 1] = src[i + 1]; dst[j + 2] = src[i + 2];
    }
    texture.needsUpdate = true;
  };
}

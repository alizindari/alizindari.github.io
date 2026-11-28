import assert from 'node:assert/strict';
import test from 'node:test';
import { MathUtils, Vector3 } from 'three';
import { FloatVertexAttributeTexture, MeshBVH, MeshBVHUniformStruct } from 'three-mesh-bvh';
import { bindJellySurface, createJellyCatGeometry, createJellyPhysics } from '../src/lib/jellyPhysics.ts';
import { createJellyOpticsBuffers } from '../src/lib/jellyOpticsBuffers.ts';

test('flat skinning still applies the original normalized weights and ear displacement', async () => {
  const cat = createJellyCatGeometry(4), physics = await createJellyPhysics();
  try {
    const update = bindJellySurface(cat, physics);
    physics.nudge();
    physics.flickEar(1, new Vector3(4, -1, 0));
    for (let i = 0; i < 8; i++) physics.step();
    update();
    const rest = cat.attributes.jellyRestPosition, cage = physics.geometry.attributes.position;
    for (let i = 0; i < rest.count; i++) {
      const vertex = new Vector3().fromBufferAttribute(rest, i);
      const expected = vertex.clone();
      const neighbors = [];
      let total = 0;
      for (let j = 0; j < cage.count; j++) {
        const from = new Vector3().fromArray(physics.rest, 3 * j);
        const d = from.distanceToSquared(vertex);
        if (d >= 0.65) continue;
        const weight = Math.exp(-d / 0.065);
        neighbors.push([new Vector3().fromBufferAttribute(cage, j).sub(from), weight]);
        total += weight;
      }
      for (const [delta, w] of neighbors) expected.addScaledVector(delta, w / total);
      expected.addScaledVector(physics.earOffsets[vertex.x < 0 ? 0 : 1], MathUtils.smoothstep(vertex.y, 1.32, 1.78));
      expected.y = Math.max(0.006, expected.y);
      const actual = new Vector3().fromBufferAttribute(cat.attributes.position, i);
      assert.deepEqual(actual.toArray(), expected.toArray().map(Math.fround));
    }
  } finally { cat.dispose(); physics.dispose(); }
});

test('refits match the stock shader packer without reallocating or dirtying static textures', () => {
  const cat = createJellyCatGeometry(5);
  const tree = new MeshBVH(cat, { maxLeafSize: 8 });
  const live = createJellyOpticsBuffers(tree);
  const stock = new MeshBVHUniformStruct(), stockNormals = new FloatVertexAttributeTexture();
  const keys = ['position', 'bvhBounds', 'index', 'bvhContents'];
  const textures = [...keys.map(k => live.uniform[k]), live.normals];
  const arrays = textures.map(t => t.image.data);
  const versions = textures.map(t => t.version);
  let disposals = 0;
  textures.forEach(t => t.addEventListener('dispose', () => disposals++));
  try {
    for (const shear of [0.2, -0.3, 0]) {
      const pos = cat.attributes.position, rest = cat.attributes.jellyRestPosition;
      for (let i = 0; i < pos.count; i++) pos.setX(i, rest.getX(i) + shear * rest.getY(i) ** 2);
      cat.computeVertexNormals();
      tree.refit();
      live.update();
      stock.updateFrom(tree);
      stockNormals.updateFrom(cat.attributes.normal);
      textures.forEach((texture, i) => {
        assert.strictEqual(texture.image.data, arrays[i]);
        const reference = i < keys.length ? stock[keys[i]] : stockNormals;
        assert.deepEqual(texture.image.data, reference.image.data);
      });
      assert.equal(live.uniform.index.version, versions[2]);
      assert.equal(live.uniform.bvhContents.version, versions[3]);
      assert.equal(disposals, 0);
    }
  } finally { live.dispose(); stock.dispose(); stockNormals.dispose(); cat.dispose(); }
  assert.equal(disposals, textures.length);
});

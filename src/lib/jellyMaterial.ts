import { MeshPhysicalMaterial } from 'three';
import type { BufferAttribute } from 'three';
import { FloatVertexAttributeTexture, MeshBVHUniformStruct, shaderIntersectFunction, shaderStructs } from 'three-mesh-bvh';
import type { MeshBVH } from 'three-mesh-bvh';

// Trace through the actual deformed surface, rather than using a constant glass thickness.
export function addJellyOptics(material: MeshPhysicalMaterial, bvh: MeshBVH) {
  const uniform = new MeshBVHUniformStruct();
  const normals = new FloatVertexAttributeTexture();
  material.onBeforeCompile = shader => {
    shader.uniforms.jellyBVH = { value: uniform };
    shader.uniforms.jellyNormals = { value: normals };
    shader.fragmentShader = shader.fragmentShader.replace('#include <common>', `
      #include <common>
      precision highp usampler2D;
      ${shaderStructs}
      ${shaderIntersectFunction}
      uniform BVH jellyBVH;
      uniform sampler2D jellyNormals;
    `).replace('#include <transmission_fragment>', `
      material.transmission = transmission;
      material.transmissionAlpha = 1.0;
      vec3 jellyNormal = transformNormalByInverseViewMatrix(normal, viewMatrix);
      vec3 jellyView = normalize(vec3(viewMatrix[0].z, viewMatrix[1].z, viewMatrix[2].z));
      vec3 direction = refract(-jellyView, jellyNormal, 1.0 / ior);
      vec3 origin = vWorldPosition + direction * 0.012;
      vec3 throughput = vec3(1.0);
      vec3 transmitted = vec3(0.0);
      for (int bounce = 0; bounce < 5; bounce++) {
        uvec4 face = uvec4(0u);
        vec3 faceNormal = vec3(0.0), barycentric = vec3(0.0);
        float side = 1.0, distance = 0.0;
        if (!bvhIntersectFirstHit(jellyBVH, origin, direction, face, faceNormal, barycentric, side, distance)) {
          transmitted = throughput * textureCubeUV(envMap, envMapRotation * direction, 0.12).rgb * envMapIntensity;
          break;
        }
        origin += direction * distance;
        throughput *= exp(log(max(attenuationColor, vec3(0.001))) * distance / attenuationDistance);
        vec3 exitNormal = normalize(
          texelFetch1D(jellyNormals, face.x).xyz * barycentric.x +
          texelFetch1D(jellyNormals, face.y).xyz * barycentric.y +
          texelFetch1D(jellyNormals, face.z).xyz * barycentric.z
        ) * side;
        vec3 outgoing = refract(direction, exitNormal, ior);
        if (dot(outgoing, outgoing) < 0.001) {
          direction = reflect(direction, exitNormal);
          origin += faceNormal * 0.012 + direction * 0.012;
          transmitted = throughput * textureCubeUV(envMap, envMapRotation * direction, 0.12).rgb * envMapIntensity;
          continue;
        }
        vec3 light = textureCubeUV(envMap, envMapRotation * outgoing, 0.06).rgb * envMapIntensity;
        if (outgoing.y < -0.001) {
          vec3 floorPoint = origin + outgoing * max(0.0, -origin.y / outgoing.y);
          vec4 clip = projectionMatrix * viewMatrix * vec4(floorPoint, 1.0);
          vec2 uv = clip.xy / clip.w * 0.5 + 0.5;
          light = getTransmissionSample(clamp(uv, 0.005, 0.995), 0.035, ior).rgb;
        }
        transmitted = throughput * light;
        break;
      }
      vec3 fresnel = EnvironmentBRDF(jellyNormal, jellyView, material.specularColorBlended, material.specularF90, material.roughness);
      totalDiffuse = transmitted * material.diffuseContribution * (1.0 - fresnel);
    `);
  };
  material.customProgramCacheKey = () => 'jelly-refraction-v1';
  return {
    update() {
      uniform.updateFrom(bvh);
      normals.updateFrom(bvh.geometry.attributes.normal as BufferAttribute);
    },
    dispose() { uniform.dispose(); normals.dispose(); },
  };
}

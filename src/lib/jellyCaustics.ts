import { CanvasTexture, Color, DoubleSide, Mesh, MeshBasicMaterial, PlaneGeometry, Ray, Vector3 } from 'three';
import type { MeshBVH } from 'three-mesh-bvh';

function refract(direction: Vector3, normal: Vector3, ratio: number) {
  const cosine = -direction.dot(normal);
  const discriminant = 1 - ratio * ratio * (1 - cosine * cosine);
  if (discriminant < 0) return null;
  return direction.clone().multiplyScalar(ratio)
    .addScaledVector(normal, ratio * cosine - Math.sqrt(discriminant)).normalize();
}

export function createJellyCaustics() {
  const size = 128;
  const span = 5;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const context = canvas.getContext('2d')!;
  const pixels = context.createImageData(size, size);
  const flux = new Float32Array(size * size);
  const texture = new CanvasTexture(canvas);
  const material = new MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, opacity: 0.52, toneMapped: false });
  const mesh = new Mesh(new PlaneGeometry(span, span), material);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = 0.008;
  const incident = new Vector3(0.32, -1, -0.24).normalize();
  const ray = new Ray();

  return {
    mesh,
    update(bvh: MeshBVH, center: Vector3, tint: string) {
      flux.fill(0);
      const color = new Color(tint).convertLinearToSRGB();
      // A small, deterministic photon grid follows the deformed surface through two refractions.
      for (let row = 0; row < 30; row++) {
        for (let column = 0; column < 30; column++) {
          ray.origin.set(center.x - 1.6 + column * 3.2 / 29, 3.3, center.z - 1.6 + row * 3.2 / 29);
          ray.direction.copy(incident);
          const entry = bvh.raycastFirst(ray, DoubleSide);
          if (!entry?.face || entry.face.normal.dot(incident) >= 0) continue;
          const inside = refract(incident, entry.face.normal, 1 / 1.36);
          if (!inside) continue;
          ray.origin.copy(entry.point).addScaledVector(inside, 0.003);
          ray.direction.copy(inside);
          const exit = bvh.raycastFirst(ray, DoubleSide);
          if (!exit?.face) continue;
          const outward = refract(inside, exit.face.normal.clone().negate(), 1.36);
          if (!outward || outward.y > -0.01) continue;
          const hit = exit.point.clone().addScaledVector(outward, -exit.point.y / outward.y);
          const u = (hit.x / span + 0.5) * size;
          const v = (hit.z / span + 0.5) * size;
          const strength = Math.exp(-entry.point.distanceTo(exit.point) * 0.5);
          for (let dy = -2; dy <= 2; dy++) {
            for (let dx = -2; dx <= 2; dx++) {
              const x = Math.round(u) + dx, y = Math.round(v) + dy;
              if (x >= 0 && x < size && y >= 0 && y < size) flux[y * size + x] += strength * Math.exp(-(dx * dx + dy * dy) / 2.2);
            }
          }
        }
      }
      for (let i = 0; i < flux.length; i++) {
        pixels.data[i * 4] = Math.round(color.r * 255);
        pixels.data[i * 4 + 1] = Math.round(color.g * 255);
        pixels.data[i * 4 + 2] = Math.round(color.b * 255);
        pixels.data[i * 4 + 3] = Math.round(155 * (1 - Math.exp(-flux[i] * 0.9)));
      }
      context.putImageData(pixels, 0, 0);
      texture.needsUpdate = true;
    },
    dispose() { mesh.geometry.dispose(); material.dispose(); texture.dispose(); },
  };
}

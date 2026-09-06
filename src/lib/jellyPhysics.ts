import AmmoFactory from 'ammojs-typed';
import type Ammo from 'ammojs-typed';
import { BoxGeometry, BufferAttribute, BufferGeometry, Vector3 } from 'three';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';

let engine: ReturnType<typeof AmmoFactory> | undefined;

export function createJellyGeometry(segments: number) {
  // Uniform face subdivisions are essential: a bevel-only mesh cannot be pinched in the middle.
  const box = new BoxGeometry(1.3, 1.3, 1.3, segments * 2, segments * 2, segments * 2);
  box.deleteAttribute('normal');
  box.deleteAttribute('uv');
  const geometry = mergeVertices(box, 0.00001);
  geometry.clearGroups();
  box.dispose();
  const vertices = geometry.getAttribute('position');
  for (let i = 0; i < vertices.count; i++) {
    const x = vertices.getX(i), y = vertices.getY(i), z = vertices.getZ(i);
    const scale = 0.65 / (Math.abs(x) ** 5 + Math.abs(y) ** 5 + Math.abs(z) ** 5) ** 0.2;
    vertices.setXYZ(i,
      x * scale + 0.016 * Math.sin(y * 5 + 0.5) * Math.cos(z * 4),
      y * scale + 0.013 * Math.cos(x * 5 + 1) * Math.sin(z * 5),
      z * scale + 0.014 * Math.sin(x * 5 - 0.7) * Math.cos(y * 4),
    );
  }
  geometry.rotateY(-0.12);
  geometry.translate(0, 0.71, 0);
  geometry.computeVertexNormals();
  return geometry;
}

export async function createJellyPhysics() {
  // The Emscripten factory assigns to `this`, including in strict ES modules.
  engine ??= AmmoFactory.call({}).catch(error => {
    engine = undefined;
    throw error;
  });
  const ammo = await engine;
  const owned: object[] = [];
  const keep = <T extends object>(object: T): T => { owned.push(object); return object; };
  const config = keep(new ammo.btSoftBodyRigidBodyCollisionConfiguration());
  const dispatcher = keep(new ammo.btCollisionDispatcher(config));
  const broadphase = keep(new ammo.btDbvtBroadphase());
  const solver = keep(new ammo.btSequentialImpulseConstraintSolver());
  const softSolver = keep(new ammo.btDefaultSoftBodySolver());
  const world = keep(new ammo.btSoftRigidDynamicsWorld(dispatcher, broadphase, solver, config, softSolver));
  const gravity = keep(new ammo.btVector3(0, -9.81, 0));
  world.setGravity(gravity);
  world.getWorldInfo().set_m_gravity(gravity);
  const rigidBodies: Ammo.btRigidBody[] = [];

  function wall(x: number, y: number, z: number, width: number, height: number, depth: number) {
    const size = keep(new ammo.btVector3(width / 2, height / 2, depth / 2));
    const shape = keep(new ammo.btBoxShape(size));
    const origin = keep(new ammo.btVector3(x, y, z));
    const transform = keep(new ammo.btTransform());
    transform.setIdentity();
    transform.setOrigin(origin);
    const motion = keep(new ammo.btDefaultMotionState(transform));
    const inertia = keep(new ammo.btVector3(0, 0, 0));
    const info = keep(new ammo.btRigidBodyConstructionInfo(0, motion, shape, inertia));
    const rigid = keep(new ammo.btRigidBody(info));
    rigid.setFriction(0.65);
    world.addRigidBody(rigid);
    rigidBodies.push(rigid);
  }
  wall(0, -0.15, 0, 10, 0.3, 10);
  wall(-1.85, 2, 0, 0.2, 4, 5);
  wall(1.85, 2, 0, 0.2, 4, 5);
  wall(0, 2, -1.45, 5, 4, 0.2);
  wall(0, 2, 1.45, 5, 4, 0.2);

  const geometry = createJellyGeometry(3);
  const rest = Float32Array.from(geometry.getAttribute('position').array);
  const positions = geometry.getAttribute('position') as BufferAttribute;
  const indices = Array.from(geometry.index!.array);
  const helper = keep(new ammo.btSoftBodyHelpers());
  const body = helper.CreateFromTriMesh(world.getWorldInfo(), Array.from(rest), indices, indices.length / 3, true);
  const settings = body.get_m_cfg();
  settings.set_viterations(8);
  settings.set_piterations(10);
  settings.set_kDP(0.035);
  settings.set_kDF(0.7);
  settings.set_kCHR(1);
  settings.set_kPR(0);
  const skin = body.get_m_materials().at(0);
  skin.set_m_kLST(0.12);
  skin.set_m_kAST(0.12);
  const bending = body.appendMaterial();
  bending.set_m_kLST(0.04);
  body.generateBendingConstraints(2, bending);

  // Interior cross-links resist collapse without inflating the cube like a balloon.
  const volume = body.appendMaterial();
  volume.set_m_kLST(0.12);
  const count = rest.length / 3;
  for (let i = 0; i < count; i++) {
    let best = 0;
    let distance = Infinity;
    for (let j = 0; j < count; j++) {
      const d = (rest[i * 3] + rest[j * 3]) ** 2
        + (rest[i * 3 + 1] + rest[j * 3 + 1] - 1.42) ** 2
        + (rest[i * 3 + 2] + rest[j * 3 + 2]) ** 2;
      if (d < distance) { distance = d; best = j; }
    }
    if (best > i) body.appendLink(i, best, volume, true);
  }
  body.setTotalMass(1, false);
  body.getCollisionShape().setMargin(0.012);
  body.setActivationState(4);
  world.addSoftBody(body, 1, -1);
  const nodes = Array.from({ length: count }, (_, i) => body.get_m_nodes().at(i));
  const force = keep(new ammo.btVector3(0, 0, 0));
  const center = new Vector3();
  const min = new Vector3();
  const max = new Vector3();
  let energy = 0;
  let disposed = false;
  let grabbed: { index: number; weight: number; offset: Vector3 }[] = [];
  const target = new Vector3();
  const acceleration = new Vector3();
  const grabMin = new Vector3(-1.15, 0.15, -0.9);
  const grabMax = new Vector3(1.15, 2.3, 0.9);

  function readPositions() {
    center.set(0, 0, 0);
    min.set(Infinity, Infinity, Infinity);
    max.set(-Infinity, -Infinity, -Infinity);
    energy = 0;
    for (let i = 0; i < count; i++) {
      const p = nodes[i].get_m_x();
      const v = nodes[i].get_m_v();
      const x = p.x(), y = p.y(), z = p.z();
      positions.setXYZ(i, x, y, z);
      center.x += x; center.y += y; center.z += z;
      min.x = Math.min(min.x, x); min.y = Math.min(min.y, y); min.z = Math.min(min.z, z);
      max.x = Math.max(max.x, x); max.y = Math.max(max.y, y); max.z = Math.max(max.z, z);
      energy += v.x() ** 2 + v.y() ** 2 + v.z() ** 2;
    }
    center.divideScalar(count);
    energy /= count;
    positions.needsUpdate = true;
  }

  function reset() {
    grabbed = [];
    nodes.forEach((node, i) => {
      node.get_m_x().setValue(rest[i * 3], rest[i * 3 + 1], rest[i * 3 + 2]);
      node.get_m_q().setValue(rest[i * 3], rest[i * 3 + 1], rest[i * 3 + 2]);
      node.get_m_v().setValue(0, 0, 0);
      node.get_m_f().setValue(0, 0, 0);
    });
    readPositions();
  }

  function step() {
    if (disposed) return;
    for (const grip of grabbed) {
      const node = nodes[grip.index];
      const p = node.get_m_x(), v = node.get_m_v();
      const mass = 1 / node.get_m_im();
      acceleration.set(
        (target.x + grip.offset.x - p.x()) * 2400 - v.x() * 55,
        (target.y + grip.offset.y - p.y()) * 2400 - v.y() * 55,
        (target.z + grip.offset.z - p.z()) * 2400 - v.z() * 55,
      ).clampLength(0, 1200).multiplyScalar(mass * grip.weight);
      force.setValue(acceleration.x, acceleration.y, acceleration.z);
      body.addForce(force, grip.index);
    }
    world.stepSimulation(1 / 120, 0);
    readPositions();
    if (!Number.isFinite(center.lengthSq()) || min.y < -0.3 || max.y > 5) reset();
  }

  function grab(point: Vector3) {
    target.copy(point);
    grabbed = nodes.flatMap((node, index) => {
      const p = node.get_m_x();
      const offset = new Vector3(p.x(), p.y(), p.z()).sub(point);
      const distance = offset.length();
      return distance < 0.46 ? [{ index, offset, weight: Math.exp(-distance * distance / 0.055) }] : [];
    });
  }

  function nudge() {
    nodes.forEach((node, i) => {
      const v = node.get_m_v();
      const height = (rest[i * 3 + 1] - 0.06) / 1.3;
      node.get_m_v().setValue(v.x() + 0.75 * height, v.y() + 1.8, v.z() - 0.3 * height);
    });
  }

  readPositions();
  return {
    geometry, rest, center, min, max, step, reset, grab, nudge,
    get energy() { return energy; },
    get dragging() { return grabbed.length > 0; },
    move(point: Vector3) { target.copy(point).clamp(grabMin, grabMax); },
    release() { grabbed = []; },
    dispose() {
      if (disposed) return;
      disposed = true;
      world.removeSoftBody(body);
      rigidBodies.forEach(rigid => world.removeRigidBody(rigid));
      ammo.destroy(body);
      owned.reverse().forEach(object => ammo.destroy(object));
      geometry.dispose();
    },
  };
}

export type JellyPhysics = Awaited<ReturnType<typeof createJellyPhysics>>;

// Skin a denser rounded surface to the simulated cage, preserving the rest shape.
export function bindJellySurface(geometry: BufferGeometry, physics: JellyPhysics) {
  const position = geometry.getAttribute('position') as BufferAttribute;
  const rest = Float32Array.from(position.array);
  const bindings = Array.from({ length: position.count }, (_, i) => {
    const nearest: { index: number; distance: number; weight: number }[] = [];
    for (let j = 0; j < physics.rest.length / 3; j++) {
      const distance = (rest[i * 3] - physics.rest[j * 3]) ** 2
        + (rest[i * 3 + 1] - physics.rest[j * 3 + 1]) ** 2
        + (rest[i * 3 + 2] - physics.rest[j * 3 + 2]) ** 2;
      if (distance < 0.65) {
        nearest.push({ index: j, distance, weight: Math.exp(-distance / 0.065) });
      }
    }
    const total = nearest.reduce((sum, item) => sum + item.weight, 0);
    return nearest.map(item => ({ ...item, weight: item.weight / total }));
  });
  return () => {
    const cage = physics.geometry.getAttribute('position');
    bindings.forEach((binding, i) => {
      let x = rest[i * 3], y = rest[i * 3 + 1], z = rest[i * 3 + 2];
      binding.forEach(({ index, weight }) => {
        x += (cage.getX(index) - physics.rest[index * 3]) * weight;
        y += (cage.getY(index) - physics.rest[index * 3 + 1]) * weight;
        z += (cage.getZ(index) - physics.rest[index * 3 + 2]) * weight;
      });
      position.setXYZ(i, x, Math.max(0.006, y), z);
    });
    position.needsUpdate = true;
    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();
  };
}

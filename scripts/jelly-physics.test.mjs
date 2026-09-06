// Run with Node 22.6+ using `npm run test:jelly`.
import assert from 'node:assert/strict';
import test from 'node:test';
import { Vector3 } from 'three';
import { bindJellySurface, createJellyGeometry, createJellyPhysics } from '../src/lib/jellyPhysics.ts';

function advance(physics, steps) {
  for (let i = 0; i < steps; i++) physics.step();
  assert(Number.isFinite(physics.center.lengthSq()));
  assert(physics.min.y > -0.1, 'The body must stay above the floor.');
  assert(physics.max.y < 4, 'The body must remain inside the scene.');
}

function topPoint(physics) {
  const positions = physics.geometry.attributes.position;
  let top = 0;
  for (let i = 1; i < positions.count; i++) if (positions.getY(i) > positions.getY(top)) top = i;
  return new Vector3().fromBufferAttribute(positions, top);
}

test('a face center has vertices that can be grabbed', () => {
  const geometry = createJellyGeometry(3);
  try {
    const positions = geometry.attributes.position;
    let nearest = Infinity;
    for (let i = 0; i < positions.count; i++) {
      nearest = Math.min(nearest, new Vector3().fromBufferAttribute(positions, i).distanceTo(new Vector3(0, 1.36, 0)));
    }
    assert(nearest < 0.1);
    assert.equal(geometry.groups.length, 0, 'The GPU BVH needs a single root.');
  } finally { geometry.dispose(); }
});

test('the jelly settles, stretches at the grab point, and recovers after release', async () => {
  const physics = await createJellyPhysics();
  const surface = createJellyGeometry(9);
  try {
    const update = bindJellySurface(surface, physics);
    advance(physics, 480);
    const restingHeight = physics.max.y;
    assert(restingHeight > 1.1 && restingHeight < 1.5);
    assert(physics.energy < 0.01);
    physics.grab(topPoint(physics));
    assert(physics.dragging);
    physics.move(new Vector3(0.5, 2.3, 0.3));
    advance(physics, 100);
    assert(physics.max.y > restingHeight + 0.15);
    update();
    assert(Array.from(surface.attributes.position.array).every(Number.isFinite));
    assert(Array.from(surface.attributes.normal.array).every(Number.isFinite));
    physics.release();
    assert(!physics.dragging);
    advance(physics, 1200);
    assert(physics.energy < 0.015);
    physics.reset();
    assert.equal(physics.energy, 0);
    assert.deepEqual(Array.from(physics.geometry.attributes.position.array), Array.from(physics.rest));
  } finally { surface.dispose(); physics.dispose(); physics.dispose(); }
});

test('repeated bounces, extreme pointer targets, and resets stay bounded', async () => {
  const physics = await createJellyPhysics();
  try {
    for (let cycle = 0; cycle < 8; cycle++) {
      physics.reset();
      advance(physics, 180);
      physics.grab(topPoint(physics));
      physics.move(new Vector3(cycle % 2 ? -1e6 : 1e6, 1e6, -1e6));
      advance(physics, 100);
      physics.release();
      physics.nudge();
      advance(physics, 240);
      assert(physics.min.x > -2 && physics.max.x < 2);
      assert(physics.min.z > -1.6 && physics.max.z < 1.6);
    }
  } finally { physics.dispose(); }
});

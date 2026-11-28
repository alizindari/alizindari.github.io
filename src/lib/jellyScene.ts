import {
  ACESFilmicToneMapping, CanvasTexture, DirectionalLight, DoubleSide, HemisphereLight,
  Mesh, MeshBasicMaterial, MeshPhysicalMaterial, OrthographicCamera,
  Plane, PlaneGeometry, PMREMGenerator, Raycaster, Scene,
  SRGBColorSpace, Vector2, Vector3, WebGLRenderer,
} from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { MeshBVH } from 'three-mesh-bvh';
import { bindJellySurface, createJellyCatGeometry, createJellyPhysics } from './jellyPhysics';
import { createJellyCatFace } from './jellyCatFace';
import { createJellyCaustics } from './jellyCaustics';
import { addJellyOptics } from './jellyMaterial';

export const jellyColors = {
  berry: { surface: '#fff4f8', absorption: '#d53180', light: '#e44f8c' },
  mint: { surface: '#e5fff1', absorption: '#35ae7e', light: '#60c995' },
  honey: { surface: '#fff2dd', absorption: '#dc9a28', light: '#e9b751' },
} as const;
export type JellyColor = keyof typeof jellyColors;

export async function createJellyScene(host: HTMLElement, onPlay: () => void = () => {}) {
  const physics = await createJellyPhysics();
  let disposed = false;
  const cleanups: (() => void)[] = [() => physics.dispose()];
  const own = <T extends { dispose(): void }>(resource: T): T => {
    cleanups.push(() => resource.dispose());
    return resource;
  };
  function dispose() {
    if (disposed) return;
    disposed = true;
    cleanups.reverse().forEach(cleanup => cleanup());
  }
  try {
    const renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power', preserveDrawingBuffer: true });
    cleanups.push(() => { renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove(); });
    renderer.debug.onShaderError = () => { throw new Error('Jelly shader compilation failed.'); };
    renderer.setClearColor(0xffffff, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    const canvas = renderer.domElement;
    canvas.setAttribute('aria-label', 'Interactive jelly cat. Tap to poke, drag to stretch, press Enter to bounce, or R to reset.');
    canvas.tabIndex = 0;
    host.appendChild(canvas);

    const scene = new Scene();
    const frameRadius = 1.63;
    const camera = new OrthographicCamera(-frameRadius, frameRadius, frameRadius, -frameRadius, 0.01, 30);
    camera.position.set(2.05, 2.8, 7);
    camera.lookAt(0, 0.92, 0);
    const environment = own(new RoomEnvironment());
    const pmrem = own(new PMREMGenerator(renderer));
    const environmentMap = own(pmrem.fromScene(environment, 0.025));
    scene.environment = environmentMap.texture;
    scene.environmentIntensity = 1.2;

    const key = new DirectionalLight(0xffffff, 3);
    key.position.set(-3, 6, 4);
    scene.add(key, new HemisphereLight(0xffffff, 0xdce2ed, 1.6));

    const ground = new Mesh(own(new PlaneGeometry(200, 200)), own(new MeshBasicMaterial({ color: '#ffffff', toneMapped: false })));
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    const contactCanvas = document.createElement('canvas');
    contactCanvas.width = contactCanvas.height = 128;
    const context = contactCanvas.getContext('2d')!;
    const gradient = context.createRadialGradient(64, 64, 8, 64, 64, 60);
    gradient.addColorStop(0, 'rgba(38, 26, 40, 0.25)');
    gradient.addColorStop(0.55, 'rgba(38, 26, 40, 0.10)');
    gradient.addColorStop(1, 'rgba(38, 26, 40, 0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 128, 128);
    const contactTexture = own(new CanvasTexture(contactCanvas));
    const contact = new Mesh(own(new PlaneGeometry(2.4, 2.4)), own(new MeshBasicMaterial({ map: contactTexture, transparent: true, depthWrite: false })));
    contact.rotation.x = -Math.PI / 2;
    contact.position.y = 0.005;
    scene.add(contact);

    const geometry = own(createJellyCatGeometry(14));
    const updateSurface = bindJellySurface(geometry, physics);
    const material = own(new MeshPhysicalMaterial({
      color: jellyColors.berry.surface,
      attenuationColor: jellyColors.berry.absorption,
      attenuationDistance: 1.5,
      transmission: 1,
      ior: 1.36,
      roughness: 0.07,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.045,
      envMapIntensity: 1.15,
    }));
    const jelly = new Mesh(geometry, material);
    jelly.frustumCulled = false;
    scene.add(jelly);
    const bvh = new MeshBVH(geometry, { maxLeafSize: 8 });
    const optics = own(addJellyOptics(material, bvh, own(createJellyCatFace())));
    const caustics = own(createJellyCaustics());
    scene.add(caustics.mesh);
    const raycaster = new Raycaster();
    const pointer = new Vector2();
    const dragPlane = new Plane();
    const point = new Vector3();
    let color: JellyColor = 'berry';
    let activePointer: number | null = null;
    let previousTime = 0;
    let accumulator = 0;
    let opticalTime = 0;
    let idleSince = 0;
    let frame = 0;
    let active = true;
    let paused = false;
    let dragDistance = 0;
    let pressX = 0;
    let pressY = 0;
    let touchDrag = false;
    let earSide = 0;
    let blinkTime = Infinity;
    const touchEvents = 'TouchEvent' in window;
    const pressPoint = new Vector3(), inward = new Vector3(), pull = new Vector3();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function setRay(clientX: number, clientY: number) {
      const bounds = canvas.getBoundingClientRect();
      pointer.set((clientX - bounds.left) / bounds.width * 2 - 1, -(clientY - bounds.top) / bounds.height * 2 + 1);
      raycaster.setFromCamera(pointer, camera);
    }

    function wake() {
      idleSince = performance.now();
      if (!frame && active && !disposed) {
        previousTime = 0;
        frame = requestAnimationFrame(animate);
      }
    }

    function draw() {
      updateSurface();
      bvh.refit();
      optics.update();
      contact.position.x = physics.center.x;
      contact.position.z = physics.center.z;
      contact.material.opacity = Math.max(0.12, 1 - Math.max(0, physics.min.y) * 1.2);
      if (opticalTime >= 0.08) {
        caustics.update(bvh, physics.center, jellyColors[color].light);
        opticalTime = 0;
      }
      renderer.render(scene, camera);
    }

    function animate(now: number) {
      frame = 0;
      if (!active || disposed) return;
      const elapsed = previousTime ? Math.min((now - previousTime) / 1000, 0.05) : 1 / 60;
      previousTime = now;
      if (!paused) {
        accumulator += elapsed;
        while (accumulator >= 1 / 120) { physics.step(); accumulator -= 1 / 120; }
      }
      opticalTime += elapsed;
      blinkTime += elapsed;
      const t = blinkTime / 0.18;
      optics.setBlink(t >= 0 && t < 1 && !reducedMotion.matches ? Math.sin(Math.PI * t) ** 2 : 0);
      draw();
      if (!paused && (physics.dragging || physics.energy > 0.0005 || now - idleSince < 1800)) {
        frame = requestAnimationFrame(animate);
      }
    }

    function beginDrag(id: number, x: number, y: number, touch: boolean) {
      if (activePointer !== null) return false;
      setRay(x, y);
      const hit = bvh.raycastFirst(raycaster.ray, DoubleSide);
      if (!hit) return false;
      pressX = x; pressY = y;
      pressPoint.copy(hit.point);
      inward.copy(hit.normal ?? hit.face!.normal).normalize().negate();
      earSide = 0;
      if (hit.face && hit.barycoord) {
        const { a, b, c } = hit.face, w = hit.barycoord, rest = geometry.getAttribute('jellyRestPosition');
        if (rest.getY(a) * w.x + rest.getY(b) * w.y + rest.getY(c) * w.z > 1.40) {
          earSide = Math.sign(rest.getX(a) * w.x + rest.getX(b) * w.y + rest.getX(c) * w.z);
        }
      }
      activePointer = id;
      touchDrag = touch;
      dragDistance = 0;
      pull.set(0, 0, 0);
      physics.grab(hit.point);
      camera.getWorldDirection(point);
      dragPlane.setFromNormalAndCoplanarPoint(point, hit.point);
      if (!touch) canvas.setPointerCapture(id);
      canvas.style.cursor = 'grabbing';
      paused = false;
      onPlay();
      wake();
      return true;
    }

    function pointerDown(event: PointerEvent) {
      if ((touchEvents && event.pointerType === 'touch') || event.button !== 0) return;
      if (beginDrag(event.pointerId, event.clientX, event.clientY, false)) event.preventDefault();
    }

    function moveDrag(x: number, y: number) {
      dragDistance = Math.max(dragDistance, Math.hypot(x - pressX, y - pressY));
      setRay(x, y);
      if (raycaster.ray.intersectPlane(dragPlane, point)) {
        physics.move(point);
        pull.copy(point).sub(pressPoint);
      }
      wake();
    }

    function pointerMove(event: PointerEvent) {
      if (touchDrag || (touchEvents && event.pointerType === 'touch')) return;
      if (activePointer === event.pointerId) {
        event.preventDefault();
        moveDrag(event.clientX, event.clientY);
      } else if (event.pointerType !== 'touch') {
        setRay(event.clientX, event.clientY);
        canvas.style.cursor = bvh.raycastFirst(raycaster.ray, DoubleSide) ? 'grab' : 'default';
      }
    }

    function release(completed = false) {
      if (activePointer === null) return;
      const id = activePointer;
      activePointer = null;
      if (completed) {
        const tap = dragDistance < 4;
        if (tap) physics.poke(pressPoint, inward);
        if (earSide && !reducedMotion.matches) {
          const flick = tap ? point.set(earSide * 4, -1, -0.4) : point.copy(pull).multiplyScalar(-8);
          physics.flickEar(earSide, flick);
        }
        if (!tap && physics.compression > 0.04 && !reducedMotion.matches) blinkTime = 0;
      }
      physics.release();
      canvas.style.cursor = 'grab';
      if (!touchDrag && canvas.hasPointerCapture(id)) canvas.releasePointerCapture(id);
      touchDrag = false;
      wake();
    }
    function pointerEnd(event: PointerEvent) {
      if (!touchDrag && event.pointerId === activePointer) release(event.type === 'pointerup');
    }
    // Decide at touchstart, before native scrolling begins. Misses stay ordinary page gestures.
    function touchStart(event: TouchEvent) {
      if (event.touches.length !== 1 || !event.cancelable) return;
      const t = event.changedTouches[0];
      if (beginDrag(t.identifier, t.clientX, t.clientY, true)) event.preventDefault();
    }
    function touchMove(event: TouchEvent) {
      if (!touchDrag) return;
      const t = Array.from(event.changedTouches).find(t => t.identifier === activePointer);
      if (!t) return;
      if (event.cancelable) event.preventDefault();
      moveDrag(t.clientX, t.clientY);
    }
    function touchEnd(event: TouchEvent) {
      if (touchDrag && Array.from(event.changedTouches).some(t => t.identifier === activePointer)) {
        release(event.type === 'touchend');
      }
    }

    function reset() { release(); physics.reset(); blinkTime = Infinity; paused = false; onPlay(); opticalTime = 1; wake(); }
    function blur() { release(); }
    function keyDown(event: KeyboardEvent) {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); paused = false; onPlay(); physics.nudge(); wake(); }
      if (event.key.toLowerCase() === 'r') { event.preventDefault(); reset(); }
      if (event.key === 'Escape') release();
    }
    function resize() {
      const { width, height } = host.getBoundingClientRect();
      if (!width || !height) return;
      const aspect = width / height;
      camera.left = -frameRadius * Math.max(1, aspect);
      camera.right = -camera.left;
      camera.top = frameRadius / Math.min(1, aspect);
      camera.bottom = -camera.top;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      opticalTime = 1;
      wake();
    }
    function visibility() {
      if (document.hidden) release();
      active = !document.hidden && inView;
      if (!active) { cancelAnimationFrame(frame); frame = 0; }
      else wake();
    }
    function contextLost(event: Event) {
      event.preventDefault();
      cancelAnimationFrame(frame);
      frame = 0;
      active = false;
      host.dispatchEvent(new CustomEvent('jelly-error'));
    }
    let inView = true;
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; visibility(); }, { threshold: 0.01 });
    observer.observe(host);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    canvas.addEventListener('pointerdown', pointerDown);
    canvas.addEventListener('pointermove', pointerMove);
    canvas.addEventListener('pointerup', pointerEnd);
    canvas.addEventListener('pointercancel', pointerEnd);
    canvas.addEventListener('lostpointercapture', pointerEnd);
    canvas.addEventListener('touchstart', touchStart, { passive: false });
    canvas.addEventListener('touchmove', touchMove, { passive: false });
    canvas.addEventListener('touchend', touchEnd);
    canvas.addEventListener('touchcancel', touchEnd);
    canvas.addEventListener('keydown', keyDown);
    canvas.addEventListener('webglcontextlost', contextLost);
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('blur', blur);
    cleanups.push(() => {
      release();
      cancelAnimationFrame(frame);
      observer.disconnect(); resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('blur', blur);
      canvas.removeEventListener('pointerdown', pointerDown);
      canvas.removeEventListener('pointermove', pointerMove);
      canvas.removeEventListener('pointerup', pointerEnd);
      canvas.removeEventListener('pointercancel', pointerEnd);
      canvas.removeEventListener('lostpointercapture', pointerEnd);
      canvas.removeEventListener('touchstart', touchStart);
      canvas.removeEventListener('touchmove', touchMove);
      canvas.removeEventListener('touchend', touchEnd);
      canvas.removeEventListener('touchcancel', touchEnd);
      canvas.removeEventListener('keydown', keyDown);
      canvas.removeEventListener('webglcontextlost', contextLost);
    });
    for (let i = 0; i < 100; i++) physics.step();
    if (!reducedMotion.matches) physics.nudge();
    resize();
    draw();

    return {
      reset,
      nudge() { paused = false; onPlay(); physics.nudge(); wake(); },
      setPaused(value: boolean) { release(); paused = value; opticalTime = 1; wake(); },
      setColor(value: JellyColor) {
        color = value;
        material.color.set(jellyColors[value].surface);
        material.attenuationColor.set(jellyColors[value].absorption);
        opticalTime = 1;
        wake();
      },
      dispose,
    };
  } catch (error) {
    dispose();
    throw error;
  }
}

export type JellyScene = Awaited<ReturnType<typeof createJellyScene>>;

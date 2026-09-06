import {
  ACESFilmicToneMapping, CanvasTexture, DirectionalLight, DoubleSide, HemisphereLight,
  Mesh, MeshBasicMaterial, MeshPhysicalMaterial, OrthographicCamera,
  Plane, PlaneGeometry, PMREMGenerator, Raycaster, Scene,
  SRGBColorSpace, Vector2, Vector3, WebGLRenderer,
} from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { MeshBVH } from 'three-mesh-bvh';
import { bindJellySurface, createJellyGeometry, createJellyPhysics } from './jellyPhysics';
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
    canvas.setAttribute('aria-label', 'Interactive jelly cube. Drag to stretch; press Enter to bounce, or R to reset.');
    canvas.tabIndex = 0;
    canvas.style.touchAction = 'none';
    host.appendChild(canvas);

    const scene = new Scene();
    const camera = new OrthographicCamera(-1.9, 1.9, 1.9, -1.9, 0.01, 30);
    camera.position.set(4.5, 3.2, 5);
    camera.lookAt(0, 0.85, 0);
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

    const geometry = own(createJellyGeometry(12));
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
    const optics = own(addJellyOptics(material, bvh));
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
      draw();
      if (!paused && (physics.dragging || physics.energy > 0.0005 || now - idleSince < 1800)) {
        frame = requestAnimationFrame(animate);
      }
    }

    function beginDrag(id: number, hit: Vector3) {
      activePointer = id;
      dragDistance = 0;
      physics.grab(hit);
      camera.getWorldDirection(point);
      dragPlane.setFromNormalAndCoplanarPoint(point, hit);
      canvas.setPointerCapture(id);
      canvas.style.cursor = 'grabbing';
      canvas.style.touchAction = 'none';
      paused = false;
      onPlay();
      wake();
    }

    function pointerDown(event: PointerEvent) {
      if (activePointer !== null || event.button !== 0) return;
      setRay(event.clientX, event.clientY);
      const hit = bvh.raycastFirst(raycaster.ray, DoubleSide);
      if (!hit) return;
      pressX = event.clientX;
      pressY = event.clientY;
      event.preventDefault();
      beginDrag(event.pointerId, hit.point);
    }

    function pointerMove(event: PointerEvent) {
      setRay(event.clientX, event.clientY);
      if (activePointer === event.pointerId) {
        event.preventDefault();
        dragDistance = Math.max(dragDistance, Math.hypot(event.clientX - pressX, event.clientY - pressY));
        if (raycaster.ray.intersectPlane(dragPlane, point)) physics.move(point);
        wake();
      } else if (event.pointerType !== 'touch') {
        canvas.style.cursor = bvh.raycastFirst(raycaster.ray, DoubleSide) ? 'grab' : 'default';
      }
    }

    function release(event?: PointerEvent) {
      if (activePointer === null || (event && event.pointerId !== activePointer)) return;
      const id = activePointer;
      activePointer = null;
      physics.release();
      canvas.style.cursor = 'grab';
      canvas.style.touchAction = 'none';
      if (canvas.hasPointerCapture(id)) canvas.releasePointerCapture(id);
      if (event?.type === 'pointerup' && dragDistance < 4) physics.nudge();
      wake();
    }

    function reset() { release(); physics.reset(); paused = false; onPlay(); opticalTime = 1; wake(); }
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
      camera.left = -1.9 * Math.max(1, aspect);
      camera.right = -camera.left;
      camera.top = 1.9 / Math.min(1, aspect);
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
    canvas.addEventListener('pointerup', release);
    canvas.addEventListener('pointercancel', release);
    canvas.addEventListener('lostpointercapture', release);
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
      canvas.removeEventListener('pointerup', release);
      canvas.removeEventListener('pointercancel', release);
      canvas.removeEventListener('lostpointercapture', release);
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

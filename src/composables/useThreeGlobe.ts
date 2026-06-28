import {
  AdditiveBlending,
  AmbientLight,
  CanvasTexture,
  CircleGeometry,
  Color,
  DirectionalLight,
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  PerspectiveCamera,
  Quaternion,
  Scene,
  SphereGeometry,
  RepeatWrapping,
  SRGBColorSpace,
  Texture,
  TextureLoader,
  Vector3,
  WebGLRenderer,
} from 'three';
import { latLonToUnitVector } from '../utils/geo';
import { feltRadiusToGlobeUnits, magnitudeRenderOrder, magnitudeRenderTier, magnitudeToFeltRadiusKm } from '../utils/earthquake';

export interface GlobeMarker {
  lat: number;
  lon: number;
  color: string;
  size: number;
  opacity?: number;
}

export interface GlobeSpike {
  lat: number;
  lon: number;
  height: number;
  color: string;
}

export interface GlobeEarthquakeEvent {
  lat: number;
  lon: number;
  magnitude: number;
  color: string;
}

const EARTH_RADIUS = 1;
/** Solar System Scope 2K day map — standard equirectangular, lon 0° at image center. */
const EARTH_MAP_URL = '/textures/earth-daymap.jpg';
const SURFACE_OFFSET = 1.012;

function loadEarthTexture(): Texture {
  const texture = new TextureLoader().load(EARTH_MAP_URL);
  texture.colorSpace = SRGBColorSpace;
  // SphereGeometry u=0 sits at lon −90°; shift so prime meridian aligns with markers.
  texture.wrapS = RepeatWrapping;
  texture.offset.x = 0.25;
  return texture;
}

export interface GlobeSceneOptions {
  /** Camera distance; larger values shrink the globe in frame. Default 2.8 */
  cameraZ?: number;
  /** Resume auto-rotation this many ms after drag ends. Omit to keep legacy drag-off behavior. */
  resumeAfterDragMs?: number;
  /** Allow scroll / pinch zoom on the canvas. */
  enableZoom?: boolean;
  /** Closest camera distance (max zoom in). Default 1.35 */
  minCameraZ?: number;
  /** Farthest camera distance (max zoom out). Default max(cameraZ, 4.5) */
  maxCameraZ?: number;
}

export function createGlobeScene(
  container: HTMLElement,
  options: GlobeSceneOptions = {}
) {
  const cameraZ = options.cameraZ ?? 2.8;
  const resumeAfterDragMs = options.resumeAfterDragMs;
  const enableZoom = options.enableZoom ?? false;
  const minCameraZ = options.minCameraZ ?? 1.35;
  const maxCameraZ = options.maxCameraZ ?? Math.max(cameraZ, 4.5);
  const width = container.clientWidth;
  const height = container.clientHeight || 320;

  const scene = new Scene();
  scene.background = new Color(0x0a0c12);

  const camera = new PerspectiveCamera(42, width / height, 0.1, 100);
  camera.position.z = cameraZ;

  const renderer = new WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);
  renderer.sortObjects = true;
  container.appendChild(renderer.domElement);

  scene.add(new AmbientLight(0xffffff, 0.55));
  const sun = new DirectionalLight(0xffffff, 1.25);
  sun.position.set(4, 2, 5);
  scene.add(sun);

  const earthTexture = loadEarthTexture();
  const earthMaterial = new MeshPhongMaterial({
    map: earthTexture,
    shininess: 8,
    specular: new Color(0x222233),
  });

  const earth = new Mesh(new SphereGeometry(EARTH_RADIUS, 64, 64), earthMaterial);
  scene.add(earth);

  const markerGroup = new Group();
  const cityMarkerGroup = new Group();
  const spikeGroup = new Group();
  const earthquakeGroup = new Group();
  const userMarkerGroup = new Group();
  earth.add(markerGroup);
  earth.add(cityMarkerGroup);
  earth.add(spikeGroup);
  earth.add(earthquakeGroup);
  earth.add(userMarkerGroup);

  const surfaceNormal = new Vector3();
  const surfacePosition = new Vector3();
  const surfaceQuaternion = new Quaternion();
  const upVector = new Vector3(0, 0, 1);

  function disposeGroup(group: Group) {
    while (group.children.length) {
      const child = group.children[0];
      group.remove(child);
      if (child instanceof Mesh) {
        child.geometry.dispose();
        const mat = child.material;
        if (Array.isArray(mat)) {
          mat.forEach((m) => m.dispose());
        } else {
          mat.dispose();
        }
      }
    }
  }

  let auroraShell: Mesh | null = null;
  let auroraOverlayTexture: Texture | null = null;

  let animationId = 0;
  let autoRotate = true;
  let manuallyPaused = false;
  let resumeTimer: ReturnType<typeof setTimeout> | null = null;
  let isDragging = false;
  let lastX = 0;
  let lastY = 0;

  function clearResumeTimer() {
    if (resumeTimer) {
      clearTimeout(resumeTimer);
      resumeTimer = null;
    }
  }

  function scheduleResumeAfterDrag() {
    if (resumeAfterDragMs == null || manuallyPaused) return;
    clearResumeTimer();
    resumeTimer = setTimeout(() => {
      autoRotate = true;
      resumeTimer = null;
    }, resumeAfterDragMs);
  }

  function render() {
    if (autoRotate && !isDragging) {
      earth.rotation.y += 0.002;
    }
    renderer.render(scene, camera);
    animationId = requestAnimationFrame(render);
  }
  render();

  function onPointerDown(e: PointerEvent) {
    isDragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    clearResumeTimer();
    autoRotate = false;
  }

  function onPointerMove(e: PointerEvent) {
    if (!isDragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    earth.rotation.y += dx * 0.005;
    earth.rotation.x += dy * 0.005;
    earth.rotation.x = Math.max(-0.8, Math.min(0.8, earth.rotation.x));
  }

  function onPointerUp() {
    isDragging = false;
    if (resumeAfterDragMs != null) {
      scheduleResumeAfterDrag();
    }
  }

  function onWheel(e: WheelEvent) {
    if (!enableZoom) return;
    e.preventDefault();
    const delta = e.deltaY * 0.003;
    camera.position.z = Math.max(
      minCameraZ,
      Math.min(maxCameraZ, camera.position.z + delta)
    );
  }

  renderer.domElement.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  if (enableZoom) {
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false });
  }

  function createMarkerMesh(
    marker: GlobeMarker,
    {
      surfaceBoost = 1,
      emissiveIntensity = 0.6,
      depthWrite = true,
      renderOrder = 0,
    }: {
      surfaceBoost?: number;
      emissiveIntensity?: number;
      depthWrite?: boolean;
      renderOrder?: number;
    } = {}
  ) {
    const [x, y, z] = latLonToUnitVector(marker.lat, marker.lon);
    const radius =
      EARTH_RADIUS * SURFACE_OFFSET * surfaceBoost * (1 + marker.size * 0.01);
    const opacity = marker.opacity ?? 0.9;
    const mesh = new Mesh(
      new SphereGeometry(marker.size * 0.012, 8, 8),
      new MeshPhongMaterial({
        color: new Color(marker.color),
        emissive: new Color(marker.color),
        emissiveIntensity,
        transparent: opacity < 1 || !depthWrite,
        opacity,
        depthWrite,
      })
    );
    mesh.position.set(x * radius, y * radius, z * radius);
    mesh.renderOrder = renderOrder;
    return mesh;
  }

  function setMarkers(markers: GlobeMarker[]) {
    while (markerGroup.children.length) {
      markerGroup.remove(markerGroup.children[0]);
    }
    for (const marker of markers) {
      markerGroup.add(
        createMarkerMesh(marker, {
          surfaceBoost: 1,
          emissiveIntensity: 0.35,
          depthWrite: false,
          renderOrder: 1,
        })
      );
    }
  }

  function setCityMarkers(markers: GlobeMarker[]) {
    while (cityMarkerGroup.children.length) {
      cityMarkerGroup.remove(cityMarkerGroup.children[0]);
    }
    for (const marker of markers) {
      cityMarkerGroup.add(
        createMarkerMesh(marker, {
          surfaceBoost: 1.03,
          emissiveIntensity: 0.55,
          depthWrite: true,
          renderOrder: 10,
        })
      );
    }
  }

  function setSpikes(spikes: GlobeSpike[]) {
    disposeGroup(spikeGroup);
    for (const spike of spikes) {
      const [x, y, z] = latLonToUnitVector(spike.lat, spike.lon);
      const normal = new Vector3(x, y, z);
      const base = normal.clone().multiplyScalar(EARTH_RADIUS * SURFACE_OFFSET);
      const tip = base.clone().add(normal.multiplyScalar(spike.height * 0.06));
      const mid = base.clone().lerp(tip, 0.5);
      const mesh = new Mesh(
        new SphereGeometry(0.02 + spike.height * 0.008, 6, 6),
        new MeshPhongMaterial({
          color: new Color(spike.color),
          emissive: new Color(spike.color),
          emissiveIntensity: 0.5,
        })
      );
      mesh.position.copy(mid);
      spikeGroup.add(mesh);
    }
  }

  function setEarthquakeEvents(events: GlobeEarthquakeEvent[]) {
    disposeGroup(earthquakeGroup);

    const sorted = [...events].sort((a, b) => a.magnitude - b.magnitude);

    for (const event of sorted) {
      const [x, y, z] = latLonToUnitVector(event.lat, event.lon);
      surfaceNormal.set(x, y, z);
      const tier = magnitudeRenderTier(event.magnitude);
      const surfaceBoost = SURFACE_OFFSET * (1 + tier * 0.0015);
      surfacePosition.copy(surfaceNormal).multiplyScalar(EARTH_RADIUS * surfaceBoost);
      surfaceQuaternion.setFromUnitVectors(upVector, surfaceNormal);

      const feltKm = magnitudeToFeltRadiusKm(event.magnitude);
      const impactRadius = feltRadiusToGlobeUnits(feltKm) * EARTH_RADIUS * surfaceBoost;
      const ringOpacity = Math.min(0.2, 0.05 + event.magnitude * 0.018);
      const drawOrder = magnitudeRenderOrder(event.magnitude);

      const impact = new Mesh(
        new CircleGeometry(impactRadius, 28),
        new MeshBasicMaterial({
          color: new Color(event.color),
          transparent: true,
          opacity: ringOpacity,
          depthWrite: false,
          side: DoubleSide,
        })
      );
      impact.position.copy(surfacePosition);
      impact.quaternion.copy(surfaceQuaternion);
      impact.renderOrder = drawOrder;
      earthquakeGroup.add(impact);

      const dotRadius = 0.006 + Math.min(event.magnitude, 8) * 0.0012;
      const dot = new Mesh(
        new SphereGeometry(dotRadius, 8, 8),
        new MeshPhongMaterial({
          color: new Color(event.color),
          emissive: new Color(event.color),
          emissiveIntensity: 1.1,
          transparent: true,
          opacity: 0.95,
          depthWrite: false,
        })
      );
      dot.position.copy(surfacePosition);
      dot.renderOrder = drawOrder + 1;
      earthquakeGroup.add(dot);
    }
  }

  function setUserMarker(lat: number | null, lon: number | null) {
    disposeGroup(userMarkerGroup);
    if (lat == null || lon == null) return;

    userMarkerGroup.add(
      createMarkerMesh(
        { lat, lon, color: '#c4b5fd', size: 5, opacity: 1 },
        {
          surfaceBoost: 1.05,
          emissiveIntensity: 0.85,
          depthWrite: true,
          renderOrder: 20,
        }
      )
    );
  }

  function setAuroraOverlay(canvas: HTMLCanvasElement | null) {
    if (auroraShell) {
      earth.remove(auroraShell);
      auroraShell.geometry.dispose();
      (auroraShell.material as MeshBasicMaterial).dispose();
      auroraOverlayTexture?.dispose();
      auroraShell = null;
      auroraOverlayTexture = null;
    }

    if (!canvas) return;

    auroraOverlayTexture = new CanvasTexture(canvas);
    auroraOverlayTexture.colorSpace = SRGBColorSpace;

    auroraShell = new Mesh(
      new SphereGeometry(EARTH_RADIUS * 1.003, 64, 64),
      new MeshBasicMaterial({
        map: auroraOverlayTexture,
        transparent: true,
        opacity: 0.92,
        depthWrite: false,
        blending: AdditiveBlending,
      })
    );
    earth.add(auroraShell);
  }

  function resize() {
    const w = container.clientWidth;
    const h = container.clientHeight || 320;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);

  function dispose() {
    cancelAnimationFrame(animationId);
    clearResumeTimer();
    resizeObserver.disconnect();
    renderer.domElement.removeEventListener('pointerdown', onPointerDown);
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    if (enableZoom) {
      renderer.domElement.removeEventListener('wheel', onWheel);
    }
    earthMaterial.dispose();
    earthTexture.dispose();
    earth.geometry.dispose();
    if (auroraShell) {
      auroraShell.geometry.dispose();
      (auroraShell.material as MeshBasicMaterial).dispose();
      auroraOverlayTexture?.dispose();
    }
    renderer.dispose();
    container.removeChild(renderer.domElement);
  }

  return {
    setMarkers,
    setCityMarkers,
    setSpikes,
    setEarthquakeEvents,
    setUserMarker,
    setAuroraOverlay,
    dispose,
    setAutoRotate: (v: boolean) => {
      manuallyPaused = !v;
      clearResumeTimer();
      autoRotate = v;
    },
    setManuallyPaused: (paused: boolean) => {
      manuallyPaused = paused;
      clearResumeTimer();
      autoRotate = !paused;
    },
    isManuallyPaused: () => manuallyPaused,
  };
}

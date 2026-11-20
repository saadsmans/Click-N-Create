import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import gsap from 'gsap';
import { ServiceItem } from '../../data/services.ts';
import { buildCloudDescentDeck, CloudDeckBuildResult } from './cloudDeckBuilder.ts';
import { buildArchitecturalCity, CityBuildResult } from './cityBuilder.ts';
import { buildServiceHouses, HousesBuildResult } from './serviceHousesBuilder.ts';
import { detectQualityProfile, ExplorationPhase, HOUSE_TOUR_PROGRESS } from './types.ts';

export { HOUSE_TOUR_PROGRESS };

interface CityServicesViewportProps {
  services: ServiceItem[];
  scrollProgressRef: React.MutableRefObject<number>;
  selectedIndex: number | null;
  externalHoveredIndex?: number | null;
  onSelectHouse: (index: number) => void;
  onHoverHouse: (index: number | null) => void;
  onTourHouseChange?: (index: number | null) => void;
  onPhaseChange: (phase: ExplorationPhase) => void;
  isDarkMode: boolean;
  labelElementsRef: React.MutableRefObject<(HTMLButtonElement | null)[]>;
}

// Reusable scratch math objects allocated once at module scope (Zero GC inside render loop)
const _camPos = new THREE.Vector3();
const _camTarget = new THREE.Vector3();
const _targetPos = new THREE.Vector3();
const _targetLook = new THREE.Vector3();
const _projVec = new THREE.Vector3();
const _outCam = new THREE.Vector3();
const _doorCam = new THREE.Vector3();
const _outLook = new THREE.Vector3();
const _doorLook = new THREE.Vector3();
const _hPos = new THREE.Vector3();
const _hLook = new THREE.Vector3();
const _pointerNdc = new THREE.Vector2();
const _raycaster = new THREE.Raycaster();
const _bgColor = new THREE.Color();
const _cloudDayColor = new THREE.Color(0x6eb9fa);
const _cloudNightColor = new THREE.Color(0x3a2648);
const _cityDayColor = new THREE.Color(0x9bd2fc);
const _cityNightColor = new THREE.Color(0x281e3b);

/**
 * Cinema-Grade Optical Clarity & Filmic Finishing Shader:
 * - Contrast-adaptive micro-sharpening (razor-crisp skyscraper mullions, glass & architectural edges, zero ringing)
 * - Filmic warm-highlight / cool-shadow architectural split color grade
 * - Ultra-subtle radial corner optical chromatic realism (cinema anamorphic lens feel)
 * - Smooth optical vignette + sub-LSB dither to eliminate any 8-bit sky banding
 */
const OpticalClarityShader = {
  uniforms: {
    tDiffuse: { value: null },
    uResolution: { value: new THREE.Vector2(1920, 1080) },
    uSharpness: { value: 0.38 },
    uDarkMode: { value: 1.0 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform vec2 uResolution;
    uniform float uSharpness;
    uniform float uDarkMode;
    varying vec2 vUv;

    float ditherNoise(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453) - 0.5;
    }

    void main() {
      vec2 texel = 1.0 / max(uResolution, vec2(1.0));
      vec2 centered = vUv - 0.5;
      float r2 = dot(centered, centered);

      // Ultra-subtle cinema-lens radial corner dispersion (only noticeable at extreme outer frame edges)
      vec2 caOffset = centered * r2 * 0.0022;
      float rCh = texture2D(tDiffuse, vUv + caOffset).r;
      float gCh = texture2D(tDiffuse, vUv).g;
      float bCh = texture2D(tDiffuse, vUv - caOffset).b;
      vec3 c = vec3(rCh, gCh, bCh);

      vec3 n  = texture2D(tDiffuse, vUv + vec2(0.0, texel.y)).rgb;
      vec3 s  = texture2D(tDiffuse, vUv - vec2(0.0, texel.y)).rgb;
      vec3 e  = texture2D(tDiffuse, vUv + vec2(texel.x, 0.0)).rgb;
      vec3 w  = texture2D(tDiffuse, vUv - vec2(texel.x, 0.0)).rgb;

      // Contrast-adaptive unsharp clamping (crisp architectural edges with zero halo ringing)
      vec3 avg = (n + s + e + w) * 0.25;
      vec3 diff = clamp(c - avg, vec3(-0.085), vec3(0.085));
      vec3 sharp = clamp(c + diff * uSharpness * 2.2, 0.0, 1.0);

      // Filmic architectural micro-contrast S-curve
      vec3 sCurve = sharp * sharp * (3.0 - 2.0 * sharp);
      vec3 graded = mix(sharp, sCurve, 0.15);

      // Subtle architectural cinema split-tone (crisp daylight azure vs golden-hour twilight warmth)
      float luma = dot(graded, vec3(0.2126, 0.7152, 0.0722));
      vec3 shadowTint = mix(vec3(0.97, 0.99, 1.03), vec3(0.97, 0.94, 1.04), uDarkMode);
      vec3 highTint   = mix(vec3(1.02, 1.005, 0.985), vec3(1.04, 0.99, 0.94), uDarkMode);
      graded *= mix(shadowTint, highTint, smoothstep(0.18, 0.85, luma));

      // Gentle optical cinema lens vignette + sub-LSB dither to keep sky gradients silky-smooth
      float vig = 1.0 - r2 * mix(0.14, 0.22, uDarkMode);
      vec3 outCol = graded * vig + ditherNoise(vUv * uResolution) * (1.0 / 255.0);
      gl_FragColor = vec4(clamp(outCol, 0.0, 1.0), 1.0);
    }
  `,
};

// HOUSE_TOUR_PROGRESS imported and re-exported from ./types.ts above

interface CameraKeyframe {
  t: number; // normalized scroll t in [0, 1]
  pos: THREE.Vector3;
  look: THREE.Vector3;
}

const CITY_KEYFRAMES: CameraKeyframe[] = [
  // 0.00 -> Start ultra-high & deep ABOVE the 5-strata volumetric cloud ocean!
  { t: 0.0, pos: new THREE.Vector3(0, 392, 365), look: new THREE.Vector3(0, 26, 48) },
  // 0.07 -> Diving deep through the luminous upper cloud canyons
  { t: 0.07, pos: new THREE.Vector3(18, 302, 318), look: new THREE.Vector3(0, 25, 52) },
  // 0.15 -> Plunging through the thick parting mid-deck volumetric cumulus chasm
  { t: 0.15, pos: new THREE.Vector3(44, 214, 268), look: new THREE.Vector3(0, 22, 50) },
  // 0.23 -> Breaking cleanly beneath the cloud base into a sweeping Whole-City Riverside Overlook (100% clear of all skyscrapers!)
  { t: 0.23, pos: new THREE.Vector3(86, 128, 228), look: new THREE.Vector3(-8, 24, 56) },
  // 0.32 -> Wide helicopter panoramic arc completely outside the skyline perimeter (z >= 212 vs max tower z = 175 -> ZERO collision!)
  // Frames the stepped supertall spire cluster, lush green riverbanks, reflective river & illuminated multi-arch bridges!
  { t: 0.32, pos: new THREE.Vector3(-68, 96, 214), look: new THREE.Vector3(-4, 22, 58) },
  // 0.38 -> Aligning dead-center into the open downtown sky corridor above Gateway 1
  { t: 0.38, pos: new THREE.Vector3(0, 66, 178), look: new THREE.Vector3(0, 24, 72) },
  // 0.42 -> Sweeping cleanly UNDER Gateway 1 Skybridge (bridge bottom y=43.2) down the center corridor
  { t: 0.42, pos: new THREE.Vector3(0, 32, 146), look: new THREE.Vector3(0, 14, 70) },
  // 0.46 -> Sweeping cleanly UNDER Gateway 2 Skybridge (y=30.2) down the open downtown sky corridor
  { t: 0.46, pos: new THREE.Vector3(0, 12.2, 110), look: new THREE.Vector3(0, 7.2, 58) },
  // 0.49 -> Serene car-free landscaped waterfront boulevard lined with stone planters, emerald hedges & lamps
  { t: 0.49, pos: new THREE.Vector3(0, 4.6, 82), look: new THREE.Vector3(0, 4.0, 40) },
  // 0.53 -> Gliding across the illuminated Multi-Arch Stone & Steel River Bridge over mirror-reflective water
  { t: 0.53, pos: new THREE.Vector3(0.6, 4.9, 54), look: new THREE.Vector3(0, 3.8, 4) },
  // 0.565 -> Entering the Grand Residential Crescent Park with wide panoramic framing
  { t: 0.565, pos: new THREE.Vector3(-4.5, 8.2, 16.5), look: new THREE.Vector3(-26.0, 4.2, -18.0) },
  // 0.60 -> TURN-BY-TURN STOP 1: House 01 (E-Commerce Solutions · 26.8m spacious architectural framing)
  { t: 0.6, pos: new THREE.Vector3(-7.15, 7.2, -10.37), look: new THREE.Vector3(-32.0, 4.3, -20.4) },
  // 0.66 -> TURN-BY-TURN STOP 2: House 02 (Web Development · 26.8m spacious architectural framing)
  { t: 0.66, pos: new THREE.Vector3(-5.01, 7.4, -13.28), look: new THREE.Vector3(-22.6, 4.5, -33.5) },
  // 0.72 -> TURN-BY-TURN STOP 3: House 03 (Branding & Design · 26.8m spacious architectural framing)
  { t: 0.72, pos: new THREE.Vector3(-1.88, 7.3, -14.99), look: new THREE.Vector3(-8.35, 4.2, -41.0) },
  // 0.78 -> TURN-BY-TURN STOP 4: House 04 (Digital Marketing · 26.8m spacious architectural framing)
  { t: 0.78, pos: new THREE.Vector3(1.88, 7.3, -14.99), look: new THREE.Vector3(8.35, 4.5, -41.0) },
  // 0.84 -> TURN-BY-TURN STOP 5: House 05 (Web Application Development · 26.8m spacious architectural framing)
  { t: 0.84, pos: new THREE.Vector3(5.01, 7.4, -13.28), look: new THREE.Vector3(22.6, 4.5, -33.5) },
  // 0.90 -> TURN-BY-TURN STOP 6: House 06 (Hosting & Maintenance · 26.8m spacious architectural framing)
  { t: 0.9, pos: new THREE.Vector3(7.15, 7.2, -10.37), look: new THREE.Vector3(32.0, 4.3, -20.4) },
  // 1.00 -> Grand Finale Crescent Panorama overlooking all 6 Ultra-Luxury Modern Residences & Riverside Metropolis
  { t: 1.0, pos: new THREE.Vector3(0, 16.0, 31.0), look: new THREE.Vector3(0, 4.5, -26.0) },
];

/**
 * Evaluates a smooth Catmull-Rom spline parameterized directly by our exact keyframe `t` timestamps
 * so each house tour stop occurs at its exact scheduled scroll progress without arc-length drift!
 */
function sampleCityTrajectory(
  scrollT: number,
  outPos: THREE.Vector3,
  outLook: THREE.Vector3
) {
  const clamped = THREE.MathUtils.clamp(scrollT, 0, 1);
  let i = 0;
  while (i < CITY_KEYFRAMES.length - 2 && clamped > CITY_KEYFRAMES[i + 1].t) {
    i++;
  }
  const k0 = CITY_KEYFRAMES[Math.max(0, i - 1)];
  const k1 = CITY_KEYFRAMES[i];
  const k2 = CITY_KEYFRAMES[i + 1];
  const k3 = CITY_KEYFRAMES[Math.min(CITY_KEYFRAMES.length - 1, i + 2)];

  const segSpan = Math.max(0.0001, k2.t - k1.t);
  const u = THREE.MathUtils.clamp((clamped - k1.t) / segSpan, 0, 1);
  // Subtle ease inside each house segment so the camera lingers gently as it frames each architectural facade
  const s = i >= 10 && i <= 16 ? THREE.MathUtils.lerp(u, u * u * (3 - 2 * u), 0.35) : u;
  const s2 = s * s;
  const s3 = s2 * s;

  const catmull = (p0: number, p1: number, p2: number, p3: number) =>
    0.5 *
    (2 * p1 +
      (-p0 + p2) * s +
      (2 * p0 - 5 * p1 + 4 * p2 - p3) * s2 +
      (-p0 + 3 * p1 - 3 * p2 + p3) * s3);

  outPos.set(
    catmull(k0.pos.x, k1.pos.x, k2.pos.x, k3.pos.x),
    catmull(k0.pos.y, k1.pos.y, k2.pos.y, k3.pos.y),
    catmull(k0.pos.z, k1.pos.z, k2.pos.z, k3.pos.z)
  );
  outLook.set(
    catmull(k0.look.x, k1.look.x, k2.look.x, k3.look.x),
    catmull(k0.look.y, k1.look.y, k2.look.y, k3.look.y),
    catmull(k0.look.z, k1.look.z, k2.look.z, k3.look.z)
  );
}

export const CityServicesViewport: React.FC<CityServicesViewportProps> = ({
  services,
  scrollProgressRef,
  selectedIndex,
  externalHoveredIndex = null,
  onSelectHouse,
  onHoverHouse,
  onTourHouseChange,
  onPhaseChange,
  isDarkMode,
  labelElementsRef,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webglFailed, setWebglFailed] = useState(false);

  const selectedRef = useRef<number | null>(selectedIndex);
  const hoveredRef = useRef<number | null>(null);
  const tourHouseRef = useRef<number | null>(null);
  const externalHoveredRef = useRef<number | null>(externalHoveredIndex);
  externalHoveredRef.current = externalHoveredIndex;
  const isDarkRef = useRef<boolean>(isDarkMode);
  isDarkRef.current = isDarkMode;

  const callbacksRef = useRef({
    onSelectHouse,
    onHoverHouse,
    onTourHouseChange,
    onPhaseChange,
  });
  callbacksRef.current = { onSelectHouse, onHoverHouse, onTourHouseChange, onPhaseChange };

  const sequenceStateRef = useRef({
    blend: 0,
    approachT: 0,
    dimFactor: 1,
    activeHouseIndex: -1,
  });

  const houseRefsStore = useRef<HousesBuildResult['houses']>([]);
  const activeTimelineRef = useRef<gsap.core.Timeline | null>(null);

  const sceneThemeControlRef = useRef<{
    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    hemiLight: THREE.HemisphereLight;
    keyLight: THREE.DirectionalLight;
    rimLight: THREE.DirectionalLight;
    plazaFillLight: THREE.PointLight;
    bloomPass: UnrealBloomPass | null;
    clarityPass: ShaderPass | null;
    skyBackdropUniforms: { uIsDark: { value: number } };
    cloudDeckResult: CloudDeckBuildResult;
    cityResult: CityBuildResult;
    housesResult: HousesBuildResult;
    baseKeyIntensity: number;
    baseHemiIntensity: number;
  } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Software WebGL probe
    let isSoftwareGl = false;
    try {
      const probeCanvas = document.createElement('canvas');
      const gl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
      if (!gl) {
        setWebglFailed(true);
        return;
      }
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const rendererParam = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(rendererParam));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      isSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    } catch {
      setWebglFailed(true);
      return;
    }

    const quality = detectQualityProfile(isSoftwareGl);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: quality.antialias,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglFailed(true);
      return;
    }

    const initDark = isDarkRef.current;
    const initW = container.clientWidth || window.innerWidth;
    const initH = container.clientHeight || window.innerHeight;

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.AgXToneMapping;
    renderer.toneMappingExposure = initDark ? 1.12 : 1.05;
    renderer.setPixelRatio(quality.pixelRatio);
    renderer.setSize(initW, initH);
    renderer.shadowMap.enabled = quality.shadowsEnabled;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    if (quality.shadowsEnabled) {
      renderer.shadowMap.autoUpdate = false;
      renderer.shadowMap.needsUpdate = true;
    }
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    // 2. Clean Scene starting ultra-high ABOVE the 5-strata volumetric cloud ocean (No HDR environment map)
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(initDark ? 0x281e3b : 0x7ac0fa);
    scene.fog = new THREE.Fog(initDark ? 0x2a1f3d : 0xa5d5fc, 340, 1180);

    const camera = new THREE.PerspectiveCamera(44, initW / initH, 0.25, 1620);
    camera.position.set(0, 392, 365);

    // Lightweight Atmospheric Sky Gradient Backdrop (Pure visual sky gradient & setting sun disc — NO HDR envMap!)
    const skyBackdropUniforms = {
      uIsDark: { value: initDark ? 1.0 : 0.0 },
    };
    const skyBackdropGeo = new THREE.SphereGeometry(1320, 32, 20);
    const skyBackdropMat = new THREE.ShaderMaterial({
      uniforms: skyBackdropUniforms,
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      vertexShader: /* glsl */ `
        varying vec3 vWorldDir;
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWorldDir = normalize(position);
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uIsDark;
        varying vec3 vWorldDir;

        void main() {
          vec3 dir = normalize(vWorldDir);
          float h = clamp(dir.y, -0.15, 1.0);
          float elev = clamp(dir.y, 0.0, 1.0);

          // LIGHT MODE: Crisp bright azure sky matching reference daytime photo!
          vec3 dayHorizon = vec3(0.78, 0.90, 1.0);
          vec3 dayMid     = vec3(0.38, 0.71, 0.98);
          vec3 dayZenith  = vec3(0.16, 0.50, 0.91);
          vec3 daySky = mix(dayHorizon, dayMid, smoothstep(0.0, 0.28, elev));
          daySky = mix(daySky, dayZenith, smoothstep(0.24, 0.78, elev));
          vec3 daySunDir = normalize(vec3(0.45, 0.48, -0.75));
          float daySunAmt = max(0.0, dot(dir, daySunDir));
          daySky += vec3(1.0, 0.98, 0.92) * pow(daySunAmt, 24.0) * 0.28;

          // DARK / SUNSET MODE: Exact golden-hour twilight gradient from the user's sunset photo!
          // Blazing apricot-orange horizon -> coral-rose -> dusty plum -> deep violet-indigo zenith
          vec3 sunHorizon = vec3(1.0, 0.49, 0.16);
          vec3 sunCoral   = vec3(0.86, 0.34, 0.27);
          vec3 sunPlum    = vec3(0.39, 0.25, 0.43);
          vec3 sunZenith  = vec3(0.12, 0.11, 0.24);

          vec3 sunsetSky = mix(sunHorizon, sunCoral, smoothstep(0.0, 0.14, elev));
          sunsetSky = mix(sunsetSky, sunPlum, smoothstep(0.12, 0.34, elev));
          sunsetSky = mix(sunsetSky, sunZenith, smoothstep(0.30, 0.76, elev));

          // Low glowing golden setting sun disc right above the distant skyline horizon!
          vec3 sunsetSunDir = normalize(vec3(0.18, 0.068, -0.98));
          float sunDot = max(0.0, dot(dir, sunsetSunDir));
          float sunDisc = smoothstep(0.99915, 0.99968, sunDot);
          float sunHalo = pow(sunDot, 18.0) * 0.62 + pow(sunDot, 5.0) * 0.26;
          sunsetSky += vec3(1.0, 0.62, 0.22) * sunHalo;
          sunsetSky = mix(sunsetSky, vec3(1.0, 0.96, 0.72), sunDisc);

          // Soft below-horizon atmospheric fade
          vec3 belowCol = mix(vec3(0.72, 0.85, 0.98), vec3(0.16, 0.13, 0.26), uIsDark);
          vec3 skyCol = mix(daySky, sunsetSky, uIsDark);
          skyCol = mix(belowCol, skyCol, smoothstep(-0.12, 0.02, h));

          gl_FragColor = vec4(skyCol, 1.0);
        }
      `,
    });
    const skyBackdropMesh = new THREE.Mesh(skyBackdropGeo, skyBackdropMat);
    skyBackdropMesh.frustumCulled = false;
    skyBackdropMesh.renderOrder = -10;
    scene.add(skyBackdropMesh);

    // 3. Build Volumetric Cumulus Cloud Descent Deck + Photorealistic Riverside Metropolis + 6 Bespoke Service Houses
    const maxAniso = renderer.capabilities.getMaxAnisotropy();

    const cloudDeckResult = buildCloudDescentDeck(initDark);
    scene.add(cloudDeckResult.group);

    const cityResult = buildArchitecturalCity(quality, maxAniso, initDark);
    scene.add(cityResult.group);

    // 4. Balanced Architectural Direct Lighting Rig (Bright Sunlit Day vs Golden-Hour Sunset Twilight)
    const hemiLight = new THREE.HemisphereLight(
      initDark ? 0x78568c : 0xa6d8ff,
      initDark ? 0x2c1b28 : 0x5c804e,
      initDark ? 1.24 : 1.56
    );
    scene.add(hemiLight);

    const keyLightOffset = new THREE.Vector3(68, initDark ? 34 : 58, initDark ? -64 : 52);
    const keyLight = new THREE.DirectionalLight(
      initDark ? 0xff9b52 : 0xfff8ec,
      initDark ? 2.55 : 3.55
    );
    keyLight.position.copy(keyLightOffset);
    keyLight.target.position.set(0, 0, 0);
    scene.add(keyLight.target);
    keyLight.castShadow = quality.shadowsEnabled;
    if (quality.shadowsEnabled) {
      const shadowRes = Math.min(4096, quality.shadowMapSize);
      keyLight.shadow.mapSize.set(shadowRes, shadowRes);
      keyLight.shadow.camera.near = 10;
      keyLight.shadow.camera.far = 250;
      const d = 48;
      keyLight.shadow.camera.left = -d;
      keyLight.shadow.camera.right = d;
      keyLight.shadow.camera.top = d;
      keyLight.shadow.camera.bottom = -d;
      keyLight.shadow.bias = -0.00025;
      keyLight.shadow.normalBias = 0.018;
      keyLight.shadow.radius = 2.0;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(
      initDark ? 0xff703d : 0x90ccff,
      initDark ? 1.05 : 0.84
    );
    rimLight.position.set(-54, 38, -60);
    scene.add(rimLight);

    const plazaFillLight = new THREE.PointLight(0xffbe5c, initDark ? 2.8 : 0.0, 58, 1.45);
    plazaFillLight.position.set(0, 7.5, -7.5);
    scene.add(plazaFillLight);

    const housesResult = buildServiceHouses(services, quality, maxAniso, isSoftwareGl, initDark);
    scene.add(housesResult.group);
    houseRefsStore.current = housesResult.houses;

    // 5. GPU-Only Max-Hardware MSAA Post-Processing + Optical Contrast-Adaptive Micro-Sharpening Pass
    let composer: EffectComposer | null = null;
    let bloomPass: UnrealBloomPass | null = null;
    let clarityPass: ShaderPass | null = null;
    let msaaRenderTarget: THREE.WebGLRenderTarget | null = null;

    if (!isSoftwareGl && quality.tier !== 'mobile') {
      const isWebGL2 = renderer.capabilities.isWebGL2;
      const pr = renderer.getPixelRatio();
      const maxSamples = Math.min(4, renderer.capabilities.maxSamples || 4);
      msaaRenderTarget = new THREE.WebGLRenderTarget(
        Math.max(1, Math.floor(initW * pr)),
        Math.max(1, Math.floor(initH * pr)),
        {
          type: THREE.HalfFloatType,
          samples: isWebGL2 ? maxSamples : 0,
        }
      );

      composer = new EffectComposer(renderer, msaaRenderTarget);
      composer.setPixelRatio(pr);
      composer.setSize(initW, initH);

      const renderPass = new RenderPass(scene, camera);
      composer.addPass(renderPass);

      // True HDR Selective Specular Bloom: in Day mode threshold 1.28 blooms ONLY true sunlit HDR glints off glass & water!
      bloomPass = new UnrealBloomPass(
        new THREE.Vector2(initW, initH),
        initDark ? 0.28 : 0.14,
        initDark ? 0.26 : 0.28,
        initDark ? 0.95 : 1.28
      );
      composer.addPass(bloomPass);

      const outputPass = new OutputPass();
      composer.addPass(outputPass);

      clarityPass = new ShaderPass(OpticalClarityShader);
      clarityPass.uniforms.uResolution.value.set(
        Math.max(1, Math.floor(initW * pr)),
        Math.max(1, Math.floor(initH * pr))
      );
      clarityPass.uniforms.uDarkMode.value = initDark ? 1.0 : 0.0;
      composer.addPass(clarityPass);
    }

    sceneThemeControlRef.current = {
      scene,
      renderer,
      hemiLight,
      keyLight,
      rimLight,
      plazaFillLight,
      bloomPass,
      clarityPass,
      skyBackdropUniforms,
      cloudDeckResult,
      cityResult,
      housesResult,
      baseKeyIntensity: initDark ? 2.55 : 3.55,
      baseHemiIntensity: initDark ? 1.24 : 1.56,
    };

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // 6. Pointer Parallax & Raycasting Handlers
    let pointerX = 0;
    let pointerY = 0;
    let lastRaycastTime = 0;
    let isPointerDown = false;
    let downX = 0;
    let downY = 0;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      pointerX = nx;
      pointerY = ny;

      const now = performance.now();
      if (
        now - lastRaycastTime < 34 ||
        scrollProgressRef.current < 0.48 ||
        selectedRef.current !== null
      ) {
        return;
      }
      lastRaycastTime = now;

      _pointerNdc.set(nx, ny);
      _raycaster.setFromCamera(_pointerNdc, camera);
      const hits = _raycaster.intersectObjects(housesResult.hitboxes, false);
      const hitIdx = hits.length > 0 ? (hits[0].object.userData.serviceIndex as number) : null;
      if (hitIdx !== hoveredRef.current) {
        hoveredRef.current = hitIdx;
        callbacksRef.current.onHoverHouse(hitIdx);
        renderer.domElement.style.cursor = hitIdx !== null ? 'pointer' : 'grab';
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      isPointerDown = true;
      downX = e.clientX;
      downY = e.clientY;
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (!isPointerDown) return;
      isPointerDown = false;
      if (Math.hypot(e.clientX - downX, e.clientY - downY) > 8) return;
      if (!housesResult.group.visible) return;

      const rect = renderer.domElement.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      _pointerNdc.set(nx, ny);
      _raycaster.setFromCamera(_pointerNdc, camera);
      const hits = _raycaster.intersectObjects(housesResult.hitboxes, false);
      if (hits.length > 0) {
        const hitIdx = hits[0].object.userData.serviceIndex as number;
        if (typeof hitIdx === 'number') {
          callbacksRef.current.onSelectHouse(hitIdx);
        }
      }
    };

    renderer.domElement.addEventListener('pointermove', handlePointerMove, { passive: true });
    renderer.domElement.addEventListener('pointerdown', handlePointerDown, { passive: true });
    renderer.domElement.addEventListener('pointerup', handlePointerUp, { passive: true });

    // 7. Resize & Context Guards
    let width = initW;
    let height = initH;
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      if (composer) {
        composer.setSize(width, height);
      }
      if (bloomPass) {
        bloomPass.resolution.set(width, height);
      }
      if (clarityPass) {
        const pr = renderer.getPixelRatio();
        clarityPass.uniforms.uResolution.value.set(
          Math.max(1, Math.floor(width * pr)),
          Math.max(1, Math.floor(height * pr))
        );
      }
    };
    window.addEventListener('resize', handleResize);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
    };
    const handleContextRestored = () => {
      tick();
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored);

    sampleCityTrajectory(scrollProgressRef.current, _camPos, _camTarget);
    camera.position.copy(_camPos);
    camera.lookAt(_camTarget);

    // 8. Zero-GC Animation Loop (Volumetric Cloud Descent -> UK City Drive -> River Bridge -> Turn-by-Turn 6 Houses Tour!)
    let frameId = 0;
    let disposed = false;
    let prevTime = performance.now();
    const startTime = prevTime;
    let dampedParallaxX = 0;
    let dampedParallaxY = 0;
    let dampedBank = 0;
    let prevCamX = _camPos.x;
    let lastShadowFocusX = Number.NaN;
    let lastShadowFocusZ = Number.NaN;
    let isViewportVisible = true;
    let isPageVisible = typeof document !== 'undefined' ? document.visibilityState === 'visible' : true;

    const resumeLoopIfActive = () => {
      if (disposed || !isViewportVisible || !isPageVisible) return;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      prevTime = performance.now();
      frameId = requestAnimationFrame(tick);
    };

    const viewportObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const nextVisible = Boolean(entry && entry.isIntersecting);
        if (nextVisible !== isViewportVisible) {
          isViewportVisible = nextVisible;
          if (nextVisible) resumeLoopIfActive();
        }
      },
      { threshold: 0.01 }
    );
    viewportObserver.observe(container);

    const handleVisibilityChange = () => {
      isPageVisible = document.visibilityState === 'visible';
      if (isPageVisible) resumeLoopIfActive();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    function afterDraw(cb: () => void) {
      if (disposed) return;
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (gl && typeof gl.fenceSync === 'function') {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (disposed) {
            if (sync) gl.deleteSync(sync);
            return;
          }
          const state = sync ? gl.getSyncParameter(sync, gl.SYNC_STATUS) : gl.SIGNALED;
          if (state === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 80);
          }
        };
        frameId = window.setTimeout(poll, 5);
      } else {
        frameId = window.setTimeout(cb, 80);
      }
    }

    function tick() {
      if (disposed || !isViewportVisible || !isPageVisible) return;
      const now = performance.now();
      const dt = Math.min(0.05, Math.max(0.001, (now - prevTime) / 1000));
      const elapsed = (now - startTime) / 1000;
      prevTime = now;

      dampedParallaxX = THREE.MathUtils.damp(dampedParallaxX, pointerX, 4.5, dt);
      dampedParallaxY = THREE.MathUtils.damp(dampedParallaxY, pointerY, 4.5, dt);

      const t = THREE.MathUtils.clamp(scrollProgressRef.current, 0, 1);
      const seq = sequenceStateRef.current;
      const darkNow = isDarkRef.current;

      // Continuous Cloud Descent -> High-Tech Metropolis -> River Bridge -> Spacious 6-House Tour!
      sampleCityTrajectory(t, _targetPos, _targetLook);

      const skyExit = THREE.MathUtils.smoothstep(t, 0.06, 0.25);

      // Smooth atmospheric fog blend as camera descends deep from above the clouds into the whole-city panorama (0.06 -> 0.25)
      _bgColor
        .copy(darkNow ? _cloudNightColor : _cloudDayColor)
        .lerp(darkNow ? _cityNightColor : _cityDayColor, skyExit);
      scene.background = _bgColor;
      if (scene.fog) {
        scene.fog.color.copy(_bgColor);
      }

      // Cinematic Focal-Length Choreography:
      // Wide dramatic 50deg aerial panorama -> spacious 48deg architectural wide lens on 6 Houses -> 54deg interior room lens!
      const aerialWide = t < 0.54 ? Math.sin((t / 0.54) * Math.PI) * 5.8 + (1.0 - skyExit) * 3.4 : 0;
      const houseWide =
        t > 0.54 ? THREE.MathUtils.smoothstep(t, 0.54, 0.6) * 4.0 : 0;
      const baseInteriorTargetFov = camera.aspect < 0.85 ? 64.0 : 54.5;
      const interiorFov = THREE.MathUtils.lerp(46.5, baseInteriorTargetFov, seq.approachT);
      const desiredFov = THREE.MathUtils.lerp(44 + aerialWide + houseWide, interiorFov, seq.blend);
      if (Math.abs(camera.fov - desiredFov) > 0.04) {
        camera.fov = THREE.MathUtils.damp(camera.fov, desiredFov, 4.8, dt);
        camera.updateProjectionMatrix();
      }

      // Organic cinema-drone / steadicam micro-breathing (attenuated cleanly when opening a house door)
      const breatheAmp = (1.0 - seq.blend) * THREE.MathUtils.lerp(0.14, 0.045, skyExit);
      _targetPos.x += Math.sin(elapsed * 0.65) * breatheAmp;
      _targetPos.y += Math.cos(elapsed * 0.85) * breatheAmp * 0.65;

      const parallaxAmp = seq.blend > 0.5 ? 0.62 : THREE.MathUtils.lerp(1.65, 0.72, t);
      _targetPos.x += dampedParallaxX * parallaxAmp;
      _targetPos.y += dampedParallaxY * (parallaxAmp * 0.28);

      // Smoothly glide from tour view -> front steps -> open doorway threshold when user opens a house
      if (
        seq.blend > 0.001 &&
        seq.activeHouseIndex >= 0 &&
        houseRefsStore.current[seq.activeHouseIndex]
      ) {
        const house = houseRefsStore.current[seq.activeHouseIndex];
        _outCam.set(...house.outsideCameraLocal).applyMatrix4(house.root.matrixWorld);
        _doorCam.set(...house.doorwayCameraLocal).applyMatrix4(house.root.matrixWorld);
        _outLook.set(...house.outsideLookAtLocal).applyMatrix4(house.root.matrixWorld);
        _doorLook.set(...house.doorwayLookAtLocal).applyMatrix4(house.root.matrixWorld);

        _hPos.copy(_outCam).lerp(_doorCam, seq.approachT);
        _hLook.copy(_outLook).lerp(_doorLook, seq.approachT);

        _targetPos.lerp(_hPos, seq.blend);
        _targetLook.lerp(_hLook, seq.blend);
      }

      const camDamp = seq.blend > 0.01 ? 8.5 : 6.4;
      _camPos.x = THREE.MathUtils.damp(_camPos.x, _targetPos.x, camDamp, dt);
      _camPos.y = THREE.MathUtils.damp(_camPos.y, _targetPos.y, camDamp, dt);
      _camPos.z = THREE.MathUtils.damp(_camPos.z, _targetPos.z, camDamp, dt);

      _camTarget.x = THREE.MathUtils.damp(_camTarget.x, _targetLook.x, camDamp, dt);
      _camTarget.y = THREE.MathUtils.damp(_camTarget.y, _targetLook.y, camDamp, dt);
      _camTarget.z = THREE.MathUtils.damp(_camTarget.z, _targetLook.z, camDamp, dt);

      // Dynamic Cinematic Aerial Banking: gently rolls into sweeping high-altitude turns, levels cleanly to 0deg at street/houses!
      const lateralVel = (_camPos.x - prevCamX) / dt;
      prevCamX = _camPos.x;
      const aerialMask =
        seq.blend < 0.05
          ? THREE.MathUtils.smoothstep(t, 0.04, 0.16) * (1.0 - THREE.MathUtils.smoothstep(t, 0.42, 0.54))
          : 0;
      const targetBank = THREE.MathUtils.clamp(
        (-lateralVel * 0.0018 - dampedParallaxX * 0.014) * aerialMask,
        -0.042,
        0.042
      );
      dampedBank = THREE.MathUtils.damp(dampedBank, targetBank, 4.0, dt);

      // Determine which of the 6 Service Houses is currently being visited turn-by-turn!
      let nearestHouse: number | null = null;
      if (t >= 0.56 && t <= 0.95 && seq.blend < 0.2) {
        let bestDist = 0.036;
        for (let hIdx = 0; hIdx < HOUSE_TOUR_PROGRESS.length; hIdx++) {
          const d = Math.abs(t - HOUSE_TOUR_PROGRESS[hIdx]);
          if (d < bestDist) {
            bestDist = d;
            nearestHouse = hIdx;
          }
        }
      }
      if (nearestHouse !== tourHouseRef.current) {
        tourHouseRef.current = nearestHouse;
        callbacksRef.current.onTourHouseChange?.(nearestHouse);
      }

      // Dynamic camera-focus shadow frustum updated only when focus shifts or a house door animates
      if (quality.shadowsEnabled) {
        const focusZ = Math.round(THREE.MathUtils.clamp(_camTarget.z, -44, 115) * 0.5) * 2;
        const focusX = Math.round(THREE.MathUtils.clamp(_camTarget.x, -36, 36) * 0.5) * 2;
        if (focusX !== lastShadowFocusX || focusZ !== lastShadowFocusZ || seq.blend > 0.005) {
          lastShadowFocusX = focusX;
          lastShadowFocusZ = focusZ;
          keyLight.target.position.set(focusX, 0, focusZ);
          keyLight.position.set(
            focusX + keyLightOffset.x,
            keyLightOffset.y,
            focusZ + keyLightOffset.z
          );
          keyLight.target.updateMatrixWorld();
          renderer.shadowMap.needsUpdate = true;
        }
      }

      // Synchronize ambient & directional light dimming when focused on an open house door
      const themeCtrl = sceneThemeControlRef.current;
      const baseKey = themeCtrl ? themeCtrl.baseKeyIntensity : 1.32;
      const baseHemi = themeCtrl ? themeCtrl.baseHemiIntensity : 0.72;
      keyLight.intensity = THREE.MathUtils.damp(keyLight.intensity, baseKey * seq.dimFactor, 5, dt);
      hemiLight.intensity = THREE.MathUtils.damp(
        hemiLight.intensity,
        baseHemi * seq.dimFactor,
        5,
        dt
      );

      const activeIdx = selectedRef.current;
      const hoverIdx =
        hoveredRef.current !== null ? hoveredRef.current : externalHoveredRef.current;

      const placedMobileLabelsX: number[] = [];
      housesResult.houses.forEach((house, idx) => {
        const isSelected = activeIdx === idx;
        const isHovered = hoverIdx === idx;
        const isTourFocus = tourHouseRef.current === idx;

        const targetHighlight = isSelected ? 0.72 : isHovered || isTourFocus ? 0.5 : 0.0;
        const basePorch = darkNow ? 2.1 : 0.2;
        const targetPorch = isSelected
          ? 3.1
          : isHovered || isTourFocus
            ? darkNow
              ? 2.85
              : 0.75
            : basePorch;

        house.highlightRingMat.emissiveIntensity = THREE.MathUtils.damp(
          house.highlightRingMat.emissiveIntensity,
          targetHighlight,
          6,
          dt
        );
        house.porchLight.intensity = THREE.MathUtils.damp(
          house.porchLight.intensity,
          targetPorch,
          6,
          dt
        );

        // Project crisp compact architectural rooftop markers during the 6-house tour & neighborhood panorama
        const labelEl = labelElementsRef.current[idx];
        if (labelEl) {
          const showLabels = t > 0.54 && seq.blend < 0.25;
          if (!showLabels) {
            labelEl.style.opacity = '0';
            labelEl.style.pointerEvents = 'none';
          } else {
            _projVec.set(...house.labelAnchorLocal).applyMatrix4(house.root.matrixWorld);
            _projVec.project(camera);
            if (_projVec.z < 1 && _projVec.z > -1) {
              const isCompactViewport = width < 640;
              const marginX = isCompactViewport ? 64 : 76;
              const rawSx = (_projVec.x * 0.5 + 0.5) * width;
              const sy = (-_projVec.y * 0.5 + 0.5) * height;
              const inBounds =
                rawSx > 8 && rawSx < width - 8 && sy > 70 && sy < height - 115;
              const sx = THREE.MathUtils.clamp(rawSx, marginX, width - marginX);

              // On narrow mobile screens, prevent adjacent rooftop labels from colliding horizontally
              const isNeighborDuringMobileTour =
                isCompactViewport &&
                tourHouseRef.current !== null &&
                !isTourFocus &&
                !isHovered;

              let overlapsPrev = false;
              if (isCompactViewport && inBounds && !isNeighborDuringMobileTour && !isTourFocus && !isHovered) {
                for (let p = 0; p < placedMobileLabelsX.length; p++) {
                  if (Math.abs(sx - placedMobileLabelsX[p]) < 126) {
                    overlapsPrev = true;
                    break;
                  }
                }
              }

              const hiddenOnMobile = isNeighborDuringMobileTour || overlapsPrev;
              if (inBounds && !hiddenOnMobile && isCompactViewport) {
                placedMobileLabelsX.push(sx);
              }

              const scaleStr = hiddenOnMobile ? ' scale(0.86)' : '';
              labelEl.style.transform = `translate3d(${sx}px, ${sy}px, 0) translate(-50%, -100%)${scaleStr}`;
              const emphasis = hiddenOnMobile
                ? 0.0
                : tourHouseRef.current === null || isTourFocus || isHovered
                  ? 1.0
                  : 0.9;
              const labelFade = THREE.MathUtils.smoothstep(t, 0.535, 0.565);
              const finalOpacity = inBounds ? labelFade * emphasis : 0;
              labelEl.style.opacity = String(finalOpacity);
              labelEl.style.pointerEvents = finalOpacity > 0.2 ? 'auto' : 'none';
            } else {
              labelEl.style.opacity = '0';
              labelEl.style.pointerEvents = 'none';
            }
          }
        }
      });

      cityResult.updateCity(elapsed, dt);

      camera.position.copy(_camPos);
      camera.lookAt(_camTarget);
      if (Math.abs(dampedBank) > 0.0002) {
        camera.rotateZ(dampedBank);
      }

      // Keep sky backdrop centered on camera so horizon never parallax-shifts
      skyBackdropMesh.position.copy(camera.position);

      // Update volumetric cumulus clouds & passing cloud-base mist
      cloudDeckResult.update(elapsed, t, camera.position, camera.quaternion);

      if (composer) {
        composer.render();
      } else {
        renderer.render(scene, camera);
      }

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    frameId = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      sceneThemeControlRef.current = null;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      viewportObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('pointerup', handlePointerUp);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored);

      skyBackdropGeo.dispose();
      skyBackdropMat.dispose();
      cloudDeckResult.dispose();
      cityResult.dispose();
      housesResult.dispose();
      if (composer) composer.dispose();
      if (msaaRenderTarget) msaaRenderTarget.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [services.length]);

  // Instant Bright Azure Day <-> Golden-Hour Sunset Twilight Theme Switcher
  useEffect(() => {
    const ctrl = sceneThemeControlRef.current;
    if (!ctrl) return;

    ctrl.renderer.toneMappingExposure = isDarkMode ? 1.12 : 1.06;
    ctrl.skyBackdropUniforms.uIsDark.value = isDarkMode ? 1.0 : 0.0;

    ctrl.hemiLight.color.setHex(isDarkMode ? 0x78568c : 0xa6d8ff);
    ctrl.hemiLight.groundColor.setHex(isDarkMode ? 0x2c1b28 : 0x5c804e);
    ctrl.baseHemiIntensity = isDarkMode ? 1.24 : 1.56;

    ctrl.keyLight.color.setHex(isDarkMode ? 0xff9b52 : 0xfff8ec);
    ctrl.baseKeyIntensity = isDarkMode ? 2.55 : 3.55;

    ctrl.rimLight.color.setHex(isDarkMode ? 0xff703d : 0x90ccff);
    ctrl.rimLight.intensity = isDarkMode ? 1.05 : 0.84;

    ctrl.plazaFillLight.color.setHex(0xffbe5c);
    ctrl.plazaFillLight.intensity = isDarkMode ? 2.8 : 0.0;

    if (ctrl.bloomPass) {
      ctrl.bloomPass.strength = isDarkMode ? 0.34 : 0.14;
      ctrl.bloomPass.radius = isDarkMode ? 0.32 : 0.28;
      ctrl.bloomPass.threshold = isDarkMode ? 0.88 : 1.28;
    }

    if (ctrl.clarityPass) {
      ctrl.clarityPass.uniforms.uDarkMode.value = isDarkMode ? 1.0 : 0.0;
    }

    ctrl.cloudDeckResult.setTheme(isDarkMode);
    ctrl.cityResult.applyTheme(isDarkMode);
    ctrl.housesResult.applyTheme(isDarkMode);
  }, [isDarkMode]);

  // Orchestrate House Selection -> Approach Front Steps -> Swing Wooden Door Open -> Luminous Push-In -> Reveal Motion Service Data!
  useEffect(() => {
    selectedRef.current = selectedIndex;
    const houses = houseRefsStore.current;
    const seq = sequenceStateRef.current;

    if (activeTimelineRef.current) {
      activeTimelineRef.current.kill();
      activeTimelineRef.current = null;
    }

    if (selectedIndex === null) {
      if (seq.activeHouseIndex >= 0 && houses[seq.activeHouseIndex]) {
        const prevHouse = houses[seq.activeHouseIndex];
        callbacksRef.current.onPhaseChange('exiting_house');
        const tl = gsap.timeline({
          onComplete: () => {
            seq.activeHouseIndex = -1;
            callbacksRef.current.onPhaseChange('aerial_scroll');
          },
        });
        tl.to(seq, { approachT: 0, duration: 0.62, ease: 'power2.inOut' }, 0);
        tl.to(prevHouse.doorPivot.rotation, { y: 0, duration: 0.55, ease: 'power2.inOut' }, 0.24);
        tl.to(prevHouse.portalLight, { intensity: 1.15, duration: 0.45 }, 0.2);
        tl.to(prevHouse.portalGlowMat, { opacity: 0.42, duration: 0.45 }, 0.2);
        tl.to(seq, { blend: 0, dimFactor: 1, duration: 0.82, ease: 'power2.inOut' }, 0.48);
        activeTimelineRef.current = tl;
      } else {
        callbacksRef.current.onPhaseChange('aerial_scroll');
      }
      return;
    }

    const targetHouse = houses[selectedIndex];
    if (!targetHouse) return;

    houses.forEach((h, i) => {
      if (i !== selectedIndex && Math.abs(h.doorPivot.rotation.y) > 0.02) {
        gsap.to(h.doorPivot.rotation, { y: 0, duration: 0.4, ease: 'power2.out' });
        gsap.to(h.portalLight, { intensity: 1.15, duration: 0.35 });
        gsap.to(h.portalGlowMat, { opacity: 0.42, duration: 0.35 });
      }
    });

    const switchingBetweenHouses =
      seq.activeHouseIndex >= 0 && seq.activeHouseIndex !== selectedIndex && seq.blend > 0.5;
    seq.activeHouseIndex = selectedIndex;

    const tl = gsap.timeline();
    if (switchingBetweenHouses) {
      tl.call(() => callbacksRef.current.onPhaseChange('approaching_door'));
      tl.set(seq, { approachT: 0 });
      tl.to(seq, { blend: 1, dimFactor: 0.78, duration: 0.68, ease: 'power2.out' });
      tl.call(() => callbacksRef.current.onPhaseChange('opening_door'));
      tl.to(targetHouse.doorPivot.rotation, { y: -1.96, duration: 0.72, ease: 'power2.out' });
      tl.to(targetHouse.portalLight, { intensity: 7.4, duration: 0.65 }, '<');
      tl.to(targetHouse.portalGlowMat, { opacity: 0.95, duration: 0.65 }, '<');
      tl.to(seq, { approachT: 1, duration: 0.9, ease: 'power2.inOut' }, '-=0.35');
      // Brief unobstructed showcase inside the palatial luxury 3D interior before opening service details
      tl.to({}, { duration: 0.95 });
      tl.call(() => callbacksRef.current.onPhaseChange('inside_house'));
    } else {
      callbacksRef.current.onPhaseChange('approaching_door');
      seq.approachT = 0;
      tl.to(seq, { blend: 1, dimFactor: 0.78, duration: 0.86, ease: 'power2.out' });
      tl.call(() => callbacksRef.current.onPhaseChange('opening_door'));
      tl.to(targetHouse.doorPivot.rotation, { y: -1.96, duration: 0.74, ease: 'power2.out' });
      tl.to(targetHouse.portalLight, { intensity: 7.4, duration: 0.65 }, '<');
      tl.to(targetHouse.portalGlowMat, { opacity: 0.95, duration: 0.65 }, '<');
      tl.to(seq, { approachT: 1, duration: 0.94, ease: 'power2.inOut' }, '-=0.36');
      // Brief unobstructed showcase inside the palatial luxury 3D interior before opening service details
      tl.to({}, { duration: 1.0 });
      tl.call(() => callbacksRef.current.onPhaseChange('inside_house'));
    }

    activeTimelineRef.current = tl;
  }, [selectedIndex]);

  if (webglFailed) {
    return (
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center p-6 text-center ${
          isDarkMode ? 'bg-[#0B0D18]' : 'bg-[#F4F8FC]'
        }`}
      >
        <div className="max-w-xl space-y-3">
          <p
            className={`font-mono text-xs uppercase tracking-[0.2em] ${
              isDarkMode ? 'text-[#F59E0B]' : 'text-[#1D6FD8]'
            }`}
          >
            Click N Create · United Kingdom · Modern Architectural Services District
          </p>
          <h2
            className={`font-display text-2xl sm:text-4xl font-bold ${
              isDarkMode ? 'text-[#FAF6F0]' : 'text-[#0F172A]'
            }`}
          >
            Explore Our 6 Digital Service Studios
          </h2>
          <p className={`text-sm ${isDarkMode ? 'text-[#C2BACF]' : 'text-[#475569]'}`}>
            Select any house below to open its door and explore complete deliverables, transparent £35/hr pricing, and project workflows.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full select-none touch-pan-y"
      aria-label="Interactive 3D Cloud Descent to Photorealistic UK City and Six Service Houses Tour"
    />
  );
};

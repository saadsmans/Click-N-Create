import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import gsap from 'gsap';
import { ServiceItem } from '../../data/services.ts';
import { buildCloudDescentDeck, CloudDeckBuildResult } from './cloudDeckBuilder.ts';
import { buildArchitecturalCity, CityBuildResult } from './cityBuilder.ts';
import { buildServiceHouses, HousesBuildResult } from './serviceHousesBuilder.ts';
import { detectQualityProfile, ExplorationPhase } from './types.ts';

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
const _cloudDayColor = new THREE.Color(0xe3eef9);
const _cloudNightColor = new THREE.Color(0x0b1528);
const _cityDayColor = new THREE.Color(0xcde0f5);
const _cityNightColor = new THREE.Color(0x060b18);

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
    uSharpness: { value: 0.34 },
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

      // Subtle architectural cinema split-tone (crisp sapphire shadows, clean luminous highlights)
      float luma = dot(graded, vec3(0.2126, 0.7152, 0.0722));
      vec3 shadowTint = mix(vec3(0.97, 0.99, 1.03), vec3(0.95, 0.98, 1.04), uDarkMode);
      vec3 highTint   = mix(vec3(1.02, 1.005, 0.985), vec3(0.98, 1.01, 1.04), uDarkMode);
      graded *= mix(shadowTint, highTint, smoothstep(0.18, 0.85, luma));

      // Gentle optical cinema lens vignette + sub-LSB dither to keep HDR sky gradients silky-smooth
      float vig = 1.0 - r2 * mix(0.16, 0.22, uDarkMode);
      vec3 outCol = graded * vig + ditherNoise(vUv * uResolution) * (1.0 / 255.0);
      gl_FragColor = vec4(clamp(outCol, 0.0, 1.0), 1.0);
    }
  `,
};

/** Exact scroll progress centers for each of the 6 Service Houses on the Turn-by-Turn Guided Tour */
export const HOUSE_TOUR_PROGRESS: number[] = [0.6, 0.66, 0.72, 0.78, 0.84, 0.9];

interface CameraKeyframe {
  t: number; // normalized scroll t in [0, 1]
  pos: THREE.Vector3;
  look: THREE.Vector3;
}

const CITY_KEYFRAMES: CameraKeyframe[] = [
  // 0.00 -> Start high & deep ABOVE the 4-strata stratospheric volumetric cloud ocean!
  { t: 0.0, pos: new THREE.Vector3(0, 315, 315), look: new THREE.Vector3(0, 26, 48) },
  // 0.08 -> Diving deep into the sunlit/moonlit upper cloud canyons
  { t: 0.08, pos: new THREE.Vector3(16, 238, 278), look: new THREE.Vector3(0, 24, 52) },
  // 0.16 -> Plunging through the thick parting mid-deck volumetric cumulus chasm
  { t: 0.16, pos: new THREE.Vector3(38, 174, 246), look: new THREE.Vector3(0, 22, 48) },
  // 0.24 -> Breaking beneath the cloud base into a sweeping Whole-City Panoramic Overlook (100% clear of all skyscrapers!)
  { t: 0.24, pos: new THREE.Vector3(74, 134, 228), look: new THREE.Vector3(0, 24, 54) },
  // 0.32 -> Wide helicopter panoramic arc completely in front of the skyline perimeter (z >= 210 vs max tower z = 175 -> ZERO collision!)
  { t: 0.32, pos: new THREE.Vector3(-62, 108, 212), look: new THREE.Vector3(0, 22, 58) },
  // 0.38 -> Aligning dead-center into the open Sapphire Boulevard sky canyon above Gateway 1
  { t: 0.38, pos: new THREE.Vector3(0, 66, 178), look: new THREE.Vector3(0, 24, 72) },
  // 0.42 -> Sweeping cleanly UNDER Gateway 1 Skybridge (bridge bottom y=43.2) down the center corridor
  { t: 0.42, pos: new THREE.Vector3(0, 32, 146), look: new THREE.Vector3(0, 14, 70) },
  // 0.46 -> Sweeping cleanly UNDER Gateway 2 Skybridge (y=30.2) & descending cleanly UNDER the Maglev Viaduct (z=94, y=15.0)
  { t: 0.46, pos: new THREE.Vector3(0, 11.5, 110), look: new THREE.Vector3(0, 7.5, 58) },
  // 0.49 -> Street-level boulevard drive right alongside luxury EVs & panoramic electric coaches
  { t: 0.49, pos: new THREE.Vector3(-1.6, 3.9, 82), look: new THREE.Vector3(0, 3.6, 40) },
  // 0.53 -> Gliding across the illuminated Tied-Arch Steel River Bridge over rippling water
  { t: 0.53, pos: new THREE.Vector3(0.6, 4.7, 54), look: new THREE.Vector3(0, 3.6, 4) },
  // 0.565 -> Entering the Grand Residential Crescent Park past the central infinity water sculpture
  { t: 0.565, pos: new THREE.Vector3(-6.8, 5.4, 14.0), look: new THREE.Vector3(-21.0, 4.0, -16.0) },
  // 0.60 -> TURN-BY-TURN STOP 1: House 01 (E-Commerce Development · Cantilevered Travertine & Glass Pavilion)
  { t: 0.6, pos: new THREE.Vector3(-14.2, 5.2, -13.2), look: new THREE.Vector3(-32.0, 4.1, -20.4) },
  // 0.66 -> TURN-BY-TURN STOP 2: House 02 (Web Development · 3-Level Sculpted Obsidian Basalt Atelier)
  { t: 0.66, pos: new THREE.Vector3(-10.0, 5.4, -19.0), look: new THREE.Vector3(-22.6, 4.5, -33.5) },
  // 0.72 -> TURN-BY-TURN STOP 3: House 03 (Branding & Design · Curved-Canopy Pearl Limestone & Teak Villa)
  { t: 0.72, pos: new THREE.Vector3(-3.7, 5.2, -22.4), look: new THREE.Vector3(-8.35, 4.1, -41.0) },
  // 0.78 -> TURN-BY-TURN STOP 4: House 04 (Digital Marketing · Grand Double-Height Titanium & Glass Manor)
  { t: 0.78, pos: new THREE.Vector3(3.7, 5.3, -22.4), look: new THREE.Vector3(8.35, 4.4, -41.0) },
  // 0.84 -> TURN-BY-TURN STOP 5: House 05 (Web App Development · Interlocking Slate & Glass Cube Residence)
  { t: 0.84, pos: new THREE.Vector3(10.0, 5.3, -19.0), look: new THREE.Vector3(22.6, 4.4, -33.5) },
  // 0.90 -> TURN-BY-TURN STOP 6: House 06 (Hosting & Maintenance · Butterfly-Roof Architectural Glass & Walnut Studio)
  { t: 0.9, pos: new THREE.Vector3(14.2, 5.2, -13.2), look: new THREE.Vector3(32.0, 4.1, -20.4) },
  // 1.00 -> Grand Finale Crescent Panorama overlooking all 6 Ultra-Luxury Modern Residences & Futuristic Blue Skyline
  { t: 1.0, pos: new THREE.Vector3(0, 12.6, 23.0), look: new THREE.Vector3(0, 4.5, -28.0) },
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
    skyDomeMat: THREE.ShaderMaterial;
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
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    // 2. Photorealistic Scene starting high ABOVE the 4-strata volumetric cloud ocean
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(initDark ? 0x091326 : 0xdcebfa);
    scene.fog = new THREE.Fog(initDark ? 0x060c1a : 0xcde0f5, 290, 980);

    // Clean Studio PBR Reflection Map (RoomEnvironment via PMREM) so architectural glass, titanium fins & obsidian EVs render with crisp physical specular sheen
    const pmremGen = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmremGen.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    scene.environmentIntensity = initDark ? 0.9 : 1.18;
    roomEnv.dispose();
    pmremGen.dispose();

    // Crisp Atmospheric Sky Gradient Dome (Day Rayleigh Azure + Sun Halo / Night Midnight Sapphire + Crisp Starfield)
    const skyDomeGeo = new THREE.SphereGeometry(1080, 32, 24);
    const skyDomeUniforms = {
      uTime: { value: 0 },
      uIsDark: { value: initDark ? 1.0 : 0.0 },
    };
    const skyDomeMat = new THREE.ShaderMaterial({
      uniforms: skyDomeUniforms,
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      vertexShader: /* glsl */ `
        varying vec3 vDir;
        void main() {
          vDir = normalize(position);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uTime;
        uniform float uIsDark;
        varying vec3 vDir;

        float hash31(vec3 p) {
          p = fract(p * 0.1031);
          p += dot(p, p.yzx + 33.33);
          return fract((p.x + p.y) * p.z);
        }

        void main() {
          vec3 d = normalize(vDir);
          float h = clamp(d.y, -0.2, 1.0);
          float up = smoothstep(-0.04, 0.68, h);

          // Photographic Day Sky: crisp alpine azure zenith blending into luminous platinum-mist horizon
          vec3 dayHorizon = vec3(0.84, 0.91, 0.98);
          vec3 dayMid     = vec3(0.42, 0.67, 0.93);
          vec3 dayZenith  = vec3(0.14, 0.37, 0.72);
          vec3 dayCol = mix(dayHorizon, dayMid, smoothstep(-0.02, 0.28, h));
          dayCol = mix(dayCol, dayZenith, smoothstep(0.24, 0.86, h));
          vec3 sunDir = normalize(vec3(0.54, 0.44, 0.42));
          float sunAmt = max(0.0, dot(d, sunDir));
          dayCol += vec3(1.0, 0.96, 0.88) * pow(sunAmt, 14.0) * 0.32;
          dayCol += vec3(1.0, 0.98, 0.92) * pow(sunAmt, 240.0) * 0.75;

          // Photographic Night Sky: deep stratospheric sapphire zenith + subtle metropolitan horizon glow + crisp high stars
          vec3 nightHorizon = vec3(0.065, 0.125, 0.245);
          vec3 nightMid     = vec3(0.025, 0.055, 0.125);
          vec3 nightZenith  = vec3(0.008, 0.018, 0.048);
          vec3 nightCol = mix(nightHorizon, nightMid, smoothstep(-0.02, 0.25, h));
          nightCol = mix(nightCol, nightZenith, smoothstep(0.22, 0.85, h));

          // Crisp subtle starfield visible above the horizon in dark mode
          if (uIsDark > 0.01 && h > 0.06) {
            vec3 grid = floor(d * 220.0);
            float rnd = hash31(grid);
            if (rnd > 0.9965) {
              float twinkle = 0.65 + 0.35 * sin(uTime * (1.8 + fract(rnd * 97.0) * 2.5) + rnd * 120.0);
              float starBright = smoothstep(0.9965, 0.9999, rnd) * twinkle * smoothstep(0.06, 0.32, h);
              nightCol += vec3(0.76, 0.88, 1.0) * starBright * 0.95;
            }
          }

          vec3 col = mix(dayCol, nightCol, uIsDark);
          // Smooth nadir blend beneath horizon so looking down never exposes a seam
          col = mix(mix(vec3(0.76, 0.86, 0.96), vec3(0.04, 0.08, 0.16), uIsDark), col, smoothstep(-0.18, 0.02, h));
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
    const skyDome = new THREE.Mesh(skyDomeGeo, skyDomeMat);
    skyDome.renderOrder = -10;
    scene.add(skyDome);

    const camera = new THREE.PerspectiveCamera(44, initW / initH, 0.25, 1380);
    camera.position.set(0, 315, 315);

    // 3. Build Volumetric Cumulus Cloud Descent Deck + Photorealistic Metropolis + 6 Bespoke Service Houses
    const maxAniso = renderer.capabilities.getMaxAnisotropy();

    const cloudDeckResult = buildCloudDescentDeck(initDark);
    scene.add(cloudDeckResult.group);

    const cityResult = buildArchitecturalCity(quality, maxAniso, initDark);
    scene.add(cityResult.group);

    // 4. Photorealistic ArchViz Lighting Rig (Crisp Angled Sun + Azure Sky Bounce vs Silvery Sapphire Moonlight)
    const hemiLight = new THREE.HemisphereLight(
      initDark ? 0x86b2ec : 0xdcf0ff,
      initDark ? 0x131d33 : 0x5c6d63,
      initDark ? 0.88 : 1.15
    );
    scene.add(hemiLight);

    const keyLightOffset = new THREE.Vector3(68, 54, 52);
    const keyLight = new THREE.DirectionalLight(
      initDark ? 0xcce0f8 : 0xfff6e8,
      initDark ? 1.54 : 3.28
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
      initDark ? 0x7dd3fc : 0xb8dcf8,
      initDark ? 0.74 : 0.78
    );
    rimLight.position.set(-52, 40, -56);
    scene.add(rimLight);

    const plazaFillLight = new THREE.PointLight(0x93c5fd, initDark ? 2.6 : 0.0, 56, 1.45);
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
      const maxSamples = Math.min(8, renderer.capabilities.maxSamples || 4);
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

      // True HDR Selective Specular Bloom: in Day mode threshold 1.28 blooms ONLY true sunlit HDR glints off glass & cars!
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
      skyDomeMat,
      cloudDeckResult,
      cityResult,
      housesResult,
      baseKeyIntensity: initDark ? 1.54 : 3.28,
      baseHemiIntensity: initDark ? 0.88 : 1.15,
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
      if (disposed) return;
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
      // Wide dramatic 50deg aerial panorama -> sweeping 46deg canyon dive -> crisp 40.5deg architectural telephoto on 6 Houses!
      const aerialWide = t < 0.54 ? Math.sin((t / 0.54) * Math.PI) * 5.8 + (1.0 - skyExit) * 3.4 : 0;
      const houseTelephoto =
        t > 0.56 && t < 0.96 ? Math.sin(((t - 0.56) / 0.4) * Math.PI) * -3.5 : 0;
      const desiredFov = seq.blend > 0.5 ? 44 : 44 + aerialWide + houseTelephoto;
      if (Math.abs(camera.fov - desiredFov) > 0.04) {
        camera.fov = THREE.MathUtils.damp(camera.fov, desiredFov, 4.6, dt);
        camera.updateProjectionMatrix();
      }

      // Organic cinema-drone / steadicam micro-breathing (attenuated cleanly when opening a house door)
      const breatheAmp = (1.0 - seq.blend) * THREE.MathUtils.lerp(0.14, 0.045, skyExit);
      _targetPos.x += Math.sin(elapsed * 0.65) * breatheAmp;
      _targetPos.y += Math.cos(elapsed * 0.85) * breatheAmp * 0.65;

      const parallaxAmp = seq.blend > 0.5 ? 0.3 : THREE.MathUtils.lerp(1.65, 0.72, t);
      _targetPos.x += dampedParallaxX * parallaxAmp;
      _targetPos.y += dampedParallaxY * (parallaxAmp * 0.25);

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

      // Dynamic camera-focus shadow frustum for razor-sharp shadows across the entire city & expanded 6-house crescent!
      if (quality.shadowsEnabled) {
        const focusZ = Math.round(THREE.MathUtils.clamp(_camTarget.z, -44, 115) * 0.5) * 2;
        const focusX = Math.round(THREE.MathUtils.clamp(_camTarget.x, -36, 36) * 0.5) * 2;
        keyLight.target.position.set(focusX, 0, focusZ);
        keyLight.position.set(
          focusX + keyLightOffset.x,
          keyLightOffset.y,
          focusZ + keyLightOffset.z
        );
        keyLight.target.updateMatrixWorld();
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

        // Project crisp architectural rooftop markers during the 6-house tour & neighborhood panorama
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
              const sx = (_projVec.x * 0.5 + 0.5) * width;
              const sy = (-_projVec.y * 0.5 + 0.5) * height;
              const inBounds = sx > 44 && sx < width - 44 && sy > 70 && sy < height - 120;
              labelEl.style.transform = `translate3d(${sx}px, ${sy}px, 0) translate(-50%, -100%)`;
              const emphasis =
                tourHouseRef.current === null || isTourFocus || isHovered ? 1.0 : 0.94;
              const labelFade = THREE.MathUtils.smoothstep(t, 0.535, 0.565);
              labelEl.style.opacity = inBounds ? String(labelFade * emphasis) : '0';
              labelEl.style.pointerEvents = inBounds ? 'auto' : 'none';
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

      // Keep Atmospheric Sky Gradient Dome centered on the camera at all altitudes
      skyDomeUniforms.uTime.value = elapsed;
      skyDome.position.copy(_camPos);

      // Update photorealistic volumetric cumulus clouds & passing cloud-base mist
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
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('pointerup', handlePointerUp);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored);

      cloudDeckResult.dispose();
      cityResult.dispose();
      housesResult.dispose();
      skyDomeGeo.dispose();
      skyDomeMat.dispose();
      envTarget.dispose();
      if (composer) composer.dispose();
      if (msaaRenderTarget) msaaRenderTarget.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [services.length]);

  // Instant Realistic Day <-> Night Theme Switcher (Studio PBR Reflections + Atmospheric Sky + Volumetric Clouds + High-Tech City)
  useEffect(() => {
    const ctrl = sceneThemeControlRef.current;
    if (!ctrl) return;

    ctrl.renderer.toneMappingExposure = isDarkMode ? 1.12 : 1.05;
    ctrl.scene.environmentIntensity = isDarkMode ? 0.9 : 1.18;
    ctrl.skyDomeMat.uniforms.uIsDark.value = isDarkMode ? 1.0 : 0.0;

    ctrl.hemiLight.color.setHex(isDarkMode ? 0x86b2ec : 0xdcf0ff);
    ctrl.hemiLight.groundColor.setHex(isDarkMode ? 0x131d33 : 0x5c6d63);
    ctrl.baseHemiIntensity = isDarkMode ? 0.88 : 1.15;

    ctrl.keyLight.color.setHex(isDarkMode ? 0xcce0f8 : 0xfff6e8);
    ctrl.baseKeyIntensity = isDarkMode ? 1.54 : 3.28;

    ctrl.rimLight.color.setHex(isDarkMode ? 0x7dd3fc : 0xb8dcf8);
    ctrl.rimLight.intensity = isDarkMode ? 0.74 : 0.78;

    ctrl.plazaFillLight.intensity = isDarkMode ? 2.6 : 0.0;

    if (ctrl.bloomPass) {
      ctrl.bloomPass.strength = isDarkMode ? 0.3 : 0.14;
      ctrl.bloomPass.radius = isDarkMode ? 0.28 : 0.28;
      ctrl.bloomPass.threshold = isDarkMode ? 0.92 : 1.28;
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
        tl.to(seq, { approachT: 0, duration: 0.6, ease: 'power2.inOut' }, 0);
        tl.to(prevHouse.doorPivot.rotation, { y: 0, duration: 0.55, ease: 'power2.inOut' }, 0.22);
        tl.to(prevHouse.portalLight, { intensity: 0, duration: 0.45 }, 0.2);
        tl.to(prevHouse.portalGlowMat, { opacity: 0.14, duration: 0.45 }, 0.2);
        tl.to(seq, { blend: 0, dimFactor: 1, duration: 0.85, ease: 'power2.inOut' }, 0.48);
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
        gsap.to(h.portalLight, { intensity: 0, duration: 0.35 });
        gsap.to(h.portalGlowMat, { opacity: 0.14, duration: 0.35 });
      }
    });

    const switchingBetweenHouses =
      seq.activeHouseIndex >= 0 && seq.activeHouseIndex !== selectedIndex && seq.blend > 0.5;
    seq.activeHouseIndex = selectedIndex;

    const tl = gsap.timeline();
    if (switchingBetweenHouses) {
      tl.call(() => callbacksRef.current.onPhaseChange('approaching_door'));
      tl.set(seq, { approachT: 0 });
      tl.to(seq, { blend: 1, dimFactor: 0.65, duration: 0.65, ease: 'power2.out' });
      tl.call(() => callbacksRef.current.onPhaseChange('opening_door'));
      tl.to(targetHouse.doorPivot.rotation, { y: -1.85, duration: 0.72, ease: 'power2.out' });
      tl.to(targetHouse.portalLight, { intensity: 3.4, duration: 0.6 }, '<');
      tl.to(targetHouse.portalGlowMat, { opacity: 0.85, duration: 0.6 }, '<');
      tl.to(seq, { approachT: 1, duration: 0.78, ease: 'power2.inOut' }, '-=0.32');
      tl.call(() => callbacksRef.current.onPhaseChange('inside_house'));
    } else {
      callbacksRef.current.onPhaseChange('approaching_door');
      seq.approachT = 0;
      tl.to(seq, { blend: 1, dimFactor: 0.65, duration: 0.88, ease: 'power2.out' });
      tl.call(() => callbacksRef.current.onPhaseChange('opening_door'));
      tl.to(targetHouse.doorPivot.rotation, { y: -1.85, duration: 0.75, ease: 'power2.out' });
      tl.to(targetHouse.portalLight, { intensity: 3.4, duration: 0.6 }, '<');
      tl.to(targetHouse.portalGlowMat, { opacity: 0.85, duration: 0.6 }, '<');
      tl.to(seq, { approachT: 1, duration: 0.82, ease: 'power2.inOut' }, '-=0.35');
      tl.call(() => callbacksRef.current.onPhaseChange('inside_house'));
    }

    activeTimelineRef.current = tl;
  }, [selectedIndex]);

  if (webglFailed) {
    return (
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center p-6 text-center ${
          isDarkMode ? 'bg-[#060913]' : 'bg-[#F3F6FA]'
        }`}
      >
        <div className="max-w-xl space-y-3">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#38BDF8]">
            Click N Create · United Kingdom · Modern Architectural Services District
          </p>
          <h2
            className={`font-display text-2xl sm:text-4xl font-bold ${
              isDarkMode ? 'text-[#F1F5F9]' : 'text-[#0F172A]'
            }`}
          >
            Explore Our 6 Digital Service Studios
          </h2>
          <p className={`text-sm ${isDarkMode ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
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

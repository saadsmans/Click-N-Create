import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'motion/react';

gsap.registerPlugin(ScrollTrigger);

const AVATAR_IMAGE_WEBP = '/assets/aistudio/profile_photo_under_1mb-1_26da4b57.webp';
const AVATAR_IMAGE_SRC = '/assets/aistudio/profile_photo_under_1mb-1_26da4b57.jpg';

interface InteractivePortfolioAvatar3DProps {
  isDark: boolean;
}

function detectSoftwareWebGL(gl: WebGLRenderingContext | WebGL2RenderingContext): boolean {
  try {
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    if (!ext) return false;
    const rendererStr = String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || '').toLowerCase();
    return (
      rendererStr.includes('swiftshader') ||
      rendererStr.includes('llvmpipe') ||
      rendererStr.includes('software') ||
      rendererStr.includes('mesa offscreen')
    );
  } catch {
    return false;
  }
}

/**
 * Deterministic 3D facial & portrait relief heightmap aligned to the square
 * object-cover object-top crop of Saad's portrait (u in [0..1] left->right,
 * vCanvas in [0..1] top->bottom).
 */
function computePortraitReliefZ(u: number, vCanvas: number): number {
  const dxHead = (u - 0.505) / 0.285;
  const dyHead = (vCanvas - 0.445) / 0.355;
  const headR2 = dxHead * dxHead + dyHead * dyHead;
  const headDome = headR2 < 1.0 ? Math.pow(1.0 - headR2, 0.65) * 0.24 : 0.0;

  // Shoulders / black collared shirt volume at bottom
  const dyShoulder = (vCanvas - 0.96) / 0.28;
  const dxShoulder = (u - 0.5) / 0.54;
  const shoulderR2 = dxShoulder * dxShoulder + dyShoulder * dyShoulder;
  const shoulderDome = shoulderR2 < 1.0 && vCanvas > 0.68 ? Math.pow(1.0 - shoulderR2, 0.7) * 0.14 : 0.0;

  // Hair crown fullness
  const dxHair = (u - 0.5) / 0.34;
  const dyHair = (vCanvas - 0.21) / 0.19;
  const hairR2 = dxHair * dxHair + dyHair * dyHair;
  const hairVolume = hairR2 < 1.0 ? Math.pow(1.0 - hairR2, 0.8) * 0.09 : 0.0;

  // Cheekbones & brow ridge
  const dxLeftCheek = (u - 0.37) / 0.11;
  const dyCheek = (vCanvas - 0.53) / 0.09;
  const leftCheek = Math.exp(-(dxLeftCheek * dxLeftCheek + dyCheek * dyCheek) * 1.4) * 0.055;

  const dxRightCheek = (u - 0.64) / 0.11;
  const rightCheek = Math.exp(-(dxRightCheek * dxRightCheek + dyCheek * dyCheek) * 1.4) * 0.055;

  // Nose bridge & tip protrusion
  const dxNose = (u - 0.505) / 0.052;
  const dyNose = (vCanvas - 0.525) / 0.105;
  const noseBridge = Math.exp(-(dxNose * dxNose * 1.3 + dyNose * dyNose * 0.9)) * 0.115;
  const dxNoseTip = (u - 0.505) / 0.042;
  const dyNoseTip = (vCanvas - 0.575) / 0.042;
  const noseTip = Math.exp(-(dxNoseTip * dxNoseTip + dyNoseTip * dyNoseTip) * 1.5) * 0.055;

  // Lips & chin contour
  const dxLips = (u - 0.505) / 0.095;
  const dyLips = (vCanvas - 0.685) / 0.045;
  const lips = Math.exp(-(dxLips * dxLips + dyLips * dyLips) * 1.4) * 0.055;

  // Eyeglasses rims subtle relief
  const dLeftLens = Math.hypot((u - 0.39) / 0.105, (vCanvas - 0.455) / 0.092);
  const dRightLens = Math.hypot((u - 0.62) / 0.105, (vCanvas - 0.455) / 0.092);
  const rimBump =
    (Math.exp(-Math.pow((dLeftLens - 1.0) / 0.16, 2)) +
      Math.exp(-Math.pow((dRightLens - 1.0) / 0.16, 2))) *
    0.045;

  return -0.10 + headDome + shoulderDome + hairVolume + leftCheek + rightCheek + noseBridge + noseTip + lips + rimBump;
}

/**
 * Progressive anatomical construction stage [0.0 .. 0.74] so scrolling reveals:
 * 1) Head & shoulder silhouette outline first (0.00 - 0.18)
 * 2) Facial structure, cheeks, jaw & neck (0.18 - 0.40)
 * 3) Eyes, glasses, nose & mouth landmarks (0.40 - 0.58)
 * 4) Hair waves, shirt details & ambient dark rim (0.58 - 0.74)
 */
function computeAssemblyStage(u: number, vCanvas: number, radialDist: number): number {
  const dxHead = (u - 0.505) / 0.295;
  const dyHead = (vCanvas - 0.45) / 0.365;
  const headEllipse = Math.hypot(dxHead, dyHead);

  // 1. Head contour outline
  const silhouetteBand = Math.abs(headEllipse - 0.94);
  if (silhouetteBand < 0.16) {
    return 0.02 + (silhouetteBand / 0.16) * 0.14;
  }

  // 2. Facial core structure (forehead, cheeks, jaw)
  const isFaceCore = headEllipse < 0.85 && vCanvas > 0.26 && vCanvas < 0.80;
  // 3. Key facial landmarks (eyes, glasses, nose, mouth)
  const isEyeBand = vCanvas >= 0.36 && vCanvas <= 0.52 && u >= 0.26 && u <= 0.75;
  const isNoseMouth = vCanvas >= 0.48 && vCanvas <= 0.73 && u >= 0.37 && u <= 0.64;

  if (isEyeBand || isNoseMouth) {
    const centerBias = Math.abs(u - 0.5) * 0.25;
    return 0.36 + centerBias + (isNoseMouth ? 0.06 : 0.0);
  }

  if (isFaceCore) {
    return 0.16 + headEllipse * 0.22;
  }

  // 4. Hair waves at top
  if (vCanvas <= 0.34 && headEllipse < 1.15) {
    return 0.50 + Math.abs(u - 0.5) * 0.16;
  }

  // 5. Collar / neck / outer dark rim
  if (vCanvas > 0.74) {
    return 0.56 + Math.min(0.16, radialDist * 0.25);
  }

  return 0.58 + Math.min(0.15, radialDist * 0.22);
}

const VOXEL_VERTEX_SHADER = /* glsl */ `
  attribute vec3 aScatterPos;
  attribute vec3 aTargetPos;
  attribute vec3 aArcOffset;
  attribute vec4 aSpin;
  attribute vec3 aColor;
  attribute float aStage;

  uniform float uProgress;
  uniform float uTime;
  uniform float uVoxelSize;
  uniform float uPortraitBlend;

  varying vec3 vColor;
  varying vec3 vNormal;
  varying vec3 vViewPos;
  varying vec3 vLocalPos;
  varying float vEase;
  varying float vEnergy;

  mat3 axisAngleMat(vec3 axis, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    return mat3(
      oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s, oc * axis.z * axis.x + axis.y * s,
      oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,          oc * axis.y * axis.z - axis.x * s,
      oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s, oc * axis.z * axis.z + c
    );
  }

  void main() {
    float rawT = clamp((uProgress - aStage) / 0.26, 0.0, 1.0);
    float ease = rawT * rawT * (3.0 - 2.0 * rawT);
    float arc = sin(ease * 3.14159265);

    // Subtle organic floating drift while scattered
    float floatWeight = 1.0 - ease * 0.96;
    vec3 drift = vec3(
      sin(uTime * 1.15 + aSpin.w * 6.2831),
      cos(uTime * 0.95 + aSpin.w * 4.7123),
      sin(uTime * 0.85 + aSpin.w * 3.1415)
    ) * (0.065 * floatWeight);

    // Size transitions from energetic floating micro-blocks to tight portrait voxels
    float preScale = mix(0.62 + 0.35 * sin(aSpin.w * 6.2831 + uTime * 1.4) * 0.5 + 0.15, 1.0, ease);
    // Shrink cubes completely out as the HD portrait locks in
    float shrinkTail = mix(1.0, 0.35, uPortraitBlend);
    float cubeScale = uVoxelSize * preScale * shrinkTail;

    // Spin cubes smoothly as they travel into target orientation
    float tumbleAngle = (1.0 - ease) * (3.6 + aSpin.w * 4.5) + (1.0 - ease) * uTime * 0.55;
    mat3 rot = axisAngleMat(normalize(aSpin.xyz), tumbleAngle);

    vec3 localScaled = rot * (position * cubeScale);
    vec3 centerPos = mix(aScatterPos, aTargetPos, ease) + aArcOffset * arc + drift;

    vec4 mvPos = modelViewMatrix * vec4(centerPos + localScaled, 1.0);
    gl_Position = projectionMatrix * mvPos;

    vNormal = normalize(normalMatrix * (rot * normal));
    vViewPos = -mvPos.xyz;
    vLocalPos = position;
    vColor = aColor;
    vEase = ease;
    vEnergy = arc * 0.85 + (1.0 - ease) * 0.35;
  }
`;

const VOXEL_FRAGMENT_SHADER = /* glsl */ `
  uniform float uPortraitBlend;
  uniform vec2 uPointer;

  varying vec3 vColor;
  varying vec3 vNormal;
  varying vec3 vViewPos;
  varying vec3 vLocalPos;
  varying float vEase;
  varying float vEnergy;

  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vViewPos);

    // Studio key light + pointer-steered sheen + portrait rim lighting
    vec3 L1 = normalize(vec3(0.45 + uPointer.x * 0.35, 0.55 + uPointer.y * 0.35, 0.9));
    vec3 L2 = normalize(vec3(-0.8, 0.25, 0.45));
    vec3 L3 = normalize(vec3(0.75, -0.35, 0.35));

    float diff1 = max(dot(N, L1), 0.0);
    float diff2 = max(dot(N, L2), 0.0);
    float diff3 = max(dot(N, L3), 0.0);

    vec3 H = normalize(L1 + V);
    float spec = pow(max(dot(N, H), 0.0), 32.0) * (0.28 * (1.0 - vEase * 0.55));

    float fresnel = pow(1.0 - max(dot(N, V), 0.0), 2.5);

    // Crisp cube facet highlight while scattered/assembling, softening cleanly as blocks lock in
    float edgeMask = max(max(abs(vLocalPos.x), abs(vLocalPos.y)), abs(vLocalPos.z));
    float facetRim = smoothstep(0.36, 0.49, edgeMask) * (1.0 - vEase * 0.85);

    vec3 cyberCyan = vec3(0.18, 0.65, 1.0);
    vec3 cyberViolet = vec3(0.55, 0.22, 0.95);

    vec3 litBase = vColor * (0.70 + diff1 * 0.38 + diff2 * 0.10 + diff3 * 0.08);
    vec3 energyTint = mix(cyberCyan, cyberViolet, 0.45) * (facetRim * 0.50 + vEnergy * 0.28 + fresnel * (1.0 - vEase) * 0.40);

    vec3 finalColor = litBase + energyTint + vec3(spec);
    // Fade blocks completely away to 0.0 once the crisp HD portrait resolves
    float alpha = mix(0.96, 1.0 - smoothstep(0.05, 0.85, uPortraitBlend), vEase) * (1.0 - smoothstep(0.85, 1.0, uPortraitBlend));

    if (alpha < 0.01) discard;

    gl_FragColor = vec4(finalColor, alpha);
    #include <colorspace_fragment>
  }
`;

const PORTRAIT_VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPos;

  void main() {
    vUv = uv;
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vViewPos = -mvPos.xyz;
    gl_Position = projectionMatrix * mvPos;
  }
`;

const PORTRAIT_FRAGMENT_SHADER = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uPortraitBlend;
  uniform vec2 uPointer;
  uniform float uTime;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPos;

  void main() {
    vec2 centered = vUv - 0.5;
    float r = length(centered);
    float circleMask = smoothstep(0.496, 0.474, r);
    if (circleMask < 0.01 || uPortraitBlend < 0.01) discard;

    vec4 texel = texture2D(uMap, vUv);
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vViewPos);

    // True-to-photo crisp shading with subtle 3D depth modulation on cursor tilt
    vec3 keyDir = normalize(vec3(uPointer.x * 0.38 + 0.12, uPointer.y * 0.38 + 0.22, 1.0));
    float diff = 0.95 + 0.08 * max(dot(N, keyDir), 0.0);

    // Subtle specular reflection across glasses lenses matching cursor movement
    vec2 uvCanvas = vec2(vUv.x, 1.0 - vUv.y);
    float leftLens = 1.0 - smoothstep(0.06, 0.105, length((uvCanvas - vec2(0.39, 0.455)) * vec2(1.0, 1.12)));
    float rightLens = 1.0 - smoothstep(0.06, 0.105, length((uvCanvas - vec2(0.62, 0.455)) * vec2(1.0, 1.12)));
    float lensMask = clamp(leftLens + rightLens, 0.0, 1.0);

    vec2 glintTarget = vec2(0.42, 0.44) + uPointer * 0.035;
    float glintL = exp(-dot(uvCanvas - glintTarget, uvCanvas - glintTarget) * 1400.0);
    float glintR = exp(-dot(uvCanvas - (glintTarget + vec2(0.23, 0.0)), uvCanvas - (glintTarget + vec2(0.23, 0.0))) * 1400.0);
    float pointerMag = clamp(length(uPointer), 0.0, 1.0);
    float glassesSheen = (glintL + glintR) * lensMask * (0.04 + pointerMag * 0.10);

    // Subtle futuristic rim halo on sculpted outer face silhouette when tilting
    float fresnel = pow(1.0 - max(dot(N, V), 0.0), 3.2);
    vec3 rimGlow = mix(vec3(0.22, 0.74, 0.97), vec3(0.55, 0.36, 0.96), 0.5 + 0.5 * uPointer.x) * fresnel * (0.08 + pointerMag * 0.10);

    // Smooth center-out clarity reveal that locks cleanly at full 1.0 opacity
    float revealRadius = smoothstep(0.0, 0.78, uPortraitBlend) * 0.58;
    float radialReveal = mix(smoothstep(revealRadius + 0.08, revealRadius - 0.10, r), 1.0, smoothstep(0.75, 0.95, uPortraitBlend));
    float waveBand = exp(-pow((r - revealRadius) / 0.028, 2.0)) * (1.0 - smoothstep(0.75, 0.95, uPortraitBlend));
    vec3 waveColor = vec3(0.22, 0.78, 1.0) * waveBand * 0.45;

    float finalAlpha = circleMask * radialReveal * smoothstep(0.0, 0.30, uPortraitBlend);
    if (finalAlpha < 0.01) discard;

    vec3 outColor = texel.rgb * diff + rimGlow + vec3(glassesSheen) + waveColor;
    gl_FragColor = vec4(outColor, finalAlpha);
    #include <colorspace_fragment>
  }
`;

export const InteractivePortfolioAvatar3D: React.FC<InteractivePortfolioAvatar3DProps> = ({ isDark }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const [webglFailed, setWebglFailed] = useState(false);
  const [pointerTiltFallback, setPointerTiltFallback] = useState({ rx: 0, ry: 0 });
  const [progressVisual, setProgressVisual] = useState(0);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const host = canvasHostRef.current;
    if (!wrapper || !host) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglFailed(true);
      return;
    }

    const gl = renderer.getContext();
    const isSoftwareGl = detectSoftwareWebGL(gl);
    const maxDpr = isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2);

    renderer.setPixelRatio(maxDpr);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.setClearColor(0x000000, 0);

    const width = host.clientWidth || 300;
    const height = host.clientHeight || 300;
    renderer.setSize(width, height, false);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 40);
    camera.position.set(0, 0, 5.45);

    const avatarGroup = new THREE.Group();
    scene.add(avatarGroup);

    // Subtle futuristic orbital frame ring behind the assembled portrait
    const ringGeo = new THREE.RingGeometry(1.015, 1.045, 96);
    const ringMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x38bdf8 : 0x2563eb,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.z = -0.11;
    avatarGroup.add(ringMesh);

    const outerRingGeo = new THREE.RingGeometry(1.07, 1.08, 96);
    const outerRingMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x818cf8 : 0x38bdf8,
      transparent: true,
      opacity: 0.2,
      side: THREE.DoubleSide,
    });
    const outerRingMesh = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerRingMesh.position.z = -0.13;
    avatarGroup.add(outerRingMesh);

    // Ambient floating digital motes kept cleanly within circular stage envelope
    const moteCount = 120;
    const motePositions = new Float32Array(moteCount * 3);
    const moteColors = new Float32Array(moteCount * 3);
    const tmpColor = new THREE.Color();
    for (let i = 0; i < moteCount; i++) {
      const theta = (i / moteCount) * Math.PI * 2 * 5.0 + i * 0.37;
      const rad = 0.62 + (((i * 73) % 100) / 100) * 0.56;
      motePositions[i * 3] = Math.cos(theta) * rad;
      motePositions[i * 3 + 1] = Math.sin(theta) * rad * 0.96;
      motePositions[i * 3 + 2] = (((i * 31) % 100) / 100 - 0.5) * 0.95;

      if (i % 3 === 0) {
        tmpColor.setHex(0x38bdf8);
      } else if (i % 3 === 1) {
        tmpColor.setHex(0x8b5cf6);
      } else {
        tmpColor.setHex(0xe0f2fe);
      }
      moteColors[i * 3] = tmpColor.r;
      moteColors[i * 3 + 1] = tmpColor.g;
      moteColors[i * 3 + 2] = tmpColor.b;
    }
    const moteGeo = new THREE.BufferGeometry();
    moteGeo.setAttribute('position', new THREE.BufferAttribute(motePositions, 3));
    moteGeo.setAttribute('color', new THREE.BufferAttribute(moteColors, 3));
    const moteMat = new THREE.PointsMaterial({
      size: 0.022,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const motePoints = new THREE.Points(moteGeo, moteMat);
    motePoints.frustumCulled = false;
    scene.add(motePoints);

    // Mutable handles disposed on cleanup
    let voxelMesh: THREE.Mesh | null = null;
    let voxelGeo: THREE.InstancedBufferGeometry | null = null;
    let voxelMat: THREE.ShaderMaterial | null = null;
    let portraitMesh: THREE.Mesh | null = null;
    let portraitGeo: THREE.PlaneGeometry | null = null;
    let portraitMat: THREE.ShaderMaterial | null = null;
    let portraitTexture: THREE.CanvasTexture | null = null;

    let disposed = false;
    let scrollProgress = prefersReducedMotion ? 1.0 : 0.0;
    let currentProgress = prefersReducedMotion ? 1.0 : 0.0;
    let targetPointerX = 0;
    let targetPointerY = 0;
    let currentPointerX = 0;
    let currentPointerY = 0;
    let isPointerInside = false;
    let lastReactStep = -1;

    // Load exact official avatar image (preferring compressed WebP with transparent JPG fallback)
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.decoding = 'async';
    let triedJpgFallback = false;
    img.src = AVATAR_IMAGE_WEBP;

    const isCompactViewport = window.innerWidth < 768;

    img.onload = () => {
      if (disposed) return;

      const texSize = isCompactViewport || isSoftwareGl ? 768 : 1024;
      const offscreen = document.createElement('canvas');
      offscreen.width = texSize;
      offscreen.height = texSize;
      const ctx = offscreen.getContext('2d');
      if (!ctx) return;

      // Exact object-cover object-top crop matching PortfolioPage's original <img>
      const srcSide = Math.min(img.width, img.height);
      const sx = img.width > img.height ? (img.width - srcSide) * 0.5 : 0;
      const sy = 0; // object-top
      ctx.drawImage(img, sx, sy, srcSide, srcSide, 0, 0, texSize, texSize);

      portraitTexture = new THREE.CanvasTexture(offscreen);
      portraitTexture.colorSpace = THREE.SRGBColorSpace;
      portraitTexture.minFilter = THREE.LinearMipmapLinearFilter;
      portraitTexture.magFilter = THREE.LinearFilter;
      portraitTexture.anisotropy = Math.min(isCompactViewport ? 4 : 8, renderer.capabilities.getMaxAnisotropy());
      portraitTexture.needsUpdate = true;

      // Adapt 3D micro-voxel density cleanly to device capability while keeping full assembled sharpness
      const grid = isCompactViewport || isSoftwareGl ? 50 : 68;
      const sampleCanvas = document.createElement('canvas');
      sampleCanvas.width = grid;
      sampleCanvas.height = grid;
      const sCtx = sampleCanvas.getContext('2d');
      if (!sCtx) return;
      sCtx.drawImage(offscreen, 0, 0, grid, grid);
      const pixels = sCtx.getImageData(0, 0, grid, grid).data;

      const targets: number[] = [];
      const scatters: number[] = [];
      const arcs: number[] = [];
      const spins: number[] = [];
      const colors: number[] = [];
      const stages: number[] = [];

      const span = 2.02;
      const voxelSize = (span / grid) * 0.96;

      // Deterministic pseudo-random generator for clean reproducible scattering
      let seed = 133742;
      const rand = () => {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        return seed / 4294967296;
      };

      for (let row = 0; row < grid; row++) {
        const vCanvas = (row + 0.5) / grid; // 0 top -> 1 bottom
        for (let col = 0; col < grid; col++) {
          const u = (col + 0.5) / grid; // 0 left -> 1 right
          const radialDist = Math.hypot(u - 0.5, vCanvas - 0.5);
          if (radialDist > 0.492) continue;

          const idx = (row * grid + col) * 4;
          const r = pixels[idx] / 255;
          const g = pixels[idx + 1] / 255;
          const b = pixels[idx + 2] / 255;

          // Target 3D position on sculpted portrait
          const tx = (u - 0.5) * span;
          const ty = (0.5 - vCanvas) * span;
          const tz = computePortraitReliefZ(u, vCanvas);
          targets.push(tx, ty, tz);

          // Scattered floating 3D spherical cloud well inside frustum (no square clipping)
          const angle = rand() * Math.PI * 2;
          const elevation = (rand() - 0.5) * Math.PI;
          const radius = 0.42 + rand() * 0.78;
          const sxPos = Math.cos(angle) * Math.cos(elevation) * radius;
          const syPos = Math.sin(elevation) * radius * 0.96;
          const szPos = (rand() - 0.45) * 1.15;
          scatters.push(sxPos, syPos, szPos);

          // Graceful curved flight arc perpendicular to displacement
          const arcScale = 0.18 + rand() * 0.24;
          arcs.push((rand() - 0.5) * arcScale, (rand() - 0.5) * arcScale, 0.18 + rand() * 0.32);

          // Tumble axis + phase
          spins.push(rand() - 0.5, rand() - 0.5, rand() - 0.5, rand());

          // Exact portrait pixel converted cleanly to linear space
          tmpColor.setRGB(r, g, b, THREE.SRGBColorSpace);
          colors.push(tmpColor.r, tmpColor.g, tmpColor.b);

          // Anatomical staged ordering
          stages.push(computeAssemblyStage(u, vCanvas, radialDist));
        }
      }

      const count = stages.length;
      const baseBox = new THREE.BoxGeometry(1, 1, 1);
      voxelGeo = new THREE.InstancedBufferGeometry();
      voxelGeo.index = baseBox.index;
      voxelGeo.attributes.position = baseBox.attributes.position;
      voxelGeo.attributes.normal = baseBox.attributes.normal;
      voxelGeo.instanceCount = count;

      voxelGeo.setAttribute('aTargetPos', new THREE.InstancedBufferAttribute(new Float32Array(targets), 3));
      voxelGeo.setAttribute('aScatterPos', new THREE.InstancedBufferAttribute(new Float32Array(scatters), 3));
      voxelGeo.setAttribute('aArcOffset', new THREE.InstancedBufferAttribute(new Float32Array(arcs), 3));
      voxelGeo.setAttribute('aSpin', new THREE.InstancedBufferAttribute(new Float32Array(spins), 4));
      voxelGeo.setAttribute('aColor', new THREE.InstancedBufferAttribute(new Float32Array(colors), 3));
      voxelGeo.setAttribute('aStage', new THREE.InstancedBufferAttribute(new Float32Array(stages), 1));

      voxelMat = new THREE.ShaderMaterial({
        vertexShader: VOXEL_VERTEX_SHADER,
        fragmentShader: VOXEL_FRAGMENT_SHADER,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uProgress: { value: currentProgress },
          uTime: { value: 0 },
          uVoxelSize: { value: voxelSize },
          uPortraitBlend: { value: 0 },
          uPointer: { value: new THREE.Vector2(0, 0) },
        },
      });

      voxelMesh = new THREE.Mesh(voxelGeo, voxelMat);
      voxelMesh.frustumCulled = false;
      voxelMesh.renderOrder = 1;
      avatarGroup.add(voxelMesh);

      // Sculpted high-res 3D portrait relief mesh rendered cleanly in front once resolving
      portraitGeo = new THREE.PlaneGeometry(span, span, 72, 72);
      const posAttr = portraitGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < posAttr.count; i++) {
        const px = posAttr.getX(i);
        const py = posAttr.getY(i);
        const u = px / span + 0.5;
        const vCanvas = 0.5 - py / span;
        posAttr.setZ(i, computePortraitReliefZ(u, vCanvas) + 0.028);
      }
      posAttr.needsUpdate = true;
      portraitGeo.computeVertexNormals();

      portraitMat = new THREE.ShaderMaterial({
        vertexShader: PORTRAIT_VERTEX_SHADER,
        fragmentShader: PORTRAIT_FRAGMENT_SHADER,
        transparent: true,
        depthWrite: true,
        uniforms: {
          uMap: { value: portraitTexture },
          uPortraitBlend: { value: 0 },
          uPointer: { value: new THREE.Vector2(0, 0) },
          uTime: { value: 0 },
        },
      });

      portraitMesh = new THREE.Mesh(portraitGeo, portraitMat);
      portraitMesh.renderOrder = 2;
      avatarGroup.add(portraitMesh);
    };

    img.onerror = () => {
      if (!triedJpgFallback) {
        triedJpgFallback = true;
        img.src = AVATAR_IMAGE_SRC;
        return;
      }
      if (!disposed) setWebglFailed(true);
    };

    // Synchronize scroll progress reliably via GSAP ScrollTrigger + live page scroll distance
    // so scrolling further guarantees 100% crisp clarity across every tab & screen size
    const computeLiveScrollProgress = () => {
      const maxPageScroll = Math.max(180, document.documentElement.scrollHeight - window.innerHeight);
      const assembleDistance = Math.max(220, Math.min(460, maxPageScroll * 0.55));
      return THREE.MathUtils.clamp(window.scrollY / assembleDistance, 0, 1);
    };

    let scrollTriggerInstance: ScrollTrigger | null = null;
    if (!prefersReducedMotion) {
      scrollProgress = computeLiveScrollProgress();
      const scrollState = { p: 0 };
      const tween = gsap.to(scrollState, {
        p: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: () => {
            const maxPageScroll = Math.max(180, document.documentElement.scrollHeight - window.innerHeight);
            return `+=${Math.round(Math.max(220, Math.min(460, maxPageScroll * 0.55)))}`;
          },
          scrub: 0.45,
          invalidateOnRefresh: true,
          onUpdate: () => {
            scrollProgress = computeLiveScrollProgress();
          },
        },
      });
      scrollTriggerInstance = tween.scrollTrigger ?? null;
    }

    // Track pointer anywhere in the viewport relative to the sticky bottom-right avatar's center
    const updatePointerFromClient = (clientX: number, clientY: number) => {
      const r = wrapper.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      const centerX = r.left + r.width * 0.5;
      const centerY = r.top + r.height * 0.5;
      const rangeX = Math.max(220, window.innerWidth * 0.42);
      const rangeY = Math.max(200, window.innerHeight * 0.42);
      const nx = (clientX - centerX) / rangeX;
      const ny = -(clientY - centerY) / rangeY;
      targetPointerX = THREE.MathUtils.clamp(nx, -1.1, 1.1);
      targetPointerY = THREE.MathUtils.clamp(ny, -1.1, 1.1);
    };

    const handlePointerMove = (e: PointerEvent) => {
      isPointerInside = true;
      updatePointerFromClient(e.clientX, e.clientY);
    };

    const handlePointerLeave = () => {
      isPointerInside = false;
      targetPointerX = 0;
      targetPointerY = 0;
    };

    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (isPointerInside || prefersReducedMotion) return;
      if (typeof e.gamma === 'number' && typeof e.beta === 'number') {
        targetPointerX = THREE.MathUtils.clamp(e.gamma / 32, -1, 1);
        targetPointerY = THREE.MathUtils.clamp((e.beta - 35) / 32, -1, 1);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave, { passive: true });
    window.addEventListener('blur', handlePointerLeave, { passive: true });
    window.addEventListener('deviceorientation', handleDeviceOrientation, { passive: true });

    // Responsive ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.max(120, Math.round(entry.contentRect.width));
        const h = Math.max(120, Math.round(entry.contentRect.height));
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
      }
      ScrollTrigger.refresh();
    });
    resizeObserver.observe(host);

    // Render loop (pre-allocated state, zero per-frame allocations, pauses automatically when tab hidden)
    let rafId = 0;
    let softTimeoutId = 0;
    let lastNow = performance.now();
    let elapsed = 0;
    let isPageHidden = document.visibilityState === 'hidden';

    const scheduleNextFrame = () => {
      if (disposed || isPageHidden) return;
      if (isSoftwareGl) {
        softTimeoutId = window.setTimeout(() => {
          rafId = window.requestAnimationFrame(tick);
        }, 16);
      } else {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    const tick = (now: number) => {
      if (disposed || isPageHidden) return;
      const dt = Math.min(0.05, Math.max(0.001, (now - lastNow) / 1000));
      lastNow = now;
      if (!prefersReducedMotion) elapsed += dt;

      // Damped scroll smoothing for silky particle motion
      if (!prefersReducedMotion) {
        scrollProgress = computeLiveScrollProgress();
      }
      currentProgress = prefersReducedMotion
        ? 1.0
        : THREE.MathUtils.damp(currentProgress, scrollProgress, 9.5, dt);

      // Start smoothly revealing clarity across 0.52 -> 0.96 so further scrolling makes it progressively sharper
      const portraitBlend = THREE.MathUtils.smoothstep(currentProgress, 0.52, 0.96);
      const interactionReady = currentProgress >= 0.85;

      // Smooth damped cursor gaze & head turn once assembled; returns smoothly to neutral outside
      const goalX = interactionReady ? targetPointerX : 0;
      const goalY = interactionReady ? targetPointerY : 0;
      const dampRate = isPointerInside ? 5.2 : 3.2;
      currentPointerX = THREE.MathUtils.damp(currentPointerX, goalX, dampRate, dt);
      currentPointerY = THREE.MathUtils.damp(currentPointerY, goalY, dampRate, dt);

      // Update React progress step subtly only on meaningful 10% boundaries (avoid unnecessary renders)
      const quantizedStep = Math.round(currentProgress * 10);
      if (quantizedStep !== lastReactStep) {
        lastReactStep = quantizedStep;
        setProgressVisual(currentProgress);
      }

      // Apply 3D head turn & subtle directional eye-gaze tilt + micro depth shift
      const yaw = currentPointerX * 0.30; // ~17 deg max turn
      const pitch = -currentPointerY * 0.21; // ~12 deg max tilt
      avatarGroup.rotation.y = yaw;
      avatarGroup.rotation.x = pitch;
      avatarGroup.position.x = currentPointerX * 0.045;
      avatarGroup.position.y = currentPointerY * 0.035 + (prefersReducedMotion ? 0 : Math.sin(elapsed * 1.4) * 0.012 * portraitBlend);

      // Subtle parallax counter-drift on orbital frame rings & background energy motes
      ringMat.opacity = 0.16 + currentProgress * 0.44;
      outerRingMat.opacity = 0.06 + currentProgress * 0.20;
      ringMesh.rotation.z = elapsed * 0.08;
      motePoints.rotation.y = -currentPointerX * 0.14 + elapsed * 0.035;
      motePoints.rotation.x = currentPointerY * 0.10;
      moteMat.opacity = 0.55 - portraitBlend * 0.35;

      if (voxelMesh) {
        voxelMesh.visible = portraitBlend < 0.992;
      }
      if (voxelMat) {
        voxelMat.uniforms.uProgress.value = currentProgress;
        voxelMat.uniforms.uTime.value = elapsed;
        voxelMat.uniforms.uPortraitBlend.value = portraitBlend;
        voxelMat.uniforms.uPointer.value.set(currentPointerX, currentPointerY);
      }
      if (portraitMat) {
        portraitMat.uniforms.uPortraitBlend.value = portraitBlend;
        portraitMat.uniforms.uPointer.value.set(currentPointerX, currentPointerY);
        portraitMat.uniforms.uTime.value = elapsed;
      }

      renderer.render(scene, camera);
      scheduleNextFrame();
    };

    const handleVisibilityChange = () => {
      isPageHidden = document.visibilityState === 'hidden';
      if (isPageHidden) {
        window.cancelAnimationFrame(rafId);
        window.clearTimeout(softTimeoutId);
      } else if (!disposed) {
        lastNow = performance.now();
        scheduleNextFrame();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    if (!isPageHidden) {
      rafId = window.requestAnimationFrame(tick);
    }

    return () => {
      disposed = true;
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(softTimeoutId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', handlePointerLeave);
      window.removeEventListener('blur', handlePointerLeave);
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
      if (scrollTriggerInstance) scrollTriggerInstance.kill();

      ringGeo.dispose();
      ringMat.dispose();
      outerRingGeo.dispose();
      outerRingMat.dispose();
      moteGeo.dispose();
      moteMat.dispose();
      if (voxelGeo) voxelGeo.dispose();
      if (voxelMat) voxelMat.dispose();
      if (portraitGeo) portraitGeo.dispose();
      if (portraitMat) portraitMat.dispose();
      if (portraitTexture) portraitTexture.dispose();

      renderer.dispose();
      if (renderer.domElement.parentNode === host) {
        host.removeChild(renderer.domElement);
      }
    };
  }, [isDark]);

  // Graceful fallback if WebGL is completely unavailable
  if (webglFailed) {
    return (
      <div
        ref={wrapperRef}
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
          const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
          setPointerTiltFallback({ rx: -ny * 10, ry: nx * 12 });
        }}
        onPointerLeave={() => setPointerTiltFallback({ rx: 0, ry: 0 })}
        className="relative flex items-center justify-center touch-pan-y"
        style={{ perspective: '900px' }}
      >
        <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-[#2563EB] via-[#38BDF8] to-[#BAE6FD] opacity-40 blur-xl pointer-events-none" />
        <motion.div
          animate={{ rotateX: pointerTiltFallback.rx, rotateY: pointerTiltFallback.ry }}
          transition={{ type: 'spring', stiffness: 180, damping: 20 }}
          className={`relative w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 rounded-full overflow-hidden border-4 shadow-2xl ${
            isDark ? 'border-[#38BDF8]/75 bg-[#0C1222]' : 'border-white bg-[#F3F6FA]'
          }`}
        >
          <img
            src={AVATAR_IMAGE_WEBP}
            loading="lazy"
            decoding="async"
            alt="Saad M — Official Portrait"
            className="w-full h-full object-cover object-top"
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      className="relative flex items-center justify-center touch-pan-y select-none"
      aria-label="Interactive 3D Portrait of Saad M"
    >
      {/* Ambient radial glow positioned cleanly behind the WebGL stage */}
      <motion.div
        aria-hidden="true"
        animate={{
          opacity: 0.24 + progressVisual * 0.28,
          scale: 0.92 + progressVisual * 0.1,
        }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="absolute w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 rounded-full bg-gradient-to-tr from-[#2563EB] via-[#38BDF8] to-[#8B5CF6] blur-2xl pointer-events-none"
      />

      {/* Spacious WebGL canvas stage sized for sticky bottom-right dock with zero edge clipping */}
      <div
        ref={canvasHostRef}
        className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 pointer-events-none"
      />
    </div>
  );
};

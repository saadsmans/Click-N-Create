import * as THREE from 'three';

export interface CloudDeckBuildResult {
  group: THREE.Group;
  update: (
    elapsedSeconds: number,
    scrollT: number,
    cameraPos: THREE.Vector3,
    cameraQuat: THREE.Quaternion
  ) => void;
  setTheme: (isDark: boolean) => void;
  setThemeFactor: (darkT: number) => void;
  dispose: () => void;
}

/**
 * Generates a high-resolution photorealistic volumetric cumulus cloud puff sprite
 * (1024x1024 on desktop/tablet highRes, 512x512 on mobile) using 5-octave FBM noise
 * with sunlit cauliflower tops & softly shadowed undersides.
 */
function createPhotorealCumulusTexture(highRes = true): THREE.CanvasTexture {
  const size = highRes ? 1024 : 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const img = ctx.createImageData(size, size);
  const data = img.data;

  // Deterministic smooth value noise + 5-octave FBM
  const hash = (ix: number, iy: number) => {
    const n = Math.sin(ix * 127.1 + iy * 311.7) * 43758.5453123;
    return n - Math.floor(n);
  };
  const vnoise = (x: number, y: number) => {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    const fx = x - ix;
    const fy = y - iy;
    const ux = fx * fx * (3 - 2 * fx);
    const uy = fy * fy * (3 - 2 * fy);
    const a = hash(ix, iy);
    const b = hash(ix + 1, iy);
    const c = hash(ix, iy + 1);
    const d = hash(ix + 1, iy + 1);
    return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
  };
  const fbm = (x: number, y: number) => {
    let v = 0;
    let amp = 0.52;
    let freq = 1.0;
    for (let o = 0; o < 5; o++) {
      v += amp * vnoise(x * freq, y * freq);
      freq *= 2.08;
      amp *= 0.5;
    }
    return v;
  };

  for (let y = 0; y < size; y++) {
    const ny = (y / size) * 2 - 1; // -1 top, +1 bottom
    for (let x = 0; x < size; x++) {
      const nx = (x / size) * 2 - 1;
      // Wide billowy cumulus silhouette (gently flattened base, heaped cauliflower upper lobes)
      const ellipR = Math.hypot(nx * 0.9, (ny + 0.08) * 1.16);
      const radialFalloff = Math.max(0, 1.0 - Math.pow(ellipR, 1.56));

      const n1 = fbm(nx * 2.75 + 4.2, ny * 2.75 + 1.9);
      const n2 = fbm(nx * 6.2 - 1.3, ny * 6.2 + 7.4);
      const density = Math.max(
        0,
        Math.min(1, radialFalloff * 1.36 + (n1 - 0.48) * 0.78 + (n2 - 0.5) * 0.28)
      );
      const alpha = Math.pow(Math.max(0, Math.min(1, (density - 0.12) / 0.72)), 1.24);

      // Vertical self-shadowing: crisp sunlit upper billow vs atmospheric shadowed base
      const topLight = Math.max(0, Math.min(1, 0.62 - ny * 0.46 + (n1 - 0.45) * 0.38));
      const idx = (y * size + x) * 4;
      data[idx] = Math.round(topLight * 255);
      data[idx + 1] = Math.round(n1 * 255);
      data[idx + 2] = Math.round(n2 * 255);
      data[idx + 3] = Math.round(alpha * 255);
    }
  }
  ctx.putImageData(img, 0, 0);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.NoColorSpace;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Builds an ultra-deep 5-strata Photorealistic Volumetric Cumulus Cloud Sea (y = 128..388)
 * soaring high above the Sunlit Azure / Golden-Hour Sunset Riverside Metropolis.
 * At scroll = 0%, the camera starts high ABOVE the stratospheric cloud sea (y = 392),
 * plunges deeply through 5 parting volumetric cumulus canyons across scroll 0% -> 24%,
 * and breaks cleanly beneath the cloud base into a sweeping collision-free Whole-City Panorama.
 */
export function buildCloudDescentDeck(
  initialDarkMode = false,
  highRes = true
): CloudDeckBuildResult {
  const group = new THREE.Group();
  group.name = 'photorealistic-deep-volumetric-cloud-deck';

  const disposables: { dispose: () => void }[] = [];
  const track = <T extends { dispose: () => void }>(item: T): T => {
    disposables.push(item);
    return item;
  };

  const cloudTex = track(createPhotorealCumulusTexture(highRes));

  // Custom GLSL ShaderMaterial:
  // - Light Mode: Crisp warm-ivory cumulus tops with soft natural slate-taupe undersides (zero cyan wash)
  // - Dark Mode: Cinematic deep midnight-navy clouds with silver-slate moonlight rim & warm amber city up-glow
  const cloudUniforms = {
    uMap: { value: cloudTex },
    uTime: { value: 0 },
    uIsDark: { value: initialDarkMode ? 1.0 : 0.0 },
    uGlobalFade: { value: 1.0 },
    uSunColor: { value: new THREE.Color(0xfcf7eb) },
    uShadowColor: { value: new THREE.Color(0x7c8fa6) },
    uNightRimColor: { value: new THREE.Color(0x6d8bb5) },
    uNightGlowColor: { value: new THREE.Color(0xe69c4a) },
    uNightBodyColor: { value: new THREE.Color(0x131d34) },
    uNightShadowColor: { value: new THREE.Color(0x080f1f) },
  };

  const cloudMat = track(
    new THREE.ShaderMaterial({
      uniforms: cloudUniforms,
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        varying float vCamDist;
        varying float vWorldY;

        void main() {
          vUv = uv;
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldY = worldPos.y;
          vec4 mvPos = viewMatrix * worldPos;
          vCamDist = -mvPos.z;
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D uMap;
        uniform float uIsDark;
        uniform float uGlobalFade;
        uniform vec3 uSunColor;
        uniform vec3 uShadowColor;
        uniform vec3 uNightRimColor;
        uniform vec3 uNightGlowColor;
        uniform vec3 uNightBodyColor;
        uniform vec3 uNightShadowColor;

        varying vec2 vUv;
        varying float vCamDist;
        varying float vWorldY;

        void main() {
          vec4 tex = texture2D(uMap, vUv);
          float alpha = tex.a;
          if (alpha < 0.01) discard;

          float topLit = tex.r;
          float nDetail = tex.g;

          // Altitude gradient: upper stratospheric clouds catch bright open sky light
          float altBoost = smoothstep(130.0, 380.0, vWorldY);

          // LIGHT MODE: Warm ivory cumulus tops with natural slate-taupe shadows
          vec3 dayCol = mix(uShadowColor, uSunColor, smoothstep(0.14, 0.78, topLit));
          dayCol += vec3(0.04, 0.035, 0.025) * altBoost;
          float dayEdgeRim = (1.0 - alpha) * smoothstep(0.24, 0.88, topLit) * 0.22;
          dayCol += vec3(0.99, 0.97, 0.92) * dayEdgeRim;

          // DARK MODE: Deep midnight navy clouds with silver moonlight rim & warm amber skyline up-glow
          float bellyLit = 1.0 - smoothstep(0.18, 0.80, topLit);
          vec3 nightCol = mix(uNightShadowColor, uNightBodyColor, smoothstep(0.18, 0.82, topLit));
          float nightEdge = (1.0 - alpha) * (0.28 + topLit * 0.44);
          nightCol += uNightRimColor * nightEdge * 0.42;
          float lowAltitudeGlow = smoothstep(350.0, 130.0, vWorldY);
          nightCol += uNightGlowColor * bellyLit * lowAltitudeGlow * (0.24 + nDetail * 0.22);

          vec3 col = mix(dayCol, nightCol, uIsDark);
          col *= (0.94 + nDetail * 0.11);

          float nearFade = smoothstep(12.0, 52.0, vCamDist);
          float farFade = 1.0 - smoothstep(520.0, 960.0, vCamDist);

          float outAlpha = alpha * nearFade * farFade * uGlobalFade * 0.9;
          if (outAlpha < 0.005) discard;
          gl_FragColor = vec4(col, outAlpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
  );

  // Camera-locked volumetric passing-cloud mist veil peaking smoothly during the deep cloud dive (t = 0.04..0.20)
  const mistUniforms = {
    uMap: { value: cloudTex },
    uTime: { value: 0 },
    uOpacity: { value: 0.0 },
    uColor: { value: new THREE.Color(initialDarkMode ? 0x0c1426 : 0xe4dfd4) },
  };
  const mistMat = track(
    new THREE.ShaderMaterial({
      uniforms: mistUniforms,
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D uMap;
        uniform float uTime;
        uniform float uOpacity;
        uniform vec3 uColor;
        varying vec2 vUv;

        void main() {
          vec2 uv1 = vUv * 1.18 + vec2(uTime * 0.007, 0.0);
          vec2 uv2 = (vUv - 0.5) * 0.86 + 0.5 - vec2(uTime * 0.005, 0.006);
          float c1 = texture2D(uMap, clamp(uv1, 0.01, 0.99)).a;
          float c2 = texture2D(uMap, clamp(uv2, 0.01, 0.99)).a;
          // Organic parting opening in the center so the riverside metropolis dramatically emerges beneath!
          float centerClear = smoothstep(0.06, 0.62, length(vUv - 0.5));
          float wisp = clamp((c1 * 0.65 + c2 * 0.58) * (0.45 + centerClear * 0.55), 0.0, 1.0);
          float a = wisp * uOpacity;
          if (a < 0.005) discard;
          gl_FragColor = vec4(uColor, a);
        }
      `,
      transparent: true,
      depthWrite: false,
      depthTest: false,
    })
  );

  const mistGroup = new THREE.Group();
  const mistPlane = new THREE.Mesh(track(new THREE.PlaneGeometry(18, 11)), mistMat);
  mistPlane.position.set(0, 0, -4.5);
  mistPlane.renderOrder = 60;
  mistGroup.add(mistPlane);
  group.add(mistGroup);

  interface CloudSpriteRef {
    mesh: THREE.Mesh;
    baseX: number;
    baseY: number;
    baseZ: number;
    driftSpeed: number;
    phase: number;
    partSign: number; // -1 left, +1 right, 0 ambient horizon
    strata: 'exosphere' | 'stratosphere' | 'upper' | 'mid' | 'lower' | 'horizon';
  }

  const cloudSprites: CloudSpriteRef[] = [];
  const planeGeo = track(new THREE.PlaneGeometry(1, 1));

  let seed = 4729;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  // STRATA 0A (High Above-Clouds Canopy: y = 324..384 — directly beneath & flanking the y = 392 starting camera!)
  const exosphereConfigs: [number, number, number, number, number][] = [
    [-76, 368, 336, 178, 76],
    [80, 370, 332, 182, 78],
    [-30, 354, 322, 146, 62],
    [34, 356, 318, 148, 62],
    [0, 344, 312, 152, 58],
    [-124, 358, 298, 192, 82],
    [128, 360, 294, 194, 82],
    [-58, 336, 290, 148, 62],
    [62, 338, 286, 150, 62],
    [-18, 326, 276, 134, 56],
    [22, 328, 272, 134, 56],
  ];

  exosphereConfigs.forEach(([x, y, z, w, h], idx) => {
    const m = new THREE.Mesh(planeGeo, cloudMat);
    m.position.set(x, y, z);
    m.scale.set(w, h, 1);
    m.renderOrder = 52 + idx;
    group.add(m);
    cloudSprites.push({
      mesh: m,
      baseX: x,
      baseY: y,
      baseZ: z,
      driftSpeed: 0.24 + rand() * 0.32,
      phase: rand() * Math.PI * 2,
      partSign: x < -6 ? -1 : x > 6 ? 1 : idx % 2 === 0 ? -1 : 1,
      strata: 'exosphere',
    });
  });

  // STRATA 0B (Stratosphere Cloud Ocean: y = 262..318)
  const stratosphereConfigs: [number, number, number, number, number][] = [
    [-68, 304, 292, 162, 70],
    [72, 306, 288, 166, 72],
    [-28, 288, 278, 132, 58],
    [32, 290, 274, 134, 58],
    [0, 278, 268, 142, 54],
    [-116, 292, 256, 180, 78],
    [120, 294, 252, 182, 78],
    [-54, 272, 246, 138, 60],
    [58, 274, 242, 140, 60],
    [-16, 264, 232, 122, 52],
    [18, 266, 228, 122, 52],
  ];

  stratosphereConfigs.forEach(([x, y, z, w, h], idx) => {
    const m = new THREE.Mesh(planeGeo, cloudMat);
    m.position.set(x, y, z);
    m.scale.set(w, h, 1);
    m.renderOrder = 42 + idx;
    group.add(m);
    cloudSprites.push({
      mesh: m,
      baseX: x,
      baseY: y,
      baseZ: z,
      driftSpeed: 0.28 + rand() * 0.36,
      phase: rand() * Math.PI * 2,
      partSign: x < -6 ? -1 : x > 6 ? 1 : idx % 2 === 0 ? -1 : 1,
      strata: 'stratosphere',
    });
  });

  // STRATA 1 (Upper Cloud Canyon Tops: y = 208..258)
  const upperCorridorConfigs: [number, number, number, number, number][] = [
    [-62, 250, 266, 144, 62],
    [66, 252, 262, 148, 64],
    [-26, 238, 252, 118, 52],
    [30, 240, 248, 120, 52],
    [-94, 230, 240, 156, 68],
    [98, 232, 236, 158, 68],
    [-40, 220, 230, 114, 50],
    [44, 218, 226, 116, 50],
    [0, 212, 216, 112, 46],
    [-78, 208, 206, 140, 60],
    [82, 210, 204, 142, 60],
  ];

  upperCorridorConfigs.forEach(([x, y, z, w, h], idx) => {
    const m = new THREE.Mesh(planeGeo, cloudMat);
    m.position.set(x, y, z);
    m.scale.set(w, h, 1);
    m.renderOrder = 32 + idx;
    group.add(m);
    cloudSprites.push({
      mesh: m,
      baseX: x,
      baseY: y,
      baseZ: z,
      driftSpeed: 0.32 + rand() * 0.42,
      phase: rand() * Math.PI * 2,
      partSign: x < -5 ? -1 : x > 5 ? 1 : idx % 2 === 0 ? -1 : 1,
      strata: 'upper',
    });
  });

  // STRATA 2 (Thick Mid-Deck Cloud Canyon: y = 160..204 — parts wide left & right as you descend!)
  const midCorridorConfigs: [number, number, number, number, number][] = [
    [-54, 196, 234, 130, 56],
    [58, 198, 230, 132, 56],
    [-20, 186, 224, 104, 48],
    [26, 188, 220, 106, 48],
    [-82, 180, 210, 138, 58],
    [86, 178, 206, 140, 58],
    [-34, 170, 200, 100, 46],
    [38, 168, 196, 102, 46],
    [-64, 162, 184, 124, 54],
    [68, 160, 180, 126, 54],
  ];

  midCorridorConfigs.forEach(([x, y, z, w, h], idx) => {
    const m = new THREE.Mesh(planeGeo, cloudMat);
    m.position.set(x, y, z);
    m.scale.set(w, h, 1);
    m.renderOrder = 22 + idx;
    group.add(m);
    cloudSprites.push({
      mesh: m,
      baseX: x,
      baseY: y,
      baseZ: z,
      driftSpeed: 0.36 + rand() * 0.45,
      phase: rand() * Math.PI * 2,
      partSign: x < 0 ? -1 : 1,
      strata: 'mid',
    });
  });

  // STRATA 3 (Lower Cloud Base: y = 130..158 — unveils the collision-free Whole-City Panorama!)
  const lowerCorridorConfigs: [number, number, number, number, number][] = [
    [-84, 152, 194, 130, 52],
    [88, 150, 190, 132, 52],
    [-42, 144, 180, 100, 42],
    [46, 142, 176, 102, 42],
    [-106, 136, 152, 144, 56],
    [110, 134, 148, 146, 56],
    [-62, 130, 134, 108, 44],
    [66, 128, 130, 110, 44],
  ];

  lowerCorridorConfigs.forEach(([x, y, z, w, h], idx) => {
    const m = new THREE.Mesh(planeGeo, cloudMat);
    m.position.set(x, y, z);
    m.scale.set(w, h, 1);
    m.renderOrder = 14 + idx;
    group.add(m);
    cloudSprites.push({
      mesh: m,
      baseX: x,
      baseY: y,
      baseZ: z,
      driftSpeed: 0.3 + rand() * 0.4,
      phase: rand() * Math.PI * 2,
      partSign: x < 0 ? -1 : 1,
      strata: 'lower',
    });
  });

  // Vast High-Altitude 360deg Horizon Cloud Sea Ring (76 sweeping banks spanning y = 126..345!)
  for (let i = 0; i < 76; i++) {
    const ang = (i / 76) * Math.PI * 2 + (rand() - 0.5) * 0.1;
    const rad = 195 + rand() * 265;
    const x = Math.sin(ang) * rad;
    const z = 45 + Math.cos(ang) * rad;
    const y = 126 + rand() * 218;
    const w = 140 + rand() * 135;
    const h = 46 + rand() * 44;

    const m = new THREE.Mesh(planeGeo, cloudMat);
    m.position.set(x, y, z);
    m.scale.set(w, h, 1);
    m.renderOrder = 3 + (i % 10);
    group.add(m);
    cloudSprites.push({
      mesh: m,
      baseX: x,
      baseY: y,
      baseZ: z,
      driftSpeed: 0.22 + rand() * 0.45,
      phase: rand() * Math.PI * 2,
      partSign: 0,
      strata: 'horizon',
    });
  }

  const update = (
    elapsedSeconds: number,
    scrollT: number,
    cameraPos: THREE.Vector3,
    cameraQuat: THREE.Quaternion
  ) => {
    cloudUniforms.uTime.value = elapsedSeconds;
    mistUniforms.uTime.value = elapsedSeconds;

    // Clouds stay crisp and photogenic overhead (matching the dramatic clouds above the skyline in both photos!)
    const deckVisibility = THREE.MathUtils.lerp(
      1.0,
      0.72,
      THREE.MathUtils.smoothstep(scrollT, 0.38, 0.65)
    );
    cloudUniforms.uGlobalFade.value = deckVisibility;

    // Deep volumetric passing-cloud mist veil peaks cleanly across t = 0.04..0.19 during the cloud dive,
    // then clears crisply by t = 0.24 to unveil the sweeping panoramic riverside metropolis!
    const mistStrength =
      scrollT < 0.24
        ? Math.sin(THREE.MathUtils.clamp((scrollT - 0.01) / 0.23, 0, 1) * Math.PI) * 0.52
        : 0.0;
    mistUniforms.uOpacity.value = mistStrength;
    mistGroup.visible = mistStrength > 0.008;
    if (mistGroup.visible) {
      mistGroup.position.copy(cameraPos);
      mistGroup.quaternion.copy(cameraQuat);
    }

    // Dynamic corridor parting so clouds dramatically open a wide cinematic viewport as you descend!
    const partExo = THREE.MathUtils.smoothstep(scrollT, 0.0, 0.09) * 38.0;
    const partStrat = THREE.MathUtils.smoothstep(scrollT, 0.03, 0.13) * 40.0;
    const partUpper = THREE.MathUtils.smoothstep(scrollT, 0.06, 0.17) * 44.0;
    const partMid = THREE.MathUtils.smoothstep(scrollT, 0.10, 0.22) * 46.0;
    const partLower = THREE.MathUtils.smoothstep(scrollT, 0.15, 0.26) * 38.0;

    for (let i = 0; i < cloudSprites.length; i++) {
      const c = cloudSprites[i];
      const driftX = Math.sin(elapsedSeconds * 0.03 * c.driftSpeed + c.phase) * 12.0;
      const partOffset =
        c.strata === 'exosphere'
          ? c.partSign * partExo
          : c.strata === 'stratosphere'
            ? c.partSign * partStrat
            : c.strata === 'upper'
              ? c.partSign * partUpper
              : c.strata === 'mid'
                ? c.partSign * partMid
                : c.strata === 'lower'
                  ? c.partSign * partLower
                  : 0;
      c.mesh.position.set(c.baseX + driftX + partOffset, c.baseY, c.baseZ);
      c.mesh.quaternion.copy(cameraQuat);
    }
  };

  const _dayMistColor = new THREE.Color(0xe4dfd4);
  const _nightMistColor = new THREE.Color(0x0c1426);

  const setThemeFactor = (darkT: number) => {
    const t = THREE.MathUtils.clamp(darkT, 0, 1);
    cloudUniforms.uIsDark.value = t;
    mistUniforms.uColor.value.copy(_dayMistColor).lerp(_nightMistColor, t);
  };

  const setTheme = (isDark: boolean) => {
    setThemeFactor(isDark ? 1.0 : 0.0);
  };

  return {
    group,
    update,
    setTheme,
    setThemeFactor,
    dispose: () => {
      disposables.forEach((d) => d.dispose());
    },
  };
}

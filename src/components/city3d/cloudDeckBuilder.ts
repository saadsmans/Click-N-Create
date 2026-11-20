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
  dispose: () => void;
}

/**
 * Generates a high-resolution 512x512 photorealistic volumetric cumulus cloud puff sprite
 * using multi-octave procedural FBM noise with sunlit cauliflower tops & softly shadowed undersides.
 */
function createPhotorealCumulusTexture(): THREE.CanvasTexture {
  const size = 512;
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
      const ellipR = Math.hypot(nx * 0.92, (ny + 0.08) * 1.15);
      const radialFalloff = Math.max(0, 1.0 - Math.pow(ellipR, 1.58));

      const n1 = fbm(nx * 2.75 + 4.2, ny * 2.75 + 1.9);
      const n2 = fbm(nx * 6.2 - 1.3, ny * 6.2 + 7.4);
      const density = Math.max(
        0,
        Math.min(1, radialFalloff * 1.34 + (n1 - 0.48) * 0.76 + (n2 - 0.5) * 0.28)
      );
      const alpha = Math.pow(Math.max(0, Math.min(1, (density - 0.13) / 0.72)), 1.28);

      // Vertical self-shadowing: crisp sunlit upper billow vs cool atmospheric shadowed base
      const topLight = Math.max(0, Math.min(1, 0.62 - ny * 0.45 + (n1 - 0.45) * 0.38));
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
 * Builds an ultra-deep 4-strata Photorealistic Volumetric Cumulus Cloud Sea (y = 124..322)
 * soaring high above the Futuristic Blue-Glass Metropolis.
 * At scroll = 0%, the camera starts high ABOVE the sunlit/moonlit upper cloud ocean (y = 315),
 * plunges deeply through 4 parting volumetric cumulus & cirrus canyons across scroll 0% -> 24%,
 * and breaks cleanly beneath the cloud base into a sweeping collision-free Whole-City Panorama.
 */
export function buildCloudDescentDeck(initialDarkMode = false): CloudDeckBuildResult {
  const group = new THREE.Group();
  group.name = 'photorealistic-deep-volumetric-cloud-deck';

  const disposables: { dispose: () => void }[] = [];
  const track = <T extends { dispose: () => void }>(item: T): T => {
    disposables.push(item);
    return item;
  };

  const cloudTex = track(createPhotorealCumulusTexture());

  // Custom GLSL ShaderMaterial with luminous platinum-sunlit tops, sapphire-slate undersides,
  // multi-altitude scattering, and buttery camera-proximity soft dissolve (zero hard clipping!)
  const cloudUniforms = {
    uMap: { value: cloudTex },
    uTime: { value: 0 },
    uIsDark: { value: initialDarkMode ? 1.0 : 0.0 },
    uGlobalFade: { value: 1.0 },
    uSunColor: { value: new THREE.Color(0xfafcff) },
    uShadowColor: { value: new THREE.Color(0x84a8cf) },
    uNightTopColor: { value: new THREE.Color(0x365078) },
    uNightShadowColor: { value: new THREE.Color(0x0b162a) },
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
        uniform vec3 uNightTopColor;
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

          // Altitude illumination gradient: upper stratospheric cloud sea catches brilliant sun/moonlight
          float altBoost = smoothstep(125.0, 310.0, vWorldY);

          // Photographic sunlit platinum-white cumulus vs moonlit sapphire-silver night clouds
          vec3 dayCol = mix(uShadowColor, uSunColor, smoothstep(0.14, 0.84, topLit));
          dayCol += vec3(0.06, 0.07, 0.09) * altBoost;
          // Crisp silver-lining atmospheric forward scattering along thin sunlit cloud rims
          float edgeRim = (1.0 - alpha) * smoothstep(0.28, 0.9, topLit) * 0.25;
          dayCol += vec3(0.95, 0.98, 1.0) * edgeRim;

          vec3 nightCol = mix(uNightShadowColor, uNightTopColor, smoothstep(0.14, 0.88, topLit));
          nightCol += vec3(0.16, 0.28, 0.46) * (1.0 - alpha) * 0.22;
          // Luminous cool sapphire-cyan metropolitan bounce lighting on lower cloud bellies at night
          float bellyBounce = (1.0 - topLit) * smoothstep(215.0, 125.0, vWorldY);
          nightCol += vec3(0.11, 0.26, 0.48) * bellyBounce * 0.56;

          vec3 col = mix(dayCol, nightCol, uIsDark);
          col *= (0.93 + nDetail * 0.11);

          // Silky-smooth proximity dissolve as the camera plunges deep through each cumulus stratum
          float nearFade = smoothstep(10.0, 48.0, vCamDist);
          float farFade = 1.0 - smoothstep(460.0, 860.0, vCamDist);

          float outAlpha = alpha * nearFade * farFade * uGlobalFade * 0.92;
          if (outAlpha < 0.005) discard;
          gl_FragColor = vec4(col, outAlpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
  );

  // Camera-locked volumetric passing-cloud mist veil that peaks as you plunge deep through the thick mid-deck (t = 0.05..0.19)
  const mistUniforms = {
    uMap: { value: cloudTex },
    uTime: { value: 0 },
    uOpacity: { value: 0.0 },
    uColor: { value: new THREE.Color(initialDarkMode ? 0x101f38 : 0xedf4fc) },
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
          // Organic parting opening in the center so the futuristic skyline dramatically emerges beneath!
          float centerClear = smoothstep(0.06, 0.6, length(vUv - 0.5));
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
    strata: 'stratosphere' | 'upper' | 'mid' | 'lower' | 'horizon';
  }

  const cloudSprites: CloudSpriteRef[] = [];
  const planeGeo = track(new THREE.PlaneGeometry(1, 1));

  let seed = 4729;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  // STRATA 0 (High Above-Clouds Ocean: y = 258..316, sprawling right below & flanking the y = 315 starting lens!)
  const stratosphereConfigs: [number, number, number, number, number][] = [
    [-68, 296, 286, 156, 68],
    [72, 298, 282, 160, 70],
    [-28, 282, 272, 128, 56],
    [32, 284, 268, 130, 56],
    [0, 272, 264, 138, 52],
    [-112, 286, 250, 174, 76],
    [116, 288, 248, 176, 76],
    [-54, 268, 240, 134, 58],
    [58, 270, 238, 136, 58],
    [-16, 260, 226, 118, 50],
    [18, 262, 224, 118, 50],
  ];

  stratosphereConfigs.forEach(([x, y, z, w, h], idx) => {
    const m = new THREE.Mesh(planeGeo, cloudMat);
    m.position.set(x, y, z);
    m.scale.set(w, h, 1);
    m.renderOrder = 44 + idx;
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

  // STRATA 1 (Upper Cloud Canyon Tops: y = 204..256)
  const upperCorridorConfigs: [number, number, number, number, number][] = [
    [-62, 246, 262, 140, 62],
    [66, 248, 258, 144, 62],
    [-26, 234, 248, 114, 52],
    [30, 236, 246, 116, 52],
    [-92, 226, 236, 152, 66],
    [96, 228, 234, 154, 66],
    [-40, 218, 228, 112, 50],
    [44, 216, 224, 114, 50],
    [0, 210, 214, 110, 46],
    [-76, 206, 204, 138, 60],
    [80, 208, 202, 140, 60],
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

  // STRATA 2 (Thick Mid-Deck Cloud Canyon: y = 158..202 — parts wide left & right as you descend!)
  const midCorridorConfigs: [number, number, number, number, number][] = [
    [-54, 194, 232, 128, 56],
    [58, 196, 228, 130, 56],
    [-20, 184, 222, 102, 48],
    [26, 186, 218, 104, 48],
    [-82, 178, 208, 136, 58],
    [86, 176, 204, 138, 58],
    [-34, 168, 198, 98, 46],
    [38, 166, 194, 100, 46],
    [-64, 160, 182, 122, 54],
    [68, 158, 178, 124, 54],
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

  // STRATA 3 (Lower Cloud Base: y = 126..156 — unveils the collision-free Whole-City Panorama!)
  const lowerCorridorConfigs: [number, number, number, number, number][] = [
    [-84, 150, 192, 128, 52],
    [88, 148, 188, 130, 52],
    [-42, 142, 178, 98, 42],
    [46, 140, 174, 100, 42],
    [-104, 134, 150, 142, 56],
    [108, 132, 146, 144, 56],
    [-62, 128, 132, 106, 44],
    [66, 126, 128, 108, 44],
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

  // Vast High-Altitude 360deg Horizon Cloud Sea Ring (64 sweeping banks spanning y = 122..295!)
  for (let i = 0; i < 64; i++) {
    const ang = (i / 64) * Math.PI * 2 + (rand() - 0.5) * 0.11;
    const rad = 185 + rand() * 235;
    const x = Math.sin(ang) * rad;
    const z = 45 + Math.cos(ang) * rad;
    const y = 122 + rand() * 172;
    const w = 135 + rand() * 125;
    const h = 48 + rand() * 42;

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

    // Clouds stay crisp overhead even at street level, gently softening down in the residential crescent
    const deckVisibility = THREE.MathUtils.lerp(
      1.0,
      0.56,
      THREE.MathUtils.smoothstep(scrollT, 0.36, 0.62)
    );
    cloudUniforms.uGlobalFade.value = deckVisibility;

    // Deep volumetric passing-cloud mist veil peaks cleanly across t = 0.05..0.18 during the cloud dive,
    // then clears crisply by t = 0.23 to unveil the sweeping panoramic metropolis!
    const mistStrength =
      scrollT < 0.24
        ? Math.sin(THREE.MathUtils.clamp((scrollT - 0.01) / 0.23, 0, 1) * Math.PI) * 0.58
        : 0.0;
    mistUniforms.uOpacity.value = mistStrength;
    mistGroup.visible = mistStrength > 0.008;
    if (mistGroup.visible) {
      mistGroup.position.copy(cameraPos);
      mistGroup.quaternion.copy(cameraQuat);
    }

    // Dynamic corridor parting so clouds dramatically open a wide cinematic viewport as you descend!
    const partStrat = THREE.MathUtils.smoothstep(scrollT, 0.01, 0.12) * 34.0;
    const partUpper = THREE.MathUtils.smoothstep(scrollT, 0.04, 0.16) * 38.0;
    const partMid = THREE.MathUtils.smoothstep(scrollT, 0.08, 0.21) * 44.0;
    const partLower = THREE.MathUtils.smoothstep(scrollT, 0.14, 0.26) * 36.0;

    for (let i = 0; i < cloudSprites.length; i++) {
      const c = cloudSprites[i];
      const driftX = Math.sin(elapsedSeconds * 0.03 * c.driftSpeed + c.phase) * 12.0;
      const partOffset =
        c.strata === 'stratosphere'
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

  const setTheme = (isDark: boolean) => {
    cloudUniforms.uIsDark.value = isDark ? 1.0 : 0.0;
    mistUniforms.uColor.value.setHex(isDark ? 0x101f38 : 0xedf4fc);
  };

  return {
    group,
    update,
    setTheme,
    dispose: () => {
      disposables.forEach((d) => d.dispose());
    },
  };
}

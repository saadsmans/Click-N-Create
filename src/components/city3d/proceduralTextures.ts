import * as THREE from 'three';

function finalizeColorTexture(
  tex: THREE.CanvasTexture,
  anisotropy: number,
  repeatX = 1,
  repeatY = 1
): THREE.CanvasTexture {
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = Math.min(Math.max(anisotropy, 4), 16);
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  if (repeatX !== 1 || repeatY !== 1) {
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeatX, repeatY);
  }
  tex.needsUpdate = true;
  return tex;
}

function finalizeDataTexture(
  tex: THREE.Texture,
  anisotropy: number,
  repeatX = 1,
  repeatY = 1
): THREE.Texture {
  tex.colorSpace = THREE.NoColorSpace;
  tex.anisotropy = Math.min(Math.max(anisotropy, 4), 16);
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  if (repeatX !== 1 || repeatY !== 1) {
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeatX, repeatY);
  }
  tex.needsUpdate = true;
  return tex;
}

/**
 * Generates a linear tangent-space RGB Normal Map from a grayscale height canvas (fast Sobel filter).
 */
function heightCanvasToNormalTexture(
  heightCanvas: HTMLCanvasElement,
  strength: number,
  anisotropy: number,
  repeatX = 1,
  repeatY = 1
): THREE.DataTexture {
  const w = heightCanvas.width;
  const h = heightCanvas.height;
  const ctx = heightCanvas.getContext('2d')!;
  const src = ctx.getImageData(0, 0, w, h).data;
  const out = new Uint8Array(w * h * 4);
  const scale = strength / 255;

  for (let y = 0; y < h; y++) {
    const ym1 = (y === 0 ? h - 1 : y - 1) * w;
    const y0 = y * w;
    const yp1 = (y === h - 1 ? 0 : y + 1) * w;

    for (let x = 0; x < w; x++) {
      const xm1 = x === 0 ? w - 1 : x - 1;
      const xp1 = x === w - 1 ? 0 : x + 1;

      const tl = src[(ym1 + xm1) << 2];
      const t = src[(ym1 + x) << 2];
      const tr = src[(ym1 + xp1) << 2];
      const l = src[(y0 + xm1) << 2];
      const r = src[(y0 + xp1) << 2];
      const bl = src[(yp1 + xm1) << 2];
      const b = src[(yp1 + x) << 2];
      const br = src[(yp1 + xp1) << 2];

      const dX = (tr + 2 * r + br - (tl + 2 * l + bl)) * scale;
      const dY = (bl + 2 * b + br - (tl + 2 * t + tr)) * scale;
      const invLen = 1 / Math.hypot(dX, dY, 1.0);

      const idx = (y0 + x) << 2;
      out[idx] = Math.round((-dX * invLen * 0.5 + 0.5) * 255);
      out[idx + 1] = Math.round((dY * invLen * 0.5 + 0.5) * 255);
      out[idx + 2] = Math.round((invLen * 0.5 + 0.5) * 255);
      out[idx + 3] = 255;
    }
  }

  const tex = new THREE.DataTexture(out, w, h, THREE.RGBAFormat);
  tex.flipY = true;
  tex.generateMipmaps = true;
  return finalizeDataTexture(tex, anisotropy, repeatX, repeatY) as THREE.DataTexture;
}

export interface SkyscraperPbrSet {
  darkMap: THREE.CanvasTexture;
  darkEmissiveMap: THREE.CanvasTexture;
  lightMap: THREE.CanvasTexture;
  normalMap: THREE.DataTexture;
  roughnessMap: THREE.CanvasTexture;
  dispose: () => void;
}

/**
 * Neo-Luxury Architectural Smoked-Bronze & Graphite Curtain-Wall PBR Set:
 * - Daytime: Variable-bay smoked bronze & graphite glass panes with champagne-metallic mullions,
 *   sandstone/terracotta architectural spandrel bands & double-height sky-lounge galleries.
 * - Nighttime: Warm amber-gold & honey interior illumination framed by dark graphite mullions (Zero cyan neon).
 */
export function createSkyscraperPbrSet(anisotropy = 8, highRes = true): SkyscraperPbrSet {
  const size = highRes ? 2048 : 1024;
  const rows = 20;
  const padX = Math.round(size * 0.0055);
  const padY = Math.round(size * 0.006);
  const cellH = size / rows;

  const darkCanvas = document.createElement('canvas');
  darkCanvas.width = size;
  darkCanvas.height = size;
  const dCtx = darkCanvas.getContext('2d')!;

  const emissiveCanvas = document.createElement('canvas');
  emissiveCanvas.width = size;
  emissiveCanvas.height = size;
  const eCtx = emissiveCanvas.getContext('2d')!;

  const lightCanvas = document.createElement('canvas');
  lightCanvas.width = size;
  lightCanvas.height = size;
  const lCtx = lightCanvas.getContext('2d')!;

  const mapSize = highRes ? 1024 : 512;
  const heightCanvas = document.createElement('canvas');
  heightCanvas.width = mapSize;
  heightCanvas.height = mapSize;
  const hCtx = heightCanvas.getContext('2d')!;

  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = mapSize;
  roughCanvas.height = mapSize;
  const rCtx = roughCanvas.getContext('2d')!;

  // Dark graphite structural frame & champagne-bronze highlights
  dCtx.fillStyle = '#0D1119';
  dCtx.fillRect(0, 0, size, size);

  eCtx.fillStyle = '#000000';
  eCtx.fillRect(0, 0, size, size);

  lCtx.fillStyle = '#252932';
  lCtx.fillRect(0, 0, size, size);

  hCtx.fillStyle = '#ECECEC';
  hCtx.fillRect(0, 0, mapSize, mapSize);

  rCtx.fillStyle = '#A8A8A8';
  rCtx.fillRect(0, 0, mapSize, mapSize);

  let seed = 3071;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  // Night interiors: rich warm amber, honey-champagne & soft candlelight executive suites
  const realisticNightOfficeLights = [
    ['#FFEBC2', '#D89A48'],
    ['#FFE2AA', '#C47F32'],
    ['#FFF2D6', '#CA9E5F'],
    ['#F7D9A4', '#A86E34'],
    ['#FFE8BC', '#D49242'],
  ];

  // Daytime glazing: Smoked Bronze-Graphite & Deep Emerald-Smoke Architectural Glass
  const realisticDayGlass = [
    ['#2A333E', '#171C24'],
    ['#36342F', '#1D1C19'],
    ['#233934', '#13221F'],
    ['#323942', '#1C2229'],
    ['#3B352B', '#211E18'],
  ];

  const sc = mapSize / size;
  // Asymmetric architectural bay layouts per tier to eliminate repetitive grids
  const bayPatterns = [
    [0.14, 0.11, 0.22, 0.11, 0.14, 0.16, 0.12],
    [0.18, 0.12, 0.14, 0.12, 0.18, 0.14, 0.12],
    [0.25, 0.12, 0.26, 0.12, 0.25],
    [0.12, 0.18, 0.10, 0.20, 0.10, 0.18, 0.12],
  ];

  for (let r = 0; r < rows; r++) {
    const floorOccupancy = rand() > 0.26 ? 0.62 : 0.32;
    const floorTintIdx = Math.floor(rand() * realisticNightOfficeLights.length);
    const isMechanicalFloor = r === 7 || r === 15;
    const isSkyLounge = r === 4 || r === 12;
    const pattern = bayPatterns[(Math.floor(r / 3) + (r === 12 ? 1 : 0)) % bayPatterns.length];

    let curX = 0;
    for (let c = 0; c < pattern.length; c++) {
      const bayFrac = pattern[c];
      const cellW = size * bayFrac;
      const litRoll = rand();
      const x = Math.round(curX + padX);
      const y = Math.round(r * cellH + padY);
      const w = Math.round(cellW - padX * 2);
      const h = Math.round(cellH - padY * 2);
      curX += cellW;

      const mx = Math.round(x * sc);
      const my = Math.round(y * sc);
      const mw = Math.max(2, Math.round(w * sc));
      const mh = Math.max(2, Math.round(h * sc));

      hCtx.fillStyle = isMechanicalFloor ? '#9E9E9E' : '#222222';
      hCtx.fillRect(mx, my, mw, mh);

      rCtx.fillStyle = isMechanicalFloor ? '#B8B8B8' : '#0B0B0B';
      rCtx.fillRect(mx, my, mw, mh);

      if (isMechanicalFloor) {
        // Architectural terracotta/bronze louver mechanical band with champagne trim
        dCtx.fillStyle = '#101520';
        dCtx.fillRect(x, y, w, h);
        lCtx.fillStyle = '#332C28';
        lCtx.fillRect(x, y, w, h);
        dCtx.fillStyle = '#070A10';
        lCtx.fillStyle = '#1E1B1A';
        for (let ly = y + 4; ly < y + h; ly += 6) {
          dCtx.fillRect(x, ly, w, 2);
          lCtx.fillRect(x, ly, w, 2);
        }
        lCtx.fillStyle = r === 7 ? '#B86B4B' : '#D4BA8B';
        lCtx.fillRect(x, y + Math.round(h * 0.42), w, 5);
        dCtx.fillStyle = '#D99E4E';
        dCtx.fillRect(x, y + Math.round(h * 0.44), w, 2);
        eCtx.fillStyle = '#B87A32';
        eCtx.fillRect(x, y + Math.round(h * 0.44), w, 2);
        continue;
      }

      if (isSkyLounge) {
        // Double-aspect Warm Amber & Bronze Executive Sky-Lounge Gallery
        const slGrad = dCtx.createLinearGradient(x, y, x, y + h);
        slGrad.addColorStop(0, '#FFF1CF');
        slGrad.addColorStop(0.55, '#DF9F4C');
        slGrad.addColorStop(1, '#2B221A');
        dCtx.fillStyle = slGrad;
        dCtx.fillRect(x, y, w, h);
        eCtx.fillStyle = slGrad;
        eCtx.fillRect(x + 2, y + 2, w - 4, h - 4);

        const lSl = lCtx.createLinearGradient(x, y, x + w, y + h);
        lSl.addColorStop(0, '#29493D');
        lSl.addColorStop(0.55, '#1D2926');
        lSl.addColorStop(1, '#484035');
        lCtx.fillStyle = lSl;
        lCtx.fillRect(x, y, w, h);
        lCtx.fillStyle = '#D4BA8B';
        lCtx.fillRect(x, y + 1, w, 4);
        continue;
      }

      // NIGHT MODE: Deep midnight smoked glazing + warm amber executive interiors
      if (litRoll < floorOccupancy * 0.62) {
        const [cTop, cBot] =
          realisticNightOfficeLights[
            (floorTintIdx + (c % 2)) % realisticNightOfficeLights.length
          ];
        const grad = dCtx.createLinearGradient(x, y, x, y + h);
        grad.addColorStop(0, cTop);
        grad.addColorStop(0.62, cBot);
        grad.addColorStop(1, '#261D17');
        dCtx.fillStyle = grad;
        dCtx.fillRect(x, y, w, h);

        eCtx.fillStyle = grad;
        eCtx.fillRect(x + 2, y + 2, w - 4, h - 4);

        // Warm architectural linear ceiling cove bar
        dCtx.fillStyle = 'rgba(255, 244, 214, 0.9)';
        dCtx.fillRect(x + 6, y + 3, w - 12, 3);
        eCtx.fillStyle = '#FFECC4';
        eCtx.fillRect(x + 6, y + 3, w - 12, 3);

        if (rand() > 0.35) {
          const deskW = Math.round(w * (0.35 + rand() * 0.35));
          const deskX = x + Math.round(rand() * (w - deskW));
          dCtx.fillStyle = 'rgba(14, 16, 22, 0.62)';
          dCtx.fillRect(deskX, y + Math.round(h * 0.65), deskW, Math.round(h * 0.35));
          eCtx.fillStyle = 'rgba(0, 0, 0, 0.72)';
          eCtx.fillRect(deskX, y + Math.round(h * 0.65), deskW, Math.round(h * 0.35));
        }
        if (rand() > 0.48) {
          const blindH = Math.round(h * (0.2 + rand() * 0.28));
          dCtx.fillStyle = 'rgba(12, 16, 26, 0.66)';
          dCtx.fillRect(x, y, w, blindH);
          eCtx.fillStyle = 'rgba(0, 0, 0, 0.72)';
          eCtx.fillRect(x, y, w, blindH);
        }
      } else if (litRoll < floorOccupancy) {
        dCtx.fillStyle = '#2A2520';
        dCtx.fillRect(x, y, w, h);
        eCtx.fillStyle = '#543C20';
        eCtx.fillRect(x + 2, y + 2, w - 4, h - 4);
      } else {
        const unlitGrad = dCtx.createLinearGradient(x, y, x + w, y + h);
        unlitGrad.addColorStop(0, '#121826');
        unlitGrad.addColorStop(1, '#090D16');
        dCtx.fillStyle = unlitGrad;
        dCtx.fillRect(x, y, w, h);
      }

      // DAY MODE: Smoked bronze & graphite reflective curtain-wall glass with subtle warm sky gleam
      const [lTop, lBot] =
        realisticDayGlass[Math.floor(litRoll * realisticDayGlass.length) % realisticDayGlass.length];
      const tiltShift = (rand() - 0.5) * w * 0.42;
      const lGrad = lCtx.createLinearGradient(x + tiltShift, y, x + w * 0.72, y + h);
      lGrad.addColorStop(0, lTop);
      lGrad.addColorStop(0.55, lBot);
      lGrad.addColorStop(1, '#4C473E');
      lCtx.fillStyle = lGrad;
      lCtx.fillRect(x, y, w, h);

      // Soft warm sunlit reflection sweep across smoked glass panes
      if (rand() > 0.42) {
        lCtx.fillStyle = 'rgba(237, 228, 212, 0.16)';
        lCtx.beginPath();
        lCtx.moveTo(x + w * 0.15, y);
        lCtx.lineTo(x + w * 0.48, y);
        lCtx.lineTo(x + w * 0.2, y + h);
        lCtx.lineTo(x, y + h);
        lCtx.closePath();
        lCtx.fill();
      }

      // Interior architectural slab shadow behind glazing
      lCtx.fillStyle = 'rgba(10, 12, 16, 0.44)';
      lCtx.fillRect(x, y + Math.round(h * 0.68), w, Math.round(h * 0.32));

      // Patinated bronze & champagne structural mullion highlights
      lCtx.strokeStyle = 'rgba(20, 22, 26, 0.76)';
      lCtx.lineWidth = 2;
      lCtx.strokeRect(x + 1, y + 1, w - 2, h - 2);
      lCtx.fillStyle = 'rgba(212, 186, 139, 0.46)';
      lCtx.fillRect(x + 2, y + 2, w - 4, 2);
    }
  }

  // Champagne-metal & dark graphite architectural spandrel bands
  dCtx.fillStyle = '#0A0E17';
  lCtx.fillStyle = '#22262E';
  hCtx.fillStyle = '#FFFFFF';
  const spandrelPx = Math.max(5, Math.round(size * 0.0065));
  const mapSpandrelPx = Math.max(2, Math.round(spandrelPx * sc));
  for (let r = 0; r < rows; r++) {
    const ry = Math.round(r * cellH);
    dCtx.fillRect(0, ry, size, spandrelPx);
    lCtx.fillRect(0, ry, size, spandrelPx);
    lCtx.fillStyle = r % 4 === 0 ? 'rgba(212, 186, 139, 0.8)' : 'rgba(140, 98, 57, 0.55)';
    lCtx.fillRect(0, ry, size, Math.max(2, Math.round(spandrelPx * 0.45)));
    lCtx.fillStyle = '#22262E';
    hCtx.fillRect(0, Math.round(ry * sc), mapSize, mapSpandrelPx);
  }

  const darkMap = finalizeColorTexture(new THREE.CanvasTexture(darkCanvas), anisotropy, 1, 2);
  const darkEmissiveMap = finalizeColorTexture(
    new THREE.CanvasTexture(emissiveCanvas),
    anisotropy,
    1,
    2
  );
  const lightMap = finalizeColorTexture(new THREE.CanvasTexture(lightCanvas), anisotropy, 1, 2);
  const normalMap = heightCanvasToNormalTexture(heightCanvas, 2.5, anisotropy, 1, 2);
  const roughnessMap = finalizeDataTexture(
    new THREE.CanvasTexture(roughCanvas),
    anisotropy,
    1,
    2
  ) as THREE.CanvasTexture;

  return {
    darkMap,
    darkEmissiveMap,
    lightMap,
    normalMap,
    roughnessMap,
    dispose: () => {
      darkMap.dispose();
      darkEmissiveMap.dispose();
      lightMap.dispose();
      normalMap.dispose();
      roughnessMap.dispose();
    },
  };
}

/**
 * Deep Emerald-Tinted Glass & Patinated Bronze Architectural Tower PBR Set (Singapore Biophilic Landmark Suite):
 * - Daytime: Deep emerald glass ribbons alternating with warm sandstone/bronze vertical fins & sky-terrace recesses.
 * - Nighttime: Deep midnight emerald glass punctuated with warm amber executive & garden terraces.
 */
export function createEmeraldSkyscraperPbrSet(
  anisotropy = 8,
  highRes = true
): SkyscraperPbrSet {
  const size = highRes ? 2048 : 1024;
  const rows = 18;
  const cols = 8;
  const cellW = size / cols;
  const cellH = size / rows;
  const finW = Math.round(size * 0.011);
  const spandrelH = Math.round(size * 0.012);

  const darkCanvas = document.createElement('canvas');
  darkCanvas.width = size;
  darkCanvas.height = size;
  const dCtx = darkCanvas.getContext('2d')!;

  const emissiveCanvas = document.createElement('canvas');
  emissiveCanvas.width = size;
  emissiveCanvas.height = size;
  const eCtx = emissiveCanvas.getContext('2d')!;

  const lightCanvas = document.createElement('canvas');
  lightCanvas.width = size;
  lightCanvas.height = size;
  const lCtx = lightCanvas.getContext('2d')!;

  const mapSize = highRes ? 1024 : 512;
  const heightCanvas = document.createElement('canvas');
  heightCanvas.width = mapSize;
  heightCanvas.height = mapSize;
  const hCtx = heightCanvas.getContext('2d')!;

  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = mapSize;
  roughCanvas.height = mapSize;
  const rCtx = roughCanvas.getContext('2d')!;

  lCtx.fillStyle = '#382C22'; // Patinated bronze vertical structural mullions
  lCtx.fillRect(0, 0, size, size);
  dCtx.fillStyle = '#0B1218';
  dCtx.fillRect(0, 0, size, size);
  eCtx.fillStyle = '#000000';
  eCtx.fillRect(0, 0, size, size);
  hCtx.fillStyle = '#F2F2F2';
  hCtx.fillRect(0, 0, mapSize, mapSize);
  rCtx.fillStyle = '#9C9C9C';
  rCtx.fillRect(0, 0, mapSize, mapSize);

  let seed = 6129;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const sc = mapSize / size;

  for (let r = 0; r < rows; r++) {
    const isTerraceBand = r === 5 || r === 11 || r === 16;
    for (let c = 0; c < cols; c++) {
      const x = Math.round(c * cellW + finW);
      const y = Math.round(r * cellH + spandrelH);
      const w = Math.round(cellW - finW * 2);
      const h = Math.round(cellH - spandrelH * 2);

      const mx = Math.round(x * sc);
      const my = Math.round(y * sc);
      const mw = Math.max(2, Math.round(w * sc));
      const mh = Math.max(2, Math.round(h * sc));

      if (isTerraceBand) {
        // Biophilic sandstone & bronze sky-garden ribbon band
        lCtx.fillStyle = '#D4BA8B';
        lCtx.fillRect(c * cellW, y, cellW, h);
        lCtx.fillStyle = '#53623A';
        lCtx.fillRect(x, y + Math.round(h * 0.25), w, Math.round(h * 0.45));

        dCtx.fillStyle = '#1B222C';
        dCtx.fillRect(c * cellW, y, cellW, h);
        dCtx.fillStyle = '#F0B65A';
        dCtx.fillRect(x, y + Math.round(h * 0.68), w, 4);
        eCtx.fillStyle = '#D9943B';
        eCtx.fillRect(x, y + Math.round(h * 0.68), w, 4);
        continue;
      }

      hCtx.fillStyle = '#1C1C1C';
      hCtx.fillRect(mx, my, mw, mh);
      rCtx.fillStyle = '#090909';
      rCtx.fillRect(mx, my, mw, mh);

      // Day: Deep emerald & smoky forest-jade curtain-wall glass
      const dayG = lCtx.createLinearGradient(x, y, x + w, y + h);
      dayG.addColorStop(0, '#225845');
      dayG.addColorStop(0.5, '#163D30');
      dayG.addColorStop(1, '#2B4C3E');
      lCtx.fillStyle = dayG;
      lCtx.fillRect(x, y, w, h);

      // Warm sandstone sunlight reflection bar
      if (rand() > 0.38) {
        lCtx.fillStyle = 'rgba(237, 228, 212, 0.14)';
        lCtx.fillRect(x + Math.round(w * 0.15), y, Math.round(w * 0.22), h);
      }

      // Champagne mullion pinstripe
      lCtx.fillStyle = 'rgba(212, 186, 139, 0.6)';
      lCtx.fillRect(x - 2, y, 2, h);

      // Night: Warm amber Executive Glass suites
      if (rand() > 0.36) {
        const ng = dCtx.createLinearGradient(x, y, x, y + h);
        ng.addColorStop(0, '#FFE8B8');
        ng.addColorStop(0.55, '#D28E3E');
        ng.addColorStop(1, '#1E2524');
        dCtx.fillStyle = ng;
        dCtx.fillRect(x, y, w, h);
        eCtx.fillStyle = ng;
        eCtx.fillRect(x + 2, y + 2, w - 4, h - 4);
      } else {
        dCtx.fillStyle = '#0D1E1B';
        dCtx.fillRect(x, y, w, h);
      }
    }
  }

  const darkMap = finalizeColorTexture(new THREE.CanvasTexture(darkCanvas), anisotropy, 1, 2);
  const darkEmissiveMap = finalizeColorTexture(
    new THREE.CanvasTexture(emissiveCanvas),
    anisotropy,
    1,
    2
  );
  const lightMap = finalizeColorTexture(new THREE.CanvasTexture(lightCanvas), anisotropy, 1, 2);
  const normalMap = heightCanvasToNormalTexture(heightCanvas, 2.7, anisotropy, 1, 2);
  const roughnessMap = finalizeDataTexture(
    new THREE.CanvasTexture(roughCanvas),
    anisotropy,
    1,
    2
  ) as THREE.CanvasTexture;

  return {
    darkMap,
    darkEmissiveMap,
    lightMap,
    normalMap,
    roughnessMap,
    dispose: () => {
      darkMap.dispose();
      darkEmissiveMap.dispose();
      lightMap.dispose();
      normalMap.dispose();
      roughnessMap.dispose();
    },
  };
}

export interface SurfacePbrSet {
  darkMap: THREE.CanvasTexture;
  lightMap: THREE.CanvasTexture;
  normalMap: THREE.DataTexture;
  roughnessMap: THREE.CanvasTexture;
  dispose: () => void;
}

/**
 * Realistic Natural Grass & Parkland Turf PBR Set (High-frequency organic grass blades + normal & roughness depth).
 */
export function createNaturalGrassPbrSet(
  anisotropy = 8,
  repeatX = 14,
  repeatY = 14,
  highRes = true
): SurfacePbrSet {
  const size = highRes ? 1024 : 512;
  const bladeScale = size / 512;

  const darkCanvas = document.createElement('canvas');
  darkCanvas.width = size;
  darkCanvas.height = size;
  const dCtx = darkCanvas.getContext('2d')!;

  const lightCanvas = document.createElement('canvas');
  lightCanvas.width = size;
  lightCanvas.height = size;
  const lCtx = lightCanvas.getContext('2d')!;

  const hCanvas = document.createElement('canvas');
  hCanvas.width = size;
  hCanvas.height = size;
  const hCtx = hCanvas.getContext('2d')!;

  const rCanvas = document.createElement('canvas');
  rCanvas.width = size;
  rCanvas.height = size;
  const rCtx = rCanvas.getContext('2d')!;

  dCtx.fillStyle = '#131C16';
  dCtx.fillRect(0, 0, size, size);
  lCtx.fillStyle = '#4B5E3F';
  lCtx.fillRect(0, 0, size, size);
  hCtx.fillStyle = '#787878';
  hCtx.fillRect(0, 0, size, size);
  rCtx.fillStyle = '#D8D8D8';
  rCtx.fillRect(0, 0, size, size);

  let seed = 6199;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  // Soft natural British meadow soil, dry-straw & moss mottling patches
  for (let i = 0; i < 95; i++) {
    const px = rand() * size;
    const py = rand() * size;
    const rad = (24 + rand() * 58) * bladeScale;
    const dPatch = dCtx.createRadialGradient(px, py, 2, px, py, rad);
    dPatch.addColorStop(0, rand() > 0.5 ? 'rgba(24, 36, 27, 0.34)' : 'rgba(11, 17, 13, 0.34)');
    dPatch.addColorStop(1, 'rgba(0,0,0,0)');
    dCtx.fillStyle = dPatch;
    dCtx.beginPath();
    dCtx.arc(px, py, rad, 0, Math.PI * 2);
    dCtx.fill();

    const lPatch = lCtx.createRadialGradient(px, py, 2, px, py, rad);
    lPatch.addColorStop(0, rand() > 0.45 ? 'rgba(104, 118, 76, 0.30)' : 'rgba(60, 78, 49, 0.28)');
    lPatch.addColorStop(1, 'rgba(0,0,0,0)');
    lCtx.fillStyle = lPatch;
    lCtx.beginPath();
    lCtx.arc(px, py, rad, 0, Math.PI * 2);
    lCtx.fill();
  }

  // Thousands of fine muted British parkland grass blades for photographic close-up realism
  const bladeCount = highRes ? 16000 : 6500;
  for (let i = 0; i < bladeCount; i++) {
    const gx = Math.floor(rand() * size);
    const gy = Math.floor(rand() * size);
    const len = 3 + Math.floor(rand() * 8);
    const dx = Math.floor((rand() - 0.5) * 4);
    const bright = rand();

    lCtx.fillStyle =
      bright > 0.86
        ? '#6D7B52'
        : bright > 0.55
          ? '#5A6E49'
          : bright > 0.25
            ? '#4B5E3E'
            : '#3C4D32';
    lCtx.fillRect(gx, gy, 2, len);
    lCtx.fillRect(gx + dx, gy, 1, Math.max(2, len - 2));

    dCtx.fillStyle =
      bright > 0.7 ? '#1F2F23' : bright > 0.35 ? '#17251B' : '#0F1A13';
    dCtx.fillRect(gx, gy, 2, len);

    const hv = Math.round(90 + bright * 145);
    hCtx.fillStyle = `rgb(${hv},${hv},${hv})`;
    hCtx.fillRect(gx, gy, 2, len);

    const rv = Math.round(195 + (1 - bright) * 45);
    rCtx.fillStyle = `rgb(${rv},${rv},${rv})`;
    rCtx.fillRect(gx, gy, 2, len);
  }

  const darkMap = finalizeColorTexture(new THREE.CanvasTexture(darkCanvas), anisotropy, repeatX, repeatY);
  const lightMap = finalizeColorTexture(new THREE.CanvasTexture(lightCanvas), anisotropy, repeatX, repeatY);
  const normalMap = heightCanvasToNormalTexture(hCanvas, 1.4, anisotropy, repeatX, repeatY);
  const roughnessMap = finalizeDataTexture(
    new THREE.CanvasTexture(rCanvas),
    anisotropy,
    repeatX,
    repeatY
  ) as THREE.CanvasTexture;

  return {
    darkMap,
    lightMap,
    normalMap,
    roughnessMap,
    dispose: () => {
      darkMap.dispose();
      lightMap.dispose();
      normalMap.dispose();
      roughnessMap.dispose();
    },
  };
}

/**
 * Realistic Natural Wood Grain PBR Set (For Cedar Siding, Timber Front Doors, Porch Soffits & Benches).
 */
export function createWoodGrainPbrSet(anisotropy = 8, highRes = true): {
  map: THREE.CanvasTexture;
  normalMap: THREE.DataTexture;
  roughnessMap: THREE.CanvasTexture;
  dispose: () => void;
} {
  const size = highRes ? 1024 : 512;
  const cCanvas = document.createElement('canvas');
  cCanvas.width = size;
  cCanvas.height = size;
  const cCtx = cCanvas.getContext('2d')!;

  const hCanvas = document.createElement('canvas');
  hCanvas.width = size;
  hCanvas.height = size;
  const hCtx = hCanvas.getContext('2d')!;

  const rCanvas = document.createElement('canvas');
  rCanvas.width = size;
  rCanvas.height = size;
  const rCtx = rCanvas.getContext('2d')!;

  cCtx.fillStyle = '#C9A882';
  cCtx.fillRect(0, 0, size, size);
  hCtx.fillStyle = '#C8C8C8';
  hCtx.fillRect(0, 0, size, size);
  rCtx.fillStyle = '#A8A8A8';
  rCtx.fillRect(0, 0, size, size);

  let seed = 8831;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  // Horizontal planks with crisp wood grain fibers & fine pores
  const planks = 10;
  const plankH = size / planks;
  const fiberCount = highRes ? 56 : 36;
  for (let p = 0; p < planks; p++) {
    const py = Math.round(p * plankH);
    const shade = Math.round((rand() - 0.5) * 26);
    cCtx.fillStyle = `rgb(${202 + shade},${166 + Math.round(shade * 0.8)},${126 + Math.round(shade * 0.6)})`;
    cCtx.fillRect(0, py, size, plankH - 2);

    // Fine organic grain streaks
    for (let g = 0; g < fiberCount; g++) {
      const gy = py + 2 + rand() * (plankH - 6);
      const alpha = 0.05 + rand() * 0.14;
      cCtx.fillStyle = rand() > 0.5 ? `rgba(72,42,18,${alpha})` : `rgba(245,228,200,${alpha * 0.6})`;
      cCtx.fillRect(0, gy, size, 1 + Math.floor(rand() * 2));

      const hv = Math.round(170 + (rand() - 0.5) * 55);
      hCtx.fillStyle = `rgb(${hv},${hv},${hv})`;
      hCtx.fillRect(0, gy, size, 2);
    }

    // Recessed plank seam
    cCtx.fillStyle = 'rgba(42, 26, 14, 0.62)';
    cCtx.fillRect(0, py + plankH - 2, size, 2);
    hCtx.fillStyle = '#303030';
    hCtx.fillRect(0, py + plankH - 2, size, 2);
    rCtx.fillStyle = '#E0E0E0';
    rCtx.fillRect(0, py + plankH - 2, size, 2);
  }

  const map = finalizeColorTexture(new THREE.CanvasTexture(cCanvas), anisotropy, 1, 1);
  const normalMap = heightCanvasToNormalTexture(hCanvas, 1.35, anisotropy, 1, 1);
  const roughnessMap = finalizeDataTexture(
    new THREE.CanvasTexture(rCanvas),
    anisotropy,
    1,
    1
  ) as THREE.CanvasTexture;

  return {
    map,
    normalMap,
    roughnessMap,
    dispose: () => {
      map.dispose();
      normalMap.dispose();
      roughnessMap.dispose();
    },
  };
}

/**
 * Realistic Natural Stone Paving (Warm Granite & Limestone Pavers for Courtyard & Sidewalks).
 */
export function createPlazaStonePbrSet(anisotropy = 8, highRes = true): SurfacePbrSet {
  const size = highRes ? 2048 : 1024;
  const mapSize = highRes ? 1024 : 512;

  const darkCanvas = document.createElement('canvas');
  darkCanvas.width = size;
  darkCanvas.height = size;
  const dCtx = darkCanvas.getContext('2d')!;

  const lightCanvas = document.createElement('canvas');
  lightCanvas.width = size;
  lightCanvas.height = size;
  const lCtx = lightCanvas.getContext('2d')!;

  const heightCanvas = document.createElement('canvas');
  heightCanvas.width = mapSize;
  heightCanvas.height = mapSize;
  const hCtx = heightCanvas.getContext('2d')!;

  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = mapSize;
  roughCanvas.height = mapSize;
  const rCtx = roughCanvas.getContext('2d')!;

  // Dark graphite mortar vs sandstone beige, warm ivory & dark graphite architectural stone pavers
  dCtx.fillStyle = '#0E121A';
  dCtx.fillRect(0, 0, size, size);
  lCtx.fillStyle = '#383430';
  lCtx.fillRect(0, 0, size, size);
  hCtx.fillStyle = '#282828';
  hCtx.fillRect(0, 0, mapSize, mapSize);
  rCtx.fillStyle = '#DCDCDC';
  rCtx.fillRect(0, 0, mapSize, mapSize);

  const cols = 8;
  const rows = 8;
  const cellW = size / cols;
  const cellH = size / rows;
  const gap = Math.round(size * 0.004);
  const sc = mapSize / size;

  let seed = 7711;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  const fleckCount = highRes ? 44 : 22;
  for (let r = 0; r < rows; r++) {
    const rowOffset = r % 2 === 1 ? cellW * 0.5 : 0;
    for (let c = -1; c <= cols; c++) {
      const x = Math.round(c * cellW + rowOffset + gap);
      const y = Math.round(r * cellH + gap);
      const w = Math.round(cellW - gap * 2);
      const h = Math.round(cellH - gap * 2);

      const tone = (rand() - 0.5) * 14;
      const isDarkBand = (r + c) % 4 === 0;
      const isWarmSand = (r + c) % 4 === 2;
      const dR = Math.round((isDarkBand ? 24 : 34) + tone * 0.45);
      const dG = Math.round((isDarkBand ? 28 : 39) + tone * 0.45);
      const dB = Math.round((isDarkBand ? 38 : 49) + tone * 0.5);
      dCtx.fillStyle = `rgb(${dR},${dG},${dB})`;
      dCtx.fillRect(x, y, w, h);

      // Day Mode: Warm sandstone beige & ivory honed stone pavers bordered by dark graphite basalt tiles
      const lR = Math.round((isDarkBand ? 58 : isWarmSand ? 214 : 196) + tone * 0.5);
      const lG = Math.round((isDarkBand ? 62 : isWarmSand ? 194 : 182) + tone * 0.5);
      const lB = Math.round((isDarkBand ? 70 : isWarmSand ? 162 : 158) + tone * 0.45);
      lCtx.fillStyle = `rgb(${lR},${lG},${lB})`;
      lCtx.fillRect(x, y, w, h);

      // Champagne/bronze hairline stone chamfer highlight
      lCtx.fillStyle = isDarkBand ? 'rgba(212,186,139,0.28)' : 'rgba(248,242,230,0.32)';
      lCtx.fillRect(x, y, w, 2);
      dCtx.fillStyle = 'rgba(220,180,116,0.14)';
      dCtx.fillRect(x, y, w, 2);

      // Natural stone mineral fleck texture
      for (let f = 0; f < fleckCount; f++) {
        const fx = x + Math.floor(rand() * w);
        const fy = y + Math.floor(rand() * h);
        lCtx.fillStyle = rand() > 0.5 ? 'rgba(245,238,224,0.14)' : 'rgba(30,26,22,0.12)';
        lCtx.fillRect(fx, fy, 3, 2);
        dCtx.fillStyle = rand() > 0.5 ? 'rgba(212,186,139,0.06)' : 'rgba(0,0,0,0.16)';
        dCtx.fillRect(fx, fy, 3, 2);
      }

      const hVal = Math.round(212 + tone * 0.8);
      hCtx.fillStyle = `rgb(${Math.round(hVal * 0.78)},${Math.round(hVal * 0.78)},${Math.round(hVal * 0.78)})`;
      hCtx.fillRect(Math.round(x * sc), Math.round(y * sc), Math.round(w * sc), Math.round(h * sc));
      hCtx.fillStyle = `rgb(${hVal},${hVal},${hVal})`;
      hCtx.fillRect(Math.round((x + 3) * sc), Math.round((y + 3) * sc), Math.round((w - 6) * sc), Math.round((h - 6) * sc));

      const rVal = Math.round(158 + rand() * 48);
      rCtx.fillStyle = `rgb(${rVal},${rVal},${rVal})`;
      rCtx.fillRect(Math.round(x * sc), Math.round(y * sc), Math.round(w * sc), Math.round(h * sc));
    }
  }

  const darkMap = finalizeColorTexture(new THREE.CanvasTexture(darkCanvas), anisotropy, 10, 10);
  const lightMap = finalizeColorTexture(new THREE.CanvasTexture(lightCanvas), anisotropy, 10, 10);
  const normalMap = heightCanvasToNormalTexture(heightCanvas, 1.85, anisotropy, 10, 10);
  const roughnessMap = finalizeDataTexture(
    new THREE.CanvasTexture(roughCanvas),
    anisotropy,
    10,
    10
  ) as THREE.CanvasTexture;

  return {
    darkMap,
    lightMap,
    normalMap,
    roughnessMap,
    dispose: () => {
      darkMap.dispose();
      lightMap.dispose();
      normalMap.dispose();
      roughnessMap.dispose();
    },
  };
}

/**
 * Ultra-Realistic City Tarmac Asphalt Road PBR Set (Albedo + Asphalt Aggregate Normal Map + Tire-Lane Roughness Map).
 */
export function createBoulevardRoadPbrSet(anisotropy = 8, highRes = true): {
  darkMap: THREE.CanvasTexture;
  lightMap: THREE.CanvasTexture;
  normalMap: THREE.DataTexture;
  darkRoughnessMap: THREE.CanvasTexture;
  lightRoughnessMap: THREE.CanvasTexture;
  dispose: () => void;
} {
  const size = highRes ? 2048 : 1024;
  const rSize = highRes ? 1024 : 512;
  const sc = size / 1024;

  const drawRoad = (isDark: boolean) => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = isDark ? '#101622' : '#242B36';
    ctx.fillRect(0, 0, size, size);

    // Subtle real-world dual tire-track satin polish along both lanes
    ctx.fillStyle = isDark ? 'rgba(6, 9, 16, 0.36)' : 'rgba(18, 22, 29, 0.24)';
    ctx.fillRect(Math.round(188 * sc), 0, Math.round(190 * sc), size);
    ctx.fillRect(size - Math.round(378 * sc), 0, Math.round(190 * sc), size);

    // Rich crushed-basalt tarmac aggregate grain
    let seed = isDark ? 42 : 84;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    const speckCount = highRes ? 26000 : 9500;
    for (let i = 0; i < speckCount; i++) {
      const gx = Math.floor(rand() * size);
      const gy = Math.floor(rand() * size);
      const lightSpeck = rand() > 0.5;
      ctx.fillStyle = isDark
        ? lightSpeck
          ? 'rgba(180,210,240,0.04)'
          : 'rgba(0,0,0,0.12)'
        : lightSpeck
          ? 'rgba(235,225,208,0.06)'
          : 'rgba(14,18,24,0.1)';
      ctx.fillRect(gx, gy, 2, 2);
    }

    // Dressed stone street curbs (warm honed ivory day / midnight granite night) & drainage gutter joints
    const curbW = Math.round(34 * sc);
    const gutterW = Math.round(8 * sc);
    ctx.fillStyle = isDark ? '#273144' : '#CFC6B4';
    ctx.fillRect(0, 0, curbW, size);
    ctx.fillRect(size - curbW, 0, curbW, size);
    ctx.fillStyle = isDark ? '#0B0F18' : '#1B2029';
    ctx.fillRect(curbW, 0, gutterW, size);
    ctx.fillRect(size - curbW - gutterW, 0, gutterW, size);

    // Architectural bronze/cast-iron roadside drainage grates
    ctx.fillStyle = isDark ? '#181E2B' : '#3C3226';
    for (let y = Math.round(64 * sc); y < size; y += Math.round(512 * sc)) {
      ctx.fillRect(curbW + 1, y, Math.round(14 * sc), Math.round(36 * sc));
      ctx.fillRect(size - curbW - Math.round(15 * sc), y, Math.round(14 * sc), Math.round(36 * sc));
    }

    // Curb expansion joints
    ctx.fillStyle = isDark ? 'rgba(8,11,18,0.7)' : 'rgba(60,54,46,0.42)';
    for (let y = 0; y < size; y += Math.round(128 * sc)) {
      ctx.fillRect(0, y, curbW, Math.max(2, Math.round(3 * sc)));
      ctx.fillRect(size - curbW, y, curbW, Math.max(2, Math.round(3 * sc)));
    }

    // Champagne-ivory shoulder stripes
    ctx.fillStyle = isDark ? 'rgba(235, 206, 152, 0.56)' : 'rgba(245, 238, 224, 0.84)';
    ctx.fillRect(Math.round(68 * sc), 0, Math.round(10 * sc), size);
    ctx.fillRect(size - Math.round(78 * sc), 0, Math.round(10 * sc), size);

    // Crisp champagne-gold / turquoise-reflective center dashed lane markings
    ctx.fillStyle = isDark ? 'rgba(240, 208, 140, 0.85)' : '#F5EFE2';
    for (let y = Math.round(26 * sc); y < size; y += Math.round(160 * sc)) {
      ctx.fillRect(size / 2 - Math.round(11 * sc), y, Math.round(8 * sc), Math.round(84 * sc));
      ctx.fillRect(size / 2 + Math.round(3 * sc), y, Math.round(8 * sc), Math.round(84 * sc));
    }

    return finalizeColorTexture(new THREE.CanvasTexture(canvas), anisotropy, 1, 14);
  };

  // Micro-granular asphalt normal map so streetlamps & sky speculars glint realistically off the tarmac
  const hCanvas = document.createElement('canvas');
  hCanvas.width = rSize;
  hCanvas.height = rSize;
  const hCtx = hCanvas.getContext('2d')!;
  hCtx.fillStyle = '#808080';
  hCtx.fillRect(0, 0, rSize, rSize);
  let nSeed = 5113;
  const nRand = () => {
    nSeed = (nSeed * 16807) % 2147483647;
    return (nSeed - 1) / 2147483646;
  };
  const nSpecks = highRes ? 28000 : 14000;
  for (let i = 0; i < nSpecks; i++) {
    const v = Math.round(90 + nRand() * 76);
    hCtx.fillStyle = `rgb(${v},${v},${v})`;
    hCtx.fillRect(Math.floor(nRand() * rSize), Math.floor(nRand() * rSize), 2, 2);
  }
  const rSc = rSize / 512;
  // Raised concrete curbs on edges
  hCtx.fillStyle = '#F0F0F0';
  hCtx.fillRect(0, 0, Math.round(17 * rSc), rSize);
  hCtx.fillRect(rSize - Math.round(17 * rSc), 0, Math.round(17 * rSc), rSize);
  const normalMap = heightCanvasToNormalTexture(hCanvas, 0.9, anisotropy, 1, 14);

  const drawRoughness = (isDark: boolean) => {
    const canvas = document.createElement('canvas');
    canvas.width = rSize;
    canvas.height = rSize;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = isDark ? '#969696' : '#DCDCDC';
    ctx.fillRect(0, 0, rSize, rSize);

    if (isDark) {
      // Realistic damp evening asphalt specular sheen along vehicle tire tracks
      const gradL = ctx.createLinearGradient(80 * rSc, 0, 210 * rSc, 0);
      gradL.addColorStop(0, '#969696');
      gradL.addColorStop(0.5, '#484848');
      gradL.addColorStop(1, '#969696');
      ctx.fillStyle = gradL;
      ctx.fillRect(Math.round(80 * rSc), 0, Math.round(130 * rSc), rSize);

      const gradR = ctx.createLinearGradient(302 * rSc, 0, 432 * rSc, 0);
      gradR.addColorStop(0, '#969696');
      gradR.addColorStop(0.5, '#484848');
      gradR.addColorStop(1, '#969696');
      ctx.fillStyle = gradR;
      ctx.fillRect(Math.round(302 * rSc), 0, Math.round(130 * rSc), rSize);
    }

    return finalizeDataTexture(
      new THREE.CanvasTexture(canvas),
      anisotropy,
      1,
      14
    ) as THREE.CanvasTexture;
  };

  const darkMap = drawRoad(true);
  const lightMap = drawRoad(false);
  const darkRoughnessMap = drawRoughness(true);
  const lightRoughnessMap = drawRoughness(false);

  return {
    darkMap,
    lightMap,
    normalMap,
    darkRoughnessMap,
    lightRoughnessMap,
    dispose: () => {
      darkMap.dispose();
      lightMap.dispose();
      normalMap.dispose();
      darkRoughnessMap.dispose();
      lightRoughnessMap.dispose();
    },
  };
}

/**
 * Ultra-Realistic Brick & Lime Mortar Wall PBR Set (Multi-Tone Brick Albedo + Normal + Roughness).
 * White-biased albedo multiplies cleanly with any material.color tint (red brick, buff brick, painted brick).
 */
export function createBrickWallPbr(anisotropy = 8): {
  map: THREE.CanvasTexture;
  normalMap: THREE.DataTexture;
  roughnessMap: THREE.CanvasTexture;
  dispose: () => void;
} {
  const size = 1024;
  const cCanvas = document.createElement('canvas');
  cCanvas.width = size;
  cCanvas.height = size;
  const cCtx = cCanvas.getContext('2d')!;

  const hCanvas = document.createElement('canvas');
  hCanvas.width = size;
  hCanvas.height = size;
  const hCtx = hCanvas.getContext('2d')!;

  const rCanvas = document.createElement('canvas');
  rCanvas.width = size;
  rCanvas.height = size;
  const rCtx = rCanvas.getContext('2d')!;

  // Authentic recessed lime-sand mortar bed
  cCtx.fillStyle = '#CFCBC0';
  cCtx.fillRect(0, 0, size, size);
  hCtx.fillStyle = '#262626';
  hCtx.fillRect(0, 0, size, size);
  rCtx.fillStyle = '#EAEAEA';
  rCtx.fillRect(0, 0, size, size);

  const brickW = 128;
  const brickH = 48;
  let seed = 4421;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let row = 0; row < size / brickH; row++) {
    const shift = row % 2 === 1 ? brickW / 2 : 0;
    for (let col = -1; col <= size / brickW; col++) {
      const bx = col * brickW + shift + 4;
      const by = row * brickH + 4;
      const bw = brickW - 8;
      const bh = brickH - 8;

      const tone = Math.round(216 + (rand() - 0.5) * 46);
      const warm = Math.round((rand() - 0.5) * 18);
      const bGrad = cCtx.createLinearGradient(bx, by, bx, by + bh);
      bGrad.addColorStop(
        0,
        `rgb(${Math.min(255, tone + warm + 10)},${Math.min(255, tone + 8)},${Math.max(140, tone - Math.abs(warm) + 6)})`
      );
      bGrad.addColorStop(
        1,
        `rgb(${Math.max(130, tone + warm - 14)},${Math.max(130, tone - 14)},${Math.max(120, tone - Math.abs(warm) - 12)})`
      );
      cCtx.fillStyle = bGrad;
      cCtx.fillRect(bx, by, bw, bh);

      // Kiln-fired clay surface pores & subtle mineral speckles
      for (let s = 0; s < 14; s++) {
        const sx = bx + Math.floor(rand() * (bw - 4));
        const sy = by + Math.floor(rand() * (bh - 3));
        cCtx.fillStyle = rand() > 0.5 ? 'rgba(255,250,242,0.16)' : 'rgba(52,32,22,0.14)';
        cCtx.fillRect(sx, sy, 3 + Math.floor(rand() * 4), 2);
      }

      // Subtle bevel edge height profile for photorealistic grazing-sun normal shading
      const hVal = Math.round(196 + rand() * 42);
      hCtx.fillStyle = `rgb(${Math.round(hVal * 0.72)},${Math.round(hVal * 0.72)},${Math.round(hVal * 0.72)})`;
      hCtx.fillRect(bx, by, bw, bh);
      hCtx.fillStyle = `rgb(${hVal},${hVal},${hVal})`;
      hCtx.fillRect(bx + 3, by + 3, bw - 6, bh - 6);

      const rVal = Math.round(158 + rand() * 56);
      rCtx.fillStyle = `rgb(${rVal},${rVal},${rVal})`;
      rCtx.fillRect(bx, by, bw, bh);
    }
  }

  const map = finalizeColorTexture(new THREE.CanvasTexture(cCanvas), anisotropy, 3, 2);
  const normalMap = heightCanvasToNormalTexture(hCanvas, 2.1, anisotropy, 3, 2);
  const roughnessMap = finalizeDataTexture(
    new THREE.CanvasTexture(rCanvas),
    anisotropy,
    3,
    2
  ) as THREE.CanvasTexture;

  return {
    map,
    normalMap,
    roughnessMap,
    dispose: () => {
      map.dispose();
      normalMap.dispose();
      roughnessMap.dispose();
    },
  };
}

/**
 * Realistic Roof Shingle / Slate Tile PBR Set (Subtle Tile Color Variation + Normal + Roughness).
 */
export function createRoofTilePbr(anisotropy = 8): {
  map: THREE.CanvasTexture;
  normalMap: THREE.DataTexture;
  roughnessMap: THREE.CanvasTexture;
  dispose: () => void;
} {
  const size = 1024;
  const cCanvas = document.createElement('canvas');
  cCanvas.width = size;
  cCanvas.height = size;
  const cCtx = cCanvas.getContext('2d')!;

  const hCanvas = document.createElement('canvas');
  hCanvas.width = size;
  hCanvas.height = size;
  const hCtx = hCanvas.getContext('2d')!;

  const rCanvas = document.createElement('canvas');
  rCanvas.width = size;
  rCanvas.height = size;
  const rCtx = rCanvas.getContext('2d')!;

  cCtx.fillStyle = '#8C8C8C';
  cCtx.fillRect(0, 0, size, size);
  hCtx.fillStyle = '#2C2C2C';
  hCtx.fillRect(0, 0, size, size);
  rCtx.fillStyle = '#C4C4C4';
  rCtx.fillRect(0, 0, size, size);

  let seed = 9187;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  const tileW = 64;
  const tileH = 64;
  for (let row = 0; row < size / tileH; row++) {
    const shift = row % 2 === 1 ? tileW / 2 : 0;
    for (let col = -1; col <= size / tileW; col++) {
      const tx = col * tileW + shift + 2;
      const ty = row * tileH + 2;
      const tw = tileW - 4;
      const th = tileH - 5;

      const shade = Math.round(212 + (rand() - 0.5) * 44);
      const cGrad = cCtx.createLinearGradient(tx, ty, tx, ty + th);
      cGrad.addColorStop(
        0,
        `rgb(${Math.max(110, shade - 28)},${Math.max(110, shade - 28)},${Math.max(110, shade - 28)})`
      );
      cGrad.addColorStop(
        0.82,
        `rgb(${Math.min(255, shade + 10)},${Math.min(255, shade + 10)},${Math.min(255, shade + 10)})`
      );
      cGrad.addColorStop(1, `rgb(${Math.min(255, shade + 24)},${Math.min(255, shade + 24)},${Math.min(255, shade + 24)})`);
      cCtx.fillStyle = cGrad;
      cCtx.fillRect(tx, ty, tw, th);

      // Subtle slate cleavage mineral grain streaks
      for (let g = 0; g < 6; g++) {
        cCtx.fillStyle = rand() > 0.5 ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.09)';
        cCtx.fillRect(tx + Math.floor(rand() * tw), ty + Math.floor(rand() * th), 2, 10 + Math.floor(rand() * 14));
      }

      const grad = hCtx.createLinearGradient(tx, ty, tx, ty + th);
      grad.addColorStop(0, '#888888');
      grad.addColorStop(0.88, '#EFEFEF');
      grad.addColorStop(1, '#FFFFFF');
      hCtx.fillStyle = grad;
      hCtx.fillRect(tx, ty, tw, th);

      const rv = Math.round(145 + rand() * 55);
      rCtx.fillStyle = `rgb(${rv},${rv},${rv})`;
      rCtx.fillRect(tx, ty, tw, th);
    }
  }

  const map = finalizeColorTexture(new THREE.CanvasTexture(cCanvas), anisotropy, 4, 3);
  const normalMap = heightCanvasToNormalTexture(hCanvas, 2.3, anisotropy, 4, 3);
  const roughnessMap = finalizeDataTexture(
    new THREE.CanvasTexture(rCanvas),
    anisotropy,
    4,
    3
  ) as THREE.CanvasTexture;

  return {
    map,
    normalMap,
    roughnessMap,
    dispose: () => {
      map.dispose();
      normalMap.dispose();
      roughnessMap.dispose();
    },
  };
}

/**
 * Architectural Stucco / Limestone Ashlar Cladding Albedo + Normal + Roughness Map.
 */
export function createArchitecturalCladdingPbr(anisotropy = 8, highRes = true): {
  map: THREE.CanvasTexture;
  normalMap: THREE.DataTexture;
  roughnessMap: THREE.CanvasTexture;
  dispose: () => void;
} {
  const size = highRes ? 2048 : 1024;
  const mapSize = highRes ? 1024 : 512;
  const sc = mapSize / size;

  const cCanvas = document.createElement('canvas');
  cCanvas.width = size;
  cCanvas.height = size;
  const cCtx = cCanvas.getContext('2d')!;

  const hCanvas = document.createElement('canvas');
  hCanvas.width = mapSize;
  hCanvas.height = mapSize;
  const hCtx = hCanvas.getContext('2d')!;

  const rCanvas = document.createElement('canvas');
  rCanvas.width = mapSize;
  rCanvas.height = mapSize;
  const rCtx = rCanvas.getContext('2d')!;

  cCtx.fillStyle = '#ECEAE5';
  cCtx.fillRect(0, 0, size, size);
  hCtx.fillStyle = '#D6D6D6';
  hCtx.fillRect(0, 0, mapSize, mapSize);
  rCtx.fillStyle = '#B8B8B8';
  rCtx.fillRect(0, 0, mapSize, mapSize);

  let seed = 2917;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const grainCount = highRes ? 28000 : 14000;
  for (let i = 0; i < grainCount; i++) {
    const gx = Math.floor(rand() * size);
    const gy = Math.floor(rand() * size);
    const v = Math.round(226 + (rand() - 0.5) * 28);
    cCtx.fillStyle = `rgb(${v},${v},${v})`;
    cCtx.fillRect(gx, gy, 2, 2);

    const hv = Math.round(212 + (rand() - 0.5) * 26);
    hCtx.fillStyle = `rgb(${hv},${hv},${hv})`;
    hCtx.fillRect(Math.floor(gx * sc), Math.floor(gy * sc), 2, 2);
  }

  const panelRows = 6;
  const panelW = Math.round(size / 3);
  const rowH = size / panelRows;
  for (let r = 0; r < panelRows; r++) {
    const y = Math.round(r * rowH);
    const offset = r % 2 === 0 ? 0 : Math.round(panelW * 0.5);
    for (let x = offset - panelW; x < size; x += panelW) {
      const shade = Math.round((rand() - 0.5) * 14);
      cCtx.fillStyle = shade > 0 ? `rgba(255,255,255,${shade / 240})` : `rgba(80,74,64,${-shade / 240})`;
      cCtx.fillRect(x, y, panelW, rowH);
    }
    // Recessed ashlar shadow groove
    cCtx.fillStyle = 'rgba(116,110,102,0.44)';
    cCtx.fillRect(0, y, size, 4);
    hCtx.fillStyle = '#525252';
    hCtx.fillRect(0, Math.round(y * sc), mapSize, Math.max(2, Math.round(4 * sc)));
    rCtx.fillStyle = '#DEDEDE';
    rCtx.fillRect(0, Math.round(y * sc), mapSize, Math.max(2, Math.round(4 * sc)));

    for (let x = offset; x < size; x += panelW) {
      cCtx.fillRect(x, y, 4, rowH);
      hCtx.fillRect(Math.round(x * sc), Math.round(y * sc), Math.max(2, Math.round(4 * sc)), Math.round(rowH * sc));
      rCtx.fillRect(Math.round(x * sc), Math.round(y * sc), Math.max(2, Math.round(4 * sc)), Math.round(rowH * sc));
    }
  }

  const map = finalizeColorTexture(new THREE.CanvasTexture(cCanvas), anisotropy, 2, 2);
  const normalMap = heightCanvasToNormalTexture(hCanvas, 1.55, anisotropy, 2, 2);
  const roughnessMap = finalizeDataTexture(
    new THREE.CanvasTexture(rCanvas),
    anisotropy,
    2,
    2
  ) as THREE.CanvasTexture;

  return {
    map,
    normalMap,
    roughnessMap,
    dispose: () => {
      map.dispose();
      normalMap.dispose();
      roughnessMap.dispose();
    },
  };
}

/**
 * Ultra-Luxury Contemporary Architectural Glazing Texture Set:
 * - Daytime: Crystal-clear sapphire/azure sky & cloud reflection with subtle architectural interior ceiling coffers & dark floor depth.
 * - Nighttime: Architectural Digest luxury interior staging — recessed warm-white linear ceiling LED coves, modern gallery wall-wash, minimalist lounge & mezzanine depth!
 */
export function createResidentialWindowTextures(anisotropy = 8, highRes = true): {
  dayMap: THREE.CanvasTexture;
  nightMap: THREE.CanvasTexture;
  nightEmissiveMap: THREE.CanvasTexture;
  dispose: () => void;
} {
  const size = highRes ? 1024 : 512;
  const sc = size / 512;

  // Daytime deep emerald-tinted & smoked-bronze architectural glazing with warm ivory sky sheen
  const dCanvas = document.createElement('canvas');
  dCanvas.width = size;
  dCanvas.height = size;
  const dCtx = dCanvas.getContext('2d')!;
  const dayGrad = dCtx.createLinearGradient(0, 0, size * 0.42, size);
  dayGrad.addColorStop(0, '#1D4939');
  dayGrad.addColorStop(0.35, '#15342B');
  dayGrad.addColorStop(0.72, '#1B2528');
  dayGrad.addColorStop(1, '#10151A');
  dCtx.fillStyle = dayGrad;
  dCtx.fillRect(0, 0, size, size);

  // Subtle warm sandstone interior ceiling soffit & recessed depth behind glass
  dCtx.fillStyle = 'rgba(237, 228, 212, 0.16)';
  dCtx.fillRect(0, 0, size, 48 * sc);
  dCtx.fillStyle = 'rgba(12, 16, 20, 0.42)';
  dCtx.fillRect(0, size * 0.72, size, size * 0.28);

  // Crisp sunlit warm ivory reflection bloom across upper pane
  const cloudRef = dCtx.createRadialGradient(size * 0.68, size * 0.22, 16 * sc, size * 0.64, size * 0.22, 190 * sc);
  cloudRef.addColorStop(0, 'rgba(237, 228, 212, 0.28)');
  cloudRef.addColorStop(0.6, 'rgba(212, 186, 139, 0.12)');
  cloudRef.addColorStop(1, 'rgba(255, 255, 255, 0)');
  dCtx.fillStyle = cloudRef;
  dCtx.fillRect(0, 0, size, size);

  // Diagonal architectural glass reflection sweep
  dCtx.fillStyle = 'rgba(237, 228, 212, 0.18)';
  dCtx.beginPath();
  dCtx.moveTo(56 * sc, 0);
  dCtx.lineTo(188 * sc, 0);
  dCtx.lineTo(74 * sc, size);
  dCtx.lineTo(0, size);
  dCtx.closePath();
  dCtx.fill();

  // Secondary narrow bronze specular highlight streak
  dCtx.fillStyle = 'rgba(212, 186, 139, 0.16)';
  dCtx.beginPath();
  dCtx.moveTo(222 * sc, 0);
  dCtx.lineTo(256 * sc, 0);
  dCtx.lineTo(142 * sc, size);
  dCtx.lineTo(108 * sc, size);
  dCtx.closePath();
  dCtx.fill();

  // Subtle modern sheer architectural side drapery
  dCtx.fillStyle = 'rgba(237, 228, 212, 0.12)';
  dCtx.fillRect(0, 0, 38 * sc, size);
  dCtx.fillRect(size - 38 * sc, 0, 38 * sc, size);

  // Nighttime Architectural Digest luxury interior: warm amber ceiling coves + sleek dark lounge silhouette
  const nCanvas = document.createElement('canvas');
  nCanvas.width = size;
  nCanvas.height = size;
  const nCtx = nCanvas.getContext('2d')!;
  const nightGrad = nCtx.createLinearGradient(0, 0, 0, size);
  nightGrad.addColorStop(0, '#FFF1D2');
  nightGrad.addColorStop(0.24, '#ECC078');
  nightGrad.addColorStop(0.62, '#A87436');
  nightGrad.addColorStop(0.86, '#2E2622');
  nightGrad.addColorStop(1, '#12151E');
  nCtx.fillStyle = nightGrad;
  nCtx.fillRect(0, 0, size, size);

  // Warm recessed architectural ceiling linear cove trough
  nCtx.fillStyle = '#FFF9E8';
  nCtx.fillRect(42 * sc, 24 * sc, size - 84 * sc, 14 * sc);
  const coveGlow = nCtx.createLinearGradient(0, 24 * sc, 0, 180 * sc);
  coveGlow.addColorStop(0, 'rgba(255, 244, 218, 0.92)');
  coveGlow.addColorStop(0.45, 'rgba(244, 200, 128, 0.36)');
  coveGlow.addColorStop(1, 'rgba(244, 200, 128, 0)');
  nCtx.fillStyle = coveGlow;
  nCtx.fillRect(0, 24 * sc, size, 156 * sc);

  // Architectural interior feature wall & illuminated vertical art niche
  nCtx.fillStyle = 'rgba(28, 26, 28, 0.36)';
  nCtx.fillRect(148 * sc, 128 * sc, 216 * sc, 174 * sc);
  nCtx.strokeStyle = 'rgba(255, 234, 194, 0.55)';
  nCtx.lineWidth = 4 * sc;
  nCtx.strokeRect(158 * sc, 138 * sc, 196 * sc, 154 * sc);

  // Sleek low-profile contemporary lounge sofa & coffee table silhouette
  nCtx.fillStyle = 'rgba(20, 22, 28, 0.7)';
  nCtx.fillRect(96 * sc, 368 * sc, 320 * sc, 82 * sc);
  nCtx.fillStyle = 'rgba(12, 14, 18, 0.85)';
  nCtx.fillRect(72 * sc, 434 * sc, 368 * sc, 78 * sc);

  // Subtle recessed interior track downlight spots
  [124, 256, 388].forEach((lx) => {
    const cx = lx * sc;
    const spot = nCtx.createRadialGradient(cx, 56 * sc, 4 * sc, cx, 90 * sc, 96 * sc);
    spot.addColorStop(0, 'rgba(255, 246, 222, 0.86)');
    spot.addColorStop(0.4, 'rgba(244, 206, 136, 0.32)');
    spot.addColorStop(1, 'rgba(244, 206, 136, 0)');
    nCtx.fillStyle = spot;
    nCtx.fillRect(cx - 96 * sc, 0, 192 * sc, 210 * sc);
  });

  // Dark bronze-graphite mullions along edges
  nCtx.fillStyle = 'rgba(14, 16, 22, 0.78)';
  nCtx.fillRect(0, 0, 18 * sc, size);
  nCtx.fillRect(size - 18 * sc, 0, 18 * sc, size);

  const dayMap = finalizeColorTexture(new THREE.CanvasTexture(dCanvas), anisotropy);
  const nightMap = finalizeColorTexture(new THREE.CanvasTexture(nCanvas), anisotropy);
  const nightEmissiveMap = finalizeColorTexture(new THREE.CanvasTexture(nCanvas), anisotropy);

  return {
    dayMap,
    nightMap,
    nightEmissiveMap,
    dispose: () => {
      dayMap.dispose();
      nightMap.dispose();
      nightEmissiveMap.dispose();
    },
  };
}

/**
 * Natural 2048x1024 Photorealistic Sky Dome (Equirectangular — Powers both Sky Backdrop AND True IBL Reflections!):
 * - Daytime (Light Mode): Natural bright sky blue, warm sun disc & atmospheric Rayleigh horizon haze, layered sunlit cumulus clouds.
 * - Nighttime (Dark Mode): Clear deep starry night sky, glowing moon with lunar craters, and warm distant metropolitan horizon bounce.
 */
export function createSkyDomeTexture(isDarkMode = true): THREE.CanvasTexture {
  const w = 2048;
  const h = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 0, h);
  if (isDarkMode) {
    grad.addColorStop(0.0, '#030610');
    grad.addColorStop(0.28, '#081228');
    grad.addColorStop(0.46, '#11203D');
    grad.addColorStop(0.51, '#1A2D4F');
    grad.addColorStop(0.56, '#0D1629');
    grad.addColorStop(1.0, '#060A14');
  } else {
    // Natural crisp atmospheric daylight sky -> warm ivory/sandstone haze (zero cyan blowout)
    grad.addColorStop(0.0, '#224C7E');
    grad.addColorStop(0.22, '#4E7AA8');
    grad.addColorStop(0.40, '#8BA9C7');
    grad.addColorStop(0.49, '#DCD6C6');
    grad.addColorStop(0.53, '#E8E0D0');
    grad.addColorStop(0.66, '#A2A08D');
    grad.addColorStop(1.0, '#59604B');
  }

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  let seed = isDarkMode ? 8819 : 5521;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  if (isDarkMode) {
    const starColors = ['#FFFFFF', '#F8FAFC', '#FDEBD0', '#E2E8F0'];
    for (let i = 0; i < 520; i++) {
      const sx = rand() * w;
      const sy = rand() * (h * 0.44);
      const r = rand() > 0.92 ? 2.0 : rand() > 0.65 ? 1.25 : 0.75;
      ctx.fillStyle = starColors[i % starColors.length];
      ctx.globalAlpha = 0.28 + rand() * 0.68;
      ctx.beginPath();
      ctx.arc(sx, sy, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Warm amber metropolitan horizon bounce (zero neon cyan)
    const glowGrad = ctx.createRadialGradient(w * 0.5, h * 0.52, 40, w * 0.5, h * 0.52, w * 0.52);
    glowGrad.addColorStop(0, 'rgba(235, 168, 82, 0.22)');
    glowGrad.addColorStop(0.55, 'rgba(184, 107, 75, 0.11)');
    glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, h * 0.25, w, h * 0.42);

    const mx = w * 0.72;
    const my = h * 0.2;
    const moonHalo = ctx.createRadialGradient(mx, my, 12, mx, my, 150);
    moonHalo.addColorStop(0, 'rgba(241, 245, 249, 0.55)');
    moonHalo.addColorStop(0.32, 'rgba(203, 213, 225, 0.14)');
    moonHalo.addColorStop(1, 'rgba(203, 213, 225, 0)');
    ctx.fillStyle = moonHalo;
    ctx.beginPath();
    ctx.arc(mx, my, 150, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#F8FAFC';
    ctx.beginPath();
    ctx.arc(mx, my, 20, 0, Math.PI * 2);
    ctx.fill();
  } else {
    const sx = w * 0.68;
    const sy = h * 0.21;
    const sunHalo = ctx.createRadialGradient(sx, sy, 14, sx, sy, 280);
    sunHalo.addColorStop(0, 'rgba(255, 250, 236, 0.96)');
    sunHalo.addColorStop(0.18, 'rgba(255, 242, 204, 0.52)');
    sunHalo.addColorStop(0.5, 'rgba(220, 214, 198, 0.18)');
    sunHalo.addColorStop(1, 'rgba(220, 214, 198, 0)');
    ctx.fillStyle = sunHalo;
    ctx.beginPath();
    ctx.arc(sx, sy, 280, 0, Math.PI * 2);
    ctx.fill();

    for (let i = 0; i < 34; i++) {
      const cx = rand() * w;
      const cy = h * (0.2 + rand() * 0.23);
      const cw = 90 + rand() * 230;
      const ch = 15 + rand() * 36;

      const cGrad = ctx.createLinearGradient(cx, cy - ch, cx, cy + ch);
      cGrad.addColorStop(0, 'rgba(252, 248, 240, 0.92)');
      cGrad.addColorStop(0.58, 'rgba(236, 232, 224, 0.68)');
      cGrad.addColorStop(0.85, 'rgba(182, 192, 204, 0.30)');
      cGrad.addColorStop(1, 'rgba(170, 184, 200, 0.0)');
      ctx.fillStyle = cGrad;

      for (let p = 0; p < 5; p++) {
        const px = cx + (p - 2) * (cw * 0.2);
        const py = cy + Math.sin(p * 1.35) * (ch * 0.26);
        const rx = cw * (0.24 + (p === 2 ? 0.14 : p === 1 || p === 3 ? 0.08 : 0));
        const ry = ch * (0.52 + (p === 2 ? 0.28 : 0));
        ctx.beginPath();
        ctx.ellipse(px, py, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.mapping = THREE.EquirectangularReflectionMapping;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Generates an ArchViz PMREM-ready Equirectangular Environment Map tuned specifically for
 * smoked emerald/bronze glass, patinated bronze, champagne gold, and realistic river reflections.
 */
export function createArchVizEnvironmentTexture(
  isDarkMode: boolean,
  highRes = true
): THREE.CanvasTexture {
  const w = highRes ? 2048 : 1024;
  const h = highRes ? 1024 : 512;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 0, h);
  if (isDarkMode) {
    // Deep midnight navy & warm amber-gold skyline bounce
    grad.addColorStop(0.0, '#040814');
    grad.addColorStop(0.24, '#0A142B');
    grad.addColorStop(0.42, '#112242');
    grad.addColorStop(0.495, '#1D2B42');
    grad.addColorStop(0.525, '#2A2936');
    grad.addColorStop(0.64, '#121824');
    grad.addColorStop(1.0, '#080C16');
  } else {
    // Natural cerulean sky zenith to warm ivory/sandstone horizon & olive earth bounce
    grad.addColorStop(0.0, '#1D4674');
    grad.addColorStop(0.22, '#4373A2');
    grad.addColorStop(0.41, '#8CA8BF');
    grad.addColorStop(0.495, '#E4DDD0');
    grad.addColorStop(0.53, '#D5C4A8');
    grad.addColorStop(0.68, '#535C45');
    grad.addColorStop(1.0, '#272F24');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // City skyline silhouette reflection along equator (bronze & warm amber window reflections at night)
  const horizonY = h * 0.505;
  let seed = isDarkMode ? 739 : 419;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  for (let i = 0; i < 64; i++) {
    const bx = (i / 64) * w;
    const bw = (w / 64) * (0.7 + rand() * 0.6);
    const bh = h * (0.024 + rand() * 0.06);
    ctx.fillStyle = isDarkMode ? 'rgba(10, 18, 36, 0.78)' : 'rgba(42, 50, 56, 0.36)';
    ctx.fillRect(bx, horizonY - bh, bw, bh);
    if (isDarkMode) {
      ctx.fillStyle = i % 3 === 0 ? 'rgba(212, 186, 139, 0.38)' : 'rgba(245, 185, 92, 0.44)';
      for (let wy = horizonY - bh + 4; wy < horizonY - 4; wy += 6) {
        if (rand() > 0.3) ctx.fillRect(bx + 3, wy, Math.max(2, bw - 6), 2);
      }
    }
  }

  // Primary directional solar / moonlight-amber specular hotspot
  const sx = isDarkMode ? w * 0.58 : w * 0.66;
  const sy = isDarkMode ? h * 0.36 : h * 0.24;
  const sunRad = w * 0.14;
  const sunGlow = ctx.createRadialGradient(sx, sy, 4, sx, sy, sunRad);
  if (isDarkMode) {
    sunGlow.addColorStop(0.0, 'rgba(246, 236, 220, 0.92)');
    sunGlow.addColorStop(0.18, 'rgba(235, 178, 96, 0.52)');
    sunGlow.addColorStop(0.5, 'rgba(108, 138, 188, 0.22)');
    sunGlow.addColorStop(1.0, 'rgba(14, 24, 48, 0.0)');
  } else {
    sunGlow.addColorStop(0.0, 'rgba(255, 250, 236, 0.96)');
    sunGlow.addColorStop(0.18, 'rgba(255, 236, 196, 0.72)');
    sunGlow.addColorStop(0.5, 'rgba(216, 212, 200, 0.24)');
    sunGlow.addColorStop(1.0, 'rgba(216, 212, 200, 0.0)');
  }
  ctx.fillStyle = sunGlow;
  ctx.beginPath();
  ctx.arc(sx, sy, sunRad, 0, Math.PI * 2);
  ctx.fill();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.mapping = THREE.EquirectangularReflectionMapping;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Soft radial grounding shadow map under houses, cars, and landmarks
 */
export function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(128, 128, 12, 128, 128, 124);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.68)');
  grad.addColorStop(0.55, 'rgba(0, 0, 0, 0.3)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0.0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

/**
 * Warm champagne-gold & amber LED streetlamp ground light pool texture for Night Mode
 */
export function createLightPoolTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(128, 128, 6, 128, 128, 124);
  grad.addColorStop(0, 'rgba(255, 232, 178, 0.52)');
  grad.addColorStop(0.45, 'rgba(240, 184, 92, 0.22)');
  grad.addColorStop(1, 'rgba(212, 152, 64, 0.0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Realistic Tapered Dual Modern Xenon/LED Car Headlight Beam Projection on Night Asphalt
 */
export function createCarHeadlightBeamTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Twin crisp modern LED headlights illuminating the tarmac ahead
  [82, 174].forEach((cx) => {
    const grad = ctx.createRadialGradient(cx, 488, 6, cx, 290, 250);
    grad.addColorStop(0, 'rgba(238, 248, 255, 0.6)');
    grad.addColorStop(0.32, 'rgba(198, 228, 255, 0.26)');
    grad.addColorStop(0.75, 'rgba(147, 197, 253, 0.06)');
    grad.addColorStop(1, 'rgba(147, 197, 253, 0.0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(cx - 18, 504);
    ctx.lineTo(cx - 72, 24);
    ctx.lineTo(cx + 72, 24);
    ctx.lineTo(cx + 18, 504);
    ctx.closePath();
    ctx.fill();
  });

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Sleek Luxury Champagne-Gold, Dark Graphite & Warm Ivory Architectural Nameplate Plaque on each Service House
 */
export function createHousePlaqueTexture(
  num: string,
  title: string,
  categoryTag: string,
  accentCss = '#1F4E37',
  anisotropy = 8,
  isDarkMode = true
): THREE.CanvasTexture {
  const w = 1024;
  const h = 340;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = isDarkMode ? '#101520' : '#F3ECE0';
  ctx.fillRect(0, 0, w, h);

  // Luxury double border: champagne metallic & patinated bronze
  ctx.strokeStyle = isDarkMode ? '#D4BA8B' : '#8C6239';
  ctx.lineWidth = 8;
  ctx.strokeRect(12, 12, w - 24, h - 24);

  ctx.strokeStyle = isDarkMode ? 'rgba(212, 186, 139, 0.34)' : 'rgba(31, 78, 55, 0.32)';
  ctx.lineWidth = 2;
  ctx.strokeRect(26, 26, w - 52, h - 52);

  // House Number & Category Header
  ctx.fillStyle = isDarkMode ? '#D4BA8B' : '#1E2229';
  ctx.fillRect(48, 52, 92, 44);
  ctx.fillStyle = isDarkMode ? '#101520' : '#EDE4D4';
  ctx.font = '800 26px "JetBrains Mono", monospace';
  ctx.textBaseline = 'middle';
  ctx.fillText(`0${num.replace(/^0+/, '')}`.slice(-2), 75, 74);

  ctx.fillStyle = isDarkMode ? '#E8C688' : '#8C6239';
  ctx.font = '700 21px "Plus Jakarta Sans", sans-serif';
  const shortCat = categoryTag.split('·')[0]?.trim() || 'Service Studio';
  ctx.fillText(shortCat.toUpperCase(), 162, 74);

  // Hairline rule
  ctx.fillStyle = isDarkMode ? 'rgba(212, 186, 139, 0.28)' : 'rgba(30, 34, 41, 0.16)';
  ctx.fillRect(48, 114, w - 96, 2);

  // Crisp Service Title
  ctx.fillStyle = isDarkMode ? '#F7F1E5' : '#1E2229';
  ctx.font = '800 50px "Plus Jakarta Sans", sans-serif';
  const words = title.split(' ');
  let line1 = '';
  let line2 = '';
  for (const word of words) {
    if ((line1 + ' ' + word).trim().length <= 22) {
      line1 = (line1 + ' ' + word).trim();
    } else {
      line2 = (line2 + ' ' + word).trim();
    }
  }
  if (line2) {
    ctx.fillText(line1, 48, 178);
    ctx.font = '700 42px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = isDarkMode ? '#E6BC72' : accentCss;
    ctx.fillText(line2, 48, 248);
  } else {
    ctx.fillText(line1, 48, 212);
  }

  return finalizeColorTexture(new THREE.CanvasTexture(canvas), anisotropy);
}

/**
 * Photorealistic 512x512 Alpha-Cutout Botanical Oak/Beech Leafy Branch Cluster Texture.
 * Replaces cartoonish blobby sphere trees with crisp multi-card architectural-visualization foliage
 * that casts authentic dappled leafy shadows on streets, parks, and building facades.
 */
export function createBotanicalLeafClusterTexture(
  anisotropy = 8,
  highRes = true
): THREE.CanvasTexture {
  const size = highRes ? 1024 : 512;
  const sc = size / 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, size, size);

  let seed = 7331;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  // Draw fine organic branching woody twigs radiating from lower-center stem
  ctx.strokeStyle = '#3C2D20';
  ctx.lineCap = 'round';
  const branches: [number, number, number, number, number][] = [
    [256, 468, 256, 152, 7],
    [256, 360, 148, 232, 4.5],
    [256, 345, 366, 224, 4.5],
    [256, 268, 174, 142, 3.6],
    [256, 255, 342, 138, 3.6],
    [186, 276, 112, 266, 2.5],
    [328, 268, 404, 252, 2.5],
    [256, 200, 212, 92, 2.6],
    [256, 196, 302, 96, 2.6],
  ];
  branches.forEach(([x0, y0, x1, y1, lw]) => {
    ctx.lineWidth = lw * sc;
    ctx.beginPath();
    ctx.moveTo(x0 * sc, y0 * sc);
    ctx.quadraticCurveTo(
      ((x0 + x1) * 0.5 + (rand() - 0.5) * 24) * sc,
      ((y0 + y1) * 0.5) * sc,
      x1 * sc,
      y1 * sc
    );
    ctx.stroke();
  });

  // Helper to paint an individual botanical leaf with midrib & lateral veins
  const drawLeaf = (cx: number, cy: number, rx: number, ry: number, ang: number, light: number) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(ang);

    const r = Math.round(145 + light * 62);
    const g = Math.round(162 + light * 68);
    const b = Math.round(118 + light * 48);
    const grad = ctx.createLinearGradient(-rx, -ry, rx, ry);
    grad.addColorStop(0, `rgb(${Math.min(255, r + 18)},${Math.min(255, g + 20)},${Math.min(255, b + 12)})`);
    grad.addColorStop(1, `rgb(${Math.max(40, r - 38)},${Math.max(46, g - 36)},${Math.max(32, b - 28)})`);
    ctx.fillStyle = grad;

    ctx.beginPath();
    ctx.moveTo(0, -ry);
    ctx.bezierCurveTo(rx * 1.05, -ry * 0.45, rx * 0.92, ry * 0.55, 0, ry);
    ctx.bezierCurveTo(-rx * 0.92, ry * 0.55, -rx * 1.05, -ry * 0.45, 0, -ry);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = 'rgba(28, 38, 22, 0.36)';
    ctx.lineWidth = 1.2 * sc;
    ctx.stroke();
    ctx.strokeStyle = 'rgba(220, 232, 195, 0.34)';
    ctx.lineWidth = 1.0 * sc;
    ctx.beginPath();
    ctx.moveTo(0, -ry * 0.78);
    ctx.lineTo(0, ry * 0.82);
    ctx.stroke();

    ctx.restore();
  };

  // Paint organically layered crisp leaves (higher density in highRes mode)
  const leafFactor = highRes ? 1.5 : 1.0;
  for (let layer = 0; layer < 2; layer++) {
    const count = Math.round((layer === 0 ? 105 : 100) * leafFactor);
    for (let i = 0; i < count; i++) {
      const a = rand() * Math.PI * 2;
      const dist = Math.pow(rand(), layer === 0 ? 0.65 : 0.48) * (layer === 0 ? 168 : 198) * sc;
      const lx = 256 * sc + Math.cos(a) * dist * 1.06;
      const ly = 248 * sc + Math.sin(a) * dist * 0.96;
      if (lx < 28 * sc || lx > size - 28 * sc || ly < 24 * sc || ly > size - 36 * sc) continue;

      const rx = (11 + rand() * 13) * sc;
      const ry = (20 + rand() * 19) * sc;
      const rot = Math.atan2(ly - 300 * sc, lx - 256 * sc) + Math.PI * 0.5 + (rand() - 0.5) * 1.15;
      const topSunBias = Math.max(0, Math.min(1, 0.85 - ly / size));
      const light = Math.max(0, Math.min(1, (layer === 0 ? 0.16 : 0.45) + topSunBias * 0.45 + (rand() - 0.5) * 0.2));
      drawLeaf(lx, ly, rx, ry, rot, light);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = Math.min(Math.max(anisotropy, 4), 16);
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return tex;
}

/**
 * High-Resolution Botanical Tropical Date Palm Frond Alpha-Cutout Texture (Singapore & Dubai Waterfront Palms).
 * Crisp curved central rachis with feathered deep-emerald and muted-olive leaflets.
 */
export function createPalmFrondTexture(
  anisotropy = 8,
  highRes = true
): THREE.CanvasTexture {
  const w = highRes ? 512 : 256;
  const h = highRes ? 1024 : 512;
  const sx = w / 512;
  const sy = h / 1024;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, w, h);

  // Central woody-olive palm frond rachis
  ctx.strokeStyle = '#6A6E45';
  ctx.lineWidth = 10 * sx;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(256 * sx, 1000 * sy);
  ctx.quadraticCurveTo(252 * sx, 500 * sy, 256 * sx, 38 * sy);
  ctx.stroke();

  let seed = 4127;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  // Pairs of pointed tapering palm leaflets radiating upward along the rachis
  const pairs = 28;
  for (let i = 0; i < pairs; i++) {
    const t = i / (pairs - 1); // 0 bottom -> 1 tip
    const py = (940 - t * 880) * sy;
    const spanFactor = Math.sin(t * Math.PI * 0.88 + 0.16);
    const len = (55 + spanFactor * 168) * sx;
    const width = (7 + spanFactor * 9) * sy;

    [-1, 1].forEach((side) => {
      const tipX = 256 * sx + side * len;
      const tipY = py - (52 + t * 55 + rand() * 14) * sy;
      const midX = 256 * sx + side * len * 0.56;
      const midY = py - (32 + t * 28) * sy;

      const grad = ctx.createLinearGradient(256 * sx, py, tipX, tipY);
      const toneShift = Math.round((rand() - 0.5) * 18);
      grad.addColorStop(0, `rgb(${44 + toneShift},${82 + toneShift},${52 + toneShift})`);
      grad.addColorStop(0.65, `rgb(${68 + toneShift},${104 + toneShift},${62 + toneShift})`);
      grad.addColorStop(1, `rgb(${112 + toneShift},${128 + toneShift},${76 + toneShift})`);
      ctx.fillStyle = grad;

      ctx.beginPath();
      ctx.moveTo(256 * sx, py - width * 0.45);
      ctx.quadraticCurveTo(midX, midY - width, tipX, tipY);
      ctx.quadraticCurveTo(midX, midY + width * 0.65, 256 * sx, py + width * 0.55);
      ctx.closePath();
      ctx.fill();
    });
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = Math.min(Math.max(anisotropy, 4), 16);
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Injects real-world architectural ground-contact Ambient Occlusion (vertical height darkening near y = 0)
 * into any MeshStandardMaterial or MeshPhysicalMaterial (supports both standard Mesh and InstancedMesh!).
 * Strictly computes world-space Y inside the vertex shader and passes it via varying (zero fragment modelMatrix refs).
 */
export function applyGroundAO(
  mat: THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial,
  heightSpan = 4.2,
  strength = 0.28
): void {
  const prevCompile = mat.onBeforeCompile;
  mat.customProgramCacheKey = () => `ground_ao_${heightSpan.toFixed(2)}_${strength.toFixed(2)}`;
  mat.onBeforeCompile = (shader, renderer) => {
    if (prevCompile) {
      prevCompile(shader, renderer);
    }
    shader.vertexShader =
      `varying float vAoWorldY;\n` +
      shader.vertexShader.replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        vec4 aoWp = vec4(transformed, 1.0);
        #ifdef USE_INSTANCING
          aoWp = instanceMatrix * aoWp;
        #endif
        aoWp = modelMatrix * aoWp;
        vAoWorldY = aoWp.y;`
      );
    shader.fragmentShader =
      `varying float vAoWorldY;\n` +
      shader.fragmentShader.replace(
        '#include <color_fragment>',
        `#include <color_fragment>
        float gAo = mix(${(1 - strength).toFixed(3)}, 1.0, smoothstep(0.0, ${heightSpan.toFixed(2)}, max(0.0, vAoWorldY)));
        diffuseColor.rgb *= gAo;`
      );
  };
}

/**
 * High-Resolution Procedural Front-Wall Service Emblem & Logo Plaque
 * Renders an authentic architectural emblem symbol + service name and number.
 */
export function createServiceEmblemTexture(
  serviceId: string,
  serviceTitle: string,
  serviceNumber: string,
  accentCss = '#38BDF8',
  anisotropy = 8,
  isDarkMode = true
): THREE.CanvasTexture {
  const w = 512;
  const h = 512;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = isDarkMode ? '#0A101D' : '#F8FAFC';
  ctx.fillRect(0, 0, w, h);

  // Outer framed border
  ctx.strokeStyle = accentCss;
  ctx.lineWidth = 10;
  ctx.strokeRect(16, 16, w - 32, h - 32);

  ctx.strokeStyle = isDarkMode ? 'rgba(56,189,248,0.3)' : 'rgba(29,78,216,0.2)';
  ctx.lineWidth = 3;
  ctx.strokeRect(32, 32, w - 64, h - 64);

  // Draw distinct geometric symbol based on serviceId
  ctx.save();
  ctx.translate(w / 2, 175);
  ctx.fillStyle = accentCss;
  ctx.strokeStyle = accentCss;
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (serviceId.includes('ecommerce') || serviceId.includes('shop')) {
    // Shopping Bag / Storefront emblem
    ctx.beginPath();
    ctx.roundRect(-45, -20, 90, 75, 12);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, -20, 28, Math.PI, 0, false);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, 5);
    ctx.lineTo(16, 22);
    ctx.lineTo(0, 39);
    ctx.lineTo(-16, 22);
    ctx.closePath();
    ctx.fill();
  } else if (serviceId.includes('web-dev') || serviceId.includes('development')) {
    // Code brackets </ > emblem
    ctx.font = '800 68px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('</>', 0, 15);
  } else if (serviceId.includes('branding') || serviceId.includes('design')) {
    // Creative Prism / Diamond Vector Anchor emblem
    ctx.beginPath();
    ctx.moveTo(0, -42);
    ctx.lineTo(38, 0);
    ctx.lineTo(0, 42);
    ctx.lineTo(-38, 0);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.fill();
  } else if (serviceId.includes('marketing') || serviceId.includes('digital')) {
    // Megaphone / Growth trajectory arrow emblem
    ctx.beginPath();
    ctx.moveTo(-35, -20);
    ctx.lineTo(-15, -20);
    ctx.lineTo(35, -45);
    ctx.lineTo(35, 45);
    ctx.lineTo(-15, 20);
    ctx.lineTo(-35, 20);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-20, 5);
    ctx.lineTo(0, -15);
    ctx.lineTo(15, -5);
    ctx.lineTo(28, -25);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 6;
    ctx.stroke();
  } else if (serviceId.includes('app') || serviceId.includes('custom')) {
    // Cloud Processor / Gear emblem
    ctx.beginPath();
    ctx.arc(-12, 10, 22, 0, Math.PI * 2);
    ctx.arc(16, 4, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, -16, 20, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Hosting / Security Shield / Server Node emblem
    ctx.beginPath();
    ctx.moveTo(0, -40);
    ctx.lineTo(32, -18);
    ctx.lineTo(32, 15);
    ctx.quadraticCurveTo(0, 48, 0, 48);
    ctx.quadraticCurveTo(0, 48, -32, 15);
    ctx.lineTo(-32, -18);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 2, 12, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Number Badge & Title below emblem
  ctx.fillStyle = accentCss;
  ctx.font = '800 24px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`SERVICE 0${serviceNumber.replace(/^0+/, '')}`.toUpperCase(), w / 2, 380);

  ctx.fillStyle = isDarkMode ? '#F1F5F9' : '#0F172A';
  ctx.font = '800 28px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(serviceTitle, w / 2, 435, w - 60);

  return finalizeColorTexture(new THREE.CanvasTexture(canvas), anisotropy);
}

/**
 * Warm Sandstone, Ivory Limestone & Terracotta Architectural Tower PBR Set:
 * Sculpted ashlar stone piers + recessed smoked-emerald/bronze glazing (Day) & warm amber interiors (Night).
 */
export function createLimestoneTowerPbrSet(anisotropy = 8, highRes = true): SkyscraperPbrSet {
  const size = highRes ? 2048 : 1024;
  const cols = 8;
  const rows = 18;
  const cellW = size / cols;
  const cellH = size / rows;
  const pierW = Math.round(size * 0.024);
  const spandrelH = Math.round(size * 0.015);

  const darkCanvas = document.createElement('canvas');
  darkCanvas.width = size;
  darkCanvas.height = size;
  const dCtx = darkCanvas.getContext('2d')!;

  const emissiveCanvas = document.createElement('canvas');
  emissiveCanvas.width = size;
  emissiveCanvas.height = size;
  const eCtx = emissiveCanvas.getContext('2d')!;

  const lightCanvas = document.createElement('canvas');
  lightCanvas.width = size;
  lightCanvas.height = size;
  const lCtx = lightCanvas.getContext('2d')!;

  const mapSize = highRes ? 1024 : 512;
  const heightCanvas = document.createElement('canvas');
  heightCanvas.width = mapSize;
  heightCanvas.height = mapSize;
  const hCtx = heightCanvas.getContext('2d')!;

  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = mapSize;
  roughCanvas.height = mapSize;
  const rCtx = roughCanvas.getContext('2d')!;

  // Warm Ivory & Sandstone Beige stone (Day) vs Dark Graphite & Bronze stone (Night)
  lCtx.fillStyle = '#E8DCC9';
  lCtx.fillRect(0, 0, size, size);
  dCtx.fillStyle = '#181E2B';
  dCtx.fillRect(0, 0, size, size);
  eCtx.fillStyle = '#000000';
  eCtx.fillRect(0, 0, size, size);
  hCtx.fillStyle = '#F0F0F0';
  hCtx.fillRect(0, 0, mapSize, mapSize);
  rCtx.fillStyle = '#CECECE';
  rCtx.fillRect(0, 0, mapSize, mapSize);

  // Crisp horizontal travertine/sandstone ashlar shadow grooves
  lCtx.fillStyle = 'rgba(130, 102, 74, 0.18)';
  dCtx.fillStyle = 'rgba(8, 12, 22, 0.36)';
  const courseStep = Math.round(size / 36);
  for (let y = 0; y < size; y += courseStep) {
    lCtx.fillRect(0, y, size, 2);
    dCtx.fillRect(0, y, size, 2);
  }

  let seed = 8821;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const sc = mapSize / size;

  for (let r = 0; r < rows; r++) {
    const isCorniceBand = r === 0 || r === 6 || r === 12;
    for (let c = 0; c < cols; c++) {
      const x = Math.round(c * cellW + pierW * 0.5);
      const y = Math.round(r * cellH + spandrelH * 0.5);
      const w = Math.round(cellW - pierW);
      const h = Math.round(cellH - spandrelH);

      const mx = Math.round(x * sc);
      const my = Math.round(y * sc);
      const mw = Math.max(2, Math.round(w * sc));
      const mh = Math.max(2, Math.round(h * sc));

      if (isCorniceBand) {
        lCtx.fillStyle = r === 6 ? '#B86B4B' : '#D4C2A5';
        lCtx.fillRect(c * cellW, y, cellW, h);
        dCtx.fillStyle = '#242A3A';
        dCtx.fillRect(c * cellW, y, cellW, h);
        if (r === 0 || r === 12) {
          lCtx.fillStyle = '#D4BA8B';
          lCtx.fillRect(x, y + Math.round(h * 0.42), w, 5);
          dCtx.fillStyle = '#F0C068';
          dCtx.fillRect(x, y + Math.round(h * 0.42), w, 4);
          eCtx.fillStyle = '#DE9E42';
          eCtx.fillRect(x, y + Math.round(h * 0.42), w, 4);
        }
        continue;
      }

      hCtx.fillStyle = '#181818';
      hCtx.fillRect(mx, my, mw, mh);
      rCtx.fillStyle = '#0C0C0C';
      rCtx.fillRect(mx, my, mw, mh);

      // Day Mode: Deep emerald & smoked bronze recessed glazing with bronze mullions
      const dayGrad = lCtx.createLinearGradient(x, y, x + w, y + h);
      dayGrad.addColorStop(0, '#235240');
      dayGrad.addColorStop(0.5, '#19322B');
      dayGrad.addColorStop(1, '#313736');
      lCtx.fillStyle = dayGrad;
      lCtx.fillRect(x, y, w, h);

      lCtx.fillStyle = '#8C6239';
      lCtx.fillRect(x + Math.round(w * 0.48), y, Math.max(3, Math.round(size * 0.004)), h);
      lCtx.strokeStyle = '#6E4C2C';
      lCtx.lineWidth = Math.max(2, Math.round(size * 0.0025));
      lCtx.strokeRect(x + 1, y + 1, w - 2, h - 2);

      const lit = rand() > 0.34;
      if (lit) {
        const warmGrad = dCtx.createLinearGradient(x, y, x, y + h);
        warmGrad.addColorStop(0, '#FFECC0');
        warmGrad.addColorStop(0.6, '#E09D46');
        warmGrad.addColorStop(1, '#8C5320');
        dCtx.fillStyle = warmGrad;
        dCtx.fillRect(x, y, w, h);
        eCtx.fillStyle = warmGrad;
        eCtx.fillRect(x + 2, y + 2, w - 4, h - 4);
      } else {
        dCtx.fillStyle = '#0E1524';
        dCtx.fillRect(x, y, w, h);
      }
      dCtx.fillStyle = '#161B26';
      dCtx.fillRect(x + Math.round(w * 0.48), y, Math.max(3, Math.round(size * 0.004)), h);
      eCtx.fillStyle = '#000000';
      eCtx.fillRect(x + Math.round(w * 0.48), y, Math.max(3, Math.round(size * 0.004)), h);
    }
  }

  const darkMap = finalizeColorTexture(new THREE.CanvasTexture(darkCanvas), anisotropy, 1, 2);
  const darkEmissiveMap = finalizeColorTexture(new THREE.CanvasTexture(emissiveCanvas), anisotropy, 1, 2);
  const lightMap = finalizeColorTexture(new THREE.CanvasTexture(lightCanvas), anisotropy, 1, 2);
  const normalMap = heightCanvasToNormalTexture(heightCanvas, 2.8, anisotropy, 1, 2);
  const roughnessMap = finalizeDataTexture(
    new THREE.CanvasTexture(roughCanvas),
    anisotropy,
    1,
    2
  ) as THREE.CanvasTexture;

  return {
    darkMap,
    darkEmissiveMap,
    lightMap,
    normalMap,
    roughnessMap,
    dispose: () => {
      darkMap.dispose();
      darkEmissiveMap.dispose();
      lightMap.dispose();
      normalMap.dispose();
      roughnessMap.dispose();
    },
  };
}

export interface HerringboneFloorPbrSet {
  map: THREE.CanvasTexture;
  normalMap: THREE.DataTexture;
  roughnessMap: THREE.CanvasTexture;
  dispose: () => void;
}

/**
 * High-Craft Architectural Herringbone Oak Parquet Flooring PBR Set (512x512 tiled)
 * for the bespoke walk-in 3D Service House Interiors!
 */
export function createHerringboneFloorPbrSet(
  anisotropy = 8,
  highRes = true
): HerringboneFloorPbrSet {
  const size = highRes ? 1024 : 512;
  const sc = size / 512;
  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = size;
  colorCanvas.height = size;
  const cCtx = colorCanvas.getContext('2d')!;

  const heightCanvas = document.createElement('canvas');
  heightCanvas.width = size;
  heightCanvas.height = size;
  const hCtx = heightCanvas.getContext('2d')!;

  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = size;
  roughCanvas.height = size;
  const rCtx = roughCanvas.getContext('2d')!;

  cCtx.fillStyle = '#8A6340';
  cCtx.fillRect(0, 0, size, size);
  hCtx.fillStyle = '#C8C8C8';
  hCtx.fillRect(0, 0, size, size);
  rCtx.fillStyle = '#585858';
  rCtx.fillRect(0, 0, size, size);

  const tones = ['#A37B54', '#926B46', '#B18860', '#845F3E', '#9C744E'];
  const step = 32 * sc;
  let idx = 0;

  for (let row = -2; row < size / step + 4; row++) {
    for (let col = -2; col < size / step + 4; col++) {
      const x = col * step;
      const y = row * step;
      const horiz = (row + col) % 2 === 0;
      const pw = horiz ? step * 2 : step;
      const ph = horiz ? step : step * 2;
      cCtx.fillStyle = tones[idx % tones.length];
      cCtx.fillRect(x + 1, y + 1, pw - 2, ph - 2);

      // Crisp wood-grain streaks
      cCtx.fillStyle = 'rgba(60, 38, 20, 0.09)';
      if (horiz) {
        cCtx.fillRect(x + 2, y + 8 * sc, pw - 4, 2);
        cCtx.fillRect(x + 2, y + 20 * sc, pw - 4, 1);
      } else {
        cCtx.fillRect(x + 8 * sc, y + 2, 2, ph - 4);
        cCtx.fillRect(x + 20 * sc, y + 2, 1, ph - 4);
      }

      // Plank seams in height & roughness
      hCtx.strokeStyle = '#383838';
      hCtx.lineWidth = Math.max(2, Math.round(2 * sc));
      hCtx.strokeRect(x, y, pw, ph);

      rCtx.fillStyle = idx % 2 === 0 ? '#505050' : '#646464';
      rCtx.fillRect(x + 1, y + 1, pw - 2, ph - 2);
      idx++;
    }
  }

  const map = finalizeColorTexture(new THREE.CanvasTexture(colorCanvas), anisotropy, 3, 3);
  const normalMap = heightCanvasToNormalTexture(heightCanvas, 1.5, anisotropy, 3, 3);
  const roughnessMap = finalizeDataTexture(
    new THREE.CanvasTexture(roughCanvas),
    anisotropy,
    3,
    3
  ) as THREE.CanvasTexture;

  return {
    map,
    normalMap,
    roughnessMap,
    dispose: () => {
      map.dispose();
      normalMap.dispose();
      roughnessMap.dispose();
    },
  };
}

/**
 * Generates a crisp 1024x512 bespoke Architectural Feature-Wall Studio Display Texture
 * customized for each of the 6 Service House interiors!
 */
export function createStudioInteriorDisplayTexture(
  serviceIndex: number,
  serviceTitle: string,
  serviceTagline: string,
  anisotropy = 8
): THREE.CanvasTexture {
  const w = 1024;
  const h = 512;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  const themes = [
    { bg1: '#0F172A', bg2: '#1E293B', accent: '#F59E0B', sub: '#38BDF8', label: 'DIGITAL COMMERCE SHOWROOM' },
    { bg1: '#0B1120', bg2: '#172554', accent: '#38BDF8', sub: '#F59E0B', label: 'FULL-STACK WEB ATELIER' },
    { bg1: '#18141E', bg2: '#2C1F33', accent: '#FB923C', sub: '#FDE68A', label: 'BRAND IDENTITY STUDIO' },
    { bg1: '#0D1926', bg2: '#143344', accent: '#34D399', sub: '#FBBF24', label: 'GROWTH & SEO COMMAND' },
    { bg1: '#111322', bg2: '#1F2442', accent: '#818CF8', sub: '#38BDF8', label: 'INTERACTIVE APP LAB' },
    { bg1: '#0A161E', bg2: '#142938', accent: '#2DD4BF', sub: '#F59E0B', label: 'CLOUD & UPTIME SANCTUARY' },
  ];
  const th = themes[serviceIndex % themes.length];

  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, th.bg1);
  bg.addColorStop(1, th.bg2);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Subtle architectural grid lines
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 1;
  for (let gx = 48; gx < w; gx += 48) {
    ctx.beginPath();
    ctx.moveTo(gx, 0);
    ctx.lineTo(gx, h);
    ctx.stroke();
  }
  for (let gy = 48; gy < h; gy += 48) {
    ctx.beginPath();
    ctx.moveTo(0, gy);
    ctx.lineTo(w, gy);
    ctx.stroke();
  }

  // Soft studio spotlight glow behind graphic
  const rad = ctx.createRadialGradient(w * 0.72, h * 0.48, 20, w * 0.72, h * 0.48, 300);
  rad.addColorStop(0, th.accent + '44');
  rad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = rad;
  ctx.fillRect(0, 0, w, h);

  // Left Editorial Title Column
  ctx.fillStyle = th.accent;
  ctx.font = '700 20px "JetBrains Mono", monospace';
  ctx.fillText(`0${serviceIndex + 1} · ${th.label}`, 64, 96);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 48px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(serviceTitle, 64, 168, 520);

  ctx.fillStyle = 'rgba(226,232,240,0.82)';
  ctx.font = '500 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(serviceTagline, 64, 218, 520);

  // Accent underline bar
  ctx.fillStyle = th.accent;
  ctx.fillRect(64, 248, 120, 5);

  // Crisp studio metrics / tags along bottom left
  const pills = ['CUSTOM BUILT', 'UK STUDIO', 'HIGH PERFORMANCE'];
  pills.forEach((p, idx) => {
    const px = 64 + idx * 172;
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fillRect(px, 388, 156, 44);
    ctx.strokeStyle = th.accent + '88';
    ctx.lineWidth = 2;
    ctx.strokeRect(px, 388, 156, 44);
    ctx.fillStyle = '#F8FAFC';
    ctx.font = '700 13px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(p, px + 78, 415);
    ctx.textAlign = 'left';
  });

  // Right-Side Custom Bespoke Visual Artwork per Service
  ctx.save();
  ctx.translate(640, 82);
  ctx.fillStyle = 'rgba(255,255,255,0.05)';
  ctx.fillRect(0, 0, 320, 350);
  ctx.strokeStyle = 'rgba(255,255,255,0.16)';
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, 320, 350);

  if (serviceIndex === 0) {
    // E-Commerce Product Grid Cards
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 2; c++) {
        const cx = 24 + c * 144;
        const cy = 32 + r * 150;
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        ctx.fillRect(cx, cy, 128, 130);
        ctx.fillStyle = (r + c) % 2 === 0 ? th.accent : th.sub;
        ctx.fillRect(cx + 12, cy + 12, 104, 68);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(cx + 12, cy + 92, 74, 8);
        ctx.fillStyle = th.accent;
        ctx.fillRect(cx + 12, cy + 108, 46, 10);
      }
    }
  } else if (serviceIndex === 1) {
    // Clean Code & Component Architecture Lines
    const widths = [180, 240, 140, 210, 120, 250, 190, 160, 220];
    widths.forEach((lw, i) => {
      ctx.fillStyle = i % 3 === 0 ? th.accent : i % 2 === 0 ? th.sub : 'rgba(255,255,255,0.42)';
      ctx.fillRect(28 + (i % 3) * 18, 34 + i * 32, lw, 12);
    });
  } else if (serviceIndex === 2) {
    // Brand Design Swatches & Golden-Ratio Circles
    const swatches = ['#F59E0B', '#FB923C', '#1D6FD8', '#FAF6F0'];
    swatches.forEach((sw, i) => {
      ctx.fillStyle = sw;
      ctx.fillRect(26 + i * 68, 252, 56, 68);
    });
    ctx.strokeStyle = th.accent;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(160, 128, 76, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = th.sub;
    ctx.beginPath();
    ctx.arc(160, 128, 44, 0, Math.PI * 2);
    ctx.stroke();
  } else if (serviceIndex === 3) {
    // Rising Growth Curve & Bar Chart
    const bars = [70, 110, 145, 190, 235, 280];
    bars.forEach((bh, i) => {
      ctx.fillStyle = i === 5 ? th.accent : 'rgba(52,211,153,0.45)';
      ctx.fillRect(28 + i * 45, 310 - bh, 30, bh);
    });
    ctx.strokeStyle = th.sub;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(42, 240);
    ctx.lineTo(132, 165);
    ctx.lineTo(222, 110);
    ctx.lineTo(268, 32);
    ctx.stroke();
  } else if (serviceIndex === 4) {
    // Connected Modular App Nodes
    const nodes: [number, number][] = [
      [160, 72],
      [76, 178],
      [244, 178],
      [160, 284],
    ];
    ctx.strokeStyle = th.sub;
    ctx.lineWidth = 3;
    nodes.forEach(([nx, ny], i) => {
      const [mx, my] = nodes[(i + 1) % nodes.length];
      ctx.beginPath();
      ctx.moveTo(nx, ny);
      ctx.lineTo(mx, my);
      ctx.stroke();
    });
    nodes.forEach(([nx, ny], i) => {
      ctx.fillStyle = i % 2 === 0 ? th.accent : th.sub;
      ctx.beginPath();
      ctx.arc(nx, ny, 28, 0, Math.PI * 2);
      ctx.fill();
    });
  } else {
    // 99.99% Uptime Status Racks
    for (let i = 0; i < 6; i++) {
      ctx.fillStyle = 'rgba(255,255,255,0.09)';
      ctx.fillRect(24, 28 + i * 50, 272, 36);
      ctx.fillStyle = th.accent;
      ctx.fillRect(36, 40 + i * 50, 12, 12);
      ctx.fillStyle = 'rgba(255,255,255,0.65)';
      ctx.fillRect(62, 42 + i * 50, 160 + (i % 3) * 24, 8);
    }
  }
  ctx.restore();

  // Outer sleek frame border
  ctx.strokeStyle = th.accent;
  ctx.lineWidth = 6;
  ctx.strokeRect(3, 3, w - 6, h - 6);

  return finalizeColorTexture(new THREE.CanvasTexture(canvas), anisotropy);
}

/**
 * High-Craft Bookmatched Calacatta Oro Marble PBR Set (1024x1024 in highRes mode)
 * Creamy warm alabaster stone with sweeping smoky-graphite and warm gold mineral veining.
 */
export function createCalacattaMarblePbrSet(
  anisotropy = 8,
  highRes = true
): {
  map: THREE.CanvasTexture;
  normalMap: THREE.DataTexture;
  roughnessMap: THREE.CanvasTexture;
  dispose: () => void;
} {
  const size = highRes ? 1024 : 512;
  const sc = size / 512;
  const cCanvas = document.createElement('canvas');
  cCanvas.width = size;
  cCanvas.height = size;
  const cCtx = cCanvas.getContext('2d')!;

  const hCanvas = document.createElement('canvas');
  hCanvas.width = size;
  hCanvas.height = size;
  const hCtx = hCanvas.getContext('2d')!;

  const rCanvas = document.createElement('canvas');
  rCanvas.width = size;
  rCanvas.height = size;
  const rCtx = rCanvas.getContext('2d')!;

  // Creamy warm alabaster stone field
  const baseGrad = cCtx.createLinearGradient(0, 0, size, size);
  baseGrad.addColorStop(0, '#F7F3EB');
  baseGrad.addColorStop(0.5, '#EFEAE0');
  baseGrad.addColorStop(1, '#F5F0E6');
  cCtx.fillStyle = baseGrad;
  cCtx.fillRect(0, 0, size, size);

  hCtx.fillStyle = '#D8D8D8';
  hCtx.fillRect(0, 0, size, size);
  rCtx.fillStyle = '#323232'; // Glossy honed polish
  rCtx.fillRect(0, 0, size, size);

  let seed = 9241;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  // Soft cloudy mineral undertones
  for (let i = 0; i < 32; i++) {
    const px = rand() * size;
    const py = rand() * size;
    const rad = (40 + rand() * 90) * sc;
    const g = cCtx.createRadialGradient(px, py, 4 * sc, px, py, rad);
    g.addColorStop(0, 'rgba(182, 174, 162, 0.14)');
    g.addColorStop(1, 'rgba(247, 243, 235, 0)');
    cCtx.fillStyle = g;
    cCtx.beginPath();
    cCtx.arc(px, py, rad, 0, Math.PI * 2);
    cCtx.fill();
  }

  // Organic sweeping primary charcoal-slate veins & secondary champagne-gold veins
  const drawVein = (startX: number, startY: number, isGold: boolean, width: number) => {
    let x = startX;
    let y = startY;
    cCtx.strokeStyle = isGold ? 'rgba(196, 152, 82, 0.44)' : 'rgba(96, 98, 108, 0.36)';
    cCtx.lineWidth = width * sc;
    cCtx.lineCap = 'round';
    cCtx.beginPath();
    cCtx.moveTo(x, y);

    hCtx.strokeStyle = '#BDBDBD';
    hCtx.lineWidth = width * sc;
    hCtx.beginPath();
    hCtx.moveTo(x, y);

    rCtx.strokeStyle = '#565656';
    rCtx.lineWidth = width * sc;
    rCtx.beginPath();
    rCtx.moveTo(x, y);

    for (let step = 0; step < 24; step++) {
      x += (20 + (rand() - 0.3) * 22) * sc;
      y += (rand() - 0.45) * 38 * sc;
      cCtx.lineTo(x, y);
      hCtx.lineTo(x, y);
      rCtx.lineTo(x, y);
    }
    cCtx.stroke();
    hCtx.stroke();
    rCtx.stroke();
  };

  for (let v = 0; v < 13; v++) {
    drawVein(-30 * sc, rand() * size, v % 3 === 0, v % 2 === 0 ? 3.0 : 1.35);
  }

  // Bookmatched slab seam joint subtly centered
  cCtx.strokeStyle = 'rgba(140, 132, 120, 0.22)';
  cCtx.lineWidth = Math.max(2, Math.round(2 * sc));
  cCtx.strokeRect(1, 1, size - 2, size - 2);

  const map = finalizeColorTexture(new THREE.CanvasTexture(cCanvas), anisotropy, 1, 1);
  const normalMap = heightCanvasToNormalTexture(hCanvas, 0.65, anisotropy, 1, 1);
  const roughnessMap = finalizeDataTexture(
    new THREE.CanvasTexture(rCanvas),
    anisotropy,
    1,
    1
  ) as THREE.CanvasTexture;

  return {
    map,
    normalMap,
    roughnessMap,
    dispose: () => {
      map.dispose();
      normalMap.dispose();
      roughnessMap.dispose();
    },
  };
}

/**
 * Tailored Silk & Cashmere-Wool Luxury Area Rug Texture (1024x1024 in highRes mode)
 */
export function createLuxuryAreaRugTexture(
  accentCss = '#C89B4B',
  anisotropy = 8,
  highRes = true
): THREE.CanvasTexture {
  const size = highRes ? 1024 : 512;
  const sc = size / 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Warm ivory cashmere base
  ctx.fillStyle = '#EAE2D6';
  ctx.fillRect(0, 0, size, size);

  let seed = 3371;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  // Fine tactile textile boucle-silk weave grain
  const stepY = Math.max(2, Math.round(3 * sc));
  for (let y = 0; y < size; y += stepY) {
    ctx.fillStyle = y % (stepY * 2) === 0 ? 'rgba(120, 108, 92, 0.055)' : 'rgba(255, 252, 246, 0.14)';
    ctx.fillRect(0, y, size, Math.max(1, 1.5 * sc));
  }
  const fleckCount = highRes ? 9000 : 4200;
  for (let i = 0; i < fleckCount; i++) {
    ctx.fillStyle = rand() > 0.5 ? 'rgba(140, 126, 108, 0.065)' : 'rgba(255, 255, 255, 0.085)';
    ctx.fillRect(Math.floor(rand() * size), Math.floor(rand() * size), Math.max(2, Math.round(2 * sc)), Math.max(2, Math.round(2 * sc)));
  }

  // Outer charcoal architectural border + brushed-gold inner Greek-key / geometric hairline trim
  ctx.strokeStyle = '#312E2B';
  ctx.lineWidth = 14 * sc;
  ctx.strokeRect(22 * sc, 22 * sc, size - 44 * sc, size - 44 * sc);

  ctx.strokeStyle = accentCss;
  ctx.lineWidth = 4 * sc;
  ctx.strokeRect(42 * sc, 42 * sc, size - 84 * sc, size - 84 * sc);

  ctx.strokeStyle = 'rgba(72, 65, 58, 0.24)';
  ctx.lineWidth = 2 * sc;
  ctx.strokeRect(56 * sc, 56 * sc, size - 112 * sc, size - 112 * sc);

  // Subtle modernist concentric geometric centerpiece medallion
  ctx.strokeStyle = 'rgba(49, 46, 43, 0.16)';
  ctx.lineWidth = 2 * sc;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, 118 * sc, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = accentCss + '66';
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, 92 * sc, 0, Math.PI * 2);
  ctx.stroke();

  return finalizeColorTexture(new THREE.CanvasTexture(canvas), anisotropy, 1, 1);
}

/**
 * Framed Minimalist Contemporary Gallery Canvas Artwork Texture (1024x1024 in highRes mode)
 */
export function createGalleryArtTexture(
  serviceIndex: number,
  sideIndex: number,
  anisotropy = 8,
  highRes = true
): THREE.CanvasTexture {
  const size = highRes ? 1024 : 512;
  const sc = size / 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Linen gallery passe-partout mat border
  ctx.fillStyle = '#F5F0E6';
  ctx.fillRect(0, 0, size, size);

  // Recessed inner art paper canvas
  const pad = 48 * sc;
  const inner = size - pad * 2;
  ctx.fillStyle = sideIndex === 0 ? '#1C222E' : '#EAE2D3';
  ctx.fillRect(pad, pad, inner, inner);

  const accents = ['#D4A24C', '#38BDF8', '#C86D4A', '#34D399', '#818CF8', '#2DD4BF'];
  const gold = accents[serviceIndex % accents.length];

  if (sideIndex === 0) {
    // Sculptural Gold-Leaf Horizon Sun & Architectural Arch over Obsidian Canvas
    const glow = ctx.createRadialGradient(size / 2, size * 0.44, 14 * sc, size / 2, size * 0.44, 150 * sc);
    glow.addColorStop(0, gold);
    glow.addColorStop(0.55, gold + '55');
    glow.addColorStop(1, 'rgba(28,34,46,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(size / 2, size * 0.44, 148 * sc, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = gold;
    ctx.beginPath();
    ctx.arc(size / 2, size * 0.42, 64 * sc, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#E8DFD1';
    ctx.fillRect(pad + 54 * sc, size * 0.62, inner - 108 * sc, 10 * sc);
    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    ctx.fillRect(pad + 92 * sc, size * 0.68, inner - 184 * sc, 5 * sc);
  } else {
    // Bauhaus Travertine & Terracotta Overlapping Relief Arches
    ctx.fillStyle = '#C26D48';
    ctx.beginPath();
    ctx.arc(size * 0.44, size * 0.54, 104 * sc, Math.PI, 0, false);
    ctx.lineTo(size * 0.44 + 104 * sc, size - pad - 44 * sc);
    ctx.lineTo(size * 0.44 - 104 * sc, size - pad - 44 * sc);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#1E2430';
    ctx.lineWidth = 6 * sc;
    ctx.beginPath();
    ctx.arc(size * 0.58, size * 0.42, 74 * sc, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = gold;
    ctx.beginPath();
    ctx.arc(size * 0.58, size * 0.42, 24 * sc, 0, Math.PI * 2);
    ctx.fill();
  }

  // Subtle shadow edge around passe-partout cutout
  ctx.strokeStyle = 'rgba(20, 20, 20, 0.25)';
  ctx.lineWidth = 3 * sc;
  ctx.strokeRect(pad, pad, inner, inner);

  return finalizeColorTexture(new THREE.CanvasTexture(canvas), anisotropy, 1, 1);
}

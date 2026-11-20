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
 * Generates a linear tangent-space RGB Normal Map from a grayscale height canvas (Sobel filter).
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

  const sample = (x: number, y: number) => {
    const wx = ((x % w) + w) % w;
    const wy = ((y % h) + h) % h;
    return src[(wy * w + wx) * 4] / 255;
  };

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const tl = sample(x - 1, y - 1);
      const t = sample(x, y - 1);
      const tr = sample(x + 1, y - 1);
      const l = sample(x - 1, y);
      const r = sample(x + 1, y);
      const bl = sample(x - 1, y + 1);
      const b = sample(x, y + 1);
      const br = sample(x + 1, y + 1);

      const dX = (tr + 2 * r + br - (tl + 2 * l + bl)) * strength;
      const dY = (bl + 2 * b + br - (tl + 2 * t + tr)) * strength;
      const dZ = 1.0;
      const invLen = 1 / Math.hypot(dX, dY, dZ);

      const idx = (y * w + x) * 4;
      out[idx] = Math.round((-dX * invLen * 0.5 + 0.5) * 255);
      out[idx + 1] = Math.round((dY * invLen * 0.5 + 0.5) * 255);
      out[idx + 2] = Math.round((dZ * invLen * 0.5 + 0.5) * 255);
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
 * Ultra-Realistic Modern Office & Commercial Skyscraper Curtain-Wall PBR Set (Zero Neon):
 * - Daytime: Realistic sky-reflecting tinted architectural glass, anodized aluminum mullions, interior office blinds & ceiling slabs.
 * - Nighttime: Authentic warm-white, halogen & soft daylight illuminated office rooms with venetian blinds and interior depth.
 */
export function createSkyscraperPbrSet(anisotropy = 8): SkyscraperPbrSet {
  const size = 1024;
  const cols = 10;
  const rows = 20;
  const padX = 8;
  const padY = 6;
  const cellW = size / cols;
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

  const mapSize = 512;
  const heightCanvas = document.createElement('canvas');
  heightCanvas.width = mapSize;
  heightCanvas.height = mapSize;
  const hCtx = heightCanvas.getContext('2d')!;

  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = mapSize;
  roughCanvas.height = mapSize;
  const rCtx = roughCanvas.getContext('2d')!;

  // Sleek anodized titanium-silver & dark cobalt structural mullion grid
  dCtx.fillStyle = '#0D1729';
  dCtx.fillRect(0, 0, size, size);

  eCtx.fillStyle = '#000000';
  eCtx.fillRect(0, 0, size, size);

  lCtx.fillStyle = '#CFDCEB';
  lCtx.fillRect(0, 0, size, size);

  hCtx.fillStyle = '#EAEAEA';
  hCtx.fillRect(0, 0, mapSize, mapSize);

  rCtx.fillStyle = '#A6A6A6';
  rCtx.fillRect(0, 0, mapSize, mapSize);

  let seed = 3071;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  // Realistic futuristic modern night interiors: crisp architectural daylight-white, cool glacier-blue & refined warm executive accents
  const realisticNightOfficeLights = [
    ['#E8F4FF', '#9EC7EC'],
    ['#F2F8FF', '#B7D5F2'],
    ['#DFF1FF', '#7EB8EA'],
    ['#FFF8EB', '#E4C998'],
    ['#EAF5FF', '#A7CBEB'],
  ];

  // Photorealistic futuristic modern architectural blue-glass curtain-wall tones (Dubai / Singapore / Canary Wharf blue-sapphire glazing)
  const realisticDayGlass = [
    ['#3A7EC9', '#1E4C88'],
    ['#5499DE', '#285EA0'],
    ['#2A65AD', '#163D72'],
    ['#68ABE8', '#336EB5'],
    ['#4488D1', '#1F518F'],
  ];

  const sc = mapSize / size;

  for (let r = 0; r < rows; r++) {
    const floorOccupancy = rand() > 0.26 ? 0.62 : 0.28;
    const floorTintIdx = Math.floor(rand() * realisticNightOfficeLights.length);
    const isMechanicalFloor = r === 9 || r === 19;
    const isSkyLounge = r === 5 || r === 14;

    for (let c = 0; c < cols; c++) {
      const litRoll = rand();
      const x = Math.round(c * cellW + padX);
      const y = Math.round(r * cellH + padY);
      const w = Math.round(cellW - padX * 2);
      const h = Math.round(cellH - padY * 2);

      const mx = Math.round(x * sc);
      const my = Math.round(y * sc);
      const mw = Math.max(2, Math.round(w * sc));
      const mh = Math.max(2, Math.round(h * sc));

      hCtx.fillStyle = isMechanicalFloor ? '#9E9E9E' : '#242424';
      hCtx.fillRect(mx, my, mw, mh);

      // Mirror-smooth high-gloss sapphire glass panes vs satin brushed-titanium frames
      rCtx.fillStyle = isMechanicalFloor ? '#B8B8B8' : '#080808';
      rCtx.fillRect(mx, my, mw, mh);

      if (isMechanicalFloor) {
        dCtx.fillStyle = '#0D192E';
        dCtx.fillRect(x, y, w, h);
        lCtx.fillStyle = '#8AA7C7';
        lCtx.fillRect(x, y, w, h);
        dCtx.fillStyle = '#060E1D';
        lCtx.fillStyle = '#5E7C9E';
        for (let ly = y + 4; ly < y + h; ly += 6) {
          dCtx.fillRect(x, ly, w, 2);
          lCtx.fillRect(x, ly, w, 2);
        }
        // Refined architectural glacier-blue horizontal spandrel LED line along mechanical/sky-terrace floors at night
        dCtx.fillStyle = '#38BDF8';
        dCtx.fillRect(x, y + Math.round(h * 0.45), w, 3);
        eCtx.fillStyle = '#7DD3FC';
        eCtx.fillRect(x, y + Math.round(h * 0.45), w, 3);
        continue;
      }

      // Dramatic continuous illuminated executive Sky-Lounge / Observation Gallery floor!
      if (isSkyLounge) {
        const slGrad = dCtx.createLinearGradient(x, y, x, y + h);
        slGrad.addColorStop(0, '#FFF5E1');
        slGrad.addColorStop(0.55, '#D7E9FA');
        slGrad.addColorStop(1, '#365882');
        dCtx.fillStyle = slGrad;
        dCtx.fillRect(x, y, w, h);
        eCtx.fillStyle = slGrad;
        eCtx.fillRect(x + 1, y + 1, w - 2, h - 2);
        // Subtle architectural ceiling grid & gallery columns
        dCtx.fillStyle = 'rgba(10, 20, 38, 0.72)';
        dCtx.fillRect(x + Math.round(w * 0.33), y, 3, h);
        dCtx.fillRect(x + Math.round(w * 0.67), y, 3, h);
        eCtx.fillStyle = '#000000';
        eCtx.fillRect(x + Math.round(w * 0.33), y, 3, h);
        eCtx.fillRect(x + Math.round(w * 0.67), y, 3, h);

        // Bright crystal-blue sky-lounge glass in daytime
        const lSl = lCtx.createLinearGradient(x, y, x + w, y + h);
        lSl.addColorStop(0, '#72B4EE');
        lSl.addColorStop(0.5, '#306DB8');
        lSl.addColorStop(1, '#9FD0FA');
        lCtx.fillStyle = lSl;
        lCtx.fillRect(x, y, w, h);
        lCtx.fillStyle = 'rgba(255,255,255,0.34)';
        lCtx.fillRect(x, y + 2, w, 3);
        continue;
      }

      // NIGHT MODE: Realistic modern illuminated executive & tech offices inside deep sapphire glass
      if (litRoll < floorOccupancy * 0.66) {
        const [cTop, cBot] =
          realisticNightOfficeLights[
            (floorTintIdx + (c % 2)) % realisticNightOfficeLights.length
          ];
        const grad = dCtx.createLinearGradient(x, y, x, y + h);
        grad.addColorStop(0, cTop);
        grad.addColorStop(0.56, cBot);
        grad.addColorStop(1, '#26446B');
        dCtx.fillStyle = grad;
        dCtx.fillRect(x, y, w, h);

        eCtx.fillStyle = grad;
        eCtx.fillRect(x + 2, y + 2, w - 4, h - 4);

        // Crisp recessed architectural ceiling linear LED bar
        dCtx.fillStyle = 'rgba(240, 249, 255, 0.92)';
        dCtx.fillRect(x + 6, y + 3, w - 12, 3);
        eCtx.fillStyle = '#F0F9FF';
        eCtx.fillRect(x + 6, y + 3, w - 12, 3);

        // Subtle interior workstation/architecture silhouette along lower third
        if (rand() > 0.32) {
          const deskW = Math.round(w * (0.35 + rand() * 0.4));
          const deskX = x + Math.round(rand() * (w - deskW));
          dCtx.fillStyle = 'rgba(10, 22, 42, 0.5)';
          dCtx.fillRect(deskX, y + Math.round(h * 0.65), deskW, Math.round(h * 0.35));
          eCtx.fillStyle = 'rgba(0, 0, 0, 0.6)';
          eCtx.fillRect(deskX, y + Math.round(h * 0.65), deskW, Math.round(h * 0.35));
        }

        // Modern motorized roller shades on select bays
        if (rand() > 0.46) {
          const blindH = Math.round(h * (0.2 + rand() * 0.3));
          dCtx.fillStyle = 'rgba(11, 21, 39, 0.58)';
          dCtx.fillRect(x, y, w, blindH);
          eCtx.fillStyle = 'rgba(0, 0, 0, 0.68)';
          eCtx.fillRect(x, y, w, blindH);
        }

        // Sleek structural vertical window mullion
        dCtx.fillStyle = 'rgba(8, 16, 30, 0.68)';
        dCtx.fillRect(x + Math.round(w * 0.5) - 1, y, 2, h);
        eCtx.fillStyle = '#000000';
        eCtx.fillRect(x + Math.round(w * 0.5) - 1, y, 2, h);
      } else if (litRoll < floorOccupancy) {
        dCtx.fillStyle = '#1E3354';
        dCtx.fillRect(x, y, w, h);
        eCtx.fillStyle = '#193257';
        eCtx.fillRect(x + 2, y + 2, w - 4, h - 4);
      } else {
        const unlitGrad = dCtx.createLinearGradient(x, y, x + w, y + h);
        unlitGrad.addColorStop(0, '#132645');
        unlitGrad.addColorStop(1, '#091428');
        dCtx.fillStyle = unlitGrad;
        dCtx.fillRect(x, y, w, h);
      }

      // DAY MODE: Photorealistic reflective futuristic sapphire & glacier-azure curtain-wall glass
      const [lTop, lBot] =
        realisticDayGlass[Math.floor(litRoll * realisticDayGlass.length) % realisticDayGlass.length];
      const tiltShift = (rand() - 0.5) * w * 0.48;
      const lGrad = lCtx.createLinearGradient(x + tiltShift, y, x + w * 0.68, y + h);
      lGrad.addColorStop(0, lTop);
      lGrad.addColorStop(0.55, lBot);
      lGrad.addColorStop(1, '#7DB7EA');
      lCtx.fillStyle = lGrad;
      lCtx.fillRect(x, y, w, h);

      // Crisp diagonal sky-cloud reflection sweep across select glazing panes
      if (rand() > 0.42) {
        lCtx.fillStyle = 'rgba(232, 244, 255, 0.28)';
        lCtx.beginPath();
        lCtx.moveTo(x + w * 0.12, y);
        lCtx.lineTo(x + w * 0.52, y);
        lCtx.lineTo(x + w * 0.22, y + h);
        lCtx.lineTo(x, y + h);
        lCtx.closePath();
        lCtx.fill();
      }

      // Subtle visible interior ceiling & floor slab shadow behind daylight sapphire glass
      lCtx.fillStyle = 'rgba(10, 26, 52, 0.24)';
      lCtx.fillRect(x, y + Math.round(h * 0.68), w, Math.round(h * 0.32));

      // Precision structural silicone joint + brushed aluminum mullion highlights
      lCtx.strokeStyle = 'rgba(18, 38, 68, 0.5)';
      lCtx.lineWidth = 2;
      lCtx.strokeRect(x + 1, y + 1, w - 2, h - 2);
      lCtx.fillStyle = 'rgba(236, 246, 255, 0.34)';
      lCtx.fillRect(x + 2, y + 2, w - 4, 2);
      lCtx.fillStyle = 'rgba(54, 78, 108, 0.56)';
      lCtx.fillRect(x + Math.round(w * 0.5) - 1, y, 2, h);
    }
  }

  // Structural architectural steel-and-glass spandrel floor bands
  dCtx.fillStyle = '#0A1324';
  lCtx.fillStyle = '#D9E5F2';
  hCtx.fillStyle = '#FFFFFF';
  for (let r = 0; r < rows; r++) {
    const ry = Math.round(r * cellH);
    dCtx.fillRect(0, ry, size, 6);
    lCtx.fillRect(0, ry, size, 6);
    hCtx.fillRect(0, Math.round(ry * sc), mapSize, 3);
  }

  const darkMap = finalizeColorTexture(new THREE.CanvasTexture(darkCanvas), anisotropy, 1, 2);
  const darkEmissiveMap = finalizeColorTexture(
    new THREE.CanvasTexture(emissiveCanvas),
    anisotropy,
    1,
    2
  );
  const lightMap = finalizeColorTexture(new THREE.CanvasTexture(lightCanvas), anisotropy, 1, 2);
  const normalMap = heightCanvasToNormalTexture(heightCanvas, 2.2, anisotropy, 1, 2);
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
export function createNaturalGrassPbrSet(anisotropy = 8, repeatX = 14, repeatY = 14): SurfacePbrSet {
  const size = 512;

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
  for (let i = 0; i < 65; i++) {
    const px = rand() * size;
    const py = rand() * size;
    const rad = 24 + rand() * 58;
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
  for (let i = 0; i < 6500; i++) {
    const gx = Math.floor(rand() * size);
    const gy = Math.floor(rand() * size);
    const len = 3 + Math.floor(rand() * 7);
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
export function createWoodGrainPbrSet(anisotropy = 8): {
  map: THREE.CanvasTexture;
  normalMap: THREE.DataTexture;
  roughnessMap: THREE.CanvasTexture;
  dispose: () => void;
} {
  const size = 512;
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

  // Horizontal planks with wood grain fibers
  const planks = 8;
  const plankH = size / planks;
  for (let p = 0; p < planks; p++) {
    const py = Math.round(p * plankH);
    const shade = Math.round((rand() - 0.5) * 26);
    cCtx.fillStyle = `rgb(${202 + shade},${166 + Math.round(shade * 0.8)},${126 + Math.round(shade * 0.6)})`;
    cCtx.fillRect(0, py, size, plankH - 2);

    // Fine organic grain streaks
    for (let g = 0; g < 36; g++) {
      const gy = py + 2 + rand() * (plankH - 6);
      const alpha = 0.06 + rand() * 0.14;
      cCtx.fillStyle = rand() > 0.5 ? `rgba(72,42,18,${alpha})` : `rgba(245,228,200,${alpha * 0.6})`;
      cCtx.fillRect(0, gy, size, 1 + Math.floor(rand() * 2));

      const hv = Math.round(170 + (rand() - 0.5) * 55);
      hCtx.fillStyle = `rgb(${hv},${hv},${hv})`;
      hCtx.fillRect(0, gy, size, 2);
    }

    // Recessed plank seam
    cCtx.fillStyle = 'rgba(42, 26, 14, 0.58)';
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
export function createPlazaStonePbrSet(anisotropy = 8): SurfacePbrSet {
  const size = 1024;
  const mapSize = 512;

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

  dCtx.fillStyle = '#1B1F26';
  dCtx.fillRect(0, 0, size, size);
  lCtx.fillStyle = '#C4BEB2';
  lCtx.fillRect(0, 0, size, size);
  hCtx.fillStyle = '#282828';
  hCtx.fillRect(0, 0, mapSize, mapSize);
  rCtx.fillStyle = '#DCDCDC';
  rCtx.fillRect(0, 0, mapSize, mapSize);

  const cols = 8;
  const rows = 8;
  const cellW = size / cols;
  const cellH = size / rows;
  const gap = 4;
  const sc = mapSize / size;

  let seed = 7711;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let r = 0; r < rows; r++) {
    const rowOffset = r % 2 === 1 ? cellW * 0.5 : 0;
    for (let c = -1; c <= cols; c++) {
      const x = Math.round(c * cellW + rowOffset + gap);
      const y = Math.round(r * cellH + gap);
      const w = Math.round(cellW - gap * 2);
      const h = Math.round(cellH - gap * 2);

      const tone = (rand() - 0.5) * 18;
      const dR = Math.round(50 + tone * 0.5);
      const dG = Math.round(54 + tone * 0.5);
      const dB = Math.round(62 + tone * 0.55);
      dCtx.fillStyle = `rgb(${dR},${dG},${dB})`;
      dCtx.fillRect(x, y, w, h);

      const lR = Math.round(222 + tone * 0.45);
      const lG = Math.round(216 + tone * 0.45);
      const lB = Math.round(205 + tone * 0.4);
      lCtx.fillStyle = `rgb(${lR},${lG},${lB})`;
      lCtx.fillRect(x, y, w, h);

      // Natural stone mineral fleck texture
      for (let f = 0; f < 22; f++) {
        const fx = x + Math.floor(rand() * w);
        const fy = y + Math.floor(rand() * h);
        lCtx.fillStyle = rand() > 0.5 ? 'rgba(255,255,255,0.16)' : 'rgba(120,112,100,0.14)';
        lCtx.fillRect(fx, fy, 3, 2);
        dCtx.fillStyle = rand() > 0.5 ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.12)';
        dCtx.fillRect(fx, fy, 3, 2);
      }

      const hVal = Math.round(212 + tone * 0.8);
      hCtx.fillStyle = `rgb(${hVal},${hVal},${hVal})`;
      hCtx.fillRect(Math.round(x * sc), Math.round(y * sc), Math.round(w * sc), Math.round(h * sc));

      const rVal = Math.round(158 + rand() * 48);
      rCtx.fillStyle = `rgb(${rVal},${rVal},${rVal})`;
      rCtx.fillRect(Math.round(x * sc), Math.round(y * sc), Math.round(w * sc), Math.round(h * sc));
    }
  }

  const darkMap = finalizeColorTexture(new THREE.CanvasTexture(darkCanvas), anisotropy, 8, 8);
  const lightMap = finalizeColorTexture(new THREE.CanvasTexture(lightCanvas), anisotropy, 8, 8);
  const normalMap = heightCanvasToNormalTexture(heightCanvas, 1.65, anisotropy, 8, 8);
  const roughnessMap = finalizeDataTexture(
    new THREE.CanvasTexture(roughCanvas),
    anisotropy,
    8,
    8
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
export function createBoulevardRoadPbrSet(anisotropy = 8): {
  darkMap: THREE.CanvasTexture;
  lightMap: THREE.CanvasTexture;
  normalMap: THREE.DataTexture;
  darkRoughnessMap: THREE.CanvasTexture;
  lightRoughnessMap: THREE.CanvasTexture;
  dispose: () => void;
} {
  const size = 1024;
  const rSize = 512;

  const drawRoad = (isDark: boolean) => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = isDark ? '#1D2129' : '#464A52';
    ctx.fillRect(0, 0, size, size);

    // Subtle real-world dual tire-track polish along both lanes
    ctx.fillStyle = isDark ? 'rgba(9, 11, 15, 0.34)' : 'rgba(34, 38, 44, 0.18)';
    ctx.fillRect(188, 0, 190, size);
    ctx.fillRect(size - 378, 0, 190, size);

    // Rich crushed-stone tarmac aggregate grain
    let seed = isDark ? 42 : 84;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    for (let i = 0; i < 9500; i++) {
      const gx = Math.floor(rand() * size);
      const gy = Math.floor(rand() * size);
      const lightSpeck = rand() > 0.5;
      ctx.fillStyle = isDark
        ? lightSpeck
          ? 'rgba(255,255,255,0.035)'
          : 'rgba(0,0,0,0.09)'
        : lightSpeck
          ? 'rgba(255,255,255,0.065)'
          : 'rgba(20,22,26,0.075)';
      ctx.fillRect(gx, gy, 2, 2);
    }

    // Real concrete street curbs & rainwater drainage gutter joints
    ctx.fillStyle = isDark ? '#383E49' : '#D5D7DA';
    ctx.fillRect(0, 0, 34, size);
    ctx.fillRect(size - 34, 0, 34, size);
    ctx.fillStyle = isDark ? '#12151B' : '#353940';
    ctx.fillRect(34, 0, 8, size);
    ctx.fillRect(size - 42, 0, 8, size);

    // Concrete curb expansion joints every 128px
    ctx.fillStyle = isDark ? 'rgba(10,12,16,0.65)' : 'rgba(90,94,102,0.45)';
    for (let y = 0; y < size; y += 128) {
      ctx.fillRect(0, y, 34, 3);
      ctx.fillRect(size - 34, y, 34, 3);
    }

    // Crisp realistic painted road shoulder lines
    ctx.fillStyle = isDark ? 'rgba(226, 232, 240, 0.56)' : 'rgba(248, 250, 252, 0.86)';
    ctx.fillRect(68, 0, 10, size);
    ctx.fillRect(size - 78, 0, 10, size);

    // Crisp realistic modern center dashed lane markings (cool reflective silver-white)
    ctx.fillStyle = isDark ? 'rgba(203, 224, 248, 0.86)' : '#F8FAFC';
    for (let y = 26; y < size; y += 160) {
      ctx.fillRect(size / 2 - 11, y, 8, 84);
      ctx.fillRect(size / 2 + 3, y, 8, 84);
    }

    return finalizeColorTexture(new THREE.CanvasTexture(canvas), anisotropy, 1, 14);
  };

  // Micro-granular asphalt normal map so streetlamps & headlights glint realistically off the tarmac
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
  for (let i = 0; i < 14000; i++) {
    const v = Math.round(92 + nRand() * 72);
    hCtx.fillStyle = `rgb(${v},${v},${v})`;
    hCtx.fillRect(Math.floor(nRand() * rSize), Math.floor(nRand() * rSize), 2, 2);
  }
  // Raised concrete curbs on edges
  hCtx.fillStyle = '#F0F0F0';
  hCtx.fillRect(0, 0, 17, rSize);
  hCtx.fillRect(rSize - 17, 0, 17, rSize);
  const normalMap = heightCanvasToNormalTexture(hCanvas, 0.85, anisotropy, 1, 14);

  const drawRoughness = (isDark: boolean) => {
    const canvas = document.createElement('canvas');
    canvas.width = rSize;
    canvas.height = rSize;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = isDark ? '#969696' : '#DCDCDC';
    ctx.fillRect(0, 0, rSize, rSize);

    if (isDark) {
      // Realistic damp evening asphalt specular sheen along vehicle tire tracks
      const gradL = ctx.createLinearGradient(80, 0, 210, 0);
      gradL.addColorStop(0, '#969696');
      gradL.addColorStop(0.5, '#4A4A4A');
      gradL.addColorStop(1, '#969696');
      ctx.fillStyle = gradL;
      ctx.fillRect(80, 0, 130, rSize);

      const gradR = ctx.createLinearGradient(302, 0, 432, 0);
      gradR.addColorStop(0, '#969696');
      gradR.addColorStop(0.5, '#4A4A4A');
      gradR.addColorStop(1, '#969696');
      ctx.fillStyle = gradR;
      ctx.fillRect(302, 0, 130, rSize);
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
export function createArchitecturalCladdingPbr(anisotropy = 8): {
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

  cCtx.fillStyle = '#ECEAE5';
  cCtx.fillRect(0, 0, size, size);
  hCtx.fillStyle = '#D6D6D6';
  hCtx.fillRect(0, 0, size, size);
  rCtx.fillStyle = '#B8B8B8';
  rCtx.fillRect(0, 0, size, size);

  let seed = 2917;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  for (let i = 0; i < 14000; i++) {
    const gx = Math.floor(rand() * size);
    const gy = Math.floor(rand() * size);
    const v = Math.round(226 + (rand() - 0.5) * 28);
    cCtx.fillStyle = `rgb(${v},${v},${v})`;
    cCtx.fillRect(gx, gy, 2, 2);

    const hv = Math.round(212 + (rand() - 0.5) * 24);
    hCtx.fillStyle = `rgb(${hv},${hv},${hv})`;
    hCtx.fillRect(gx, gy, 2, 2);
  }

  const panelRows = 4;
  const rowH = size / panelRows;
  for (let r = 0; r < panelRows; r++) {
    const y = Math.round(r * rowH);
    const offset = r % 2 === 0 ? 0 : 256;
    for (let x = offset - 256; x < size; x += 512) {
      const shade = Math.round((rand() - 0.5) * 14);
      cCtx.fillStyle = shade > 0 ? `rgba(255,255,255,${shade / 260})` : `rgba(80,74,64,${-shade / 260})`;
      cCtx.fillRect(x, y, 512, rowH);
    }
    // Recessed ashlar shadow groove
    cCtx.fillStyle = 'rgba(116,110,102,0.42)';
    cCtx.fillRect(0, y, size, 4);
    hCtx.fillStyle = '#525252';
    hCtx.fillRect(0, y, size, 4);
    rCtx.fillStyle = '#DEDEDE';
    rCtx.fillRect(0, y, size, 4);

    for (let x = offset; x < size; x += 512) {
      cCtx.fillRect(x, y, 4, rowH);
      hCtx.fillRect(x, y, 4, rowH);
      rCtx.fillRect(x, y, 4, rowH);
    }
  }

  const map = finalizeColorTexture(new THREE.CanvasTexture(cCanvas), anisotropy, 2, 2);
  const normalMap = heightCanvasToNormalTexture(hCanvas, 1.4, anisotropy, 2, 2);
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
export function createResidentialWindowTextures(anisotropy = 8): {
  dayMap: THREE.CanvasTexture;
  nightMap: THREE.CanvasTexture;
  nightEmissiveMap: THREE.CanvasTexture;
  dispose: () => void;
} {
  const size = 512;

  // Daytime realistic low-iron architectural sapphire glass with sky reflection & subtle interior shadow depth
  const dCanvas = document.createElement('canvas');
  dCanvas.width = size;
  dCanvas.height = size;
  const dCtx = dCanvas.getContext('2d')!;
  const dayGrad = dCtx.createLinearGradient(0, 0, size * 0.35, size);
  dayGrad.addColorStop(0, '#7AB6EA');
  dayGrad.addColorStop(0.38, '#3B78BA');
  dayGrad.addColorStop(0.74, '#1F4778');
  dayGrad.addColorStop(1, '#122947');
  dCtx.fillStyle = dayGrad;
  dCtx.fillRect(0, 0, size, size);

  // Subtle architectural ceiling slab & recessed interior gallery visible behind glass
  dCtx.fillStyle = 'rgba(225, 240, 255, 0.14)';
  dCtx.fillRect(0, 0, size, 48);
  dCtx.fillStyle = 'rgba(10, 22, 42, 0.28)';
  dCtx.fillRect(0, size * 0.72, size, size * 0.28);

  // Crisp sunlit cloud reflection across upper pane
  const cloudRef = dCtx.createRadialGradient(size * 0.68, size * 0.22, 16, size * 0.64, size * 0.22, 190);
  cloudRef.addColorStop(0, 'rgba(248, 252, 255, 0.44)');
  cloudRef.addColorStop(0.6, 'rgba(216, 238, 255, 0.18)');
  cloudRef.addColorStop(1, 'rgba(255, 255, 255, 0)');
  dCtx.fillStyle = cloudRef;
  dCtx.fillRect(0, 0, size, size);

  // Ultra-clean diagonal glass reflection sweep
  dCtx.fillStyle = 'rgba(240, 249, 255, 0.28)';
  dCtx.beginPath();
  dCtx.moveTo(56, 0);
  dCtx.lineTo(188, 0);
  dCtx.lineTo(74, size);
  dCtx.lineTo(0, size);
  dCtx.closePath();
  dCtx.fill();

  // Secondary narrow specular highlight streak
  dCtx.fillStyle = 'rgba(255, 255, 255, 0.18)';
  dCtx.beginPath();
  dCtx.moveTo(222, 0);
  dCtx.lineTo(256, 0);
  dCtx.lineTo(142, size);
  dCtx.lineTo(108, size);
  dCtx.closePath();
  dCtx.fill();

  // Subtle modern sheer architectural side panels
  dCtx.fillStyle = 'rgba(232, 242, 252, 0.16)';
  dCtx.fillRect(0, 0, 38, size);
  dCtx.fillRect(size - 38, 0, 38, size);

  // Nighttime Architectural Digest luxury interior: crisp warm-white architectural ceiling coves + sleek dark minimalist furniture
  const nCanvas = document.createElement('canvas');
  nCanvas.width = size;
  nCanvas.height = size;
  const nCtx = nCanvas.getContext('2d')!;
  const nightGrad = nCtx.createLinearGradient(0, 0, 0, size);
  nightGrad.addColorStop(0, '#FFFDF7');
  nightGrad.addColorStop(0.22, '#F7E7CE');
  nightGrad.addColorStop(0.62, '#C8A986');
  nightGrad.addColorStop(0.86, '#5A4A3E');
  nightGrad.addColorStop(1, '#262933');
  nCtx.fillStyle = nightGrad;
  nCtx.fillRect(0, 0, size, size);

  // Warm recessed architectural ceiling linear LED light trough
  nCtx.fillStyle = '#FFFFFF';
  nCtx.fillRect(42, 24, size - 84, 14);
  const coveGlow = nCtx.createLinearGradient(0, 24, 0, 180);
  coveGlow.addColorStop(0, 'rgba(255, 252, 244, 0.92)');
  coveGlow.addColorStop(0.45, 'rgba(255, 236, 204, 0.36)');
  coveGlow.addColorStop(1, 'rgba(255, 236, 204, 0)');
  nCtx.fillStyle = coveGlow;
  nCtx.fillRect(0, 24, size, 156);

  // Architectural interior feature wall / minimalist gallery panel & illuminated vertical art niche
  nCtx.fillStyle = 'rgba(34, 42, 58, 0.32)';
  nCtx.fillRect(148, 128, 216, 174);
  nCtx.strokeStyle = 'rgba(255, 244, 224, 0.55)';
  nCtx.lineWidth = 4;
  nCtx.strokeRect(158, 138, 196, 154);

  // Sleek low-profile contemporary lounge sofa & coffee table silhouette
  nCtx.fillStyle = 'rgba(20, 26, 38, 0.68)';
  nCtx.fillRect(96, 368, 320, 82);
  nCtx.fillStyle = 'rgba(14, 18, 28, 0.82)';
  nCtx.fillRect(72, 434, 368, 78);

  // Subtle recessed interior track downlight spots
  [124, 256, 388].forEach((lx) => {
    const spot = nCtx.createRadialGradient(lx, 56, 4, lx, 90, 96);
    spot.addColorStop(0, 'rgba(255, 254, 250, 0.88)');
    spot.addColorStop(0.4, 'rgba(255, 242, 214, 0.32)');
    spot.addColorStop(1, 'rgba(255, 242, 214, 0)');
    nCtx.fillStyle = spot;
    nCtx.fillRect(lx - 96, 0, 192, 210);
  });

  // Subtle dark slate architectural mullions along edges
  nCtx.fillStyle = 'rgba(12, 18, 30, 0.72)';
  nCtx.fillRect(0, 0, 18, size);
  nCtx.fillRect(size - 18, 0, 18, size);

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
    grad.addColorStop(0.28, '#08132B');
    grad.addColorStop(0.45, '#122548');
    grad.addColorStop(0.51, '#1E3863');
    grad.addColorStop(0.56, '#0E1930');
    grad.addColorStop(1.0, '#060A15');
  } else {
    // Crisp high-altitude modern azure sky (powers radiant sapphire-glass reflections in equirectangular IBL)
    grad.addColorStop(0.0, '#1D58A8');
    grad.addColorStop(0.2, '#4E8ED6');
    grad.addColorStop(0.38, '#95C2EB');
    grad.addColorStop(0.49, '#D4E6F7');
    grad.addColorStop(0.53, '#E5EFFA');
    grad.addColorStop(0.65, '#B7CADC');
    grad.addColorStop(1.0, '#6F8078');
  }

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  let seed = isDarkMode ? 8819 : 5521;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  if (isDarkMode) {
    // Crisp realistic stars
    const starColors = ['#FFFFFF', '#F8FAFC', '#DBEAFE', '#BAE6FD'];
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

    // Cool sapphire-silver futuristic metropolis horizon bounce (powers sleek night reflections on blue glass)
    const glowGrad = ctx.createRadialGradient(w * 0.5, h * 0.52, 40, w * 0.5, h * 0.52, w * 0.52);
    glowGrad.addColorStop(0, 'rgba(56, 189, 248, 0.22)');
    glowGrad.addColorStop(0.55, 'rgba(59, 130, 246, 0.11)');
    glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, h * 0.25, w, h * 0.42);

    // Realistic full moon with soft atmospheric corona
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
    // Crisp sunlit atmospheric solar halo (powers strong bright sun glints in equirectangular IBL!)
    const sx = w * 0.68;
    const sy = h * 0.21;
    const sunHalo = ctx.createRadialGradient(sx, sy, 14, sx, sy, 280);
    sunHalo.addColorStop(0, 'rgba(255, 253, 242, 0.98)');
    sunHalo.addColorStop(0.18, 'rgba(255, 246, 212, 0.58)');
    sunHalo.addColorStop(0.5, 'rgba(224, 242, 254, 0.2)');
    sunHalo.addColorStop(1, 'rgba(224, 242, 254, 0)');
    ctx.fillStyle = sunHalo;
    ctx.beginPath();
    ctx.arc(sx, sy, 280, 0, Math.PI * 2);
    ctx.fill();

    // Multi-layered realistic cumulus clouds with warm sunlit tops and soft blue-gray undersides
    for (let i = 0; i < 34; i++) {
      const cx = rand() * w;
      const cy = h * (0.2 + rand() * 0.23);
      const cw = 90 + rand() * 230;
      const ch = 15 + rand() * 36;

      const cGrad = ctx.createLinearGradient(cx, cy - ch, cx, cy + ch);
      cGrad.addColorStop(0, 'rgba(255, 255, 255, 0.94)');
      cGrad.addColorStop(0.58, 'rgba(241, 246, 252, 0.7)');
      cGrad.addColorStop(0.85, 'rgba(195, 212, 232, 0.32)');
      cGrad.addColorStop(1, 'rgba(185, 206, 228, 0.0)');
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
 * Crisp modern architectural cool-white / glacier-blue LED streetlamp ground light pool texture for Night Mode
 */
export function createLightPoolTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(128, 128, 6, 128, 128, 124);
  grad.addColorStop(0, 'rgba(214, 238, 255, 0.44)');
  grad.addColorStop(0.45, 'rgba(125, 200, 252, 0.16)');
  grad.addColorStop(1, 'rgba(56, 189, 248, 0.0)');
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
 * Sleek Futuristic Architectural Sapphire & Brushed-Slate Nameplate Plaque mounted on each Service House
 */
export function createHousePlaqueTexture(
  num: string,
  title: string,
  categoryTag: string,
  accentCss = '#1D4ED8',
  anisotropy = 8,
  isDarkMode = true
): THREE.CanvasTexture {
  const w = 1024;
  const h = 340;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = isDarkMode ? '#0C1222' : '#FFFFFF';
  ctx.fillRect(0, 0, w, h);

  // Architectural double sapphire/slate border
  ctx.strokeStyle = isDarkMode ? '#38BDF8' : '#1D4ED8';
  ctx.lineWidth = 8;
  ctx.strokeRect(12, 12, w - 24, h - 24);

  ctx.strokeStyle = isDarkMode ? 'rgba(56,189,248,0.28)' : 'rgba(29,78,216,0.18)';
  ctx.lineWidth = 2;
  ctx.strokeRect(26, 26, w - 52, h - 52);

  // House Number & Category Header
  ctx.fillStyle = isDarkMode ? '#2563EB' : accentCss;
  ctx.fillRect(48, 52, 92, 44);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 26px "JetBrains Mono", monospace';
  ctx.textBaseline = 'middle';
  ctx.fillText(`0${num.replace(/^0+/, '')}`.slice(-2), 75, 74);

  ctx.fillStyle = isDarkMode ? '#94A3B8' : '#475569';
  ctx.font = '700 21px "Plus Jakarta Sans", sans-serif';
  const shortCat = categoryTag.split('·')[0]?.trim() || 'Service Studio';
  ctx.fillText(shortCat.toUpperCase(), 162, 74);

  // Hairline rule
  ctx.fillStyle = isDarkMode ? 'rgba(56,189,248,0.22)' : 'rgba(15,23,42,0.12)';
  ctx.fillRect(48, 114, w - 96, 2);

  // Crisp Service Title
  ctx.fillStyle = isDarkMode ? '#F1F5F9' : '#0F172A';
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
    ctx.fillStyle = isDarkMode ? '#7DD3FC' : '#1D4ED8';
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
export function createBotanicalLeafClusterTexture(anisotropy = 8): THREE.CanvasTexture {
  const size = 512;
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
    ctx.lineWidth = lw;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.quadraticCurveTo((x0 + x1) * 0.5 + (rand() - 0.5) * 24, (y0 + y1) * 0.5, x1, y1);
    ctx.stroke();
  });

  // Helper to paint an individual botanical leaf with midrib vein & natural depth shading
  const drawLeaf = (cx: number, cy: number, rx: number, ry: number, ang: number, light: number) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(ang);

    // Base natural muted British oak/beech leaf colors (white-biased for clean instanceColor tinting)
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

    // Subtle dark edge definition + central botanical midrib vein
    ctx.strokeStyle = 'rgba(28, 38, 22, 0.34)';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.strokeStyle = 'rgba(220, 232, 195, 0.32)';
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.moveTo(0, -ry * 0.78);
    ctx.lineTo(0, ry * 0.82);
    ctx.stroke();

    ctx.restore();
  };

  // Paint 195 organically layered leaves (deeper shaded inner leaves first, sunlit outer tips last)
  for (let layer = 0; layer < 2; layer++) {
    const count = layer === 0 ? 105 : 95;
    for (let i = 0; i < count; i++) {
      const a = rand() * Math.PI * 2;
      const dist = Math.pow(rand(), layer === 0 ? 0.65 : 0.48) * (layer === 0 ? 168 : 196);
      const lx = 256 + Math.cos(a) * dist * 1.06;
      const ly = 248 + Math.sin(a) * dist * 0.96;
      if (lx < 28 || lx > size - 28 || ly < 24 || ly > size - 36) continue;

      const rx = 12 + rand() * 14;
      const ry = 22 + rand() * 20;
      const rot = Math.atan2(ly - 300, lx - 256) + Math.PI * 0.5 + (rand() - 0.5) * 1.15;
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



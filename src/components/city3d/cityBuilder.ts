import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { QualityProfile } from './types.ts';
import {
  createSkyscraperPbrSet,
  createLimestoneTowerPbrSet,
  createPlazaStonePbrSet,
  createBoulevardRoadPbrSet,
  createArchitecturalCladdingPbr,
  createNaturalGrassPbrSet,
  createWoodGrainPbrSet,
  createResidentialWindowTextures,
  createContactShadowTexture,
  createLightPoolTexture,
  createBotanicalLeafClusterTexture,
  applyGroundAO,
} from './proceduralTextures.ts';

export interface CityBuildResult {
  group: THREE.Group;
  updateCity: (elapsedSeconds: number, dt: number) => void;
  applyTheme: (isDark: boolean) => void;
  dispose: () => void;
}

// Reusable module-scoped scratch helpers (Zero GC inside render loop)
const _vDummy = new THREE.Object3D();
const _tempColor = new THREE.Color();

/**
 * Sculpts a classic Neo-Deco multi-tiered stepped limestone/stone tower with setback crown & fluted corners.
 */
function createArtDecoSteppedTowerGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  const base = new THREE.BoxGeometry(1.0, 0.56, 1.0);
  base.translate(0, 0.28, 0);
  const mid = new THREE.BoxGeometry(0.8, 0.26, 0.8);
  mid.translate(0, 0.69, 0);
  const crown = new THREE.BoxGeometry(0.56, 0.16, 0.56);
  crown.translate(0, 0.9, 0);
  const pinnacle = new THREE.BoxGeometry(0.32, 0.1, 0.32);
  pinnacle.translate(0, 1.03, 0);
  parts.push(base, mid, crown, pinnacle);
  const merged = mergeGeometries(parts, false);
  parts.forEach((p) => p.dispose());
  merged.computeVertexNormals();
  return merged;
}

/**
 * Sculpts a sleek curved elliptical glass landmark drum with projecting horizontal aluminum louver rings.
 */
function createCurvedDrumTowerGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  const mainDrum = new THREE.CylinderGeometry(0.46, 0.52, 0.92, 24);
  mainDrum.scale(1.12, 1, 0.84);
  mainDrum.translate(0, 0.46, 0);
  const upperDrum = new THREE.CylinderGeometry(0.36, 0.44, 0.14, 24);
  upperDrum.scale(1.12, 1, 0.84);
  upperDrum.translate(0, 0.98, 0);
  parts.push(mainDrum, upperDrum);
  // Crisp projecting horizontal architectural brise-soleil shadow bands
  for (let i = 1; i <= 5; i++) {
    const t = i / 6;
    const rad = 0.53 - t * 0.055;
    const fin = new THREE.CylinderGeometry(rad, rad, 0.018, 24);
    fin.scale(1.14, 1, 0.86);
    fin.translate(0, t * 0.92, 0);
    parts.push(fin);
  }
  const merged = mergeGeometries(parts, false);
  parts.forEach((p) => p.dispose());
  merged.computeVertexNormals();
  return merged;
}

/**
 * Sculpts a bold terraced contemporary skyscraper with cantilevered sky-garden setbacks & corner fins.
 */
function createTerracedSkyGardenTowerGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  const tier1 = new THREE.BoxGeometry(1.04, 0.36, 0.96);
  tier1.translate(0, 0.18, 0);
  const tier2 = new THREE.BoxGeometry(0.86, 0.32, 0.88);
  tier2.translate(-0.08, 0.52, 0.04);
  const tier3 = new THREE.BoxGeometry(0.68, 0.28, 0.72);
  tier3.translate(0.06, 0.82, -0.05);
  const overhang1 = new THREE.BoxGeometry(1.12, 0.025, 1.04);
  overhang1.translate(0, 0.365, 0);
  const overhang2 = new THREE.BoxGeometry(0.94, 0.025, 0.96);
  overhang2.translate(-0.08, 0.685, 0.04);
  parts.push(tier1, tier2, tier3, overhang1, overhang2);
  const merged = mergeGeometries(parts, false);
  parts.forEach((p) => p.dispose());
  merged.computeVertexNormals();
  return merged;
}

/**
 * Sculpts a modern diagonal-crown chamfered glass landmark skyscraper (e.g., Leadenhall / Marina Bay).
 */
function createDiagonalCrownTowerGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(-0.5, 0);
  shape.lineTo(0.5, 0);
  shape.lineTo(0.46, 0.82);
  shape.lineTo(-0.38, 1.08);
  shape.lineTo(-0.5, 0.96);
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 1.0,
    bevelEnabled: false,
  });
  geo.translate(0, 0, -0.5);
  geo.computeVertexNormals();
  return geo;
}

/**
 * Sculpts an iconic futuristic parametrically twisting sapphire-glass supertall landmark
 * (14 gently rotating & tapering architectural floorplates merged into one instanced geometry!).
 */
function createTwistedSupertallGeometry(): THREE.BufferGeometry {
  const segments = 14;
  const segH = 1.0 / segments;
  const parts: THREE.BufferGeometry[] = [];
  for (let i = 0; i < segments; i++) {
    const t = i / (segments - 1);
    const scaleXZ = 1.0 - t * 0.28;
    const yaw = t * (Math.PI * 0.42);
    const box = new THREE.BoxGeometry(scaleXZ, segH * 1.02, scaleXZ * 0.88);
    box.rotateY(yaw);
    box.translate(0, (i + 0.5) * segH, 0);
    parts.push(box);
  }
  const merged = mergeGeometries(parts, false);
  parts.forEach((p) => p.dispose());
  merged.computeVertexNormals();
  return merged;
}

/**
 * Sculpts a crystalline faceted octagonal-tapered futuristic spire tower (Shard / futuristic arcology silhouette).
 */
function createFacetedCrystalTowerGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  const lower = new THREE.CylinderGeometry(0.45, 0.56, 0.52, 8);
  lower.translate(0, 0.26, 0);
  const mid = new THREE.CylinderGeometry(0.32, 0.45, 0.32, 8);
  mid.translate(0, 0.68, 0);
  const crown = new THREE.CylinderGeometry(0.1, 0.32, 0.22, 8);
  crown.translate(0, 0.95, 0);
  parts.push(lower, mid, crown);
  const merged = mergeGeometries(parts, false);
  parts.forEach((p) => p.dispose());
  merged.computeVertexNormals();
  return merged;
}

/**
 * Creates a crisp cantilevered contemporary flat-roof overhang for riverside architectural pavilions.
 */
function createModernPavilionRoofGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  const mainSlab = new THREE.BoxGeometry(7.6, 0.34, 6.9);
  mainSlab.translate(0, 4.92, 0.25);
  const upperDeck = new THREE.BoxGeometry(4.4, 1.35, 4.1);
  upperDeck.translate(-0.8, 5.75, -0.55);
  const topCanopy = new THREE.BoxGeometry(5.1, 0.22, 4.8);
  topCanopy.translate(-0.8, 6.52, -0.45);
  parts.push(mainSlab, upperDeck, topCanopy);
  const merged = mergeGeometries(parts, false);
  parts.forEach((p) => p.dispose());
  merged.computeVertexNormals();
  return merged;
}

/**
 * Builds a single merged natural oak/beech bark trunk + 3 structural upper branches.
 */
function createTreeSkeletonGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  const mainTrunk = new THREE.CylinderGeometry(0.13, 0.27, 3.15, 9);
  mainTrunk.translate(0, 1.575, 0);
  parts.push(mainTrunk);

  const limbConfigs: [number, number, number, number, number, number][] = [
    [0.44, 3.05, 0.14, 0.12, 0.56, 0.25],
    [-0.46, 2.95, -0.18, -0.18, -0.58, 2.1],
    [0.08, 3.22, -0.42, 0.52, -0.12, 4.2],
  ];
  for (const [lx, ly, lz, rx, rz, ry] of limbConfigs) {
    const limb = new THREE.CylinderGeometry(0.055, 0.115, 1.75, 7);
    limb.rotateX(rx);
    limb.rotateZ(rz);
    limb.rotateY(ry);
    limb.translate(lx, ly, lz);
    parts.push(limb);
  }
  const merged = mergeGeometries(parts, false);
  parts.forEach((p) => p.dispose());
  merged.computeVertexNormals();
  return merged;
}

/**
 * Builds a photorealistic multi-plane alpha-cutout botanical leaf crown (11 organically tilted leaf-cluster cards)
 * with outward-biased spherical normals so sunlight wraps naturally across the whole crown like a real oak tree!
 */
function createBotanicalCrownGeometry(): THREE.BufferGeometry {
  const cards: THREE.BufferGeometry[] = [];
  // [x, y, z, size, rotX, rotY, rotZ]
  const cardSpecs: [number, number, number, number, number, number, number][] = [
    // Lower skirt leafy boughs
    [0.0, 3.55, 0.0, 3.45, 0.18, 0.1, 0.08],
    [0.0, 3.55, 0.0, 3.45, -0.15, Math.PI * 0.52, -0.08],
    [0.82, 3.35, 0.52, 2.85, 0.34, 0.78, 0.22],
    [-0.84, 3.38, 0.46, 2.85, 0.32, -0.82, -0.2],
    [0.12, 3.32, -0.92, 2.9, -0.35, 0.12, 0.15],
    // Mid crown fullness
    [-0.65, 4.25, -0.45, 2.95, -0.25, 1.12, -0.18],
    [0.68, 4.3, -0.38, 2.95, -0.22, -1.05, 0.16],
    [0.08, 4.2, 0.72, 2.8, 0.28, 0.06, -0.12],
    // Upper sunlit crown cap (including gentle near-horizontal umbrella cards for aerial readability!)
    [0.0, 4.98, 0.0, 2.75, 0.14, 0.45, 0.12],
    [0.0, 5.05, 0.0, 2.65, -0.12, 1.98, -0.1],
    [0.0, 4.55, 0.0, 3.35, Math.PI * 0.44, 0.25, 0.15],
  ];

  for (const [cx, cy, cz, sz, rx, ry, rz] of cardSpecs) {
    const plane = new THREE.PlaneGeometry(sz, sz);
    plane.rotateX(rx);
    plane.rotateY(ry);
    plane.rotateZ(rz);
    plane.translate(cx, cy, cz);
    cards.push(plane);
  }

  const merged = mergeGeometries(cards, false);
  cards.forEach((c) => c.dispose());

  // Override normals with soft outward spherical normals from crown center (0, 3.9, 0)
  // so multi-card leaves shade smoothly under sunlight with zero flat dark card seams!
  const posAttr = merged.getAttribute('position');
  const normArr = new Float32Array(posAttr.count * 3);
  const v = new THREE.Vector3();
  for (let i = 0; i < posAttr.count; i++) {
    v.fromBufferAttribute(posAttr, i);
    v.y -= 3.85;
    v.y *= 1.15;
    if (v.lengthSq() < 0.0001) {
      v.set(0, 1, 0);
    } else {
      v.normalize();
    }
    normArr[i * 3] = v.x;
    normArr[i * 3 + 1] = Math.max(0.18, v.y);
    normArr[i * 3 + 2] = v.z;
  }
  merged.setAttribute('normal', new THREE.BufferAttribute(normArr, 3));
  return merged;
}

export function buildArchitecturalCity(
  quality: QualityProfile,
  maxAnisotropy: number,
  initialDarkMode = true
): CityBuildResult {
  const group = new THREE.Group();
  group.name = 'redesigned-realistic-british-metropolis';

  const disposables: { dispose: () => void }[] = [];
  const track = <T extends { dispose: () => void }>(item: T): T => {
    disposables.push(item);
    return item;
  };

  // High-resolution procedural PBR texture suites
  const skyPbr = track(createSkyscraperPbrSet(maxAnisotropy));
  const limestoneTowerPbr = track(createLimestoneTowerPbrSet(maxAnisotropy));
  const plazaPbr = track(createPlazaStonePbrSet(maxAnisotropy));
  const roadPbr = track(createBoulevardRoadPbrSet(maxAnisotropy));
  const claddingPbr = track(createArchitecturalCladdingPbr(maxAnisotropy));
  const grassPbr = track(createNaturalGrassPbrSet(maxAnisotropy, 44, 44));
  const parkGrassPbr = track(createNaturalGrassPbrSet(maxAnisotropy, 5, 5));
  const woodPbr = track(createWoodGrainPbrSet(maxAnisotropy));
  const winTex = track(createResidentialWindowTextures(maxAnisotropy));
  const shadowTex = track(createContactShadowTexture());
  const lightPoolTex = track(createLightPoolTexture());

  // 1. Continuous Parkland Terrain + Soft Rolling British Horizon Hills
  const groundGeo = track(new THREE.PlaneGeometry(920, 920));
  const groundMat = track(
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: initialDarkMode ? grassPbr.darkMap : grassPbr.lightMap,
      normalMap: grassPbr.normalMap,
      normalScale: new THREE.Vector2(0.42, 0.42),
      roughnessMap: grassPbr.roughnessMap,
      roughness: 0.94,
      metalness: 0.02,
    })
  );
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = quality.shadowsEnabled;
  group.add(ground);

  const hillMat = track(
    new THREE.MeshStandardMaterial({
      color: initialDarkMode ? 0x26213e : 0x5c8459,
      roughness: 0.96,
      metalness: 0.0,
    })
  );
  const hillGeo = track(new THREE.ConeGeometry(54, 22, 12));
  hillGeo.scale(1.9, 0.65, 1.25);
  const hillCount = 20;
  const hillsInst = new THREE.InstancedMesh(hillGeo, hillMat, hillCount);
  for (let i = 0; i < hillCount; i++) {
    const ang = (i / hillCount) * Math.PI * 2;
    const rad = 268 + (i % 3) * 20;
    _vDummy.position.set(Math.sin(ang) * rad, 5.5, Math.cos(ang) * rad);
    _vDummy.rotation.set(0, ang, 0);
    _vDummy.scale.set(1.15 + (i % 4) * 0.22, 0.72 + (i % 3) * 0.35, 1.0);
    _vDummy.updateMatrix();
    hillsInst.setMatrixAt(i, _vDummy.matrix);
  }
  hillsInst.instanceMatrix.needsUpdate = true;
  hillsInst.computeBoundingSphere();
  group.add(hillsInst);

  // Urban Granite District Pads under Downtown Blocks (North & South of River)
  const urbanPadMat = track(
    new THREE.MeshStandardMaterial({
      color: initialDarkMode ? 0x191e27 : 0xc9cdd2,
      normalMap: plazaPbr.normalMap,
      normalScale: new THREE.Vector2(0.18, 0.18),
      roughness: 0.88,
      metalness: 0.04,
    })
  );
  [
    [-86, 126, 134, 122],
    [86, 126, 134, 122],
    [-92, -16, 108, 108],
    [92, -16, 108, 108],
  ].forEach(([ux, uz, uw, ud]) => {
    const pad = new THREE.Mesh(track(new THREE.PlaneGeometry(uw, ud)), urbanPadMat);
    pad.rotation.x = -Math.PI / 2;
    pad.position.set(ux, 0.02, uz);
    pad.receiveShadow = quality.shadowsEnabled;
    group.add(pad);
  });

  // Shared Urban Stone, Grass, Timber & Cast-Iron Materials
  const parkGrassMat = track(
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: initialDarkMode ? parkGrassPbr.darkMap : parkGrassPbr.lightMap,
      normalMap: parkGrassPbr.normalMap,
      normalScale: new THREE.Vector2(0.48, 0.48),
      roughnessMap: parkGrassPbr.roughnessMap,
      roughness: 0.92,
      metalness: 0.02,
    })
  );
  const stoneCurbMat = track(
    new THREE.MeshStandardMaterial({
      color: initialDarkMode ? 0x414855 : 0xe4dfd5,
      map: claddingPbr.map,
      normalMap: claddingPbr.normalMap,
      normalScale: new THREE.Vector2(0.32, 0.32),
      roughnessMap: claddingPbr.roughnessMap,
      roughness: 0.74,
      metalness: 0.05,
    })
  );
  applyGroundAO(stoneCurbMat, 2.8, 0.22);
  const benchWoodMat = track(
    new THREE.MeshStandardMaterial({
      color: initialDarkMode ? 0x6e4a2d : 0xa67346,
      map: woodPbr.map,
      normalMap: woodPbr.normalMap,
      roughnessMap: woodPbr.roughnessMap,
      roughness: 0.68,
      metalness: 0.05,
    })
  );
  const castIronMat = track(
    new THREE.MeshStandardMaterial({
      color: 0x222730,
      roughness: 0.4,
      metalness: 0.84,
    })
  );
  const roadMat = track(
    new THREE.MeshStandardMaterial({
      map: initialDarkMode ? roadPbr.darkMap : roadPbr.lightMap,
      normalMap: roadPbr.normalMap,
      normalScale: new THREE.Vector2(0.35, 0.35),
      roughnessMap: initialDarkMode ? roadPbr.darkRoughnessMap : roadPbr.lightRoughnessMap,
      roughness: 1.0,
      metalness: initialDarkMode ? 0.14 : 0.03,
    })
  );

  // ===========================================================================
  // 2. EXPANDED GRAND RESIDENTIAL ESTATE CRESCENT (Centered at (0, -7.5), R=47)
  // Sized cleanly for our 6 distinct Service Houses at R=34.5 + wide scenic crescent ring road!
  // ===========================================================================
  const plazaMat = track(
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: initialDarkMode ? plazaPbr.darkMap : plazaPbr.lightMap,
      normalMap: plazaPbr.normalMap,
      normalScale: new THREE.Vector2(0.42, 0.42),
      roughnessMap: plazaPbr.roughnessMap,
      roughness: initialDarkMode ? 0.72 : 0.84,
      metalness: 0.04,
    })
  );
  const plaza = new THREE.Mesh(track(new THREE.CylinderGeometry(47.2, 47.8, 0.1, 80)), plazaMat);
  plaza.position.set(0, 0.05, -7.5);
  plaza.receiveShadow = quality.shadowsEnabled;
  group.add(plaza);

  // Smooth Curved Estate Crescent Ring Road circling the central park right in front of all 6 houses!
  const crescentRoadMat = track(
    new THREE.MeshStandardMaterial({
      color: initialDarkMode ? 0x222730 : 0x525760,
      normalMap: roadPbr.normalMap,
      normalScale: new THREE.Vector2(0.28, 0.28),
      roughness: initialDarkMode ? 0.62 : 0.86,
      metalness: initialDarkMode ? 0.12 : 0.03,
    })
  );
  const crescentRingGeo = track(new THREE.RingGeometry(12.8, 24.0, 72));
  crescentRingGeo.rotateX(-Math.PI / 2);
  const crescentRing = new THREE.Mesh(crescentRingGeo, crescentRoadMat);
  crescentRing.position.set(0, 0.105, -7.5);
  crescentRing.receiveShadow = quality.shadowsEnabled;
  group.add(crescentRing);

  // Subtle Granite Curb Rings bordering the Crescent Ring Road
  const innerRoadCurb = new THREE.Mesh(
    track(new THREE.RingGeometry(12.2, 12.9, 72)),
    stoneCurbMat
  );
  innerRoadCurb.rotation.x = -Math.PI / 2;
  innerRoadCurb.position.set(0, 0.12, -7.5);
  const outerRoadCurb = new THREE.Mesh(
    track(new THREE.RingGeometry(23.9, 24.8, 72)),
    stoneCurbMat
  );
  outerRoadCurb.rotation.x = -Math.PI / 2;
  outerRoadCurb.position.set(0, 0.12, -7.5);
  group.add(innerRoadCurb, outerRoadCurb);

  // Central Landscaped Park Roundabout Island (R=11.4 around (0, -7.5))
  const islandCurb = new THREE.Mesh(
    track(new THREE.CylinderGeometry(11.4, 11.75, 0.34, 64)),
    stoneCurbMat
  );
  islandCurb.position.set(0, 0.18, -7.5);
  islandCurb.receiveShadow = quality.shadowsEnabled;
  const islandGrass = new THREE.Mesh(
    track(new THREE.CylinderGeometry(10.85, 10.85, 0.36, 64)),
    parkGrassMat
  );
  islandGrass.position.set(0, 0.19, -7.5);
  islandGrass.receiveShadow = quality.shadowsEnabled;
  group.add(islandCurb, islandGrass);

  // Radial Park Stone Walkways + Tiered Architectural Limestone Fountain
  for (let w = 0; w < 4; w++) {
    const walk = new THREE.Mesh(track(new THREE.BoxGeometry(2.1, 0.05, 11.0)), stoneCurbMat);
    walk.position.set(0, 0.38, -7.5);
    walk.rotation.y = (w * Math.PI) / 4;
    walk.receiveShadow = quality.shadowsEnabled;
    group.add(walk);
  }

  // Sculptural Contemporary Concentric Infinity Water-Pavilion Fountain (Crescent Centerpiece)
  const fountainBasaltMat = track(
    new THREE.MeshStandardMaterial({
      color: initialDarkMode ? 0x162030 : 0x2d3848,
      map: claddingPbr.map,
      normalMap: claddingPbr.normalMap,
      roughness: 0.48,
      metalness: 0.24,
    })
  );
  const fountainHaloMat = track(
    new THREE.MeshStandardMaterial({
      color: initialDarkMode ? 0xffd580 : 0x7dd3fc,
      emissive: initialDarkMode ? 0xffa73b : 0x38bdf8,
      emissiveIntensity: initialDarkMode ? 2.15 : 0.2,
      roughness: 0.14,
    })
  );
  const fountainChromeMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xdce7f5,
      roughness: 0.12,
      metalness: 0.94,
      clearcoat: 1.0,
    })
  );

  const fountainBasinOuter = new THREE.Mesh(
    track(new THREE.CylinderGeometry(4.95, 5.25, 0.56, 56)),
    fountainBasaltMat
  );
  fountainBasinOuter.position.set(0, 0.48, -7.5);
  fountainBasinOuter.castShadow = quality.shadowsEnabled;
  fountainBasinOuter.receiveShadow = quality.shadowsEnabled;
  const fountainBasinCap = new THREE.Mesh(
    track(new THREE.TorusGeometry(4.92, 0.14, 12, 56)),
    stoneCurbMat
  );
  fountainBasinCap.rotation.x = Math.PI / 2;
  fountainBasinCap.position.set(0, 0.78, -7.5);
  const fountainHaloRing = new THREE.Mesh(
    track(new THREE.TorusGeometry(4.45, 0.055, 10, 56)),
    fountainHaloMat
  );
  fountainHaloRing.rotation.x = Math.PI / 2;
  fountainHaloRing.position.set(0, 0.78, -7.5);
  group.add(fountainBasinOuter, fountainBasinCap, fountainHaloRing);

  // Mirror-Glassy Animated Rippling Water Material (Shared by Fountain Basin & Scenic City River!)
  // Light Mode: crisp sunlit azure sky + cloud + emerald bank reflections
  // Dark/Sunset Mode: golden-hour sunset sky, shimmering orange-gold sun path, and golden embankment lamp reflections!
  const waterUniforms = {
    uTime: { value: 0 },
    uIsDark: { value: initialDarkMode ? 1.0 : 0.0 },
  };
  const waterMat = track(
    new THREE.MeshPhysicalMaterial({
      color: initialDarkMode ? 0x1a1c36 : 0x2a7bc8,
      roughness: 0.08,
      metalness: 0.14,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      reflectivity: 1.0,
    })
  );
  waterMat.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = waterUniforms.uTime;
    shader.uniforms.uIsDark = waterUniforms.uIsDark;

    shader.vertexShader =
      `varying vec3 vWaterWorldPos;\n` +
      shader.vertexShader.replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        vWaterWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;`
      );

    shader.fragmentShader =
      `uniform float uTime;
      uniform float uIsDark;
      varying vec3 vWaterWorldPos;\n` +
      shader.fragmentShader
        .replace(
          '#include <normal_fragment_maps>',
          `#include <normal_fragment_maps>
          vec2 wp = vWaterWorldPos.xz;
          float w1 = sin(wp.x * 0.85 + uTime * 1.45) * cos(wp.y * 1.65 - uTime * 1.15);
          float w2 = cos(wp.x * 1.9 - wp.y * 2.1 + uTime * 1.85);
          normal = normalize(normal + vec3((w1 + w2 * 0.45) * 0.065, 0.0, (w2 - w1 * 0.45) * 0.075));`
        )
        .replace(
          '#include <color_fragment>',
          `#include <color_fragment>
          vec2 cp = vWaterWorldPos.xz;
          float rDist = length(cp - vec2(0.0, -7.5));
          float isRiver = step(20.0, cp.y);
          float bankDist = abs(cp.y - 54.0);
          float bankMask = smoothstep(5.5, 11.4, bankDist) * isRiver;
          float centerMask = (1.0 - smoothstep(0.0, 9.8, bankDist)) * isRiver;

          float ripple = sin(cp.x * 1.25 + uTime * 1.65) * cos(cp.y * 2.15 - uTime * 1.35) * 0.5 + 0.5;
          float microWave = sin(cp.x * 3.4 - cp.y * 2.8 + uTime * 2.2) * 0.5 + 0.5;
          float shimmer = smoothstep(0.58, 0.98, ripple * 0.7 + microWave * 0.3);

          // LIGHT MODE: Crisp Mediterranean azure river + sunlit cloud reflection + lush emerald tree reflections along both banks!
          vec3 dayCenterRefl = mix(vec3(0.32, 0.64, 0.96), vec3(0.84, 0.93, 1.0), shimmer * 0.72 + 0.16);
          vec3 dayBankRefl = mix(vec3(0.18, 0.44, 0.19), vec3(0.34, 0.60, 0.25), microWave * 0.5 + 0.25);
          vec3 dayRiverCol = mix(dayCenterRefl, dayBankRefl, bankMask * 0.82);

          // DARK / SUNSET MODE: Dramatic golden-hour river
          float sunPath = exp(-pow((cp.x + 12.0) * 0.022, 2.0)) * centerMask;
          float lampSpacing = abs(sin(cp.x * 0.2618));
          float lampStreak = pow(lampSpacing, 7.0) * smoothstep(3.2, 11.2, bankDist) * isRiver;
          vec3 sunsetWaterBase = mix(vec3(0.18, 0.16, 0.34), vec3(0.76, 0.36, 0.28), centerMask * 0.75 + 0.12);
          vec3 sunsetGoldPath = vec3(1.0, 0.66, 0.24) * (0.45 + shimmer * 0.85) * (0.42 + sunPath * 0.95);
          vec3 sunsetLampGlow = vec3(1.0, 0.76, 0.32) * lampStreak * (0.55 + microWave * 0.75) * 1.25;
          vec3 sunsetRiverCol = sunsetWaterBase + sunsetGoldPath * centerMask + sunsetLampGlow;

          vec3 riverCol = mix(dayRiverCol, sunsetRiverCol, uIsDark);
          diffuseColor.rgb = mix(diffuseColor.rgb, riverCol, isRiver * 0.88);

          // Fountain splash rings & subtle water glints
          float splashRing = exp(-pow((rDist - 3.25) * 3.0, 2.0)) * step(rDist, 6.2);
          vec3 glintColor = mix(vec3(0.68, 0.86, 1.0), vec3(1.0, 0.68, 0.34), uIsDark);
          diffuseColor.rgb += glintColor * shimmer * 0.22 + vec3(0.92, 0.96, 1.0) * splashRing * 0.36;`
        );
  };

  const fountainWater = new THREE.Mesh(
    track(new THREE.CylinderGeometry(4.55, 4.55, 0.5, 56)),
    waterMat
  );
  fountainWater.position.set(0, 0.5, -7.5);
  group.add(fountainWater);

  // Contemporary Sculpted Infinity-Tier Water Sculpture (Floating Basalt Discs + Brushed-Chrome Ribbed Ring)
  const tierBase = new THREE.Mesh(
    track(new THREE.CylinderGeometry(2.1, 2.35, 0.52, 32)),
    fountainBasaltMat
  );
  tierBase.position.set(0, 0.85, -7.5);
  const tierHalo = new THREE.Mesh(
    track(new THREE.TorusGeometry(2.12, 0.045, 10, 40)),
    fountainHaloMat
  );
  tierHalo.rotation.x = Math.PI / 2;
  tierHalo.position.set(0, 1.12, -7.5);
  const midDisc = new THREE.Mesh(
    track(new THREE.CylinderGeometry(1.25, 1.38, 0.36, 32)),
    stoneCurbMat
  );
  midDisc.position.set(0, 1.56, -7.5);
  // Sculptural intersecting brushed-chrome architectural torus ribbons rising from the fountain core!
  const sculpRing1 = new THREE.Mesh(
    track(new THREE.TorusGeometry(0.98, 0.09, 14, 42)),
    fountainChromeMat
  );
  sculpRing1.position.set(0, 2.75, -7.5);
  sculpRing1.rotation.y = Math.PI * 0.22;
  const sculpRing2 = new THREE.Mesh(
    track(new THREE.TorusGeometry(0.76, 0.075, 14, 42)),
    fountainChromeMat
  );
  sculpRing2.position.set(0, 2.75, -7.5);
  sculpRing2.rotation.y = -Math.PI * 0.28;
  sculpRing2.rotation.x = 0.22;
  group.add(tierBase, tierHalo, midDisc, sculpRing1, sculpRing2);

  const jetMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xf0f9ff,
      roughness: 0.06,
      metalness: 0.04,
      transparent: true,
      opacity: 0.56,
      clearcoat: 1.0,
    })
  );
  const fountainJets: THREE.Mesh[] = [];
  for (let j = 0; j < 12; j++) {
    const ang = (j / 12) * Math.PI * 2;
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(Math.cos(ang) * 1.15, 1.72, -7.5 + Math.sin(ang) * 1.15),
      new THREE.Vector3(Math.cos(ang) * 2.25, 3.25, -7.5 + Math.sin(ang) * 2.25),
      new THREE.Vector3(Math.cos(ang) * 3.32, 0.76, -7.5 + Math.sin(ang) * 3.32)
    );
    const jetMesh = new THREE.Mesh(
      track(new THREE.TubeGeometry(curve, 18, 0.028, 8, false)),
      jetMat
    );
    group.add(jetMesh);
    fountainJets.push(jetMesh);
  }

  // Sleek Contemporary Teak & Obsidian-Steel Park Benches circling the Fountain Lawn
  for (let b = 0; b < 6; b++) {
    const ang = (b / 6) * Math.PI * 2 + Math.PI / 6;
    const bx = Math.sin(ang) * 9.8;
    const bz = -7.5 + Math.cos(ang) * 9.8;
    const bench = new THREE.Group();
    bench.position.set(bx, 0.34, bz);
    bench.rotation.y = ang + Math.PI;
    const seat = new THREE.Mesh(track(new THREE.BoxGeometry(2.05, 0.1, 0.52)), benchWoodMat);
    seat.position.set(0, 0.44, 0);
    seat.castShadow = quality.shadowsEnabled;
    const plinthLeg = new THREE.Mesh(track(new THREE.BoxGeometry(1.65, 0.4, 0.38)), fountainBasaltMat);
    plinthLeg.position.set(0, 0.2, 0);
    bench.add(seat, plinthLeg);
    group.add(bench);
  }

  // ===========================================================================
  // 3. SCENIC REFLECTIVE METROPOLIS RIVER, TERRACED EMERALD EMBANKMENTS,
  //    MOORED RIVER CRUISERS & CLASSIC ILLUMINATED MULTI-ARCH BRIDGE (z = 54)
  // ===========================================================================
  const riverWater = new THREE.Mesh(track(new THREE.PlaneGeometry(580, 23.2)), waterMat);
  riverWater.rotation.x = -Math.PI / 2;
  riverWater.position.set(0, 0.14, 54);
  group.add(riverWater);

  const waterfrontGlassMat = track(
    new THREE.MeshPhysicalMaterial({
      color: initialDarkMode ? 0x9ab4d6 : 0xcce6ff,
      roughness: 0.06,
      metalness: 0.22,
      transparent: true,
      opacity: 0.4,
      clearcoat: 1.0,
    })
  );

  // Carved Stone River Embankment Seawalls, Terraced Emerald Park Strips & Scenic Waterfront Promenades
  const embankmentWallGeo = track(new THREE.BoxGeometry(560, 1.45, 2.4));
  const promenadeGeo = track(new THREE.BoxGeometry(560, 0.22, 4.4));
  const emeraldSlopeGeo = track(new THREE.BoxGeometry(560, 0.48, 3.8));
  [41.4, 66.6].forEach((ez, sideIdx) => {
    const sign = sideIdx === 0 ? -1 : 1;
    const wall = new THREE.Mesh(embankmentWallGeo, stoneCurbMat);
    wall.position.set(0, 0.45, ez);
    wall.receiveShadow = quality.shadowsEnabled;
    const prom = new THREE.Mesh(promenadeGeo, plazaMat);
    prom.position.set(0, 0.94, ez + sign * 2.1);
    prom.receiveShadow = quality.shadowsEnabled;
    const emeraldTerrace = new THREE.Mesh(emeraldSlopeGeo, parkGrassMat);
    emeraldTerrace.position.set(0, 1.06, ez + sign * 5.2);
    emeraldTerrace.receiveShadow = quality.shadowsEnabled;
    group.add(wall, prom, emeraldTerrace);

    // Classic Stone Coping & Sleek Waterfront Railing along both promenades (skipping bridge center)
    [-148, 148].forEach((segX) => {
      const rail = new THREE.Mesh(track(new THREE.BoxGeometry(272, 0.08, 0.12)), fountainChromeMat);
      rail.position.set(segX, 1.72, ez - sign * 0.95);
      const glassPanel = new THREE.Mesh(
        track(new THREE.BoxGeometry(272, 0.68, 0.05)),
        waterfrontGlassMat
      );
      glassPanel.position.set(segX, 1.36, ez - sign * 0.95);
      const curb = new THREE.Mesh(track(new THREE.BoxGeometry(272, 0.28, 0.38)), stoneCurbMat);
      curb.position.set(segX, 1.04, ez - sign * 0.95);
      group.add(rail, glassPanel, curb);
    });

    // Timber & Stone Waterfront Overlook Landings
    [-58, -28, 28, 58].forEach((px) => {
      const pierDeck = new THREE.Mesh(track(new THREE.BoxGeometry(7.2, 0.26, 3.6)), benchWoodMat);
      pierDeck.position.set(px, 0.96, ez - sign * 2.25);
      pierDeck.receiveShadow = quality.shadowsEnabled;
      const pierRim = new THREE.Mesh(track(new THREE.BoxGeometry(7.35, 0.08, 0.1)), fountainHaloMat);
      pierRim.position.set(px, 0.85, ez - sign * 4.05);
      group.add(pierDeck, pierRim);
    });
  });

  // Moored Scenic River Cruiser Vessels docked gracefully along the right waterfront stone quay (matching reference photos!)
  const boatHullMat = track(
    new THREE.MeshStandardMaterial({
      color: initialDarkMode ? 0x1e2536 : 0x29394f,
      roughness: 0.36,
      metalness: 0.25,
    })
  );
  const boatCabinMat = track(
    new THREE.MeshStandardMaterial({
      color: initialDarkMode ? 0xd9dde6 : 0xf7f9fc,
      roughness: 0.28,
      metalness: 0.12,
    })
  );
  const boatWindowMat = track(
    new THREE.MeshStandardMaterial({
      color: initialDarkMode ? 0xffd580 : 0x2d4e70,
      emissive: initialDarkMode ? 0xffa838 : 0x000000,
      emissiveIntensity: initialDarkMode ? 1.55 : 0.0,
      roughness: 0.14,
      metalness: 0.35,
    })
  );
  [
    [38, 63.4, 0.04, 1.05],
    [52, 63.6, -0.03, 0.92],
    [-42, 44.6, Math.PI + 0.03, 1.0],
    [76, 63.5, 0.02, 0.96],
  ].forEach(([bx, bz, rotY, sc]) => {
    const boat = new THREE.Group();
    boat.position.set(bx, 0.24, bz);
    boat.rotation.y = rotY;
    boat.scale.setScalar(sc);
    const hull = new THREE.Mesh(track(new THREE.BoxGeometry(8.6, 0.82, 2.5)), boatHullMat);
    hull.position.set(0, 0.35, 0);
    const bow = new THREE.Mesh(track(new THREE.CylinderGeometry(0.15, 1.25, 2.2, 4)), boatHullMat);
    bow.rotation.z = -Math.PI / 2;
    bow.rotation.x = Math.PI / 4;
    bow.position.set(5.3, 0.36, 0);
    const cabin = new THREE.Mesh(track(new THREE.BoxGeometry(5.8, 1.08, 2.05)), boatCabinMat);
    cabin.position.set(-0.3, 1.22, 0);
    const cabinGlass = new THREE.Mesh(track(new THREE.BoxGeometry(5.1, 0.48, 2.12)), boatWindowMat);
    cabinGlass.position.set(-0.2, 1.32, 0);
    const topDeck = new THREE.Mesh(track(new THREE.BoxGeometry(4.8, 0.14, 1.95)), boatCabinMat);
    topDeck.position.set(-0.4, 1.82, 0);
    boat.add(hull, bow, cabin, cabinGlass, topDeck);
    group.add(boat);
  });

  // Classic Illuminated Multi-Arch Stone & Steel River Bridge (z = 54, matching reference photos!)
  // Open sky overhead across the boulevard lanes so camera glides smoothly over the water with zero clutter!
  const bridgeGroup = new THREE.Group();
  bridgeGroup.position.set(0, 0, 54);

  const bridgeSteelMat = track(
    new THREE.MeshPhysicalMaterial({
      color: initialDarkMode ? 0x2b3242 : 0x52657a,
      roughness: 0.36,
      metalness: 0.68,
      clearcoat: 0.28,
    })
  );
  const bridgeArchLightMat = track(
    new THREE.MeshStandardMaterial({
      color: initialDarkMode ? 0xffe49e : 0xeef3f8,
      emissive: initialDarkMode ? 0xffb84d : 0x000000,
      emissiveIntensity: initialDarkMode ? 2.35 : 0.0,
      roughness: 0.18,
    })
  );

  // Main Bridge Roadway Deck carrying Boulevard traffic across the river
  const bridgeDeck = new THREE.Mesh(track(new THREE.BoxGeometry(21.6, 0.9, 29.8)), stoneCurbMat);
  bridgeDeck.position.set(0, 0.45, 0);
  bridgeDeck.receiveShadow = quality.shadowsEnabled;
  bridgeGroup.add(bridgeDeck);

  // Carved Stone River Bridge Piers & Cutwaters along both bridge faces
  [-11.0, 0.0, 11.0].forEach((pz) => {
    [-10.4, 10.4].forEach((px) => {
      const pier = new THREE.Mesh(track(new THREE.BoxGeometry(1.85, 2.3, 1.95)), stoneCurbMat);
      pier.position.set(px, 0.95, pz);
      pier.castShadow = quality.shadowsEnabled;
      const cap = new THREE.Mesh(track(new THREE.BoxGeometry(2.25, 0.28, 2.3)), stoneCurbMat);
      cap.position.set(px, 2.15, pz);
      bridgeGroup.add(pier, cap);
    });
  });

  // Graceful Multi-Arch Structural Rib Spans & Warm Golden Illuminated Arch Soffits along both river sides
  [-9.8, 9.8].forEach((ax) => {
    // Low sculptural balustrade parapet
    const parapet = new THREE.Mesh(track(new THREE.BoxGeometry(0.46, 0.98, 28.6)), stoneCurbMat);
    parapet.position.set(ax, 1.32, 0);
    const topRail = new THREE.Mesh(track(new THREE.BoxGeometry(0.58, 0.14, 28.8)), bridgeSteelMat);
    topRail.position.set(ax, 1.84, 0);
    bridgeGroup.add(parapet, topRail);

    // Two wide classical low-rise arches along each river-facing side (z = -11..0 and z = 0..11)
    [-5.5, 5.5].forEach((archCenterZ) => {
      const archCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(ax, 0.28, archCenterZ - 5.1),
        new THREE.Vector3(ax, 0.96, archCenterZ - 2.6),
        new THREE.Vector3(ax, 1.18, archCenterZ),
        new THREE.Vector3(ax, 0.96, archCenterZ + 2.6),
        new THREE.Vector3(ax, 0.28, archCenterZ + 5.1),
      ]);
      const archRim = new THREE.Mesh(
        track(new THREE.TubeGeometry(archCurve, 24, 0.16, 8, false)),
        bridgeSteelMat
      );
      const archGlowStrip = new THREE.Mesh(
        track(new THREE.TubeGeometry(archCurve, 24, 0.085, 6, false)),
        bridgeArchLightMat
      );
      archGlowStrip.position.y = -0.14;
      bridgeGroup.add(archRim, archGlowStrip);
    });

    // Classic Globe Bridge Streetlamps lining both sides of the river bridge!
    [-11.0, -5.5, 0.0, 5.5, 11.0].forEach((lz) => {
      const lampPost = new THREE.Mesh(
        track(new THREE.CylinderGeometry(0.05, 0.08, 3.1, 8)),
        bridgeSteelMat
      );
      lampPost.position.set(ax, 3.35, lz);
      const lampGlobe = new THREE.Mesh(
        track(new THREE.SphereGeometry(0.24, 10, 10)),
        bridgeArchLightMat
      );
      lampGlobe.position.set(ax, 4.98, lz);
      bridgeGroup.add(lampPost, lampGlobe);
    });
  });

  // Secondary Scenic Multi-Arch Pedestrian / Horizon River Bridge further down the river (x = -86, z = 54)
  // Visible in the panoramic city view just like the multi-arch river bridge spanning the vista in both reference images!
  const vistaBridge = new THREE.Group();
  vistaBridge.position.set(-78, 0, 54);
  const vistaDeck = new THREE.Mesh(track(new THREE.BoxGeometry(7.6, 0.72, 27.6)), stoneCurbMat);
  vistaDeck.position.set(0, 1.65, 0);
  vistaBridge.add(vistaDeck);
  [-11.5, -3.8, 3.8, 11.5].forEach((pz) => {
    const vPier = new THREE.Mesh(track(new THREE.BoxGeometry(8.4, 2.2, 1.5)), stoneCurbMat);
    vPier.position.set(0, 0.85, pz);
    vistaBridge.add(vPier);
  });
  [-7.65, 0.0, 7.65].forEach((cz) => {
    const vCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(3.75, 0.32, cz - 3.6),
      new THREE.Vector3(3.75, 1.38, cz),
      new THREE.Vector3(3.75, 0.32, cz + 3.6),
    ]);
    const vArch = new THREE.Mesh(
      track(new THREE.TubeGeometry(vCurve, 16, 0.14, 8, false)),
      bridgeArchLightMat
    );
    vistaBridge.add(vArch);
  });
  [-9.5, -3.8, 3.8, 9.5].forEach((lz) => {
    const vLamp = new THREE.Mesh(track(new THREE.SphereGeometry(0.26, 8, 8)), bridgeArchLightMat);
    vLamp.position.set(3.6, 3.4, lz);
    vistaBridge.add(vLamp);
  });
  group.add(bridgeGroup, vistaBridge);

  // ===========================================================================
  // 4. GRAND ROYAL BOULEVARD, CROSS AVENUES, SIDEWALKS & CLEAN INTERSECTIONS
  // ===========================================================================
  const mainRoad = new THREE.Mesh(track(new THREE.PlaneGeometry(15.2, 206)), roadMat);
  mainRoad.rotation.x = -Math.PI / 2;
  mainRoad.position.set(0, 0.16, 118);
  mainRoad.receiveShadow = quality.shadowsEnabled;
  group.add(mainRoad);

  // Elevated smooth tarmac across bridge deck
  const bridgeRoad = new THREE.Mesh(track(new THREE.PlaneGeometry(15.2, 32)), roadMat);
  bridgeRoad.rotation.x = -Math.PI / 2;
  bridgeRoad.position.set(0, 0.87, 54);
  bridgeRoad.receiveShadow = quality.shadowsEnabled;
  group.add(bridgeRoad);

  // East-West Cross Streets (Cleanly separated from River at z=54!)
  const crossRoadGeo = track(new THREE.PlaneGeometry(280, 12.2));
  [27, 86, 126].forEach((zPos) => {
    const cr = new THREE.Mesh(crossRoadGeo, roadMat);
    cr.rotation.x = -Math.PI / 2;
    cr.position.set(0, 0.13, zPos);
    cr.receiveShadow = quality.shadowsEnabled;
    group.add(cr);
  });

  // Single Deduplicated Set of Crisp Pedestrian Zebra Crosswalks & Stop Bars
  const crosswalkMat = track(
    new THREE.MeshStandardMaterial({
      color: initialDarkMode ? 0xb8c4d4 : 0xf6f8fb,
      roughness: 0.84,
      metalness: 0.02,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    })
  );
  const zebraStripeGeo = track(new THREE.PlaneGeometry(0.75, 2.8));
  zebraStripeGeo.rotateX(-Math.PI / 2);
  const stopBarGeo = track(new THREE.PlaneGeometry(5.8, 0.42));
  stopBarGeo.rotateX(-Math.PI / 2);

  [18.5, 34.5, 78.2, 93.8, 118.2].forEach((cz) => {
    for (let sx = -5.4; sx <= 5.45; sx += 1.54) {
      const st = new THREE.Mesh(zebraStripeGeo, crosswalkMat);
      st.position.set(sx, 0.175, cz);
      group.add(st);
    }
    const bar = new THREE.Mesh(stopBarGeo, crosswalkMat);
    bar.position.set(3.4, 0.175, cz + 2.3);
    group.add(bar);
  });

  // Raised Concrete Sidewalks & Landscaped Grass Parkway Verges flanking Main Boulevard (broken cleanly at River)
  const sidewalkMat = track(
    new THREE.MeshStandardMaterial({
      color: initialDarkMode ? 0x2b313c : 0xdcd9d1,
      map: plazaPbr.lightMap,
      normalMap: plazaPbr.normalMap,
      normalScale: new THREE.Vector2(0.28, 0.28),
      roughness: 0.84,
      metalness: 0.03,
    })
  );
  const sidewalkSections: [number, number][] = [
    [28.0, 24.0], // Crescent exit to south embankment
    [136.0, 134.0], // North embankment to downtown
  ];
  sidewalkSections.forEach(([zCenter, len]) => {
    const swGeo = track(new THREE.BoxGeometry(3.8, 0.24, len));
    const vgGeo = track(new THREE.BoxGeometry(2.6, 0.16, len));
    [-9.5, 9.5].forEach((xPos) => {
      const sw = new THREE.Mesh(swGeo, sidewalkMat);
      sw.position.set(xPos, 0.14, zCenter);
      sw.receiveShadow = quality.shadowsEnabled;
      group.add(sw);
    });
    [-12.7, 12.7].forEach((xPos) => {
      const vg = new THREE.Mesh(vgGeo, parkGrassMat);
      vg.position.set(xPos, 0.08, zCenter);
      vg.receiveShadow = quality.shadowsEnabled;
      group.add(vg);
    });
  });

  // Clean Deduplicated Intersection Traffic Signal Masts
  const sigGreenMat = track(
    new THREE.MeshStandardMaterial({
      color: 0x16a34a,
      emissive: 0x22c55e,
      emissiveIntensity: initialDarkMode ? 1.65 : 0.65,
      roughness: 0.2,
    })
  );
  const sigRedMat = track(
    new THREE.MeshStandardMaterial({
      color: 0xb91c1c,
      emissive: 0xef4444,
      emissiveIntensity: initialDarkMode ? 1.65 : 0.65,
      roughness: 0.2,
    })
  );
  const sigOffMat = track(
    new THREE.MeshStandardMaterial({ color: 0x111419, roughness: 0.5, metalness: 0.3 })
  );
  [
    [-8.3, 33.4, 0, true],
    [8.3, 20.8, Math.PI, true],
    [-8.3, 92.6, 0, false],
    [8.3, 79.4, Math.PI, false],
  ].forEach(([tx, tz, rotY, isGreen]) => {
    const sg = new THREE.Group();
    sg.position.set(tx as number, 0.2, tz as number);
    sg.rotation.y = rotY as number;
    const post = new THREE.Mesh(
      track(new THREE.CylinderGeometry(0.11, 0.14, 5.1, 10)),
      castIronMat
    );
    post.position.y = 2.55;
    post.castShadow = quality.shadowsEnabled;
    const arm = new THREE.Mesh(track(new THREE.BoxGeometry(2.6, 0.13, 0.13)), castIronMat);
    arm.position.set(1.25, 4.92, 0);
    const box = new THREE.Mesh(track(new THREE.BoxGeometry(0.36, 1.05, 0.34)), castIronMat);
    box.position.set(2.2, 4.65, 0);
    const topLens = new THREE.Mesh(
      track(new THREE.CircleGeometry(0.1, 12)),
      isGreen ? sigOffMat : sigRedMat
    );
    topLens.position.set(2.2, 4.95, 0.18);
    const midLens = new THREE.Mesh(track(new THREE.CircleGeometry(0.1, 12)), sigOffMat);
    midLens.position.set(2.2, 4.65, 0.18);
    const botLens = new THREE.Mesh(
      track(new THREE.CircleGeometry(0.1, 12)),
      isGreen ? sigGreenMat : sigOffMat
    );
    botLens.position.set(2.2, 4.35, 0.18);
    sg.add(post, arm, box, topLens, midLens, botLens);
    group.add(sg);
  });

  // Modern Glass & Anodized-Steel Transit Bus Shelters
  const shelterGlassMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xdbeafe,
      roughness: 0.08,
      metalness: 0.1,
      transparent: true,
      opacity: 0.42,
      clearcoat: 1.0,
    })
  );
  [
    [-9.6, 74, 1],
    [9.6, 104, -1],
  ].forEach(([sx, sz, dir]) => {
    const sh = new THREE.Group();
    sh.position.set(sx, 0.26, sz);
    const roof = new THREE.Mesh(track(new THREE.BoxGeometry(1.55, 0.12, 4.4)), castIronMat);
    roof.position.set(0, 2.45, 0);
    roof.castShadow = quality.shadowsEnabled;
    const backGlass = new THREE.Mesh(
      track(new THREE.BoxGeometry(0.06, 2.25, 4.2)),
      shelterGlassMat
    );
    backGlass.position.set(-dir * 0.68, 1.2, 0);
    const shSeat = new THREE.Mesh(track(new THREE.BoxGeometry(0.42, 0.07, 2.8)), benchWoodMat);
    shSeat.position.set(-dir * 0.35, 0.46, 0);
    sh.add(roof, backGlass, shSeat);
    group.add(sh);
  });

  // ===========================================================================
  // 5. MULTI-ARCHETYPE REALISTIC BRITISH METROPOLIS SKYLINE
  // (Stepped Corporate Towers + Diagonal-Crown Glass Landmarks + Tapered Cylindrical Towers)
  // ===========================================================================
  const podiumGeo = track(new THREE.BoxGeometry(1.14, 1, 1.14));
  podiumGeo.translate(0, 0.5, 0);
  const towerGeo = track(new THREE.BoxGeometry(1, 1, 1));
  towerGeo.translate(0, 0.5, 0);
  const setbackGeo = track(new THREE.BoxGeometry(0.74, 1, 0.74));
  setbackGeo.translate(0, 0.5, 0);
  const parapetGeo = track(new THREE.BoxGeometry(0.78, 0.12, 0.78));
  parapetGeo.translate(0, 0.06, 0);
  const hvacGeo = track(new THREE.BoxGeometry(0.36, 1.8, 0.36));
  hvacGeo.translate(0, 0.9, 0);
  const spireGeo = track(new THREE.CylinderGeometry(0.04, 0.13, 6.4, 8));
  spireGeo.translate(0, 3.2, 0);
  const beaconGeo = track(new THREE.SphereGeometry(0.24, 8, 8));
  const diagCrownGeo = track(createDiagonalCrownTowerGeometry());
  const twistedTowerGeo = track(createTwistedSupertallGeometry());
  const crystalTowerGeo = track(createFacetedCrystalTowerGeometry());
  const artDecoTowerGeo = track(createArtDecoSteppedTowerGeometry());
  const curvedDrumGeo = track(createCurvedDrumTowerGeometry());
  const terracedTowerGeo = track(createTerracedSkyGardenTowerGeometry());
  const crownHaloGeo = track(new THREE.BoxGeometry(0.8, 0.16, 0.8));
  const helipadRingGeo = track(new THREE.RingGeometry(0.22, 0.28, 24));
  helipadRingGeo.rotateX(-Math.PI / 2);

  const podiumMat = track(
    new THREE.MeshStandardMaterial({
      color: initialDarkMode ? 0x1e2236 : 0xddd7cc,
      map: claddingPbr.map,
      normalMap: claddingPbr.normalMap,
      normalScale: new THREE.Vector2(0.42, 0.42),
      roughnessMap: claddingPbr.roughnessMap,
      roughness: 0.62,
      metalness: 0.18,
    })
  );
  applyGroundAO(podiumMat, 4.6, 0.3);

  // Material 1: Crisp Architectural Sapphire & Silver Curtain-Wall Glass Towers
  const towerMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      map: initialDarkMode ? skyPbr.darkMap : skyPbr.lightMap,
      normalMap: skyPbr.normalMap,
      normalScale: new THREE.Vector2(0.72, 0.72),
      roughnessMap: skyPbr.roughnessMap,
      emissive: initialDarkMode ? 0xffcf7a : 0x000000,
      emissiveMap: initialDarkMode ? skyPbr.darkEmissiveMap : null,
      emissiveIntensity: initialDarkMode ? 1.32 : 0.0,
      roughness: initialDarkMode ? 0.32 : 0.2,
      metalness: initialDarkMode ? 0.28 : 0.34,
      clearcoat: 0.68,
      clearcoatRoughness: 0.12,
      reflectivity: 0.78,
    })
  );
  applyGroundAO(towerMat, 8.0, 0.24);

  // Material 2: Warm Honed Limestone, Sandstone & Bronze-Window Neo-Deco / Terraced Towers
  const limestoneTowerMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      map: initialDarkMode ? limestoneTowerPbr.darkMap : limestoneTowerPbr.lightMap,
      normalMap: limestoneTowerPbr.normalMap,
      normalScale: new THREE.Vector2(0.78, 0.78),
      roughnessMap: limestoneTowerPbr.roughnessMap,
      emissive: initialDarkMode ? 0xffc66e : 0x000000,
      emissiveMap: initialDarkMode ? limestoneTowerPbr.darkEmissiveMap : null,
      emissiveIntensity: initialDarkMode ? 1.25 : 0.0,
      roughness: initialDarkMode ? 0.56 : 0.52,
      metalness: initialDarkMode ? 0.16 : 0.12,
      clearcoat: 0.22,
      clearcoatRoughness: 0.32,
    })
  );
  applyGroundAO(limestoneTowerMat, 8.0, 0.26);

  // Material 3: Smoked Bronze-Obsidian & Champagne-Steel Sculpted Landmark Towers
  const bronzeGlassTowerMat = track(
    new THREE.MeshPhysicalMaterial({
      color: initialDarkMode ? 0xd8c3b0 : 0xc2d0de,
      map: initialDarkMode ? skyPbr.darkMap : skyPbr.lightMap,
      normalMap: skyPbr.normalMap,
      normalScale: new THREE.Vector2(0.75, 0.75),
      roughnessMap: skyPbr.roughnessMap,
      emissive: initialDarkMode ? 0xffbb5c : 0x000000,
      emissiveMap: initialDarkMode ? skyPbr.darkEmissiveMap : null,
      emissiveIntensity: initialDarkMode ? 1.38 : 0.0,
      roughness: initialDarkMode ? 0.24 : 0.18,
      metalness: initialDarkMode ? 0.44 : 0.48,
      clearcoat: 0.85,
      clearcoatRoughness: 0.08,
      reflectivity: 0.9,
    })
  );
  applyGroundAO(bronzeGlassTowerMat, 8.0, 0.24);

  const rooftopMat = track(
    new THREE.MeshStandardMaterial({
      color: initialDarkMode ? 0x22273a : 0x8ea3ba,
      roughness: 0.46,
      metalness: 0.58,
    })
  );
  // Warm golden-amber sunset crown accents in Dark Mode / crisp architectural steel-blue accents in Day Mode
  const archLedMat = track(
    new THREE.MeshStandardMaterial({
      color: initialDarkMode ? 0xffe29a : 0xcbdcf0,
      emissive: initialDarkMode ? 0xffa838 : 0x38bdf8,
      emissiveIntensity: initialDarkMode ? 2.2 : 0.12,
      roughness: 0.14,
      metalness: 0.28,
    })
  );
  const aviationBeaconMat = track(
    new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xef4444,
      emissiveIntensity: initialDarkMode ? 2.4 : 0.0,
    })
  );

  const towerSlots: {
    x: number;
    z: number;
    w: number;
    h: number;
    d: number;
    yaw: number;
    dayFacadeHex: number;
    nightFacadeHex: number;
    archetype: 'stepped' | 'stone_deco' | 'curved' | 'terraced' | 'diagonal' | 'twisted' | 'crystal';
  }[] = [];

  let seed = 9047;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  // Original Realistic Architectural Skyline Tints (Glacier Glass, Pearl Limestone, Warm Travertine, Smoked Slate, Terracotta Sand, Silver-Blue)
  const realDayTowerTints = [0xd8ebff, 0xf2ebe0, 0xc3ddf6, 0xe8dfd0, 0xb8d4f0, 0xdce4ee];
  const realNightTowerTints = [0xbcd2ee, 0xd9c7b8, 0xa8bfe2, 0xc9b5a8, 0xb2c4e0, 0xc8bbd0];

  for (let gx = -142; gx <= 142; gx += 19) {
    for (let gz = -145; gz <= 165; gz += 19) {
      // Clear out Expanded Residential Crescent (R=58 around (0,-7.5))
      if (Math.hypot(gx, gz + 7.5) < 58) continue;
      // Clear out Main Royal Boulevard + Mid-Rise Tech Podium Zone
      if (Math.abs(gx) < 31 && gz > -20 && gz < 175) continue;
      // Clear out Shimmering River Canal & Embankments (z = 36 to 72)
      if (gz > 35 && gz < 73) continue;
      // Clear out East-West Cross Streets
      if (Math.abs(gz - 27) < 10 || Math.abs(gz - 86) < 10 || Math.abs(gz - 126) < 10) continue;

      const jitterX = (rand() - 0.5) * 4.2;
      const jitterZ = (rand() - 0.5) * 4.2;
      const w = 8.2 + rand() * 8.4;
      const d = 8.2 + rand() * 8.4;
      const distFactor = Math.min(1, Math.hypot(gx, gz) / 108);
      // Taller financial skyline cluster in Downtown (z > 75) and dramatic backdrop behind the crescent (z < -65)
      const zoneBoost = gz > 75 ? 1.24 : gz < -65 ? 0.96 : 0.74;
      const h = (22 + rand() * 66 * (0.52 + distFactor * 0.8)) * zoneBoost;
      const tintIdx = Math.floor(rand() * realDayTowerTints.length);
      const roll = rand();
      const archetype: (typeof towerSlots)[number]['archetype'] =
        roll < 0.22
          ? 'stone_deco'
          : roll < 0.38 && h > 32
            ? 'curved'
            : roll < 0.54
              ? 'terraced'
              : roll < 0.65 && h > 44
                ? 'twisted'
                : roll < 0.76 && h > 40
                  ? 'crystal'
                  : roll < 0.86 && h > 34
                    ? 'diagonal'
                    : 'stepped';

      towerSlots.push({
        x: gx + jitterX,
        z: gz + jitterZ,
        w,
        h,
        d,
        yaw: (Math.floor(rand() * 4) * Math.PI) / 2,
        dayFacadeHex: realDayTowerTints[tintIdx],
        nightFacadeHex: realNightTowerTints[tintIdx],
        archetype,
      });
    }
  }

  const steppedSlots = towerSlots
    .filter((s) => s.archetype === 'stepped')
    .slice(0, quality.cityTowerCount);
  const stoneDecoSlots = towerSlots.filter((s) => s.archetype === 'stone_deco').slice(0, 34);
  const curvedSlots = towerSlots.filter((s) => s.archetype === 'curved').slice(0, 26);
  const terracedSlots = towerSlots.filter((s) => s.archetype === 'terraced').slice(0, 28);
  const diagSlots = towerSlots.filter((s) => s.archetype === 'diagonal').slice(0, 22);
  const twistedSlots = towerSlots.filter((s) => s.archetype === 'twisted').slice(0, 14);
  const crystalSlots = towerSlots.filter((s) => s.archetype === 'crystal').slice(0, 16);

  const podiumsMesh = new THREE.InstancedMesh(podiumGeo, podiumMat, Math.max(1, steppedSlots.length));
  const towersMesh = new THREE.InstancedMesh(towerGeo, towerMat, Math.max(1, steppedSlots.length));
  const setbacksMesh = new THREE.InstancedMesh(
    setbackGeo,
    towerMat,
    Math.max(1, steppedSlots.length)
  );
  const parapetsMesh = new THREE.InstancedMesh(
    parapetGeo,
    rooftopMat,
    Math.max(1, steppedSlots.length)
  );
  const crownHalosMesh = new THREE.InstancedMesh(
    crownHaloGeo,
    archLedMat,
    Math.max(1, steppedSlots.length)
  );
  const helipadsMesh = new THREE.InstancedMesh(
    helipadRingGeo,
    archLedMat,
    Math.max(1, steppedSlots.length)
  );
  const hvacsMesh = new THREE.InstancedMesh(hvacGeo, rooftopMat, Math.max(1, steppedSlots.length));
  const spiresMesh = new THREE.InstancedMesh(spireGeo, rooftopMat, Math.max(1, steppedSlots.length));
  const beaconsMesh = new THREE.InstancedMesh(
    beaconGeo,
    aviationBeaconMat,
    Math.max(1, steppedSlots.length)
  );

  towersMesh.receiveShadow = quality.shadowsEnabled;
  podiumsMesh.receiveShadow = quality.shadowsEnabled;

  for (let i = 0; i < steppedSlots.length; i++) {
    const s = steppedSlots[i];
    const podiumH = Math.min(5.2, s.h * 0.14);
    const mainH = s.h * 0.8;
    const setbackH = s.h * 0.2;
    const totalH = mainH + setbackH;

    _vDummy.position.set(s.x, 0, s.z);
    _vDummy.rotation.set(0, 0, 0);
    _vDummy.scale.set(s.w, podiumH, s.d);
    _vDummy.updateMatrix();
    podiumsMesh.setMatrixAt(i, _vDummy.matrix);

    _vDummy.scale.set(s.w, mainH, s.d);
    _vDummy.updateMatrix();
    towersMesh.setMatrixAt(i, _vDummy.matrix);

    _vDummy.position.set(s.x, mainH, s.z);
    _vDummy.scale.set(s.w, setbackH, s.d);
    _vDummy.updateMatrix();
    setbacksMesh.setMatrixAt(i, _vDummy.matrix);

    _vDummy.position.set(s.x, totalH, s.z);
    _vDummy.scale.set(s.w, 6.0, s.d);
    _vDummy.updateMatrix();
    parapetsMesh.setMatrixAt(i, _vDummy.matrix);

    // Crisp luminous architectural crown accent ring on flagship stepped towers
    const hasCrownHalo = i % 2 === 0 && s.h > 34;
    _vDummy.position.set(s.x, totalH + 0.58, s.z);
    _vDummy.scale.set(hasCrownHalo ? s.w : 0.001, hasCrownHalo ? 2.4 : 0.001, hasCrownHalo ? s.d : 0.001);
    _vDummy.updateMatrix();
    crownHalosMesh.setMatrixAt(i, _vDummy.matrix);

    // Rooftop illuminated helipad ring on prominent flat-top towers (amazing in the Whole-City Aerial Overlook!)
    const hasHelipad = i % 3 === 1 && s.h > 30;
    _vDummy.position.set(s.x, totalH + 0.78, s.z);
    _vDummy.scale.set(hasHelipad ? s.w : 0.001, 1, hasHelipad ? s.d : 0.001);
    _vDummy.updateMatrix();
    helipadsMesh.setMatrixAt(i, _vDummy.matrix);

    _vDummy.position.set(s.x + s.w * 0.14, totalH + 0.55, s.z - s.d * 0.14);
    _vDummy.scale.set(hasHelipad ? 0.001 : s.w, hasHelipad ? 0.001 : 1, hasHelipad ? 0.001 : s.d);
    _vDummy.updateMatrix();
    hvacsMesh.setMatrixAt(i, _vDummy.matrix);

    const hasSpire = i % 4 === 0 && s.h > 38;
    _vDummy.position.set(s.x, totalH + 0.55, s.z);
    _vDummy.scale.set(1, hasSpire ? 1 : 0.001, 1);
    _vDummy.updateMatrix();
    spiresMesh.setMatrixAt(i, _vDummy.matrix);

    _vDummy.position.set(s.x, totalH + 7.05, s.z);
    _vDummy.scale.setScalar(hasSpire ? 1 : 0.001);
    _vDummy.updateMatrix();
    beaconsMesh.setMatrixAt(i, _vDummy.matrix);

    _tempColor.setHex(initialDarkMode ? s.nightFacadeHex : s.dayFacadeHex);
    towersMesh.setColorAt(i, _tempColor);
    setbacksMesh.setColorAt(i, _tempColor);
  }
  [
    podiumsMesh,
    towersMesh,
    setbacksMesh,
    parapetsMesh,
    crownHalosMesh,
    helipadsMesh,
    hvacsMesh,
    spiresMesh,
    beaconsMesh,
  ].forEach((m) => {
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
    m.computeBoundingSphere();
  });
  group.add(
    podiumsMesh,
    towersMesh,
    setbacksMesh,
    parapetsMesh,
    crownHalosMesh,
    helipadsMesh,
    hvacsMesh,
    spiresMesh,
    beaconsMesh
  );

  // Diagonal-Crown Modern Glass Landmarks
  const diagTowersMesh = new THREE.InstancedMesh(
    diagCrownGeo,
    towerMat,
    Math.max(1, diagSlots.length)
  );
  for (let i = 0; i < diagSlots.length; i++) {
    const s = diagSlots[i];
    _vDummy.position.set(s.x, 0, s.z);
    _vDummy.rotation.set(0, s.yaw, 0);
    _vDummy.scale.set(s.w * 1.05, s.h * 1.08, s.d * 1.05);
    _vDummy.updateMatrix();
    diagTowersMesh.setMatrixAt(i, _vDummy.matrix);
    _tempColor.setHex(initialDarkMode ? s.nightFacadeHex : s.dayFacadeHex);
    diagTowersMesh.setColorAt(i, _tempColor);
  }
  if (diagSlots.length === 0) {
    _vDummy.scale.setScalar(0.001);
    _vDummy.updateMatrix();
    diagTowersMesh.setMatrixAt(0, _vDummy.matrix);
  }
  diagTowersMesh.instanceMatrix.needsUpdate = true;
  if (diagTowersMesh.instanceColor) diagTowersMesh.instanceColor.needsUpdate = true;
  diagTowersMesh.computeBoundingSphere();
  group.add(diagTowersMesh);

  // Sculpted Parametrically Twisting Futuristic Sapphire Supertall Landmarks!
  const twistedTowersMesh = new THREE.InstancedMesh(
    twistedTowerGeo,
    towerMat,
    Math.max(1, twistedSlots.length)
  );
  for (let i = 0; i < twistedSlots.length; i++) {
    const s = twistedSlots[i];
    _vDummy.position.set(s.x, 0, s.z);
    _vDummy.rotation.set(0, s.yaw, 0);
    _vDummy.scale.set(s.w * 1.08, s.h * 1.18, s.d * 1.08);
    _vDummy.updateMatrix();
    twistedTowersMesh.setMatrixAt(i, _vDummy.matrix);
    _tempColor.setHex(initialDarkMode ? s.nightFacadeHex : s.dayFacadeHex);
    twistedTowersMesh.setColorAt(i, _tempColor);
  }
  if (twistedSlots.length === 0) {
    _vDummy.scale.setScalar(0.001);
    _vDummy.updateMatrix();
    twistedTowersMesh.setMatrixAt(0, _vDummy.matrix);
  }
  twistedTowersMesh.instanceMatrix.needsUpdate = true;
  if (twistedTowersMesh.instanceColor) twistedTowersMesh.instanceColor.needsUpdate = true;
  twistedTowersMesh.computeBoundingSphere();
  group.add(twistedTowersMesh);

  // Crystalline Faceted Tapered Glass Spire Landmarks!
  const crystalTowersMesh = new THREE.InstancedMesh(
    crystalTowerGeo,
    towerMat,
    Math.max(1, crystalSlots.length)
  );
  const crystalSpiresMesh = new THREE.InstancedMesh(
    spireGeo,
    rooftopMat,
    Math.max(1, crystalSlots.length)
  );
  for (let i = 0; i < crystalSlots.length; i++) {
    const s = crystalSlots[i];
    const rad = (s.w + s.d) * 0.56;
    _vDummy.position.set(s.x, 0, s.z);
    _vDummy.rotation.set(0, s.yaw, 0);
    _vDummy.scale.set(rad, s.h * 1.16, rad);
    _vDummy.updateMatrix();
    crystalTowersMesh.setMatrixAt(i, _vDummy.matrix);

    _vDummy.position.set(s.x, s.h * 1.16 * 1.04, s.z);
    _vDummy.scale.set(1.2, 1.35, 1.2);
    _vDummy.updateMatrix();
    crystalSpiresMesh.setMatrixAt(i, _vDummy.matrix);

    _tempColor.setHex(initialDarkMode ? s.nightFacadeHex : s.dayFacadeHex);
    crystalTowersMesh.setColorAt(i, _tempColor);
  }
  if (crystalSlots.length === 0) {
    _vDummy.scale.setScalar(0.001);
    _vDummy.updateMatrix();
    crystalTowersMesh.setMatrixAt(0, _vDummy.matrix);
    crystalSpiresMesh.setMatrixAt(0, _vDummy.matrix);
  }
  [crystalTowersMesh, crystalSpiresMesh].forEach((m) => {
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
    m.computeBoundingSphere();
  });
  group.add(crystalTowersMesh, crystalSpiresMesh);

  // 5A-2. NEW ARCHITECTURAL VARIETY: Warm Limestone Neo-Deco Towers, Curved Glass Drum Landmarks & Biophilic Terraced Sky-Garden Towers!
  const stoneDecoMesh = new THREE.InstancedMesh(
    artDecoTowerGeo,
    limestoneTowerMat,
    Math.max(1, stoneDecoSlots.length)
  );
  for (let i = 0; i < stoneDecoSlots.length; i++) {
    const s = stoneDecoSlots[i];
    _vDummy.position.set(s.x, 0, s.z);
    _vDummy.rotation.set(0, s.yaw, 0);
    _vDummy.scale.set(s.w * 1.06, s.h * 1.04, s.d * 1.06);
    _vDummy.updateMatrix();
    stoneDecoMesh.setMatrixAt(i, _vDummy.matrix);
    _tempColor.setHex(initialDarkMode ? s.nightFacadeHex : s.dayFacadeHex);
    stoneDecoMesh.setColorAt(i, _tempColor);
  }
  if (stoneDecoSlots.length === 0) {
    _vDummy.scale.setScalar(0.001);
    _vDummy.updateMatrix();
    stoneDecoMesh.setMatrixAt(0, _vDummy.matrix);
  }
  stoneDecoMesh.instanceMatrix.needsUpdate = true;
  if (stoneDecoMesh.instanceColor) stoneDecoMesh.instanceColor.needsUpdate = true;
  stoneDecoMesh.computeBoundingSphere();

  // Curved Elliptical Smoked-Bronze & Champagne-Steel Glass Drum Towers
  const curvedTowersMesh = new THREE.InstancedMesh(
    curvedDrumGeo,
    bronzeGlassTowerMat,
    Math.max(1, curvedSlots.length)
  );
  for (let i = 0; i < curvedSlots.length; i++) {
    const s = curvedSlots[i];
    const rad = (s.w + s.d) * 0.54;
    _vDummy.position.set(s.x, 0, s.z);
    _vDummy.rotation.set(0, s.yaw + 0.35, 0);
    _vDummy.scale.set(rad, s.h * 1.12, rad);
    _vDummy.updateMatrix();
    curvedTowersMesh.setMatrixAt(i, _vDummy.matrix);
    _tempColor.setHex(initialDarkMode ? s.nightFacadeHex : s.dayFacadeHex);
    curvedTowersMesh.setColorAt(i, _tempColor);
  }
  if (curvedSlots.length === 0) {
    _vDummy.scale.setScalar(0.001);
    _vDummy.updateMatrix();
    curvedTowersMesh.setMatrixAt(0, _vDummy.matrix);
  }
  curvedTowersMesh.instanceMatrix.needsUpdate = true;
  if (curvedTowersMesh.instanceColor) curvedTowersMesh.instanceColor.needsUpdate = true;
  curvedTowersMesh.computeBoundingSphere();

  // Biophilic Terraced Sky-Garden Concrete & Glass Towers (with Emerald Planted Mid-Rise Terraces!)
  const terracedTowersMesh = new THREE.InstancedMesh(
    terracedTowerGeo,
    limestoneTowerMat,
    Math.max(1, terracedSlots.length)
  );
  const skyGardenMat = track(
    new THREE.MeshStandardMaterial({
      color: initialDarkMode ? 0x264424 : 0x52a634,
      roughness: 0.85,
      metalness: 0.02,
    })
  );
  const skyGardenGeo = track(new THREE.BoxGeometry(0.95, 0.75, 0.92));
  const skyGardensMesh = new THREE.InstancedMesh(
    skyGardenGeo,
    skyGardenMat,
    Math.max(1, terracedSlots.length * 2)
  );
  for (let i = 0; i < terracedSlots.length; i++) {
    const s = terracedSlots[i];
    _vDummy.position.set(s.x, 0, s.z);
    _vDummy.rotation.set(0, s.yaw, 0);
    _vDummy.scale.set(s.w * 1.05, s.h * 0.96, s.d * 1.05);
    _vDummy.updateMatrix();
    terracedTowersMesh.setMatrixAt(i, _vDummy.matrix);
    _tempColor.setHex(initialDarkMode ? s.nightFacadeHex : s.dayFacadeHex);
    terracedTowersMesh.setColorAt(i, _tempColor);

    // Emerald sky-garden foliage pads sitting cleanly atop setback ledges
    _vDummy.position.set(s.x, s.h * 0.96 * 0.37, s.z);
    _vDummy.scale.set(s.w * 1.02, 1.35, s.d * 0.96);
    _vDummy.updateMatrix();
    skyGardensMesh.setMatrixAt(i * 2, _vDummy.matrix);

    _vDummy.position.set(s.x, s.h * 0.96 * 0.69, s.z);
    _vDummy.scale.set(s.w * 0.84, 1.25, s.d * 0.84);
    _vDummy.updateMatrix();
    skyGardensMesh.setMatrixAt(i * 2 + 1, _vDummy.matrix);
  }
  if (terracedSlots.length === 0) {
    _vDummy.scale.setScalar(0.001);
    _vDummy.updateMatrix();
    terracedTowersMesh.setMatrixAt(0, _vDummy.matrix);
    skyGardensMesh.setMatrixAt(0, _vDummy.matrix);
  }
  [terracedTowersMesh, skyGardensMesh].forEach((m) => {
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
    m.computeBoundingSphere();
  });
  group.add(stoneDecoMesh, curvedTowersMesh, terracedTowersMesh, skyGardensMesh);

  // Iconic Left-Waterfront Stepped Supertall Spire Landmark Cluster
  // Positioned cleanly at x = -54, z = 96 (100% clear of the camera path & boulevard!)
  const heroSpireGroup = new THREE.Group();
  heroSpireGroup.position.set(-54, 0, 96);
  const heroTier1 = new THREE.Mesh(track(new THREE.BoxGeometry(16, 78, 15)), towerMat);
  heroTier1.position.set(0, 39, 0);
  const heroTier2 = new THREE.Mesh(track(new THREE.BoxGeometry(11.8, 22, 11.4)), towerMat);
  heroTier2.position.set(0.8, 89, 0.4);
  const heroTier3 = new THREE.Mesh(track(new THREE.BoxGeometry(7.2, 13, 7.2)), towerMat);
  heroTier3.position.set(0.8, 106.5, 0.4);
  const heroCrownBand = new THREE.Mesh(track(new THREE.BoxGeometry(7.5, 0.85, 7.5)), archLedMat);
  heroCrownBand.position.set(0.8, 112.8, 0.4);
  const heroSpireMast = new THREE.Mesh(track(new THREE.CylinderGeometry(0.14, 0.72, 22, 10)), rooftopMat);
  heroSpireMast.position.set(0.8, 124, 0.4);
  const heroSpireTip = new THREE.Mesh(track(new THREE.SphereGeometry(0.52, 10, 10)), archLedMat);
  heroSpireTip.position.set(0.8, 135.2, 0.4);
  // Flanking sleek bronze-glass corporate tower right beside the supertall spire
  const flankingTower = new THREE.Mesh(track(new THREE.BoxGeometry(15, 92, 13.5)), bronzeGlassTowerMat);
  flankingTower.position.set(-22, 46, 6);
  const flankingCrown = new THREE.Mesh(track(new THREE.BoxGeometry(15.3, 1.4, 13.8)), rooftopMat);
  flankingCrown.position.set(-22, 92.7, 6);
  heroSpireGroup.add(
    heroTier1,
    heroTier2,
    heroTier3,
    heroCrownBand,
    heroSpireMast,
    heroSpireTip,
    flankingTower,
    flankingCrown
  );

  // Right-Waterfront Sculpted Twin-Sail Curved Glass & Limestone Architectural Landmark (x = 58, z = 104)
  const eastLandmarkGroup = new THREE.Group();
  eastLandmarkGroup.position.set(58, 0, 104);
  const eastTowerA = new THREE.Mesh(track(new THREE.CylinderGeometry(6.8, 9.2, 94, 24)), bronzeGlassTowerMat);
  eastTowerA.scale.set(1.25, 1, 0.76);
  eastTowerA.position.set(0, 47, 0);
  const eastCrownA = new THREE.Mesh(track(new THREE.TorusGeometry(6.9, 0.42, 12, 32)), archLedMat);
  eastCrownA.rotation.x = Math.PI / 2;
  eastCrownA.scale.set(1.25, 0.76, 1);
  eastCrownA.position.set(0, 93.5, 0);
  const eastTowerB = new THREE.Mesh(track(new THREE.BoxGeometry(13.5, 68, 12.5)), limestoneTowerMat);
  eastTowerB.position.set(18, 34, 8);
  const eastTopB = new THREE.Mesh(track(new THREE.BoxGeometry(9.6, 14, 9.2)), limestoneTowerMat);
  eastTopB.position.set(18, 75, 8);
  const eastCrownB = new THREE.Mesh(track(new THREE.BoxGeometry(9.9, 0.65, 9.5)), archLedMat);
  eastCrownB.position.set(18, 82.2, 8);
  eastLandmarkGroup.add(eastTowerA, eastCrownA, eastTowerB, eastTopB, eastCrownB);
  group.add(heroSpireGroup, eastLandmarkGroup);

  // ===========================================================================
  // 5B. FUTURISTIC SIGNATURE LANDMARKS: TWIN-TOWER GLAZED SKYBRIDGES WITH 3D TITANIUM FINS
  // ===========================================================================
  const skybridgeFrameMat = track(
    new THREE.MeshPhysicalMaterial({
      color: initialDarkMode ? 0x1d2b44 : 0xd5e2f0,
      roughness: 0.18,
      metalness: 0.88,
      clearcoat: 0.92,
      clearcoatRoughness: 0.03,
    })
  );
  const skybridgeGlassMat = track(
    new THREE.MeshPhysicalMaterial({
      color: initialDarkMode ? 0x2a66a8 : 0x5ca6e6,
      roughness: 0.03,
      metalness: 0.3,
      transparent: true,
      opacity: 0.76,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
    })
  );

  // Twin-Tower Sapphire Gateway Skybridges dramatically framing the downtown boulevard canyon!
  const gatewaySpecs: { z: number; h: number; bridgeY: number }[] = [
    { z: 108, h: 68, bridgeY: 31 },
    { z: 144, h: 86, bridgeY: 44 },
  ];
  gatewaySpecs.forEach(({ z, h, bridgeY }) => {
    [-33, 33].forEach((gx) => {
      const twinTower = new THREE.Mesh(track(new THREE.BoxGeometry(13.5, h, 13.5)), towerMat);
      twinTower.position.set(gx, h * 0.5, z);
      twinTower.receiveShadow = quality.shadowsEnabled;
      group.add(twinTower);

      // 3D Projecting Brushed-Titanium Exterior Structural Corner Fins & Vertical Brise-Soleil Ribs!
      const finH = h + 1.8;
      for (let f = -5.4; f <= 5.45; f += 3.6) {
        const finFront = new THREE.Mesh(
          track(new THREE.BoxGeometry(0.32, finH, 0.72)),
          skybridgeFrameMat
        );
        finFront.position.set(gx + f, finH * 0.5, z + 6.95);
        const finBack = finFront.clone();
        finBack.position.set(gx + f, finH * 0.5, z - 6.95);
        const finSide = new THREE.Mesh(
          track(new THREE.BoxGeometry(0.72, finH, 0.32)),
          skybridgeFrameMat
        );
        finSide.position.set(gx + (gx < 0 ? 6.95 : -6.95), finH * 0.5, z + f);
        group.add(finFront, finBack, finSide);
      }

      // Architectural luminous glacier-blue crown halo bands around the supertall summit
      const crownRing = new THREE.Mesh(
        track(new THREE.BoxGeometry(14.3, 0.65, 14.3)),
        archLedMat
      );
      crownRing.position.set(gx, h - 1.1, z);
      const midHalo = new THREE.Mesh(
        track(new THREE.BoxGeometry(14.1, 0.32, 14.1)),
        archLedMat
      );
      midHalo.position.set(gx, h * 0.62, z);
      group.add(crownRing, midHalo);

      // Sculpted terraced titanium rooftop crown & twin pinnacle spires
      const topCap = new THREE.Mesh(track(new THREE.BoxGeometry(11.4, 2.4, 11.4)), rooftopMat);
      topCap.position.set(gx, h + 1.2, z);
      const upperDeck = new THREE.Mesh(track(new THREE.BoxGeometry(8.2, 2.2, 8.2)), towerMat);
      upperDeck.position.set(gx, h + 3.4, z);
      const needle = new THREE.Mesh(
        track(new THREE.CylinderGeometry(0.08, 0.36, 15, 10)),
        skybridgeFrameMat
      );
      needle.position.set(gx, h + 11.2, z);
      group.add(topCap, upperDeck, needle);
    });

    // Sleek Glazed Architectural Skybridge spanning East-West high above the boulevard
    const bridgeDeck = new THREE.Mesh(
      track(new THREE.BoxGeometry(53.5, 0.78, 6.2)),
      skybridgeFrameMat
    );
    bridgeDeck.position.set(0, bridgeY, z);
    const bridgeRoof = new THREE.Mesh(
      track(new THREE.BoxGeometry(53.5, 0.55, 6.4)),
      skybridgeFrameMat
    );
    bridgeRoof.position.set(0, bridgeY + 4.2, z);
    const bridgeGlass = new THREE.Mesh(
      track(new THREE.BoxGeometry(52.8, 3.6, 5.4)),
      skybridgeGlassMat
    );
    bridgeGlass.position.set(0, bridgeY + 2.1, z);
    const bridgeLedUnder = new THREE.Mesh(
      track(new THREE.BoxGeometry(52.4, 0.22, 0.28)),
      archLedMat
    );
    bridgeLedUnder.position.set(0, bridgeY - 0.42, z + 2.85);
    const bridgeLedBack = new THREE.Mesh(
      track(new THREE.BoxGeometry(52.4, 0.22, 0.28)),
      archLedMat
    );
    bridgeLedBack.position.set(0, bridgeY - 0.42, z - 2.85);
    group.add(bridgeDeck, bridgeRoof, bridgeGlass, bridgeLedUnder, bridgeLedBack);

    // Structural external titanium diagonal truss ribs along the skybridge
    for (let rx = -22; rx <= 22; rx += 5.5) {
      const rib = new THREE.Mesh(track(new THREE.BoxGeometry(0.28, 4.3, 6.5)), skybridgeFrameMat);
      rib.position.set(rx, bridgeY + 2.1, z);
      group.add(rib);
    }
  });

  // Subtle architectural LED accent trims along the Multi-Arch River Bridge parapets
  [-8.6, 8.6].forEach((ax) => {
    const strip = new THREE.Mesh(track(new THREE.BoxGeometry(0.16, 0.16, 26.0)), archLedMat);
    strip.position.set(ax, 1.82, 54);
    group.add(strip);
  });

  // ===========================================================================
  // 5C. ARCHITECTURAL NEXUS WATERFRONT PAVILION & VOLUMETRIC ATMOSPHERIC SUN-SHAFTS
  // (Clean car-free & rail-free scenic skyline — zero moving trains, cars, or air-taxis!)
  // ===========================================================================

  // 1) Iconic Sculpted Parametric "Nexus" Torus/Oval Waterfront Pavilion (x=34.5, z=70.5)
  const nexusGroup = new THREE.Group();
  nexusGroup.position.set(34.5, 0.2, 70.5);
  nexusGroup.rotation.y = -0.32;

  const nexusPlinth = new THREE.Mesh(
    track(new THREE.CylinderGeometry(11.6, 12.6, 1.35, 40)),
    fountainBasaltMat
  );
  nexusPlinth.position.y = 0.68;
  nexusPlinth.receiveShadow = quality.shadowsEnabled;

  const nexusDeck = new THREE.Mesh(
    track(new THREE.CylinderGeometry(10.8, 11.1, 0.35, 40)),
    plazaMat
  );
  nexusDeck.position.y = 1.48;
  nexusDeck.receiveShadow = quality.shadowsEnabled;

  // Sculpted Brushed-Titanium Parametric Torus Shell
  const nexusOuterShell = new THREE.Mesh(
    track(new THREE.TorusGeometry(8.2, 1.85, 24, 56)),
    skybridgeFrameMat
  );
  nexusOuterShell.scale.set(1.16, 1.24, 0.76);
  nexusOuterShell.position.y = 11.4;
  nexusOuterShell.castShadow = quality.shadowsEnabled;

  // Inner Curved Low-Iron Atrium Glazing Ring
  const nexusInnerGlass = new THREE.Mesh(
    track(new THREE.TorusGeometry(6.75, 0.92, 18, 48)),
    skybridgeGlassMat
  );
  nexusInnerGlass.scale.set(1.16, 1.24, 0.92);
  nexusInnerGlass.position.y = 11.4;

  // Recessed Architectural Light Halo along the Nexus Inner Rim
  const nexusHaloRing = new THREE.Mesh(
    track(new THREE.TorusGeometry(6.35, 0.14, 12, 48)),
    archLedMat
  );
  nexusHaloRing.scale.set(1.16, 1.24, 1.0);
  nexusHaloRing.position.y = 11.4;

  // Sweeping Cantilevered Waterfront Observation Fin
  const nexusOverlook = new THREE.Mesh(
    track(new THREE.BoxGeometry(16.8, 0.55, 4.4)),
    skybridgeFrameMat
  );
  nexusOverlook.position.set(0, 3.1, 4.2);
  const nexusOverlookGlass = new THREE.Mesh(
    track(new THREE.BoxGeometry(16.4, 1.15, 0.12)),
    waterfrontGlassMat
  );
  nexusOverlookGlass.position.set(0, 3.9, 6.32);

  nexusGroup.add(
    nexusPlinth,
    nexusDeck,
    nexusOuterShell,
    nexusInnerGlass,
    nexusHaloRing,
    nexusOverlook,
    nexusOverlookGlass
  );
  group.add(nexusGroup);

  // 2) Subtle Volumetric Atmospheric Sun-Shafts / Light Beams cutting through the Downtown Canyon
  // (Zero modelMatrix in fragment shader; pure UV soft-beam falloff with AdditiveBlending!)
  const sunShaftUniforms = {
    uTime: { value: 0 },
    uIsDark: { value: initialDarkMode ? 1.0 : 0.0 },
  };
  const sunShaftMat = track(
    new THREE.ShaderMaterial({
      uniforms: sunShaftUniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uTime;
        uniform float uIsDark;
        varying vec2 vUv;
        void main() {
          float horiz = sin(vUv.x * 3.14159265);
          horiz = pow(max(0.0, horiz), 2.4);
          float vert = smoothstep(0.0, 0.34, vUv.y) * smoothstep(1.0, 0.22, vUv.y);
          float shimmer = 0.88 + 0.12 * sin(vUv.x * 9.0 + uTime * 0.45);
          vec3 dayBeam = vec3(1.0, 0.96, 0.86);
          vec3 nightBeam = vec3(1.0, 0.56, 0.24);
          vec3 col = mix(dayBeam, nightBeam, uIsDark);
          float alpha = horiz * vert * shimmer * mix(0.082, 0.088, uIsDark);
          gl_FragColor = vec4(col, alpha);
        }
      `,
    })
  );
  const sunShaftGeo = track(new THREE.PlaneGeometry(24, 96));
  const shaftSpecs: [number, number, number, number, number][] = [
    [-10, 44, 126, 0.24, -0.34],
    [12, 48, 100, -0.18, -0.32],
    [-4, 40, 74, 0.14, -0.3],
    [18, 52, 152, -0.26, -0.35],
  ];
  shaftSpecs.forEach(([sx, sy, sz, rotY, rotZ]) => {
    const beam = new THREE.Mesh(sunShaftGeo, sunShaftMat);
    beam.position.set(sx, sy, sz);
    beam.rotation.set(0, rotY, rotZ);
    beam.renderOrder = 2;
    group.add(beam);
  });

  // ===========================================================================
  // 6. SLEEK FUTURISTIC GLAZED COMMERCIAL & TECH PODIUMS + CONTEMPORARY RIVERSIDE PAVILIONS
  // Replaces legacy brick/mansard blocks with modern glass atriums, vertical fins & sky-gardens!
  // ===========================================================================
  const homeBodyMat = track(
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: claddingPbr.map,
      normalMap: claddingPbr.normalMap,
      normalScale: new THREE.Vector2(0.42, 0.42),
      roughnessMap: claddingPbr.roughnessMap,
      roughness: 0.66,
      metalness: 0.1,
    })
  );
  applyGroundAO(homeBodyMat, 3.2, 0.25);
  const homeRoofMat = track(
    new THREE.MeshPhysicalMaterial({
      color: initialDarkMode ? 0x1a2538 : 0x334155,
      roughness: 0.32,
      metalness: 0.72,
      clearcoat: 0.45,
    })
  );
  const homeTrimMat = track(
    new THREE.MeshStandardMaterial({
      color: initialDarkMode ? 0x26344a : 0xeef3f8,
      roughness: 0.52,
      metalness: 0.18,
    })
  );
  const homeDoorMat = track(
    new THREE.MeshStandardMaterial({
      color: 0x4b3120,
      map: woodPbr.map,
      normalMap: woodPbr.normalMap,
      roughness: 0.44,
      metalness: 0.12,
    })
  );
  const homeWinMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      map: initialDarkMode ? winTex.nightMap : winTex.dayMap,
      emissive: initialDarkMode ? 0xffe5bd : 0x000000,
      emissiveMap: initialDarkMode ? winTex.nightEmissiveMap : null,
      emissiveIntensity: initialDarkMode ? 0.94 : 0.0,
      roughness: 0.05,
      metalness: 0.22,
      clearcoat: 1.0,
      envMapIntensity: 1.85,
    })
  );
  const storefrontAwningMat = track(
    new THREE.MeshPhysicalMaterial({
      color: initialDarkMode ? 0x1a2436 : 0x29374b,
      roughness: 0.24,
      metalness: 0.84,
      clearcoat: 0.65,
    })
  );

  // Build Sleek Modern Double-Height Glass-Atrium Tech & Luxury Retail Podiums along Downtown Avenue
  const terraceZs = [75, 99, 112, 138, 151];
  const terraceTintsDay = [0xe8f0f8, 0xd8e5f2, 0xf1f5fa, 0xcadbee, 0xe2ebf5];
  const terraceTintsNight = [0x1b2942, 0x152238, 0x20314e, 0x17253c, 0x1d2d48];
  const terraceWallMats: { mat: THREE.MeshStandardMaterial; day: number; night: number }[] = [];

  terraceZs.forEach((tz, tIdx) => {
    [-20.5, 20.5].forEach((tx, side) => {
      const faceSign = side === 0 ? 1 : -1;
      const dayHex = terraceTintsDay[(tIdx + side) % terraceTintsDay.length];
      const nightHex = terraceTintsNight[(tIdx + side) % terraceTintsNight.length];
      const tMat = track(
        new THREE.MeshStandardMaterial({
          color: initialDarkMode ? nightHex : dayHex,
          map: claddingPbr.map,
          normalMap: claddingPbr.normalMap,
          normalScale: new THREE.Vector2(0.36, 0.36),
          roughnessMap: claddingPbr.roughnessMap,
          roughness: 0.62,
          metalness: 0.14,
        })
      );
      applyGroundAO(tMat, 4.4, 0.22);
      terraceWallMats.push({ mat: tMat, day: dayHex, night: nightHex });

      const bldg = new THREE.Group();
      bldg.position.set(tx, 0, tz);

      // Recessed Ground-Floor Dark Basalt Base + Double-Height Illuminated Glass Showroom Gallery
      const gfBase = new THREE.Mesh(track(new THREE.BoxGeometry(10.6, 4.4, 11.4)), fountainBasaltMat);
      gfBase.position.y = 2.2;
      gfBase.castShadow = quality.shadowsEnabled;
      gfBase.receiveShadow = quality.shadowsEnabled;

      const shopWin = new THREE.Mesh(track(new THREE.BoxGeometry(0.28, 3.6, 9.8)), homeWinMat);
      shopWin.position.set(faceSign * 5.32, 2.05, 0);

      // Cantilevered Dark Titanium & Teak Entry Canopy with Subtle Luminous Rim Strip
      const canopy = new THREE.Mesh(
        track(new THREE.BoxGeometry(2.6, 0.24, 11.6)),
        storefrontAwningMat
      );
      canopy.position.set(faceSign * 6.35, 4.35, 0);
      canopy.castShadow = quality.shadowsEnabled;
      const canopyLed = new THREE.Mesh(track(new THREE.BoxGeometry(0.08, 0.07, 11.2)), archLedMat);
      canopyLed.position.set(faceSign * 7.62, 4.25, 0);

      // Cantilevered Upper Contemporary Curtain-Wall & Stone Architectural Volume
      const upper = new THREE.Mesh(track(new THREE.BoxGeometry(11.4, 9.4, 11.6)), tMat);
      upper.position.set(faceSign * 0.3, 9.1, 0);
      upper.castShadow = quality.shadowsEnabled;
      upper.receiveShadow = quality.shadowsEnabled;

      // Full-Height Modern Panoramic Glazed Curtain-Wall Bays facing the Boulevard
      [6.8, 10.8].forEach((wy) => {
        const ribbonGlass = new THREE.Mesh(track(new THREE.BoxGeometry(0.18, 2.9, 10.2)), homeWinMat);
        ribbonGlass.position.set(faceSign * 6.02, wy, 0);
        bldg.add(ribbonGlass);
      });

      // 3D Projecting Vertical Brushed-Titanium Brise-Soleil Architectural Fins!
      for (let fz = -4.6; fz <= 4.65; fz += 2.3) {
        const fin = new THREE.Mesh(
          track(new THREE.BoxGeometry(0.45, 9.6, 0.16)),
          storefrontAwningMat
        );
        fin.position.set(faceSign * 6.18, 9.1, fz);
        fin.castShadow = quality.shadowsEnabled;
        bldg.add(fin);
      }

      // Crisp Cantilevered Roof Crown + Planted Rooftop Sky-Garden Terrace & Frameless Glass Rail!
      const roofCrown = new THREE.Mesh(
        track(new THREE.BoxGeometry(12.2, 0.44, 12.2)),
        storefrontAwningMat
      );
      roofCrown.position.set(faceSign * 0.3, 14.0, 0);
      const roofGarden = new THREE.Mesh(track(new THREE.BoxGeometry(9.6, 0.25, 9.8)), parkGrassMat);
      roofGarden.position.set(faceSign * 0.2, 14.3, 0);
      const roofGlassRail = new THREE.Mesh(
        track(new THREE.BoxGeometry(0.08, 0.95, 11.4)),
        waterfrontGlassMat
      );
      roofGlassRail.position.set(faceSign * 6.05, 14.7, 0);
      const roofLed = new THREE.Mesh(track(new THREE.BoxGeometry(0.12, 0.12, 12.1)), archLedMat);
      roofLed.position.set(faceSign * 6.36, 13.86, 0);

      bldg.add(gfBase, shopWin, canopy, canopyLed, upper, roofCrown, roofGarden, roofGlassRail, roofLed);
      group.add(bldg);
    });
  });

  // Sleek Contemporary Cantilevered Pavilions flanking the Riverside Transition Boulevard (z = 16 to 38)
  const homeBodyGeo = track(new THREE.BoxGeometry(6.8, 4.75, 6.1));
  homeBodyGeo.translate(0, 2.375, 0);
  const homeRoofGeo = track(createModernPavilionRoofGeometry());
  const homeChimneyGeo = track(new THREE.BoxGeometry(6.95, 0.26, 6.25));
  homeChimneyGeo.translate(0, 2.48, 0);
  const homePorchGeo = track(new THREE.BoxGeometry(3.2, 0.22, 1.65));
  homePorchGeo.translate(0, 2.68, 3.55);
  const homeDoorGeo = track(new THREE.BoxGeometry(1.32, 2.42, 0.14));
  homeDoorGeo.translate(0, 1.21, 3.08);
  const homeWinGeo = track(new THREE.BoxGeometry(2.15, 1.65, 0.12));

  const homeWallDayColors = [0xf2f5f9, 0xdce6f2, 0xe8edf3, 0xcad7e6, 0xf6f7fa, 0xd4dfe9];
  const homeWallNightColors = [0x263348, 0x1d293c, 0x2b3950, 0x1a2638, 0x243146, 0x202d42];
  const homeRoofColors = [0x1e293b, 0x273549, 0x1a2434, 0x243247, 0x1c2738, 0x223045];

  const suburbCoords: [number, number, number][] = [
    [-21.5, 16.5, Math.PI / 2],
    [21.5, 16.5, -Math.PI / 2],
    [-21.5, 36.2, Math.PI / 2],
    [21.5, 36.2, -Math.PI / 2],
    [-36.5, 16.5, 0],
    [36.5, 16.5, 0],
    [-36.5, 36.2, Math.PI],
    [36.5, 36.2, Math.PI],
    [-51.0, 16.5, 0],
    [51.0, 16.5, 0],
    [-51.0, 36.2, Math.PI],
    [51.0, 36.2, Math.PI],
  ];

  const subLimit = Math.min(quality.suburbHouseCount, suburbCoords.length);
  const subBodies = new THREE.InstancedMesh(homeBodyGeo, homeBodyMat, subLimit);
  const subRoofs = new THREE.InstancedMesh(homeRoofGeo, homeRoofMat, subLimit);
  const subChimneys = new THREE.InstancedMesh(homeChimneyGeo, homeRoofMat, subLimit);
  const subPorches = new THREE.InstancedMesh(homePorchGeo, homeTrimMat, subLimit);
  const subDoors = new THREE.InstancedMesh(homeDoorGeo, homeDoorMat, subLimit);
  const subWins = new THREE.InstancedMesh(homeWinGeo, homeWinMat, subLimit * 4);

  subBodies.castShadow = quality.shadowsEnabled;
  subBodies.receiveShadow = quality.shadowsEnabled;
  subRoofs.castShadow = quality.shadowsEnabled;

  for (let i = 0; i < subLimit; i++) {
    const [sx, sz, syaw] = suburbCoords[i];
    const hScale = 0.94 + (i % 3) * 0.08;

    _vDummy.position.set(sx, 0, sz);
    _vDummy.rotation.set(0, syaw, 0);
    _vDummy.scale.set(1, hScale, 1);
    _vDummy.updateMatrix();
    subBodies.setMatrixAt(i, _vDummy.matrix);
    subRoofs.setMatrixAt(i, _vDummy.matrix);
    subChimneys.setMatrixAt(i, _vDummy.matrix);
    subPorches.setMatrixAt(i, _vDummy.matrix);
    subDoors.setMatrixAt(i, _vDummy.matrix);

    const cIdx = i % homeWallDayColors.length;
    _tempColor.setHex(initialDarkMode ? homeWallNightColors[cIdx] : homeWallDayColors[cIdx]);
    subBodies.setColorAt(i, _tempColor);

    _tempColor.setHex(homeRoofColors[cIdx]);
    subRoofs.setColorAt(i, _tempColor);
    subChimneys.setColorAt(i, _tempColor);

    const sinY = Math.sin(syaw);
    const cosY = Math.cos(syaw);
    const winLocalOffsets: [number, number][] = [
      [-2.0, 1.38],
      [2.0, 1.38],
      [-1.75, 3.65],
      [1.75, 3.65],
    ];
    for (let wIdx = 0; wIdx < 4; wIdx++) {
      const [lx, ly] = winLocalOffsets[wIdx];
      const wx = sx + lx * cosY + 3.08 * sinY;
      const wz = sz - lx * sinY + 3.08 * cosY;
      _vDummy.position.set(wx, ly * hScale, wz);
      _vDummy.rotation.set(0, syaw, 0);
      _vDummy.scale.set(1, 1, 1);
      _vDummy.updateMatrix();
      subWins.setMatrixAt(i * 4 + wIdx, _vDummy.matrix);
    }
  }
  [subBodies, subRoofs, subChimneys, subPorches, subDoors, subWins].forEach((m) => {
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
    m.computeBoundingSphere();
  });
  group.add(subBodies, subRoofs, subChimneys, subPorches, subDoors, subWins);

  // ===========================================================================
  // 7. ARCHITECTURAL STREETLAMPS & WARM NIGHTTIME GROUND LIGHT POOLS
  // ===========================================================================
  const poleBaseGeo = track(new THREE.CylinderGeometry(0.16, 0.22, 0.54, 10));
  poleBaseGeo.translate(0, 0.27, 0);
  const poleGeo = track(new THREE.CylinderGeometry(0.065, 0.105, 5.2, 10));
  poleGeo.translate(0, 2.6, 0);
  const armGeo = track(new THREE.BoxGeometry(1.34, 0.08, 0.11));
  const poleMat = track(
    new THREE.MeshStandardMaterial({
      color: initialDarkMode ? 0x262c36 : 0x3b424c,
      roughness: 0.36,
      metalness: 0.84,
    })
  );
  const lampHeadGeo = track(new THREE.BoxGeometry(0.58, 0.13, 0.24));
  const streetLightsMat = track(
    new THREE.MeshStandardMaterial({
      color: initialDarkMode ? 0xffe4a0 : 0xf1f5f9,
      emissive: initialDarkMode ? 0xffae38 : 0x000000,
      emissiveIntensity: initialDarkMode ? 2.65 : 0.0,
      roughness: 0.14,
      metalness: 0.12,
    })
  );
  const lightPoolGeo = track(new THREE.PlaneGeometry(8.2, 8.2));
  lightPoolGeo.rotateX(-Math.PI / 2);
  const lightPoolMat = track(
    new THREE.MeshBasicMaterial({
      map: lightPoolTex,
      color: initialDarkMode ? 0xffb84d : 0xffffff,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: initialDarkMode ? 0.62 : 0.0,
    })
  );

  const lampPositions: [number, number, number][] = [];
  // Main Royal Boulevard lamps (skip river water)
  for (let z = 18; z <= 146; z += 16) {
    if (z > 40 && z < 68) continue;
    lampPositions.push([-9.1, z, 1]);
    lampPositions.push([9.1, z, -1]);
  }
  // Dense Golden Riverside Promenade Embankment Lamps lining BOTH banks (matching reference sunset photo!)
  for (let rx = -108; rx <= 108; rx += 12) {
    if (Math.abs(rx) < 14) continue;
    lampPositions.push([rx, 42.2, 0]);
    lampPositions.push([rx, 65.8, 0]);
  }
  // Central Fountain Park Crescent Lanterns (placed along R=11.9 inner curb, cleanly clear of camera R=16.0!)
  for (let a = 0; a < 8; a++) {
    const ang = (a / 8) * Math.PI * 2 + Math.PI / 8;
    lampPositions.push([Math.sin(ang) * 11.9, -7.5 + Math.cos(ang) * 11.9, 0]);
  }

  const poleBasesInst = new THREE.InstancedMesh(poleBaseGeo, poleMat, lampPositions.length);
  const polesInst = new THREE.InstancedMesh(poleGeo, poleMat, lampPositions.length);
  const armsInst = new THREE.InstancedMesh(armGeo, poleMat, lampPositions.length);
  const headsInst = new THREE.InstancedMesh(lampHeadGeo, streetLightsMat, lampPositions.length);
  const poolsInst = new THREE.InstancedMesh(lightPoolGeo, lightPoolMat, lampPositions.length);

  for (let i = 0; i < lampPositions.length; i++) {
    const [lx, lz, dirX] = lampPositions[i];
    const isParkOrRiver = dirX === 0;
    const scaleY = isParkOrRiver ? 0.68 : 1;
    const baseY = lz > 41 && lz < 67 ? 0.92 : 0.12;

    _vDummy.position.set(lx, baseY, lz);
    _vDummy.rotation.set(0, 0, 0);
    _vDummy.scale.set(1, 1, 1);
    _vDummy.updateMatrix();
    poleBasesInst.setMatrixAt(i, _vDummy.matrix);

    _vDummy.scale.set(1, scaleY, 1);
    _vDummy.updateMatrix();
    polesInst.setMatrixAt(i, _vDummy.matrix);

    _vDummy.position.set(lx + dirX * 0.54, baseY + 5.12 * scaleY, lz);
    _vDummy.scale.set(isParkOrRiver ? 0.01 : 1, 1, 1);
    _vDummy.updateMatrix();
    armsInst.setMatrixAt(i, _vDummy.matrix);

    _vDummy.position.set(lx + dirX * 0.98, baseY + 5.05 * scaleY, lz);
    _vDummy.scale.set(isParkOrRiver ? 0.72 : 1, 1, isParkOrRiver ? 0.72 : 1);
    _vDummy.updateMatrix();
    headsInst.setMatrixAt(i, _vDummy.matrix);

    _vDummy.position.set(lx + dirX * 1.15, baseY + 0.08, lz);
    _vDummy.scale.setScalar(isParkOrRiver ? 0.8 : 1.08);
    _vDummy.updateMatrix();
    poolsInst.setMatrixAt(i, _vDummy.matrix);
  }
  [poleBasesInst, polesInst, armsInst, headsInst, poolsInst].forEach((m) => {
    m.instanceMatrix.needsUpdate = true;
    m.computeBoundingSphere();
  });
  group.add(poleBasesInst, polesInst, armsInst, headsInst, poolsInst);

  // ===========================================================================
  // 8. PHOTOREALISTIC BOTANICAL ALPHA-TESTED MULTI-CARD OAK & BEECH TREES
  // Replaces low-poly blobby icosahedron spheres with authentic leafy silhouettes & dappled shadows!
  // ===========================================================================
  const leafClusterTex = track(createBotanicalLeafClusterTexture(maxAnisotropy));
  const treeSkeletonGeo = track(createTreeSkeletonGeometry());
  const botanicalCrownGeo = track(createBotanicalCrownGeometry());

  const trunkMat = track(
    new THREE.MeshStandardMaterial({
      color: 0x4d3a2c,
      map: woodPbr.map,
      normalMap: woodPbr.normalMap,
      roughness: 0.94,
      metalness: 0.01,
    })
  );
  applyGroundAO(trunkMat, 1.8, 0.28);

  const canopyMat = track(
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: leafClusterTex,
      alphaTest: 0.42,
      side: THREE.DoubleSide,
      roughness: 0.88,
      metalness: 0.0,
    })
  );
  const canopyDepthMat = track(
    new THREE.MeshDepthMaterial({
      depthPacking: THREE.RGBADepthPacking,
      map: leafClusterTex,
      alphaTest: 0.42,
      side: THREE.DoubleSide,
    })
  );

  const treeSlots: [number, number, number][] = [];
  // 1) Framing estate trees nestled cleanly in the garden gaps BETWEEN the 6 Service Houses!
  const gapAnglesDeg = [-83, -54.5, -27.5, 0, 27.5, 54.5, 83];
  gapAnglesDeg.forEach((deg, idx) => {
    const rad = (deg * Math.PI) / 180;
    const rDist = 37.8;
    treeSlots.push([Math.sin(rad) * rDist, -7.5 - Math.cos(rad) * rDist, 1.04 + (idx % 3) * 0.14]);
  });
  // 2) Outer lush woodland backdrop behind the 6 Service Houses (R=49..53)
  for (let i = 0; i < 18; i++) {
    const ang = -Math.PI * 0.65 + (i / 17) * Math.PI * 1.3;
    const rDist = 50.0 + (i % 3) * 3.4;
    treeSlots.push([Math.sin(ang) * rDist, -7.5 - Math.cos(ang) * rDist, 1.12 + (i % 4) * 0.15]);
  }
  // 3) Boulevard parkway street trees (skip river span)
  for (let z = 19; z <= 144; z += 15) {
    if (z > 39 && z < 69) continue;
    treeSlots.push([-12.6, z, 0.96 + ((z * 7) % 5) * 0.06]);
    treeSlots.push([12.6, z, 0.96 + ((z * 3) % 5) * 0.06]);
  }
  // 4) Dense Lush Emerald Riverside Parkland Trees lining BOTH river embankments (matching reference photos!)
  for (let rx = -112; rx <= 112; rx += 11) {
    if (Math.abs(rx) < 15) continue;
    const sc1 = 1.06 + ((Math.abs(rx) * 3) % 5) * 0.08;
    const sc2 = 1.02 + ((Math.abs(rx) * 5) % 5) * 0.08;
    treeSlots.push([rx, 37.8, sc1]);
    treeSlots.push([rx + 4.5, 70.4, sc2]);
  }

  const treeCount = Math.min(Math.max(quality.treeCount + 28, 120), treeSlots.length);
  const trunksInst = new THREE.InstancedMesh(treeSkeletonGeo, trunkMat, treeCount);
  const canopyInst = new THREE.InstancedMesh(botanicalCrownGeo, canopyMat, treeCount);

  trunksInst.castShadow = quality.shadowsEnabled;
  canopyInst.castShadow = quality.shadowsEnabled;
  canopyInst.receiveShadow = quality.shadowsEnabled;
  canopyInst.customDepthMaterial = canopyDepthMat;

  const paintTrees = (dark: boolean) => {
    // Vibrant sunlit emerald-green riverside foliage in Light Mode; rich warm twilight foliage in Sunset Mode
    const dayLeafTints = [0x50a92d, 0x64bc38, 0x3e9122, 0x74c642, 0x489e28];
    const nightLeafTints = [0x22301d, 0x2c3821, 0x1b2819, 0x2f3b22, 0x242e1b];
    for (let i = 0; i < treeCount; i++) {
      const palette = dark ? nightLeafTints : dayLeafTints;
      _tempColor.setHex(palette[i % palette.length]);
      canopyInst.setColorAt(i, _tempColor);
    }
    if (canopyInst.instanceColor) canopyInst.instanceColor.needsUpdate = true;
  };

  for (let i = 0; i < treeCount; i++) {
    const [tx, tz, ts] = treeSlots[i];
    _vDummy.position.set(tx, 0, tz);
    _vDummy.rotation.set(0, (i * 1.7) % (Math.PI * 2), 0);
    _vDummy.scale.set(ts, ts, ts);
    _vDummy.updateMatrix();
    trunksInst.setMatrixAt(i, _vDummy.matrix);
    canopyInst.setMatrixAt(i, _vDummy.matrix);
  }
  paintTrees(initialDarkMode);
  [trunksInst, canopyInst].forEach((m) => {
    m.instanceMatrix.needsUpdate = true;
    m.computeBoundingSphere();
  });
  group.add(trunksInst, canopyInst);

  // ===========================================================================
  // 9. CAR-FREE LANDSCAPED ARCHITECTURAL BOULEVARD MEDIANS & SCULPTURAL BOLLARDS
  // (Zero moving cars, buses, trains, or traffic — serene luxury European riverside promenade!)
  // ===========================================================================
  const medianPositionsZ = [78, 96, 114, 134, 152];
  medianPositionsZ.forEach((mz) => {
    const planterCurb = new THREE.Mesh(
      track(new THREE.BoxGeometry(2.1, 0.42, 11.5)),
      stoneCurbMat
    );
    planterCurb.position.set(0, 0.24, mz);
    planterCurb.receiveShadow = quality.shadowsEnabled;
    const planterHedge = new THREE.Mesh(
      track(new THREE.BoxGeometry(1.55, 0.55, 10.6)),
      skyGardenMat
    );
    planterHedge.position.set(0, 0.56, mz);
    const bollardNorth = new THREE.Mesh(
      track(new THREE.CylinderGeometry(0.14, 0.16, 0.95, 10)),
      poleMat
    );
    bollardNorth.position.set(0, 0.52, mz + 6.35);
    const bollardGlowN = new THREE.Mesh(
      track(new THREE.CylinderGeometry(0.145, 0.145, 0.16, 10)),
      streetLightsMat
    );
    bollardGlowN.position.set(0, 0.88, mz + 6.35);
    const bollardSouth = bollardNorth.clone();
    bollardSouth.position.set(0, 0.52, mz - 6.35);
    const bollardGlowS = bollardGlowN.clone();
    bollardGlowS.position.set(0, 0.88, mz - 6.35);
    group.add(planterCurb, planterHedge, bollardNorth, bollardGlowN, bollardSouth, bollardGlowS);
  });

  // Grounding Contact Shadow under Central Fountain
  const centerShadow = new THREE.Mesh(
    track(new THREE.PlaneGeometry(13.2, 13.2)),
    track(
      new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        depthWrite: false,
        opacity: initialDarkMode ? 0.45 : 0.26,
      })
    )
  );
  centerShadow.rotation.x = -Math.PI / 2;
  centerShadow.position.set(0, 0.37, -7.5);
  group.add(centerShadow);

  let isCurrentlyDark = initialDarkMode;

  // Zero-GC Per-Frame Living Architectural City Update (Water Ripples, Fountain Jets & Sky Beacons — Zero Vehicles!)
  const updateCity = (elapsedSeconds: number, _dt: number) => {
    waterUniforms.uTime.value = elapsedSeconds;
    sunShaftUniforms.uTime.value = elapsedSeconds;

    if (isCurrentlyDark) {
      aviationBeaconMat.emissiveIntensity = 1.6 + Math.sin(elapsedSeconds * 3.0) * 1.1;
    }

    const jetPulse = 0.985 + Math.sin(elapsedSeconds * 3.2) * 0.015;
    for (let j = 0; j < fountainJets.length; j++) {
      fountainJets[j].scale.y = jetPulse;
    }
  };
  updateCity(0, 0.016);

  const applyTheme = (isDark: boolean) => {
    isCurrentlyDark = isDark;
    waterUniforms.uIsDark.value = isDark ? 1.0 : 0.0;
    sunShaftUniforms.uIsDark.value = isDark ? 1.0 : 0.0;

    groundMat.map = isDark ? grassPbr.darkMap : grassPbr.lightMap;
    groundMat.needsUpdate = true;

    parkGrassMat.map = isDark ? parkGrassPbr.darkMap : parkGrassPbr.lightMap;
    parkGrassMat.needsUpdate = true;

    hillMat.color.setHex(isDark ? 0x26213e : 0x5c8459);
    urbanPadMat.color.setHex(isDark ? 0x1c1c28 : 0xc9cdd2);
    stoneCurbMat.color.setHex(isDark ? 0x454354 : 0xe8e2d8);
    benchWoodMat.color.setHex(isDark ? 0x6e4a2d : 0xa67346);

    plazaMat.map = isDark ? plazaPbr.darkMap : plazaPbr.lightMap;
    plazaMat.roughness = isDark ? 0.72 : 0.84;
    plazaMat.needsUpdate = true;

    crescentRoadMat.color.setHex(isDark ? 0x232431 : 0x525760);
    crescentRoadMat.roughness = isDark ? 0.62 : 0.86;
    crescentRoadMat.metalness = isDark ? 0.12 : 0.03;

    sidewalkMat.color.setHex(isDark ? 0x2d2e3d : 0xdcd9d1);
    bridgeSteelMat.color.setHex(isDark ? 0x2b3242 : 0x52657a);
    bridgeArchLightMat.color.setHex(isDark ? 0xffe49e : 0xeef3f8);
    bridgeArchLightMat.emissive.setHex(isDark ? 0xffb84d : 0x000000);
    bridgeArchLightMat.emissiveIntensity = isDark ? 2.35 : 0.0;
    boatHullMat.color.setHex(isDark ? 0x1e2536 : 0x29394f);
    boatCabinMat.color.setHex(isDark ? 0xd9dde6 : 0xf7f9fc);
    boatWindowMat.color.setHex(isDark ? 0xffd580 : 0x2d4e70);
    boatWindowMat.emissive.setHex(isDark ? 0xffa838 : 0x000000);
    boatWindowMat.emissiveIntensity = isDark ? 1.55 : 0.0;
    podiumMat.color.setHex(isDark ? 0x1d2236 : 0xd6e1ee);
    rooftopMat.color.setHex(isDark ? 0x22273a : 0x8ea3ba);
    homeRoofMat.color.setHex(isDark ? 0x1d2336 : 0x334155);
    homeTrimMat.color.setHex(isDark ? 0x2d3246 : 0xeef3f8);
    storefrontAwningMat.color.setHex(isDark ? 0x1e2234 : 0x29374b);
    fountainBasaltMat.color.setHex(isDark ? 0x181d2e : 0x2d3848);
    fountainHaloMat.color.setHex(isDark ? 0xffd580 : 0x7dd3fc);
    fountainHaloMat.emissive.setHex(isDark ? 0xffa73b : 0x38bdf8);
    fountainHaloMat.emissiveIntensity = isDark ? 2.15 : 0.2;
    waterfrontGlassMat.color.setHex(isDark ? 0x9ab4d6 : 0xcce6ff);
    poleMat.color.setHex(isDark ? 0x262836 : 0x3b424c);
    crosswalkMat.color.setHex(isDark ? 0xb8c4d4 : 0xf6f8fb);
    skybridgeFrameMat.color.setHex(isDark ? 0x25283d : 0xd5e2f0);
    skybridgeGlassMat.color.setHex(isDark ? 0x5c4d78 : 0x5ca6e6);
    archLedMat.color.setHex(isDark ? 0xffe29a : 0xcbdcf0);
    archLedMat.emissive.setHex(isDark ? 0xffa838 : 0x38bdf8);
    archLedMat.emissiveIntensity = isDark ? 2.2 : 0.12;
    skyGardenMat.color.setHex(isDark ? 0x264424 : 0x52a634);

    terraceWallMats.forEach((tw) => {
      tw.mat.color.setHex(isDark ? tw.night : tw.day);
    });

    waterMat.color.setHex(isDark ? 0x1a1c36 : 0x2a7bc8);

    roadMat.map = isDark ? roadPbr.darkMap : roadPbr.lightMap;
    roadMat.roughnessMap = isDark ? roadPbr.darkRoughnessMap : roadPbr.lightRoughnessMap;
    roadMat.metalness = isDark ? 0.14 : 0.03;
    roadMat.needsUpdate = true;

    towerMat.map = isDark ? skyPbr.darkMap : skyPbr.lightMap;
    towerMat.emissive.setHex(isDark ? 0xffcf7a : 0x000000);
    towerMat.emissiveMap = isDark ? skyPbr.darkEmissiveMap : null;
    towerMat.emissiveIntensity = isDark ? 1.32 : 0.0;
    towerMat.roughness = isDark ? 0.32 : 0.2;
    towerMat.metalness = isDark ? 0.28 : 0.34;
    towerMat.needsUpdate = true;

    limestoneTowerMat.map = isDark ? limestoneTowerPbr.darkMap : limestoneTowerPbr.lightMap;
    limestoneTowerMat.emissive.setHex(isDark ? 0xffc66e : 0x000000);
    limestoneTowerMat.emissiveMap = isDark ? limestoneTowerPbr.darkEmissiveMap : null;
    limestoneTowerMat.emissiveIntensity = isDark ? 1.25 : 0.0;
    limestoneTowerMat.roughness = isDark ? 0.56 : 0.52;
    limestoneTowerMat.metalness = isDark ? 0.16 : 0.12;
    limestoneTowerMat.needsUpdate = true;

    bronzeGlassTowerMat.color.setHex(isDark ? 0xd8c3b0 : 0xc2d0de);
    bronzeGlassTowerMat.map = isDark ? skyPbr.darkMap : skyPbr.lightMap;
    bronzeGlassTowerMat.emissive.setHex(isDark ? 0xffbb5c : 0x000000);
    bronzeGlassTowerMat.emissiveMap = isDark ? skyPbr.darkEmissiveMap : null;
    bronzeGlassTowerMat.emissiveIntensity = isDark ? 1.38 : 0.0;
    bronzeGlassTowerMat.needsUpdate = true;

    aviationBeaconMat.emissiveIntensity = isDark ? 2.4 : 0.0;

    for (let i = 0; i < steppedSlots.length; i++) {
      const s = steppedSlots[i];
      _tempColor.setHex(isDark ? s.nightFacadeHex : s.dayFacadeHex);
      towersMesh.setColorAt(i, _tempColor);
      setbacksMesh.setColorAt(i, _tempColor);
    }
    if (towersMesh.instanceColor) towersMesh.instanceColor.needsUpdate = true;
    if (setbacksMesh.instanceColor) setbacksMesh.instanceColor.needsUpdate = true;

    for (let i = 0; i < stoneDecoSlots.length; i++) {
      const s = stoneDecoSlots[i];
      _tempColor.setHex(isDark ? s.nightFacadeHex : s.dayFacadeHex);
      stoneDecoMesh.setColorAt(i, _tempColor);
    }
    if (stoneDecoMesh.instanceColor) stoneDecoMesh.instanceColor.needsUpdate = true;

    for (let i = 0; i < curvedSlots.length; i++) {
      const s = curvedSlots[i];
      _tempColor.setHex(isDark ? s.nightFacadeHex : s.dayFacadeHex);
      curvedTowersMesh.setColorAt(i, _tempColor);
    }
    if (curvedTowersMesh.instanceColor) curvedTowersMesh.instanceColor.needsUpdate = true;

    for (let i = 0; i < terracedSlots.length; i++) {
      const s = terracedSlots[i];
      _tempColor.setHex(isDark ? s.nightFacadeHex : s.dayFacadeHex);
      terracedTowersMesh.setColorAt(i, _tempColor);
    }
    if (terracedTowersMesh.instanceColor) terracedTowersMesh.instanceColor.needsUpdate = true;

    for (let i = 0; i < diagSlots.length; i++) {
      const s = diagSlots[i];
      _tempColor.setHex(isDark ? s.nightFacadeHex : s.dayFacadeHex);
      diagTowersMesh.setColorAt(i, _tempColor);
    }
    if (diagTowersMesh.instanceColor) diagTowersMesh.instanceColor.needsUpdate = true;

    for (let i = 0; i < twistedSlots.length; i++) {
      const s = twistedSlots[i];
      _tempColor.setHex(isDark ? s.nightFacadeHex : s.dayFacadeHex);
      twistedTowersMesh.setColorAt(i, _tempColor);
    }
    if (twistedTowersMesh.instanceColor) twistedTowersMesh.instanceColor.needsUpdate = true;

    for (let i = 0; i < crystalSlots.length; i++) {
      const s = crystalSlots[i];
      _tempColor.setHex(isDark ? s.nightFacadeHex : s.dayFacadeHex);
      crystalTowersMesh.setColorAt(i, _tempColor);
    }
    if (crystalTowersMesh.instanceColor) crystalTowersMesh.instanceColor.needsUpdate = true;

    for (let i = 0; i < subLimit; i++) {
      const cIdx = i % homeWallDayColors.length;
      _tempColor.setHex(isDark ? homeWallNightColors[cIdx] : homeWallDayColors[cIdx]);
      subBodies.setColorAt(i, _tempColor);
    }
    if (subBodies.instanceColor) subBodies.instanceColor.needsUpdate = true;

    homeWinMat.map = isDark ? winTex.nightMap : winTex.dayMap;
    homeWinMat.emissive.setHex(isDark ? 0xffd27a : 0x000000);
    homeWinMat.emissiveMap = isDark ? winTex.nightEmissiveMap : null;
    homeWinMat.emissiveIntensity = isDark ? 1.12 : 0.0;
    homeWinMat.needsUpdate = true;

    streetLightsMat.color.setHex(isDark ? 0xffe4a0 : 0xf1f5f9);
    streetLightsMat.emissive.setHex(isDark ? 0xffae38 : 0x000000);
    streetLightsMat.emissiveIntensity = isDark ? 2.65 : 0.0;
    lightPoolMat.color.setHex(isDark ? 0xffb84d : 0xffffff);
    lightPoolMat.opacity = isDark ? 0.62 : 0.0;

    sigRedMat.emissiveIntensity = isDark ? 1.65 : 0.65;
    sigGreenMat.emissiveIntensity = isDark ? 1.65 : 0.65;

    (centerShadow.material as THREE.MeshBasicMaterial).opacity = isDark ? 0.45 : 0.26;

    paintTrees(isDark);
  };

  return {
    group,
    updateCity,
    applyTheme,
    dispose: () => {
      disposables.forEach((d) => d.dispose());
    },
  };
}

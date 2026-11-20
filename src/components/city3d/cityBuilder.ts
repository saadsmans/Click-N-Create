import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { QualityProfile } from './types.ts';
import {
  createSkyscraperPbrSet,
  createPlazaStonePbrSet,
  createBoulevardRoadPbrSet,
  createArchitecturalCladdingPbr,
  createNaturalGrassPbrSet,
  createWoodGrainPbrSet,
  createResidentialWindowTextures,
  createCarHeadlightBeamTexture,
  createContactShadowTexture,
  createLightPoolTexture,
  createBotanicalLeafClusterTexture,
  applyGroundAO,
} from './proceduralTextures.ts';

interface VehicleTrack {
  axis: 'x' | 'z';
  laneOffset: number;
  yElevation: number;
  startPos: number;
  span: number;
  minCoord: number;
  speed: number;
  dir: 1 | -1;
  paintHex: number;
  kind: 'sedan' | 'suv' | 'bus';
  isParked?: boolean;
}

export interface CityBuildResult {
  group: THREE.Group;
  updateCity: (elapsedSeconds: number, dt: number) => void;
  applyTheme: (isDark: boolean) => void;
  dispose: () => void;
}

// Reusable module-scoped scratch helpers (Zero GC inside render loop)
const _vDummy = new THREE.Object3D();
const _wDummy = new THREE.Object3D();
const _tempColor = new THREE.Color();

/**
 * Sculpts an ultra-realistic aerodynamic luxury EV fastback sedan/SUV body (+Z forward)
 * with low aero nose, crisp hood crease, swept fastback roofline & integrated rear lip spoiler.
 */
function createSculptedCarBodyGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(-2.12, 0.24);
  shape.lineTo(2.14, 0.22);
  shape.quadraticCurveTo(2.24, 0.34, 2.18, 0.56);
  shape.quadraticCurveTo(2.08, 0.74, 1.62, 0.8);
  shape.lineTo(0.86, 0.88);
  shape.quadraticCurveTo(0.42, 1.28, 0.14, 1.37);
  shape.quadraticCurveTo(-0.44, 1.44, -1.08, 1.32);
  shape.lineTo(-1.74, 0.94);
  shape.lineTo(-2.1, 0.9);
  shape.quadraticCurveTo(-2.22, 0.64, -2.12, 0.24);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 1.7,
    bevelEnabled: true,
    bevelThickness: 0.09,
    bevelSize: 0.065,
    bevelSegments: 3,
    curveSegments: 10,
  });
  geo.translate(0, 0, -0.85);
  geo.rotateY(-Math.PI / 2);
  geo.computeVertexNormals();
  return geo;
}

/**
 * Sculpts matching flush panoramic dark-tinted automotive greenhouse & glass roof.
 */
function createSculptedCarGlassGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(-1.62, 0.91);
  shape.lineTo(0.8, 0.86);
  shape.quadraticCurveTo(0.38, 1.24, 0.12, 1.32);
  shape.quadraticCurveTo(-0.44, 1.38, -1.04, 1.27);
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 1.76,
    bevelEnabled: true,
    bevelThickness: 0.04,
    bevelSize: 0.03,
    bevelSegments: 2,
    curveSegments: 8,
  });
  geo.translate(0, 0, -0.88);
  geo.rotateY(-Math.PI / 2);
  geo.computeVertexNormals();
  return geo;
}

/**
 * Sculpts a sleek aerodynamic futuristic panoramic-glass electric city coach (+Z forward).
 */
function createAerodynamicCoachBodyGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(-4.45, 0.38);
  shape.lineTo(4.35, 0.36);
  shape.quadraticCurveTo(4.68, 0.56, 4.56, 1.28);
  shape.quadraticCurveTo(4.36, 2.55, 3.82, 3.12);
  shape.lineTo(-4.15, 3.14);
  shape.quadraticCurveTo(-4.52, 3.05, -4.55, 2.55);
  shape.lineTo(-4.52, 0.72);
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 2.28,
    bevelEnabled: true,
    bevelThickness: 0.12,
    bevelSize: 0.09,
    bevelSegments: 3,
    curveSegments: 10,
  });
  geo.translate(0, 0, -1.14);
  geo.rotateY(-Math.PI / 2);
  geo.computeVertexNormals();
  return geo;
}

/**
 * Sculpts matching wrap-around panoramic glass band for the futuristic electric city coach.
 */
function createAerodynamicCoachGlassGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(-4.26, 1.22);
  shape.lineTo(4.36, 1.18);
  shape.quadraticCurveTo(4.18, 2.38, 3.74, 2.86);
  shape.lineTo(-4.24, 2.88);
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 2.38,
    bevelEnabled: true,
    bevelThickness: 0.04,
    bevelSize: 0.03,
    bevelSegments: 2,
    curveSegments: 8,
  });
  geo.translate(0, 0, -1.19);
  geo.rotateY(-Math.PI / 2);
  geo.computeVertexNormals();
  return geo;
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
  const plazaPbr = track(createPlazaStonePbrSet(maxAnisotropy));
  const roadPbr = track(createBoulevardRoadPbrSet(maxAnisotropy));
  const claddingPbr = track(createArchitecturalCladdingPbr(maxAnisotropy));
  const grassPbr = track(createNaturalGrassPbrSet(maxAnisotropy, 44, 44));
  const parkGrassPbr = track(createNaturalGrassPbrSet(maxAnisotropy, 5, 5));
  const woodPbr = track(createWoodGrainPbrSet(maxAnisotropy));
  const winTex = track(createResidentialWindowTextures(maxAnisotropy));
  const headlightBeamTex = track(createCarHeadlightBeamTexture());
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
      color: initialDarkMode ? 0x101622 : 0x62745e,
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
      color: initialDarkMode ? 0xbae6fd : 0x7dd3fc,
      emissive: 0x38bdf8,
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
      envMapIntensity: 1.95,
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

  // Animated Physical Rippling Water Material (Shared by Fountain Basin & City River Canal!)
  const waterUniforms = {
    uTime: { value: 0 },
    uIsDark: { value: initialDarkMode ? 1.0 : 0.0 },
  };
  const waterMat = track(
    new THREE.MeshPhysicalMaterial({
      color: initialDarkMode ? 0x0b1f34 : 0x1e4d6b,
      roughness: 0.05,
      metalness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      reflectivity: 1.0,
      envMapIntensity: 1.95,
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
          float w1 = sin(wp.x * 0.95 + uTime * 1.65) * cos(wp.y * 1.45 - uTime * 1.35);
          float w2 = cos(wp.x * 2.1 - wp.y * 1.8 + uTime * 2.1);
          normal = normalize(normal + vec3((w1 + w2 * 0.5) * 0.08, 0.0, (w2 - w1 * 0.5) * 0.08));`
        )
        .replace(
          '#include <color_fragment>',
          `#include <color_fragment>
          vec2 cp = vWaterWorldPos.xz;
          float rDist = length(cp - vec2(0.0, -7.5));
          float ripple = sin(cp.x * 1.4 + uTime * 1.9) * cos(cp.y * 1.7 - uTime * 1.5) * 0.5 + 0.5;
          float shimmer = smoothstep(0.66, 0.98, ripple);
          float splashRing = exp(-pow((rDist - 3.25) * 3.0, 2.0)) * step(rDist, 6.2);
          vec3 glintColor = mix(vec3(0.55, 0.76, 0.92), vec3(0.22, 0.42, 0.64), uIsDark);
          diffuseColor.rgb += glintColor * shimmer * 0.30 + vec3(0.84, 0.93, 0.99) * splashRing * 0.38;`
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
  // 3. SHIMMERING CITY RIVER CANAL, CANTILEVERED WATERFRONT PIERS & TIED-ARCH STEEL BRIDGE (z = 54)
  // ===========================================================================
  const riverWater = new THREE.Mesh(track(new THREE.PlaneGeometry(520, 22.5)), waterMat);
  riverWater.rotation.x = -Math.PI / 2;
  riverWater.position.set(0, 0.14, 54);
  group.add(riverWater);

  const waterfrontGlassMat = track(
    new THREE.MeshPhysicalMaterial({
      color: initialDarkMode ? 0x6ba8e5 : 0xcce6ff,
      roughness: 0.05,
      metalness: 0.2,
      transparent: true,
      opacity: 0.42,
      clearcoat: 1.0,
      envMapIntensity: 1.85,
    })
  );

  // Carved Stone & Basalt River Embankment Seawalls, Promenade Walkways, Glass Railings & Overlook Piers
  const embankmentWallGeo = track(new THREE.BoxGeometry(520, 1.45, 2.6));
  const promenadeGeo = track(new THREE.BoxGeometry(520, 0.22, 4.8));
  [41.6, 66.4].forEach((ez, sideIdx) => {
    const sign = sideIdx === 0 ? -1 : 1;
    const wall = new THREE.Mesh(embankmentWallGeo, fountainBasaltMat);
    wall.position.set(0, 0.45, ez);
    wall.receiveShadow = quality.shadowsEnabled;
    const prom = new THREE.Mesh(promenadeGeo, plazaMat);
    prom.position.set(0, 0.92, ez + sign * 2.2);
    prom.receiveShadow = quality.shadowsEnabled;
    group.add(wall, prom);

    // Sleek Architectural Glass & Brushed-Steel Waterfront Promenade Balustrades
    [-138, 138].forEach((segX) => {
      const rail = new THREE.Mesh(track(new THREE.BoxGeometry(250, 0.08, 0.12)), fountainChromeMat);
      rail.position.set(segX, 1.76, ez - sign * 0.95);
      const glassPanel = new THREE.Mesh(
        track(new THREE.BoxGeometry(250, 0.72, 0.05)),
        waterfrontGlassMat
      );
      glassPanel.position.set(segX, 1.38, ez - sign * 0.95);
      const curb = new THREE.Mesh(track(new THREE.BoxGeometry(250, 0.28, 0.36)), stoneCurbMat);
      curb.position.set(segX, 1.04, ez - sign * 0.95);
      group.add(rail, glassPanel, curb);
    });

    // Cantilevered Teak & Glass Waterfront Overlook Piers jutting gracefully out over the shimmering canal!
    [-52, -26, 26, 52].forEach((px) => {
      const pierDeck = new THREE.Mesh(track(new THREE.BoxGeometry(7.2, 0.26, 4.2)), benchWoodMat);
      pierDeck.position.set(px, 0.98, ez - sign * 2.55);
      pierDeck.receiveShadow = quality.shadowsEnabled;
      const pierRim = new THREE.Mesh(track(new THREE.BoxGeometry(7.35, 0.08, 0.1)), fountainHaloMat);
      pierRim.position.set(px, 0.86, ez - sign * 4.65);
      const pierRail = new THREE.Mesh(track(new THREE.BoxGeometry(7.2, 0.78, 0.06)), waterfrontGlassMat);
      pierRail.position.set(px, 1.48, ez - sign * 4.6);
      group.add(pierDeck, pierRim, pierRail);
    });
  });

  // Iconic Tied-Arch Steel & Concrete River Bridge carrying the Main Boulevard across the River (z = 40 to 68)
  const bridgeGroup = new THREE.Group();
  bridgeGroup.position.set(0, 0, 54);

  const bridgeSteelMat = track(
    new THREE.MeshPhysicalMaterial({
      color: initialDarkMode ? 0x263142 : 0x3b4d63,
      roughness: 0.34,
      metalness: 0.78,
      clearcoat: 0.35,
    })
  );

  // Bridge Deck + Raised Sidewalk Curbs spanning z = -15 to +15 across the canal
  const bridgeDeck = new THREE.Mesh(track(new THREE.BoxGeometry(21.4, 0.85, 29.6)), stoneCurbMat);
  bridgeDeck.position.set(0, 0.42, 0);
  bridgeDeck.receiveShadow = quality.shadowsEnabled;
  bridgeGroup.add(bridgeDeck);

  // Heavy Carved Stone Bridge Abutment Pylons at all 4 Corners of the River Span
  [
    [-10.2, -13.2],
    [10.2, -13.2],
    [-10.2, 13.2],
    [10.2, 13.2],
  ].forEach(([px, pz]) => {
    const pylon = new THREE.Mesh(track(new THREE.BoxGeometry(2.1, 4.2, 2.2)), stoneCurbMat);
    pylon.position.set(px, 2.1, pz);
    pylon.castShadow = quality.shadowsEnabled;
    const cap = new THREE.Mesh(track(new THREE.BoxGeometry(2.5, 0.36, 2.6)), stoneCurbMat);
    cap.position.set(px, 4.3, pz);
    bridgeGroup.add(pylon, cap);
  });

  // Twin Graceful Overhead Parabolic Tied-Steel Arches spanning lengthwise along the Boulevard!
  [-8.6, 8.6].forEach((ax) => {
    const archCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(ax, 1.2, -13.0),
      new THREE.Vector3(ax, 7.6, -6.5),
      new THREE.Vector3(ax, 9.8, 0),
      new THREE.Vector3(ax, 7.6, 6.5),
      new THREE.Vector3(ax, 1.2, 13.0),
    ]);
    const archMesh = new THREE.Mesh(
      track(new THREE.TubeGeometry(archCurve, 36, 0.34, 12, false)),
      bridgeSteelMat
    );
    archMesh.castShadow = quality.shadowsEnabled;
    bridgeGroup.add(archMesh);

    // Bridge side safety parapet
    const parapet = new THREE.Mesh(track(new THREE.BoxGeometry(0.45, 1.05, 26.2)), bridgeSteelMat);
    parapet.position.set(ax, 1.25, 0);
    bridgeGroup.add(parapet);

    // Vertical Suspension Hanger Rods connecting Arch to Road Deck
    for (let hz = -9.6; hz <= 9.65; hz += 2.4) {
      const tNorm = (hz + 13.0) / 26.0;
      const pt = archCurve.getPoint(tNorm);
      const len = Math.max(0.4, pt.y - 1.2);
      const hanger = new THREE.Mesh(
        track(new THREE.CylinderGeometry(0.055, 0.055, len, 8)),
        bridgeSteelMat
      );
      hanger.position.set(ax, 1.2 + len * 0.5, hz);
      bridgeGroup.add(hanger);
    }
  });

  // Overhead Steel Cross-Bracing Beams tying the Twin Arches together high above traffic!
  [-4.8, 0, 4.8].forEach((bz) => {
    const yArch = bz === 0 ? 9.65 : 8.55;
    const crossTie = new THREE.Mesh(
      track(new THREE.BoxGeometry(17.4, 0.36, 0.42)),
      bridgeSteelMat
    );
    crossTie.position.set(0, yArch, bz);
    crossTie.castShadow = quality.shadowsEnabled;
    bridgeGroup.add(crossTie);
  });
  group.add(bridgeGroup);

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
  const crownHaloGeo = track(new THREE.BoxGeometry(0.8, 0.16, 0.8));
  const helipadRingGeo = track(new THREE.RingGeometry(0.22, 0.28, 24));
  helipadRingGeo.rotateX(-Math.PI / 2);

  const podiumMat = track(
    new THREE.MeshStandardMaterial({
      color: initialDarkMode ? 0x162238 : 0xd6e1ee,
      map: claddingPbr.map,
      normalMap: claddingPbr.normalMap,
      normalScale: new THREE.Vector2(0.36, 0.36),
      roughnessMap: claddingPbr.roughnessMap,
      roughness: 0.62,
      metalness: 0.22,
    })
  );
  applyGroundAO(podiumMat, 4.6, 0.3);

  const towerMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      map: initialDarkMode ? skyPbr.darkMap : skyPbr.lightMap,
      normalMap: skyPbr.normalMap,
      normalScale: new THREE.Vector2(0.62, 0.62),
      roughnessMap: skyPbr.roughnessMap,
      emissive: initialDarkMode ? 0xdff2ff : 0x000000,
      emissiveMap: initialDarkMode ? skyPbr.darkEmissiveMap : null,
      emissiveIntensity: initialDarkMode ? 1.02 : 0.0,
      roughness: initialDarkMode ? 0.31 : 0.17,
      metalness: initialDarkMode ? 0.68 : 0.74,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      reflectivity: 1.0,
      envMapIntensity: initialDarkMode ? 2.18 : 2.58,
    })
  );
  applyGroundAO(towerMat, 8.0, 0.24);
  const rooftopMat = track(
    new THREE.MeshStandardMaterial({
      color: initialDarkMode ? 0x1a2740 : 0x8ea3ba,
      roughness: 0.46,
      metalness: 0.58,
    })
  );
  // Subtle crisp glacier-blue architectural LED crown & bridge accent strip (refined Dubai/Singapore realism)
  const archLedMat = track(
    new THREE.MeshStandardMaterial({
      color: initialDarkMode ? 0xbae6fd : 0xcbdcf0,
      emissive: 0x38bdf8,
      emissiveIntensity: initialDarkMode ? 2.15 : 0.14,
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
    archetype: 'stepped' | 'diagonal' | 'twisted' | 'crystal';
  }[] = [];

  let seed = 9047;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  // Cohesive Photorealistic Futuristic Sapphire, Glacier-Azure & Cobalt-Glass Skyscraper Tints
  const realDayTowerTints = [0xd4e8fc, 0xb8d9fa, 0xe2f0ff, 0xa2cbf5, 0xc7dff5, 0x8fbce8];
  const realNightTowerTints = [0xb6d4f5, 0x9fc2ea, 0xc9e0f8, 0x8fb7e3, 0xaecae8, 0x95bbe2];

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
      const archetype =
        roll < 0.14 && h > 44
          ? 'twisted'
          : roll < 0.28 && h > 40
            ? 'crystal'
            : roll < 0.46 && h > 34
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

  // ===========================================================================
  // 5B. FUTURISTIC SIGNATURE LANDMARKS: TWIN-TOWER GLAZED SKYBRIDGES WITH 3D TITANIUM FINS
  // & ELEVATED MAGLEV SKY-RAIL VIADUCT WITH ANIMATED AERODYNAMIC TRAIN!
  // ===========================================================================
  const skybridgeFrameMat = track(
    new THREE.MeshPhysicalMaterial({
      color: initialDarkMode ? 0x1d2b44 : 0xd5e2f0,
      roughness: 0.18,
      metalness: 0.88,
      clearcoat: 0.92,
      clearcoatRoughness: 0.03,
      envMapIntensity: 2.25,
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
      envMapIntensity: 2.48,
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

  // Subtle architectural LED accent trims along the Tied-Arch Steel River Bridge arches
  [-8.6, 8.6].forEach((ax) => {
    const strip = new THREE.Mesh(track(new THREE.BoxGeometry(0.16, 0.16, 26.0)), archLedMat);
    strip.position.set(ax, 1.82, 54);
    group.add(strip);
  });

  // Elevated Futuristic Maglev Sky-Rail Viaduct crossing East-West over Downtown (z = 94, y = 15.8)
  const maglevY = 15.8;
  const maglevZ = 94;
  const maglevGroup = new THREE.Group();
  const viaductBeam = new THREE.Mesh(
    track(new THREE.BoxGeometry(310, 1.45, 3.6)),
    skybridgeFrameMat
  );
  viaductBeam.position.set(0, maglevY, maglevZ);
  viaductBeam.castShadow = quality.shadowsEnabled;
  const viaductRailStrip = new THREE.Mesh(
    track(new THREE.BoxGeometry(310, 0.18, 3.74)),
    archLedMat
  );
  viaductRailStrip.position.set(0, maglevY + 0.55, maglevZ);
  maglevGroup.add(viaductBeam, viaductRailStrip);

  // Sculpted Y-shaped concrete-and-steel elevated support piers (cleanly outside the boulevard lanes!)
  for (let px = -126; px <= 126; px += 28) {
    if (Math.abs(px) < 16) continue;
    const pier = new THREE.Mesh(
      track(new THREE.CylinderGeometry(0.72, 0.96, maglevY - 0.5, 12)),
      podiumMat
    );
    pier.position.set(px, (maglevY - 0.5) * 0.5, maglevZ);
    pier.castShadow = quality.shadowsEnabled;
    const pierCap = new THREE.Mesh(
      track(new THREE.BoxGeometry(2.6, 1.1, 4.2)),
      skybridgeFrameMat
    );
    pierCap.position.set(px, maglevY - 0.9, maglevZ);
    maglevGroup.add(pier, pierCap);
  }

  // Animated 3-Car Aerodynamic Silver & Cobalt Maglev Express Train
  const maglevTrainGroup = new THREE.Group();
  maglevTrainGroup.position.set(0, maglevY + 0.78, maglevZ);
  const maglevBodyMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xe6f0fa,
      roughness: 0.14,
      metalness: 0.72,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      envMapIntensity: 1.9,
    })
  );
  const maglevCobaltMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0x1d4ed8,
      roughness: 0.18,
      metalness: 0.65,
      clearcoat: 1.0,
      envMapIntensity: 1.8,
    })
  );
  const maglevWindowMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0x0b172c,
      emissive: 0x7dd3fc,
      emissiveIntensity: initialDarkMode ? 0.55 : 0.06,
      roughness: 0.04,
      metalness: 0.35,
      clearcoat: 1.0,
    })
  );
  [-11.8, 0, 11.8].forEach((cx, idx) => {
    const carBody = new THREE.Mesh(track(new THREE.BoxGeometry(10.8, 2.35, 2.75)), maglevBodyMat);
    carBody.position.set(cx, 1.32, 0);
    const carStripe = new THREE.Mesh(
      track(new THREE.BoxGeometry(10.9, 0.36, 2.8)),
      maglevCobaltMat
    );
    carStripe.position.set(cx, 0.72, 0);
    const carGlass = new THREE.Mesh(
      track(new THREE.BoxGeometry(9.6, 0.98, 2.82)),
      maglevWindowMat
    );
    carGlass.position.set(cx, 1.65, 0);
    maglevTrainGroup.add(carBody, carStripe, carGlass);

    // Tapered aerodynamic bullet nose cones on front & rear cars
    if (idx === 0 || idx === 2) {
      const sign = idx === 2 ? 1 : -1;
      const nose = new THREE.Mesh(
        track(new THREE.CylinderGeometry(0.45, 1.32, 3.6, 12)),
        maglevBodyMat
      );
      nose.rotation.z = -sign * Math.PI * 0.5;
      nose.scale.set(0.88, 1, 1.02);
      nose.position.set(cx + sign * 7.1, 1.25, 0);
      maglevTrainGroup.add(nose);
    }
  });
  const maglevHeadBar = new THREE.Mesh(
    track(new THREE.BoxGeometry(0.18, 0.24, 1.65)),
    track(
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xe0f2fe,
        emissiveIntensity: 2.8,
      })
    )
  );
  maglevHeadBar.position.set(19.95, 1.15, 0);
  const maglevTailBar = new THREE.Mesh(
    track(new THREE.BoxGeometry(0.18, 0.22, 1.65)),
    track(
      new THREE.MeshStandardMaterial({
        color: 0xef4444,
        emissive: 0xef4444,
        emissiveIntensity: 2.2,
      })
    )
  );
  maglevTailBar.position.set(-19.95, 1.15, 0);
  maglevTrainGroup.add(maglevHeadBar, maglevTailBar);
  maglevGroup.add(maglevTrainGroup);
  group.add(maglevGroup);

  // ===========================================================================
  // 5C. HIGH-TECH NEXUS PARAMETRIC OVAL ATRIUM LANDMARK, AUTONOMOUS SKY-TRANSIT
  // eVTOL AIR-TAXIS & VOLUMETRIC ATMOSPHERIC SUN-SHAFTS
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

  // Sculpted Brushed-Titanium Parametric Torus Shell (catches vivid HDR sky reflections!)
  const nexusOuterShell = new THREE.Mesh(
    track(new THREE.TorusGeometry(8.2, 1.85, 24, 56)),
    skybridgeFrameMat
  );
  nexusOuterShell.scale.set(1.16, 1.24, 0.76);
  nexusOuterShell.position.y = 11.4;
  nexusOuterShell.castShadow = quality.shadowsEnabled;

  // Inner Curved Low-Iron Sapphire Atrium Glazing Ring
  const nexusInnerGlass = new THREE.Mesh(
    track(new THREE.TorusGeometry(6.75, 0.92, 18, 48)),
    skybridgeGlassMat
  );
  nexusInnerGlass.scale.set(1.16, 1.24, 0.92);
  nexusInnerGlass.position.y = 11.4;

  // Recessed Cobalt Architectural Light Halo along the Nexus Inner Rim
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

  // 2) Autonomous Sky-Transit eVTOL Air-Taxis gliding along high-altitude skyline corridors
  interface AirTaxiTrack {
    centerX: number;
    centerZ: number;
    radiusX: number;
    radiusZ: number;
    altitude: number;
    speed: number;
    phase: number;
    bobAmp: number;
  }
  const airTaxiTracks: AirTaxiTrack[] = [
    { centerX: 0, centerZ: 118, radiusX: 54, radiusZ: 34, altitude: 41, speed: 0.17, phase: 0.4, bobAmp: 0.7 },
    { centerX: -12, centerZ: 96, radiusX: 68, radiusZ: 28, altitude: 52, speed: -0.14, phase: 2.1, bobAmp: 0.9 },
    { centerX: 16, centerZ: 132, radiusX: 74, radiusZ: 42, altitude: 62, speed: 0.12, phase: 4.0, bobAmp: 1.1 },
    { centerX: 0, centerZ: 68, radiusX: 84, radiusZ: 24, altitude: 36, speed: -0.16, phase: 5.2, bobAmp: 0.65 },
    { centerX: -22, centerZ: 142, radiusX: 60, radiusZ: 36, altitude: 70, speed: 0.13, phase: 1.2, bobAmp: 1.0 },
    { centerX: 20, centerZ: 105, radiusX: 78, radiusZ: 32, altitude: 47, speed: -0.15, phase: 3.5, bobAmp: 0.8 },
  ];
  const airTaxiCount = airTaxiTracks.length;

  const evtolHullGeo = track(new THREE.CapsuleGeometry(0.55, 2.3, 8, 14));
  evtolHullGeo.rotateX(Math.PI / 2);
  evtolHullGeo.scale(1.25, 0.72, 1.0);
  const evtolCanopyGeo = track(new THREE.SphereGeometry(0.54, 12, 10));
  evtolCanopyGeo.scale(1.12, 0.56, 1.75);
  evtolCanopyGeo.translate(0, 0.24, 0.22);
  const evtolWingGeo = track(new THREE.BoxGeometry(4.2, 0.12, 0.82));
  evtolWingGeo.translate(0, 0.05, -0.15);
  const evtolPodRingGeo = track(new THREE.TorusGeometry(0.42, 0.075, 8, 18));
  evtolPodRingGeo.rotateX(Math.PI / 2);

  const evtolBodyInst = new THREE.InstancedMesh(evtolHullGeo, maglevBodyMat, airTaxiCount);
  const evtolCanopyInst = new THREE.InstancedMesh(evtolCanopyGeo, maglevWindowMat, airTaxiCount);
  const evtolWingInst = new THREE.InstancedMesh(evtolWingGeo, skybridgeFrameMat, airTaxiCount);
  const evtolThrusterInst = new THREE.InstancedMesh(evtolPodRingGeo, archLedMat, airTaxiCount * 2);
  [evtolBodyInst, evtolCanopyInst, evtolWingInst, evtolThrusterInst].forEach((m) => {
    m.frustumCulled = false;
  });
  group.add(evtolBodyInst, evtolCanopyInst, evtolWingInst, evtolThrusterInst);

  // 3) Subtle Volumetric Atmospheric Sun-Shafts / Light Beams cutting through the Downtown Canyon
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
          vec3 dayBeam = vec3(1.0, 0.95, 0.84);
          vec3 nightBeam = vec3(0.32, 0.66, 1.0);
          vec3 col = mix(dayBeam, nightBeam, uIsDark);
          float alpha = horiz * vert * shimmer * mix(0.082, 0.055, uIsDark);
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
      color: initialDarkMode ? 0xe0f2fe : 0xf1f5f9,
      emissive: initialDarkMode ? 0xbae6fd : 0x000000,
      emissiveIntensity: initialDarkMode ? 2.2 : 0.0,
      roughness: 0.14,
      metalness: 0.12,
    })
  );
  const lightPoolGeo = track(new THREE.PlaneGeometry(8.2, 8.2));
  lightPoolGeo.rotateX(-Math.PI / 2);
  const lightPoolMat = track(
    new THREE.MeshBasicMaterial({
      map: lightPoolTex,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: initialDarkMode ? 0.54 : 0.0,
    })
  );

  const lampPositions: [number, number, number][] = [];
  // Main Royal Boulevard lamps (skip river water)
  for (let z = 18; z <= 146; z += 16) {
    if (z > 40 && z < 68) continue;
    lampPositions.push([-9.1, z, 1]);
    lampPositions.push([9.1, z, -1]);
  }
  // Riverside Promenade Embankment Lamps
  for (let rx = -72; rx <= 72; rx += 18) {
    if (Math.abs(rx) < 15) continue;
    lampPositions.push([rx, 42.4, 0]);
    lampPositions.push([rx, 65.6, 0]);
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
  // 4) Riverside promenade trees
  [-56, -34, -20, 20, 34, 56].forEach((rx, idx) => {
    treeSlots.push([rx, 39.2, 1.0 + (idx % 3) * 0.1]);
    treeSlots.push([rx, 69.2, 1.0 + ((idx + 1) % 3) * 0.1]);
  });

  const treeCount = Math.min(quality.treeCount, treeSlots.length);
  const trunksInst = new THREE.InstancedMesh(treeSkeletonGeo, trunkMat, treeCount);
  const canopyInst = new THREE.InstancedMesh(botanicalCrownGeo, canopyMat, treeCount);

  trunksInst.castShadow = quality.shadowsEnabled;
  canopyInst.castShadow = quality.shadowsEnabled;
  canopyInst.receiveShadow = quality.shadowsEnabled;
  canopyInst.customDepthMaterial = canopyDepthMat;

  const paintTrees = (dark: boolean) => {
    // Muted, authentic British oak, plane & silver-birch foliage tints (never cartoon neon-green!)
    const dayLeafTints = [0x6e7f55, 0x5c6e46, 0x7a8559, 0x526441, 0x67754d];
    const nightLeafTints = [0x202d22, 0x1a261d, 0x243125, 0x17211a, 0x1d291f];
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
  // 9. ULTRA-REALISTIC AERODYNAMIC LUXURY EV CARS, SUVS & SLEEK ELECTRIC CITY COACHES
  // ===========================================================================
  const carBodyGeo = track(createSculptedCarBodyGeometry());
  const carGlassGeo = track(createSculptedCarGlassGeometry());
  const carAeroSkirtGeo = track(new THREE.BoxGeometry(1.78, 0.14, 4.38));
  const carGrilleGeo = track(new THREE.BoxGeometry(1.18, 0.22, 0.12));
  const carMirrorGeo = track(new THREE.BoxGeometry(0.24, 0.11, 0.16));
  const carWheelGeo = track(new THREE.CylinderGeometry(0.35, 0.35, 0.28, 20));
  carWheelGeo.rotateZ(Math.PI / 2);
  const carRimGeo = track(new THREE.CylinderGeometry(0.23, 0.23, 0.3, 14));
  carRimGeo.rotateZ(Math.PI / 2);
  const carHubGeo = track(new THREE.CylinderGeometry(0.11, 0.11, 0.315, 10));
  carHubGeo.rotateZ(Math.PI / 2);
  // Sleek full-width modern EV LED headlight DRL bar & continuous crimson taillight bar
  const carHeadBarGeo = track(new THREE.BoxGeometry(1.56, 0.085, 0.08));
  const carTailBarGeo = track(new THREE.BoxGeometry(1.62, 0.09, 0.08));
  const carShadowGeo = track(new THREE.PlaneGeometry(2.65, 5.25));
  carShadowGeo.rotateX(-Math.PI / 2);
  const carBeamGeo = track(new THREE.PlaneGeometry(3.6, 8.2));
  carBeamGeo.rotateX(-Math.PI / 2);

  // Sleek Aerodynamic Panoramic-Glass Futuristic Electric City Coach
  const busBodyGeo = track(createAerodynamicCoachBodyGeometry());
  const busWinGeo = track(createAerodynamicCoachGlassGeometry());
  const busStripeGeo = track(new THREE.BoxGeometry(2.44, 0.26, 8.8));
  busStripeGeo.translate(0, 0.92, -0.04);
  const busHeadBarGeo = track(new THREE.BoxGeometry(2.02, 0.12, 0.12));
  busHeadBarGeo.translate(0, 0.94, 4.54);
  const busTailBarGeo = track(new THREE.BoxGeometry(2.04, 0.12, 0.12));
  busTailBarGeo.translate(0, 1.02, -4.55);
  const busWheelGeo = track(new THREE.CylinderGeometry(0.48, 0.48, 0.34, 18));
  busWheelGeo.rotateZ(Math.PI / 2);

  const carPaintMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.1,
      metalness: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      reflectivity: 1.0,
      envMapIntensity: 2.38,
    })
  );
  const busCoachMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xe6eff8,
      roughness: 0.14,
      metalness: 0.6,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      envMapIntensity: 2.15,
    })
  );
  const busAccentMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0x1d4ed8,
      roughness: 0.18,
      metalness: 0.68,
      clearcoat: 0.96,
      envMapIntensity: 2.05,
    })
  );
  const carGlassMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0x0b1628,
      roughness: 0.02,
      metalness: 0.38,
      clearcoat: 1.0,
      clearcoatRoughness: 0.015,
      reflectivity: 1.0,
      envMapIntensity: 2.42,
    })
  );
  const grilleMat = track(
    new THREE.MeshStandardMaterial({ color: 0x121822, roughness: 0.24, metalness: 0.9 })
  );
  const tireMat = track(
    new THREE.MeshStandardMaterial({ color: 0x14171c, roughness: 0.9, metalness: 0.04 })
  );
  const rimMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xe2e8f0,
      roughness: 0.12,
      metalness: 0.96,
      clearcoat: 0.8,
      envMapIntensity: 1.85,
    })
  );
  const brakeHubMat = track(
    new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.28, metalness: 0.78 })
  );
  const carHeadMat = track(
    new THREE.MeshStandardMaterial({
      color: 0xf8fcff,
      emissive: 0xdff2ff,
      emissiveIntensity: initialDarkMode ? 2.9 : 0.42,
      roughness: 0.06,
    })
  );
  const carTailMat = track(
    new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      emissive: 0xef4444,
      emissiveIntensity: initialDarkMode ? 2.4 : 0.35,
      roughness: 0.12,
    })
  );
  const carShadowMat = track(
    new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: initialDarkMode ? 0.58 : 0.4,
    })
  );
  const carBeamMat = track(
    new THREE.MeshBasicMaterial({
      map: headlightBeamTex,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: initialDarkMode ? 0.54 : 0.0,
    })
  );

  // Modern Luxury EV Metallic Paint Palette (Pearl Glacier, Deep Sapphire, Liquid Titanium, Obsidian, Electric Cobalt, Slate)
  const realCarPaints = [
    0xf1f5f9, 0x1e3a6d, 0x94a3b8, 0x111827, 0x2563eb, 0x475569, 0xe2e8f0, 0x0f294a,
  ];

  const carTracks: VehicleTrack[] = [];
  const crossLaneZs = [27, 86, 126];
  for (let i = 0; i < quality.vehicleCount; i++) {
    const paintHex = realCarPaints[i % realCarPaints.length];
    const kind = i % 3 === 0 ? 'suv' : 'sedan';
    if (i % 2 === 0) {
      // Main Royal Boulevard Cars (drive smoothly across the Tied-Arch River Bridge!)
      const dir = i % 4 === 0 ? 1 : -1;
      carTracks.push({
        axis: 'z',
        laneOffset: dir === 1 ? -3.4 : 3.4,
        yElevation: 0.16,
        minCoord: 20,
        startPos: 22 + ((i * 23) % 148),
        span: 158,
        speed: 9.2 + (i % 4) * 2.1,
        dir,
        paintHex,
        kind,
      });
    } else {
      // East-West Cross-Avenue Cars (all clear of river canal!)
      const dir = i % 4 === 1 ? 1 : -1;
      const zLane = crossLaneZs[i % crossLaneZs.length] + (dir === 1 ? -2.4 : 2.4);
      carTracks.push({
        axis: 'x',
        laneOffset: zLane,
        yElevation: 0.14,
        minCoord: -115,
        startPos: -110 + ((i * 31) % 220),
        span: 230,
        speed: 9.8 + (i % 4) * 2.0,
        dir,
        paintHex,
        kind,
      });
    }
  }

  // Parked luxury EVs neatly along boulevard bays (outside bridge)
  [
    [-6.25, 34, 1, 0xf1f5f9],
    [6.25, 76, -1, 0x1e3a6d],
    [-6.25, 102, 1, 0x94a3b8],
    [6.25, 114, -1, 0x111827],
  ].forEach(([px, pz, dir, paintHex], idx) => {
    carTracks.push({
      axis: 'z',
      laneOffset: px,
      yElevation: 0.16,
      minCoord: pz,
      startPos: pz,
      span: 1,
      speed: 0,
      dir: dir as 1 | -1,
      paintHex,
      kind: idx % 2 === 0 ? 'suv' : 'sedan',
      isParked: true,
    });
  });

  // 2 Sleek Aerodynamic Futuristic Panoramic-Glass Electric City Coaches
  const busTracks: VehicleTrack[] = [
    {
      axis: 'z',
      laneOffset: -3.55,
      yElevation: 0.16,
      minCoord: 22,
      startPos: 86,
      span: 150,
      speed: 6.8,
      dir: 1,
      paintHex: 0x1d4ed8,
      kind: 'bus',
    },
    {
      axis: 'z',
      laneOffset: 3.55,
      yElevation: 0.16,
      minCoord: 22,
      startPos: 128,
      span: 150,
      speed: 6.4,
      dir: -1,
      paintHex: 0x1d4ed8,
      kind: 'bus',
    },
  ];
  const busBodyInst = new THREE.InstancedMesh(busBodyGeo, busCoachMat, busTracks.length);
  const busWinInst = new THREE.InstancedMesh(busWinGeo, carGlassMat, busTracks.length);
  const busStripeInst = new THREE.InstancedMesh(busStripeGeo, busAccentMat, busTracks.length);
  const busHeadInst = new THREE.InstancedMesh(busHeadBarGeo, carHeadMat, busTracks.length);
  const busTailInst = new THREE.InstancedMesh(busTailBarGeo, carTailMat, busTracks.length);
  const busWheelsInst = new THREE.InstancedMesh(busWheelGeo, tireMat, busTracks.length * 4);
  busBodyInst.castShadow = quality.shadowsEnabled;
  [busBodyInst, busWinInst, busStripeInst, busHeadInst, busTailInst, busWheelsInst].forEach((m) => {
    m.frustumCulled = false;
  });
  group.add(busBodyInst, busWinInst, busStripeInst, busHeadInst, busTailInst, busWheelsInst);

  const carCount = carTracks.length;
  const carsBodyInst = new THREE.InstancedMesh(carBodyGeo, carPaintMat, carCount);
  const carsGlassInst = new THREE.InstancedMesh(carGlassGeo, carGlassMat, carCount);
  const carsSkirtInst = new THREE.InstancedMesh(carAeroSkirtGeo, grilleMat, carCount);
  const carsGrilleInst = new THREE.InstancedMesh(carGrilleGeo, grilleMat, carCount);
  const carsMirrorsInst = new THREE.InstancedMesh(carMirrorGeo, carPaintMat, carCount * 2);
  const carsWheelsInst = new THREE.InstancedMesh(carWheelGeo, tireMat, carCount * 4);
  const carsRimsInst = new THREE.InstancedMesh(carRimGeo, rimMat, carCount * 4);
  const carsHubsInst = new THREE.InstancedMesh(carHubGeo, brakeHubMat, carCount * 4);
  const carsHeadInst = new THREE.InstancedMesh(carHeadBarGeo, carHeadMat, carCount);
  const carsTailInst = new THREE.InstancedMesh(carTailBarGeo, carTailMat, carCount);
  const carsShadowInst = new THREE.InstancedMesh(carShadowGeo, carShadowMat, carCount);
  const carsBeamInst = new THREE.InstancedMesh(carBeamGeo, carBeamMat, carCount);

  carsBodyInst.castShadow = quality.shadowsEnabled;

  for (let i = 0; i < carCount; i++) {
    _tempColor.setHex(carTracks[i].paintHex);
    carsBodyInst.setColorAt(i, _tempColor);
    carsMirrorsInst.setColorAt(i * 2, _tempColor);
    carsMirrorsInst.setColorAt(i * 2 + 1, _tempColor);
  }
  if (carsBodyInst.instanceColor) carsBodyInst.instanceColor.needsUpdate = true;
  if (carsMirrorsInst.instanceColor) carsMirrorsInst.instanceColor.needsUpdate = true;
  [
    carsBodyInst,
    carsGlassInst,
    carsSkirtInst,
    carsGrilleInst,
    carsMirrorsInst,
    carsWheelsInst,
    carsRimsInst,
    carsHubsInst,
    carsHeadInst,
    carsTailInst,
    carsShadowInst,
    carsBeamInst,
  ].forEach((m) => {
    m.frustumCulled = false;
  });
  group.add(
    carsBodyInst,
    carsGlassInst,
    carsSkirtInst,
    carsGrilleInst,
    carsMirrorsInst,
    carsWheelsInst,
    carsRimsInst,
    carsHubsInst,
    carsHeadInst,
    carsTailInst,
    carsShadowInst,
    carsBeamInst
  );

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

  const wheelOffsets: [number, number][] = [
    [-0.9, 1.38],
    [0.9, 1.38],
    [-0.9, -1.36],
    [0.9, -1.36],
  ];
  const busWheelOffsets: [number, number][] = [
    [-1.12, 2.75],
    [1.12, 2.75],
    [-1.12, -2.75],
    [1.12, -2.75],
  ];
  const mirrorXOffsets = [-0.98, 0.98];

  let isCurrentlyDark = initialDarkMode;

  // Helper: Gentle elevation rise as vehicles cross over the River Bridge deck (z = 38..70)
  const bridgeElevationAtZ = (z: number) => {
    const d = Math.abs(z - 54);
    if (d >= 18) return 0;
    return 0.72 * Math.pow(Math.cos((d / 18) * (Math.PI / 2)), 1.5);
  };

  // Zero-GC Per-Frame Living Futuristic City Update
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

    // Smoothly glide the Elevated Maglev Express Train back and forth across the futuristic skyline!
    const maglevCycle = ((elapsedSeconds * 26.0) % 280) - 140;
    maglevTrainGroup.position.x = maglevCycle;

    // Update Autonomous Sky-Transit eVTOL Air-Taxis gliding along elevated skyline corridors
    for (let a = 0; a < airTaxiCount; a++) {
      const tr = airTaxiTracks[a];
      const ang = tr.phase + elapsedSeconds * tr.speed;
      const ax = tr.centerX + Math.cos(ang) * tr.radiusX;
      const az = tr.centerZ + Math.sin(ang) * tr.radiusZ;
      const ay = tr.altitude + Math.sin(elapsedSeconds * 1.15 + tr.phase) * tr.bobAmp;
      const vx = -Math.sin(ang) * tr.radiusX * tr.speed;
      const vz = Math.cos(ang) * tr.radiusZ * tr.speed;
      const yaw = Math.atan2(vx, vz);
      const bank = tr.speed > 0 ? -0.14 : 0.14;
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);

      _vDummy.position.set(ax, ay, az);
      _vDummy.rotation.set(0, yaw, bank, 'YXZ');
      _vDummy.scale.set(1, 1, 1);
      _vDummy.updateMatrix();
      evtolBodyInst.setMatrixAt(a, _vDummy.matrix);
      evtolCanopyInst.setMatrixAt(a, _vDummy.matrix);
      evtolWingInst.setMatrixAt(a, _vDummy.matrix);

      // Left & Right glowing ducted thruster pods on the wingtips
      for (let side = 0; side < 2; side++) {
        const sx = side === 0 ? -2.05 : 2.05;
        _wDummy.position.set(ax + sx * cosY, ay + 0.05 + sx * Math.sin(bank), az - sx * sinY);
        _wDummy.rotation.set(0, yaw, bank, 'YXZ');
        _wDummy.scale.set(1, 1, 1);
        _wDummy.updateMatrix();
        evtolThrusterInst.setMatrixAt(a * 2 + side, _wDummy.matrix);
      }
    }
    evtolBodyInst.instanceMatrix.needsUpdate = true;
    evtolCanopyInst.instanceMatrix.needsUpdate = true;
    evtolWingInst.instanceMatrix.needsUpdate = true;
    evtolThrusterInst.instanceMatrix.needsUpdate = true;

    // Update Sleek Futuristic Panoramic-Glass Electric City Coaches
    for (let i = 0; i < busTracks.length; i++) {
      const bt = busTracks[i];
      const raw =
        (((bt.startPos - bt.minCoord + elapsedSeconds * bt.speed * bt.dir) % bt.span) + bt.span) %
        bt.span;
      const pz = bt.minCoord + raw;
      const py = bt.yElevation + bridgeElevationAtZ(pz);
      const yaw = bt.dir === 1 ? 0 : Math.PI;
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);

      _vDummy.position.set(bt.laneOffset, py, pz);
      _vDummy.rotation.set(0, yaw, 0);
      _vDummy.scale.set(1, 1, 1);
      _vDummy.updateMatrix();
      busBodyInst.setMatrixAt(i, _vDummy.matrix);
      busWinInst.setMatrixAt(i, _vDummy.matrix);
      busStripeInst.setMatrixAt(i, _vDummy.matrix);
      busHeadInst.setMatrixAt(i, _vDummy.matrix);
      busTailInst.setMatrixAt(i, _vDummy.matrix);

      const bSpin = (elapsedSeconds * bt.speed) / 0.48;
      for (let w = 0; w < 4; w++) {
        const [lx, lz] = busWheelOffsets[w];
        _wDummy.position.set(bt.laneOffset + lx * cosY + lz * sinY, py + 0.48, pz - lx * sinY + lz * cosY);
        _wDummy.rotation.set(bSpin, yaw, 0, 'YXZ');
        _wDummy.scale.set(1, 1, 1);
        _wDummy.updateMatrix();
        busWheelsInst.setMatrixAt(i * 4 + w, _wDummy.matrix);
      }
    }
    busBodyInst.instanceMatrix.needsUpdate = true;
    busWinInst.instanceMatrix.needsUpdate = true;
    busStripeInst.instanceMatrix.needsUpdate = true;
    busHeadInst.instanceMatrix.needsUpdate = true;
    busTailInst.instanceMatrix.needsUpdate = true;
    busWheelsInst.instanceMatrix.needsUpdate = true;

    // Update all Ultra-Realistic Sculpted Luxury EV Sedans & SUVs
    for (let i = 0; i < carCount; i++) {
      const tr = carTracks[i];
      let px = 0;
      let pz = 0;
      let yaw = 0;
      let py = tr.yElevation;

      if (tr.isParked) {
        px = tr.laneOffset;
        pz = tr.startPos;
        yaw = tr.dir === 1 ? 0 : Math.PI;
      } else if (tr.axis === 'z') {
        const raw =
          (((tr.startPos - tr.minCoord + elapsedSeconds * tr.speed * tr.dir) % tr.span) + tr.span) %
          tr.span;
        px = tr.laneOffset;
        pz = tr.minCoord + raw;
        py = tr.yElevation + bridgeElevationAtZ(pz);
        yaw = tr.dir === 1 ? 0 : Math.PI;
      } else {
        const raw =
          (((tr.startPos - tr.minCoord + elapsedSeconds * tr.speed * tr.dir) % tr.span) + tr.span) %
          tr.span;
        px = tr.minCoord + raw;
        pz = tr.laneOffset;
        yaw = tr.dir === 1 ? Math.PI / 2 : -Math.PI / 2;
      }

      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const suvScaleY = tr.kind === 'suv' ? 1.15 : 1.0;

      _vDummy.position.set(px, py, pz);
      _vDummy.rotation.set(0, yaw, 0);
      _vDummy.scale.set(1, suvScaleY, 1);
      _vDummy.updateMatrix();
      carsBodyInst.setMatrixAt(i, _vDummy.matrix);
      carsGlassInst.setMatrixAt(i, _vDummy.matrix);

      // Lower dark metallic aero front splitter & rear diffuser skirt
      _vDummy.position.set(px, py + 0.25, pz);
      _vDummy.scale.set(1, 1, 1);
      _vDummy.updateMatrix();
      carsSkirtInst.setMatrixAt(i, _vDummy.matrix);

      // Front aero intake grille
      _vDummy.position.set(px + 2.21 * sinY, py + 0.44 * suvScaleY, pz + 2.21 * cosY);
      _vDummy.updateMatrix();
      carsGrilleInst.setMatrixAt(i, _vDummy.matrix);

      // Full-width cool-white LED DRL headlight bar
      _vDummy.position.set(px + 2.2 * sinY, py + 0.61 * suvScaleY, pz + 2.2 * cosY);
      _vDummy.updateMatrix();
      carsHeadInst.setMatrixAt(i, _vDummy.matrix);

      // Full-width continuous crimson LED rear taillight bar
      _vDummy.position.set(px - 2.18 * sinY, py + 0.68 * suvScaleY, pz - 2.18 * cosY);
      _vDummy.updateMatrix();
      carsTailInst.setMatrixAt(i, _vDummy.matrix);

      // Side-view aerodynamic mirrors (left & right)
      for (let m = 0; m < 2; m++) {
        const mx = mirrorXOffsets[m];
        _wDummy.position.set(
          px + mx * cosY + 0.54 * sinY,
          py + 0.94 * suvScaleY,
          pz - mx * sinY + 0.54 * cosY
        );
        _wDummy.rotation.set(0, yaw, 0);
        _wDummy.scale.set(1, 1, 1);
        _wDummy.updateMatrix();
        carsMirrorsInst.setMatrixAt(i * 2 + m, _wDummy.matrix);
      }

      _vDummy.position.set(px, py + 0.03, pz);
      _vDummy.updateMatrix();
      carsShadowInst.setMatrixAt(i, _vDummy.matrix);

      if (!tr.isParked) {
        _vDummy.position.set(px + 5.9 * sinY, py + 0.06, pz + 5.9 * cosY);
        _vDummy.rotation.set(0, yaw, 0);
        _vDummy.scale.set(1, 1, 1);
        _vDummy.updateMatrix();
      } else {
        _vDummy.position.set(px, -50, pz);
        _vDummy.scale.setScalar(0.001);
        _vDummy.updateMatrix();
      }
      carsBeamInst.setMatrixAt(i, _vDummy.matrix);

      const wheelSpin = tr.isParked ? 0 : (elapsedSeconds * tr.speed) / 0.35;
      for (let w = 0; w < 4; w++) {
        const [lx, lz] = wheelOffsets[w];
        const wx = px + lx * cosY + lz * sinY;
        const wz = pz - lx * sinY + lz * cosY;
        _wDummy.position.set(wx, py + 0.35, wz);
        _wDummy.rotation.set(wheelSpin, yaw, 0, 'YXZ');
        _wDummy.scale.set(1, 1, 1);
        _wDummy.updateMatrix();
        carsWheelsInst.setMatrixAt(i * 4 + w, _wDummy.matrix);
        carsRimsInst.setMatrixAt(i * 4 + w, _wDummy.matrix);
        carsHubsInst.setMatrixAt(i * 4 + w, _wDummy.matrix);
      }
    }

    carsBodyInst.instanceMatrix.needsUpdate = true;
    carsGlassInst.instanceMatrix.needsUpdate = true;
    carsSkirtInst.instanceMatrix.needsUpdate = true;
    carsGrilleInst.instanceMatrix.needsUpdate = true;
    carsMirrorsInst.instanceMatrix.needsUpdate = true;
    carsWheelsInst.instanceMatrix.needsUpdate = true;
    carsRimsInst.instanceMatrix.needsUpdate = true;
    carsHubsInst.instanceMatrix.needsUpdate = true;
    carsHeadInst.instanceMatrix.needsUpdate = true;
    carsTailInst.instanceMatrix.needsUpdate = true;
    carsShadowInst.instanceMatrix.needsUpdate = true;
    carsBeamInst.instanceMatrix.needsUpdate = true;
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

    hillMat.color.setHex(isDark ? 0x101622 : 0x62745e);
    urbanPadMat.color.setHex(isDark ? 0x191e27 : 0xc9cdd2);
    stoneCurbMat.color.setHex(isDark ? 0x414855 : 0xe4dfd5);
    benchWoodMat.color.setHex(isDark ? 0x6e4a2d : 0xa67346);

    plazaMat.map = isDark ? plazaPbr.darkMap : plazaPbr.lightMap;
    plazaMat.roughness = isDark ? 0.72 : 0.84;
    plazaMat.needsUpdate = true;

    crescentRoadMat.color.setHex(isDark ? 0x222730 : 0x525760);
    crescentRoadMat.roughness = isDark ? 0.62 : 0.86;
    crescentRoadMat.metalness = isDark ? 0.12 : 0.03;

    sidewalkMat.color.setHex(isDark ? 0x2b313c : 0xdcd9d1);
    bridgeSteelMat.color.setHex(isDark ? 0x263142 : 0x3b4d63);
    podiumMat.color.setHex(isDark ? 0x162238 : 0xd6e1ee);
    rooftopMat.color.setHex(isDark ? 0x1a2740 : 0x8ea3ba);
    homeRoofMat.color.setHex(isDark ? 0x1a2538 : 0x334155);
    homeTrimMat.color.setHex(isDark ? 0x26344a : 0xeef3f8);
    storefrontAwningMat.color.setHex(isDark ? 0x1a2436 : 0x29374b);
    fountainBasaltMat.color.setHex(isDark ? 0x162030 : 0x2d3848);
    fountainHaloMat.color.setHex(isDark ? 0xbae6fd : 0x7dd3fc);
    fountainHaloMat.emissiveIntensity = isDark ? 2.15 : 0.2;
    waterfrontGlassMat.color.setHex(isDark ? 0x6ba8e5 : 0xcce6ff);
    poleMat.color.setHex(isDark ? 0x262c36 : 0x3b424c);
    crosswalkMat.color.setHex(isDark ? 0xb8c4d4 : 0xf6f8fb);
    skybridgeFrameMat.color.setHex(isDark ? 0x1d2b44 : 0xd5e2f0);
    skybridgeGlassMat.color.setHex(isDark ? 0x2a66a8 : 0x5ca6e6);
    archLedMat.color.setHex(isDark ? 0xbae6fd : 0xcbdcf0);
    archLedMat.emissiveIntensity = isDark ? 2.15 : 0.14;
    maglevWindowMat.emissiveIntensity = isDark ? 0.55 : 0.06;

    terraceWallMats.forEach((tw) => {
      tw.mat.color.setHex(isDark ? tw.night : tw.day);
    });

    waterMat.color.setHex(isDark ? 0x0b1f34 : 0x1e4d6b);

    roadMat.map = isDark ? roadPbr.darkMap : roadPbr.lightMap;
    roadMat.roughnessMap = isDark ? roadPbr.darkRoughnessMap : roadPbr.lightRoughnessMap;
    roadMat.metalness = isDark ? 0.14 : 0.03;
    roadMat.needsUpdate = true;

    towerMat.map = isDark ? skyPbr.darkMap : skyPbr.lightMap;
    towerMat.emissive.setHex(isDark ? 0xdff2ff : 0x000000);
    towerMat.emissiveMap = isDark ? skyPbr.darkEmissiveMap : null;
    towerMat.emissiveIntensity = isDark ? 1.02 : 0.0;
    towerMat.roughness = isDark ? 0.31 : 0.17;
    towerMat.metalness = isDark ? 0.68 : 0.74;
    towerMat.envMapIntensity = isDark ? 2.18 : 2.58;
    towerMat.needsUpdate = true;

    aviationBeaconMat.emissiveIntensity = isDark ? 2.4 : 0.0;

    for (let i = 0; i < steppedSlots.length; i++) {
      const s = steppedSlots[i];
      _tempColor.setHex(isDark ? s.nightFacadeHex : s.dayFacadeHex);
      towersMesh.setColorAt(i, _tempColor);
      setbacksMesh.setColorAt(i, _tempColor);
    }
    if (towersMesh.instanceColor) towersMesh.instanceColor.needsUpdate = true;
    if (setbacksMesh.instanceColor) setbacksMesh.instanceColor.needsUpdate = true;

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
    homeWinMat.emissive.setHex(isDark ? 0xffe5bd : 0x000000);
    homeWinMat.emissiveMap = isDark ? winTex.nightEmissiveMap : null;
    homeWinMat.emissiveIntensity = isDark ? 0.94 : 0.0;
    homeWinMat.needsUpdate = true;

    streetLightsMat.color.setHex(isDark ? 0xe0f2fe : 0xf1f5f9);
    streetLightsMat.emissive.setHex(isDark ? 0xbae6fd : 0x000000);
    streetLightsMat.emissiveIntensity = isDark ? 2.2 : 0.0;
    lightPoolMat.opacity = isDark ? 0.56 : 0.0;

    sigRedMat.emissiveIntensity = isDark ? 1.65 : 0.65;
    sigGreenMat.emissiveIntensity = isDark ? 1.65 : 0.65;

    carHeadMat.emissiveIntensity = isDark ? 2.9 : 0.42;
    carTailMat.emissiveIntensity = isDark ? 2.4 : 0.35;
    carShadowMat.opacity = isDark ? 0.58 : 0.4;
    carBeamMat.opacity = isDark ? 0.54 : 0.0;

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

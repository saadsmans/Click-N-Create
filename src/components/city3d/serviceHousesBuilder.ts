import * as THREE from 'three';
import { ServiceItem } from '../../data/services.ts';
import {
  HOUSE_PLACEMENTS,
  HouseInstanceRef,
  QualityProfile,
  SERVICE_HOUSE_PALETTES,
} from './types.ts';
import {
  createArchitecturalCladdingPbr,
  createNaturalGrassPbrSet,
  createWoodGrainPbrSet,
  createResidentialWindowTextures,
  createContactShadowTexture,
  createBotanicalLeafClusterTexture,
  createHerringboneFloorPbrSet,
  createStudioInteriorDisplayTexture,
  createCalacattaMarblePbrSet,
  createLuxuryAreaRugTexture,
  createGalleryArtTexture,
  createHousePlaqueTexture,
  applyGroundAO,
} from './proceduralTextures.ts';

export interface HousesBuildResult {
  group: THREE.Group;
  houses: HouseInstanceRef[];
  hitboxes: THREE.Mesh[];
  applyTheme: (isDark: boolean) => void;
  dispose: () => void;
}

/**
 * Sculpts an aerodynamic cantilevered chamfered roof canopy (for Executive Glass Manor & Pavilions).
 */
function createCantileveredAeroRoofGeometry(
  width: number,
  thickness: number,
  depth: number,
  taper = 0.55
): THREE.ExtrudeGeometry {
  const hw = width / 2;
  const shape = new THREE.Shape();
  shape.moveTo(-hw, thickness * 0.55);
  shape.lineTo(hw, thickness * 0.55);
  shape.lineTo(hw - taper, 0);
  shape.lineTo(-hw + taper, 0);
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.06,
    bevelSize: 0.05,
    bevelSegments: 2,
  });
  geo.translate(0, 0, -depth / 2);
  geo.computeVertexNormals();
  return geo;
}

/**
 * Sculpts a dramatic contemporary V-wing Butterfly Roof with soaring angled overhangs!
 */
function createButterflyRoofGeometry(
  width: number,
  wingRise: number,
  depth: number,
  thickness = 0.28
): THREE.ExtrudeGeometry {
  const hw = width / 2;
  const shape = new THREE.Shape();
  shape.moveTo(-hw, wingRise);
  shape.lineTo(0, 0.05);
  shape.lineTo(hw, wingRise * 1.18);
  shape.lineTo(hw, wingRise * 1.18 + thickness);
  shape.lineTo(0, 0.05 + thickness * 1.15);
  shape.lineTo(-hw, wingRise + thickness);
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.04,
    bevelSegments: 2,
  });
  geo.translate(0, 0, -depth / 2);
  geo.computeVertexNormals();
  return geo;
}

/**
 * Sculpts a sweeping curved contemporary limestone architectural ribbon fascia!
 */
function createCurvedRibbonCanopyGeometry(
  width: number,
  height: number,
  depth: number
): THREE.ExtrudeGeometry {
  const hw = width / 2;
  const shape = new THREE.Shape();
  shape.moveTo(-hw, 0);
  shape.lineTo(hw, 0);
  shape.quadraticCurveTo(hw + 0.55, height * 0.5, hw, height);
  shape.lineTo(-hw, height);
  shape.quadraticCurveTo(-hw - 0.55, height * 0.5, -hw, 0);
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.06,
    bevelSize: 0.05,
    bevelSegments: 3,
    curveSegments: 14,
  });
  geo.translate(0, 0, -depth / 2);
  geo.computeVertexNormals();
  return geo;
}

/**
 * Sculpts a chamfered octagonal architectural pavilion volume (replaces basic box wings with sleek beveled corners).
 */
function createChamferedVolumeGeometry(
  width: number,
  height: number,
  depth: number,
  chamfer = 0.42
): THREE.ExtrudeGeometry {
  const hw = width / 2;
  const hd = depth / 2;
  const c = Math.min(chamfer, hw * 0.45, hd * 0.45);
  const shape = new THREE.Shape();
  shape.moveTo(-hw + c, -hd);
  shape.lineTo(hw - c, -hd);
  shape.lineTo(hw, -hd + c);
  shape.lineTo(hw, hd - c);
  shape.lineTo(hw - c, hd);
  shape.lineTo(-hw + c, hd);
  shape.lineTo(-hw, hd - c);
  shape.lineTo(-hw, -hd + c);
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: height,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.04,
    bevelSegments: 2,
  });
  geo.rotateX(-Math.PI / 2);
  geo.translate(0, -height / 2, 0);
  geo.computeVertexNormals();
  return geo;
}

/**
 * Builds a layered multi-petal floral rosette for courtyard planters.
 */
function createCourtyardRosetteGeometry(): THREE.BufferGeometry {
  const group: THREE.BufferGeometry[] = [];
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const g = new THREE.CylinderGeometry(0.09, 0.03, 0.035, 6);
    g.scale(1.2, 1.0, 0.78);
    g.rotateX(0.32);
    g.rotateY(a);
    g.translate(Math.cos(a) * 0.07, 0.015, Math.sin(a) * 0.07);
    group.push(g);
  }
  // Merge manually via simple Box/Cylinder or return single shaped BufferGeometry
  const base = group[0];
  const totalVerts = group.reduce((sum, g) => sum + g.getAttribute('position').count, 0);
  const posArr = new Float32Array(totalVerts * 3);
  const normArr = new Float32Array(totalVerts * 3);
  const idxArr: number[] = [];
  let vOff = 0;
  group.forEach((g) => {
    const p = g.getAttribute('position');
    const n = g.getAttribute('normal');
    for (let i = 0; i < p.count; i++) {
      posArr[(vOff + i) * 3] = p.getX(i);
      posArr[(vOff + i) * 3 + 1] = p.getY(i);
      posArr[(vOff + i) * 3 + 2] = p.getZ(i);
      normArr[(vOff + i) * 3] = n.getX(i);
      normArr[(vOff + i) * 3 + 1] = n.getY(i);
      normArr[(vOff + i) * 3 + 2] = n.getZ(i);
    }
    const gi = g.getIndex();
    if (gi) {
      for (let i = 0; i < gi.count; i++) {
        idxArr.push(gi.getX(i) + vOff);
      }
    }
    vOff += p.count;
    if (g !== base) g.dispose();
  });
  base.dispose();
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
  out.setAttribute('normal', new THREE.BufferAttribute(normArr, 3));
  out.setIndex(idxArr);
  out.computeVertexNormals();
  return out;
}

/**
 * Builds 6 Distinct Ultra-Luxury Contemporary / Futuristic Architectural Residences & Designer Pavilions
 * arranged in a grand landscaped crescent overlooking the shimmering river and sapphire-glass metropolis.
 */
export function buildServiceHouses(
  services: ServiceItem[],
  quality: QualityProfile,
  maxAnisotropy: number,
  _isSoftwareGl: boolean,
  initialDarkMode = true
): HousesBuildResult {
  const rootGroup = new THREE.Group();
  rootGroup.name = 'bespoke-modern-luxury-service-residences';

  const disposables: { dispose: () => void }[] = [];
  const track = <T extends { dispose: () => void }>(item: T): T => {
    disposables.push(item);
    return item;
  };

  // High-Resolution Procedural ArchViz PBR Material Suites (2K/1K tier on desktop/tablet)
  const highRes = quality.tier === 'desktop' || quality.tier === 'tablet';
  const claddingPbr = track(createArchitecturalCladdingPbr(maxAnisotropy, highRes));
  const grassPbr = track(createNaturalGrassPbrSet(maxAnisotropy, 3, 3, highRes));
  const woodPbr = track(createWoodGrainPbrSet(maxAnisotropy, highRes));
  const herringbonePbr = track(createHerringboneFloorPbrSet(maxAnisotropy, highRes));
  const marblePbr = track(createCalacattaMarblePbrSet(maxAnisotropy, highRes));
  const winTex = track(createResidentialWindowTextures(maxAnisotropy, highRes));
  const shadowTex = track(createContactShadowTexture());
  const leafClusterTex = track(createBotanicalLeafClusterTexture(maxAnisotropy, highRes));

  // Palatial Luxury Interior Shared PBR Materials
  const interiorFloorMat = track(
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: herringbonePbr.map,
      normalMap: herringbonePbr.normalMap,
      normalScale: new THREE.Vector2(0.45, 0.45),
      roughnessMap: herringbonePbr.roughnessMap,
      roughness: 0.34,
      metalness: 0.05,
    })
  );
  const calacattaMarbleMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      map: marblePbr.map,
      normalMap: marblePbr.normalMap,
      normalScale: new THREE.Vector2(0.28, 0.28),
      roughnessMap: marblePbr.roughnessMap,
      roughness: 0.16,
      metalness: 0.04,
      clearcoat: 0.85,
      clearcoatRoughness: 0.08,
      envMapIntensity: 1.15,
    })
  );
  const interiorWallMat = track(
    new THREE.MeshStandardMaterial({
      color: 0xf4efe6,
      roughness: 0.86,
      metalness: 0.02,
    })
  );
  const interiorWainscotMat = track(
    new THREE.MeshStandardMaterial({
      color: 0xe9e1d4,
      roughness: 0.72,
      metalness: 0.03,
    })
  );
  const interiorCeilingMat = track(
    new THREE.MeshStandardMaterial({
      color: 0xfbf8f3,
      roughness: 0.88,
      metalness: 0.0,
    })
  );
  const brassMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xdcb05c,
      roughness: 0.18,
      metalness: 0.94,
      clearcoat: 0.8,
      anisotropy: 0.75,
      envMapIntensity: 1.9,
    })
  );
  const alabasterGlowMat = track(
    new THREE.MeshStandardMaterial({
      color: 0xfff8eb,
      emissive: 0xffd596,
      emissiveIntensity: 1.55,
      roughness: 0.28,
    })
  );
  const fireplaceEmberMat = track(
    new THREE.MeshStandardMaterial({
      color: 0xff9f40,
      emissive: 0xff7b1c,
      emissiveIntensity: 2.4,
      roughness: 0.2,
    })
  );
  const creamBoucleMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xf6f0e7,
      roughness: 0.92,
      metalness: 0.0,
      sheen: 0.72,
      sheenRoughness: 0.78,
      sheenColor: new THREE.Color(0xfff9f0),
    })
  );
  const leatherCharcoalMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0x1e2430,
      roughness: 0.44,
      metalness: 0.06,
      sheen: 0.35,
      sheenColor: new THREE.Color(0x475569),
    })
  );
  const cognacLeatherMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0x8f4d2c,
      roughness: 0.42,
      metalness: 0.06,
      sheen: 0.45,
      sheenColor: new THREE.Color(0xd99b6c),
    })
  );
  const warmTerracottaMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xc26d48,
      roughness: 0.82,
      metalness: 0.02,
      sheen: 0.68,
      sheenColor: new THREE.Color(0xffb48a),
    })
  );
  const interiorGlassTableMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xc7ddf2,
      roughness: 0.04,
      metalness: 0.16,
      transparent: true,
      opacity: 0.48,
      clearcoat: 1.0,
    })
  );

  // Shared High-Craft Architectural Materials (Sandstone, Dark Graphite, Terracotta, Patinated Bronze, Champagne Metallic & Deep Emerald)
  const travertineMat = track(
    new THREE.MeshStandardMaterial({
      color: initialDarkMode ? 0x282d38 : 0xe8decb,
      map: claddingPbr.map,
      normalMap: claddingPbr.normalMap,
      normalScale: new THREE.Vector2(0.32, 0.32),
      roughnessMap: claddingPbr.roughnessMap,
      roughness: 0.6,
      metalness: 0.05,
    })
  );
  applyGroundAO(travertineMat, 2.2, 0.22);

  const obsidianBasaltMat = track(
    new THREE.MeshStandardMaterial({
      color: initialDarkMode ? 0x0e131d : 0x1c2129,
      map: claddingPbr.map,
      normalMap: claddingPbr.normalMap,
      normalScale: new THREE.Vector2(0.4, 0.4),
      roughnessMap: claddingPbr.roughnessMap,
      roughness: 0.54,
      metalness: 0.22,
    })
  );
  applyGroundAO(obsidianBasaltMat, 2.4, 0.24);

  const terracottaMat = track(
    new THREE.MeshStandardMaterial({
      color: initialDarkMode ? 0x7a422b : 0xb86b4b,
      map: claddingPbr.map,
      normalMap: claddingPbr.normalMap,
      normalScale: new THREE.Vector2(0.35, 0.35),
      roughnessMap: claddingPbr.roughnessMap,
      roughness: 0.7,
      metalness: 0.04,
    })
  );
  applyGroundAO(terracottaMat, 2.0, 0.22);

  const brushedTitaniumMat = track(
    new THREE.MeshPhysicalMaterial({
      color: initialDarkMode ? 0x141a24 : 0x222730,
      roughness: 0.24,
      metalness: 0.86,
      clearcoat: 0.6,
      clearcoatRoughness: 0.12,
      envMapIntensity: 1.68,
    })
  );

  const bronzeMat = track(
    new THREE.MeshPhysicalMaterial({
      color: initialDarkMode ? 0x6e4c2c : 0x8c6239,
      roughness: 0.25,
      metalness: 0.84,
      clearcoat: 0.55,
      clearcoatRoughness: 0.14,
      envMapIntensity: 1.7,
    })
  );

  const silverSteelMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xd4ba8b,
      roughness: 0.18,
      metalness: 0.9,
      clearcoat: 0.78,
      envMapIntensity: 1.8,
    })
  );

  const teakWoodMat = track(
    new THREE.MeshStandardMaterial({
      color: initialDarkMode ? 0x5c3e26 : 0x8c5a34,
      map: woodPbr.map,
      normalMap: woodPbr.normalMap,
      normalScale: new THREE.Vector2(0.55, 0.55),
      roughnessMap: woodPbr.roughnessMap,
      roughness: 0.54,
      metalness: 0.06,
    })
  );

  const archGlassRailMat = track(
    new THREE.MeshPhysicalMaterial({
      color: initialDarkMode ? 0x142e28 : 0x1e4a3d,
      roughness: 0.05,
      metalness: 0.22,
      transparent: true,
      opacity: 0.52,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      envMapIntensity: 1.85,
    })
  );

  const reflectionPoolMat = track(
    new THREE.MeshPhysicalMaterial({
      color: initialDarkMode ? 0x071224 : 0x123a34,
      roughness: 0.04,
      metalness: 0.18,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      reflectivity: 1.0,
      envMapIntensity: 2.0,
    })
  );

  const poolEdgeGlowMat = track(
    new THREE.MeshStandardMaterial({
      color: initialDarkMode ? 0xf4cf84 : 0xd4ba8b,
      emissive: initialDarkMode ? 0xe8a84a : 0x000000,
      emissiveIntensity: initialDarkMode ? 1.45 : 0.0,
      roughness: 0.18,
      metalness: 0.65,
    })
  );

  // Recessed warm amber soffit & step linear LED strips (clean champagne bronze in daylight, warm amber glow at night)
  const archWarmLedMat = track(
    new THREE.MeshStandardMaterial({
      color: initialDarkMode ? 0xfce7b2 : 0xd4ba8b,
      emissive: 0xe8a84a,
      emissiveIntensity: initialDarkMode ? 1.85 : 0.0,
      roughness: 0.18,
      metalness: 0.55,
    })
  );

  // Crisp recessed interior room backing material (warm amber lounge glow at night behind emerald/bronze glass)
  const interiorRoomMat = track(
    new THREE.MeshStandardMaterial({
      color: initialDarkMode ? 0xfce2b0 : 0x1b242e,
      emissive: initialDarkMode ? 0xf6c978 : 0x000000,
      emissiveIntensity: initialDarkMode ? 0.62 : 0.0,
      roughness: 0.85,
      metalness: 0.02,
    })
  );

  const lawnMat = track(
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: initialDarkMode ? grassPbr.darkMap : grassPbr.lightMap,
      normalMap: grassPbr.normalMap,
      normalScale: new THREE.Vector2(0.44, 0.44),
      roughnessMap: grassPbr.roughnessMap,
      roughness: 0.9,
      metalness: 0.02,
    })
  );

  const pebbleBedMat = track(
    new THREE.MeshStandardMaterial({
      color: initialDarkMode ? 0x161a22 : 0x5c5b56,
      roughness: 0.9,
      metalness: 0.04,
    })
  );

  const foliageCardMat = track(
    new THREE.MeshStandardMaterial({
      color: initialDarkMode ? 0x16281c : 0x56643c,
      map: leafClusterTex,
      alphaTest: 0.4,
      side: THREE.DoubleSide,
      roughness: 0.85,
      metalness: 0.0,
    })
  );

  const ornamentalGrassMat = track(
    new THREE.MeshStandardMaterial({
      color: initialDarkMode ? 0x13241a : 0x1f4e37,
      roughness: 0.88,
      metalness: 0.02,
    })
  );

  const skyTerraceGardenMat = track(
    new THREE.MeshStandardMaterial({
      color: initialDarkMode ? 0x182b1e : 0x465a34,
      roughness: 0.88,
      metalness: 0.02,
    })
  );

  const courtyardBloomMat = track(
    new THREE.MeshStandardMaterial({
      color: initialDarkMode ? 0xb86b4b : 0xc97352,
      roughness: 0.68,
      metalness: 0.04,
    })
  );

  const courtyardRosetteGeo = track(createCourtyardRosetteGeometry());

  const contactMat = track(
    new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: initialDarkMode ? 0.54 : 0.28,
    })
  );

  const houses: HouseInstanceRef[] = [];
  const hitboxes: THREE.Mesh[] = [];
  const plaqueThemeEntries: {
    mat: THREE.MeshStandardMaterial;
    dayTex: THREE.CanvasTexture;
    nightTex: THREE.CanvasTexture;
  }[] = [];

  services.slice(0, HOUSE_PLACEMENTS.length).forEach((service, idx) => {
    const placement = HOUSE_PLACEMENTS[idx];
    const pal = SERVICE_HOUSE_PALETTES[idx % SERVICE_HOUSE_PALETTES.length];

    const houseRoot = new THREE.Group();
    houseRoot.name = `modern-service-residence-${service.id}`;
    houseRoot.position.set(...placement.position);
    houseRoot.rotation.y = placement.facingYaw;

    const wallMaterials: THREE.MeshStandardMaterial[] = [];
    const windowMaterials: THREE.MeshStandardMaterial[] = [];

    // Primary Architectural Wall Material (Honed Limestone / Obsidian Basalt / Architectural Concrete)
    const wallMat = track(
      new THREE.MeshStandardMaterial({
        color: initialDarkMode ? pal.nightWallHex : pal.dayWallHex,
        map: claddingPbr.map,
        normalMap: claddingPbr.normalMap,
        normalScale: new THREE.Vector2(0.38, 0.38),
        roughnessMap: claddingPbr.roughnessMap,
        roughness: pal.facadeStyle === 'slate' ? 0.58 : 0.68,
        metalness: pal.facadeStyle === 'slate' ? 0.2 : 0.06,
      })
    );
    applyGroundAO(wallMat, 2.8, 0.24);
    wallMaterials.push(wallMat);

    // High-Reflectance Architectural Floor-to-Ceiling Sapphire & Turquoise Curtain-Wall Glazing
    const winGlassMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        map: initialDarkMode ? winTex.nightMap : winTex.dayMap,
        emissive: initialDarkMode ? 0xf6c978 : 0x000000,
        emissiveMap: initialDarkMode ? winTex.nightEmissiveMap : null,
        emissiveIntensity: initialDarkMode ? 0.88 : 0.0,
        roughness: 0.04,
        metalness: 0.24,
        clearcoat: 1.0,
        clearcoatRoughness: 0.02,
        reflectivity: 1.0,
        envMapIntensity: 2.05,
      })
    );
    windowMaterials.push(winGlassMat);

    // Architectural Walnut / Obsidian Pivot Entry Door Leaf Material
    const doorLeafMat = track(
      new THREE.MeshStandardMaterial({
        color: pal.doorHex,
        map: woodPbr.map,
        normalMap: woodPbr.normalMap,
        normalScale: new THREE.Vector2(0.45, 0.45),
        roughness: 0.36,
        metalness: 0.14,
      })
    );

    // =========================================================================
    // 1. ARCHITECTURAL ESTATE PLOT, LANDSCAPED LAWN, FLOATING STONE STEPS & CONTACT AO
    // =========================================================================
    const lawn = new THREE.Mesh(track(new THREE.BoxGeometry(15.2, 0.14, 15.8)), lawnMat);
    lawn.position.set(0, 0.07, 1.35);
    lawn.receiveShadow = quality.shadowsEnabled;
    houseRoot.add(lawn);

    // Sleek Low Honed-Travertine Perimeter Garden Curb Wall
    const leftWall = new THREE.Mesh(track(new THREE.BoxGeometry(0.28, 0.44, 15.6)), travertineMat);
    leftWall.position.set(-7.52, 0.28, 1.35);
    const rightWall = new THREE.Mesh(track(new THREE.BoxGeometry(0.28, 0.44, 15.6)), travertineMat);
    rightWall.position.set(7.52, 0.28, 1.35);
    const frontLeftWall = new THREE.Mesh(
      track(new THREE.BoxGeometry(5.1, 0.44, 0.28)),
      travertineMat
    );
    frontLeftWall.position.set(-5.0, 0.28, 9.05);
    const frontRightWall = new THREE.Mesh(
      track(new THREE.BoxGeometry(5.1, 0.44, 0.28)),
      travertineMat
    );
    frontRightWall.position.set(5.0, 0.28, 9.05);
    houseRoot.add(leftWall, rightWall, frontLeftWall, frontRightWall);

    // Minimalist Brushed-Titanium & Glass Entry Gate Piers with subtle vertical LED accent
    [-2.45, 2.45].forEach((gx) => {
      const pier = new THREE.Mesh(track(new THREE.BoxGeometry(0.44, 1.15, 0.44)), obsidianBasaltMat);
      pier.position.set(gx, 0.62, 9.05);
      pier.castShadow = quality.shadowsEnabled;
      const pierLed = new THREE.Mesh(track(new THREE.BoxGeometry(0.08, 0.85, 0.46)), archWarmLedMat);
      pierLed.position.set(gx, 0.64, 9.05);
      houseRoot.add(pier, pierLed);
    });

    // Architectural Brushed-Titanium & Brass Service Plaque mounted beside the Entry Gate!
    const dayPlaqueTex = track(
      createHousePlaqueTexture(
        String(idx + 1),
        service.title,
        service.tagline,
        pal.accentCss,
        maxAnisotropy,
        false
      )
    );
    const nightPlaqueTex = track(
      createHousePlaqueTexture(
        String(idx + 1),
        service.title,
        service.tagline,
        pal.accentCss,
        maxAnisotropy,
        true
      )
    );
    const plaqueMat = track(
      new THREE.MeshStandardMaterial({
        map: initialDarkMode ? nightPlaqueTex : dayPlaqueTex,
        emissive: initialDarkMode ? 0xffffff : 0x000000,
        emissiveMap: initialDarkMode ? nightPlaqueTex : null,
        emissiveIntensity: initialDarkMode ? 0.52 : 0.0,
        roughness: 0.24,
        metalness: 0.14,
      })
    );
    plaqueThemeEntries.push({ mat: plaqueMat, dayTex: dayPlaqueTex, nightTex: nightPlaqueTex });
    const plaqueAssembly = new THREE.Group();
    plaqueAssembly.position.set(-2.45, 0.88, 9.31);
    plaqueAssembly.rotation.x = -0.14;
    const plaqueBacking = new THREE.Mesh(
      track(new THREE.BoxGeometry(1.18, 0.42, 0.05)),
      brushedTitaniumMat
    );
    const plaqueBezel = new THREE.Mesh(track(new THREE.BoxGeometry(1.22, 0.45, 0.03)), brassMat);
    plaqueBezel.position.z = -0.015;
    const plaqueFace = new THREE.Mesh(track(new THREE.PlaneGeometry(1.1, 0.365)), plaqueMat);
    plaqueFace.position.z = 0.028;
    plaqueAssembly.add(plaqueBacking, plaqueBezel, plaqueFace);
    houseRoot.add(plaqueAssembly);

    // Distance-Adaptive Close-Up Architectural Trim LOD (<95m camera range reveals brass collars & carved garden plinths)
    const closeDetailGroup = new THREE.Group();
    [-2.45, 2.45].forEach((gx) => {
      const cap = new THREE.Mesh(track(new THREE.BoxGeometry(0.52, 0.08, 0.52)), travertineMat);
      cap.position.set(gx, 1.23, 9.05);
      const collar = new THREE.Mesh(track(new THREE.BoxGeometry(0.47, 0.03, 0.47)), brassMat);
      collar.position.set(gx, 1.18, 9.05);
      closeDetailGroup.add(cap, collar);
    });
    [
      [-6.05, 0.24, 8.2, 0.85, 0.42],
      [-5.35, 0.2, 8.5, 0.62, 0.34],
      [6.05, 0.24, 8.2, 0.85, 0.42],
      [5.35, 0.2, 8.45, 0.62, 0.34],
    ].forEach(([rx, ry, rz, rW, rH], bi) => {
      const carvedPlinth = new THREE.Mesh(
        track(createChamferedVolumeGeometry(rW, rH, rW * 0.85, 0.14)),
        bi % 2 === 0 ? obsidianBasaltMat : travertineMat
      );
      carvedPlinth.position.set(rx, ry, rz);
      carvedPlinth.rotation.y = bi * 0.6;
      closeDetailGroup.add(carvedPlinth);
    });
    const detailLod = new THREE.LOD();
    detailLod.addLevel(closeDetailGroup, 0);
    detailLod.addLevel(new THREE.Group(), 95);
    houseRoot.add(detailLod);

    // Floating Large-Format Travertine Stepping Pavers with subtle under-glow linear LEDs!
    const paverBed = new THREE.Mesh(track(new THREE.BoxGeometry(3.2, 0.08, 4.9)), pebbleBedMat);
    paverBed.position.set(0, 0.14, 6.75);
    houseRoot.add(paverBed);
    for (let s = 0; s < 5; s++) {
      const pz = 8.45 - s * 0.92;
      const slab = new THREE.Mesh(track(new THREE.BoxGeometry(2.55, 0.12, 0.72)), travertineMat);
      slab.position.set(0, 0.22, pz);
      slab.receiveShadow = quality.shadowsEnabled;
      slab.castShadow = quality.shadowsEnabled;
      const underLed = new THREE.Mesh(
        track(new THREE.BoxGeometry(2.35, 0.03, 0.05)),
        archWarmLedMat
      );
      underLed.position.set(0, 0.17, pz + 0.35);
      houseRoot.add(slab, underLed);
    }

    // Subtle Architectural Sapphire Selection Halo Frame along Walkway
    const highlightRingMat = track(
      new THREE.MeshStandardMaterial({
        color: pal.accentHex,
        emissive: pal.accentHex,
        emissiveIntensity: 0.0,
        roughness: 0.25,
        metalness: 0.45,
      })
    );
    [-1.46, 1.46].forEach((rx) => {
      const strip = new THREE.Mesh(
        track(new THREE.BoxGeometry(0.07, 0.06, 4.65)),
        highlightRingMat
      );
      strip.position.set(rx, 0.18, 6.65);
      houseRoot.add(strip);
    });

    const contactShadow = new THREE.Mesh(track(new THREE.PlaneGeometry(14.8, 12.6)), contactMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.set(0, 0.155, -0.2);
    houseRoot.add(contactShadow);

    // =========================================================================
    // 2. STANDARDIZED ULTRA-LUXURY ARCHITECTURAL PIVOT ENTRY PORTAL (z = 3.98)
    // =========================================================================
    const stepBase = new THREE.Mesh(track(new THREE.BoxGeometry(3.5, 0.24, 1.35)), travertineMat);
    stepBase.position.set(0, 0.24, 4.48);
    stepBase.receiveShadow = quality.shadowsEnabled;
    const stepTop = new THREE.Mesh(track(new THREE.BoxGeometry(3.15, 0.22, 1.0)), travertineMat);
    stepTop.position.set(0, 0.38, 4.25);
    stepTop.receiveShadow = quality.shadowsEnabled;
    const stepLed = new THREE.Mesh(track(new THREE.BoxGeometry(3.0, 0.035, 0.05)), archWarmLedMat);
    stepLed.position.set(0, 0.28, 4.74);
    houseRoot.add(stepBase, stepTop, stepLed);

    // =========================================================================
    // 2B. PALATIAL WALK-IN 3D LUXURY PENTHOUSE & ATELIER INTERIOR (Revealed When Door Opens!)
    // Herringbone oak parquet with Calacatta Oro marble border, silk woven rug,
    // coffered cove ceiling, multi-ring brass & alabaster chandelier, bookmatched marble
    // fireplace wall, fluted walnut & brass ribs, gallery canvases & bespoke designer suites!
    // =========================================================================
    const portalGlowMat = track(
      new THREE.MeshBasicMaterial({
        color: 0xffefd2,
        transparent: true,
        opacity: 0.32,
      })
    );
    const interiorGroup = new THREE.Group();
    interiorGroup.name = `house-interior-${idx}`;

    // Satin-Lacquered Herringbone Oak Parquet Floor + Honed Calacatta Marble Border Inlay
    const intFloor = new THREE.Mesh(track(new THREE.PlaneGeometry(5.6, 7.1)), interiorFloorMat);
    intFloor.rotation.x = -Math.PI / 2;
    intFloor.position.set(0, 0.47, 0.45);
    intFloor.receiveShadow = quality.shadowsEnabled;

    // Marble floor perimeter trim strips framing the herringbone field
    [-2.58, 2.58].forEach((bx) => {
      const mStrip = new THREE.Mesh(track(new THREE.BoxGeometry(0.32, 0.014, 6.9)), calacattaMarbleMat);
      mStrip.position.set(bx, 0.476, 0.45);
      interiorGroup.add(mStrip);
    });
    const backMarbleBorder = new THREE.Mesh(
      track(new THREE.BoxGeometry(5.5, 0.014, 0.34)),
      calacattaMarbleMat
    );
    backMarbleBorder.position.set(0, 0.476, -2.84);
    interiorGroup.add(backMarbleBorder);

    // Tailored Woven Cashmere & Silk Area Rug with Service-Matched Brass/Charcoal Border
    const rugTex = track(createLuxuryAreaRugTexture(pal.accentCss, maxAnisotropy, highRes));
    const houseRugMat = track(
      new THREE.MeshPhysicalMaterial({
        map: rugTex,
        roughness: 0.94,
        metalness: 0.0,
        sheen: 0.42,
        sheenColor: new THREE.Color(0xf7efe4),
      })
    );
    const intRug = new THREE.Mesh(track(new THREE.BoxGeometry(3.85, 0.028, 4.15)), houseRugMat);
    intRug.position.set(0, 0.486, -0.35);
    interiorGroup.add(intFloor, intRug);

    // Architectural Limewash Side Walls, Back Wall & Recessed Coffered Tray Ceiling
    const backWall = new THREE.Mesh(track(new THREE.BoxGeometry(5.65, 3.12, 0.14)), interiorWallMat);
    backWall.position.set(0, 2.02, -3.02);
    const leftIntWall = new THREE.Mesh(track(new THREE.BoxGeometry(0.14, 3.12, 7.1)), interiorWallMat);
    leftIntWall.position.set(-2.78, 2.02, 0.45);
    const rightIntWall = new THREE.Mesh(track(new THREE.BoxGeometry(0.14, 3.12, 7.1)), interiorWallMat);
    rightIntWall.position.set(2.78, 2.02, 0.45);

    // Lower Coffered Ceiling Rim + Elevated Illuminated Central Vault Tray
    const ceilingOuter = new THREE.Mesh(track(new THREE.PlaneGeometry(5.6, 7.1)), interiorCeilingMat);
    ceilingOuter.rotation.x = Math.PI / 2;
    ceilingOuter.position.set(0, 3.52, 0.45);
    const ceilingTrayRim = new THREE.Mesh(
      track(new THREE.BoxGeometry(4.25, 0.12, 5.25)),
      interiorWainscotMat
    );
    ceilingTrayRim.position.set(0, 3.49, -0.15);

    // Front Interior Framing Jambs flanking the 2.48m Doorway Opening
    [-2.02, 2.02].forEach((fx) => {
      const jambWall = new THREE.Mesh(track(new THREE.BoxGeometry(1.56, 3.12, 0.2)), interiorWallMat);
      jambWall.position.set(fx, 2.02, 3.88);
      interiorGroup.add(jambWall);
    });
    const headerWall = new THREE.Mesh(track(new THREE.BoxGeometry(2.6, 0.36, 0.2)), interiorWallMat);
    headerWall.position.set(0, 3.4, 3.88);

    // Honed Calacatta Marble Baseboard Skirting + Wainscoting Chair Rail along Side Walls
    const backBase = new THREE.Mesh(track(new THREE.BoxGeometry(5.55, 0.18, 0.06)), calacattaMarbleMat);
    backBase.position.set(0, 0.56, -2.93);
    [-2.69, 2.69].forEach((wx) => {
      const sBase = new THREE.Mesh(track(new THREE.BoxGeometry(0.06, 0.18, 6.9)), calacattaMarbleMat);
      sBase.position.set(wx, 0.56, 0.45);
      const wainscot = new THREE.Mesh(track(new THREE.BoxGeometry(0.04, 0.85, 6.8)), interiorWainscotMat);
      wainscot.position.set(wx, 1.04, 0.45);
      const chairRail = new THREE.Mesh(track(new THREE.BoxGeometry(0.07, 0.055, 6.85)), brassMat);
      chairRail.position.set(wx, 1.48, 0.45);
      interiorGroup.add(sBase, wainscot, chairRail);
    });

    // Bookmatched Calacatta Oro Marble Centerpiece Feature Wall + Brushed-Brass Perimeter Framing
    const marbleFeatureSlab = new THREE.Mesh(
      track(new THREE.BoxGeometry(3.48, 2.88, 0.08)),
      calacattaMarbleMat
    );
    marbleFeatureSlab.position.set(0, 2.02, -2.94);
    const marbleBrassTrimL = new THREE.Mesh(track(new THREE.BoxGeometry(0.04, 2.9, 0.1)), brassMat);
    marbleBrassTrimL.position.set(-1.75, 2.02, -2.93);
    const marbleBrassTrimR = marbleBrassTrimL.clone();
    marbleBrassTrimR.position.x = 1.75;

    // Fluted Vertical Walnut & Brushed-Brass Inlay Architectural Panelling flanking Marble Feature Wall
    for (let sx = -2.6; sx <= 2.6; sx += 0.16) {
      if (Math.abs(sx) < 1.82) continue;
      const isBrassInlay = Math.round(Math.abs(sx) * 10) % 3 === 0;
      const rib = new THREE.Mesh(
        track(new THREE.BoxGeometry(isBrassInlay ? 0.025 : 0.08, 2.86, isBrassInlay ? 0.095 : 0.08)),
        isBrassInlay ? brassMat : teakWoodMat
      );
      rib.position.set(sx, 2.02, -2.92);
      interiorGroup.add(rib);
    }

    // Recessed Continuous Warm Golden Architectural Cove Ceiling Perimeter
    const coveBack = new THREE.Mesh(track(new THREE.BoxGeometry(4.15, 0.05, 0.1)), portalGlowMat);
    coveBack.position.set(0, 3.43, -2.74);
    const coveFront = coveBack.clone();
    coveFront.position.z = 2.44;
    const coveLeft = new THREE.Mesh(track(new THREE.BoxGeometry(0.1, 0.05, 5.2)), portalGlowMat);
    coveLeft.position.set(-2.08, 3.43, -0.15);
    const coveRight = coveLeft.clone();
    coveRight.position.x = 2.08;

    // Grand Multi-Tier Brushed-Brass & Frosted-Alabaster Globe Studio Chandelier
    const chandCanopy = new THREE.Mesh(track(new THREE.CylinderGeometry(0.24, 0.24, 0.05, 24)), brassMat);
    chandCanopy.position.set(0, 3.43, -0.35);
    const chandStem = new THREE.Mesh(track(new THREE.CylinderGeometry(0.02, 0.02, 0.56, 10)), brassMat);
    chandStem.position.set(0, 3.16, -0.35);
    const chandOuterRing = new THREE.Mesh(track(new THREE.TorusGeometry(0.84, 0.028, 12, 42)), brassMat);
    chandOuterRing.rotation.x = Math.PI / 2;
    chandOuterRing.position.set(0, 2.88, -0.35);
    const chandInnerRing = new THREE.Mesh(track(new THREE.TorusGeometry(0.46, 0.022, 10, 32)), brassMat);
    chandInnerRing.rotation.x = Math.PI / 2;
    chandInnerRing.position.set(0, 2.98, -0.35);
    const chandGlowRing = new THREE.Mesh(
      track(new THREE.TorusGeometry(0.82, 0.018, 8, 42)),
      portalGlowMat
    );
    chandGlowRing.rotation.x = Math.PI / 2;
    chandGlowRing.position.set(0, 2.85, -0.35);
    interiorGroup.add(
      backWall,
      leftIntWall,
      rightIntWall,
      ceilingOuter,
      ceilingTrayRim,
      headerWall,
      backBase,
      marbleFeatureSlab,
      marbleBrassTrimL,
      marbleBrassTrimR,
      coveBack,
      coveFront,
      coveLeft,
      coveRight,
      chandCanopy,
      chandStem,
      chandOuterRing,
      chandInnerRing,
      chandGlowRing
    );

    // 8 Suspended Luminous Frosted-Alabaster Glass Light Globes around the Brass Chandelier!
    const globeGeo = track(new THREE.SphereGeometry(0.082, 12, 10));
    const globeCapGeo = track(new THREE.CylinderGeometry(0.032, 0.038, 0.05, 10));
    for (let g = 0; g < 8; g++) {
      const ang = (g / 8) * Math.PI * 2;
      const gx = Math.cos(ang) * 0.84;
      const gz = -0.35 + Math.sin(ang) * 0.84;
      const globe = new THREE.Mesh(globeGeo, alabasterGlowMat);
      globe.position.set(gx, 2.79, gz);
      const cap = new THREE.Mesh(globeCapGeo, brassMat);
      cap.position.set(gx, 2.88, gz);
      interiorGroup.add(globe, cap);
    }

    // Custom Illuminated Architectural Studio Feature-Wall Display + Linear Marble Fireplace Hearth!
    const displayTex = track(
      createStudioInteriorDisplayTexture(idx, service.title, service.tagline, maxAnisotropy)
    );
    const displayScreenMat = track(
      new THREE.MeshStandardMaterial({
        map: displayTex,
        emissive: 0xffffff,
        emissiveMap: displayTex,
        emissiveIntensity: 0.78,
        roughness: 0.16,
        metalness: 0.08,
      })
    );
    const screenFrame = new THREE.Mesh(
      track(new THREE.BoxGeometry(3.04, 1.48, 0.08)),
      brassMat
    );
    screenFrame.position.set(0, 2.28, -2.87);
    const screenBezel = new THREE.Mesh(
      track(new THREE.BoxGeometry(2.96, 1.4, 0.09)),
      brushedTitaniumMat
    );
    screenBezel.position.set(0, 2.28, -2.865);
    const screenFace = new THREE.Mesh(track(new THREE.PlaneGeometry(2.86, 1.32)), displayScreenMat);
    screenFace.position.set(0, 2.28, -2.815);

    // Floating Honed Calacatta Marble & Walnut Hearth Credenza + Linear Illuminated Ember Fireplace!
    const hearthBody = new THREE.Mesh(track(new THREE.BoxGeometry(3.32, 0.56, 0.58)), calacattaMarbleMat);
    hearthBody.position.set(0, 0.88, -2.63);
    const hearthTop = new THREE.Mesh(track(new THREE.BoxGeometry(3.42, 0.06, 0.64)), calacattaMarbleMat);
    hearthTop.position.set(0, 1.19, -2.63);
    const hearthBrassTrim = new THREE.Mesh(track(new THREE.BoxGeometry(3.44, 0.025, 0.65)), brassMat);
    hearthBrassTrim.position.set(0, 1.155, -2.63);
    const fireSlot = new THREE.Mesh(track(new THREE.BoxGeometry(1.72, 0.24, 0.14)), obsidianBasaltMat);
    fireSlot.position.set(0, 0.9, -2.38);
    const fireEmberStrip = new THREE.Mesh(
      track(new THREE.BoxGeometry(1.56, 0.08, 0.08)),
      fireplaceEmberMat
    );
    fireEmberStrip.position.set(0, 0.85, -2.35);
    const fireGlassFront = new THREE.Mesh(
      track(new THREE.BoxGeometry(1.66, 0.2, 0.02)),
      interiorGlassTableMat
    );
    fireGlassFront.position.set(0, 0.9, -2.31);

    // Sculpted Ceramic & Brass Architectural Decor Vessels resting on the Hearth Mantel
    const vesselLeft = new THREE.Mesh(
      track(new THREE.CylinderGeometry(0.08, 0.13, 0.28, 16)),
      brassMat
    );
    vesselLeft.position.set(-1.35, 1.36, -2.56);
    const vesselSphere = new THREE.Mesh(track(new THREE.SphereGeometry(0.11, 14, 12)), creamBoucleMat);
    vesselSphere.position.set(1.32, 1.32, -2.56);
    interiorGroup.add(
      screenFrame,
      screenBezel,
      screenFace,
      hearthBody,
      hearthTop,
      hearthBrassTrim,
      fireSlot,
      fireEmberStrip,
      fireGlassFront,
      vesselLeft,
      vesselSphere
    );

    // Curated Museum Gallery Side-Wall Canvases + Brass Picture Lights + Alabaster Wall Sconces
    [-2.68, 2.68].forEach((wx, sideIdx) => {
      const sign = sideIdx === 0 ? 1 : -1;
      const artTex = track(createGalleryArtTexture(idx, sideIdx, maxAnisotropy, highRes));
      const artCanvasMat = track(
        new THREE.MeshStandardMaterial({
          map: artTex,
          roughness: 0.45,
          metalness: 0.02,
        })
      );
      const artFrame = new THREE.Mesh(track(new THREE.BoxGeometry(0.055, 1.24, 1.56)), brassMat);
      artFrame.position.set(wx + sign * 0.028, 2.22, -0.35);
      const artCanvas = new THREE.Mesh(track(new THREE.BoxGeometry(0.03, 1.12, 1.44)), artCanvasMat);
      artCanvas.position.set(wx + sign * 0.048, 2.22, -0.35);
      const artLightBar = new THREE.Mesh(track(new THREE.BoxGeometry(0.14, 0.035, 0.84)), brassMat);
      artLightBar.position.set(wx + sign * 0.11, 2.94, -0.35);
      const artLightGlow = new THREE.Mesh(
        track(new THREE.BoxGeometry(0.04, 0.025, 0.78)),
        alabasterGlowMat
      );
      artLightGlow.position.set(wx + sign * 0.14, 2.915, -0.35);
      interiorGroup.add(artFrame, artCanvas, artLightBar, artLightGlow);

      // Flanking Vertical Fluted Alabaster & Brass Wall Sconces along both Side Walls
      [-1.75, 1.05].forEach((sz) => {
        const scMount = new THREE.Mesh(track(new THREE.BoxGeometry(0.04, 0.28, 0.1)), brassMat);
        scMount.position.set(wx + sign * 0.03, 2.15, sz);
        const scTube = new THREE.Mesh(
          track(new THREE.CylinderGeometry(0.038, 0.038, 0.56, 12)),
          alabasterGlowMat
        );
        scTube.position.set(wx + sign * 0.075, 2.15, sz);
        interiorGroup.add(scMount, scTube);
      });
    });

    // Twin Sculpted Architectural Indoor Olive Trees in Fluted Travertine Urns (Back Corners)
    [-2.25, 2.25].forEach((ux, ui) => {
      const urn = new THREE.Mesh(
        track(new THREE.CylinderGeometry(0.28, 0.19, 0.52, 16)),
        calacattaMarbleMat
      );
      urn.position.set(ux, 0.73, -2.42);
      const urnRing = new THREE.Mesh(track(new THREE.TorusGeometry(0.27, 0.02, 8, 24)), brassMat);
      urnRing.rotation.x = Math.PI / 2;
      urnRing.position.set(ux, 0.98, -2.42);
      const stem = new THREE.Mesh(
        track(new THREE.CylinderGeometry(0.028, 0.048, 1.05, 8)),
        teakWoodMat
      );
      stem.position.set(ux, 1.38, -2.42);
      stem.rotation.z = ui === 0 ? -0.08 : 0.08;
      interiorGroup.add(urn, urnRing, stem);

      // Layered Botanical Foliage Cards (no blocky dodecahedron blobs!)
      [0, Math.PI * 0.45, Math.PI * 0.9].forEach((rot, ci) => {
        const card = new THREE.Mesh(track(new THREE.PlaneGeometry(0.95, 0.95)), foliageCardMat);
        card.position.set(ux + (ci - 1) * 0.05, 2.02 + ci * 0.08, -2.42);
        card.rotation.y = rot;
        card.rotation.x = 0.12;
        interiorGroup.add(card);
      });
    });

    // Helper: Tailored Curved Upholstered Luxury Lounge Chair (Beveled Seat + Curved Back + Brass Frame)
    const addLuxuryChair = (
      cx: number,
      cz: number,
      rotY: number,
      fabricMat: THREE.Material
    ) => {
      const ch = new THREE.Group();
      ch.position.set(cx, 0.49, cz);
      ch.rotation.y = rotY;
      // 4 tapered brushed-brass stiletto legs
      [
        [-0.26, -0.24],
        [0.26, -0.24],
        [-0.26, 0.24],
        [0.26, 0.24],
      ].forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(track(new THREE.CylinderGeometry(0.022, 0.014, 0.34, 8)), brassMat);
        leg.position.set(lx, 0.17, lz);
        ch.add(leg);
      });
      const brassPlinth = new THREE.Mesh(track(new THREE.BoxGeometry(0.62, 0.035, 0.58)), brassMat);
      brassPlinth.position.set(0, 0.35, 0);
      const seatCushion = new THREE.Mesh(track(new THREE.BoxGeometry(0.64, 0.16, 0.6)), fabricMat);
      seatCushion.position.set(0, 0.45, 0.02);
      const backWrap = new THREE.Mesh(
        track(new THREE.CylinderGeometry(0.34, 0.34, 0.46, 16, 1, false, Math.PI * 0.72, Math.PI * 1.56)),
        fabricMat
      );
      backWrap.position.set(0, 0.68, -0.04);
      ch.add(brassPlinth, seatCushion, backWrap);
      interiorGroup.add(ch);
    };

    // Helper: Sculptural Fluted Calacatta Marble & Brass Coffee Table + Art Books & Ceramic Bowl
    const addLuxuryCoffeeTable = (tx: number, tz: number, radius = 0.72) => {
      const tbl = new THREE.Group();
      tbl.position.set(tx, 0.49, tz);
      const ped = new THREE.Mesh(
        track(new THREE.CylinderGeometry(radius * 0.42, radius * 0.48, 0.34, 24)),
        calacattaMarbleMat
      );
      ped.position.set(0, 0.17, 0);
      const pedBrass = new THREE.Mesh(
        track(new THREE.TorusGeometry(radius * 0.46, 0.018, 8, 28)),
        brassMat
      );
      pedBrass.rotation.x = Math.PI / 2;
      pedBrass.position.set(0, 0.03, 0);
      const top = new THREE.Mesh(
        track(new THREE.CylinderGeometry(radius, radius * 0.96, 0.055, 32)),
        calacattaMarbleMat
      );
      top.position.set(0, 0.37, 0);
      const topRim = new THREE.Mesh(track(new THREE.TorusGeometry(radius, 0.014, 8, 32)), brassMat);
      topRim.rotation.x = Math.PI / 2;
      topRim.position.set(0, 0.395, 0);
      // Stacked Architectural Coffee Table Monographs + Brass Centerpiece Vessel
      const book1 = new THREE.Mesh(track(new THREE.BoxGeometry(0.32, 0.038, 0.24)), obsidianBasaltMat);
      book1.position.set(-0.18, 0.415, 0.08);
      book1.rotation.y = 0.22;
      const book2 = new THREE.Mesh(track(new THREE.BoxGeometry(0.28, 0.032, 0.21)), creamBoucleMat);
      book2.position.set(-0.17, 0.45, 0.08);
      book2.rotation.y = 0.12;
      const vase = new THREE.Mesh(track(new THREE.SphereGeometry(0.085, 14, 12)), brassMat);
      vase.scale.set(1, 1.35, 1);
      vase.position.set(0.22, 0.49, -0.1);
      tbl.add(ped, pedBrass, top, topRim, book1, book2, vase);
      interiorGroup.add(tbl);
    };

    // Service-Specific Bespoke Luxury Designer Suites Inside Each House!
    if (idx === 0) {
      // HOUSE 01 (E-Commerce Solutions): Flagship Mayfair Boutique Salon with Marble Counter & Illuminated Crystal Vitrines
      const counterBase = new THREE.Mesh(track(new THREE.BoxGeometry(2.2, 0.88, 0.78)), calacattaMarbleMat);
      counterBase.position.set(0, 0.93, -0.55);
      const brassReveal = new THREE.Mesh(track(new THREE.BoxGeometry(2.22, 0.05, 0.8)), brassMat);
      brassReveal.position.set(0, 0.52, -0.55);
      const counterTop = new THREE.Mesh(track(new THREE.BoxGeometry(2.3, 0.06, 0.86)), calacattaMarbleMat);
      counterTop.position.set(0, 1.39, -0.55);
      const topBrass = new THREE.Mesh(track(new THREE.BoxGeometry(2.32, 0.025, 0.88)), brassMat);
      topBrass.position.set(0, 1.43, -0.55);
      interiorGroup.add(counterBase, brassReveal, counterTop, topBrass);

      // Twin Illuminated Museum Crystal Display Vitrines with Brass Frames & Sculptural Luxury Artifacts
      [-1.75, 1.75].forEach((px) => {
        const ped = new THREE.Mesh(track(new THREE.BoxGeometry(0.72, 0.88, 0.72)), obsidianBasaltMat);
        ped.position.set(px, 0.93, -0.35);
        const pedBrass = new THREE.Mesh(track(new THREE.BoxGeometry(0.74, 0.03, 0.74)), brassMat);
        pedBrass.position.set(px, 1.38, -0.35);
        const vitrine = new THREE.Mesh(track(new THREE.BoxGeometry(0.64, 0.68, 0.64)), interiorGlassTableMat);
        vitrine.position.set(px, 1.74, -0.35);
        const riser = new THREE.Mesh(track(new THREE.CylinderGeometry(0.18, 0.2, 0.14, 16)), creamBoucleMat);
        riser.position.set(px, 1.46, -0.35);
        const artifact = new THREE.Mesh(track(new THREE.OctahedronGeometry(0.17, 1)), brassMat);
        artifact.position.set(px, 1.74, -0.35);
        interiorGroup.add(ped, pedBrass, vitrine, riser, artifact);
      });
      // Twin Tufted Cream Boucle Hospitality Poufs for VIP Clients
      [-0.65, 0.65].forEach((bx) => {
        const poufBase = new THREE.Mesh(track(new THREE.CylinderGeometry(0.32, 0.3, 0.06, 20)), brassMat);
        poufBase.position.set(bx, 0.52, 0.45);
        const poufTop = new THREE.Mesh(track(new THREE.CylinderGeometry(0.33, 0.32, 0.34, 20)), creamBoucleMat);
        poufTop.position.set(bx, 0.72, 0.45);
        interiorGroup.add(poufBase, poufTop);
      });
    } else if (idx === 1) {
      // HOUSE 02 (Web Development): Partner's Walnut & Calacatta Marble Atelier + Dual Studio Displays
      const deskTop = new THREE.Mesh(track(new THREE.BoxGeometry(2.45, 0.075, 0.96)), teakWoodMat);
      deskTop.position.set(0, 1.24, -0.5);
      const deskMarbleInlay = new THREE.Mesh(track(new THREE.BoxGeometry(2.38, 0.025, 0.88)), calacattaMarbleMat);
      deskMarbleInlay.position.set(0, 1.28, -0.5);
      [-0.88, 0.88].forEach((lx) => {
        const ped = new THREE.Mesh(track(new THREE.CylinderGeometry(0.14, 0.18, 0.74, 16)), calacattaMarbleMat);
        ped.position.set(lx, 0.86, -0.5);
        const pedRing = new THREE.Mesh(track(new THREE.TorusGeometry(0.16, 0.015, 8, 20)), brassMat);
        pedRing.rotation.x = Math.PI / 2;
        pedRing.position.set(lx, 0.52, -0.5);
        interiorGroup.add(ped, pedRing);
      });
      // Dual Sleek Studio Displays + Brass Architect's Lamp
      [-0.46, 0.46].forEach((mx, mi) => {
        const stand = new THREE.Mesh(track(new THREE.BoxGeometry(0.05, 0.22, 0.05)), brassMat);
        stand.position.set(mx, 1.4, -0.62);
        const mon = new THREE.Mesh(track(new THREE.BoxGeometry(0.86, 0.46, 0.035)), brushedTitaniumMat);
        mon.position.set(mx, 1.58, -0.59);
        mon.rotation.y = mi === 0 ? 0.14 : -0.14;
        const glow = new THREE.Mesh(track(new THREE.PlaneGeometry(0.8, 0.4)), displayScreenMat);
        glow.position.set(mx, 1.58, -0.57);
        glow.rotation.y = mi === 0 ? 0.14 : -0.14;
        interiorGroup.add(stand, mon, glow);
      });
      const lampBase = new THREE.Mesh(track(new THREE.CylinderGeometry(0.11, 0.13, 0.04, 14)), brassMat);
      lampBase.position.set(-1.02, 1.31, -0.38);
      const lampStem = new THREE.Mesh(track(new THREE.CylinderGeometry(0.014, 0.014, 0.42, 8)), brassMat);
      lampStem.position.set(-1.02, 1.52, -0.38);
      const lampDome = new THREE.Mesh(track(new THREE.ConeGeometry(0.16, 0.13, 16)), brassMat);
      lampDome.position.set(-0.98, 1.72, -0.36);
      interiorGroup.add(deskTop, deskMarbleInlay, lampBase, lampStem, lampDome);
      addLuxuryChair(0, 0.35, Math.PI, cognacLeatherMat);
      addLuxuryChair(-1.45, 0.55, 0.55, creamBoucleMat);
    } else if (idx === 2) {
      // HOUSE 03 (Branding & Design): Bespoke Mayfair Plush Boucle Curved Sofa Salon & Travertine Coffee Table
      const sofaPlinth = new THREE.Mesh(track(new THREE.BoxGeometry(2.42, 0.1, 0.92)), teakWoodMat);
      sofaPlinth.position.set(-0.35, 0.56, -0.98);
      const sofaSeat = new THREE.Mesh(track(new THREE.BoxGeometry(2.38, 0.24, 0.86)), creamBoucleMat);
      sofaSeat.position.set(-0.35, 0.72, -0.96);
      const sofaBack = new THREE.Mesh(track(new THREE.BoxGeometry(2.42, 0.54, 0.22)), creamBoucleMat);
      sofaBack.position.set(-0.35, 1.04, -1.29);
      [-1.44, 0.74].forEach((ax) => {
        const arm = new THREE.Mesh(track(new THREE.BoxGeometry(0.22, 0.42, 0.86)), creamBoucleMat);
        arm.position.set(ax, 0.94, -0.96);
        interiorGroup.add(arm);
      });
      // Contrasting Silk Terracotta & Brass-Toned Throw Pillows
      [-1.08, -0.35, 0.38].forEach((px, pi) => {
        const pil = new THREE.Mesh(
          track(new THREE.BoxGeometry(0.36, 0.32, 0.12)),
          pi === 1 ? brassMat : warmTerracottaMat
        );
        pil.position.set(px, 0.96, -1.12);
        pil.rotation.x = -0.22;
        pil.rotation.z = (pi - 1) * 0.08;
        interiorGroup.add(pil);
      });
      interiorGroup.add(sofaPlinth, sofaSeat, sofaBack);
      addLuxuryCoffeeTable(-0.32, 0.12, 0.68);
      addLuxuryChair(1.52, -0.18, -0.58, warmTerracottaMat);
    } else if (idx === 3) {
      // HOUSE 04 (Digital Marketing & SEO): Smoked-Glass & Brass Executive Boardroom Suite
      const confTop = new THREE.Mesh(track(new THREE.BoxGeometry(2.55, 0.065, 1.3)), interiorGlassTableMat);
      confTop.position.set(0, 1.24, -0.25);
      const confBrassRim = new THREE.Mesh(track(new THREE.BoxGeometry(2.58, 0.03, 1.33)), brassMat);
      confBrassRim.position.set(0, 1.21, -0.25);
      [-0.72, 0.72].forEach((px) => {
        const ped = new THREE.Mesh(track(new THREE.CylinderGeometry(0.22, 0.26, 0.72, 20)), calacattaMarbleMat);
        ped.position.set(px, 0.85, -0.25);
        interiorGroup.add(ped);
      });
      // Centerpiece Brass Hospitality Tray & Glass Carafe
      const tray = new THREE.Mesh(track(new THREE.CylinderGeometry(0.24, 0.22, 0.025, 20)), brassMat);
      tray.position.set(0, 1.285, -0.25);
      const carafe = new THREE.Mesh(track(new THREE.CylinderGeometry(0.045, 0.075, 0.24, 14)), interiorGlassTableMat);
      carafe.position.set(0, 1.41, -0.25);
      interiorGroup.add(confTop, confBrassRim, tray, carafe);
      addLuxuryChair(-0.75, 0.62, Math.PI, leatherCharcoalMat);
      addLuxuryChair(0.75, 0.62, Math.PI, leatherCharcoalMat);
      addLuxuryChair(-0.75, -1.12, 0, leatherCharcoalMat);
      addLuxuryChair(0.75, -1.12, 0, leatherCharcoalMat);
    } else if (idx === 4) {
      // HOUSE 05 (Web Application Development): Calacatta Waterfall Interactive Design Bar & Stools
      const island = new THREE.Mesh(track(new THREE.BoxGeometry(2.5, 0.82, 1.05)), calacattaMarbleMat);
      island.position.set(0, 0.9, -0.35);
      const brassToe = new THREE.Mesh(track(new THREE.BoxGeometry(2.52, 0.06, 1.07)), brassMat);
      brassToe.position.set(0, 0.51, -0.35);
      interiorGroup.add(island, brassToe);
      [-0.68, 0.68].forEach((tx) => {
        const easel = new THREE.Mesh(track(new THREE.BoxGeometry(0.32, 0.08, 0.22)), brassMat);
        easel.position.set(tx, 1.35, -0.35);
        const tablet = new THREE.Mesh(track(new THREE.BoxGeometry(0.66, 0.44, 0.035)), displayScreenMat);
        tablet.position.set(tx, 1.5, -0.35);
        tablet.rotation.x = -0.45;
        // Boucle Bar Stool with Brass Footrest Ring
        const stStem = new THREE.Mesh(track(new THREE.CylinderGeometry(0.035, 0.05, 0.6, 10)), brassMat);
        stStem.position.set(tx, 0.79, 0.58);
        const stRing = new THREE.Mesh(track(new THREE.TorusGeometry(0.18, 0.014, 8, 24)), brassMat);
        stRing.rotation.x = Math.PI / 2;
        stRing.position.set(tx, 0.68, 0.58);
        const stSeat = new THREE.Mesh(track(new THREE.CylinderGeometry(0.24, 0.22, 0.14, 18)), creamBoucleMat);
        stSeat.position.set(tx, 1.12, 0.58);
        interiorGroup.add(easel, tablet, stStem, stRing, stSeat);
      });
    } else {
      // HOUSE 06 (Hosting & Maintenance): Glass & Brass Private Vault Racks + Marble Command Lounge
      [-2.02, 2.02].forEach((rx) => {
        const rack = new THREE.Mesh(track(new THREE.BoxGeometry(0.84, 2.28, 0.76)), obsidianBasaltMat);
        rack.position.set(rx, 1.62, -1.25);
        const brassTrim = new THREE.Mesh(track(new THREE.BoxGeometry(0.86, 2.3, 0.03)), brassMat);
        brassTrim.position.set(rx, 1.62, -0.87);
        const rackGlass = new THREE.Mesh(track(new THREE.BoxGeometry(0.74, 2.14, 0.04)), interiorGlassTableMat);
        rackGlass.position.set(rx, 1.62, -0.85);
        interiorGroup.add(rack, brassTrim, rackGlass);
        for (let b = 0; b < 5; b++) {
          const led = new THREE.Mesh(
            track(new THREE.BoxGeometry(0.56, 0.04, 0.04)),
            b % 2 === 0 ? poolEdgeGlowMat : alabasterGlowMat
          );
          led.position.set(rx, 0.94 + b * 0.36, -0.86);
          interiorGroup.add(led);
        }
      });
      const cmdDesk = new THREE.Mesh(track(new THREE.BoxGeometry(2.05, 0.08, 0.84)), calacattaMarbleMat);
      cmdDesk.position.set(0, 1.24, -0.25);
      const cmdBase = new THREE.Mesh(track(new THREE.BoxGeometry(1.45, 0.72, 0.52)), teakWoodMat);
      cmdBase.position.set(0, 0.85, -0.25);
      interiorGroup.add(cmdDesk, cmdBase);
      addLuxuryChair(0, 0.55, Math.PI, leatherCharcoalMat);
    }

    houseRoot.add(interiorGroup);

    // Bronze & Champagne-Gold Deep Portal Frame + Vertical Glass Sidelight
    const doorFrameTop = new THREE.Mesh(
      track(new THREE.BoxGeometry(2.65, 0.18, 0.42)),
      bronzeMat
    );
    doorFrameTop.position.set(0, 3.24, 4.02);
    const doorFrameLeft = new THREE.Mesh(
      track(new THREE.BoxGeometry(0.16, 2.86, 0.42)),
      bronzeMat
    );
    doorFrameLeft.position.set(-1.24, 1.85, 4.02);
    const doorFrameRight = new THREE.Mesh(
      track(new THREE.BoxGeometry(0.16, 2.86, 0.42)),
      bronzeMat
    );
    doorFrameRight.position.set(1.24, 1.85, 4.02);

    // Narrow vertical floor-to-ceiling sapphire/gold sidelight glass beside the pivot door
    const sideLightGlass = new THREE.Mesh(
      track(new THREE.BoxGeometry(0.32, 2.72, 0.08)),
      winGlassMat
    );
    sideLightGlass.position.set(1.0, 1.84, 3.98);
    const sideLightDivider = new THREE.Mesh(
      track(new THREE.BoxGeometry(0.08, 2.76, 0.18)),
      brassMat
    );
    sideLightDivider.position.set(0.81, 1.84, 4.0);
    houseRoot.add(doorFrameTop, doorFrameLeft, doorFrameRight, sideLightGlass, sideLightDivider);

    // Hinged Oversized Contemporary Architectural Pivot Door (Preserves exact pivot (-0.94, 0.46, 3.98))
    const doorPivot = new THREE.Group();
    doorPivot.position.set(-0.94, 0.46, 3.98);

    const doorLeaf = new THREE.Mesh(track(new THREE.BoxGeometry(1.72, 2.72, 0.11)), doorLeafMat);
    doorLeaf.position.set(0.86, 1.36, 0);
    doorLeaf.castShadow = quality.shadowsEnabled;
    doorPivot.add(doorLeaf);

    // Precision horizontal architectural reveal grooves on the pivot door
    [0.68, 1.36, 2.04].forEach((gy) => {
      const groove = new THREE.Mesh(
        track(new THREE.BoxGeometry(1.66, 0.035, 0.125)),
        brushedTitaniumMat
      );
      groove.position.set(0.86, gy, 0.005);
      doorPivot.add(groove);
    });

    // Sleek Full-Height Vertical Brushed-Stainless Architectural Pull Bar Handle!
    const pullBar = new THREE.Mesh(
      track(new THREE.CylinderGeometry(0.026, 0.026, 1.85, 10)),
      silverSteelMat
    );
    pullBar.position.set(1.48, 1.38, 0.11);
    const pullTopMount = new THREE.Mesh(
      track(new THREE.CylinderGeometry(0.02, 0.02, 0.1, 8)),
      silverSteelMat
    );
    pullTopMount.rotation.x = Math.PI / 2;
    pullTopMount.position.set(1.48, 2.1, 0.06);
    const pullBotMount = pullTopMount.clone();
    pullBotMount.position.set(1.48, 0.66, 0.06);
    doorPivot.add(pullBar, pullTopMount, pullBotMount);
    houseRoot.add(doorPivot);

    // Minimalist Architectural Up/Down Wall-Washer Sconces flanking the Portal
    [-1.58, 1.58].forEach((lx) => {
      const sconceBody = new THREE.Mesh(
        track(new THREE.BoxGeometry(0.11, 0.46, 0.12)),
        brushedTitaniumMat
      );
      sconceBody.position.set(lx, 2.38, 4.14);
      const sconceGlow = new THREE.Mesh(
        track(new THREE.BoxGeometry(0.08, 0.06, 0.09)),
        archWarmLedMat
      );
      sconceGlow.position.set(lx, 2.14, 4.14);
      const sconceGlowTop = sconceGlow.clone();
      sconceGlowTop.position.set(lx, 2.62, 4.14);
      houseRoot.add(sconceBody, sconceGlow, sconceGlowTop);
    });

    // =========================================================================
    // 3. SHARED LUXURY ARCHITECTURAL COMPONENT HELPERS
    // =========================================================================

    /**
     * Adds a crisp recessed floor-to-ceiling curtain-wall glass bay with real 3D recessed interior depth,
     * dark anodized titanium surround, slim structural mullions, and optional soffit LED accent.
     */
    const addCurtainWallBay = (
      x: number,
      y: number,
      z: number,
      w: number,
      h: number,
      rotY = 0,
      opts?: { mullions?: number; transom?: boolean; recessLed?: boolean }
    ) => {
      const bay = new THREE.Group();
      bay.position.set(x, y, z);
      bay.rotation.y = rotY;

      // 3D Recessed Architectural Interior Backing Plane (creates genuine optical depth behind glass!)
      const backDepth = new THREE.Mesh(
        track(new THREE.PlaneGeometry(w - 0.14, h - 0.14)),
        interiorRoomMat
      );
      backDepth.position.set(0, 0, -0.18);
      bay.add(backDepth);

      // Primary Low-Iron Reflective Curtain-Wall Glass
      const glass = new THREE.Mesh(track(new THREE.BoxGeometry(w, h, 0.07)), winGlassMat);
      glass.position.set(0, 0, 0.02);
      bay.add(glass);

      // Precision Anodized Titanium Perimeter Frame
      const ft = 0.09;
      const fd = 0.28;
      const topBar = new THREE.Mesh(track(new THREE.BoxGeometry(w + ft * 2, ft, fd)), brushedTitaniumMat);
      topBar.position.set(0, h / 2 + ft / 2, 0.02);
      const botBar = new THREE.Mesh(track(new THREE.BoxGeometry(w + ft * 2, ft, fd)), brushedTitaniumMat);
      botBar.position.set(0, -h / 2 - ft / 2, 0.02);
      const lBar = new THREE.Mesh(track(new THREE.BoxGeometry(ft, h, fd)), brushedTitaniumMat);
      lBar.position.set(-w / 2 - ft / 2, 0, 0.02);
      const rBar = new THREE.Mesh(track(new THREE.BoxGeometry(ft, h, fd)), brushedTitaniumMat);
      rBar.position.set(w / 2 + ft / 2, 0, 0.02);
      bay.add(topBar, botBar, lBar, rBar);

      // Vertical Structural Bronze Mullions
      const mCount = opts?.mullions ?? (w > 3.2 ? 2 : 1);
      for (let m = 1; m <= mCount; m++) {
        const mx = -w / 2 + (w * m) / (mCount + 1);
        const mullion = new THREE.Mesh(
          track(new THREE.BoxGeometry(0.055, h, 0.12)),
          bronzeMat
        );
        mullion.position.set(mx, 0, 0.04);
        bay.add(mullion);
      }

      if (opts?.transom) {
        const transom = new THREE.Mesh(
          track(new THREE.BoxGeometry(w, 0.055, 0.12)),
          brassMat
        );
        transom.position.set(0, h * 0.22, 0.04);
        bay.add(transom);
      }

      if (opts?.recessLed) {
        const led = new THREE.Mesh(track(new THREE.BoxGeometry(w - 0.12, 0.035, 0.06)), archWarmLedMat);
        led.position.set(0, h / 2 - 0.03, 0.1);
        bay.add(led);
      }

      houseRoot.add(bay);
    };

    /** Adds a sleek vertical timber or titanium architectural brise-soleil louver screen */
    const addLouverScreen = (
      x: number,
      y: number,
      z: number,
      width: number,
      height: number,
      slats: number,
      mat: THREE.Material,
      rotY = 0
    ) => {
      const grp = new THREE.Group();
      grp.position.set(x, y, z);
      grp.rotation.y = rotY;
      const slatGeo = track(new THREE.BoxGeometry(0.075, height, 0.22));
      for (let i = 0; i < slats; i++) {
        const sx = slats === 1 ? 0 : -width / 2 + (width * i) / (slats - 1);
        const slat = new THREE.Mesh(slatGeo, mat);
        slat.position.set(sx, 0, 0);
        slat.castShadow = quality.shadowsEnabled;
        grp.add(slat);
      }
      houseRoot.add(grp);
    };

    /** Adds a frameless architectural glass balustrade with slim stainless top cap */
    const addGlassBalustrade = (x: number, y: number, z: number, len: number, rotY = 0) => {
      const railGrp = new THREE.Group();
      railGrp.position.set(x, y, z);
      railGrp.rotation.y = rotY;
      const pane = new THREE.Mesh(track(new THREE.BoxGeometry(len, 0.92, 0.05)), archGlassRailMat);
      pane.position.y = 0.46;
      const cap = new THREE.Mesh(track(new THREE.BoxGeometry(len + 0.04, 0.055, 0.08)), silverSteelMat);
      cap.position.y = 0.94;
      const shoe = new THREE.Mesh(track(new THREE.BoxGeometry(len, 0.08, 0.1)), brushedTitaniumMat);
      shoe.position.y = 0.04;
      railGrp.add(pane, cap, shoe);
      houseRoot.add(railGrp);
    };

    /** Adds a shallow mirror-reflective architectural water court with brass weir overflow & underwater LED trim */
    const addReflectionPool = (x: number, z: number, w: number, d: number) => {
      const rim = new THREE.Mesh(track(new THREE.BoxGeometry(w + 0.32, 0.24, d + 0.32)), obsidianBasaltMat);
      rim.position.set(x, 0.2, z);
      rim.receiveShadow = quality.shadowsEnabled;
      const weirRim = new THREE.Mesh(track(new THREE.BoxGeometry(w + 0.12, 0.04, d + 0.12)), brassMat);
      weirRim.position.set(x, 0.31, z);
      const water = new THREE.Mesh(track(new THREE.BoxGeometry(w, 0.18, d)), reflectionPoolMat);
      water.position.set(x, 0.25, z);
      const edgeLed = new THREE.Mesh(track(new THREE.BoxGeometry(w - 0.08, 0.03, 0.05)), poolEdgeGlowMat);
      edgeLed.position.set(x, 0.29, z + d / 2 - 0.04);
      houseRoot.add(rim, weirRim, water, edgeLed);
    };

    /** Adds a refined sculptural multi-stem ornamental olive/birch tree inside a collared stone planter with THREE.LOD */
    const addSculpturalTree = (x: number, z: number, heightScale = 1.0) => {
      const grp = new THREE.Group();
      grp.position.set(x, 0.14, z);

      // Sleek honed concrete planter trough + travertine coping collar
      const planter = new THREE.Mesh(
        track(new THREE.BoxGeometry(1.18, 0.56, 1.18)),
        obsidianBasaltMat
      );
      planter.position.y = 0.28;
      planter.castShadow = quality.shadowsEnabled;
      const planterCap = new THREE.Mesh(
        track(new THREE.BoxGeometry(1.26, 0.07, 1.26)),
        travertineMat
      );
      planterCap.position.y = 0.57;
      grp.add(planter, planterCap);

      // Multi-stem architectural silver-birch / olive trunk cluster
      const stems: [number, number, number, number][] = [
        [-0.08, 0.08, 0.12, 1.85],
        [0.1, -0.06, -0.14, 2.15],
        [0.02, 0.1, 0.06, 1.55],
      ];
      stems.forEach(([ox, oz, tilt, len]) => {
        const stem = new THREE.Mesh(
          track(new THREE.CylinderGeometry(0.038, 0.062, len * heightScale, 8)),
          teakWoodMat
        );
        stem.position.set(ox, 0.45 + (len * heightScale) * 0.5, oz);
        stem.rotation.z = tilt;
        stem.castShadow = quality.shadowsEnabled;
        grp.add(stem);
      });

      const lod = new THREE.LOD();
      const nearFoliage = new THREE.Group();
      const farFoliage = new THREE.Group();

      const leafSpecs: [number, number, number, number, number, number][] = [
        [0, 2.25 * heightScale, 0, 1.85 * heightScale, 0.2, 0.14],
        [0, 2.25 * heightScale, 0, 1.85 * heightScale, Math.PI * 0.52, -0.12],
        [0.25, 1.9 * heightScale, 0.18, 1.45 * heightScale, 1.05, 0.16],
        [-0.24, 1.95 * heightScale, -0.16, 1.45 * heightScale, -0.95, 0.14],
      ];
      leafSpecs.forEach(([lx, ly, lz, sz, ry, rx]) => {
        const planeGeo = track(new THREE.PlaneGeometry(sz, sz));
        const nearCard = new THREE.Mesh(planeGeo, foliageCardMat);
        nearCard.position.set(lx, ly, lz);
        nearCard.rotation.set(rx, ry, 0);
        nearFoliage.add(nearCard);

        const farCard = nearCard.clone();
        farFoliage.add(farCard);
      });

      // Extra intermediate overlapping bough cards for rich close-up foliage density (< 75m)
      const extraLeafSpecs: [number, number, number, number, number, number][] = [
        [0.14, 2.48 * heightScale, -0.22, 1.55 * heightScale, 2.1, -0.18],
        [-0.22, 2.42 * heightScale, 0.2, 1.55 * heightScale, -2.0, 0.18],
        [0.0, 2.65 * heightScale, 0.0, 1.65 * heightScale, 0.78, Math.PI * 0.38],
        [0.0, 2.15 * heightScale, 0.0, 1.75 * heightScale, -0.45, Math.PI * 0.42],
      ];
      extraLeafSpecs.forEach(([lx, ly, lz, sz, ry, rx]) => {
        const card = new THREE.Mesh(track(new THREE.PlaneGeometry(sz, sz)), foliageCardMat);
        card.position.set(lx, ly, lz);
        card.rotation.set(rx, ry, 0);
        nearFoliage.add(card);
      });

      lod.addLevel(nearFoliage, 0);
      lod.addLevel(farFoliage, 75);
      grp.add(lod);

      houseRoot.add(grp);
    };

    /** Adds a sleek modern linear stone planter bed with architectural ornamental grasses & multi-petal rosette blooms */
    const addLinearPlanter = (x: number, z: number, w: number, d = 0.72) => {
      const box = new THREE.Mesh(track(new THREE.BoxGeometry(w, 0.48, d)), obsidianBasaltMat);
      box.position.set(x, 0.36, z);
      box.castShadow = quality.shadowsEnabled;
      box.receiveShadow = quality.shadowsEnabled;
      const trim = new THREE.Mesh(track(new THREE.BoxGeometry(w + 0.06, 0.06, d + 0.06)), bronzeMat);
      trim.position.set(x, 0.62, z);
      houseRoot.add(box, trim);

      const tuftCount = Math.max(2, Math.floor(w / 0.85));
      for (let t = 0; t < tuftCount; t++) {
        const tx = x - w * 0.38 + (tuftCount === 1 ? 0 : (w * 0.76 * t) / (tuftCount - 1));
        const tuft = new THREE.Mesh(
          track(new THREE.ConeGeometry(0.28, 0.52, 7)),
          ornamentalGrassMat
        );
        tuft.position.set(tx, 0.82, z);
        tuft.scale.set(1.1, 0.85, 0.85);
        const flowerRosette = new THREE.Mesh(courtyardRosetteGeo, courtyardBloomMat);
        flowerRosette.position.set(tx + (t % 2 === 0 ? 0.14 : -0.14), 0.74, z + 0.18);
        flowerRosette.rotation.set(0.32, t * 1.1, 0);
        flowerRosette.scale.setScalar(1.25);
        houseRoot.add(tuft, flowerRosette);
      }
    };

    /** Adds a lush Singapore/Dubai elevated sky-garden planter terrace on roof decks and cantilevered ledges */
    const addPlantedRoofGarden = (x: number, y: number, z: number, w: number, d: number) => {
      const tray = new THREE.Mesh(track(new THREE.BoxGeometry(w + 0.16, 0.14, d + 0.16)), bronzeMat);
      tray.position.set(x, y, z);
      const turf = new THREE.Mesh(track(new THREE.BoxGeometry(w, 0.18, d)), skyTerraceGardenMat);
      turf.position.set(x, y + 0.08, z);
      turf.receiveShadow = quality.shadowsEnabled;
      houseRoot.add(tray, turf);

      const shrubCols = Math.max(2, Math.floor(w / 1.45));
      for (let s = 0; s < shrubCols; s++) {
        const sx = x - w * 0.36 + (shrubCols === 1 ? 0 : (w * 0.72 * s) / (shrubCols - 1));
        const mound = new THREE.Mesh(
          track(new THREE.CylinderGeometry(0.36, 0.44, 0.32, 7)),
          s % 2 === 0 ? ornamentalGrassMat : skyTerraceGardenMat
        );
        mound.position.set(sx, y + 0.28, z);
        houseRoot.add(mound);
      }
    };

    let roofPeakY = 8.4;

    // =========================================================================
    // 4. SIX GENUINELY DISTINCT SINGAPORE / DUBAI NEO-LUXURY ARCHITECTURAL VILLAS
    // =========================================================================
    if (placement.styleVariant === 'modern_gable') {
      // -----------------------------------------------------------------------
      // HOUSE 01 (Web Development): CANTILEVERED SANDSTONE, ANGLED PILOTIS & SKY-GARDEN PAVILION
      // Chamfered upper gallery cantilevered forward on sculpted angled steel V-columns,
      // teak timber soffit, vertical terracotta louver wing & front reflection pools!
      // -----------------------------------------------------------------------
      const plinth = new THREE.Mesh(
        track(createChamferedVolumeGeometry(12.0, 0.44, 9.4, 0.55)),
        travertineMat
      );
      plinth.position.set(0, 0.22, -0.35);
      plinth.receiveShadow = quality.shadowsEnabled;

      // Ground-floor dark graphite chamfered structural wings framing the walk-in studio interior cavity
      const gfLeft = new THREE.Mesh(
        track(createChamferedVolumeGeometry(2.6, 3.1, 8.2, 0.32)),
        obsidianBasaltMat
      );
      gfLeft.position.set(-4.12, 1.96, -0.15);
      gfLeft.castShadow = quality.shadowsEnabled;
      gfLeft.receiveShadow = quality.shadowsEnabled;

      const gfRight = new THREE.Mesh(
        track(createChamferedVolumeGeometry(2.6, 3.1, 8.2, 0.32)),
        obsidianBasaltMat
      );
      gfRight.position.set(4.12, 1.96, -0.15);
      gfRight.castShadow = quality.shadowsEnabled;
      gfRight.receiveShadow = quality.shadowsEnabled;

      // Sculpted Angled Structural Bronze V-Columns supporting the floating upper gallery
      [-4.95, 5.15].forEach((px) => {
        const vCol = new THREE.Mesh(track(new THREE.CylinderGeometry(0.08, 0.11, 3.45, 8)), bronzeMat);
        vCol.position.set(px, 1.98, 4.95);
        vCol.rotation.x = 0.26;
        vCol.castShadow = quality.shadowsEnabled;
        houseRoot.add(vCol);
      });

      // Upper Cantilevered Chamfered Sandstone Gallery Box
      const upperCantilever = new THREE.Mesh(
        track(createChamferedVolumeGeometry(11.8, 3.35, 9.8, 0.52)),
        wallMat
      );
      upperCantilever.position.set(0.3, 5.42, 0.85);
      upperCantilever.castShadow = quality.shadowsEnabled;
      upperCantilever.receiveShadow = quality.shadowsEnabled;

      // Warm Teak Timber Soffit Lining & Recessed Linear Warm-Amber Strip
      const soffit = new THREE.Mesh(track(new THREE.BoxGeometry(11.0, 0.14, 2.35)), teakWoodMat);
      soffit.position.set(0.3, 3.68, 4.55);
      const soffitLed = new THREE.Mesh(track(new THREE.BoxGeometry(10.6, 0.045, 0.08)), archWarmLedMat);
      soffitLed.position.set(0.3, 3.62, 5.58);

      // Aerodynamic Cantilevered Graphite Roof Fascia & Recessed Penthouse Glass Skylight Studio
      const roofFascia = new THREE.Mesh(
        track(createCantileveredAeroRoofGeometry(12.6, 0.34, 10.6, 0.45)),
        brushedTitaniumMat
      );
      roofFascia.position.set(0.3, 7.12, 0.85);
      roofFascia.castShadow = quality.shadowsEnabled;

      const skyStudio = new THREE.Mesh(
        track(createChamferedVolumeGeometry(5.6, 1.75, 5.2, 0.36)),
        obsidianBasaltMat
      );
      skyStudio.position.set(-1.6, 8.22, -0.8);
      skyStudio.castShadow = quality.shadowsEnabled;
      const skyRoof = new THREE.Mesh(
        track(createCantileveredAeroRoofGeometry(6.6, 0.24, 6.2, 0.28)),
        brushedTitaniumMat
      );
      skyRoof.position.set(-1.6, 9.1, -0.8);
      const skyLedCrown = new THREE.Mesh(
        track(new THREE.BoxGeometry(6.1, 0.05, 0.06)),
        poolEdgeGlowMat
      );
      skyLedCrown.position.set(-1.6, 9.06, 2.22);

      houseRoot.add(
        plinth,
        gfLeft,
        gfRight,
        upperCantilever,
        soffit,
        soffitLed,
        roofFascia,
        skyStudio,
        skyRoof,
        skyLedCrown
      );

      // Dramatic Floor-to-Ceiling Curtain-Wall Glazing with 3D Interior Depth
      addCurtainWallBay(-3.45, 1.98, 4.02, 3.15, 2.45, 0, { mullions: 2, recessLed: true });
      addCurtainWallBay(3.45, 1.98, 4.02, 3.15, 2.45, 0, { mullions: 2, recessLed: true });
      addCurtainWallBay(-2.4, 5.42, 5.78, 5.3, 2.55, 0, { mullions: 3, recessLed: true });
      addCurtainWallBay(3.55, 5.42, 5.78, 3.6, 2.55, 0, { mullions: 2, recessLed: true });
      addCurtainWallBay(-1.6, 8.22, 1.84, 4.4, 1.35, 0, { mullions: 2 });
      addCurtainWallBay(-5.52, 5.42, 0.9, 5.4, 2.45, -Math.PI / 2, { mullions: 2 });
      addCurtainWallBay(6.12, 5.42, 0.9, 5.4, 2.45, Math.PI / 2, { mullions: 2 });

      // Terracotta Architectural Brise-Soleil Privacy Louver Wing & Sky-Garden Terrace
      addLouverScreen(5.78, 5.42, 5.95, 1.45, 3.05, 7, terracottaMat, 0);
      addGlassBalustrade(2.8, 7.36, 5.85, 5.4, 0);
      addPlantedRoofGarden(3.4, 7.38, 2.4, 4.4, 2.6);

      // Twin Front Mirror-Reflective Infinity Water Courtyards flanking the Floating Steps!
      addReflectionPool(-4.4, 6.2, 4.1, 2.5);
      addReflectionPool(4.4, 6.2, 4.1, 2.5);
      addSculpturalTree(-6.2, 7.8, 1.15);
      addSculpturalTree(6.2, 7.8, 1.15);

      roofPeakY = 9.75;
    } else if (placement.styleVariant === 'georgian_brick') {
      // -----------------------------------------------------------------------
      // HOUSE 02 (E-Commerce): 3-LEVEL TERRACED GRAPHITE, BRONZE & BIOPHILIC EMERALD ATELIER
      // Chamfered tiered monoliths, sweeping curved sandstone sky-balcony ribbons,
      // vertical bronze brise-soleil fins & lush sky-garden pergola terrace!
      // -----------------------------------------------------------------------
      const plinth = new THREE.Mesh(
        track(createChamferedVolumeGeometry(11.8, 0.44, 9.4, 0.5)),
        travertineMat
      );
      plinth.position.set(0, 0.22, -0.35);

      // Ground Floor Chamfered Base flanking the open walk-in studio interior
      const gfLeft = new THREE.Mesh(
        track(createChamferedVolumeGeometry(2.6, 3.15, 8.4, 0.3)),
        wallMat
      );
      gfLeft.position.set(-4.12, 1.98, -0.2);
      gfLeft.castShadow = quality.shadowsEnabled;
      gfLeft.receiveShadow = quality.shadowsEnabled;

      const gfRight = new THREE.Mesh(
        track(createChamferedVolumeGeometry(2.6, 3.15, 8.4, 0.3)),
        wallMat
      );
      gfRight.position.set(4.12, 1.98, -0.2);
      gfRight.castShadow = quality.shadowsEnabled;
      gfRight.receiveShadow = quality.shadowsEnabled;

      // Sculpted Curved Sandstone Mid-Floor Balcony Slabs
      const slab1 = new THREE.Mesh(
        track(createCurvedRibbonCanopyGeometry(11.6, 0.36, 9.8)),
        travertineMat
      );
      slab1.position.set(0, 3.52, 0.35);
      slab1.castShadow = quality.shadowsEnabled;
      const slab1Led = new THREE.Mesh(track(new THREE.BoxGeometry(11.2, 0.045, 0.06)), archWarmLedMat);
      slab1Led.position.set(0, 3.48, 5.22);

      // Level 2 Chamfered Emerald-Bronze Atelier Volume
      const lvl2 = new THREE.Mesh(
        track(createChamferedVolumeGeometry(11.0, 3.05, 8.6, 0.48)),
        wallMat
      );
      lvl2.position.set(0, 5.36, -0.15);
      lvl2.castShadow = quality.shadowsEnabled;
      lvl2.receiveShadow = quality.shadowsEnabled;

      const slab2 = new THREE.Mesh(
        track(createCurvedRibbonCanopyGeometry(11.8, 0.38, 9.8)),
        travertineMat
      );
      slab2.position.set(0, 6.86, 0.35);
      slab2.castShadow = quality.shadowsEnabled;
      const slab2Led = new THREE.Mesh(track(new THREE.BoxGeometry(11.4, 0.045, 0.06)), archWarmLedMat);
      slab2Led.position.set(0, 6.82, 5.22);

      // Level 3 Stepped-Back Penthouse Showcase & Rooftop Teak-Bronze Pergola Sky-Garden
      const lvl3 = new THREE.Mesh(
        track(createChamferedVolumeGeometry(7.2, 2.55, 6.2, 0.38)),
        wallMat
      );
      lvl3.position.set(-1.5, 8.45, -1.1);
      lvl3.castShadow = quality.shadowsEnabled;
      const roofTop = new THREE.Mesh(
        track(createCantileveredAeroRoofGeometry(8.4, 0.28, 7.4, 0.32)),
        travertineMat
      );
      roofTop.position.set(-1.5, 9.72, -0.8);

      // Architectural Bronze Pergola Canopy spanning the Right Sky-Terrace!
      const pergolaFront = new THREE.Mesh(
        track(new THREE.BoxGeometry(3.8, 0.16, 0.16)),
        bronzeMat
      );
      pergolaFront.position.set(3.8, 9.75, 2.3);
      const pergolaPost = new THREE.Mesh(
        track(new THREE.BoxGeometry(0.16, 2.65, 0.16)),
        bronzeMat
      );
      pergolaPost.position.set(5.55, 8.42, 2.3);
      houseRoot.add(pergolaFront, pergolaPost);
      for (let pz = -3.4; pz <= 2.1; pz += 0.65) {
        const beam = new THREE.Mesh(track(new THREE.BoxGeometry(3.8, 0.12, 0.12)), teakWoodMat);
        beam.position.set(3.8, 9.72, pz);
        houseRoot.add(beam);
      }

      houseRoot.add(plinth, gfLeft, gfRight, slab1, slab1Led, lvl2, slab2, slab2Led, lvl3, roofTop);

      // Frameless Smoked-Emerald Glass Terrace Balustrades & Sky-Terrace Planters
      addGlassBalustrade(-3.1, 3.88, 5.15, 5.1, 0);
      addGlassBalustrade(3.1, 3.88, 5.15, 5.1, 0);
      addGlassBalustrade(0, 7.22, 5.15, 11.2, 0);
      addPlantedRoofGarden(3.8, 7.24, 0.2, 3.2, 4.6);

      // Dramatic Tall Showcase Windows & Vertical Bronze/Terracotta Fin Accents
      addCurtainWallBay(-3.3, 1.98, 4.02, 2.95, 2.45, 0, { mullions: 2, recessLed: true });
      addCurtainWallBay(3.45, 1.98, 4.02, 3.25, 2.45, 0, { mullions: 2, recessLed: true });
      addCurtainWallBay(-3.2, 5.36, 4.18, 3.3, 2.45, 0, { mullions: 2, recessLed: true });
      addCurtainWallBay(0.25, 5.36, 4.18, 2.5, 2.45, 0, { mullions: 1 });
      addCurtainWallBay(3.65, 5.36, 4.18, 3.2, 2.45, 0, { mullions: 2, recessLed: true });
      addCurtainWallBay(-1.5, 8.45, 2.04, 5.8, 2.0, 0, { mullions: 3, recessLed: true });
      addCurtainWallBay(-5.54, 5.36, -0.1, 4.6, 2.35, -Math.PI / 2, { mullions: 2 });
      addCurtainWallBay(5.54, 5.36, -0.1, 4.6, 2.35, Math.PI / 2, { mullions: 2 });

      addLouverScreen(-5.45, 5.36, 4.45, 0.95, 6.6, 5, bronzeMat, 0);
      addLinearPlanter(-4.4, 5.95, 3.9);
      addLinearPlanter(4.4, 5.95, 3.9);
      addSculpturalTree(-6.15, 7.2, 1.1);
      addSculpturalTree(6.15, 7.2, 1.1);

      roofPeakY = 10.45;
    } else if (placement.styleVariant === 'courtyard_villa') {
      // -----------------------------------------------------------------------
      // HOUSE 03 (Branding & Design): CURVED-CANOPY SANDSTONE, TERRACOTTA & TEAK COURTYARD VILLA
      // Sweeping sculpted architectural ribbon fascia, projecting terracotta & teak gallery wing,
      // sculptural jade reflection pool & planted sky-court!
      // -----------------------------------------------------------------------
      const plinth = new THREE.Mesh(
        track(createChamferedVolumeGeometry(12.4, 0.42, 9.6, 0.55)),
        travertineMat
      );
      plinth.position.set(0, 0.21, -0.2);

      // Recessed Ground Floor Sandstone & Terracotta Wings flanking the open studio interior
      const gfLeft = new THREE.Mesh(
        track(createChamferedVolumeGeometry(2.65, 3.05, 8.4, 0.3)),
        wallMat
      );
      gfLeft.position.set(-4.18, 1.94, -0.2);
      gfLeft.castShadow = quality.shadowsEnabled;
      gfLeft.receiveShadow = quality.shadowsEnabled;

      // Projecting Right Courtyard Gallery Pavilion clad in Warm Terracotta & Teak
      const teakGallery = new THREE.Mesh(
        track(createChamferedVolumeGeometry(2.9, 3.15, 10.2, 0.35)),
        terracottaMat
      );
      teakGallery.position.set(4.32, 1.98, 0.7);
      teakGallery.castShadow = quality.shadowsEnabled;
      teakGallery.receiveShadow = quality.shadowsEnabled;

      // Sweeping Curved Sandstone Ribbon Fascias (Custom Sculpted ExtrudeGeometry!)
      const lowerRibbon = new THREE.Mesh(
        track(createCurvedRibbonCanopyGeometry(12.0, 0.42, 10.0)),
        travertineMat
      );
      lowerRibbon.position.set(0, 3.52, 0.55);
      lowerRibbon.castShadow = quality.shadowsEnabled;

      const upperBody = new THREE.Mesh(
        track(createChamferedVolumeGeometry(11.4, 2.95, 8.8, 0.46)),
        wallMat
      );
      upperBody.position.set(0, 5.4, 0.15);
      upperBody.castShadow = quality.shadowsEnabled;
      upperBody.receiveShadow = quality.shadowsEnabled;

      const upperRibbon = new THREE.Mesh(
        track(createCurvedRibbonCanopyGeometry(12.6, 0.48, 10.4)),
        travertineMat
      );
      upperRibbon.position.set(0, 6.86, 0.55);
      upperRibbon.castShadow = quality.shadowsEnabled;

      const ribbonLed = new THREE.Mesh(track(new THREE.BoxGeometry(11.8, 0.05, 0.07)), archWarmLedMat);
      ribbonLed.position.set(0, 6.84, 5.76);

      // Sculpted Rooftop Skylight Lantern Pavilion
      const skylightCore = new THREE.Mesh(
        track(createChamferedVolumeGeometry(5.8, 1.15, 4.4, 0.32)),
        brushedTitaniumMat
      );
      skylightCore.position.set(-0.8, 7.9, -0.6);
      const skylightGlass = new THREE.Mesh(
        track(new THREE.BoxGeometry(5.4, 0.75, 4.52)),
        winGlassMat
      );
      skylightGlass.position.set(-0.8, 7.92, -0.6);

      houseRoot.add(
        plinth,
        gfLeft,
        teakGallery,
        lowerRibbon,
        upperBody,
        upperRibbon,
        ribbonLed,
        skylightCore,
        skylightGlass
      );

      addCurtainWallBay(-3.45, 1.96, 4.04, 3.2, 2.4, 0, { mullions: 2, recessLed: true });
      addCurtainWallBay(3.75, 2.0, 5.84, 3.25, 2.45, 0, { mullions: 2, recessLed: true });
      addCurtainWallBay(-2.85, 5.4, 4.58, 4.6, 2.35, 0, { mullions: 3, recessLed: true });
      addCurtainWallBay(2.9, 5.4, 4.58, 4.4, 2.35, 0, { mullions: 3, recessLed: true });
      addCurtainWallBay(-5.74, 5.4, 0.2, 4.8, 2.25, -Math.PI / 2, { mullions: 2 });
      addCurtainWallBay(5.74, 5.4, 0.2, 4.8, 2.25, Math.PI / 2, { mullions: 2 });

      addLouverScreen(-0.05, 5.4, 4.78, 1.05, 2.85, 6, teakWoodMat, 0);
      addGlassBalustrade(-2.4, 3.94, 5.42, 6.2, 0);
      addPlantedRoofGarden(3.8, 7.36, 1.4, 3.8, 3.4);

      addReflectionPool(-4.5, 6.3, 4.2, 2.8);
      addLinearPlanter(4.2, 7.1, 3.8);
      addSculpturalTree(-6.2, 8.1, 1.12);
      addSculpturalTree(6.2, 5.2, 1.2);

      roofPeakY = 9.05;
    } else if (placement.styleVariant === 'executive_hip') {
      // -----------------------------------------------------------------------
      // HOUSE 04 (Digital Marketing & SEO): GRAND DOUBLE-HEIGHT CHAMPAGNE & EMERALD EXECUTIVE VILLA
      // Monumental symmetrical double-height central glass atrium tower, cantilevered aero-edge
      // bronze canopy roof, slender twin-blade stone & bronze columns + rooftop garden terrace!
      // -----------------------------------------------------------------------
      const plinth = new THREE.Mesh(
        track(createChamferedVolumeGeometry(12.8, 0.48, 9.8, 0.6)),
        travertineMat
      );
      plinth.position.set(0, 0.24, -0.35);
      plinth.receiveShadow = quality.shadowsEnabled;

      // Twin Symmetrical Chamfered Flanking Wings cleanly framing the walk-in studio atrium
      [-4.55, 4.55].forEach((wx) => {
        const wing = new THREE.Mesh(
          track(createChamferedVolumeGeometry(3.2, 6.35, 8.6, 0.42)),
          wallMat
        );
        wing.position.set(wx, 3.62, -0.3);
        wing.castShadow = quality.shadowsEnabled;
        wing.receiveShadow = quality.shadowsEnabled;
        houseRoot.add(wing);

        const band = new THREE.Mesh(track(new THREE.BoxGeometry(3.42, 0.2, 8.85)), bronzeMat);
        band.position.set(wx, 3.62, -0.3);
        houseRoot.add(band);
      });

      // Central Soaring Upper Atrium Core rising cleanly ABOVE the open ground-floor studio interior!
      const centralCore = new THREE.Mesh(
        track(createChamferedVolumeGeometry(5.8, 4.5, 8.8, 0.38)),
        obsidianBasaltMat
      );
      centralCore.position.set(0, 5.88, -0.2);
      centralCore.castShadow = quality.shadowsEnabled;
      houseRoot.add(centralCore);

      // Dramatic Cantilevered Floating Aero-Edge Bronze-Graphite Roof Wing spanning the Estate!
      const mainAeroRoof = new THREE.Mesh(
        track(createCantileveredAeroRoofGeometry(13.8, 0.65, 10.6, 0.72)),
        brushedTitaniumMat
      );
      mainAeroRoof.position.set(0, 6.82, -0.1);
      mainAeroRoof.castShadow = quality.shadowsEnabled;

      // Elevated Atrium Crown Canopy with Champagne-Amber Skylight Halo!
      const atriumRoof = new THREE.Mesh(
        track(createCantileveredAeroRoofGeometry(6.4, 0.52, 9.8, 0.45)),
        bronzeMat
      );
      atriumRoof.position.set(0, 8.22, 0.25);
      atriumRoof.castShadow = quality.shadowsEnabled;

      const atriumCrownLed = new THREE.Mesh(
        track(new THREE.BoxGeometry(5.6, 0.08, 0.08)),
        poolEdgeGlowMat
      );
      atriumCrownLed.position.set(0, 8.2, 5.18);

      // Grand Floating Front Portico Canopy supported by 4 Slender Blade Columns
      const porticoCanopy = new THREE.Mesh(
        track(createCantileveredAeroRoofGeometry(5.6, 0.42, 2.35, 0.3)),
        travertineMat
      );
      porticoCanopy.position.set(0, 3.55, 5.05);
      porticoCanopy.castShadow = quality.shadowsEnabled;
      const porticoLed = new THREE.Mesh(track(new THREE.BoxGeometry(4.9, 0.045, 0.06)), archWarmLedMat);
      porticoLed.position.set(0, 3.52, 6.18);

      [-2.15, -1.75, 1.75, 2.15].forEach((cx) => {
        const blade = new THREE.Mesh(
          track(new THREE.BoxGeometry(0.14, 3.15, 0.46)),
          bronzeMat
        );
        blade.position.set(cx, 1.98, 5.85);
        blade.castShadow = quality.shadowsEnabled;
        houseRoot.add(blade);
      });

      houseRoot.add(mainAeroRoof, atriumRoof, atriumCrownLed, porticoCanopy, porticoLed);

      addCurtainWallBay(-4.1, 1.98, 4.04, 2.95, 2.45, 0, { mullions: 2, recessLed: true });
      addCurtainWallBay(4.1, 1.98, 4.04, 2.95, 2.45, 0, { mullions: 2, recessLed: true });
      addCurtainWallBay(-4.1, 5.25, 4.04, 2.95, 2.35, 0, { mullions: 2, recessLed: true });
      addCurtainWallBay(4.1, 5.25, 4.04, 2.95, 2.35, 0, { mullions: 2, recessLed: true });
      addCurtainWallBay(0, 5.95, 4.24, 3.7, 3.6, 0, { mullions: 2, transom: true, recessLed: true });
      addCurtainWallBay(-6.14, 5.2, -0.3, 4.8, 2.25, -Math.PI / 2, { mullions: 2 });
      addCurtainWallBay(6.14, 5.2, -0.3, 4.8, 2.25, Math.PI / 2, { mullions: 2 });

      addPlantedRoofGarden(-4.5, 7.24, 0.5, 2.8, 5.4);
      addPlantedRoofGarden(4.5, 7.24, 0.5, 2.8, 5.4);
      addLinearPlanter(-4.4, 5.65, 3.8);
      addLinearPlanter(4.4, 5.65, 3.8);
      addSculpturalTree(-6.2, 6.8, 1.18);
      addSculpturalTree(6.2, 6.8, 1.18);

      roofPeakY = 9.35;
    } else if (placement.styleVariant === 'contemporary_townhouse') {
      // -----------------------------------------------------------------------
      // HOUSE 05 (Web Hosting & Maintenance): INTERLOCKING TERRACOTTA, OLIVE & GRAPHITE CUBE RESIDENCE
      // Bold offset chamfered geometric volumes, exterior terracotta & teak brise-soleil
      // sun-shading fins, full-width sky-terrace garden & cantilevered pergola canopy!
      // -----------------------------------------------------------------------
      const plinth = new THREE.Mesh(
        track(createChamferedVolumeGeometry(11.6, 0.44, 9.2, 0.48)),
        travertineMat
      );
      plinth.position.set(0, 0.22, -0.25);

      [-4.12, 4.12].forEach((lx) => {
        const gf = new THREE.Mesh(
          track(createChamferedVolumeGeometry(2.6, 3.05, 8.4, 0.3)),
          obsidianBasaltMat
        );
        gf.position.set(lx, 1.96, -0.2);
        gf.castShadow = quality.shadowsEnabled;
        gf.receiveShadow = quality.shadowsEnabled;
        houseRoot.add(gf);
      });

      const midCube = new THREE.Mesh(
        track(createChamferedVolumeGeometry(11.4, 3.15, 9.2, 0.44)),
        wallMat
      );
      midCube.position.set(-0.45, 5.18, 0.25);
      midCube.castShadow = quality.shadowsEnabled;
      midCube.receiveShadow = quality.shadowsEnabled;

      const midFloorTrim = new THREE.Mesh(
        track(new THREE.BoxGeometry(11.7, 0.26, 9.5)),
        bronzeMat
      );
      midFloorTrim.position.set(-0.45, 3.56, 0.25);
      const midLed = new THREE.Mesh(track(new THREE.BoxGeometry(11.2, 0.045, 0.06)), archWarmLedMat);
      midLed.position.set(-0.45, 3.42, 4.98);

      const upperFloorTrim = new THREE.Mesh(
        track(new THREE.BoxGeometry(11.7, 0.28, 9.5)),
        bronzeMat
      );
      upperFloorTrim.position.set(-0.45, 6.86, 0.25);

      const pentCube = new THREE.Mesh(
        track(createChamferedVolumeGeometry(6.8, 2.55, 6.2, 0.38)),
        terracottaMat
      );
      pentCube.position.set(1.25, 8.28, -0.85);
      pentCube.castShadow = quality.shadowsEnabled;

      const pentCanopy = new THREE.Mesh(
        track(createCantileveredAeroRoofGeometry(10.8, 0.28, 7.8, 0.42)),
        brushedTitaniumMat
      );
      pentCanopy.position.set(-0.2, 9.56, -0.4);
      pentCanopy.castShadow = quality.shadowsEnabled;

      const pentCanopyLed = new THREE.Mesh(
        track(new THREE.BoxGeometry(10.0, 0.05, 0.06)),
        poolEdgeGlowMat
      );
      pentCanopyLed.position.set(-0.2, 9.52, 3.42);

      const entryCanopy = new THREE.Mesh(
        track(createCantileveredAeroRoofGeometry(3.8, 0.24, 1.85, 0.22)),
        brushedTitaniumMat
      );
      entryCanopy.position.set(0, 3.46, 5.05);

      houseRoot.add(
        plinth,
        midCube,
        midFloorTrim,
        midLed,
        upperFloorTrim,
        pentCube,
        pentCanopy,
        pentCanopyLed,
        entryCanopy
      );

      addGlassBalustrade(-0.45, 7.0, 4.86, 11.2, 0);
      addPlantedRoofGarden(-3.8, 7.02, 1.5, 3.2, 4.6);
      addLouverScreen(-4.85, 8.25, 1.2, 2.4, 2.55, 10, teakWoodMat, 0);
      addLouverScreen(5.15, 5.18, 4.95, 1.1, 3.05, 6, bronzeMat, 0);

      addCurtainWallBay(-3.35, 1.98, 4.04, 3.1, 2.45, 0, { mullions: 2, recessLed: true });
      addCurtainWallBay(3.35, 1.98, 4.04, 3.1, 2.45, 0, { mullions: 2, recessLed: true });
      addCurtainWallBay(-3.2, 5.18, 4.88, 4.2, 2.45, 0, { mullions: 3, recessLed: true });
      addCurtainWallBay(1.65, 5.18, 4.88, 4.4, 2.45, 0, { mullions: 3, recessLed: true });
      addCurtainWallBay(1.25, 8.28, 2.28, 5.6, 2.0, 0, { mullions: 3, recessLed: true });
      addCurtainWallBay(-6.18, 5.18, 0.25, 5.0, 2.35, -Math.PI / 2, { mullions: 2 });
      addCurtainWallBay(5.28, 5.18, 0.25, 5.0, 2.35, Math.PI / 2, { mullions: 2 });

      addLinearPlanter(-4.2, 5.7, 3.6);
      addLinearPlanter(4.2, 5.7, 3.6);
      addSculpturalTree(-6.0, 6.8, 1.15);
      addSculpturalTree(6.0, 6.8, 1.15);

      roofPeakY = 10.35;
    } else {
      // -----------------------------------------------------------------------
      // HOUSE 06 (Custom Web Tools & Apps): SOARING BUTTERFLY-ROOF ARCHITECTURAL GLASS, TEAK & BRONZE STUDIO
      // Dramatic twin-wing sculpted V-butterfly bronze-graphite roof with clerestory ribbon glazing,
      // chamfered sandstone gallery, warm horizontal walnut cladding & reflection pool courtyard!
      // -----------------------------------------------------------------------
      const plinth = new THREE.Mesh(
        track(createChamferedVolumeGeometry(12.2, 0.44, 9.4, 0.52)),
        travertineMat
      );
      plinth.position.set(0, 0.22, -0.2);

      const leftGroundWing = new THREE.Mesh(
        track(createChamferedVolumeGeometry(2.7, 3.15, 8.4, 0.3)),
        wallMat
      );
      leftGroundWing.position.set(-4.2, 2.0, -0.2);
      leftGroundWing.castShadow = quality.shadowsEnabled;
      leftGroundWing.receiveShadow = quality.shadowsEnabled;
      houseRoot.add(leftGroundWing);

      const leftVolume = new THREE.Mesh(
        track(createChamferedVolumeGeometry(7.2, 2.75, 8.4, 0.36)),
        wallMat
      );
      leftVolume.position.set(-1.95, 4.92, -0.2);
      leftVolume.castShadow = quality.shadowsEnabled;
      leftVolume.receiveShadow = quality.shadowsEnabled;

      // Projecting Right Double-Height Architectural Teak & Bronze Studio Wing!
      const walnutWing = new THREE.Mesh(
        track(createChamferedVolumeGeometry(3.0, 6.25, 9.6, 0.38)),
        teakWoodMat
      );
      walnutWing.position.set(4.35, 3.55, 0.45);
      walnutWing.castShadow = quality.shadowsEnabled;
      walnutWing.receiveShadow = quality.shadowsEnabled;

      const clerestoryBand = new THREE.Mesh(
        track(new THREE.BoxGeometry(11.4, 0.92, 8.5)),
        winGlassMat
      );
      clerestoryBand.position.set(0.3, 6.68, 0.05);

      const butterflyRoof = new THREE.Mesh(
        track(createButterflyRoofGeometry(13.4, 2.05, 11.2, 0.34)),
        brushedTitaniumMat
      );
      butterflyRoof.position.set(0.3, 6.82, 0.25);
      butterflyRoof.castShadow = quality.shadowsEnabled;
      butterflyRoof.receiveShadow = quality.shadowsEnabled;

      const overhangLedLeft = new THREE.Mesh(
        track(new THREE.BoxGeometry(6.3, 0.05, 0.07)),
        archWarmLedMat
      );
      overhangLedLeft.position.set(-2.95, 7.82, 5.76);
      overhangLedLeft.rotation.z = -0.295;

      const overhangLedRight = new THREE.Mesh(
        track(new THREE.BoxGeometry(6.4, 0.05, 0.07)),
        archWarmLedMat
      );
      overhangLedRight.position.set(3.55, 7.98, 5.76);
      overhangLedRight.rotation.z = 0.345;

      const porchCanopy = new THREE.Mesh(
        track(createCantileveredAeroRoofGeometry(3.95, 0.24, 1.95, 0.22)),
        bronzeMat
      );
      porchCanopy.position.set(0, 3.44, 4.82);
      porchCanopy.castShadow = quality.shadowsEnabled;
      const porchSoffit = new THREE.Mesh(track(new THREE.BoxGeometry(3.45, 0.07, 1.75)), teakWoodMat);
      porchSoffit.position.set(0, 3.35, 4.8);
      const porchLed = new THREE.Mesh(track(new THREE.BoxGeometry(3.3, 0.04, 0.06)), archWarmLedMat);
      porchLed.position.set(0, 3.32, 5.66);

      houseRoot.add(
        plinth,
        leftVolume,
        walnutWing,
        clerestoryBand,
        butterflyRoof,
        overhangLedLeft,
        overhangLedRight,
        porchCanopy,
        porchSoffit,
        porchLed
      );

      addCurtainWallBay(-3.5, 1.98, 4.04, 3.1, 2.45, 0, { mullions: 2, recessLed: true });
      addCurtainWallBay(-3.3, 4.85, 4.04, 3.6, 2.25, 0, { mullions: 2, recessLed: true });
      addCurtainWallBay(0.05, 4.85, 4.04, 2.35, 2.25, 0, { mullions: 1 });
      addCurtainWallBay(3.55, 3.48, 5.28, 3.55, 5.15, 0, {
        mullions: 2,
        transom: true,
        recessLed: true,
      });
      addCurtainWallBay(-5.58, 4.85, -0.2, 4.8, 2.2, -Math.PI / 2, { mullions: 2 });
      addCurtainWallBay(5.88, 3.55, 0.5, 5.0, 4.8, Math.PI / 2, { mullions: 3, transom: true });

      addReflectionPool(-4.4, 6.25, 4.1, 2.4);
      addLinearPlanter(4.2, 6.5, 3.8);
      addSculpturalTree(-6.2, 7.6, 1.18);
      addSculpturalTree(6.2, 7.6, 1.12);

      roofPeakY = 9.75;
    }

    // Warm Architectural Porch Downlight & Interior Studio Chandelier Ceiling Light
    const porchLight = new THREE.PointLight(0xffe0ad, initialDarkMode ? 2.35 : 0.22, 16, 1.55);
    porchLight.position.set(0, 3.05, 5.15);
    houseRoot.add(porchLight);

    // Positioned inside the furnished 3D studio room right beneath the brass ring chandelier!
    const portalLight = new THREE.PointLight(0xfff0d4, 1.15, 16, 1.35);
    portalLight.position.set(0, 2.85, 0.15);
    houseRoot.add(portalLight);

    // Dedicated Raycast Hitbox covering entire modern luxury villa footprint
    const hitbox = new THREE.Mesh(
      track(new THREE.BoxGeometry(13.2, 10.6, 12.6)),
      track(
        new THREE.MeshBasicMaterial({
          transparent: true,
          opacity: 0,
          depthWrite: false,
        })
      )
    );
    hitbox.position.set(0, 5.0, 0.4);
    hitbox.userData = { serviceIndex: idx };
    houseRoot.add(hitbox);
    hitboxes.push(hitbox);

    rootGroup.add(houseRoot);

    houses.push({
      serviceIndex: idx,
      root: houseRoot,
      doorPivot,
      portalLight,
      porchLight,
      portalGlowMat,
      windowMaterials,
      wallMaterials,
      highlightRingMat,
      hitbox,
      labelAnchorLocal: [0, roofPeakY + 0.55, 0.6],
      // Generous, spacious architectural establishing framing when clicking/approaching a house
      outsideCameraLocal: [0, 4.9, 22.8],
      outsideLookAtLocal: [0, 3.55, 1.8],
      // Glides right through the open pivot doorway into the palatial luxury 3D penthouse studio interior!
      doorwayCameraLocal: [0, 1.96, 2.75],
      doorwayLookAtLocal: [0, 1.72, -2.75],
    });
  });

  const applyTheme = (isDark: boolean) => {
    contactMat.opacity = isDark ? 0.54 : 0.28;
    travertineMat.color.setHex(isDark ? 0x282d38 : 0xe8decb);
    obsidianBasaltMat.color.setHex(isDark ? 0x0e131d : 0x1c2129);
    terracottaMat.color.setHex(isDark ? 0x7a422b : 0xb86b4b);
    brushedTitaniumMat.color.setHex(isDark ? 0x141a24 : 0x222730);
    bronzeMat.color.setHex(isDark ? 0x6e4c2c : 0x8c6239);
    teakWoodMat.color.setHex(isDark ? 0x5c3e26 : 0x8c5a34);
    archGlassRailMat.color.setHex(isDark ? 0x142e28 : 0x1e4a3d);
    reflectionPoolMat.color.setHex(isDark ? 0x071224 : 0x123a34);
    pebbleBedMat.color.setHex(isDark ? 0x161a22 : 0x5c5b56);
    foliageCardMat.color.setHex(isDark ? 0x16281c : 0x56643c);
    ornamentalGrassMat.color.setHex(isDark ? 0x13241a : 0x1f4e37);
    skyTerraceGardenMat.color.setHex(isDark ? 0x182b1e : 0x465a34);
    courtyardBloomMat.color.setHex(isDark ? 0xb86b4b : 0xc97352);

    poolEdgeGlowMat.color.setHex(isDark ? 0xf4cf84 : 0xd4ba8b);
    poolEdgeGlowMat.emissive.setHex(isDark ? 0xe8a84a : 0x000000);
    poolEdgeGlowMat.emissiveIntensity = isDark ? 1.45 : 0.0;

    archWarmLedMat.color.setHex(isDark ? 0xfce7b2 : 0xd4ba8b);
    archWarmLedMat.emissiveIntensity = isDark ? 1.85 : 0.0;

    interiorRoomMat.color.setHex(isDark ? 0xfce2b0 : 0x1b242e);
    interiorRoomMat.emissive.setHex(isDark ? 0xf6c978 : 0x000000);
    interiorRoomMat.emissiveIntensity = isDark ? 0.62 : 0.0;

    lawnMat.map = isDark ? grassPbr.darkMap : grassPbr.lightMap;
    lawnMat.needsUpdate = true;

    plaqueThemeEntries.forEach((p) => {
      const nextTex = isDark ? p.nightTex : p.dayTex;
      p.mat.map = nextTex;
      p.mat.emissive.setHex(isDark ? 0xffffff : 0x000000);
      p.mat.emissiveMap = isDark ? p.nightTex : null;
      p.mat.emissiveIntensity = isDark ? 0.52 : 0.0;
      p.mat.needsUpdate = true;
    });

    houses.forEach((h, idx) => {
      const pal = SERVICE_HOUSE_PALETTES[idx % SERVICE_HOUSE_PALETTES.length];
      h.wallMaterials.forEach((m) => {
        m.color.setHex(isDark ? pal.nightWallHex : pal.dayWallHex);
      });
      h.windowMaterials.forEach((m) => {
        m.map = isDark ? winTex.nightMap : winTex.dayMap;
        m.emissive.setHex(isDark ? 0xf6c978 : 0x000000);
        m.emissiveMap = isDark ? winTex.nightEmissiveMap : null;
        m.emissiveIntensity = isDark ? 0.88 : 0.0;
        m.needsUpdate = true;
      });
      h.portalGlowMat.color.setHex(isDark ? 0xffefd6 : 0xffffff);
      h.porchLight.intensity = isDark ? 2.35 : 0.22;
    });

  };

  return {
    group: rootGroup,
    houses,
    hitboxes,
    applyTheme,
    dispose: () => {
      disposables.forEach((d) => d.dispose());
    },
  };
}

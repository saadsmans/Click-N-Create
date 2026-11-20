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

  // High-Resolution Procedural ArchViz PBR Material Suites
  const claddingPbr = track(createArchitecturalCladdingPbr(maxAnisotropy));
  const grassPbr = track(createNaturalGrassPbrSet(maxAnisotropy, 3, 3));
  const woodPbr = track(createWoodGrainPbrSet(maxAnisotropy));
  const winTex = track(createResidentialWindowTextures(maxAnisotropy));
  const shadowTex = track(createContactShadowTexture());
  const leafClusterTex = track(createBotanicalLeafClusterTexture(maxAnisotropy));

  // Shared High-Craft Architectural Materials
  const travertineMat = track(
    new THREE.MeshStandardMaterial({
      color: initialDarkMode ? 0x3b4659 : 0xf2f0eb,
      map: claddingPbr.map,
      normalMap: claddingPbr.normalMap,
      normalScale: new THREE.Vector2(0.32, 0.32),
      roughnessMap: claddingPbr.roughnessMap,
      roughness: 0.62,
      metalness: 0.06,
    })
  );
  applyGroundAO(travertineMat, 2.2, 0.22);

  const obsidianBasaltMat = track(
    new THREE.MeshStandardMaterial({
      color: initialDarkMode ? 0x161f2e : 0x2a3342,
      map: claddingPbr.map,
      normalMap: claddingPbr.normalMap,
      normalScale: new THREE.Vector2(0.4, 0.4),
      roughnessMap: claddingPbr.roughnessMap,
      roughness: 0.56,
      metalness: 0.22,
    })
  );
  applyGroundAO(obsidianBasaltMat, 2.4, 0.24);

  const brushedTitaniumMat = track(
    new THREE.MeshPhysicalMaterial({
      color: initialDarkMode ? 0x202c40 : 0x324156,
      roughness: 0.22,
      metalness: 0.88,
      clearcoat: 0.65,
      clearcoatRoughness: 0.12,
      envMapIntensity: 1.75,
    })
  );

  const silverSteelMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xdbe6f3,
      roughness: 0.16,
      metalness: 0.94,
      clearcoat: 0.85,
      envMapIntensity: 1.85,
    })
  );

  const teakWoodMat = track(
    new THREE.MeshStandardMaterial({
      color: initialDarkMode ? 0x6b472b : 0xb37c4c,
      map: woodPbr.map,
      normalMap: woodPbr.normalMap,
      normalScale: new THREE.Vector2(0.55, 0.55),
      roughnessMap: woodPbr.roughnessMap,
      roughness: 0.56,
      metalness: 0.06,
    })
  );

  const archGlassRailMat = track(
    new THREE.MeshPhysicalMaterial({
      color: initialDarkMode ? 0x6ba8e5 : 0xcce6ff,
      roughness: 0.04,
      metalness: 0.18,
      transparent: true,
      opacity: 0.42,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      envMapIntensity: 1.9,
    })
  );

  const reflectionPoolMat = track(
    new THREE.MeshPhysicalMaterial({
      color: initialDarkMode ? 0x0b223d : 0x1b5c8a,
      roughness: 0.03,
      metalness: 0.16,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      reflectivity: 1.0,
      envMapIntensity: 2.1,
    })
  );

  const poolEdgeGlowMat = track(
    new THREE.MeshStandardMaterial({
      color: initialDarkMode ? 0xbae6fd : 0x93c5fd,
      emissive: 0x38bdf8,
      emissiveIntensity: initialDarkMode ? 1.85 : 0.12,
      roughness: 0.18,
    })
  );

  // Recessed warm-white architectural soffit & step linear LED strips (luxury ArchViz warmth against sapphire glass!)
  const archWarmLedMat = track(
    new THREE.MeshStandardMaterial({
      color: initialDarkMode ? 0xfff8ea : 0xe2e8f0,
      emissive: 0xffe4b5,
      emissiveIntensity: initialDarkMode ? 2.15 : 0.0,
      roughness: 0.15,
    })
  );

  // Crisp recessed interior room backing material (gives real 3D depth behind floor-to-ceiling curtain-wall glass)
  const interiorRoomMat = track(
    new THREE.MeshStandardMaterial({
      color: initialDarkMode ? 0xffe8c2 : 0x263448,
      emissive: initialDarkMode ? 0xffd79e : 0x000000,
      emissiveIntensity: initialDarkMode ? 0.55 : 0.0,
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
      roughness: 0.92,
      metalness: 0.02,
    })
  );

  const pebbleBedMat = track(
    new THREE.MeshStandardMaterial({
      color: initialDarkMode ? 0x1d2534 : 0x8e99a8,
      roughness: 0.94,
      metalness: 0.04,
    })
  );

  const foliageCardMat = track(
    new THREE.MeshStandardMaterial({
      color: initialDarkMode ? 0x1f3428 : 0x4f6846,
      map: leafClusterTex,
      alphaTest: 0.4,
      side: THREE.DoubleSide,
      roughness: 0.85,
      metalness: 0.0,
    })
  );

  const ornamentalGrassMat = track(
    new THREE.MeshStandardMaterial({
      color: initialDarkMode ? 0x1c3124 : 0x496141,
      roughness: 0.88,
      metalness: 0.02,
    })
  );

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

    // High-Reflectance Architectural Floor-to-Ceiling Sapphire Curtain-Wall Glazing
    const winGlassMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        map: initialDarkMode ? winTex.nightMap : winTex.dayMap,
        emissive: initialDarkMode ? 0xffe6bd : 0x000000,
        emissiveMap: initialDarkMode ? winTex.nightEmissiveMap : null,
        emissiveIntensity: initialDarkMode ? 0.92 : 0.0,
        roughness: 0.04,
        metalness: 0.22,
        clearcoat: 1.0,
        clearcoatRoughness: 0.02,
        reflectivity: 1.0,
        envMapIntensity: 1.95,
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

    // Deep Illuminated Architectural Foyer Backing behind Pivot Door
    const portalGlowMat = track(
      new THREE.MeshBasicMaterial({
        color: initialDarkMode ? 0xffefd6 : 0xffffff,
        transparent: true,
        opacity: 0.18,
      })
    );
    const foyerGlow = new THREE.Mesh(track(new THREE.PlaneGeometry(2.05, 2.75)), portalGlowMat);
    foyerGlow.position.set(0, 1.84, 3.84);
    houseRoot.add(foyerGlow);

    // Brushed-Titanium Deep Portal Frame + Vertical Glass Sidelight
    const doorFrameTop = new THREE.Mesh(
      track(new THREE.BoxGeometry(2.65, 0.18, 0.42)),
      brushedTitaniumMat
    );
    doorFrameTop.position.set(0, 3.24, 4.02);
    const doorFrameLeft = new THREE.Mesh(
      track(new THREE.BoxGeometry(0.16, 2.86, 0.42)),
      brushedTitaniumMat
    );
    doorFrameLeft.position.set(-1.24, 1.85, 4.02);
    const doorFrameRight = new THREE.Mesh(
      track(new THREE.BoxGeometry(0.16, 2.86, 0.42)),
      brushedTitaniumMat
    );
    doorFrameRight.position.set(1.24, 1.85, 4.02);

    // Narrow vertical floor-to-ceiling frosted/lit architectural sidelight glass beside the pivot door
    const sideLightGlass = new THREE.Mesh(
      track(new THREE.BoxGeometry(0.32, 2.72, 0.08)),
      winGlassMat
    );
    sideLightGlass.position.set(1.0, 1.84, 3.98);
    const sideLightDivider = new THREE.Mesh(
      track(new THREE.BoxGeometry(0.08, 2.76, 0.18)),
      brushedTitaniumMat
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

      // Vertical Structural Aluminum Mullions
      const mCount = opts?.mullions ?? (w > 3.2 ? 2 : 1);
      for (let m = 1; m <= mCount; m++) {
        const mx = -w / 2 + (w * m) / (mCount + 1);
        const mullion = new THREE.Mesh(
          track(new THREE.BoxGeometry(0.055, h, 0.12)),
          brushedTitaniumMat
        );
        mullion.position.set(mx, 0, 0.04);
        bay.add(mullion);
      }

      if (opts?.transom) {
        const transom = new THREE.Mesh(
          track(new THREE.BoxGeometry(w, 0.055, 0.12)),
          brushedTitaniumMat
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

    /** Adds a shallow mirror-reflective architectural water court with illuminated underwater edge trim */
    const addReflectionPool = (x: number, z: number, w: number, d: number) => {
      const rim = new THREE.Mesh(track(new THREE.BoxGeometry(w + 0.32, 0.24, d + 0.32)), obsidianBasaltMat);
      rim.position.set(x, 0.2, z);
      rim.receiveShadow = quality.shadowsEnabled;
      const water = new THREE.Mesh(track(new THREE.BoxGeometry(w, 0.18, d)), reflectionPoolMat);
      water.position.set(x, 0.25, z);
      const edgeLed = new THREE.Mesh(track(new THREE.BoxGeometry(w - 0.08, 0.03, 0.05)), poolEdgeGlowMat);
      edgeLed.position.set(x, 0.29, z + d / 2 - 0.04);
      houseRoot.add(rim, water, edgeLed);
    };

    /** Adds a refined sculptural multi-stem ornamental olive/birch tree inside an architectural stone planter */
    const addSculpturalTree = (x: number, z: number, heightScale = 1.0) => {
      const grp = new THREE.Group();
      grp.position.set(x, 0.14, z);

      // Sleek honed concrete planter trough
      const planter = new THREE.Mesh(
        track(new THREE.BoxGeometry(1.18, 0.56, 1.18)),
        obsidianBasaltMat
      );
      planter.position.y = 0.28;
      planter.castShadow = quality.shadowsEnabled;
      grp.add(planter);

      // Multi-stem architectural silver-birch / olive trunk cluster
      const stems: [number, number, number, number][] = [
        [-0.08, 0.08, 0.12, 1.85],
        [0.1, -0.06, -0.14, 2.15],
        [0.02, 0.1, 0.06, 1.55],
      ];
      stems.forEach(([ox, oz, tilt, len]) => {
        const stem = new THREE.Mesh(
          track(new THREE.CylinderGeometry(0.038, 0.062, len * heightScale, 7)),
          teakWoodMat
        );
        stem.position.set(ox, 0.45 + (len * heightScale) * 0.5, oz);
        stem.rotation.z = tilt;
        stem.castShadow = quality.shadowsEnabled;
        grp.add(stem);
      });

      // Layered botanical leaf cards (authentic architectural greenery, never blocky spheres!)
      const leafSpecs: [number, number, number, number, number][] = [
        [0, 2.25 * heightScale, 0, 1.85 * heightScale, 0.2],
        [0, 2.25 * heightScale, 0, 1.85 * heightScale, Math.PI * 0.52],
        [0.25, 1.9 * heightScale, 0.18, 1.45 * heightScale, 1.05],
        [-0.24, 1.95 * heightScale, -0.16, 1.45 * heightScale, -0.95],
      ];
      leafSpecs.forEach(([lx, ly, lz, sz, ry]) => {
        const card = new THREE.Mesh(track(new THREE.PlaneGeometry(sz, sz)), foliageCardMat);
        card.position.set(lx, ly, lz);
        card.rotation.y = ry;
        card.rotation.x = 0.14;
        grp.add(card);
      });

      houseRoot.add(grp);
    };

    /** Adds a sleek modern linear stone planter bed with architectural ornamental grasses */
    const addLinearPlanter = (x: number, z: number, w: number, d = 0.72) => {
      const box = new THREE.Mesh(track(new THREE.BoxGeometry(w, 0.48, d)), obsidianBasaltMat);
      box.position.set(x, 0.36, z);
      box.castShadow = quality.shadowsEnabled;
      box.receiveShadow = quality.shadowsEnabled;
      const trim = new THREE.Mesh(track(new THREE.BoxGeometry(w + 0.06, 0.06, d + 0.06)), travertineMat);
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
        houseRoot.add(tuft);
      }
    };

    let roofPeakY = 8.4;

    // =========================================================================
    // 4. SIX GENUINELY DISTINCT ULTRA-LUXURY CONTEMPORARY ARCHITECTURAL DESIGNS
    // =========================================================================
    if (placement.styleVariant === 'modern_gable') {
      // -----------------------------------------------------------------------
      // HOUSE 01 (Web Development): CANTILEVERED GLACIER TRAVERTINE & COBALT-GLASS PAVILION
      // Dramatic floating upper gallery cantilevered 2.2 units forward with teak soffit,
      // recessed LED channels, vertical walnut louver wing & dual front reflection pools!
      // -----------------------------------------------------------------------
      const plinth = new THREE.Mesh(track(new THREE.BoxGeometry(11.8, 0.42, 9.2)), travertineMat);
      plinth.position.set(0, 0.21, -0.35);
      plinth.receiveShadow = quality.shadowsEnabled;

      // Ground-floor dark basalt structural wings flanking the entry portal
      const gfLeft = new THREE.Mesh(track(new THREE.BoxGeometry(4.1, 3.1, 8.2)), obsidianBasaltMat);
      gfLeft.position.set(-3.35, 1.96, -0.15);
      gfLeft.castShadow = quality.shadowsEnabled;
      gfLeft.receiveShadow = quality.shadowsEnabled;

      const gfRight = new THREE.Mesh(track(new THREE.BoxGeometry(4.1, 3.1, 8.2)), obsidianBasaltMat);
      gfRight.position.set(3.35, 1.96, -0.15);
      gfRight.castShadow = quality.shadowsEnabled;
      gfRight.receiveShadow = quality.shadowsEnabled;

      // Upper Cantilevered Glacier Travertine Gallery Box (dramatically projecting over the entry!)
      const upperCantilever = new THREE.Mesh(track(new THREE.BoxGeometry(11.6, 3.35, 9.8)), wallMat);
      upperCantilever.position.set(0.3, 5.42, 0.85);
      upperCantilever.castShadow = quality.shadowsEnabled;
      upperCantilever.receiveShadow = quality.shadowsEnabled;

      // Warm Teak Timber Soffit Lining & Recessed Linear Warm-White LED Strip beneath the Cantilever!
      const soffit = new THREE.Mesh(track(new THREE.BoxGeometry(11.2, 0.14, 2.35)), teakWoodMat);
      soffit.position.set(0.3, 3.68, 4.6);
      const soffitLed = new THREE.Mesh(track(new THREE.BoxGeometry(10.8, 0.045, 0.08)), archWarmLedMat);
      soffitLed.position.set(0.3, 3.62, 5.62);

      // Crisp Dark Titanium Roof Fascia & Recessed Penthouse Glass Skylight Studio
      const roofFascia = new THREE.Mesh(
        track(new THREE.BoxGeometry(12.2, 0.28, 10.4)),
        brushedTitaniumMat
      );
      roofFascia.position.set(0.3, 7.22, 0.85);
      roofFascia.castShadow = quality.shadowsEnabled;

      const skyStudio = new THREE.Mesh(
        track(new THREE.BoxGeometry(5.6, 1.75, 5.2)),
        obsidianBasaltMat
      );
      skyStudio.position.set(-1.6, 8.22, -0.8);
      skyStudio.castShadow = quality.shadowsEnabled;
      const skyRoof = new THREE.Mesh(
        track(new THREE.BoxGeometry(6.4, 0.2, 6.0)),
        brushedTitaniumMat
      );
      skyRoof.position.set(-1.6, 9.18, -0.8);
      const skyLedCrown = new THREE.Mesh(
        track(new THREE.BoxGeometry(6.3, 0.05, 0.06)),
        poolEdgeGlowMat
      );
      skyLedCrown.position.set(-1.6, 9.08, 2.22);

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

      // Vertical Teak Architectural Brise-Soleil Privacy Louver Screen framing Right Wing
      addLouverScreen(5.78, 5.42, 5.95, 1.35, 3.05, 7, teakWoodMat, 0);
      addGlassBalustrade(2.8, 7.36, 5.85, 5.4, 0);

      // Twin Front Mirror-Reflective Infinity Water Courtyards flanking the Floating Steps!
      addReflectionPool(-4.4, 6.2, 4.1, 2.5);
      addReflectionPool(4.4, 6.2, 4.1, 2.5);
      addSculpturalTree(-6.2, 7.8, 1.15);
      addSculpturalTree(6.2, 7.8, 1.15);

      roofPeakY = 9.75;
    } else if (placement.styleVariant === 'georgian_brick') {
      // -----------------------------------------------------------------------
      // HOUSE 02 (E-Commerce): 3-LEVEL SCULPTED OBSIDIAN BASALT & SAPPHIRE GLASS ATELIER
      // Stepped dark architectural stone monolith, double-height glazed showcase gallery,
      // crisp white travertine cantilevered balcony slabs & rooftop titanium pergola!
      // -----------------------------------------------------------------------
      const plinth = new THREE.Mesh(track(new THREE.BoxGeometry(11.6, 0.44, 9.2)), travertineMat);
      plinth.position.set(0, 0.22, -0.35);

      // Ground Floor Obsidian Basalt Base
      const gfLeft = new THREE.Mesh(track(new THREE.BoxGeometry(3.9, 3.15, 8.4)), wallMat);
      gfLeft.position.set(-3.3, 1.98, -0.2);
      gfLeft.castShadow = quality.shadowsEnabled;
      gfLeft.receiveShadow = quality.shadowsEnabled;

      const gfRight = new THREE.Mesh(track(new THREE.BoxGeometry(4.2, 3.15, 8.4)), wallMat);
      gfRight.position.set(3.45, 1.98, -0.2);
      gfRight.castShadow = quality.shadowsEnabled;
      gfRight.receiveShadow = quality.shadowsEnabled;

      // Crisp Cantilevered White-Travertine Mid-Floor Ribbon Slabs with Under-Glow LEDs
      const slab1 = new THREE.Mesh(track(new THREE.BoxGeometry(11.8, 0.34, 9.8)), travertineMat);
      slab1.position.set(0, 3.68, 0.35);
      slab1.castShadow = quality.shadowsEnabled;
      const slab1Led = new THREE.Mesh(track(new THREE.BoxGeometry(11.4, 0.045, 0.06)), archWarmLedMat);
      slab1Led.position.set(0, 3.5, 5.22);

      // Level 2 Obsidian Basalt Atelier Volume
      const lvl2 = new THREE.Mesh(track(new THREE.BoxGeometry(11.0, 3.05, 8.6)), wallMat);
      lvl2.position.set(0, 5.36, -0.15);
      lvl2.castShadow = quality.shadowsEnabled;
      lvl2.receiveShadow = quality.shadowsEnabled;

      const slab2 = new THREE.Mesh(track(new THREE.BoxGeometry(11.8, 0.34, 9.8)), travertineMat);
      slab2.position.set(0, 7.02, 0.35);
      slab2.castShadow = quality.shadowsEnabled;
      const slab2Led = new THREE.Mesh(track(new THREE.BoxGeometry(11.4, 0.045, 0.06)), archWarmLedMat);
      slab2Led.position.set(0, 6.84, 5.22);

      // Level 3 Stepped-Back Penthouse Glass Showcase & Brushed-Titanium Rooftop Louver Pergola
      const lvl3 = new THREE.Mesh(track(new THREE.BoxGeometry(7.2, 2.55, 6.2)), wallMat);
      lvl3.position.set(-1.5, 8.45, -1.1);
      lvl3.castShadow = quality.shadowsEnabled;
      const roofTop = new THREE.Mesh(track(new THREE.BoxGeometry(8.2, 0.24, 7.2)), travertineMat);
      roofTop.position.set(-1.5, 9.82, -0.8);

      // Architectural Steel Pergola Canopy spanning the Right Sky-Terrace!
      const pergolaFront = new THREE.Mesh(
        track(new THREE.BoxGeometry(3.8, 0.16, 0.16)),
        brushedTitaniumMat
      );
      pergolaFront.position.set(3.8, 9.75, 2.3);
      const pergolaPost = new THREE.Mesh(
        track(new THREE.BoxGeometry(0.16, 2.65, 0.16)),
        brushedTitaniumMat
      );
      pergolaPost.position.set(5.55, 8.42, 2.3);
      houseRoot.add(pergolaFront, pergolaPost);
      for (let pz = -3.4; pz <= 2.1; pz += 0.65) {
        const beam = new THREE.Mesh(track(new THREE.BoxGeometry(3.8, 0.12, 0.12)), teakWoodMat);
        beam.position.set(3.8, 9.72, pz);
        houseRoot.add(beam);
      }

      houseRoot.add(plinth, gfLeft, gfRight, slab1, slab1Led, lvl2, slab2, slab2Led, lvl3, roofTop);

      // Frameless Glass Terrace Balustrades on Level 2 & Level 3
      addGlassBalustrade(-3.1, 3.86, 5.15, 5.1, 0);
      addGlassBalustrade(3.1, 3.86, 5.15, 5.1, 0);
      addGlassBalustrade(0, 7.2, 5.15, 11.2, 0);

      // Dramatic Tall Showcase Windows & Vertical Titanium Fin Accents
      addCurtainWallBay(-3.3, 1.98, 4.02, 2.95, 2.45, 0, { mullions: 2, recessLed: true });
      addCurtainWallBay(3.45, 1.98, 4.02, 3.25, 2.45, 0, { mullions: 2, recessLed: true });
      addCurtainWallBay(-3.2, 5.36, 4.18, 3.3, 2.45, 0, { mullions: 2, recessLed: true });
      addCurtainWallBay(0.25, 5.36, 4.18, 2.5, 2.45, 0, { mullions: 1 });
      addCurtainWallBay(3.65, 5.36, 4.18, 3.2, 2.45, 0, { mullions: 2, recessLed: true });
      addCurtainWallBay(-1.5, 8.45, 2.04, 5.8, 2.0, 0, { mullions: 3, recessLed: true });
      addCurtainWallBay(-5.54, 5.36, -0.1, 4.6, 2.35, -Math.PI / 2, { mullions: 2 });
      addCurtainWallBay(5.54, 5.36, -0.1, 4.6, 2.35, Math.PI / 2, { mullions: 2 });

      // Sleek Vertical Architectural Fin Screen on Left Facade Corner
      addLouverScreen(-5.45, 5.36, 4.45, 0.9, 6.6, 5, brushedTitaniumMat, 0);
      addLinearPlanter(-4.4, 5.95, 3.9);
      addLinearPlanter(4.4, 5.95, 3.9);
      addSculpturalTree(-6.15, 7.2, 1.1);
      addSculpturalTree(6.15, 7.2, 1.1);

      roofPeakY = 10.45;
    } else if (placement.styleVariant === 'courtyard_villa') {
      // -----------------------------------------------------------------------
      // HOUSE 03 (Branding & Design): CURVED-CANOPY PEARL LIMESTONE & TEAK COURTYARD VILLA
      // Sweeping custom-sculpted curved white architectural limestone ribbon fascia,
      // L-shaped glazed courtyard gallery, sculptural reflection pool & warm walnut louvers!
      // -----------------------------------------------------------------------
      const plinth = new THREE.Mesh(track(new THREE.BoxGeometry(12.2, 0.42, 9.6)), travertineMat);
      plinth.position.set(0, 0.21, -0.2);

      // Recessed Ground Floor Pearl Limestone & Teak Wings
      const gfLeft = new THREE.Mesh(track(new THREE.BoxGeometry(4.2, 3.05, 8.4)), wallMat);
      gfLeft.position.set(-3.45, 1.94, -0.2);
      gfLeft.castShadow = quality.shadowsEnabled;
      gfLeft.receiveShadow = quality.shadowsEnabled;

      // Projecting Right Courtyard Gallery Pavilion clad in Warm Architectural Teak!
      const teakGallery = new THREE.Mesh(track(new THREE.BoxGeometry(4.1, 3.15, 10.2)), teakWoodMat);
      teakGallery.position.set(3.75, 1.98, 0.7);
      teakGallery.castShadow = quality.shadowsEnabled;
      teakGallery.receiveShadow = quality.shadowsEnabled;

      // Upper Sweeping Curved Pearl Limestone Ribbon Fascia (Custom Sculpted ExtrudeGeometry!)
      const lowerRibbon = new THREE.Mesh(
        track(createCurvedRibbonCanopyGeometry(12.0, 0.42, 10.0)),
        wallMat
      );
      lowerRibbon.position.set(0, 3.52, 0.55);
      lowerRibbon.castShadow = quality.shadowsEnabled;

      const upperBody = new THREE.Mesh(track(new THREE.BoxGeometry(11.4, 2.95, 8.8)), wallMat);
      upperBody.position.set(0, 5.4, 0.15);
      upperBody.castShadow = quality.shadowsEnabled;
      upperBody.receiveShadow = quality.shadowsEnabled;

      const upperRibbon = new THREE.Mesh(
        track(createCurvedRibbonCanopyGeometry(12.6, 0.48, 10.4)),
        wallMat
      );
      upperRibbon.position.set(0, 6.86, 0.55);
      upperRibbon.castShadow = quality.shadowsEnabled;

      // Subtle glowing glacier-blue architectural outline recessed beneath the sweeping top ribbon
      const ribbonLed = new THREE.Mesh(track(new THREE.BoxGeometry(11.8, 0.05, 0.07)), archWarmLedMat);
      ribbonLed.position.set(0, 6.84, 5.76);

      // Sculpted Rooftop Skylight Lantern Pavilion
      const skylightCore = new THREE.Mesh(
        track(new THREE.BoxGeometry(5.8, 1.15, 4.4)),
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

      // Full-Width Panoramic Studio Glazing & Teak Brise-Soleil Screen
      addCurtainWallBay(-3.45, 1.96, 4.04, 3.2, 2.4, 0, { mullions: 2, recessLed: true });
      addCurtainWallBay(3.75, 2.0, 5.84, 3.25, 2.45, 0, { mullions: 2, recessLed: true });
      addCurtainWallBay(-2.85, 5.4, 4.58, 4.6, 2.35, 0, { mullions: 3, recessLed: true });
      addCurtainWallBay(2.9, 5.4, 4.58, 4.4, 2.35, 0, { mullions: 3, recessLed: true });
      addCurtainWallBay(-5.74, 5.4, 0.2, 4.8, 2.25, -Math.PI / 2, { mullions: 2 });
      addCurtainWallBay(5.74, 5.4, 0.2, 4.8, 2.25, Math.PI / 2, { mullions: 2 });

      addLouverScreen(-0.05, 5.4, 4.78, 1.0, 2.85, 6, teakWoodMat, 0);
      addGlassBalustrade(-2.4, 3.94, 5.42, 6.2, 0);

      // Front Left Architectural Infinity Reflection Pool + Sculpted Courtyard Trees
      addReflectionPool(-4.5, 6.3, 4.2, 2.8);
      addLinearPlanter(4.2, 7.1, 3.8);
      addSculpturalTree(-6.2, 8.1, 1.12);
      addSculpturalTree(6.2, 5.2, 1.2);

      roofPeakY = 9.05;
    } else if (placement.styleVariant === 'executive_hip') {
      // -----------------------------------------------------------------------
      // HOUSE 04 (Digital Marketing & SEO): GRAND DOUBLE-HEIGHT TITANIUM & QUARTZ EXECUTIVE VILLA
      // Monumental symmetrical double-height central glass atrium tower, cantilevered aero-edge
      // floating canopy roof, slender twin-blade stone columns & illuminated garden walls!
      // -----------------------------------------------------------------------
      const plinth = new THREE.Mesh(track(new THREE.BoxGeometry(12.6, 0.48, 9.8)), travertineMat);
      plinth.position.set(0, 0.24, -0.35);
      plinth.receiveShadow = quality.shadowsEnabled;

      // Twin Symmetrical Flanking Quartz-Limestone Wings
      [-4.1, 4.1].forEach((wx) => {
        const wing = new THREE.Mesh(track(new THREE.BoxGeometry(4.0, 6.35, 8.6)), wallMat);
        wing.position.set(wx, 3.62, -0.3);
        wing.castShadow = quality.shadowsEnabled;
        wing.receiveShadow = quality.shadowsEnabled;
        houseRoot.add(wing);

        // Sleek Mid-Level Horizontal Titanium Band
        const band = new THREE.Mesh(track(new THREE.BoxGeometry(4.22, 0.2, 8.85)), brushedTitaniumMat);
        band.position.set(wx, 3.62, -0.3);
        houseRoot.add(band);
      });

      // Central Soaring Double-Height Glass Atrium Core rising above the flanking wings!
      const centralCore = new THREE.Mesh(
        track(new THREE.BoxGeometry(4.6, 7.65, 8.8)),
        obsidianBasaltMat
      );
      centralCore.position.set(0, 4.3, -0.2);
      centralCore.castShadow = quality.shadowsEnabled;
      houseRoot.add(centralCore);

      // Dramatic Cantilevered Floating Aero-Edge Titanium Roof Wing spanning the entire Estate!
      const mainAeroRoof = new THREE.Mesh(
        track(createCantileveredAeroRoofGeometry(13.8, 0.65, 10.6, 0.72)),
        brushedTitaniumMat
      );
      mainAeroRoof.position.set(0, 6.82, -0.1);
      mainAeroRoof.castShadow = quality.shadowsEnabled;

      // Elevated Atrium Crown Canopy with Illuminated Glacier-Blue Skylight Halo!
      const atriumRoof = new THREE.Mesh(
        track(createCantileveredAeroRoofGeometry(6.2, 0.52, 9.8, 0.45)),
        brushedTitaniumMat
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
          brushedTitaniumMat
        );
        blade.position.set(cx, 1.98, 5.85);
        blade.castShadow = quality.shadowsEnabled;
        houseRoot.add(blade);
      });

      houseRoot.add(mainAeroRoof, atriumRoof, atriumCrownLed, porticoCanopy, porticoLed);

      // Symmetrical Floor-to-Ceiling Architectural Glazing + Soaring Central Atrium Glass!
      addCurtainWallBay(-4.1, 1.98, 4.04, 2.95, 2.45, 0, { mullions: 2, recessLed: true });
      addCurtainWallBay(4.1, 1.98, 4.04, 2.95, 2.45, 0, { mullions: 2, recessLed: true });
      addCurtainWallBay(-4.1, 5.25, 4.04, 2.95, 2.35, 0, { mullions: 2, recessLed: true });
      addCurtainWallBay(4.1, 5.25, 4.04, 2.95, 2.35, 0, { mullions: 2, recessLed: true });
      // Soaring Double-Height Upper Central Atrium Window overlooking the Crescent!
      addCurtainWallBay(0, 5.95, 4.24, 3.7, 3.6, 0, { mullions: 2, transom: true, recessLed: true });
      addCurtainWallBay(-6.14, 5.2, -0.3, 4.8, 2.25, -Math.PI / 2, { mullions: 2 });
      addCurtainWallBay(6.14, 5.2, -0.3, 4.8, 2.25, Math.PI / 2, { mullions: 2 });

      // Sleek Sculpted Linear Planters & Twin Flanking Ornamental Trees
      addLinearPlanter(-4.4, 5.65, 3.8);
      addLinearPlanter(4.4, 5.65, 3.8);
      addSculpturalTree(-6.2, 6.8, 1.18);
      addSculpturalTree(6.2, 6.8, 1.18);

      roofPeakY = 9.35;
    } else if (placement.styleVariant === 'contemporary_townhouse') {
      // -----------------------------------------------------------------------
      // HOUSE 05 (Web Hosting & Maintenance): INTERLOCKING SLATE & GLASS CUBE RESIDENCE
      // Bold offset geometric architectural volumes, exterior vertical titanium brise-soleil
      // sun-shading fins, full-width sky-terrace & cantilevered solar-louver roof canopy!
      // -----------------------------------------------------------------------
      const plinth = new THREE.Mesh(track(new THREE.BoxGeometry(11.4, 0.44, 9.0)), travertineMat);
      plinth.position.set(0, 0.22, -0.25);

      // Ground Floor Dark Basalt Cubes flanking Entry
      [-3.35, 3.35].forEach((lx) => {
        const gf = new THREE.Mesh(track(new THREE.BoxGeometry(4.1, 3.05, 8.4)), obsidianBasaltMat);
        gf.position.set(lx, 1.96, -0.2);
        gf.castShadow = quality.shadowsEnabled;
        gf.receiveShadow = quality.shadowsEnabled;
        houseRoot.add(gf);
      });

      // Offset Cantilevered Level 2 Glacier-Slate Cube shifted dramatically to the Left!
      const midCube = new THREE.Mesh(track(new THREE.BoxGeometry(11.4, 3.15, 9.2)), wallMat);
      midCube.position.set(-0.45, 5.18, 0.25);
      midCube.castShadow = quality.shadowsEnabled;
      midCube.receiveShadow = quality.shadowsEnabled;

      // Crisp Dark Titanium Structural Slab Channels & Warm Under-Glow LEDs
      const midFloorTrim = new THREE.Mesh(
        track(new THREE.BoxGeometry(11.7, 0.26, 9.5)),
        brushedTitaniumMat
      );
      midFloorTrim.position.set(-0.45, 3.56, 0.25);
      const midLed = new THREE.Mesh(track(new THREE.BoxGeometry(11.2, 0.045, 0.06)), archWarmLedMat);
      midLed.position.set(-0.45, 3.42, 4.98);

      const upperFloorTrim = new THREE.Mesh(
        track(new THREE.BoxGeometry(11.7, 0.28, 9.5)),
        brushedTitaniumMat
      );
      upperFloorTrim.position.set(-0.45, 6.86, 0.25);

      // Level 3 Offset Glass Cube Penthouse shifted to the Right + Cantilevered Rooftop Canopy!
      const pentCube = new THREE.Mesh(
        track(new THREE.BoxGeometry(6.8, 2.55, 6.2)),
        obsidianBasaltMat
      );
      pentCube.position.set(1.25, 8.28, -0.85);
      pentCube.castShadow = quality.shadowsEnabled;

      const pentCanopy = new THREE.Mesh(
        track(new THREE.BoxGeometry(10.6, 0.24, 7.6)),
        brushedTitaniumMat
      );
      pentCanopy.position.set(-0.2, 9.65, -0.4);
      pentCanopy.castShadow = quality.shadowsEnabled;

      const pentCanopyLed = new THREE.Mesh(
        track(new THREE.BoxGeometry(10.2, 0.05, 0.06)),
        poolEdgeGlowMat
      );
      pentCanopyLed.position.set(-0.2, 9.52, 3.42);

      // Cantilevered Entrance Canopy
      const entryCanopy = new THREE.Mesh(
        track(new THREE.BoxGeometry(3.5, 0.2, 1.75)),
        brushedTitaniumMat
      );
      entryCanopy.position.set(0, 3.52, 5.05);

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

      // Full-Width Sky-Terrace Frameless Glass Rail & Teak Architectural Louver Wall on Left Roof Deck
      addGlassBalustrade(-0.45, 7.0, 4.86, 11.2, 0);
      addLouverScreen(-4.85, 8.25, 1.2, 2.4, 2.55, 10, teakWoodMat, 0);
      addLouverScreen(5.15, 5.18, 4.95, 1.1, 3.05, 6, brushedTitaniumMat, 0);

      // Contemporary Floor-to-Ceiling Curtain-Wall Glazing
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
      // HOUSE 06 (Custom Web Tools & Apps): SOARING BUTTERFLY-ROOF ARCHITECTURAL GLASS & WALNUT STUDIO
      // Dramatic twin-wing sculpted V-butterfly brushed-titanium roof with full-width
      // luminous clerestory ribbon glazing, warm horizontal walnut cladding & water court!
      // -----------------------------------------------------------------------
      const plinth = new THREE.Mesh(track(new THREE.BoxGeometry(12.0, 0.44, 9.4)), travertineMat);
      plinth.position.set(0, 0.22, -0.2);

      // Left Glacier-White Concrete Studio Volume
      const leftVolume = new THREE.Mesh(track(new THREE.BoxGeometry(7.2, 5.85, 8.4)), wallMat);
      leftVolume.position.set(-1.95, 3.35, -0.2);
      leftVolume.castShadow = quality.shadowsEnabled;
      leftVolume.receiveShadow = quality.shadowsEnabled;

      // Projecting Right Double-Height Horizontal Walnut Architectural Studio Wing!
      const walnutWing = new THREE.Mesh(track(new THREE.BoxGeometry(4.6, 6.25, 9.6)), teakWoodMat);
      walnutWing.position.set(3.55, 3.55, 0.45);
      walnutWing.castShadow = quality.shadowsEnabled;
      walnutWing.receiveShadow = quality.shadowsEnabled;

      // Full-Width Luminous Clerestory Ribbon Glass Band tucked right beneath the Soaring Butterfly Roof!
      const clerestoryBand = new THREE.Mesh(
        track(new THREE.BoxGeometry(11.4, 0.92, 8.5)),
        winGlassMat
      );
      clerestoryBand.position.set(0.3, 6.68, 0.05);

      // Dramatic Sculpted Twin-Wing Angled Butterfly Titanium Roof (Custom ExtrudeGeometry!)
      const butterflyRoof = new THREE.Mesh(
        track(createButterflyRoofGeometry(13.4, 2.05, 11.2, 0.34)),
        brushedTitaniumMat
      );
      butterflyRoof.position.set(0.3, 6.82, 0.25);
      butterflyRoof.castShadow = quality.shadowsEnabled;
      butterflyRoof.receiveShadow = quality.shadowsEnabled;

      // Warm Teak Underside Soffit Fascia & Recessed Linear LED accent along the Front Overhang
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

      // Cantilevered Floating Porch Deck Canopy clad in Titanium & Warm Teak Soffit
      const porchCanopy = new THREE.Mesh(
        track(new THREE.BoxGeometry(3.75, 0.22, 1.95)),
        brushedTitaniumMat
      );
      porchCanopy.position.set(0, 3.48, 4.82);
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

      // Floor-to-Ceiling Frameless Architectural Windows
      addCurtainWallBay(-3.5, 1.98, 4.04, 3.1, 2.45, 0, { mullions: 2, recessLed: true });
      addCurtainWallBay(-3.3, 4.85, 4.04, 3.6, 2.25, 0, { mullions: 2, recessLed: true });
      addCurtainWallBay(0.05, 4.85, 4.04, 2.35, 2.25, 0, { mullions: 1 });
      // Soaring Double-Height Studio Glass Showcase in the Walnut Wing!
      addCurtainWallBay(3.55, 3.48, 5.28, 3.55, 5.15, 0, {
        mullions: 2,
        transom: true,
        recessLed: true,
      });
      addCurtainWallBay(-5.58, 4.85, -0.2, 4.8, 2.2, -Math.PI / 2, { mullions: 2 });
      addCurtainWallBay(5.88, 3.55, 0.5, 5.0, 4.8, Math.PI / 2, { mullions: 3, transom: true });

      // Front Reflection Pool under the Left Wing + Sculpted Trees
      addReflectionPool(-4.4, 6.25, 4.1, 2.4);
      addLinearPlanter(4.2, 6.5, 3.8);
      addSculpturalTree(-6.2, 7.6, 1.18);
      addSculpturalTree(6.2, 7.6, 1.12);

      roofPeakY = 9.75;
    }

    // Warm Architectural Porch Downlight & Luminous Interior Threshold Light
    const porchLight = new THREE.PointLight(0xffe0ad, initialDarkMode ? 2.35 : 0.22, 16, 1.55);
    porchLight.position.set(0, 3.05, 5.15);
    houseRoot.add(porchLight);

    const portalLight = new THREE.PointLight(0xffeed1, 0.0, 15, 1.45);
    portalLight.position.set(0, 1.9, 3.2);
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
      outsideCameraLocal: [0, 3.75, 16.6],
      outsideLookAtLocal: [0, 3.25, 2.2],
      doorwayCameraLocal: [0, 2.05, 6.4],
      doorwayLookAtLocal: [0, 1.9, 1.6],
    });
  });

  const applyTheme = (isDark: boolean) => {
    contactMat.opacity = isDark ? 0.54 : 0.28;
    travertineMat.color.setHex(isDark ? 0x3b4659 : 0xf2f0eb);
    obsidianBasaltMat.color.setHex(isDark ? 0x161f2e : 0x2a3342);
    brushedTitaniumMat.color.setHex(isDark ? 0x202c40 : 0x324156);
    teakWoodMat.color.setHex(isDark ? 0x6b472b : 0xb37c4c);
    archGlassRailMat.color.setHex(isDark ? 0x6ba8e5 : 0xcce6ff);
    reflectionPoolMat.color.setHex(isDark ? 0x0b223d : 0x1b5c8a);
    pebbleBedMat.color.setHex(isDark ? 0x1d2534 : 0x8e99a8);
    foliageCardMat.color.setHex(isDark ? 0x1f3428 : 0x4f6846);
    ornamentalGrassMat.color.setHex(isDark ? 0x1c3124 : 0x496141);

    poolEdgeGlowMat.color.setHex(isDark ? 0xbae6fd : 0x93c5fd);
    poolEdgeGlowMat.emissiveIntensity = isDark ? 1.85 : 0.12;

    archWarmLedMat.color.setHex(isDark ? 0xfff8ea : 0xe2e8f0);
    archWarmLedMat.emissiveIntensity = isDark ? 2.15 : 0.0;

    interiorRoomMat.color.setHex(isDark ? 0xffe8c2 : 0x263448);
    interiorRoomMat.emissive.setHex(isDark ? 0xffd79e : 0x000000);
    interiorRoomMat.emissiveIntensity = isDark ? 0.55 : 0.0;

    lawnMat.map = isDark ? grassPbr.darkMap : grassPbr.lightMap;
    lawnMat.needsUpdate = true;

    houses.forEach((h, idx) => {
      const pal = SERVICE_HOUSE_PALETTES[idx % SERVICE_HOUSE_PALETTES.length];
      h.wallMaterials.forEach((m) => {
        m.color.setHex(isDark ? pal.nightWallHex : pal.dayWallHex);
      });
      h.windowMaterials.forEach((m) => {
        m.map = isDark ? winTex.nightMap : winTex.dayMap;
        m.emissive.setHex(isDark ? 0xffe6bd : 0x000000);
        m.emissiveMap = isDark ? winTex.nightEmissiveMap : null;
        m.emissiveIntensity = isDark ? 0.92 : 0.0;
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

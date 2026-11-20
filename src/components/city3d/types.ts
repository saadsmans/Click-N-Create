import type * as THREE from 'three';

export type QualityTier = 'desktop' | 'tablet' | 'mobile' | 'software';

export interface QualityProfile {
  tier: QualityTier;
  pixelRatio: number;
  shadowMapSize: number;
  shadowsEnabled: boolean;
  cityTowerCount: number;
  suburbHouseCount: number;
  treeCount: number;
  particleCount: number;
  vehicleCount: number;
  antialias: boolean;
}

export interface HouseColorPalette {
  /** Refined real-world architectural accent (non-neon) for UI & subtle trims */
  accentHex: number;
  accentCss: string;
  secondaryHex: number;
  secondaryCss: string;
  /** Exterior wall color in Day & Night */
  dayWallHex: number;
  nightWallHex: number;
  /** Pitched / Architectural Roof color */
  roofHex: number;
  /** Realistic wooden / painted front door color */
  doorHex: number;
  /** Material style for PBR facade mapping */
  facadeStyle: 'limestone' | 'brick' | 'stucco' | 'sandstone' | 'slate' | 'timber';
}

export const SERVICE_HOUSE_PALETTES: HouseColorPalette[] = [
  {
    // 01 E-Commerce Development: Cantilevered Glacier Travertine & Cobalt-Glass Pavilion
    accentHex: 0x38bdf8,
    accentCss: '#0284C7',
    secondaryHex: 0x1d4ed8,
    secondaryCss: '#1D4ED8',
    dayWallHex: 0xf4f6f9,
    nightWallHex: 0x2a3548,
    roofHex: 0x1e293b,
    doorHex: 0x3b2a20,
    facadeStyle: 'limestone',
  },
  {
    // 02 Web Development: 3-Level Sculpted Obsidian Basalt & Sapphire Glass Atelier
    accentHex: 0x0ea5e9,
    accentCss: '#0369A1',
    secondaryHex: 0x0f766e,
    secondaryCss: '#0F766E',
    dayWallHex: 0x333c4a,
    nightWallHex: 0x1a2230,
    roofHex: 0x141b26,
    doorHex: 0x4a3122,
    facadeStyle: 'slate',
  },
  {
    // 03 Branding & Design: Curved-Canopy Pearl Limestone & Teak Courtyard Villa
    accentHex: 0x2563eb,
    accentCss: '#1D4ED8',
    secondaryHex: 0x38bdf8,
    secondaryCss: '#0284C7',
    dayWallHex: 0xf7f5f0,
    nightWallHex: 0x303a4c,
    roofHex: 0x243042,
    doorHex: 0x5c3c24,
    facadeStyle: 'stucco',
  },
  {
    // 04 Digital Marketing: Grand Double-Height Titanium & Quartz Executive Villa
    accentHex: 0x60a5fa,
    accentCss: '#2563EB',
    secondaryHex: 0x1e40af,
    secondaryCss: '#1E40AF',
    dayWallHex: 0xe6ecf3,
    nightWallHex: 0x263246,
    roofHex: 0x1c2536,
    doorHex: 0x1e2736,
    facadeStyle: 'sandstone',
  },
  {
    // 05 Web App Development: Interlocking Charcoal Slate & Glass Cube Residence
    accentHex: 0x38bdf8,
    accentCss: '#0284C7',
    secondaryHex: 0x1e293b,
    secondaryCss: '#1E293B',
    dayWallHex: 0xdbe3ec,
    nightWallHex: 0x222d3f,
    roofHex: 0x161f2e,
    doorHex: 0x3f2b1e,
    facadeStyle: 'slate',
  },
  {
    // 06 Hosting & Maintenance: Sculpted Butterfly-Roof Architectural Glass & Walnut Studio
    accentHex: 0x06b6d4,
    accentCss: '#0E7490',
    secondaryHex: 0x1d4ed8,
    secondaryCss: '#1D4ED8',
    dayWallHex: 0xf2f5f8,
    nightWallHex: 0x283447,
    roofHex: 0x1e293b,
    doorHex: 0x614028,
    facadeStyle: 'timber',
  },
];

export interface HousePlacement {
  serviceIndex: number;
  position: [number, number, number];
  facingYaw: number;
  styleVariant:
    | 'modern_gable'
    | 'georgian_brick'
    | 'courtyard_villa'
    | 'executive_hip'
    | 'contemporary_townhouse'
    | 'cedar_residence';
}

export interface HouseInstanceRef {
  serviceIndex: number;
  root: THREE.Group;
  doorPivot: THREE.Group;
  portalLight: THREE.PointLight;
  porchLight: THREE.PointLight;
  portalGlowMat: THREE.MeshBasicMaterial;
  windowMaterials: THREE.MeshStandardMaterial[];
  wallMaterials: THREE.MeshStandardMaterial[];
  highlightRingMat: THREE.MeshStandardMaterial;
  hitbox: THREE.Mesh;
  labelAnchorLocal: [number, number, number];
  outsideCameraLocal: [number, number, number];
  outsideLookAtLocal: [number, number, number];
  doorwayCameraLocal: [number, number, number];
  doorwayLookAtLocal: [number, number, number];
}

export type ExplorationPhase =
  | 'aerial_scroll'
  | 'approaching_door'
  | 'opening_door'
  | 'inside_house'
  | 'exiting_house';

/** Exact scroll progress centers for each of the 6 Service Houses on the Turn-by-Turn Guided Tour */
export const HOUSE_TOUR_PROGRESS: number[] = [0.6, 0.66, 0.72, 0.78, 0.84, 0.9];

export const HOUSE_PLACEMENTS: HousePlacement[] = [
  {
    serviceIndex: 0,
    position: [-32.0, 0, -20.4],
    facingYaw: 1.187,
    styleVariant: 'modern_gable',
  },
  {
    serviceIndex: 1,
    position: [-22.6, 0, -33.5],
    facingYaw: 0.716,
    styleVariant: 'georgian_brick',
  },
  {
    serviceIndex: 2,
    position: [-8.35, 0, -41.0],
    facingYaw: 0.244,
    styleVariant: 'courtyard_villa',
  },
  {
    serviceIndex: 3,
    position: [8.35, 0, -41.0],
    facingYaw: -0.244,
    styleVariant: 'executive_hip',
  },
  {
    serviceIndex: 4,
    position: [22.6, 0, -33.5],
    facingYaw: -0.716,
    styleVariant: 'contemporary_townhouse',
  },
  {
    serviceIndex: 5,
    position: [32.0, 0, -20.4],
    facingYaw: -1.187,
    styleVariant: 'cedar_residence',
  },
];

export function detectQualityProfile(isSoftwareGl: boolean): QualityProfile {
  if (typeof window === 'undefined') {
    return {
      tier: 'desktop',
      pixelRatio: 1.5,
      shadowMapSize: 2048,
      shadowsEnabled: true,
      cityTowerCount: 112,
      suburbHouseCount: 40,
      treeCount: 56,
      particleCount: 90,
      vehicleCount: 24,
      antialias: true,
    };
  }

  if (isSoftwareGl) {
    return {
      tier: 'software',
      pixelRatio: 1,
      shadowMapSize: 512,
      shadowsEnabled: false,
      cityTowerCount: 68,
      suburbHouseCount: 24,
      treeCount: 34,
      particleCount: 40,
      vehicleCount: 14,
      antialias: false,
    };
  }

  const width = window.innerWidth;
  const dpr = window.devicePixelRatio || 1;

  if (width < 640) {
    return {
      tier: 'mobile',
      pixelRatio: Math.min(dpr, 1.75),
      shadowMapSize: 1024,
      shadowsEnabled: true,
      cityTowerCount: 56,
      suburbHouseCount: 22,
      treeCount: 28,
      particleCount: 40,
      vehicleCount: 14,
      antialias: true,
    };
  }

  if (width < 1024) {
    return {
      tier: 'tablet',
      pixelRatio: Math.min(dpr, 1.85),
      shadowMapSize: 1536,
      shadowsEnabled: true,
      cityTowerCount: 92,
      suburbHouseCount: 36,
      treeCount: 44,
      particleCount: 65,
      vehicleCount: 22,
      antialias: true,
    };
  }

  return {
    tier: 'desktop',
    pixelRatio: Math.min(dpr, 2),
    shadowMapSize: 2048,
    shadowsEnabled: true,
    cityTowerCount: 132,
    suburbHouseCount: 48,
    treeCount: 68,
    particleCount: 100,
    vehicleCount: 28,
    antialias: true,
  };
}

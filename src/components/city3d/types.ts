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
    // 01 E-Commerce Development: Warm Ivory Limestone, Deep Emerald-Tinted Glass & Champagne Trim
    accentHex: 0x1f4e37,
    accentCss: '#1F4E37',
    secondaryHex: 0xd4ba8b,
    secondaryCss: '#C9A86C',
    dayWallHex: 0xede4d4,
    nightWallHex: 0x1d2432,
    roofHex: 0x1e2229,
    doorHex: 0x4b3120,
    facadeStyle: 'limestone',
  },
  {
    // 02 Web Development: Dark Graphite Basalt, Smoked Bronze Glass & Patinated Bronze Atelier
    accentHex: 0x8c6239,
    accentCss: '#8C6239',
    secondaryHex: 0xd4ba8b,
    secondaryCss: '#C9A86C',
    dayWallHex: 0x262b34,
    nightWallHex: 0x161c28,
    roofHex: 0x171a20,
    doorHex: 0x543622,
    facadeStyle: 'slate',
  },
  {
    // 03 Branding & Design: Sandstone Beige, Terracotta Louver & Champagne Courtyard Villa
    accentHex: 0xb86b4b,
    accentCss: '#B86B4B',
    secondaryHex: 0xd4ba8b,
    secondaryCss: '#C9A86C',
    dayWallHex: 0xdfd1bb,
    nightWallHex: 0x232938,
    roofHex: 0x242830,
    doorHex: 0x623b22,
    facadeStyle: 'stucco',
  },
  {
    // 04 Digital Marketing: Champagne Bronze, Warm Ivory Stone & Smoked-Emerald Executive Villa
    accentHex: 0xd4ba8b,
    accentCss: '#C49A52',
    secondaryHex: 0x1f4e37,
    secondaryCss: '#1F4E37',
    dayWallHex: 0xe6dac5,
    nightWallHex: 0x1c2333,
    roofHex: 0x1b1f27,
    doorHex: 0x2a2623,
    facadeStyle: 'sandstone',
  },
  {
    // 05 Web App Development: Muted Olive Stone, Terracotta Screen & Smoked-Glass Sky Residence
    accentHex: 0x6a764a,
    accentCss: '#6A764A',
    secondaryHex: 0xb86b4b,
    secondaryCss: '#B86B4B',
    dayWallHex: 0xd8c3a5,
    nightWallHex: 0x19202e,
    roofHex: 0x1a1e26,
    doorHex: 0x422b1c,
    facadeStyle: 'slate',
  },
  {
    // 06 Hosting & Maintenance: Sculpted Butterfly-Roof Warm Ivory, Walnut & Patinated Bronze Studio
    accentHex: 0x8c6239,
    accentCss: '#8C6239',
    secondaryHex: 0x1f4e37,
    secondaryCss: '#1F4E37',
    dayWallHex: 0xebe1cf,
    nightWallHex: 0x1e2534,
    roofHex: 0x1c2028,
    doorHex: 0x5c3921,
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

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import {
  Globe,
  ShoppingCart,
  Palette,
  TrendingUp,
  ShieldCheck,
  Cpu,
  ArrowUpRight,
  Play,
  Pause,
  RotateCcw,
  Zap,
  CheckCircle2,
  X,
  Compass,
  Layers,
  Radio,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext.tsx';

interface HeroMotionGraphicsProps {
  onNavigate?: (path: string) => void;
}

// Holographic 3D Planet Radial Gradient Vertex Shader
const planetVertexShader = `
  varying vec3 vWorldPosition;
  varying vec3 vWorldNormal;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

// Dynamic Radial Gradient Holographic Fragment Shader (Sun-Facing Radial Light + Fresnel + Specular)
const planetFragmentShader = `
  uniform float uTime;
  uniform vec3 uBaseColor;
  uniform vec3 uDarkColor;
  uniform vec3 uSunPosition;
  uniform vec3 uSunHighlight;
  uniform float uIsDark;

  varying vec3 vWorldPosition;
  varying vec3 vWorldNormal;
  varying vec2 vUv;

  void main() {
    // 1. Vector from surface point towards the central Sun (at 0,0,0)
    vec3 sunDir = normalize(uSunPosition - vWorldPosition);
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    vec3 normal = normalize(vWorldNormal);

    // 2. Dynamic Radial Solar Lighting Gradient (Changes continuously as planet orbits around Sun)
    float NdotL = dot(normal, sunDir);
    float radialLighting = smoothstep(-0.25, 0.85, NdotL);

    // 3. Holographic Fresnel Rim Glow (Intensified at edges for 3D holographic volume)
    float NdotV = max(0.0, dot(normal, viewDir));
    float fresnel = pow(1.0 - NdotV, 2.3);

    // 4. Specular Sunlight Glint on the side facing the Sun
    vec3 halfVec = normalize(sunDir + viewDir);
    float specular = pow(max(0.0, dot(normal, halfVec)), 26.0) * 0.95;

    // 5. Sci-Fi Holographic Scanline & Latitude Banding
    float scanline = sin(vWorldPosition.y * 38.0 + uTime * 2.2) * 0.05 + 0.95;
    float latBand = sin(vUv.y * 3.14159265 * 12.0) * 0.035;

    // 6. Multi-Stop Radial Gradient Palette Interpolation
    vec3 darkSide = uDarkColor * (uIsDark > 0.5 ? 0.35 : 0.55);
    vec3 midTone = uBaseColor;
    vec3 sunlitCrest = mix(uBaseColor, uSunHighlight, 0.45);

    vec3 baseGradient = mix(darkSide, mix(midTone, sunlitCrest, clamp((NdotL + 0.15) * 1.1, 0.0, 1.0)), radialLighting);
    baseGradient *= (scanline + latBand);

    // 7. Add Specular Solar Flare & Holographic Rim Glow
    vec3 finalColor = baseGradient + (uSunHighlight * specular) + (uBaseColor * fresnel * 1.35);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

// Outer Atmospheric Halo Vertex Shader
const atmosphereVertexShader = `
  varying vec3 vWorldPosition;
  varying vec3 vWorldNormal;

  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

// Outer Atmospheric Halo Fragment Shader (Boosted towards Sun)
const atmosphereFragmentShader = `
  uniform float uTime;
  uniform vec3 uGlowColor;
  uniform vec3 uSunPosition;

  varying vec3 vWorldPosition;
  varying vec3 vWorldNormal;

  void main() {
    vec3 sunDir = normalize(uSunPosition - vWorldPosition);
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    vec3 normal = normalize(vWorldNormal);

    // Glow strongly on outer rim and boosted on the sunlit hemisphere
    float sunFacing = max(0.0, dot(normal, sunDir));
    float rim = pow(1.0 - max(0.0, dot(normal, viewDir)), 3.0);

    float pulse = sin(uTime * 2.8) * 0.12 + 0.88;
    float alpha = rim * (0.35 + 0.75 * sunFacing) * pulse;

    gl_FragColor = vec4(uGlowColor * 1.3, alpha);
  }
`;

interface ServicePlanetData {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  codename: string;
  astronomicalType: string;
  category: string;
  tagline: string;
  highlights: string[];
  pricing: string;
  timeline: string;
  colorHex: number;
  accentColor: string;
  glowColor: string;
  darkColorHex: number;
  orbitDistance: number;
  orbitSpeed: number;
  inclinationX: number; // in radians
  inclinationZ: number; // in radians
  radius: number; // 3D sphere radius
  hasRing?: boolean;
  ringInner?: number;
  ringOuter?: number;
  satelliteCount?: number;
  hasShieldCage?: boolean;
  hasQuantumBox?: boolean;
  icon: React.ComponentType<{ className?: string }>;
}

const SERVICE_PLANETS_DATA: ServicePlanetData[] = [
  {
    id: 'web-dev',
    slug: 'web-development',
    name: 'Web Development',
    shortName: 'Web Development',
    codename: 'SOLARIS-I // TERRA-DEV',
    astronomicalType: 'Cyan Terrestrial Habitat · 0.4 AU',
    category: 'WORDPRESS · REACT · ULTRA HIGH SPEED',
    tagline: 'Clean, modern websites that open fast on phones and turn visitors into paying customers.',
    highlights: ['1s Mobile Load Speed', 'Simple WordPress Editor', 'Built-in Google SEO'],
    pricing: '£35/hr or Fixed Quote',
    timeline: '1 – 3 Weeks',
    colorHex: 0x00F0FF,
    accentColor: '#00F0FF',
    glowColor: 'rgba(0, 240, 255, 0.95)',
    darkColorHex: 0x003344,
    orbitDistance: 4.8,
    orbitSpeed: 0.012,
    inclinationX: 0.22,
    inclinationZ: 0.1,
    radius: 0.58,
    satelliteCount: 1,
    icon: Globe,
  },
  {
    id: 'digital-marketing',
    slug: 'digital-marketing',
    name: 'Digital Marketing',
    shortName: 'Digital Marketing',
    codename: 'SOLARIS-II // HELIOS-RANK',
    astronomicalType: 'Radiant Solar Planet · 0.8 AU',
    category: 'LOCAL SEO · GOOGLE SEARCH · ADS',
    tagline: 'Get your business ranked #1 on Google and Google Maps to bring steady inbound phone calls.',
    highlights: ['Google Business Top 3', '+240% Inbound Calls', 'Speed & Schema Boost'],
    pricing: '£35/hr or Monthly Plan',
    timeline: 'Ongoing Growth',
    colorHex: 0xF59E0B,
    accentColor: '#F59E0B',
    glowColor: 'rgba(245, 158, 11, 0.95)',
    darkColorHex: 0x451A03,
    orbitDistance: 7.0,
    orbitSpeed: 0.009,
    inclinationX: -0.18,
    inclinationZ: -0.15,
    radius: 0.54,
    satelliteCount: 1,
    icon: TrendingUp,
  },
  {
    id: 'branding-design',
    slug: 'branding-and-design',
    name: 'Branding & Design',
    shortName: 'Branding & Design',
    codename: 'SOLARIS-III // VECTOR-NEXUS',
    astronomicalType: 'Violet Crystal Ice Giant · 1.2 AU',
    category: 'LOGOS · BRAND IDENTITY · VECTOR',
    tagline: 'Memorable 300 DPI vector logos, typography guides, and premium social media visual assets.',
    highlights: ['300 DPI Vector Files', 'Full Typography Kit', 'Print & Screen Ready'],
    pricing: '£35/hr or Fixed Quote',
    timeline: '3 – 7 Days',
    colorHex: 0xC084FC,
    accentColor: '#C084FC',
    glowColor: 'rgba(192, 132, 252, 0.95)',
    darkColorHex: 0x3B0764,
    orbitDistance: 9.4,
    orbitSpeed: 0.007,
    inclinationX: 0.28,
    inclinationZ: 0.2,
    radius: 0.65,
    hasRing: true,
    ringInner: 0.85,
    ringOuter: 1.15,
    satelliteCount: 2,
    icon: Palette,
  },
  {
    id: 'ecommerce-dev',
    slug: 'ecommerce-development',
    name: 'E-Commerce Services',
    shortName: 'E-Commerce Services',
    codename: 'SOLARIS-IV // MERCHANT-PRIME',
    astronomicalType: 'Majestic Ringed Gas Giant · 1.8 AU',
    category: 'SHOPIFY · WOOCOMMERCE · STRIPE',
    tagline: 'High-converting online stores with slide-out checkout, Apple Pay, and automated tracking.',
    highlights: ['Apple Pay & Credit Cards', 'Slide-out Cart Checkout', 'Automated Invoices'],
    pricing: '£35/hr or Fixed Quote',
    timeline: '2 – 4 Weeks',
    colorHex: 0xFF2A85,
    accentColor: '#FF2A85',
    glowColor: 'rgba(255, 42, 133, 0.95)',
    darkColorHex: 0x500724,
    orbitDistance: 12.0,
    orbitSpeed: 0.0052,
    inclinationX: -0.15,
    inclinationZ: 0.12,
    radius: 0.82,
    hasRing: true,
    ringInner: 1.1,
    ringOuter: 1.75,
    satelliteCount: 3,
    icon: ShoppingCart,
  },
  {
    id: 'hosting-care',
    slug: 'hosting-maintenance',
    name: 'Hosting & Maintenance',
    shortName: 'Hosting & Maintenance',
    codename: 'SOLARIS-V // AEGIS-CLOUD',
    astronomicalType: 'Emerald Shielded Giant · 2.4 AU',
    category: 'SSL · 24/7 BACKUPS · SECURITY',
    tagline: 'High-speed cloud servers, daily automatic backups, spam defense, and friendly WhatsApp help.',
    highlights: ['99.9% Uptime Shield', 'Daily Safe Backups', 'Free SSL Padlock'],
    pricing: 'From £25/mo or £35/hr',
    timeline: 'Instant Active',
    colorHex: 0x10B981,
    accentColor: '#10B981',
    glowColor: 'rgba(16, 185, 129, 0.95)',
    darkColorHex: 0x022C22,
    orbitDistance: 14.6,
    orbitSpeed: 0.0038,
    inclinationX: 0.2,
    inclinationZ: -0.18,
    radius: 0.74,
    hasShieldCage: true,
    satelliteCount: 2,
    icon: ShieldCheck,
  },
  {
    id: 'web-apps',
    slug: 'web-app-development',
    name: 'Web App Development',
    shortName: 'Web App Development',
    codename: 'SOLARIS-VI // SYNAPSE-APP',
    astronomicalType: 'Indigo Quantum Pulsar · 3.1 AU',
    category: 'CALCULATORS · CLIENT PORTALS · REACT',
    tagline: 'Interactive price estimators, private customer portals, booking calculators, and custom logic.',
    highlights: ['Live Instant Formulae', 'Client Login Portals', 'PDF Invoice Export'],
    pricing: '£35/hr or Custom Quote',
    timeline: '2 – 5 Weeks',
    colorHex: 0x6366F1,
    accentColor: '#6366F1',
    glowColor: 'rgba(99, 102, 241, 0.95)',
    darkColorHex: 0x1E1B4B,
    orbitDistance: 17.2,
    orbitSpeed: 0.0028,
    inclinationX: -0.25,
    inclinationZ: 0.22,
    radius: 0.72,
    hasQuantumBox: true,
    satelliteCount: 3,
    icon: Cpu,
  },
];

export const HeroMotionGraphics: React.FC<HeroMotionGraphicsProps> = ({ onNavigate }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [activePlanet, setActivePlanet] = useState<ServicePlanetData | null>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<ServicePlanetData | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [orbitSpeedMultiplier, setOrbitSpeedMultiplier] = useState<number>(1);
  const [hudViewMode, setHudViewMode] = useState<'hologram' | 'astronomy'>('hologram');
  const [fps, setFps] = useState(60);

  // References for Three.js scene objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const interactiveMeshesRef = useRef<{ mesh: THREE.Mesh; planet: ServicePlanetData }[]>([]);
  const hoveredPlanetRef = useRef<ServicePlanetData | null>(null);
  const orbitsGroupRef = useRef<THREE.Group | null>(null);
  const sunCoreMeshRef = useRef<THREE.Mesh | null>(null);
  const sunCoronaMeshRef = useRef<THREE.Mesh | null>(null);

  // Keep hoveredPlanetRef in sync with state for animation loop
  useEffect(() => {
    hoveredPlanetRef.current = hoveredPlanet;
    if (!hoveredPlanet) {
      setTooltipPos(null);
    }
  }, [hoveredPlanet]);

  // 3D Camera Controls State
  const controlsRef = useRef({
    rotX: 0.45,
    rotY: -0.2,
    targetRotX: 0.45,
    targetRotY: -0.2,
    isDragging: false,
    lastMouseX: 0,
    lastMouseY: 0,
    distance: 26,
    targetDistance: 26,
    orbitAngleGlobal: 0,
  });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 14, 24);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 2. Lighting Rig
    // Central Sun omnidirectional PointLight
    const sunLight = new THREE.PointLight(0x00F0FF, 3.8, 60, 1.2);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    const warmSunLight = new THREE.PointLight(0xFFFFFF, 2.5, 45, 1.5);
    warmSunLight.position.set(0, 0, 0);
    scene.add(warmSunLight);

    // Ambient space lighting
    const ambientLight = new THREE.AmbientLight(isDark ? 0x222233 : 0x555566, 1.0);
    scene.add(ambientLight);

    // 3. Central Holographic 3D Sun
    const sunGroup = new THREE.Group();
    scene.add(sunGroup);

    // Sun Core Sphere
    const sunGeo = new THREE.SphereGeometry(1.6, 32, 32);
    const sunMat = new THREE.MeshBasicMaterial({
      color: 0x00F0FF,
      wireframe: false,
    });
    const sunCoreMesh = new THREE.Mesh(sunGeo, sunMat);
    sunGroup.add(sunCoreMesh);
    sunCoreMeshRef.current = sunCoreMesh;

    // Sun Corona Wireframe Icosahedron
    const coronaGeo = new THREE.IcosahedronGeometry(2.1, 2);
    const coronaMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x00F0FF : 0x0284C7,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
    });
    const sunCoronaMesh = new THREE.Mesh(coronaGeo, coronaMat);
    sunGroup.add(sunCoronaMesh);
    sunCoronaMeshRef.current = sunCoronaMesh;

    // Outer Solar Flare Ring
    const sunRingGeo = new THREE.RingGeometry(2.3, 2.7, 32);
    const sunRingMat = new THREE.MeshBasicMaterial({
      color: 0xA855F7,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4,
    });
    const sunRingMesh = new THREE.Mesh(sunRingGeo, sunRingMat);
    sunRingMesh.rotation.x = Math.PI / 2;
    sunGroup.add(sunRingMesh);

    // 4. Asteroid Belt in 3D
    const asteroidCount = 350;
    const asteroidGeo = new THREE.BufferGeometry();
    const asteroidPositions = new Float32Array(asteroidCount * 3);
    const asteroidColors = new Float32Array(asteroidCount * 3);
    const cyanColor = new THREE.Color(0x00F0FF);
    const purpleColor = new THREE.Color(0xA855F7);

    for (let i = 0; i < asteroidCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = THREE.MathUtils.randFloat(7.8, 8.8);
      const heightOffset = THREE.MathUtils.randFloatSpread(0.6);

      asteroidPositions[i * 3] = Math.cos(angle) * radius;
      asteroidPositions[i * 3 + 1] = heightOffset;
      asteroidPositions[i * 3 + 2] = Math.sin(angle) * radius;

      const mixedColor = cyanColor.clone().lerp(purpleColor, Math.random());
      asteroidColors[i * 3] = mixedColor.r;
      asteroidColors[i * 3 + 1] = mixedColor.g;
      asteroidColors[i * 3 + 2] = mixedColor.b;
    }

    asteroidGeo.setAttribute('position', new THREE.BufferAttribute(asteroidPositions, 3));
    asteroidGeo.setAttribute('color', new THREE.BufferAttribute(asteroidColors, 3));

    const asteroidMat = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
    });
    const asteroidBelt = new THREE.Points(asteroidGeo, asteroidMat);
    scene.add(asteroidBelt);

    // 5. Deep Space Background Starfield
    const starCount = 600;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.cbrt(Math.random()) * 80 + 35;
      const sinPhi = Math.sin(phi);

      starPositions[i * 3] = r * sinPhi * Math.cos(theta);
      starPositions[i * 3 + 1] = r * sinPhi * Math.sin(theta);
      starPositions[i * 3 + 2] = r * Math.cos(phi);

      const color = Math.random() > 0.5 ? cyanColor : purpleColor;
      starColors[i * 3] = color.r;
      starColors[i * 3 + 1] = color.g;
      starColors[i * 3 + 2] = color.b;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.14,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // 6. Build Real 3D Service Planets & Inclined Orbit Rings
    const orbitsGroup = new THREE.Group();
    scene.add(orbitsGroup);
    orbitsGroupRef.current = orbitsGroup;

    const interactiveMeshes: { mesh: THREE.Mesh; planet: ServicePlanetData }[] = [];

    const planetOrbitPivots: {
      pivot: THREE.Group;
      planetMesh: THREE.Mesh;
      data: ServicePlanetData;
      currentAngle: number;
    }[] = [];

    SERVICE_PLANETS_DATA.forEach((planetData, idx) => {
      // Orbit Pivot container inclined at specific 3D angle
      const orbitPivot = new THREE.Group();
      orbitPivot.rotation.x = planetData.inclinationX;
      orbitPivot.rotation.z = planetData.inclinationZ;
      orbitsGroup.add(orbitPivot);

      // 3D Orbital Path Ring
      const orbitCurve = new THREE.EllipseCurve(
        0, 0,
        planetData.orbitDistance, planetData.orbitDistance,
        0, 2 * Math.PI,
        false,
        0
      );
      const points = orbitCurve.getPoints(90);
      const orbitLineGeo = new THREE.BufferGeometry().setFromPoints(
        points.map((p) => new THREE.Vector3(p.x, 0, p.y))
      );
      const orbitLineMat = new THREE.LineBasicMaterial({
        color: planetData.colorHex,
        transparent: true,
        opacity: isDark ? 0.28 : 0.35,
      });
      const orbitLine = new THREE.LineLoop(orbitLineGeo, orbitLineMat);
      orbitPivot.add(orbitLine);

      // 3D Planet Mesh with Dynamic Radial Gradient Holographic Lighting
      const planetGeo = new THREE.SphereGeometry(planetData.radius, 32, 32);
      const planetMat = new THREE.ShaderMaterial({
        vertexShader: planetVertexShader,
        fragmentShader: planetFragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uBaseColor: { value: new THREE.Color(planetData.colorHex) },
          uDarkColor: { value: new THREE.Color(planetData.darkColorHex) },
          uSunPosition: { value: new THREE.Vector3(0, 0, 0) },
          uSunHighlight: { value: new THREE.Color(0xFFFFFF) },
          uIsDark: { value: isDark ? 1.0 : 0.0 },
        },
      });
      const planetMesh = new THREE.Mesh(planetGeo, planetMat);
      planetMesh.position.set(planetData.orbitDistance, 0, 0);
      orbitPivot.add(planetMesh);

      // Outer Atmospheric Holographic Glow Shell (Dynamically illuminates towards central Sun)
      const atmoGeo = new THREE.SphereGeometry(planetData.radius * 1.18, 24, 24);
      const atmoMat = new THREE.ShaderMaterial({
        vertexShader: atmosphereVertexShader,
        fragmentShader: atmosphereFragmentShader,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.FrontSide,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uGlowColor: { value: new THREE.Color(planetData.colorHex) },
          uSunPosition: { value: new THREE.Vector3(0, 0, 0) },
        },
      });
      const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
      planetMesh.add(atmoMesh);

      // Add wireframe globe grid overlay on planet
      const gridGeo = new THREE.SphereGeometry(planetData.radius * 1.025, 16, 16);
      const gridMat = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF,
        wireframe: true,
        transparent: true,
        opacity: isDark ? 0.28 : 0.35,
      });
      const gridMesh = new THREE.Mesh(gridGeo, gridMat);
      planetMesh.add(gridMesh);

      // 3D Planetary Ring for Saturn-like Giant
      if (planetData.hasRing && planetData.ringOuter && planetData.ringInner) {
        const ringGeo = new THREE.RingGeometry(planetData.ringInner, planetData.ringOuter, 48);
        const ringMat = new THREE.MeshStandardMaterial({
          color: planetData.colorHex,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.85,
          roughness: 0.4,
          metalness: 0.3,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2.3;
        planetMesh.add(ringMesh);
      }

      // Geodesic Shield Cage for Hosting Aegis-Cloud
      if (planetData.hasShieldCage) {
        const cageGeo = new THREE.IcosahedronGeometry(planetData.radius * 1.35, 1);
        const cageMat = new THREE.MeshBasicMaterial({
          color: 0x10B981,
          wireframe: true,
          transparent: true,
          opacity: 0.55,
        });
        const cageMesh = new THREE.Mesh(cageGeo, cageMat);
        planetMesh.add(cageMesh);
      }

      // Quantum Hypercube for Web Apps
      if (planetData.hasQuantumBox) {
        const boxGeo = new THREE.BoxGeometry(planetData.radius * 1.4, planetData.radius * 1.4, planetData.radius * 1.4);
        const boxMat = new THREE.MeshBasicMaterial({
          color: 0x6366F1,
          wireframe: true,
          transparent: true,
          opacity: 0.6,
        });
        const boxMesh = new THREE.Mesh(boxGeo, boxMat);
        planetMesh.add(boxMesh);
      }

      // Orbiting Sub-Moons / Satellites
      if (planetData.satelliteCount) {
        for (let s = 0; s < planetData.satelliteCount; s++) {
          const moonGeo = new THREE.SphereGeometry(0.08, 12, 12);
          const moonMat = new THREE.MeshBasicMaterial({ color: planetData.colorHex });
          const moonMesh = new THREE.Mesh(moonGeo, moonMat);
          const moonDist = planetData.radius * (1.6 + s * 0.45);
          moonMesh.position.set(moonDist, 0, 0);

          const moonPivot = new THREE.Group();
          moonPivot.rotation.x = (s * Math.PI) / 3;
          moonPivot.add(moonMesh);
          planetMesh.add(moonPivot);
        }
      }

      interactiveMeshes.push({ mesh: planetMesh, planet: planetData });
      planetOrbitPivots.push({
        pivot: orbitPivot,
        planetMesh,
        data: planetData,
        currentAngle: (idx * Math.PI * 2) / SERVICE_PLANETS_DATA.length,
      });
    });

    interactiveMeshesRef.current = interactiveMeshes;

    // 7. Raycasting & Mouse Drag Handlers
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const tempVec = new THREE.Vector3();

    const getCanvasRelativePosition = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      return {
        x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
        y: -((e.clientY - rect.top) / rect.height) * 2 + 1,
      };
    };

    const handleMouseDown = (e: MouseEvent) => {
      controlsRef.current.isDragging = true;
      controlsRef.current.lastMouseX = e.clientX;
      controlsRef.current.lastMouseY = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (controlsRef.current.isDragging) {
        const dx = e.clientX - controlsRef.current.lastMouseX;
        const dy = e.clientY - controlsRef.current.lastMouseY;
        controlsRef.current.targetRotY += dx * 0.005;
        controlsRef.current.targetRotX += dy * 0.004;
        controlsRef.current.targetRotX = Math.max(-0.2, Math.min(1.3, controlsRef.current.targetRotX));
        controlsRef.current.lastMouseX = e.clientX;
        controlsRef.current.lastMouseY = e.clientY;
      } else {
        // Raycast against 3D planet spheres
        const pos = getCanvasRelativePosition(e);
        mouse.x = pos.x;
        mouse.y = pos.y;
        raycaster.setFromCamera(mouse, camera);

        const meshes = interactiveMeshes.map((im) => im.mesh);
        const intersects = raycaster.intersectObjects(meshes, true);

        if (intersects.length > 0) {
          const hitMesh = intersects[0].object;
          const matched = interactiveMeshes.find(
            (im) => im.mesh === hitMesh || im.mesh.children.includes(hitMesh as THREE.Mesh)
          );
          if (matched) {
            setHoveredPlanet(matched.planet);
            matched.mesh.getWorldPosition(tempVec);
            tempVec.project(camera);
            if (tempVec.z < 1) {
              const rect = renderer.domElement.getBoundingClientRect();
              const sx = (tempVec.x * 0.5 + 0.5) * rect.width;
              const sy = (-(tempVec.y * 0.5) + 0.5) * rect.height;
              setTooltipPos({ x: sx, y: sy });
            }
            renderer.domElement.style.cursor = 'pointer';
            return;
          }
        }
        setHoveredPlanet(null);
        setTooltipPos(null);
        renderer.domElement.style.cursor = controlsRef.current.isDragging ? 'grabbing' : 'grab';
      }
    };

    const handleMouseUp = () => {
      controlsRef.current.isDragging = false;
      renderer.domElement.style.cursor = 'grab';
    };

    const handleClick = (e: MouseEvent) => {
      const pos = getCanvasRelativePosition(e);
      mouse.x = pos.x;
      mouse.y = pos.y;
      raycaster.setFromCamera(mouse, camera);

      const meshes = interactiveMeshes.map((im) => im.mesh);
      const intersects = raycaster.intersectObjects(meshes, true);

      if (intersects.length > 0) {
        const hitMesh = intersects[0].object;
        const matched = interactiveMeshes.find(
          (im) => im.mesh === hitMesh || im.mesh.children.includes(hitMesh as THREE.Mesh)
        );
        if (matched) {
          setActivePlanet(matched.planet);
        }
      }
    };

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);
    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    renderer.domElement.addEventListener('click', handleClick);

    // 8. Animation Loop
    let animationFrameId: number;
    let lastTime = performance.now();
    let frameCount = 0;
    let fpsTimer = 0;

    const animate = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      frameCount++;
      fpsTimer += dt;
      if (fpsTimer >= 1) {
        setFps(frameCount);
        frameCount = 0;
        fpsTimer = 0;
      }

      // Smooth Camera Damping
      const ctrl = controlsRef.current;
      ctrl.rotX += (ctrl.targetRotX - ctrl.rotX) * 0.08;
      ctrl.rotY += (ctrl.targetRotY - ctrl.rotY) * 0.08;
      ctrl.distance += (ctrl.targetDistance - ctrl.distance) * 0.08;

      // Position camera in spherical orbit around center
      const camRadius = ctrl.distance;
      camera.position.x = Math.sin(ctrl.rotY) * Math.cos(ctrl.rotX) * camRadius;
      camera.position.y = Math.sin(ctrl.rotX) * camRadius + 3;
      camera.position.z = Math.cos(ctrl.rotY) * Math.cos(ctrl.rotX) * camRadius;
      camera.lookAt(0, 0, 0);

      // Rotate Sun Core & Corona
      if (sunCoreMeshRef.current) {
        sunCoreMeshRef.current.rotation.y += 0.005;
        const pulse = Math.sin(time * 0.003) * 0.08 + 1;
        sunCoreMeshRef.current.scale.set(pulse, pulse, pulse);
      }
      if (sunCoronaMeshRef.current) {
        sunCoronaMeshRef.current.rotation.y -= 0.008;
        sunCoronaMeshRef.current.rotation.x += 0.004;
      }

      // Rotate Asteroid Belt
      asteroidBelt.rotation.y += 0.0008 * orbitSpeedMultiplier;

      // Orbit 3D Planets around Sun and spin planets on their own Y-axis
      planetOrbitPivots.forEach((pop) => {
        pop.currentAngle += pop.data.orbitSpeed * orbitSpeedMultiplier;
        const x = Math.cos(pop.currentAngle) * pop.data.orbitDistance;
        const z = Math.sin(pop.currentAngle) * pop.data.orbitDistance;
        pop.planetMesh.position.set(x, 0, z);

        // Planet self-rotation (Day/Night cycle)
        pop.planetMesh.rotation.y += 0.015;

        // Update Dynamic Radial Gradient Shader Uniforms
        if (pop.planetMesh.material instanceof THREE.ShaderMaterial) {
          pop.planetMesh.material.uniforms.uTime.value = time * 0.001;
        }

        // Rotate sub-moons & update atmospheric halo shader
        pop.planetMesh.children.forEach((child) => {
          if (child instanceof THREE.Group) {
            child.rotation.y += 0.03;
          }
          if (child instanceof THREE.Mesh && child.material instanceof THREE.ShaderMaterial) {
            child.material.uniforms.uTime.value = time * 0.001;
          }
        });
      });

      // Update Hovered Planet Tooltip 2D screen coordinate in real time as planet orbits
      if (hoveredPlanetRef.current && container) {
        const targetItem = interactiveMeshes.find((im) => im.planet.id === hoveredPlanetRef.current?.id);
        if (targetItem) {
          targetItem.mesh.getWorldPosition(tempVec);
          tempVec.project(camera);
          if (tempVec.z < 1) {
            const sx = (tempVec.x * 0.5 + 0.5) * container.clientWidth;
            const sy = (-(tempVec.y * 0.5) + 0.5) * container.clientHeight;
            setTooltipPos({ x: sx, y: sy });
          }
        }
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (renderer.domElement) {
        renderer.domElement.removeEventListener('mousedown', handleMouseDown);
        renderer.domElement.removeEventListener('click', handleClick);
      }
      renderer.dispose();
    };
  }, [isDark, orbitSpeedMultiplier]);

  const selectedDisplayPlanet = activePlanet || hoveredPlanet;

  const handleResetCamera = () => {
    controlsRef.current.targetRotX = 0.45;
    controlsRef.current.targetRotY = -0.2;
    controlsRef.current.targetDistance = 26;
    setActivePlanet(null);
    setHoveredPlanet(null);
  };

  return (
    <div className="absolute inset-0 pointer-events-auto overflow-hidden select-none" aria-hidden="true">
      {/* Real 3D WebGL Three.js Canvas Container */}
      <div ref={mountRef} className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing" />

      {/* Top Left: 3D Solar Matrix Telemetry */}
      <div className="hidden xl:block absolute left-6 top-28 z-20 pointer-events-auto">
        <div
          className={`p-4 rounded-3xl border backdrop-blur-2xl text-[11px] font-mono space-y-1.5 shadow-2xl transition-all ${
            isDark
              ? 'border-[#00F0FF]/35 bg-[#060611]/90 text-zinc-300 shadow-[0_0_35px_rgba(0,240,255,0.18)]'
              : 'border-cyan-500/50 bg-white/95 text-zinc-800 shadow-xl'
          }`}
        >
          <div className="flex items-center gap-2 text-[#00F0FF]">
            <Compass className="w-4 h-4 animate-spin text-[#00F0FF]" style={{ animationDuration: '9s' }} />
            <span className="font-bold tracking-wider uppercase">
              REAL 3D WEBGL SOLAR MATRIX
            </span>
          </div>
          <div className="text-zinc-500 text-[10px]">
            True 3D spherical planets · Drag space to orbit 360° · Click planet to lock
          </div>
          <div className="flex items-center justify-between text-emerald-400 font-bold pt-1.5 border-t border-black/10 dark:border-white/10 text-[10px]">
            <span>6 Major 3D Spheres · 350 Asteroids</span>
            <span>{fps} FPS // THREE.JS 3D</span>
          </div>
        </div>
      </div>

      {/* Top Right: 3D Solar Orbit Controls */}
      <div className="absolute right-4 sm:right-6 top-28 z-20 pointer-events-auto flex items-center gap-2">
        <div
          className={`flex items-center gap-1.5 p-1.5 rounded-2xl border backdrop-blur-2xl shadow-xl ${
            isDark
              ? 'border-[#00F0FF]/30 bg-[#060611]/90 text-zinc-300'
              : 'border-cyan-400 bg-white/95 text-zinc-800'
          }`}
        >
          {/* Pause / Resume Orbit Animation */}
          <button
            type="button"
            onClick={() =>
              setOrbitSpeedMultiplier((prev) => (prev === 1 ? 2 : prev === 2 ? 0 : 1))
            }
            className={`p-2 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
              orbitSpeedMultiplier > 0
                ? 'bg-[#00F0FF]/20 text-[#00F0FF] font-bold'
                : 'bg-amber-500/20 text-amber-400 font-bold'
            }`}
            title="Toggle Solar Orbit Speed"
            aria-label="Toggle Solar Orbit Speed"
          >
            {orbitSpeedMultiplier === 0 ? (
              <Pause className="w-3.5 h-3.5" />
            ) : orbitSpeedMultiplier === 2 ? (
              <Zap className="w-3.5 h-3.5" />
            ) : (
              <Play className="w-3.5 h-3.5" />
            )}
            <span className="text-[10px]">
              {orbitSpeedMultiplier === 0
                ? 'FREEZE'
                : orbitSpeedMultiplier === 2
                ? '2X WARP'
                : '1X ORBIT'}
            </span>
          </button>

          {/* Reset Camera View */}
          <button
            type="button"
            onClick={handleResetCamera}
            className="p-2 rounded-xl text-zinc-400 hover:text-[#00F0FF] hover:bg-white/5 transition-all cursor-pointer"
            title="Reset 3D Camera Angle"
            aria-label="Reset 3D Camera Angle"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Floating Interactive Hover Glass Tooltip (Right next to orbiting 3D planet) */}
      <AnimatePresence>
        {hoveredPlanet && tooltipPos && (
          <motion.div
            key={hoveredPlanet.id}
            initial={{ opacity: 0, scale: 0.82, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.82, y: 6 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            style={{
              left: `${tooltipPos.x}px`,
              top: `${tooltipPos.y}px`,
              transform: 'translate(-50%, -145%)',
            }}
            className={`absolute z-40 pointer-events-none px-3.5 py-2 rounded-2xl border backdrop-blur-2xl shadow-2xl flex items-center gap-2.5 whitespace-nowrap select-none ${
              isDark
                ? 'border-[#00F0FF]/50 bg-[#060614]/90 text-white shadow-[0_12px_35px_rgba(0,240,255,0.3)]'
                : 'border-cyan-500/60 bg-white/95 text-zinc-950 shadow-[0_12px_30px_rgba(0,180,216,0.25)]'
            }`}
          >
            {/* Glowing Orbit Pip */}
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0 animate-pulse shadow-sm"
              style={{
                backgroundColor: hoveredPlanet.accentColor,
                boxShadow: `0 0 12px ${hoveredPlanet.glowColor}`,
              }}
            />

            {/* Service Name & Status */}
            <div className="flex flex-col text-left">
              <span className="text-xs font-mono font-bold tracking-tight">
                {hoveredPlanet.name}
              </span>
              <span className="text-[9px] font-mono text-zinc-400 flex items-center gap-1">
                <span style={{ color: hoveredPlanet.accentColor }}>●</span>
                <span>{hoveredPlanet.astronomicalType.split('·')[0]?.trim()}</span>
                <span className="text-zinc-500">· Click to inspect</span>
              </span>
            </div>

            {/* Bottom Pointing Notch */}
            <div
              className={`absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-2.5 h-2.5 rotate-45 border-r border-b ${
                isDark
                  ? 'border-[#00F0FF]/50 bg-[#060614]'
                  : 'border-cyan-500/60 bg-white'
              }`}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Holographic Service Telemetry Card (When 3D Planet is Clicked or Locked) */}
      <AnimatePresence>
        {activePlanet && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.94 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-20 sm:w-96 p-5 rounded-3xl border shadow-2xl backdrop-blur-2xl z-30 pointer-events-auto ${
              isDark
                ? 'border-[#00F0FF]/45 bg-[#080816]/95 text-white shadow-[0_20px_60px_rgba(0,240,255,0.28)]'
                : 'border-cyan-500/50 bg-white/95 text-zinc-950 shadow-[0_20px_50px_rgba(0,180,216,0.22)]'
            }`}
          >
            {/* Holographic Header Bar */}
            <div className="flex items-center justify-between pb-2.5 border-b border-black/10 dark:border-white/10 mb-3 text-[11px] font-mono">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full animate-ping"
                  style={{ backgroundColor: activePlanet.accentColor }}
                />
                <span
                  className="font-bold tracking-wider uppercase"
                  style={{ color: activePlanet.accentColor }}
                >
                  {activePlanet.codename}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActivePlanet(null);
                  setHoveredPlanet(null);
                }}
                className="text-zinc-500 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
                aria-label="Close telemetry HUD"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Astronomical Orbit Classification */}
            <div className="text-[10px] font-mono text-zinc-400 mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" style={{ color: activePlanet.accentColor }} />
              <span>{activePlanet.astronomicalType}</span>
            </div>

            {/* Title & Tagline */}
            <div className="flex items-start gap-3 mb-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg"
                style={{
                  backgroundColor: `${activePlanet.accentColor}25`,
                  color: activePlanet.accentColor,
                  border: `1.5px solid ${activePlanet.accentColor}60`,
                }}
              >
                <activePlanet.icon className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-black font-display leading-tight truncate">
                  {activePlanet.name}
                </h4>
                <span className="text-[10px] font-mono text-zinc-400 block truncate">
                  {activePlanet.category}
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed mb-3 line-clamp-2">
              {activePlanet.tagline}
            </p>

            {/* Feature Highlights Snapshot */}
            <div className="space-y-1.5 mb-3.5">
              {activePlanet.highlights.map((h) => (
                <div key={h} className="flex items-center gap-2 text-xs font-mono">
                  <CheckCircle2
                    className="w-3.5 h-3.5 shrink-0"
                    style={{ color: activePlanet.accentColor }}
                  />
                  <span className={isDark ? 'text-zinc-300' : 'text-zinc-700'}>{h}</span>
                </div>
              ))}
            </div>

            {/* Pricing / Timeline Bar */}
            <div className="p-2.5 rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 flex items-center justify-between text-xs font-mono mb-3.5">
              <div>
                <span className="text-[9px] text-zinc-500 block uppercase font-bold">Pricing</span>
                <span className="font-bold text-[#00F0FF]">{activePlanet.pricing}</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-zinc-500 block uppercase font-bold">Turnaround</span>
                <span className="font-semibold text-emerald-400">
                  {activePlanet.timeline}
                </span>
              </div>
            </div>

            {/* Launch Action */}
            <button
              type="button"
              onClick={() => {
                if (onNavigate) {
                  onNavigate(`/services/${activePlanet.slug}`);
                } else {
                  window.location.href = `/services/${activePlanet.slug}`;
                }
              }}
              className="w-full py-3 px-4 rounded-2xl font-mono text-xs font-bold uppercase tracking-wider bg-[#00F0FF] hover:bg-[#38bdf8] text-black shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore {activePlanet.name} Matrix</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Floating Planetary Selector Navigation Bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-auto max-w-full px-3">
        <div
          className={`flex items-center gap-1.5 p-1.5 sm:p-2 rounded-full border backdrop-blur-2xl shadow-2xl overflow-x-auto max-w-[95vw] scrollbar-none ${
            isDark
              ? 'border-[#00F0FF]/35 bg-[#060611]/90 shadow-[0_10px_35px_rgba(0,240,255,0.22)]'
              : 'border-cyan-400/60 bg-white/95 shadow-xl'
          }`}
        >
          <span className="hidden sm:inline-block px-3 text-[10px] font-mono uppercase tracking-widest text-[#00F0FF] font-bold shrink-0">
            [ 3D PLANETS ]
          </span>

          {SERVICE_PLANETS_DATA.map((planet) => {
            const isSelected = selectedDisplayPlanet?.id === planet.id;
            return (
              <button
                key={planet.id}
                type="button"
                onClick={() => {
                  setActivePlanet(planet);
                  setHoveredPlanet(planet);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  isSelected
                    ? 'font-bold text-black shadow-md'
                    : isDark
                    ? 'text-zinc-300 hover:text-white hover:bg-white/10'
                    : 'text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100'
                }`}
                style={
                  isSelected
                    ? {
                        backgroundColor: planet.accentColor,
                        boxShadow: `0 0 18px ${planet.glowColor}`,
                      }
                    : {}
                }
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                  style={{ backgroundColor: planet.accentColor }}
                />
                <span className="text-[11px] whitespace-nowrap font-medium">
                  {planet.shortName}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

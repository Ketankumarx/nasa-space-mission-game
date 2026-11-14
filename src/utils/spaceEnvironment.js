// Cosmic Space Environment Generator for Project Orbital
// Creates colorful deep-space nebulae, multi-spectral starfields, and distant galaxies
// Guarantees no pitch-black empty backgrounds across any game level!
import * as THREE from 'three';

// 1. Procedural Nebula Texture Generator
export function createNebulaTexture(type = 'carina') {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Deep space base (deep cosmic navy / violet, never pitch black)
  const baseGrad = ctx.createRadialGradient(512, 512, 100, 512, 512, 700);
  if (type === 'carina') {
    baseGrad.addColorStop(0, '#0c1a3a');
    baseGrad.addColorStop(0.5, '#081226');
    baseGrad.addColorStop(1, '#030814');
  } else if (type === 'orion') {
    baseGrad.addColorStop(0, '#2d1305');
    baseGrad.addColorStop(0.5, '#190a03');
    baseGrad.addColorStop(1, '#060308');
  } else if (type === 'purple') {
    baseGrad.addColorStop(0, '#200b3b');
    baseGrad.addColorStop(0.5, '#110521');
    baseGrad.addColorStop(1, '#04020a');
  } else {
    baseGrad.addColorStop(0, '#042f2e');
    baseGrad.addColorStop(0.5, '#021f1e');
    baseGrad.addColorStop(1, '#010f0f');
  }
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, 1024, 1024);

  // Volumetric gaseous nebula clouds
  const cloudCount = 18;
  for (let i = 0; i < cloudCount; i++) {
    const cx = 200 + Math.random() * 624;
    const cy = 200 + Math.random() * 624;
    const radius = 140 + Math.random() * 260;

    const cloudGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, radius);
    if (type === 'carina') {
      // Cyan, electric blue & magenta
      const isCyan = i % 2 === 0;
      cloudGrad.addColorStop(0, isCyan ? 'rgba(56, 189, 248, 0.28)' : 'rgba(192, 132, 252, 0.22)');
      cloudGrad.addColorStop(0.6, isCyan ? 'rgba(14, 165, 233, 0.12)' : 'rgba(147, 51, 234, 0.08)');
      cloudGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    } else if (type === 'orion') {
      // Amber, gold, fiery red
      cloudGrad.addColorStop(0, 'rgba(251, 191, 36, 0.26)');
      cloudGrad.addColorStop(0.5, 'rgba(234, 88, 12, 0.14)');
      cloudGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    } else if (type === 'purple') {
      // Deep violet & pink
      cloudGrad.addColorStop(0, 'rgba(244, 114, 182, 0.25)');
      cloudGrad.addColorStop(0.5, 'rgba(168, 85, 247, 0.15)');
      cloudGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    } else {
      // Emerald & cyan aurora
      cloudGrad.addColorStop(0, 'rgba(45, 212, 191, 0.25)');
      cloudGrad.addColorStop(0.5, 'rgba(20, 184, 166, 0.12)');
      cloudGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    }

    ctx.fillStyle = cloudGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // Micro cosmic dust specs
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    const r = Math.random() * 1.5;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// 2. Build a Complete Cosmic Sky Dome with Layered Nebulae & Stars
export function createCosmicEnvironment(scene, options = {}) {
  const type = options.type || 'carina'; // 'carina' | 'orion' | 'purple' | 'aurora'
  const radius = options.radius || 2500;

  const envGroup = new THREE.Group();

  // A. Giant Celestial Sphere (Background dome with nebula texture)
  const nebulaTex = createNebulaTexture(type);
  nebulaTex.repeat.set(2, 2);

  const skyGeom = new THREE.SphereGeometry(radius, 32, 32);
  const skyMat = new THREE.MeshBasicMaterial({
    map: nebulaTex,
    side: THREE.BackSide,
    depthWrite: false
  });
  const skyDome = new THREE.Mesh(skyGeom, skyMat);
  envGroup.add(skyDome);

  // B. Dense Multi-Spectral Starfield (3,500 colored stars)
  const starCount = options.starCount || 3500;
  const starGeom = new THREE.BufferGeometry();
  const starPositions = new Float32Array(starCount * 3);
  const starColors = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount * 3; i += 3) {
    // Distribute on outer sphere shell
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = radius * 0.9 + (Math.random() - 0.5) * 100;

    starPositions[i] = r * Math.sin(phi) * Math.cos(theta);
    starPositions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
    starPositions[i + 2] = r * Math.cos(phi);

    // Stellar spectral classification colors (OBAFGKM)
    const colorRoll = Math.random();
    if (colorRoll > 0.85) {
      // Blue giant (Hot O/B class)
      starColors[i] = 0.55; starColors[i + 1] = 0.75; starColors[i + 2] = 1.0;
    } else if (colorRoll > 0.6) {
      // White/A-F class
      starColors[i] = 0.95; starColors[i + 1] = 0.98; starColors[i + 2] = 1.0;
    } else if (colorRoll > 0.3) {
      // Golden G class (Sun-like)
      starColors[i] = 1.0; starColors[i + 1] = 0.9; starColors[i + 2] = 0.65;
    } else {
      // Orange/Red dwarf M class
      starColors[i] = 1.0; starColors[i + 1] = 0.55; starColors[i + 2] = 0.35;
    }
  }

  starGeom.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  starGeom.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

  const starMat = new THREE.PointsMaterial({
    size: 2.0,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    depthWrite: false
  });
  const starPoints = new THREE.Points(starGeom, starMat);
  envGroup.add(starPoints);

  // C. Distant Spiral Galaxy
  const galaxyGroup = createDistantGalaxy();
  galaxyGroup.position.set(-radius * 0.45, radius * 0.3, -radius * 0.6);
  galaxyGroup.scale.set(12, 12, 12);
  envGroup.add(galaxyGroup);

  // D. Floating Volumetric Cosmic Dust Clouds in mid-range
  for (let i = 0; i < 4; i++) {
    const cloudMesh = new THREE.Mesh(
      new THREE.SphereGeometry(120, 16, 16),
      new THREE.MeshBasicMaterial({
        color: type === 'orion' ? 0xf59e0b : type === 'purple' ? 0xa855f7 : 0x0284c7,
        transparent: true,
        opacity: 0.04,
        side: THREE.BackSide,
        depthWrite: false
      })
    );
    cloudMesh.position.set(
      (Math.random() - 0.5) * 800,
      (Math.random() - 0.5) * 400,
      (Math.random() - 0.5) * 800
    );
    envGroup.add(cloudMesh);
  }

  scene.add(envGroup);
  return envGroup;
}

// 3. Distant Spiral Galaxy Mesh
function createDistantGalaxy() {
  const group = new THREE.Group();
  const particleCount = 600;
  const geom = new THREE.BufferGeometry();
  const pos = new Float32Array(particleCount * 3);
  const col = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    const r = Math.pow(Math.random(), 2) * 15;
    const branches = 2;
    const branchAngle = ((i % branches) * ((2 * Math.PI) / branches));
    const spinAngle = r * 0.6;

    pos[i3] = Math.cos(branchAngle + spinAngle) * r + (Math.random() - 0.5) * 2;
    pos[i3 + 1] = (Math.random() - 0.5) * 1.5;
    pos[i3 + 2] = Math.sin(branchAngle + spinAngle) * r + (Math.random() - 0.5) * 2;

    const centerDist = r / 15;
    col[i3] = 1.0;
    col[i3 + 1] = 0.7 + (1 - centerDist) * 0.3;
    col[i3 + 2] = 0.5 + centerDist * 0.5;
  }

  geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geom.setAttribute('color', new THREE.BufferAttribute(col, 3));

  const mat = new THREE.PointsMaterial({
    size: 2.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.65,
    depthWrite: false
  });
  const galaxy = new THREE.Points(geom, mat);
  galaxy.rotation.x = Math.PI / 3;
  group.add(galaxy);

  // Core glow
  const coreGlow = new THREE.Mesh(
    new THREE.SphereGeometry(2, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xffedd5, transparent: true, opacity: 0.4 })
  );
  group.add(coreGlow);

  return group;
}


// Ultra-High-Fidelity Aerospace Heavy-Lift Launch Vehicle Builder (Project Orbital)
import * as THREE from 'three';

/**
 * 1. Procedural High-Resolution Aerospace PBR Texture Generator (2048x2048)
 * Generates aluminum-lithium panels, orthogrid milling patterns, weld seams,
 * rivets, NASA insignia, USA flags, technical stencils, and cryogenic frost.
 */
export function createRocketFuselageTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 2048;
  const ctx = canvas.getContext('2d');

  // Aerospace Satin Off-White Fuselage Base
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, 2048, 2048);

  // Subtle metallic micro-noise grain
  ctx.fillStyle = 'rgba(203, 213, 225, 0.15)';
  for (let i = 0; i < 4000; i++) {
    const rx = Math.random() * 2048;
    const ry = Math.random() * 2048;
    ctx.fillRect(rx, ry, 2, 2);
  }

  // --- Horizontal Panel Seams & Friction-Stir Weld Joints ---
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 3;
  const panelRings = 24;
  for (let i = 0; i <= panelRings; i++) {
    const y = (i / panelRings) * 2048;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(2048, y);
    ctx.stroke();

    // Rivet / fastener line along each weld joint
    ctx.fillStyle = '#64748b';
    for (let r = 0; r < 64; r++) {
      const rx = (r / 64) * 2048 + (i % 2 === 0 ? 8 : 24);
      ctx.beginPath();
      ctx.arc(rx, y - 6, 2, 0, Math.PI * 2);
      ctx.arc(rx, y + 6, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // --- Vertical Stringers & Orthogrid Ribs ---
  const stringers = 16;
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 3;
  for (let i = 0; i < stringers; i++) {
    const x = (i / stringers) * 2048;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 2048);
    ctx.stroke();
  }

  // --- Interstage Carbon Composite Vented Section ---
  ctx.fillStyle = '#090d16';
  ctx.fillRect(0, 960, 2048, 160);

  // Vented Truss Lattice Slots (Interstage Hot-Staging Vents)
  ctx.fillStyle = '#020617';
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1;
  const ventCount = 36;
  for (let i = 0; i < ventCount; i++) {
    const vx = i * (2048 / ventCount) + 10;
    ctx.fillRect(vx, 985, 34, 110);
    ctx.strokeRect(vx, 985, 34, 110);
  }

  // Interstage Gold Chevrons & Stage Separation Warning
  ctx.fillStyle = '#f59e0b';
  ctx.font = 'bold 22px monospace';
  for (let c = 0; c < 8; c++) {
    const cx = c * 256 + 30;
    ctx.fillText('▲ STAGE SEPARATION INTERFACE ▲', cx, 950);
  }

  // --- NASA Worm Livery Red Stripes & Badging ---
  // Prominent NASA Red Stripe
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(400, 320, 340, 48);
  ctx.fillRect(400, 520, 340, 24);
  ctx.fillRect(1420, 320, 340, 48);

  // NASA Worm Typography (Drawn Vector-Style)
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 64px "Chakra Petch", sans-serif';
  ctx.fillText('NASA', 450, 362);
  ctx.fillText('NASA', 1470, 362);

  // Project Title & Vehicle Identifier
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 36px "Orbitron", sans-serif';
  ctx.fillText('PROJECT ORBITAL', 400, 430);
  ctx.fillText('HEAVY LAUNCH VEHICLE — LV-904X', 400, 475);
  ctx.fillText('PROJECT ORBITAL', 1420, 430);
  ctx.fillText('HEAVY LAUNCH VEHICLE — LV-904X', 1420, 475);

  // United States Flag Decal
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(400, 580, 160, 100);
  ctx.fillStyle = '#b91c1c';
  for (let s = 0; s < 7; s++) {
    ctx.fillRect(400, 580 + s * 14, 160, 7);
  }
  ctx.fillStyle = '#1d4ed8';
  ctx.fillRect(400, 580, 70, 50);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('★ ★ ★', 408, 608);

  // "UNITED STATES" Technical Marking
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 32px "Chakra Petch", monospace';
  ctx.fillText('UNITED STATES', 580, 640);

  // Optical Roll Targets (Checkered circles used by launch cameras)
  function drawRollTarget(cx, cy, r) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, r, 0, Math.PI / 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, r, Math.PI, Math.PI * 1.5);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  drawRollTarget(250, 750, 45);
  drawRollTarget(1270, 750, 45);
  drawRollTarget(250, 1450, 45);
  drawRollTarget(1270, 1450, 45);

  // Warning & Cautionary Aerospace Markings
  ctx.fillStyle = '#e11d48';
  ctx.font = 'bold 18px monospace';
  ctx.fillText('DANGER // CRYOGENIC PROPELLANT (LOX / LH2)', 400, 1250);
  ctx.fillText('HIGH PRESSURE UMBILICAL DISCONNECT', 400, 1280);
  ctx.fillText('CAUTION: HOT STAGING PYROTECHNICS', 400, 1310);
  ctx.fillText('DANGER // CRYOGENIC PROPELLANT (LOX / LH2)', 1420, 1250);
  ctx.fillText('HIGH PRESSURE UMBILICAL DISCONNECT', 1420, 1280);

  // Cryogenic Frost Band on Stage 1 LOX tank
  const frostGrad = ctx.createLinearGradient(0, 1350, 0, 1900);
  frostGrad.addColorStop(0, 'rgba(255, 255, 255, 0.0)');
  frostGrad.addColorStop(0.2, 'rgba(255, 255, 255, 0.45)');
  frostGrad.addColorStop(0.8, 'rgba(255, 255, 255, 0.45)');
  frostGrad.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
  ctx.fillStyle = frostGrad;
  ctx.fillRect(0, 1350, 2048, 550);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * 2. High-Fidelity Rocket 3D Model Constructor
 * Builds a multi-stage heavy-lift vehicle with 9 individual engine assemblies,
 * grid fins, delta fins, feed lines, payload fairings that split, and satellite payload.
 */
export function buildRealisticRocket() {
  const rocketGroup = new THREE.Group();
  const fuselageTexture = createRocketFuselageTexture();

  // --- PBR Materials with realistic metallic reflections and roughness ---
  const whiteAeroMat = new THREE.MeshStandardMaterial({
    map: fuselageTexture,
    metalness: 0.65,
    roughness: 0.22,
    envMapIntensity: 1.2
  });

  const darkCarbonMat = new THREE.MeshStandardMaterial({
    color: 0x090d16,
    metalness: 0.85,
    roughness: 0.28
  });

  const titaniumMat = new THREE.MeshStandardMaterial({
    color: 0x64748b,
    metalness: 0.95,
    roughness: 0.18
  });

  const engineBellMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    metalness: 0.92,
    roughness: 0.32
  });

  const goldFoilMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.95,
    roughness: 0.15
  });

  const solarPanelMat = new THREE.MeshStandardMaterial({
    color: 0x1e3a8a,
    metalness: 0.8,
    roughness: 0.1
  });

  // =========================================================================
  // --- STAGE 1: BOOSTER CORE (Height: ~38m, Radius: 2.2m) ---
  // =========================================================================
  const boosterGroup = new THREE.Group();

  // A. Lower Boattail / Engine Skirt (flared conical transition to heatshield)
  const boattailGeom = new THREE.CylinderGeometry(2.2, 2.45, 3.5, 48);
  const boattailMesh = new THREE.Mesh(boattailGeom, darkCarbonMat);
  boattailMesh.position.y = 1.75;
  boattailMesh.castShadow = true;
  boattailMesh.receiveShadow = true;
  boosterGroup.add(boattailMesh);

  // Base Heat Shield Baseplate
  const heatshieldMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(2.45, 2.45, 0.4, 48),
    new THREE.MeshStandardMaterial({ color: 0x05070d, roughness: 0.9, metalness: 0.2 })
  );
  heatshieldMesh.position.y = 0.2;
  boosterGroup.add(heatshieldMesh);

  // B. Main Propellant Tank Core (Liquid Oxygen & RP-1 Tanks)
  const tankCoreGeom = new THREE.CylinderGeometry(2.2, 2.2, 34, 48);
  const tankCoreMesh = new THREE.Mesh(tankCoreGeom, whiteAeroMat);
  tankCoreMesh.position.y = 20.5; // From y=3.5 to 37.5
  tankCoreMesh.castShadow = true;
  tankCoreMesh.receiveShadow = true;
  boosterGroup.add(tankCoreMesh);

  // C. Inter-Tank Ribbed Ring Collar (Between LOX and Fuel Tanks)
  const interTankCollar = new THREE.Mesh(
    new THREE.CylinderGeometry(2.24, 2.24, 1.6, 48),
    darkCarbonMat
  );
  interTankCollar.position.y = 19.5;
  boosterGroup.add(interTankCollar);

  // D. External Heavy Cryogenic Propellant Feedlines (2 opposite pipes)
  [-2.23, 2.23].forEach(x => {
    const pipe = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 32, 16),
      titaniumMat
    );
    pipe.position.set(x, 19.5, 0);
    boosterGroup.add(pipe);

    // Feedline Pipe Brackets every 4 meters
    for (let by = 5; by <= 33; by += 4) {
      const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.2, 0.35), darkCarbonMat);
      bracket.position.set(x, by, 0);
      boosterGroup.add(bracket);
    }
  });

  // E. Longitudinal Aerodynamic Avionics Raceways (Cable Trays)
  [0, Math.PI].forEach(ang => {
    const z = Math.cos(ang) * 2.22;
    const x = Math.sin(ang) * 2.22;
    const raceway = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 33, 0.18),
      darkCarbonMat
    );
    raceway.position.set(x, 20, z);
    raceway.rotation.y = ang;
    boosterGroup.add(raceway);
  });

  // F. 4 Aerodynamic Delta Stabilizer Fins (Base of booster for high stability)
  for (let i = 0; i < 4; i++) {
    const ang = (i * Math.PI) / 2;
    const finGroup = new THREE.Group();
    finGroup.position.set(Math.cos(ang) * 2.3, 3.2, Math.sin(ang) * 2.3);
    finGroup.rotation.y = -ang;

    // Delta Fin Shape
    const finShape = new THREE.Shape();
    finShape.moveTo(0, 0);
    finShape.lineTo(2.2, -1.8);
    finShape.lineTo(2.2, -0.6);
    finShape.lineTo(0, 3.8);
    finShape.closePath();

    const extrudeSettings = { depth: 0.12, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.04, bevelThickness: 0.04 };
    const finGeom = new THREE.ExtrudeGeometry(finShape, extrudeSettings);
    const finMesh = new THREE.Mesh(finGeom, titaniumMat);
    finMesh.rotation.y = Math.PI / 2;
    finGroup.add(finMesh);

    boosterGroup.add(finGroup);
  }

  // G. 4 Steerable Titanium Grid Fins (Top of stage 1 booster)
  const gridFins = [];
  [0, Math.PI / 2, Math.PI, Math.PI * 1.5].forEach(ang => {
    const finGroup = new THREE.Group();
    finGroup.position.set(Math.cos(ang) * 2.22, 35.8, Math.sin(ang) * 2.22);
    finGroup.rotation.y = ang;

    // Actuator Hinge Box
    const hinge = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.6, 0.6), darkCarbonMat);
    hinge.position.x = 0.15;
    finGroup.add(hinge);

    // Titanium Grid Fin Blade (Diamond grid frame)
    const bladeFrame = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.12, 1.4), titaniumMat);
    bladeFrame.position.x = 1.05;
    bladeFrame.castShadow = true;
    finGroup.add(bladeFrame);

    boosterGroup.add(finGroup);
    gridFins.push(finGroup);
  });

  // H. 4 Folded Carbon Landing Struts
  for (let i = 0; i < 4; i++) {
    const ang = (i * Math.PI) / 2 + Math.PI / 4;
    const legGroup = new THREE.Group();
    legGroup.position.set(Math.cos(ang) * 2.25, 1.0, Math.sin(ang) * 2.25);
    legGroup.rotation.y = ang;

    const legA = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 9.5), darkCarbonMat);
    legA.position.set(0.12, 4.6, 0);
    legA.rotation.z = -0.035;
    legGroup.add(legA);

    boosterGroup.add(legGroup);
  }

  // I. Octaweb Engine Cluster: 9 Individual Engine Assemblies & Nozzles
  const engineNozzles = [];
  const enginePlumes = [];

  function createEngineAssembly(radius, height, x, z) {
    const assy = new THREE.Group();
    assy.position.set(x, 0.2, z);

    // Gimbal Ring Mount
    const gimbal = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.7, radius * 0.7, 0.3, 16), titaniumMat);
    gimbal.position.y = -0.15;
    assy.add(gimbal);

    // Turbopump Manifold
    const manifold = new THREE.Mesh(new THREE.TorusGeometry(radius * 0.55, 0.08, 8, 16), darkCarbonMat);
    manifold.rotation.x = Math.PI / 2;
    manifold.position.y = -0.25;
    assy.add(manifold);

    // Bell Nozzle
    const bellGeom = new THREE.ConeGeometry(radius, height, 24, 2, true);
    const bellMesh = new THREE.Mesh(bellGeom, engineBellMat);
    bellMesh.position.y = -height / 2 - 0.2;
    assy.add(bellMesh);

    // Glowing Ceramic Inner Throat Ring
    const throatMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(radius * 0.35, radius * 0.35, 0.2, 16),
      new THREE.MeshBasicMaterial({ color: 0xffedd5, transparent: true, opacity: 0.9 })
    );
    throatMesh.position.y = -0.3;
    assy.add(throatMesh);

    // Individual Supersonic Nozzle Plume
    const nozPlume = new THREE.Mesh(
      new THREE.ConeGeometry(radius * 0.85, 7.5, 16),
      new THREE.MeshBasicMaterial({ color: 0xfef08a, transparent: true, opacity: 0 })
    );
    nozPlume.rotation.x = Math.PI;
    nozPlume.position.y = -height - 3.75;
    assy.add(nozPlume);

    engineNozzles.push(bellMesh);
    enginePlumes.push(nozPlume);
    return assy;
  }

  // 1 Center Engine
  const centerAssy = createEngineAssembly(0.72, 1.8, 0, 0);
  boosterGroup.add(centerAssy);

  // 8 Outer Ring Engines
  for (let i = 0; i < 8; i++) {
    const ang = (i * Math.PI) / 4;
    const x = Math.cos(ang) * 1.45;
    const z = Math.sin(ang) * 1.45;
    const outerAssy = createEngineAssembly(0.58, 1.6, x, z);
    boosterGroup.add(outerAssy);
  }

  rocketGroup.add(boosterGroup);

  // =========================================================================
  // --- STAGE 2: UPPER EXPLORATION STAGE (Separates cleanly in flight) ---
  // =========================================================================
  const upperStageGroup = new THREE.Group();
  upperStageGroup.position.y = 37.5; // Mounts on top of booster

  // A. Vented Interstage Structure (Stay with booster or upper stage interface)
  const interstageMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(2.2, 2.2, 3.2, 48),
    darkCarbonMat
  );
  interstageMesh.position.y = 1.6;
  upperStageGroup.add(interstageMesh);

  // B. Stage 2 Vacuum Engine (Large vacuum niobium bell nozzle)
  const vacEngine = new THREE.Mesh(
    new THREE.ConeGeometry(1.25, 2.6, 32, 1, true),
    new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.95, roughness: 0.25 })
  );
  vacEngine.position.y = 1.3;
  upperStageGroup.add(vacEngine);

  // Vacuum Engine Glowing Plume
  const vacPlume = new THREE.Mesh(
    new THREE.ConeGeometry(1.8, 14, 24),
    new THREE.MeshBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0 })
  );
  vacPlume.rotation.x = Math.PI;
  vacPlume.position.y = -6;
  upperStageGroup.add(vacPlume);

  // C. Stage 2 Propellant Tank
  const secondStageTankGeom = new THREE.CylinderGeometry(2.2, 2.2, 10.5, 48);
  const secondStageTankMesh = new THREE.Mesh(secondStageTankGeom, whiteAeroMat);
  secondStageTankMesh.position.y = 8.45;
  secondStageTankMesh.castShadow = true;
  upperStageGroup.add(secondStageTankMesh);

  // D. Reaction Control System (RCS) Thruster Blocks (4 Quad Pods)
  const rcsThrusters = [];
  [0, Math.PI / 2, Math.PI, Math.PI * 1.5].forEach(ang => {
    const pod = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.4, 0.3), darkCarbonMat);
    pod.position.set(Math.cos(ang) * 2.25, 12.8, Math.sin(ang) * 2.25);
    upperStageGroup.add(pod);
    rcsThrusters.push(pod);
  });

  // E. Scientific Spacecraft / Satellite Payload (Inside Fairings)
  const payloadGroup = new THREE.Group();
  payloadGroup.position.y = 14.8;

  // Gold foil satellite body
  const satBody = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2.2, 1.8), goldFoilMat);
  satBody.castShadow = true;
  payloadGroup.add(satBody);

  // Folded Solar Arrays (Left & Right)
  [-1.15, 1.15].forEach(x => {
    const array = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.0, 1.4), solarPanelMat);
    array.position.set(x, 0, 0);
    payloadGroup.add(array);
  });

  // High-Gain Parabolic Communications Dish
  const dish = new THREE.Mesh(
    new THREE.SphereGeometry(0.7, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.8, roughness: 0.2, side: THREE.DoubleSide })
  );
  dish.rotation.x = Math.PI / 4;
  dish.position.set(0, 1.3, 0);
  payloadGroup.add(dish);

  upperStageGroup.add(payloadGroup);

  // F. Aerodynamic Biconic Payload Fairings (Split into Port & Starboard Halves)
  const fairingPortGroup = new THREE.Group();
  const fairingStarboardGroup = new THREE.Group();
  fairingPortGroup.position.y = 13.5;
  fairingStarboardGroup.position.y = 13.5;

  // Cylindrical base adapter
  const fairingBasePort = new THREE.Mesh(
    new THREE.CylinderGeometry(2.35, 2.2, 4.0, 32, 1, false, 0, Math.PI),
    whiteAeroMat
  );
  fairingBasePort.position.y = 2.0;
  fairingPortGroup.add(fairingBasePort);

  const fairingBaseStarboard = new THREE.Mesh(
    new THREE.CylinderGeometry(2.35, 2.2, 4.0, 32, 1, false, Math.PI, Math.PI),
    whiteAeroMat
  );
  fairingBaseStarboard.position.y = 2.0;
  fairingStarboardGroup.add(fairingBaseStarboard);

  // Aerodynamic Pointed Nose Cone Halves (Ogive curve)
  const nosePort = new THREE.Mesh(
    new THREE.ConeGeometry(2.35, 8.5, 32, 1, false, 0, Math.PI),
    whiteAeroMat
  );
  nosePort.position.y = 8.25;
  fairingPortGroup.add(nosePort);

  const noseStarboard = new THREE.Mesh(
    new THREE.ConeGeometry(2.35, 8.5, 32, 1, false, Math.PI, Math.PI),
    whiteAeroMat
  );
  noseStarboard.position.y = 8.25;
  fairingStarboardGroup.add(noseStarboard);

  upperStageGroup.add(fairingPortGroup);
  upperStageGroup.add(fairingStarboardGroup);

  rocketGroup.add(upperStageGroup);

  // =========================================================================
  // --- REALISTIC MULTI-TIER ENGINE EXHAUST & FLAME SYSTEM ---
  // =========================================================================
  const mainFlameGroup = new THREE.Group();
  mainFlameGroup.position.set(0, -0.2, 0);

  // 1. Massive White-Hot Supersonic Core Flame (Turbulent needle core)
  const coreGeom = new THREE.ConeGeometry(1.6, 26, 32);
  const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
  const innerCore = new THREE.Mesh(coreGeom, coreMat);
  innerCore.rotation.x = Math.PI;
  innerCore.position.y = -13;
  mainFlameGroup.add(innerCore);

  // 2. High-Temperature Expanding Outer Plume (Vibrant Solar Gold & Orange)
  const outerGeom = new THREE.ConeGeometry(3.6, 34, 32);
  const outerMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0 });
  const outerPlume = new THREE.Mesh(outerGeom, outerMat);
  outerPlume.rotation.x = Math.PI;
  outerPlume.position.y = -17;
  mainFlameGroup.add(outerPlume);

  // 3. Ionization Shock Diamonds (6 Cherenkov/Cyan shockwave cones)
  const machDiamonds = [];
  for (let i = 1; i <= 6; i++) {
    const diamond = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.85 * (1 - i * 0.12), 1),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0 })
    );
    diamond.position.y = -i * 4.2;
    mainFlameGroup.add(diamond);
    machDiamonds.push(diamond);
  }

  // 4. Dual Dynamic Point Lights (Warm Pad Glow + Cyan Core Flash)
  const padFlameLight = new THREE.PointLight(0xf59e0b, 0, 120);
  padFlameLight.position.set(0, -3, 0);
  mainFlameGroup.add(padFlameLight);

  const coreFlashLight = new THREE.PointLight(0x60a5fa, 0, 80);
  coreFlashLight.position.set(0, -1, 0);
  mainFlameGroup.add(coreFlashLight);

  rocketGroup.add(mainFlameGroup);

  // Transonic Condensation Shock Cone (Flashes around nose at Mach 1)
  const shockConeGeom = new THREE.ConeGeometry(3.6, 4.5, 32, 1, true);
  const shockConeMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, side: THREE.DoubleSide });
  const shockCone = new THREE.Mesh(shockConeGeom, shockConeMat);
  shockCone.position.set(0, 52, 0);
  rocketGroup.add(shockCone);

  // Attach all controllable subsystems to userData for cinematic animation
  rocketGroup.userData = {
    boosterGroup,
    upperStageGroup,
    fairingPortGroup,
    fairingStarboardGroup,
    payloadGroup,
    gridFins,
    engineNozzles,
    enginePlumes,
    vacPlume,
    innerCore,
    outerPlume,
    machDiamonds,
    padFlameLight,
    coreFlashLight,
    shockCone
  };

  return rocketGroup;
}

// 3D Game Models Generator for Project Orbital Gameplay
import * as THREE from 'three';
import { createSolarPanelTexture, createGoldFoilTexture } from './textureGenerator';

// 1. High-Detail Spacecraft Model for Direct Third-Person Flight
export function createPlayerShipModel(options = {}) {
  const shipGroup = new THREE.Group();

  const primaryColor = options.primaryColor || 0x0f172a;
  const accentColor = options.accentColor || 0x38bdf8;
  const thrusterColor = options.isIon ? 0x38bdf8 : 0xf97316;

  // Materials
  const hullMat = new THREE.MeshStandardMaterial({
    color: primaryColor,
    metalness: 0.85,
    roughness: 0.25
  });

  const armorPlateMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    metalness: 0.9,
    roughness: 0.3
  });

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.8,
    roughness: 0.35
  });

  const canopyMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    roughness: 0.1,
    metalness: 0.9,
    transparent: true,
    opacity: 0.75
  });

  const glowAccentMat = new THREE.MeshBasicMaterial({
    color: accentColor
  });

  const thrusterGlowMat = new THREE.MeshBasicMaterial({
    color: thrusterColor
  });

  // Central Fuselage (Aerospace aerodynamic lifting body)
  const fuselageGeom = new THREE.CylinderGeometry(0.7, 1.2, 5.0, 8);
  const fuselage = new THREE.Mesh(fuselageGeom, hullMat);
  fuselage.rotation.x = Math.PI / 2;
  fuselage.castShadow = true;
  fuselage.receiveShadow = true;
  shipGroup.add(fuselage);

  // Nose Cone (Sharp angular forward avionics bay)
  const noseGeom = new THREE.ConeGeometry(0.7, 2.2, 8);
  const nose = new THREE.Mesh(noseGeom, hullMat);
  nose.rotation.x = -Math.PI / 2;
  nose.position.z = -3.5;
  nose.castShadow = true;
  shipGroup.add(nose);

  // Cockpit Canopy / Sensor Dome
  const canopyGeom = new THREE.SphereGeometry(0.55, 16, 16);
  canopyGeom.scale(0.8, 0.6, 2.0);
  const canopy = new THREE.Mesh(canopyGeom, canopyMat);
  canopy.position.set(0, 0.65, -1.2);
  shipGroup.add(canopy);

  // Delta Wings
  const wingShape = new THREE.Shape();
  wingShape.moveTo(0, 0);
  wingShape.lineTo(3.2, -1.8);
  wingShape.lineTo(3.0, -2.6);
  wingShape.lineTo(0, -2.2);
  wingShape.closePath();

  const extrudeSettings = { depth: 0.08, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.03, bevelThickness: 0.03 };
  const wingGeom = new THREE.ExtrudeGeometry(wingShape, extrudeSettings);

  // Right Wing
  const rightWing = new THREE.Mesh(wingGeom, armorPlateMat);
  rightWing.rotation.x = Math.PI / 2;
  rightWing.position.set(0.6, -0.1, 0.5);
  rightWing.castShadow = true;
  shipGroup.add(rightWing);

  // Left Wing (Mirrored)
  const leftWing = new THREE.Mesh(wingGeom, armorPlateMat);
  leftWing.rotation.x = Math.PI / 2;
  leftWing.scale.x = -1;
  leftWing.position.set(-0.6, -0.1, 0.5);
  leftWing.castShadow = true;
  shipGroup.add(leftWing);

  // Wingtip Plasma Cannons / Sensor Pods
  [-3.3, 3.3].forEach(x => {
    const pod = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 1.4, 8), armorPlateMat);
    pod.rotation.x = Math.PI / 2;
    pod.position.set(x, -0.1, -1.3);
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.3, 8), glowAccentMat);
    tip.rotation.x = -Math.PI / 2;
    tip.position.set(x, -0.1, -2.15);
    shipGroup.add(pod, tip);
  });

  // Twin Vertical Stabilizers (Angled V-Tail)
  [-1, 1].forEach(side => {
    const finGeom = new THREE.BoxGeometry(0.08, 1.3, 1.2);
    const fin = new THREE.Mesh(finGeom, armorPlateMat);
    fin.position.set(side * 0.9, 0.7, 1.4);
    fin.rotation.z = side * -0.3;
    shipGroup.add(fin);
  });

  // Dual Rear Thruster Bells
  const engineNozzles = [];
  [-0.6, 0.6].forEach(x => {
    const nozzleGeom = new THREE.CylinderGeometry(0.4, 0.55, 0.9, 16);
    const nozzle = new THREE.Mesh(nozzleGeom, armorPlateMat);
    nozzle.rotation.x = Math.PI / 2;
    nozzle.position.set(x, 0, 2.8);
    shipGroup.add(nozzle);

    // Glowing Engine Interior Disc
    const glowDisc = new THREE.Mesh(new THREE.CircleGeometry(0.38, 16), thrusterGlowMat);
    glowDisc.position.set(x, 0, 3.26);
    shipGroup.add(glowDisc);
    engineNozzles.push(glowDisc);
  });

  // Dynamic Thrust Plume Mesh (scaled in animate loop)
  const plumeGeom = new THREE.ConeGeometry(0.7, 4.0, 16);
  const plumeMat = new THREE.MeshBasicMaterial({
    color: thrusterColor,
    transparent: true,
    opacity: 0.85
  });
  const plume = new THREE.Mesh(plumeGeom, plumeMat);
  plume.rotation.x = -Math.PI / 2;
  plume.position.set(0, 0, 4.8);
  plume.visible = false;
  shipGroup.add(plume);

  // Dynamic Point Light for Engine illumination
  const engineLight = new THREE.PointLight(thrusterColor, 0, 15);
  engineLight.position.set(0, 0, 3.5);
  shipGroup.add(engineLight);

  shipGroup.userData = {
    engineLight,
    plume,
    engineNozzles
  };

  return shipGroup;
}

// 2. High-Detail Mars Rover Model for Planetary Surface Exploration
export function createMarsRoverModel() {
  const roverGroup = new THREE.Group();

  const chassisMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    metalness: 0.6,
    roughness: 0.3
  });

  const goldMliMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.85,
    roughness: 0.3
  });

  const darkMetalMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    metalness: 0.9,
    roughness: 0.3
  });

  const wheelMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    metalness: 0.4,
    roughness: 0.8
  });

  const lensMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });

  // Main Chassis Box (Avionics & Warm Electronics Box)
  const chassisGeom = new THREE.BoxGeometry(1.6, 0.7, 2.2);
  const chassis = new THREE.Mesh(chassisGeom, chassisMat);
  chassis.position.y = 0.9;
  chassis.castShadow = true;
  roverGroup.add(chassis);

  // Gold MLI Foil Panels on flanks
  [-0.82, 0.82].forEach(x => {
    const foil = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.5), goldMliMat);
    foil.position.set(x, 0.9, 0);
    foil.rotation.y = x > 0 ? Math.PI / 2 : -Math.PI / 2;
    roverGroup.add(foil);
  });

  // Top Solar Deck / RTG generator
  const deck = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.08, 2.0), darkMetalMat);
  deck.position.set(0, 1.28, -0.1);
  roverGroup.add(deck);

  // Camera Mast (Remote Sensing Mast)
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.4), darkMetalMat);
  mast.position.set(0.5, 1.9, -0.7);
  roverGroup.add(mast);

  // Masthead Stereo Camera Head (SuperCam / Mastcam-Z)
  const mastHead = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.25, 0.3), chassisMat);
  mastHead.position.set(0.5, 2.6, -0.7);
  roverGroup.add(mastHead);

  [-0.1, 0.1].forEach(lx => {
    const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.1, 12), darkMetalMat);
    lens.rotation.x = Math.PI / 2;
    lens.position.set(0.5 + lx, 2.6, -0.85);
    const eye = new THREE.Mesh(new THREE.CircleGeometry(0.04, 12), lensMat);
    eye.position.set(0.5 + lx, 2.6, -0.91);
    roverGroup.add(lens, eye);
  });

  // Robotic Sample Arm (Front)
  const armGroup = new THREE.Group();
  armGroup.position.set(-0.4, 0.8, -1.1);

  const armJoint1 = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), darkMetalMat);
  const armSegment1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.8), darkMetalMat);
  armSegment1.rotation.x = -Math.PI / 4;
  armSegment1.position.set(0, -0.2, -0.3);

  const drillTurret = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.3, 12), goldMliMat);
  drillTurret.rotation.z = Math.PI / 2;
  drillTurret.position.set(0, -0.45, -0.6);

  armGroup.add(armJoint1, armSegment1, drillTurret);
  roverGroup.add(armGroup);

  // 6-Wheel Rocker-Bogie Suspension Wheels
  const wheelMeshes = [];
  const wheelPositions = [
    [-1.1, 0.4, -0.9], [1.1, 0.4, -0.9], // Front
    [-1.2, 0.4, 0.0],  [1.2, 0.4, 0.0],  // Middle
    [-1.1, 0.4, 0.9],  [1.1, 0.4, 0.9]   // Rear
  ];

  wheelPositions.forEach((pos, idx) => {
    const wheelGeom = new THREE.CylinderGeometry(0.38, 0.38, 0.32, 16);
    const wheel = new THREE.Mesh(wheelGeom, wheelMat);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(pos[0], pos[1], pos[2]);
    wheel.castShadow = true;
    roverGroup.add(wheel);
    wheelMeshes.push(wheel);

    // Suspension struts
    const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.6), darkMetalMat);
    strut.position.set(pos[0] * 0.8, pos[1] + 0.25, pos[2]);
    roverGroup.add(strut);
  });

  // Front Headlights
  [-0.6, 0.6].forEach(hx => {
    const light = new THREE.PointLight(0xfff7ed, 1.5, 12);
    light.position.set(hx, 1.0, -1.2);
    roverGroup.add(light);
  });

  roverGroup.userData = {
    wheelMeshes,
    armGroup
  };

  return roverGroup;
}

// 3. Procedural 3D Asteroid with Craters
export function createAsteroidMesh(radius = 3, detail = 1) {
  const geom = new THREE.DodecahedronGeometry(radius, detail);
  const posAttr = geom.attributes.position;

  // Perturb vertices for bumpy, natural asteroid shape
  for (let i = 0; i < posAttr.count; i++) {
    const vx = posAttr.getX(i);
    const vy = posAttr.getY(i);
    const vz = posAttr.getZ(i);

    const length = Math.sqrt(vx * vx + vy * vy + vz * vz);
    const noise = 1 + (Math.sin(vx * 1.5) * Math.cos(vy * 1.5) * Math.sin(vz * 1.5)) * 0.3;

    posAttr.setXYZ(i, (vx / length) * radius * noise, (vy / length) * radius * noise, (vz / length) * radius * noise);
  }
  geom.computeVertexNormals();

  const asteroidMat = new THREE.MeshStandardMaterial({
    color: 0x64748b,
    roughness: 0.95,
    metalness: 0.15,
    flatShading: true
  });

  const mesh = new THREE.Mesh(geom, asteroidMat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

// 4. Holographic Checkpoint Ring
export function createCheckpointRing(radius = 6, color = 0x38bdf8) {
  const ringGroup = new THREE.Group();

  // Torus Ring
  const torusGeom = new THREE.TorusGeometry(radius, 0.18, 16, 48);
  const ringMat = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.8
  });
  const ringMesh = new THREE.Mesh(torusGeom, ringMat);
  ringGroup.add(ringMesh);

  // Outer segmented chevron brackets
  const bracketGeom = new THREE.TorusGeometry(radius + 0.6, 0.08, 8, 24, Math.PI * 0.4);
  const bracketMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
  [0, Math.PI * 0.5, Math.PI, Math.PI * 1.5].forEach(ang => {
    const bracket = new THREE.Mesh(bracketGeom, bracketMat);
    bracket.rotation.z = ang;
    ringGroup.add(bracket);
  });

  // Translucent Energy Field inside ring
  const discGeom = new THREE.CircleGeometry(radius - 0.2, 32);
  const discMat = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.15,
    side: THREE.DoubleSide
  });
  const disc = new THREE.Mesh(discGeom, discMat);
  ringGroup.add(disc);

  // Point light for illumination
  const light = new THREE.PointLight(color, 2.0, radius * 3.5);
  ringGroup.add(light);

  ringGroup.userData = { radius, passed: false };
  return ringGroup;
}

// 5. Scientific Rock Sample / Anomaly Marker
export function createSampleTargetMesh(type = 'sediment') {
  const group = new THREE.Group();

  let color = 0x38bdf8;
  if (type === 'basalt') color = 0xf59e0b;
  if (type === 'ice') color = 0x67e8f9;
  if (type === 'radiation') color = 0xef4444;

  // Crystal / rock cluster
  const rockGeom = new THREE.DodecahedronGeometry(0.5, 0);
  const rockMat = new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.3,
    roughness: 0.3,
    metalness: 0.7
  });
  const rock = new THREE.Mesh(rockGeom, rockMat);
  rock.position.y = 0.35;
  group.add(rock);

  // Holographic Beacon Beam (Vertical pulse line)
  const beaconGeom = new THREE.CylinderGeometry(0.04, 0.04, 8, 8);
  const beaconMat = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.55
  });
  const beacon = new THREE.Mesh(beaconGeom, beaconMat);
  beacon.position.y = 4;
  group.add(beacon);

  // Ground scan ring
  const ringGeom = new THREE.RingGeometry(0.8, 0.9, 24);
  const ringMat = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide });
  const ring = new THREE.Mesh(ringGeom, ringMat);
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.05;
  group.add(ring);

  group.userData = { type, collected: false, color };
  return group;
}


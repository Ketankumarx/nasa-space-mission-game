// Procedural 3D Spacecraft Modular Builder for Project Orbital
import * as THREE from 'three';
import { createSolarPanelTexture, createGoldFoilTexture } from './textureGenerator';

export function buildSpacecraftGroup(selectedComponentIds, options = {}) {
  const group = new THREE.Group();
  const wireframe = options.wireframe || false;

  const goldTexture = createGoldFoilTexture();
  const solarTexture = createSolarPanelTexture();

  // Materials
  const busMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    map: goldTexture,
    metalness: 0.85,
    roughness: 0.3,
    wireframe
  });

  const darkMetalMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    metalness: 0.9,
    roughness: 0.2,
    wireframe
  });

  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    metalness: 0.95,
    roughness: 0.1,
    wireframe
  });

  const solarMat = new THREE.MeshStandardMaterial({
    color: 0x1d4ed8,
    map: solarTexture,
    metalness: 0.6,
    roughness: 0.2,
    wireframe
  });

  const glowBlueMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    wireframe
  });

  // 1. Central Bus Chassis (Hexagonal Prism)
  const busGeometry = new THREE.CylinderGeometry(1.2, 1.2, 2.2, 6);
  const busMesh = new THREE.Mesh(busGeometry, busMat);
  busMesh.castShadow = true;
  busMesh.receiveShadow = true;
  group.add(busMesh);

  // Top and Bottom equipment decks
  const deckGeom = new THREE.CylinderGeometry(1.25, 1.25, 0.1, 6);
  const topDeck = new THREE.Mesh(deckGeom, darkMetalMat);
  topDeck.position.y = 1.15;
  group.add(topDeck);

  const bottomDeck = new THREE.Mesh(deckGeom, darkMetalMat);
  bottomDeck.position.y = -1.15;
  group.add(bottomDeck);

  // Reaction Wheels / Avionics Ring inside
  const avionicsRing = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.08, 8, 24), chromeMat);
  avionicsRing.rotation.x = Math.PI / 2;
  group.add(avionicsRing);

  // 2. Propulsion System (Bottom)
  const hasChemical = selectedComponentIds.includes('prop_chemical');
  const hasElectric = selectedComponentIds.includes('prop_electric');

  if (hasChemical) {
    // Chemical rocket engine nozzle
    const nozzleGeom = new THREE.ConeGeometry(0.65, 1.1, 16, 1, true);
    const nozzleMesh = new THREE.Mesh(nozzleGeom, darkMetalMat);
    nozzleMesh.position.y = -1.7;
    group.add(nozzleMesh);

    // Propellant tanks on sides
    const tankGeom = new THREE.SphereGeometry(0.55, 16, 16);
    const tankMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.3 });
    const tank1 = new THREE.Mesh(tankGeom, tankMat);
    tank1.position.set(0.9, 0, 0);
    const tank2 = new THREE.Mesh(tankGeom, tankMat);
    tank2.position.set(-0.9, 0, 0);
    group.add(tank1, tank2);
  } else if (hasElectric) {
    // Dual Ion Engine Nozzles with blue glow
    for (let i = -1; i <= 1; i += 2) {
      const thrusterGeom = new THREE.CylinderGeometry(0.28, 0.35, 0.7, 16);
      const thruster = new THREE.Mesh(thrusterGeom, darkMetalMat);
      thruster.position.set(i * 0.5, -1.5, 0);
      group.add(thruster);

      // Glowing Ion plasma emission disc
      const glowDisc = new THREE.Mesh(new THREE.CircleGeometry(0.25, 16), glowBlueMat);
      glowDisc.rotation.x = Math.PI / 2;
      glowDisc.position.set(i * 0.5, -1.86, 0);
      group.add(glowDisc);
    }
  }

  // 3. Power Generation (Solar Arrays)
  const hasStdSolar = selectedComponentIds.includes('pwr_standard_solar');
  const hasAdvSolar = selectedComponentIds.includes('pwr_advanced_solar');

  if (hasAdvSolar) {
    // Circular GaAs Ultra-flex arrays
    [-1, 1].forEach(side => {
      const armGeom = new THREE.CylinderGeometry(0.06, 0.06, 1.2);
      const arm = new THREE.Mesh(armGeom, darkMetalMat);
      arm.rotation.z = (Math.PI / 2) * side;
      arm.position.set(side * 1.8, 0, 0);
      group.add(arm);

      // Circular fan array
      const diskGeom = new THREE.CylinderGeometry(1.6, 1.6, 0.05, 32);
      const disk = new THREE.Mesh(diskGeom, solarMat);
      disk.rotation.x = Math.PI / 2;
      disk.position.set(side * 3.8, 0, 0);
      group.add(disk);
    });
  } else if (hasStdSolar) {
    // Rectangular articulated solar wings
    [-1, 1].forEach(side => {
      const wingArm = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.08, 0.08), darkMetalMat);
      wingArm.position.set(side * 1.6, 0, 0);
      group.add(wingArm);

      // 2 panel segments per wing
      const panel1 = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.06, 1.2), solarMat);
      panel1.position.set(side * 3.1, 0, 0);
      const panel2 = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.06, 1.2), solarMat);
      panel2.position.set(side * 5.2, 0, 0);
      group.add(panel1, panel2);
    });
  }

  // 4. Power Storage (Batteries)
  const hasStdBattery = selectedComponentIds.includes('stor_battery_standard');
  const hasAdvBattery = selectedComponentIds.includes('stor_battery_advanced');
  if (hasStdBattery || hasAdvBattery) {
    const battMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.8, roughness: 0.2 });
    const battBox = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.5, 0.4), battMat);
    battBox.position.set(0, 0, 1.2);
    group.add(battBox);
  }

  // 5. Communication Antenna (Top Deck)
  const hasHighGain = selectedComponentIds.includes('comm_highgain');
  const hasStdComm = selectedComponentIds.includes('comm_standard');

  if (hasHighGain) {
    // Parabolic High-Gain Dish Antenna
    const mastGeom = new THREE.CylinderGeometry(0.08, 0.08, 0.8);
    const mast = new THREE.Mesh(mastGeom, chromeMat);
    mast.position.set(0, 1.6, 0);
    group.add(mast);

    // Parabolic Dish (Hemisphere)
    const dishGeom = new THREE.SphereGeometry(1.4, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.4);
    const dishMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      metalness: 0.3,
      roughness: 0.4,
      side: THREE.DoubleSide
    });
    const dish = new THREE.Mesh(dishGeom, dishMat);
    dish.position.set(0, 2.0, 0);
    dish.rotation.x = -Math.PI * 0.75;
    group.add(dish);

    // Feed horn support tripod
    const feed = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.4, 8), darkMetalMat);
    feed.position.set(0, 2.7, 0.7);
    group.add(feed);
  } else if (hasStdComm) {
    // Medium-Gain Horn Antenna
    const hornGeom = new THREE.ConeGeometry(0.3, 0.7, 12, 1, true);
    const horn = new THREE.Mesh(hornGeom, chromeMat);
    horn.position.set(0, 1.6, 0);
    horn.rotation.x = Math.PI;
    group.add(horn);
  }

  // 6. Scientific Instruments
  // Camera
  if (selectedComponentIds.includes('inst_camera')) {
    const camTube = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.9, 16), darkMetalMat);
    camTube.rotation.x = Math.PI / 2;
    camTube.position.set(-0.6, -0.4, 1.4);
    // Lens
    const lens = new THREE.Mesh(new THREE.CircleGeometry(0.18, 16), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
    lens.position.set(-0.6, -0.4, 1.86);
    group.add(camTube, lens);
  }

  // Spectrometer
  if (selectedComponentIds.includes('inst_spectrometer')) {
    const specBox = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.6), chromeMat);
    specBox.position.set(0.6, -0.4, 1.3);
    const windowMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.2), new THREE.MeshBasicMaterial({ color: 0xa855f7 }));
    windowMesh.position.set(0.6, -0.4, 1.61);
    group.add(specBox, windowMesh);
  }

  // Radar
  if (selectedComponentIds.includes('inst_radar')) {
    const radarBoom = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.6), chromeMat);
    radarBoom.rotation.z = Math.PI / 2;
    radarBoom.position.set(0, 1.25, -1.2);
    const radarPlate = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.35, 0.05), darkMetalMat);
    radarPlate.position.set(0, 1.25, -1.25);
    group.add(radarBoom, radarPlate);
  }

  // Radiation Detector
  if (selectedComponentIds.includes('inst_radiation')) {
    const radDome = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.5, roughness: 0.3 }));
    radDome.position.set(0.6, 1.2, 0.6);
    group.add(radDome);
  }

  // 7. Navigation & Guidance
  if (selectedComponentIds.includes('nav_star_tracker')) {
    [-0.5, 0.5].forEach(x => {
      const trackerBaffle = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.13, 0.35, 12), darkMetalMat);
      trackerBaffle.rotation.x = -Math.PI / 4;
      trackerBaffle.position.set(x, 1.2, -0.6);
      group.add(trackerBaffle);
    });
  }

  if (selectedComponentIds.includes('nav_computer')) {
    const compChassis = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.7, 0.3), darkMetalMat);
    compChassis.position.set(0, 0.3, -1.25);
    group.add(compChassis);
  }

  // 8. Protection & Shielding
  if (selectedComponentIds.includes('prot_radiation')) {
    const shieldPlate1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.8, 1.4), darkMetalMat);
    shieldPlate1.position.set(1.3, 0, 0);
    const shieldPlate2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.8, 1.4), darkMetalMat);
    shieldPlate2.position.set(-1.3, 0, 0);
    group.add(shieldPlate1, shieldPlate2);
  }

  return group;
}


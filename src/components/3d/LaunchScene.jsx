// 3D Cinematic Launch Scene with Realistic Aerospace Heavy-Lift Rocket (Project Orbital)
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { sound } from '../../utils/soundEngine';
import { buildRealisticRocket } from '../../utils/realisticRocketBuilder';
import { createCosmicEnvironment } from '../../utils/spaceEnvironment';
import { FastForward, Gauge, Sparkles, Radio, ShieldCheck, Flame } from 'lucide-react';

export default function LaunchScene({
  launchVehicle,
  onLaunchComplete,
  onTelemetryUpdate
}) {
  const mountRef = useRef(null);
  const animFrameRef = useRef(null);

  const [countdown, setCountdown] = useState(10);
  const [phase, setPhase] = useState('PRE_LAUNCH'); // PRE_LAUNCH, IGNITION, LIFTOFF, ASCENT, STAGING, SPACE_FLIGHT
  const [phaseTitle, setPhaseTitle] = useState('PHASE 1 // PRE-LAUNCH VERIFICATION');
  const [telemetry, setTelemetry] = useState({
    altitudeKm: 0,
    velocityKmH: 0,
    velocityMs: 0,
    fuelPct: 100,
    downrangeKm: 0,
    status: 'T-10 SECONDS // ALL SYSTEMS NOMINAL // CRYOGENIC CHILLDOWN'
  });

  const stateRef = useRef({
    phase: 'PRE_LAUNCH',
    countdown: 10,
    timeSinceIgnition: 0,
    flightTime: 0,
    rocketY: 0,
    rocketVelocity: 0,
    altitudeKm: 0,
    fuelPct: 100,
    staged: false,
    fairingJettisoned: false,
    cameraAngle: 0
  });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // =========================================================================
    // 1. Scene, Camera, Renderer Setup
    // =========================================================================
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c1e3d);
    scene.fog = new THREE.FogExp2(0x0c1e3d, 0.004);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      4000
    );
    camera.position.set(32, 22, 58);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // =========================================================================
    // 2. Cosmic Space Environment & Curved Earth (For Ascent & Spaceflight)
    // =========================================================================
    const cosmicEnv = createCosmicEnvironment(scene, { type: 'carina', radius: 2400, starCount: 3000 });
    cosmicEnv.visible = false; // Becomes visible as we exit Earth atmosphere

    // Curved Earth Horizon Sphere (revealed during high-altitude ascent)
    const earthRadius = 600;
    const earthGeom = new THREE.SphereGeometry(earthRadius, 64, 64);
    const earthMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a,
      roughness: 0.8,
      metalness: 0.1
    });
    const curvedEarth = new THREE.Mesh(earthGeom, earthMat);
    curvedEarth.position.set(0, -earthRadius - 10, -100);
    scene.add(curvedEarth);

    // Glowing Atmospheric Rim
    const atmoRimGeom = new THREE.SphereGeometry(earthRadius + 6, 64, 64);
    const atmoRimMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.25,
      side: THREE.BackSide
    });
    const atmoRim = new THREE.Mesh(atmoRimGeom, atmoRimMat);
    atmoRim.position.copy(curvedEarth.position);
    scene.add(atmoRim);

    // =========================================================================
    // 3. Launchpad 39A Complex: Ground, Flame Trench, Gantry Umbilical Tower
    // =========================================================================
    // Reinforced Concrete Ground
    const groundGeom = new THREE.PlaneGeometry(800, 800);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9, metalness: 0.15 });
    const ground = new THREE.Mesh(groundGeom, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Elevated Launch Mount Plinth with Flame Deflector Trench
    const padGeom = new THREE.CylinderGeometry(20, 24, 4.5, 36);
    const padMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.85, metalness: 0.25 });
    const pad = new THREE.Mesh(padGeom, padMat);
    pad.position.y = 2.25;
    pad.receiveShadow = true;
    scene.add(pad);

    // Heavy Gantry Umbilical Launch Tower (Steel Truss)
    const towerGroup = new THREE.Group();
    const towerTrussGeom = new THREE.BoxGeometry(5.5, 68, 5.5);
    const towerTrussMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.7, roughness: 0.35 });
    const towerTruss = new THREE.Mesh(towerTrussGeom, towerTrussMat);
    towerTruss.position.set(-13, 34, 0);
    towerTruss.castShadow = true;
    towerGroup.add(towerTruss);

    // Retractable Umbilical Swing Arms (Retract at T-0)
    const swingArms = [];
    [10, 24, 38, 52].forEach(y => {
      const armGroup = new THREE.Group();
      armGroup.position.set(-10.5, y, 0);

      const armMesh = new THREE.Mesh(
        new THREE.BoxGeometry(9.5, 1.4, 1.4),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.3 })
      );
      armMesh.position.x = 4.75;
      armGroup.add(armMesh);

      // Cryogenic disconnect coupler
      const coupler = new THREE.Mesh(
        new THREE.CylinderGeometry(0.4, 0.4, 1.6, 16),
        new THREE.MeshStandardMaterial({ color: 0x0284c7 })
      );
      coupler.rotation.z = Math.PI / 2;
      coupler.position.set(9.5, 0, 0);
      armGroup.add(coupler);

      towerGroup.add(armGroup);
      swingArms.push(armGroup);
    });

    scene.add(towerGroup);

    // 4 High-Intensity Pad Floodlight Towers
    const padLights = [];
    [
      { x: 35, z: 35 },
      { x: -35, z: 35 },
      { x: 35, z: -35 },
      { x: -35, z: -35 }
    ].forEach((pos, idx) => {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 25), new THREE.MeshStandardMaterial({ color: 0x64748b }));
      pole.position.set(pos.x, 12.5, pos.z);
      scene.add(pole);

      const lightHead = new THREE.Mesh(new THREE.BoxGeometry(2, 1.5, 1.5), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
      lightHead.position.set(pos.x, 25, pos.z);
      scene.add(lightHead);

      const spot = new THREE.SpotLight(0xfff7ed, 4.0, 120, Math.PI / 5, 0.4);
      spot.position.set(pos.x, 25, pos.z);
      spot.target.position.set(0, 20, 0);
      scene.add(spot);
      scene.add(spot.target);
      padLights.push(spot);
    });

    // =========================================================================
    // 4. Ultra-Realistic Heavy-Lift 3D Rocket Model
    // =========================================================================
    const rocket = buildRealisticRocket();
    rocket.position.set(0, 4.5, 0);
    scene.add(rocket);

    const {
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
    } = rocket.userData;

    // =========================================================================
    // 5. Particle Systems: LOX Venting, Pad Deluge Steam, Fire Sparks, Ascent Smoke
    // =========================================================================

    // A. Cryogenic LOX Venting Wisps (Pre-launch boil-off vapor)
    const ventCount = 120;
    const ventGeom = new THREE.BufferGeometry();
    const ventPositions = new Float32Array(ventCount * 3);
    const ventData = [];

    for (let i = 0; i < ventCount; i++) {
      ventPositions[i * 3] = 0;
      ventPositions[i * 3 + 1] = -100;
      ventPositions[i * 3 + 2] = 0;
      ventData.push({
        x: (Math.random() > 0.5 ? 2.25 : -2.25),
        y: 38 + (Math.random() - 0.5) * 4,
        z: (Math.random() - 0.5) * 1.5,
        vx: (Math.random() - 0.5) * 1.5 + (Math.random() > 0.5 ? 1.2 : -1.2),
        vy: -0.8 - Math.random() * 1.2,
        vz: (Math.random() - 0.5) * 1.5,
        life: Math.random() * 2.0,
        maxLife: 2.0 + Math.random() * 1.5
      });
    }
    ventGeom.setAttribute('position', new THREE.BufferAttribute(ventPositions, 3));
    const ventMat = new THREE.PointsMaterial({
      size: 3.5,
      color: 0xffffff,
      transparent: true,
      opacity: 0.45,
      depthWrite: false
    });
    const ventParticles = new THREE.Points(ventGeom, ventMat);
    scene.add(ventParticles);

    // B. Pad Deluge Steam & Ground Shockwave Smoke (Radial expansion along ground)
    const delugeCount = 650;
    const delugeGeom = new THREE.BufferGeometry();
    const delugePositions = new Float32Array(delugeCount * 3);
    const delugeData = [];

    for (let i = 0; i < delugeCount; i++) {
      delugePositions[i * 3] = 0;
      delugePositions[i * 3 + 1] = -500;
      delugePositions[i * 3 + 2] = 0;

      const ang = Math.random() * Math.PI * 2;
      const speed = 12 + Math.random() * 22;
      delugeData.push({
        vx: Math.cos(ang) * speed,
        vy: 1.5 + Math.random() * 5,
        vz: Math.sin(ang) * speed,
        life: 0,
        maxLife: 2.5 + Math.random() * 3.0,
        active: false
      });
    }
    delugeGeom.setAttribute('position', new THREE.BufferAttribute(delugePositions, 3));
    const delugeMat = new THREE.PointsMaterial({
      size: 9.0,
      color: 0xcfd8dc,
      transparent: true,
      opacity: 0.42,
      depthWrite: false
    });
    const delugeParticles = new THREE.Points(delugeGeom, delugeMat);
    scene.add(delugeParticles);

    // C. Vertical Fire Sparks / Ejected Propellant Droplets
    const sparkCount = 180;
    const sparkGeom = new THREE.BufferGeometry();
    const sparkPositions = new Float32Array(sparkCount * 3);
    const sparkData = [];

    for (let i = 0; i < sparkCount; i++) {
      sparkPositions[i * 3] = 0;
      sparkPositions[i * 3 + 1] = -500;
      sparkPositions[i * 3 + 2] = 0;
      sparkData.push({
        vx: (Math.random() - 0.5) * 4,
        vy: -25 - Math.random() * 35,
        vz: (Math.random() - 0.5) * 4,
        life: 0,
        maxLife: 0.6 + Math.random() * 0.8
      });
    }
    sparkGeom.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3));
    const sparkMat = new THREE.PointsMaterial({
      size: 2.2,
      color: 0xfef08a,
      transparent: true,
      opacity: 0.85,
      depthWrite: false
    });
    const sparkParticles = new THREE.Points(sparkGeom, sparkMat);
    scene.add(sparkParticles);

    // =========================================================================
    // 6. Lighting & Sun
    // =========================================================================
    const ambientLight = new THREE.AmbientLight(0x38bdf8, 0.5);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffbeb, 3.8);
    sunLight.position.set(70, 110, 60);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 400;
    sunLight.shadow.camera.left = -60;
    sunLight.shadow.camera.right = 60;
    sunLight.shadow.camera.top = 80;
    sunLight.shadow.camera.bottom = -20;
    scene.add(sunLight);

    // =========================================================================
    // 7. Countdown Logic (T-10 to T-0) with Progressive Ignition at T-3
    // =========================================================================
    let countdownVal = 10;
    const countdownTimer = setInterval(() => {
      countdownVal -= 1;
      setCountdown(countdownVal);
      stateRef.current.countdown = countdownVal;

      if (countdownVal > 3) {
        sound.playBeep(false);
      } else if (countdownVal === 3) {
        // T-3 SECONDS: PHASE 2 — ENGINE IGNITION INITIATED
        sound.playBeep(true);
        sound.startRocketRumble();
        setPhase('IGNITION');
        setPhaseTitle('PHASE 2 // PROGRESSIVE ENGINE IGNITION');
        stateRef.current.phase = 'IGNITION';
      } else if (countdownVal === 0) {
        // T-0 SECONDS: PHASE 3 — LIFTOFF!
        sound.playBeep(true);
        setPhase('LIFTOFF');
        setPhaseTitle('PHASE 3 // LIFTOFF & TOWER CLEARANCE');
        stateRef.current.phase = 'LIFTOFF';

        // Retract Umbilical Swing Arms
        swingArms.forEach((arm, idx) => {
          arm.rotation.y = -Math.PI / 3;
        });
      }
    }, 1000);

    // =========================================================================
    // 8. Flight Dynamics & Cinematic Camera Orchestration Loop
    // =========================================================================
    const clock = new THREE.Clock();
    let simTime = 0;

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const st = stateRef.current;
      simTime += delta;

      // -----------------------------------------------------------------------
      // A. Pre-Launch Cryogenic LOX Venting Animation (Active when rocket on pad)
      // -----------------------------------------------------------------------
      if (st.rocketY < 10) {
        const vPos = ventGeom.attributes.position;
        for (let i = 0; i < ventCount; i++) {
          const vd = ventData[i];
          vd.life += delta;
          if (vd.life > vd.maxLife) {
            vd.life = 0;
            vPos.array[i * 3] = rocket.position.x + vd.x;
            vPos.array[i * 3 + 1] = rocket.position.y + vd.y;
            vPos.array[i * 3 + 2] = rocket.position.z + vd.z;
          } else {
            vPos.array[i * 3] += vd.vx * delta;
            vPos.array[i * 3 + 1] += vd.vy * delta;
            vPos.array[i * 3 + 2] += vd.vz * delta;
          }
        }
        ventGeom.attributes.position.needsUpdate = true;
      } else {
        ventParticles.visible = false;
      }

      // -----------------------------------------------------------------------
      // B. Progressive Engine Ignition & Flame Dynamics
      // -----------------------------------------------------------------------
      if (st.phase === 'IGNITION') {
        st.timeSinceIgnition += delta;

        // Progressive Ignition: Center engine first, then 4 cardinal, then 4 corners
        const centerIgnited = st.timeSinceIgnition > 0.2;
        const innerRingIgnited = st.timeSinceIgnition > 1.0;
        const fullIgnited = st.timeSinceIgnition > 1.8;

        if (centerIgnited && enginePlumes[0]) {
          enginePlumes[0].material.opacity = Math.min(0.9, st.timeSinceIgnition * 0.8);
        }
        if (innerRingIgnited) {
          for (let i = 1; i <= 4; i++) {
            if (enginePlumes[i]) enginePlumes[i].material.opacity = 0.85;
          }
        }
        if (fullIgnited) {
          for (let i = 5; i < enginePlumes.length; i++) {
            if (enginePlumes[i]) enginePlumes[i].material.opacity = 0.85;
          }
        }

        // Main Supersonic Core & Outer Plume expansion
        innerCore.material.opacity = Math.min(0.98, st.timeSinceIgnition * 0.5);
        outerPlume.material.opacity = Math.min(0.9, st.timeSinceIgnition * 0.45);
        padFlameLight.intensity = Math.min(35, st.timeSinceIgnition * 18);
        coreFlashLight.intensity = Math.min(25, st.timeSinceIgnition * 14);

        machDiamonds.forEach((d, idx) => {
          d.material.opacity = Math.min(0.8, st.timeSinceIgnition * 0.35);
        });

        // Deluge steam develops and billows across the concrete pad
        const dPos = delugeGeom.attributes.position;
        for (let i = 0; i < delugeCount; i++) {
          const dd = delugeData[i];
          dd.life += delta;
          if (dd.life > dd.maxLife || !dd.active) {
            dd.active = true;
            dd.life = 0;
            dPos.array[i * 3] = (Math.random() - 0.5) * 5;
            dPos.array[i * 3 + 1] = 2.0;
            dPos.array[i * 3 + 2] = (Math.random() - 0.5) * 5;
          } else {
            dPos.array[i * 3] += dd.vx * delta;
            dPos.array[i * 3 + 1] += dd.vy * delta;
            dPos.array[i * 3 + 2] += dd.vz * delta;
          }
        }
        delugeGeom.attributes.position.needsUpdate = true;

        // Pad vibration camera shake
        camera.position.x += (Math.random() - 0.5) * 0.35;
        camera.position.y += (Math.random() - 0.5) * 0.35;
      }

      // -----------------------------------------------------------------------
      // C. Liftoff & Atmospheric Ascent Progression (T+0 onward)
      // -----------------------------------------------------------------------
      if (st.phase === 'LIFTOFF' || st.phase === 'ASCENT' || st.phase === 'STAGING' || st.phase === 'SPACE_FLIGHT') {
        st.flightTime += delta;

        // Physics Acceleration curve
        // First 2 seconds: gentle clearance of launch tower (a = 6 m/s^2)
        // Then rapid acceleration up to Max-Q and orbital speeds (a = 18+ m/s^2)
        let accel = 6.0;
        if (st.flightTime > 2.0) {
          accel = 12.0 + (st.flightTime - 2.0) * 14.0;
        }

        st.rocketVelocity += accel * delta;
        st.rocketY += st.rocketVelocity * delta;
        rocket.position.y = 4.5 + st.rocketY;

        // Telemetry conversion
        st.altitudeKm = st.rocketY * 0.045; // Real-scale altitude
        const velocityMs = Math.round(st.rocketVelocity * 16.5);
        const velocityKmH = Math.round(velocityMs * 3.6);
        st.fuelPct = Math.max(0, Math.round(100 - st.flightTime * 4.2));

        // Plume Flutter & High-Frequency Vertex Animation
        const flutter = 1.0 + Math.sin(simTime * 45) * 0.08 + Math.cos(simTime * 35) * 0.06;
        innerCore.scale.set(flutter, 1.0 + Math.sin(simTime * 30) * 0.12, flutter);
        outerPlume.scale.set(flutter * 1.05, 1.0 + Math.cos(simTime * 25) * 0.1, flutter * 1.05);

        // Mach diamonds oscillate dynamically
        machDiamonds.forEach((d, idx) => {
          const osc = 1 + Math.sin(simTime * 30 + idx) * 0.15;
          d.scale.set(osc, osc, osc);
        });

        // Atmospheric Ascent Phase Trigger
        if (st.altitudeKm > 8 && st.phase === 'LIFTOFF') {
          setPhase('ASCENT');
          setPhaseTitle('PHASE 4 // SUPERSONIC ATMOSPHERIC ASCENT');
          st.phase = 'ASCENT';
        }

        // Transonic Condensation Shock Collar (Flashes around nose cone at Mach 1, ~12 km)
        if (st.altitudeKm > 10 && st.altitudeKm < 18) {
          shockCone.material.opacity = 0.5 + Math.sin(simTime * 40) * 0.35;
        } else {
          shockCone.material.opacity = 0;
        }

        // Downrange Gravity Turn (tilt 45° into orbital trajectory)
        if (st.altitudeKm > 14) {
          const tiltAngle = Math.min(Math.PI / 4, (st.altitudeKm - 14) * 0.015);
          rocket.rotation.z = -tiltAngle;
          rocket.position.x += st.rocketVelocity * 0.28 * delta;

          // Steer titanium grid fins to counteract aerodynamic torque
          gridFins.forEach((fin, idx) => {
            fin.rotation.z = Math.sin(simTime * 6 + idx) * 0.22;
          });
        }

        // Atmospheric to Deep Space Sky Transition
        const atmoFactor = Math.min(1.0, st.altitudeKm / 65);
        const skyColor = new THREE.Color(0x0c1e3d).lerp(new THREE.Color(0x02040a), atmoFactor);
        scene.background = skyColor;
        scene.fog.density = 0.004 * (1 - atmoFactor);

        if (atmoFactor > 0.18) {
          cosmicEnv.visible = true;
        }

        // Stage 1 Separation (MECO at ~55 km)
        if (st.altitudeKm > 55 && !st.staged) {
          st.staged = true;
          setPhase('STAGING');
          setPhaseTitle('STAGE 1 SEPARATION // VACUUM ENGINE START');
          st.phase = 'STAGING';
          sound.playToggle(true);

          // Shut off Stage 1 plumes
          innerCore.material.opacity = 0;
          outerPlume.material.opacity = 0;
          machDiamonds.forEach(d => (d.material.opacity = 0));
          enginePlumes.forEach(p => (p.material.opacity = 0));

          // Ignite Stage 2 Vacuum Engine
          vacPlume.material.opacity = 0.95;
          coreFlashLight.intensity = 35;
          coreFlashLight.color.setHex(0x60a5fa);
        }

        // Separate Booster downwards
        if (st.staged) {
          boosterGroup.position.y -= 18 * delta;
          boosterGroup.position.x -= 4 * delta;
          boosterGroup.rotation.z += 0.08 * delta;
        }

        // Fairing Jettison at ~85 km (halves split & reveal payload)
        if (st.altitudeKm > 85 && !st.fairingJettisoned) {
          st.fairingJettisoned = true;
          sound.playClick();
        }

        if (st.fairingJettisoned) {
          fairingPortGroup.position.x -= 14 * delta;
          fairingPortGroup.rotation.z += 0.4 * delta;
          fairingStarboardGroup.position.x += 14 * delta;
          fairingStarboardGroup.rotation.z -= 0.4 * delta;
        }

        // Space Flight & Orbital Insertion Achieved (>135 km)
        if (st.altitudeKm >= 140 && st.phase !== 'SPACE_FLIGHT') {
          setPhase('SPACE_FLIGHT');
          setPhaseTitle('PHASE 5 // ORBITAL INSERTION ACHIEVED');
          st.phase = 'SPACE_FLIGHT';
          sound.stopRocketRumble();
          sound.playFanfare();

          // Vacuum Engine Cutoff (SECO)
          vacPlume.material.opacity = 0;
          coreFlashLight.intensity = 0;

          if (onLaunchComplete) {
            setTimeout(onLaunchComplete, 2800);
          }
        }

        // Update Real-Time Telemetry
        let statusDesc = 'MAX-Q TRANSONIC PRESSURE // FLIGHT TRAJECTORY NOMINAL';
        if (st.phase === 'LIFTOFF') statusDesc = 'LIFTOFF! TOWER CLEARED // ALL 9 ENGINES OPERATING AT 100% THRUST';
        if (st.phase === 'STAGING') statusDesc = 'BOOSTER SEPARATION VERIFIED // VACUUM ENGINE NOMINAL';
        if (st.fairingJettisoned && st.altitudeKm < 140) statusDesc = 'PAYLOAD FAIRINGS JETTISONED // SATELLITE SOLAR EXPOSURE';
        if (st.phase === 'SPACE_FLIGHT') statusDesc = 'ORBIT INSERTION SUCCESSFUL // 7.8 KM/S // PERIGEE 185 KM';

        const telem = {
          altitudeKm: Math.round(st.altitudeKm),
          velocityKmH,
          velocityMs,
          fuelPct: st.fuelPct,
          downrangeKm: Math.round(st.altitudeKm * 1.6),
          status: statusDesc
        };
        setTelemetry(telem);
        if (onTelemetryUpdate) onTelemetryUpdate(telem);
      }

      // -----------------------------------------------------------------------
      // D. Cinematic Camera Director: 5 Distinct Orchestrated Camera Shots
      // -----------------------------------------------------------------------
      if (st.phase === 'PRE_LAUNCH') {
        // Shot 1: Smooth Slow Orbiting Dolly around illuminated launch pad
        st.cameraAngle += delta * 0.12;
        const camDist = 65;
        camera.position.x = Math.cos(st.cameraAngle) * camDist;
        camera.position.z = Math.sin(st.cameraAngle) * camDist;
        camera.position.y = 24 + Math.sin(simTime * 0.5) * 3;
        camera.lookAt(0, 26, 0);
      } else if (st.phase === 'IGNITION') {
        // Shot 2: Dramatic Low-Angle Close-Up looking up at the glowing octaweb engine bells
        camera.position.set(0, 2.2, 14);
        camera.lookAt(0, 6.0, 0);
      } else if (st.phase === 'LIFTOFF') {
        // Shot 3: Ground-Level Tower Cam panning upward as rocket rises
        camera.position.set(-18, 6.0, 38);
        camera.lookAt(rocket.position.x, rocket.position.y + 15, rocket.position.z);
      } else if (st.phase === 'ASCENT' || st.phase === 'STAGING') {
        // Shot 4: High-Speed Chase Camera tracking alongside the accelerating rocket
        const targetCamY = rocket.position.y + 8;
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCamY, 0.08);
        camera.position.x = rocket.position.x + 36;
        camera.position.z = Math.min(260, 48 + st.rocketY * 0.18);
        camera.lookAt(rocket.position.x, rocket.position.y + 18, rocket.position.z);
      } else if (st.phase === 'SPACE_FLIGHT') {
        // Shot 5: Breathtaking Third-Person Orbital Sweep above curved Earth and payload
        st.cameraAngle += delta * 0.25;
        const orbitRadius = 28;
        camera.position.x = rocket.position.x + Math.cos(st.cameraAngle) * orbitRadius;
        camera.position.z = rocket.position.z + Math.sin(st.cameraAngle) * orbitRadius;
        camera.position.y = rocket.position.y + 12;
        camera.lookAt(rocket.position.x, rocket.position.y + 14, rocket.position.z);
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(countdownTimer);
      cancelAnimationFrame(animFrameRef.current);
      sound.stopRocketRumble();
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Skip / Fast-Forward Button
  const handleSkip = () => {
    sound.stopRocketRumble();
    sound.playFanfare();
    setPhase('SPACE_FLIGHT');
    setPhaseTitle('PHASE 5 // ORBITAL INSERTION ACHIEVED');
    stateRef.current.phase = 'SPACE_FLIGHT';

    const finalTelem = {
      altitudeKm: 185,
      velocityKmH: 28080,
      velocityMs: 7800,
      fuelPct: 62,
      downrangeKm: 460,
      status: 'ORBITAL INSERTION ACHIEVED // VELOCITY 7.8 KM/S // PERIGEE 185 KM'
    };
    setTelemetry(finalTelem);
    if (onLaunchComplete) onLaunchComplete();
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-space-950 font-sans select-none">
      <div ref={mountRef} className="w-full h-full absolute inset-0" />

      {/* Countdown Hero Display (T-10 to T-0) */}
      {countdown > 0 && phase === 'PRE_LAUNCH' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
          <div className="text-sky-400 font-mono text-xs tracking-widest uppercase mb-1 animate-pulse flex items-center gap-2">
            <Radio className="w-4 h-4 text-sky-400 animate-spin" />
            <span>KENNEDY SPACE CENTER // LAUNCH COMPLEX 39A</span>
          </div>
          <div className="font-orbitron font-black text-8xl md:text-9xl text-white text-glow-cyan tracking-wider">
            T-{countdown}
          </div>
          <div className="font-mono text-xs text-slate-300 mt-3 bg-slate-950/85 px-5 py-2 rounded-full border border-sky-500/40 flex items-center gap-2 shadow-[0_0_25px_rgba(56,189,248,0.25)]">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>LAUNCH VEHICLE: {launchVehicle?.name || 'TITAN-HEAVY LV-904X'}</span>
          </div>
        </div>
      )}

      {/* Top Header Status Banner & Controls */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-4 pointer-events-none">
        <div className="hud-panel p-3.5 rounded-xl border border-sky-500/40 flex items-center gap-3 shadow-[0_0_30px_rgba(56,189,248,0.25)]">
          <div className={`w-3.5 h-3.5 rounded-full ${phase === 'SPACE_FLIGHT' ? 'bg-emerald-400' : 'bg-amber-400 animate-ping'}`} />
          <div>
            <div className="font-mono text-[9px] text-sky-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{phaseTitle}</span>
            </div>
            <div className="font-orbitron text-xs sm:text-sm font-bold text-white mt-0.5">
              {telemetry.status}
            </div>
          </div>
        </div>

        <div className="pointer-events-auto">
          <button
            onClick={handleSkip}
            className="btn-aerospace py-2.5 px-6 rounded-lg text-xs font-orbitron flex items-center gap-2.5 shadow-[0_0_20px_rgba(56,189,248,0.3)]"
          >
            <span>FAST-FORWARD</span>
            <FastForward className="w-4 h-4 text-sky-300" />
          </button>
        </div>
      </div>

      {/* Bottom Live Aerospace Telemetry Bar */}
      <div className="absolute bottom-6 left-4 right-4 z-20 pointer-events-none max-w-4xl mx-auto">
        <div className="hud-panel p-3.5 rounded-2xl border border-sky-500/30 grid grid-cols-2 sm:grid-cols-4 gap-2.5 shadow-[0_0_40px_rgba(56,189,248,0.2)]">
          <div className="bg-slate-950/70 p-2.5 rounded-lg border border-sky-500/20 font-mono text-xs">
            <span className="text-[10px] text-slate-400 block font-bold">ALTITUDE</span>
            <span className="font-orbitron text-base sm:text-lg font-bold text-sky-300">
              {telemetry.altitudeKm} <span className="text-[10px] text-slate-400">KM</span>
            </span>
          </div>

          <div className="bg-slate-950/70 p-2.5 rounded-lg border border-sky-500/20 font-mono text-xs">
            <span className="text-[10px] text-slate-400 block font-bold">VELOCITY</span>
            <span className="font-orbitron text-base sm:text-lg font-bold text-emerald-400">
              {telemetry.velocityMs} <span className="text-[10px] text-slate-400">M/S</span>
            </span>
          </div>

          <div className="bg-slate-950/70 p-2.5 rounded-lg border border-sky-500/20 font-mono text-xs">
            <span className="text-[10px] text-slate-400 block font-bold">DOWNRANGE</span>
            <span className="font-orbitron text-base sm:text-lg font-bold text-white">
              {telemetry.downrangeKm} <span className="text-[10px] text-slate-400">KM</span>
            </span>
          </div>

          <div className="bg-slate-950/70 p-2.5 rounded-lg border border-sky-500/20 font-mono text-xs">
            <span className="text-[10px] text-slate-400 block font-bold">PROPELLANT</span>
            <span className="font-orbitron text-base sm:text-lg font-bold text-amber-300">
              {telemetry.fuelPct}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

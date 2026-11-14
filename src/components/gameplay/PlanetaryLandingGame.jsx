// 3D Planetary Landing Challenge Gameplay (Project Orbital)
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { createPlayerShipModel } from '../../utils/game3dModels';
import { createCosmicEnvironment } from '../../utils/spaceEnvironment';
import GameHUD from './GameHUD';
import { sound } from '../../utils/soundEngine';

export default function PlanetaryLandingGame({
  stats,
  activeMission,
  onCompleteLanding,
  onReturnToMenu,
  onOpenInstructions,
  isMuted,
  onToggleMute
}) {
  const mountRef = useRef(null);
  const animFrameRef = useRef(null);

  const isMars = activeMission?.id === 'mars';
  const gravity = isMars ? 3.71 : 1.62; // m/s^2

  const [hudState, setHudState] = useState({
    health: 100,
    maxHealth: 100,
    fuel: 600,
    maxFuel: 600,
    boost: 100,
    speed: 0,
    altitude: 400,
    verticalSpeed: 0,
    objective: 'CONTROL DESCENT & LAND ON TARGET PAD',
    objectiveProgress: 'ALT: 400 M',
    distance: 0,
    warning: null,
    isPaused: false,
    isGameOver: false,
    isVictory: false,
    gameStats: null
  });

  const simRef = useRef({
    keys: { KeyW: false, KeyS: false, KeyA: false, KeyD: false, ShiftLeft: false, Space: false },
    position: new THREE.Vector3(0, 320, 0),
    velocity: new THREE.Vector3(0, -12, 0), // Initial downward descent speed
    rotation: new THREE.Euler(0, 0, 0, 'YXZ'),
    fuel: 600,
    health: 100,
    touchdownStatus: null, // 'SUCCESS' | 'CRASH'
    isPaused: false,
    isGameOver: false,
    isVictory: false,
    padPos: new THREE.Vector3(0, 0, 0)
  });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isMars ? 0x451a03 : 0x02040a);
    scene.fog = new THREE.FogExp2(isMars ? 0x451a03 : 0x02040a, 0.003);

    const camera = new THREE.PerspectiveCamera(55, container.clientWidth / container.clientHeight, 0.1, 2000);
    camera.position.set(0, 330, 35);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // 2. Cosmic Nebula & Stars (for Moon/Europa) or Atmospheric Horizon (Mars)
    if (!isMars) {
      createCosmicEnvironment(scene, { type: 'purple', radius: 1800, starCount: 2500 });
    } else {
      // Subtle Martian high-altitude stellar dust
      const starGeom = new THREE.BufferGeometry();
      const starCoords = new Float32Array(800 * 3);
      for (let i = 0; i < 800 * 3; i += 3) {
        starCoords[i] = (Math.random() - 0.5) * 1600;
        starCoords[i + 1] = 200 + Math.random() * 800;
        starCoords[i + 2] = (Math.random() - 0.5) * 1600;
      }
      starGeom.setAttribute('position', new THREE.BufferAttribute(starCoords, 3));
      scene.add(new THREE.Points(starGeom, new THREE.PointsMaterial({ size: 1.2, color: 0xfed7aa, transparent: true, opacity: 0.6 })));
    }

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(isMars ? 0x7c2d12 : 0x1e293b, 1.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff7ed, 3.0);
    sunLight.position.set(200, 400, 150);
    sunLight.castShadow = true;
    scene.add(sunLight);

    // 4. Planetary Surface / Crater Basin
    const terrainGeom = new THREE.PlaneGeometry(800, 800, 64, 64);
    const posAttr = terrainGeom.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const vx = posAttr.getX(i);
      const vy = posAttr.getY(i);
      const distFromCenter = Math.sqrt(vx * vx + vy * vy);

      // Keep center flat for landing pad, raise rim for crater
      let z = Math.sin(vx * 0.03) * Math.cos(vy * 0.03) * 12;
      if (distFromCenter > 40) {
        z += Math.pow((distFromCenter - 40) * 0.05, 1.8);
      }
      posAttr.setZ(i, z);
    }
    terrainGeom.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: isMars ? 0xc2410c : 0x64748b,
      roughness: 0.9,
      metalness: 0.1,
      flatShading: true
    });
    const terrain = new THREE.Mesh(terrainGeom, terrainMat);
    terrain.rotation.x = -Math.PI / 2;
    terrain.receiveShadow = true;
    scene.add(terrain);

    // 5. Designated Landing Pad Plinth
    const padGeom = new THREE.CylinderGeometry(18, 20, 1.5, 32);
    const padMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.3 });
    const pad = new THREE.Mesh(padGeom, padMat);
    pad.position.set(0, 0.75, 0);
    pad.receiveShadow = true;
    scene.add(pad);

    // Glowing Target Landing Rings & Crosshair
    const targetRing = new THREE.Mesh(
      new THREE.RingGeometry(12, 13.5, 32),
      new THREE.MeshBasicMaterial({ color: 0x10b981, side: THREE.DoubleSide })
    );
    targetRing.rotation.x = -Math.PI / 2;
    targetRing.position.y = 1.55;
    scene.add(targetRing);

    // 4 Corner Guide Beacons
    [-14, 14].forEach(bx => {
      [-14, 14].forEach(bz => {
        const beacon = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 3, 12), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
        beacon.position.set(bx, 1.5, bz);
        const beaconLight = new THREE.PointLight(0x38bdf8, 2.0, 25);
        beaconLight.position.set(bx, 3.2, bz);
        scene.add(beacon, beaconLight);
      });
    });

    // 6. Spacecraft Lander Model
    const landerMesh = createPlayerShipModel({ primaryColor: 0x1e293b, accentColor: 0x10b981 });
    landerMesh.position.set(0, 320, 0);
    scene.add(landerMesh);

    // 7. Input Event Listeners
    const onKeyDown = (e) => {
      if (simRef.current.keys.hasOwnProperty(e.code)) simRef.current.keys[e.code] = true;
      if (e.code === 'Escape') {
        simRef.current.isPaused = !simRef.current.isPaused;
        setHudState(prev => ({ ...prev, isPaused: simRef.current.isPaused }));
      }
    };
    const onKeyUp = (e) => {
      if (simRef.current.keys.hasOwnProperty(e.code)) simRef.current.keys[e.code] = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    // 8. Landing Physics Simulation Loop
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);
      const sim = simRef.current;

      if (sim.isPaused || sim.isGameOver || sim.isVictory) {
        renderer.render(scene, camera);
        return;
      }

      // Vertical Gravity pull
      sim.velocity.y -= gravity * delta;

      // Thrust Controls (W key / Shift)
      const hasFuel = sim.fuel > 0;
      const isMainThrust = (sim.keys.KeyW || sim.keys.ShiftLeft) && hasFuel;

      if (isMainThrust) {
        const thrustPower = sim.keys.ShiftLeft ? 18.0 : 10.5;
        sim.velocity.y += thrustPower * delta;
        sim.fuel = Math.max(0, sim.fuel - (sim.keys.ShiftLeft ? 18 : 9) * delta);
      }

      // Lateral RCS Attitude Verniers (A / D for X drift, S / Space for Z drift)
      if (sim.keys.KeyA && hasFuel) {
        sim.velocity.x -= 8.0 * delta;
        sim.rotation.z = THREE.MathUtils.lerp(sim.rotation.z, 0.25, 4 * delta);
        sim.fuel = Math.max(0, sim.fuel - 2 * delta);
      } else if (sim.keys.KeyD && hasFuel) {
        sim.velocity.x += 8.0 * delta;
        sim.rotation.z = THREE.MathUtils.lerp(sim.rotation.z, -0.25, 4 * delta);
        sim.fuel = Math.max(0, sim.fuel - 2 * delta);
      } else {
        sim.rotation.z = THREE.MathUtils.lerp(sim.rotation.z, 0, 4 * delta);
      }

      // Space / S for forward / reverse drift
      if (sim.keys.KeyS && hasFuel) {
        sim.velocity.z += 8.0 * delta;
        sim.rotation.x = THREE.MathUtils.lerp(sim.rotation.x, 0.2, 4 * delta);
      } else {
        sim.rotation.x = THREE.MathUtils.lerp(sim.rotation.x, 0, 4 * delta);
      }

      // Natural drag
      sim.velocity.x *= Math.pow(0.85, delta);
      sim.velocity.z *= Math.pow(0.85, delta);

      // Update position
      sim.position.add(sim.velocity.clone().multiplyScalar(delta));
      landerMesh.position.copy(sim.position);
      landerMesh.rotation.set(sim.rotation.x, 0, sim.rotation.z);

      // Plume Mesh
      const { plume, engineLight } = landerMesh.userData;
      if (isMainThrust) {
        plume.visible = true;
        plume.scale.set(1.2, 1, 1.8);
        engineLight.intensity = 5;
      } else {
        plume.visible = false;
        engineLight.intensity = 0.2;
      }

      // Camera Follow
      const camOffset = new THREE.Vector3(0, 12, 32);
      camera.position.lerp(sim.position.clone().add(camOffset), 6 * delta);
      camera.lookAt(sim.position.x, Math.max(0, sim.position.y - 4), sim.position.z);

      // Altitude & Touchdown Logic
      const altitude = sim.position.y - 1.5; // Offset to plinth top
      const distFromPadCenter = Math.sqrt(sim.position.x * sim.position.x + sim.position.z * sim.position.z);
      const verticalSpeed = -sim.velocity.y; // Positive when descending downward

      let altitudeWarning = null;
      if (altitude < 60 && verticalSpeed > 7.0) {
        altitudeWarning = 'WARNING // DESCENT SPEED EXCESSIVE (BRAKE NOW!)';
      } else if (distFromPadCenter > 18) {
        altitudeWarning = 'WARNING // DRIFTING OFF LANDING TARGET';
      }

      // Touchdown Check!
      if (altitude <= 0) {
        sim.position.y = 1.5;
        sim.velocity.set(0, 0, 0);

        // Evaluation
        const isSafeSpeed = verticalSpeed <= 6.0;
        const isSafeLateral = Math.abs(sim.velocity.x) <= 3.0 && Math.abs(sim.velocity.z) <= 3.0;
        const isOnPad = distFromPadCenter <= 18;

        if (isSafeSpeed && isOnPad) {
          // TOUCHDOWN SUCCESS!
          sim.isVictory = true;
          sound.playFanfare();
          setHudState(prev => ({
            ...prev,
            isVictory: true,
            gameStats: {
              'TOUCHDOWN VELOCITY': `${verticalSpeed.toFixed(1)} M/S (SAFE)`,
              'PAD OFFSET': `${distFromPadCenter.toFixed(1)} METERS`,
              'FUEL PRESERVED': `${Math.round(sim.fuel)} KG`,
              'VERDICT': 'PERFECT LANDING ACHIEVED'
            }
          }));
        } else {
          // CRASH!
          sim.isGameOver = true;
          sound.playWarning();
          setHudState(prev => ({
            ...prev,
            isGameOver: true,
            health: 0,
            gameStats: {
              'DESCENT VELOCITY': `${verticalSpeed.toFixed(1)} M/S (LIMIT 6.0 M/S)`,
              'LOCATION': isOnPad ? 'INSIDE PAD' : 'OUTSIDE SAFE ZONE',
              'VERDICT': 'CRITICAL IMPACT DAMAGE'
            }
          }));
        }
      }

      setHudState(prev => ({
        ...prev,
        fuel: sim.fuel,
        speed: sim.velocity.length(),
        altitude: Math.max(0, altitude),
        verticalSpeed,
        objectiveProgress: `ALT: ${Math.max(0, Math.round(altitude))} M  |  V_DOWN: ${verticalSpeed.toFixed(1)} M/S`,
        distance: distFromPadCenter,
        warning: altitudeWarning
      }));

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
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  const handleRestart = () => {
    simRef.current.position.set(0, 320, 0);
    simRef.current.velocity.set(0, -12, 0);
    simRef.current.rotation.set(0, 0, 0);
    simRef.current.fuel = 600;
    simRef.current.health = 100;
    simRef.current.isPaused = false;
    simRef.current.isGameOver = false;
    simRef.current.isVictory = false;

    setHudState({
      health: 100,
      maxHealth: 100,
      fuel: 600,
      maxFuel: 600,
      boost: 100,
      speed: 0,
      altitude: 320,
      verticalSpeed: 12,
      objective: 'CONTROL DESCENT & LAND ON TARGET PAD',
      objectiveProgress: 'ALT: 320 M',
      distance: 0,
      warning: null,
      isPaused: false,
      isGameOver: false,
      isVictory: false,
      gameStats: null
    });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-space-950 font-sans select-none">
      <div ref={mountRef} className="w-full h-full absolute inset-0 cursor-crosshair" />

      <GameHUD
        health={hudState.health}
        maxHealth={hudState.maxHealth}
        fuel={hudState.fuel}
        maxFuel={hudState.maxFuel}
        boost={100}
        speed={hudState.speed}
        objective={hudState.objective}
        objectiveProgress={hudState.objectiveProgress}
        distance={hudState.distance}
        warning={hudState.warning}
        isPaused={hudState.isPaused}
        onTogglePause={() => {
          simRef.current.isPaused = !simRef.current.isPaused;
          setHudState(prev => ({ ...prev, isPaused: simRef.current.isPaused }));
        }}
        onRestart={handleRestart}
        onReturnToMenu={onReturnToMenu}
        onOpenInstructions={onOpenInstructions}
        isGameOver={hudState.isGameOver}
        isVictory={hudState.isVictory}
        onNextLevel={() => onCompleteLanding({ fuelRemaining: simRef.current.fuel })}
        gameStats={hudState.gameStats}
        isMuted={isMuted}
        onToggleMute={onToggleMute}
        controlsHint="[W] DESCENT THRUST  [A/D] LATERAL RCS DRIFT  [S] FORWARD DRIFT  (TOUCHDOWN < 6.0 M/S)"
      />
    </div>
  );
}


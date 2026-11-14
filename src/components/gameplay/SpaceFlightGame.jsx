// 3D Direct Third-Person Spacecraft Flight Gameplay (Project Orbital)
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { createPlayerShipModel, createCheckpointRing, createAsteroidMesh } from '../../utils/game3dModels';
import { createCosmicEnvironment } from '../../utils/spaceEnvironment';
import GameHUD from './GameHUD';
import { sound } from '../../utils/soundEngine';

export default function SpaceFlightGame({
  stats,
  activeMission,
  onCompleteFlight,
  onReturnToMenu,
  onOpenInstructions,
  isMuted,
  onToggleMute
}) {
  const mountRef = useRef(null);
  const animFrameRef = useRef(null);

  // Gameplay State
  const [hudState, setHudState] = useState({
    health: 100,
    maxHealth: 100,
    fuel: stats?.fuelMass || 1200,
    maxFuel: stats?.fuelMass || 1200,
    boost: 100,
    speed: 0,
    objective: 'NAVIGATE ORBITAL TRANSIT GATES',
    objectiveProgress: '0 / 6',
    distance: 0,
    warning: null,
    isPaused: false,
    isGameOver: false,
    isVictory: false,
    gameStats: null
  });

  // Mutable Game Physics Refs
  const simRef = useRef({
    keys: {
      KeyW: false,
      KeyS: false,
      KeyA: false,
      KeyD: false,
      ShiftLeft: false,
      ShiftRight: false,
      Space: false
    },
    mouse: { x: 0, y: 0 },
    position: new THREE.Vector3(0, 0, 0),
    velocity: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Euler(0, 0, 0, 'YXZ'),
    roll: 0,
    health: 100,
    fuel: stats?.fuelMass || 1200,
    boost: 100,
    ringsCleared: 0,
    totalRings: 6,
    isPaused: false,
    isGameOver: false,
    isVictory: false,
    elapsedTime: 0
  });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x02040a);

    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      4000
    );
    camera.position.set(0, 4, 12);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 2. Rich Cosmic Environment (Nebula, Starfield, Distant Galaxy - NEVER PITCH BLACK!)
    createCosmicEnvironment(scene, { type: 'carina', radius: 2500, starCount: 3500 });

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0x0f172a, 1.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff7ed, 3.2);
    sunLight.position.set(400, 200, -500);
    scene.add(sunLight);

    // 4. Spacecraft Mesh
    const isElectric = stats?.components?.some(c => c.type === 'electric');
    const shipMesh = createPlayerShipModel({ isIon: isElectric });
    scene.add(shipMesh);

    // Engine exhaust particle trails
    const trailCount = 180;
    const trailGeom = new THREE.BufferGeometry();
    const trailPositions = new Float32Array(trailCount * 3);
    const trailLifes = new Float32Array(trailCount);
    for (let i = 0; i < trailCount; i++) {
      trailPositions[i * 3] = 0;
      trailPositions[i * 3 + 1] = -1000;
      trailPositions[i * 3 + 2] = 0;
      trailLifes[i] = 1.0;
    }
    trailGeom.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
    const trailMat = new THREE.PointsMaterial({
      size: 2.2,
      color: isElectric ? 0x38bdf8 : 0xf97316,
      transparent: true,
      opacity: 0.7,
      depthWrite: false
    });
    const trailParticles = new THREE.Points(trailGeom, trailMat);
    scene.add(trailParticles);

    // 5. Checkpoint Ring Course (6 Checkpoint Gates)
    const rings = [];
    const ringPositions = [
      new THREE.Vector3(0, 0, -120),
      new THREE.Vector3(40, 20, -280),
      new THREE.Vector3(-30, -10, -460),
      new THREE.Vector3(20, -30, -660),
      new THREE.Vector3(-50, 15, -880),
      new THREE.Vector3(0, 0, -1120) // Final Warp Gate
    ];

    ringPositions.forEach((pos, idx) => {
      const isFinal = idx === ringPositions.length - 1;
      const ring = createCheckpointRing(isFinal ? 10 : 7, isFinal ? 0x10b981 : 0x38bdf8);
      ring.position.copy(pos);
      ring.lookAt(ringPositions[Math.min(idx + 1, ringPositions.length - 1)]);
      scene.add(ring);
      rings.push(ring);
    });

    // 6. Floating Asteroid Hazards
    const asteroids = [];
    for (let i = 0; i < 40; i++) {
      const radius = 3 + Math.random() * 7;
      const ast = createAsteroidMesh(radius, 1);
      // Scatter along the course corridor
      ast.position.set(
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 120,
        -80 - Math.random() * 1050
      );
      ast.userData = {
        radius,
        rotSpeedX: (Math.random() - 0.5) * 0.02,
        rotSpeedY: (Math.random() - 0.5) * 0.02
      };
      scene.add(ast);
      asteroids.push(ast);
    }

    // 7. Input Event Listeners
    const onKeyDown = (e) => {
      if (simRef.current.keys.hasOwnProperty(e.code)) {
        simRef.current.keys[e.code] = true;
      }
      if (e.code === 'Escape') {
        simRef.current.isPaused = !simRef.current.isPaused;
        setHudState(prev => ({ ...prev, isPaused: simRef.current.isPaused }));
      }
    };

    const onKeyUp = (e) => {
      if (simRef.current.keys.hasOwnProperty(e.code)) {
        simRef.current.keys[e.code] = false;
      }
    };

    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      simRef.current.mouse.x = x;
      simRef.current.mouse.y = y;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('mousemove', onMouseMove);

    // 8. Flight Simulation Loop
    const clock = new THREE.Clock();
    let trailIdx = 0;

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);
      const sim = simRef.current;

      if (sim.isPaused || sim.isGameOver || sim.isVictory) {
        renderer.render(scene, camera);
        return;
      }

      sim.elapsedTime += delta;

      // Engineering Mass & Propulsion factors
      const wetMass = stats?.wetMass || 2000;
      const massScale = 2000 / Math.max(1000, wetMass); // Heavier craft accelerates slower!
      const isBoosting = (sim.keys.ShiftLeft || sim.keys.ShiftRight) && sim.boost > 0 && sim.fuel > 0;
      const isThrusting = (sim.keys.KeyW || isBoosting) && sim.fuel > 0;

      // Acceleration
      let thrustAcc = 45 * massScale;
      if (isBoosting) thrustAcc *= 2.2;
      if (sim.keys.KeyS) thrustAcc = -20 * massScale; // Reverse thrusters

      // Pitch, Yaw, Roll based on Mouse & A/D Keys
      const targetPitch = -sim.mouse.y * 1.2;
      const targetYaw = -sim.mouse.x * 1.5;

      // Roll banking into turns
      let targetRoll = -sim.mouse.x * 0.8;
      if (sim.keys.KeyA) {
        targetRoll += 0.6;
        sim.rotation.y += 1.8 * delta;
      }
      if (sim.keys.KeyD) {
        targetRoll -= 0.6;
        sim.rotation.y -= 1.8 * delta;
      }

      // Smooth Angular Damping
      sim.rotation.x = THREE.MathUtils.lerp(sim.rotation.x, targetPitch, 4 * delta);
      sim.rotation.y += -sim.mouse.x * 1.2 * delta;
      sim.roll = THREE.MathUtils.lerp(sim.roll, targetRoll, 6 * delta);

      shipMesh.rotation.set(sim.rotation.x, sim.rotation.y, sim.roll, 'YXZ');

      // Forward vector
      const forward = new THREE.Vector3(0, 0, -1).applyEuler(shipMesh.rotation);

      // Apply linear acceleration
      if (isThrusting) {
        sim.velocity.add(forward.clone().multiplyScalar(thrustAcc * delta));

        // Fuel burn
        const burnRate = isBoosting ? 14 : 5;
        sim.fuel = Math.max(0, sim.fuel - burnRate * delta);
        if (isBoosting) {
          sim.boost = Math.max(0, sim.boost - 35 * delta);
        }
      } else {
        // Boost recharge when not boosting
        sim.boost = Math.min(100, sim.boost + 20 * delta);
      }

      // Space Brake (Spacebar)
      if (sim.keys.Space) {
        sim.velocity.multiplyScalar(Math.pow(0.1, delta));
      } else {
        // Natural vacuum momentum damping
        sim.velocity.multiplyScalar(Math.pow(0.85, delta));
      }

      // Cap max speed
      const maxSpeed = isBoosting ? 160 : 85;
      if (sim.velocity.length() > maxSpeed) {
        sim.velocity.setLength(maxSpeed);
      }

      // Update position
      sim.position.add(sim.velocity.clone().multiplyScalar(delta));
      shipMesh.position.copy(sim.position);

      // Engine Plume & Lights
      const { plume, engineLight, engineNozzles } = shipMesh.userData;
      if (isThrusting) {
        plume.visible = true;
        plume.scale.set(
          isBoosting ? 1.5 : 1.0,
          1 + Math.random() * 0.3,
          isBoosting ? 2.5 : 1.2
        );
        engineLight.intensity = isBoosting ? 8.0 : 3.5;
        engineNozzles.forEach(noz => (noz.material.color.setHex(isBoosting ? 0xffffff : (isElectric ? 0x38bdf8 : 0xf97316))));

        // Emit particle trail
        const trailPositionsArr = trailGeom.attributes.position.array;
        const trailOffset = new THREE.Vector3(0, 0, 3.2).applyEuler(shipMesh.rotation);
        const emitPos = sim.position.clone().add(trailOffset);

        trailPositionsArr[trailIdx * 3] = emitPos.x + (Math.random() - 0.5) * 0.4;
        trailPositionsArr[trailIdx * 3 + 1] = emitPos.y + (Math.random() - 0.5) * 0.4;
        trailPositionsArr[trailIdx * 3 + 2] = emitPos.z + (Math.random() - 0.5) * 0.4;
        trailLifes[trailIdx] = 0.0;
        trailIdx = (trailIdx + 1) % trailCount;
        trailGeom.attributes.position.needsUpdate = true;
      } else {
        plume.visible = false;
        engineLight.intensity = 0.2;
      }

      // Update chase camera
      const cameraOffset = new THREE.Vector3(0, 3.5, 9.5).applyEuler(shipMesh.rotation);
      const targetCamPos = sim.position.clone().add(cameraOffset);
      camera.position.lerp(targetCamPos, 8 * delta);
      camera.lookAt(sim.position.clone().add(forward.clone().multiplyScalar(15)));

      // Dynamic Camera FOV kick when boosting
      camera.fov = THREE.MathUtils.lerp(camera.fov, isBoosting ? 75 : 60, 4 * delta);
      camera.updateProjectionMatrix();

      // Checkpoint Ring Detection
      const nextRingIdx = sim.ringsCleared;
      let distToNext = 0;
      if (nextRingIdx < rings.length) {
        const targetRing = rings[nextRingIdx];
        distToNext = sim.position.distanceTo(targetRing.position);

        // Passed through ring?
        if (distToNext < targetRing.userData.radius + 2) {
          targetRing.userData.passed = true;
          targetRing.children[0].material.color.setHex(0x10b981); // Turn emerald green!
          sound.playScan();
          sim.ringsCleared += 1;

          // If reached final gate -> VICTORY!
          if (sim.ringsCleared >= rings.length) {
            sim.isVictory = true;
            sound.playFanfare();
            setHudState(prev => ({
              ...prev,
              isVictory: true,
              gameStats: {
                'TIME ELAPSED': `${Math.round(sim.elapsedTime)} SECONDS`,
                'HULL REMAINING': `${Math.round(sim.health)}%`,
                'PROPELLANT REMAINING': `${Math.round(sim.fuel)} KG`,
                'NAV GATES CLEARED': `${sim.ringsCleared} OF ${rings.length}`
              }
            }));
          }
        }
      }

      // Asteroid Collisions & Tumbling
      let hazardWarning = null;
      asteroids.forEach(ast => {
        ast.rotation.x += ast.userData.rotSpeedX;
        ast.rotation.y += ast.userData.rotSpeedY;

        const dist = sim.position.distanceTo(ast.position);
        if (dist < ast.userData.radius + 3.0) {
          // Collision!
          sound.playWarning();
          const impactDamage = Math.round(15 + Math.random() * 15);
          sim.health = Math.max(0, sim.health - impactDamage);

          // Bounce recoil
          const bounceVec = sim.position.clone().sub(ast.position).normalize().multiplyScalar(25);
          sim.velocity.add(bounceVec);

          if (sim.health <= 0) {
            sim.isGameOver = true;
            sound.stopRocketRumble();
            setHudState(prev => ({ ...prev, isGameOver: true, health: 0 }));
          }
        } else if (dist < ast.userData.radius + 25.0) {
          hazardWarning = 'PROXIMITY WARNING // DEBRIS COLLISION RISK';
        }
      });

      // Update HUD state throttle
      setHudState(prev => ({
        ...prev,
        health: sim.health,
        fuel: sim.fuel,
        boost: sim.boost,
        speed: sim.velocity.length(),
        objectiveProgress: `${sim.ringsCleared} / ${rings.length}`,
        distance: distToNext,
        warning: hazardWarning
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
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  const handleRestart = () => {
    simRef.current.position.set(0, 0, 0);
    simRef.current.velocity.set(0, 0, 0);
    simRef.current.rotation.set(0, 0, 0);
    simRef.current.health = 100;
    simRef.current.fuel = stats?.fuelMass || 1200;
    simRef.current.boost = 100;
    simRef.current.ringsCleared = 0;
    simRef.current.isPaused = false;
    simRef.current.isGameOver = false;
    simRef.current.isVictory = false;
    simRef.current.elapsedTime = 0;

    setHudState({
      health: 100,
      maxHealth: 100,
      fuel: stats?.fuelMass || 1200,
      maxFuel: stats?.fuelMass || 1200,
      boost: 100,
      speed: 0,
      objective: 'NAVIGATE ORBITAL TRANSIT GATES',
      objectiveProgress: '0 / 6',
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
      {/* 3D WebGL Flight Canvas */}
      <div ref={mountRef} className="w-full h-full absolute inset-0 cursor-crosshair" />

      {/* Video Game Flight HUD */}
      <GameHUD
        health={hudState.health}
        maxHealth={hudState.maxHealth}
        fuel={hudState.fuel}
        maxFuel={hudState.maxFuel}
        boost={hudState.boost}
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
        onNextLevel={() => onCompleteFlight({ health: hudState.health, fuel: hudState.fuel })}
        gameStats={hudState.gameStats}
        isMuted={isMuted}
        onToggleMute={onToggleMute}
        controlsHint="[W] THRUST  [S] REVERSE  [A/D] YAW/BANK  [SHIFT] BOOST  [SPACE] BRAKE  [MOUSE] PITCH/YAW"
      />
    </div>
  );
}


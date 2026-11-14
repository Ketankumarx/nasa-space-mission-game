// 3D Asteroid Field Navigation Challenge Level (Project Orbital)
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { createPlayerShipModel, createAsteroidMesh, createCheckpointRing } from '../../utils/game3dModels';
import { createCosmicEnvironment } from '../../utils/spaceEnvironment';
import GameHUD from './GameHUD';
import { sound } from '../../utils/soundEngine';

export default function AsteroidFieldGame({
  stats,
  activeMission,
  onCompleteLevel,
  onReturnToMenu,
  onOpenInstructions,
  isMuted,
  onToggleMute
}) {
  const mountRef = useRef(null);
  const animFrameRef = useRef(null);

  const [hudState, setHudState] = useState({
    health: 100,
    maxHealth: 100,
    fuel: 1000,
    maxFuel: 1000,
    boost: 100,
    speed: 0,
    objective: 'ASTEROID HAZARD // COLLECT CORES & REACH GATE',
    objectiveProgress: '0 / 8 CORES',
    distance: 0,
    warning: null,
    isPaused: false,
    isGameOver: false,
    isVictory: false,
    gameStats: null
  });

  const simRef = useRef({
    keys: { KeyW: false, KeyS: false, KeyA: false, KeyD: false, ShiftLeft: false, ShiftRight: false, Space: false },
    mouse: { x: 0, y: 0 },
    position: new THREE.Vector3(0, 0, 0),
    velocity: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Euler(0, 0, 0, 'YXZ'),
    roll: 0,
    health: 100,
    fuel: 1000,
    boost: 100,
    score: 0,
    coresCollected: 0,
    totalCores: 8,
    elapsedTime: 0,
    isPaused: false,
    isGameOver: false,
    isVictory: false
  });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030712);

    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 3000);
    camera.position.set(0, 4, 12);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    // 2. Cosmic Nebula Background & Starfield (Orion Golden-Amber Veil)
    createCosmicEnvironment(scene, { type: 'orion', radius: 2600, starCount: 3500 });

    // 3. Lighting
    scene.add(new THREE.AmbientLight(0x0f172a, 1.2));
    const sunLight = new THREE.DirectionalLight(0xffedd5, 3.5);
    sunLight.position.set(200, 150, -300);
    scene.add(sunLight);

    // 4. Spacecraft Mesh
    const isElectric = stats?.components?.some(c => c.type === 'electric');
    const shipMesh = createPlayerShipModel({ isIon: isElectric, accentColor: 0xf59e0b });
    scene.add(shipMesh);

    // 5. Heavy Asteroid Belt (75 moving & tumbling asteroids)
    const asteroids = [];
    for (let i = 0; i < 75; i++) {
      const radius = 2.5 + Math.random() * 8.5;
      const ast = createAsteroidMesh(radius, 1);
      // Corridor from Z = -50 to -900
      const x = (Math.random() - 0.5) * 280;
      const y = (Math.random() - 0.5) * 160;
      const z = -60 - Math.random() * 850;
      ast.position.set(x, y, z);

      ast.userData = {
        radius,
        rotSpeedX: (Math.random() - 0.5) * 0.03,
        rotSpeedY: (Math.random() - 0.5) * 0.03,
        driftSpeedX: (Math.random() - 0.5) * 3,
        driftSpeedY: (Math.random() - 0.5) * 3
      };
      scene.add(ast);
      asteroids.push(ast);
    }

    // 6. Collectible Scientific Energy Cores (Floating Golden Anomaly Crystals)
    const energyCores = [];
    for (let i = 0; i < 8; i++) {
      const coreGroup = new THREE.Group();
      const crystalMesh = new THREE.Mesh(
        new THREE.OctahedronGeometry(1.2, 0),
        new THREE.MeshStandardMaterial({
          color: 0xfbbf24,
          emissive: 0xf59e0b,
          emissiveIntensity: 0.6,
          metalness: 0.9,
          roughness: 0.1
        })
      );
      coreGroup.add(crystalMesh);

      // Rotating glow beacon ring
      const halo = new THREE.Mesh(
        new THREE.RingGeometry(1.6, 1.8, 16),
        new THREE.MeshBasicMaterial({ color: 0xfbbf24, side: THREE.DoubleSide })
      );
      coreGroup.add(halo);

      const light = new THREE.PointLight(0xfbbf24, 2.5, 15);
      coreGroup.add(light);

      // Scatter along corridor
      coreGroup.position.set(
        (Math.random() - 0.5) * 160,
        (Math.random() - 0.5) * 80,
        -100 - i * 95
      );
      coreGroup.userData = { collected: false, halo };
      scene.add(coreGroup);
      energyCores.push(coreGroup);
    }

    // 7. Destination Extraction Gate at Z = -950
    const exitGate = createCheckpointRing(12, 0x10b981);
    exitGate.position.set(0, 0, -950);
    scene.add(exitGate);

    // 8. Input Listeners
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
    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      simRef.current.mouse.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      simRef.current.mouse.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('mousemove', onMouseMove);

    // 9. Game Loop
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);
      const sim = simRef.current;

      if (sim.isPaused || sim.isGameOver || sim.isVictory) {
        renderer.render(scene, camera);
        return;
      }

      sim.elapsedTime += delta;

      // Flight Physics
      const isBoosting = (sim.keys.ShiftLeft || sim.keys.ShiftRight) && sim.boost > 0 && sim.fuel > 0;
      const isThrusting = (sim.keys.KeyW || isBoosting) && sim.fuel > 0;
      let thrustAcc = 50;
      if (isBoosting) thrustAcc *= 2.0;
      if (sim.keys.KeyS) thrustAcc = -22;

      // Turning & Roll Banking
      sim.rotation.x = THREE.MathUtils.lerp(sim.rotation.x, -sim.mouse.y * 1.3, 4 * delta);
      sim.rotation.y += -sim.mouse.x * 1.3 * delta;

      let targetRoll = -sim.mouse.x * 0.9;
      if (sim.keys.KeyA) {
        targetRoll += 0.7;
        sim.rotation.y += 2.0 * delta;
      }
      if (sim.keys.KeyD) {
        targetRoll -= 0.7;
        sim.rotation.y -= 2.0 * delta;
      }
      sim.roll = THREE.MathUtils.lerp(sim.roll, targetRoll, 6 * delta);

      shipMesh.rotation.set(sim.rotation.x, sim.rotation.y, sim.roll, 'YXZ');
      const forward = new THREE.Vector3(0, 0, -1).applyEuler(shipMesh.rotation);

      if (isThrusting) {
        sim.velocity.add(forward.clone().multiplyScalar(thrustAcc * delta));
        sim.fuel = Math.max(0, sim.fuel - (isBoosting ? 16 : 6) * delta);
        if (isBoosting) sim.boost = Math.max(0, sim.boost - 40 * delta);
      } else {
        sim.boost = Math.min(100, sim.boost + 25 * delta);
      }

      if (sim.keys.Space) {
        sim.velocity.multiplyScalar(Math.pow(0.1, delta));
      } else {
        sim.velocity.multiplyScalar(Math.pow(0.88, delta));
      }

      sim.position.add(sim.velocity.clone().multiplyScalar(delta));
      shipMesh.position.copy(sim.position);

      // Camera Follow
      const camOffset = new THREE.Vector3(0, 3.5, 9.5).applyEuler(shipMesh.rotation);
      camera.position.lerp(sim.position.clone().add(camOffset), 8 * delta);
      camera.lookAt(sim.position.clone().add(forward.clone().multiplyScalar(15)));

      // Plume Mesh
      const { plume, engineLight } = shipMesh.userData;
      if (isThrusting) {
        plume.visible = true;
        plume.scale.set(isBoosting ? 1.6 : 1.0, 1, isBoosting ? 2.5 : 1.2);
        engineLight.intensity = isBoosting ? 7 : 3;
      } else {
        plume.visible = false;
        engineLight.intensity = 0.2;
      }

      // Asteroid Collisions & Motion
      let proximityWarning = null;
      asteroids.forEach(ast => {
        ast.rotation.x += ast.userData.rotSpeedX;
        ast.rotation.y += ast.userData.rotSpeedY;
        ast.position.x += ast.userData.driftSpeedX * delta;
        ast.position.y += ast.userData.driftSpeedY * delta;

        const dist = sim.position.distanceTo(ast.position);
        if (dist < ast.userData.radius + 3.0) {
          sound.playWarning();
          sim.health = Math.max(0, sim.health - 20);
          sim.velocity.add(sim.position.clone().sub(ast.position).normalize().multiplyScalar(30));

          if (sim.health <= 0) {
            sim.isGameOver = true;
            setHudState(prev => ({ ...prev, isGameOver: true, health: 0 }));
          }
        } else if (dist < ast.userData.radius + 20.0) {
          proximityWarning = 'HAZARD WARNING // DENSE ASTEROID SWARM';
        }
      });

      // Energy Core Collection
      energyCores.forEach(core => {
        if (!core.userData.collected) {
          core.rotation.y += 1.5 * delta;
          core.userData.halo.rotation.z += 2.0 * delta;

          const dist = sim.position.distanceTo(core.position);
          if (dist < 4.5) {
            core.userData.collected = true;
            core.visible = false;
            sound.playScan();
            sim.coresCollected += 1;
            sim.score += 250;
            sim.fuel = Math.min(1000, sim.fuel + 150); // Recharge fuel!
          }
        }
      });

      // Distance to Exit Gate
      const distToGate = sim.position.distanceTo(exitGate.position);
      if (distToGate < 14) {
        // Passed Exit Gate -> VICTORY!
        sim.isVictory = true;
        sound.playFanfare();
        setHudState(prev => ({
          ...prev,
          isVictory: true,
          gameStats: {
            'ASTEROID TRANSIT TIME': `${Math.round(sim.elapsedTime)} SECONDS`,
            'ANOMALY CORES EXTRACTED': `${sim.coresCollected} OF ${sim.totalCores}`,
            'FINAL HULL INTEGRITY': `${Math.round(sim.health)}%`,
            'EXPLORATION SCORE': `${sim.score + Math.round(sim.health * 10)} PTS`
          }
        }));
      }

      setHudState(prev => ({
        ...prev,
        health: sim.health,
        fuel: sim.fuel,
        boost: sim.boost,
        speed: sim.velocity.length(),
        objectiveProgress: `${sim.coresCollected} / ${sim.totalCores} CORES`,
        distance: distToGate,
        warning: proximityWarning
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
    simRef.current.fuel = 1000;
    simRef.current.boost = 100;
    simRef.current.coresCollected = 0;
    simRef.current.score = 0;
    simRef.current.isPaused = false;
    simRef.current.isGameOver = false;
    simRef.current.isVictory = false;
    simRef.current.elapsedTime = 0;

    setHudState({
      health: 100,
      maxHealth: 100,
      fuel: 1000,
      maxFuel: 1000,
      boost: 100,
      speed: 0,
      objective: 'ASTEROID HAZARD // COLLECT CORES & REACH GATE',
      objectiveProgress: '0 / 8 CORES',
      distance: 950,
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
        onNextLevel={() => onCompleteLevel({ cores: simRef.current.coresCollected, score: simRef.current.score })}
        gameStats={hudState.gameStats}
        isMuted={isMuted}
        onToggleMute={onToggleMute}
        controlsHint="[W] THRUST  [S] REVERSE  [A/D] STRAFE/BANK  [SHIFT] BOOST  [SPACE] BRAKE"
      />
    </div>
  );
}


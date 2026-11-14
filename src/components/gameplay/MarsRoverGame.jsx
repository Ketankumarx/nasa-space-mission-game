// 3D Mars Rover Surface Exploration Gameplay (Project Orbital)
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { createMarsRoverModel, createSampleTargetMesh } from '../../utils/game3dModels';
import GameHUD from './GameHUD';
import { sound } from '../../utils/soundEngine';
import { Check, Sparkles, MapPin } from 'lucide-react';

export default function MarsRoverGame({
  stats,
  activeMission,
  onCompleteRoverExp,
  onReturnToMenu,
  onOpenInstructions,
  isMuted,
  onToggleMute
}) {
  const mountRef = useRef(null);
  const animFrameRef = useRef(null);

  const [collectedSamples, setCollectedSamples] = useState([]);
  const [activePrompt, setActivePrompt] = useState(null);

  const [hudState, setHudState] = useState({
    health: 100,
    maxHealth: 100,
    battery: 100,
    speed: 0,
    objective: 'EXPLORE MARS // COLLECT 4 GEOLOGICAL SAMPLES',
    objectiveProgress: '0 / 4 SAMPLES',
    distance: 0,
    warning: null,
    isPaused: false,
    isGameOver: false,
    isVictory: false,
    gameStats: null
  });

  const simRef = useRef({
    keys: { KeyW: false, KeyS: false, KeyA: false, KeyD: false, KeyE: false, Space: false },
    mouse: { x: 0, y: 0, isDragging: false, prevX: 0, prevY: 0 },
    camYaw: 0,
    camPitch: 0.35,
    camDistance: 8.5,
    position: new THREE.Vector3(0, 0, 0),
    heading: 0, // Radians
    speed: 0,
    wheelRot: 0,
    battery: 100,
    health: 100,
    samplesCollected: [],
    nearSample: null,
    isScanning: false,
    isPaused: false,
    isGameOver: false,
    isVictory: false,
    elapsedTime: 0
  });

  const SAMPLES_DATA = [
    { id: 's1', type: 'basalt', name: 'THARSIS VOLCANIC BASALT', pos: new THREE.Vector3(35, 0, -45), desc: 'Rich in magnesium and iron olivine, confirming ancient magma flows.' },
    { id: 's2', type: 'sediment', name: 'JEZERO CLAY SEDIMENT', pos: new THREE.Vector3(-48, 0, -60), desc: 'Hydrated phyllosilicate clay deposited in a primordial lake delta.' },
    { id: 's3', type: 'ice', name: 'PERMAFROST WATER-ICE VEIN', pos: new THREE.Vector3(55, 0, -120), desc: '98% pure water ice buried 15cm beneath Martian red soil.' },
    { id: 's4', type: 'radiation', name: 'NICKEL-IRON METEORITE', pos: new THREE.Vector3(-25, 0, -140), desc: 'Extraterrestrial asteroidal iron with distinct Widmanstätten patterns.' }
  ];

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x9a3412);
    scene.fog = new THREE.FogExp2(0x9a3412, 0.005);

    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 5, 12);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // 2. Martian Sun & Atmospheric Haze
    const ambientLight = new THREE.AmbientLight(0x7c2d12, 1.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffedd5, 3.2);
    sunLight.position.set(200, 300, 150);
    sunLight.castShadow = true;
    scene.add(sunLight);

    // Distant Martian Sun Disc
    const sunMesh = new THREE.Mesh(
      new THREE.SphereGeometry(25, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xffedd5 })
    );
    sunMesh.position.set(400, 600, 300);
    scene.add(sunMesh);

    // 3. Martian Dust Particles in Wind
    const dustCount = 600;
    const dustGeom = new THREE.BufferGeometry();
    const dustCoords = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i += 3) {
      dustCoords[i] = (Math.random() - 0.5) * 400;
      dustCoords[i + 1] = Math.random() * 20;
      dustCoords[i + 2] = (Math.random() - 0.5) * 400;
    }
    dustGeom.setAttribute('position', new THREE.BufferAttribute(dustCoords, 3));
    const dustMat = new THREE.PointsMaterial({ size: 1.2, color: 0xfed7aa, transparent: true, opacity: 0.4 });
    const dustParticles = new THREE.Points(dustGeom, dustMat);
    scene.add(dustParticles);

    // 4. Procedural Martian Terrain with Dunes & Craters
    const terrainGeom = new THREE.PlaneGeometry(600, 600, 96, 96);
    const posAttr = terrainGeom.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const vx = posAttr.getX(i);
      const vy = posAttr.getY(i);
      // Gentle Martian rolling dunes
      let z = Math.sin(vx * 0.04) * Math.cos(vy * 0.04) * 4.5 +
              Math.sin(vx * 0.015) * 6.0;
      // Crater rim at edge
      const dist = Math.sqrt(vx * vx + vy * vy);
      if (dist > 180) z += Math.pow((dist - 180) * 0.08, 1.6);
      posAttr.setZ(i, z);
    }
    terrainGeom.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0xc2410c,
      roughness: 0.95,
      metalness: 0.1,
      flatShading: true
    });
    const terrain = new THREE.Mesh(terrainGeom, terrainMat);
    terrain.rotation.x = -Math.PI / 2;
    terrain.receiveShadow = true;
    scene.add(terrain);

    // 5. Scattered Martian Boulders & Rocks
    for (let i = 0; i < 90; i++) {
      const r = 0.6 + Math.random() * 2.2;
      const rockMesh = new THREE.Mesh(
        new THREE.DodecahedronGeometry(r, 0),
        new THREE.MeshStandardMaterial({ color: 0x7c2d12, roughness: 0.9, flatShading: true })
      );
      rockMesh.position.set(
        (Math.random() - 0.5) * 360,
        r * 0.5,
        (Math.random() - 0.5) * 360
      );
      rockMesh.rotation.set(Math.random() * 3, Math.random() * 3, 0);
      rockMesh.castShadow = true;
      scene.add(rockMesh);
    }

    // 6. Scientific Sample Sites (4 target zones)
    const sampleSiteMeshes = [];
    SAMPLES_DATA.forEach(sample => {
      const targetMesh = createSampleTargetMesh(sample.type);
      targetMesh.position.copy(sample.pos);
      targetMesh.userData.id = sample.id;
      scene.add(targetMesh);
      sampleSiteMeshes.push(targetMesh);
    });

    // 7. Base Habitat / Extraction Ascent Module (at Z = -180)
    const habGroup = new THREE.Group();
    habGroup.position.set(0, 0, -180);

    const habGeom = new THREE.CylinderGeometry(8, 9, 7, 24);
    const habMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.4, roughness: 0.3 });
    const hab = new THREE.Mesh(habGeom, habMat);
    hab.position.y = 3.5;
    habGroup.add(hab);

    const beaconLight = new THREE.PointLight(0x10b981, 3.0, 40);
    beaconLight.position.set(0, 8, 0);
    habGroup.add(beaconLight);
    scene.add(habGroup);

    // 8. Mars Rover Model
    const roverMesh = createMarsRoverModel();
    scene.add(roverMesh);

    // 9. Laser Scanning Beam (from rover robotic arm to rock)
    const laserGeom = new THREE.CylinderGeometry(0.04, 0.04, 3, 8);
    const laserMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0 });
    const scanLaser = new THREE.Mesh(laserGeom, laserMat);
    scene.add(scanLaser);

    // 10. Event Listeners
    const onKeyDown = (e) => {
      if (simRef.current.keys.hasOwnProperty(e.code)) simRef.current.keys[e.code] = true;
      if (e.code === 'KeyE') {
        // Trigger Sample Collection Drill!
        handleCollectSample();
      }
      if (e.code === 'Escape') {
        simRef.current.isPaused = !simRef.current.isPaused;
        setHudState(prev => ({ ...prev, isPaused: simRef.current.isPaused }));
      }
    };
    const onKeyUp = (e) => {
      if (simRef.current.keys.hasOwnProperty(e.code)) simRef.current.keys[e.code] = false;
    };

    // Mouse drag camera controls
    const onMouseDown = (e) => {
      simRef.current.mouse.isDragging = true;
      simRef.current.mouse.prevX = e.clientX;
      simRef.current.mouse.prevY = e.clientY;
    };
    const onMouseMove = (e) => {
      if (!simRef.current.mouse.isDragging) return;
      const dx = e.clientX - simRef.current.mouse.prevX;
      const dy = e.clientY - simRef.current.mouse.prevY;
      simRef.current.camYaw -= dx * 0.006;
      simRef.current.camPitch = Math.max(0.1, Math.min(1.2, simRef.current.camPitch + dy * 0.006));
      simRef.current.mouse.prevX = e.clientX;
      simRef.current.mouse.prevY = e.clientY;
    };
    const onMouseUp = () => {
      simRef.current.mouse.isDragging = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Sample Collection Function
    const handleCollectSample = () => {
      const sim = simRef.current;
      if (!sim.nearSample || sim.isScanning) return;

      const target = SAMPLES_DATA.find(s => s.id === sim.nearSample);
      if (!target || sim.samplesCollected.includes(target.id)) return;

      sim.isScanning = true;
      sound.playScan();

      // Show laser scan beam
      scanLaser.position.copy(sim.position).add(new THREE.Vector3(0, 1.2, 0));
      scanLaser.lookAt(target.pos);
      scanLaser.rotateX(Math.PI / 2);
      laserMat.opacity = 0.9;

      setTimeout(() => {
        laserMat.opacity = 0;
        sim.isScanning = false;
        sim.samplesCollected.push(target.id);
        setCollectedSamples(prev => [...prev, target]);

        // Hide beacon
        const mesh = sampleSiteMeshes.find(m => m.userData.id === target.id);
        if (mesh) mesh.visible = false;

        sound.playToggle(true);

        // Check if all 4 samples collected
        if (sim.samplesCollected.length >= SAMPLES_DATA.length) {
          // All samples collected -> Return to Habitat!
          setActivePrompt('ALL SAMPLES SECURED! RETURN TO ASCENT HABITAT MODULE');
        }
      }, 1500);
    };

    // 11. Rover Simulation Loop
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

      // Rover Driving Controls
      const isDriving = (sim.keys.KeyW || sim.keys.KeyS) && sim.battery > 0;
      let targetSpeed = 0;
      if (sim.keys.KeyW && sim.battery > 0) targetSpeed = 12.0;
      if (sim.keys.KeyS && sim.battery > 0) targetSpeed = -6.0;

      // Acceleration / Deceleration
      sim.speed = THREE.MathUtils.lerp(sim.speed, targetSpeed, 3 * delta);

      // Steering
      if (sim.keys.KeyA && Math.abs(sim.speed) > 0.5) {
        sim.heading += 2.0 * delta * (sim.speed > 0 ? 1 : -1);
      }
      if (sim.keys.KeyD && Math.abs(sim.speed) > 0.5) {
        sim.heading -= 2.0 * delta * (sim.speed > 0 ? 1 : -1);
      }

      // Battery drain while driving, slow solar trickle charge when parked
      if (isDriving) {
        sim.battery = Math.max(0, sim.battery - 2.5 * delta);
      } else {
        sim.battery = Math.min(100, sim.battery + 0.8 * delta);
      }

      // Movement vector
      const moveX = Math.sin(sim.heading) * sim.speed * delta;
      const moveZ = Math.cos(sim.heading) * sim.speed * delta;
      sim.position.x += moveX;
      sim.position.z -= moveZ;

      // Position rover on terrain
      roverMesh.position.copy(sim.position);
      roverMesh.rotation.y = sim.heading;

      // Rotate wheels as rover drives
      sim.wheelRot += sim.speed * 2.5 * delta;
      if (roverMesh.userData.wheelMeshes) {
        roverMesh.userData.wheelMeshes.forEach(w => (w.rotation.x = sim.wheelRot));
      }

      // Third-Person Orbit Camera
      const camX = sim.position.x + Math.sin(sim.camYaw) * Math.cos(sim.camPitch) * sim.camDistance;
      const camY = sim.position.y + Math.sin(sim.camPitch) * sim.camDistance + 1.5;
      const camZ = sim.position.z + Math.cos(sim.camYaw) * Math.cos(sim.camPitch) * sim.camDistance;

      camera.position.lerp(new THREE.Vector3(camX, camY, camZ), 10 * delta);
      camera.lookAt(sim.position.x, sim.position.y + 1.2, sim.position.z);

      // Check Proximity to Scientific Samples
      let closestSample = null;
      let closestDist = 999;

      SAMPLES_DATA.forEach(sample => {
        if (!sim.samplesCollected.includes(sample.id)) {
          const dist = sim.position.distanceTo(sample.pos);
          if (dist < closestDist) {
            closestDist = dist;
          }
          if (dist < 6.0) {
            closestSample = sample;
          }
        }
      });

      if (closestSample) {
        sim.nearSample = closestSample.id;
        setActivePrompt(`[E] DEPLOY DRILL & ANALYZE: ${closestSample.name}`);
      } else {
        sim.nearSample = null;
        if (sim.samplesCollected.length < SAMPLES_DATA.length) {
          setActivePrompt(null);
        }
      }

      // Check Proximity to Final Base Habitat
      const distToHab = sim.position.distanceTo(habGroup.position);
      if (sim.samplesCollected.length >= SAMPLES_DATA.length && distToHab < 12.0) {
        // Mission Victory!
        sim.isVictory = true;
        sound.playFanfare();
        setHudState(prev => ({
          ...prev,
          isVictory: true,
          gameStats: {
            'SURFACE EXPLORATION TIME': `${Math.round(sim.elapsedTime)} SECONDS`,
            'SAMPLES SECURED': '4 OF 4 GEOLOGICAL CORES',
            'ROVER BATTERY REMAINING': `${Math.round(sim.battery)}%`,
            'DISCOVERIES': 'SEDIMENT, BASALT, PERMAFROST, METEORITE'
          }
        }));
      }

      setHudState(prev => ({
        ...prev,
        health: sim.health,
        fuel: sim.battery,
        speed: Math.abs(sim.speed),
        objectiveProgress: `${sim.samplesCollected.length} / 4 SAMPLES`,
        distance: sim.samplesCollected.length >= SAMPLES_DATA.length ? distToHab : closestDist,
        warning: sim.battery < 15 ? 'BATTERY CRITICALLY LOW // PARK IN SUN TO CHARGE' : null
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
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  const handleRestart = () => {
    simRef.current.position.set(0, 0, 0);
    simRef.current.speed = 0;
    simRef.current.heading = 0;
    simRef.current.battery = 100;
    simRef.current.samplesCollected = [];
    simRef.current.isPaused = false;
    simRef.current.isGameOver = false;
    simRef.current.isVictory = false;
    simRef.current.elapsedTime = 0;
    setCollectedSamples([]);

    setHudState({
      health: 100,
      maxHealth: 100,
      battery: 100,
      speed: 0,
      objective: 'EXPLORE MARS // COLLECT 4 GEOLOGICAL SAMPLES',
      objectiveProgress: '0 / 4 SAMPLES',
      distance: 50,
      warning: null,
      isPaused: false,
      isGameOver: false,
      isVictory: false,
      gameStats: null
    });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-space-950 font-sans select-none">
      <div ref={mountRef} className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing" />

      {/* Action / Interact Prompt (E key) */}
      {activePrompt && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 bg-amber-950/90 border border-amber-400 px-5 py-2.5 rounded-full text-xs font-mono font-bold text-amber-200 flex items-center gap-2 shadow-[0_0_25px_rgba(245,158,11,0.5)] animate-pulse">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{activePrompt}</span>
        </div>
      )}

      {/* Discovered Samples Tray (Bottom Right) */}
      {collectedSamples.length > 0 && (
        <div className="absolute bottom-6 right-6 z-30 bg-slate-950/85 backdrop-blur-md p-3.5 rounded-xl border border-sky-500/30 max-w-xs space-y-2 pointer-events-none">
          <div className="text-[10px] font-mono text-sky-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>SAMPLE LOG ({collectedSamples.length}/4)</span>
          </div>
          <div className="space-y-1.5">
            {collectedSamples.map(s => (
              <div key={s.id} className="bg-slate-900/80 p-2 rounded border border-emerald-500/20 text-xs">
                <div className="font-orbitron font-bold text-emerald-300 text-[11px] flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>{s.name}</span>
                </div>
                <div className="text-[10px] text-slate-300 font-sans mt-0.5">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <GameHUD
        health={100}
        maxHealth={100}
        fuel={hudState.battery}
        maxFuel={100}
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
        onNextLevel={() => onCompleteRoverExp({ samples: collectedSamples })}
        gameStats={hudState.gameStats}
        isMuted={isMuted}
        onToggleMute={onToggleMute}
        controlsHint="[W/S] DRIVE  [A/D] STEER  [MOUSE DRAG] CAMERA  [E] SAMPLE DRILL"
      />
    </div>
  );
}


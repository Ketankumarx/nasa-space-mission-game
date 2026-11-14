// 3D Interactive Destination Planet Selector (Project Orbital)
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  createMoonTexture,
  createMarsTexture,
  createEuropaTexture,
  createAsteroidTexture
} from '../../utils/textureGenerator';
import { createCosmicEnvironment } from '../../utils/spaceEnvironment';
import { sound } from '../../utils/soundEngine';
import { ArrowLeft, ArrowRight, Sun, DollarSign, Award, Compass, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export const PLANETS_CATALOG = [
  {
    id: 'lunar',
    name: 'THE MOON (LUNA)',
    tagline: 'Polar Ice Mapping & Cis-Lunar Orbit',
    distanceKm: 384400,
    solarFlux: 1.0,
    budget: 450,
    sciencePotential: 600,
    radius: 3.6,
    color: '#94a3b8',
    glowColor: 0x94a3b8,
    textureType: 'moon',
    primaryTargets: ['Crater Shackleton', 'Far-side Basin', 'Polar Regolith Ice']
  },
  {
    id: 'mars',
    name: 'MARS (ARES)',
    tagline: 'Interplanetary Atmospheric & Subsurface Survey',
    distanceKm: 225000000,
    solarFlux: 0.43,
    budget: 780,
    sciencePotential: 1200,
    radius: 4.2,
    color: '#ea580c',
    glowColor: 0xf97316,
    textureType: 'mars',
    primaryTargets: ['Olympus Mons', 'Valles Marineris', 'Polar Cap Aquifers']
  },
  {
    id: 'europa',
    name: 'EUROPA (JOVIAN OCEAN MOON)',
    tagline: 'Deep Space Subsurface Ocean Discovery',
    distanceKm: 628000000,
    solarFlux: 0.04,
    budget: 920,
    sciencePotential: 1800,
    radius: 3.8,
    color: '#38bdf8',
    glowColor: 0x0284c7,
    textureType: 'europa',
    primaryTargets: ['Chaos Terrains', 'Hydrothermal Plumes', 'Ice Crust Fractures']
  },
  {
    id: 'asteroid',
    name: 'ASTEROID PSYCHE',
    tagline: 'Primordial Metallic Core Characterization',
    distanceKm: 140000000,
    solarFlux: 0.35,
    budget: 620,
    sciencePotential: 1500,
    radius: 3.2,
    color: '#a3a3a3',
    glowColor: 0x737373,
    textureType: 'asteroid',
    primaryTargets: ['Nickel-Iron Regolith', 'Impact Basins', 'Magnetic Residuals']
  }
];

export default function PlanetSelectScene({
  selectedPlanetId,
  onSelectPlanet,
  onConfirmDestination,
  onBackToMenu
}) {
  const mountRef = useRef(null);
  const planetMeshesRef = useRef({});
  const activePlanetGroupRef = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(() => {
    const idx = PLANETS_CATALOG.findIndex(p => p.id === selectedPlanetId);
    return idx >= 0 ? idx : 1; // Default to Mars
  });

  const currentPlanet = PLANETS_CATALOG[currentIndex];

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x02040a);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      2000
    );
    camera.position.set(0, 2, 14);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 2. Cosmic Nebula Background & Multi-Spectral Starfield
    createCosmicEnvironment(scene, { type: 'purple', radius: 1400, starCount: 2500 });

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0x0f172a, 1.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff7ed, 3.5);
    sunLight.position.set(30, 20, 25);
    scene.add(sunLight);

    // 4. Planet Meshes Group
    const planetGroup = new THREE.Group();
    scene.add(planetGroup);
    activePlanetGroupRef.current = planetGroup;

    // Create 3D Meshes for all 4 planets
    const textures = {
      moon: createMoonTexture(),
      mars: createMarsTexture(),
      europa: createEuropaTexture(),
      asteroid: createAsteroidTexture()
    };

    PLANETS_CATALOG.forEach((p, idx) => {
      let mesh;
      if (p.textureType === 'asteroid') {
        const geom = new THREE.DodecahedronGeometry(p.radius, 2);
        mesh = new THREE.Mesh(geom, new THREE.MeshStandardMaterial({ map: textures.asteroid, roughness: 0.9 }));
      } else {
        const geom = new THREE.SphereGeometry(p.radius, 64, 64);
        mesh = new THREE.Mesh(geom, new THREE.MeshStandardMaterial({ map: textures[p.textureType], roughness: 0.7 }));

        // Atmospheric rim glow if Mars or Europa
        if (p.id === 'mars') {
          const atmo = new THREE.Mesh(
            new THREE.SphereGeometry(p.radius + 0.12, 48, 48),
            new THREE.MeshBasicMaterial({ color: 0xf97316, transparent: true, opacity: 0.12, side: THREE.BackSide })
          );
          mesh.add(atmo);
        } else if (p.id === 'europa') {
          const atmo = new THREE.Mesh(
            new THREE.SphereGeometry(p.radius + 0.12, 48, 48),
            new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.15, side: THREE.BackSide })
          );
          mesh.add(atmo);
        }
      }

      // Orbital Latitude-Longitude Scan Grid
      const grid = new THREE.Mesh(
        new THREE.SphereGeometry(p.radius + 0.04, 16, 12),
        new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true, transparent: true, opacity: 0.12 })
      );
      mesh.add(grid);

      // Positioning in carousel or focus
      mesh.visible = idx === currentIndex;
      planetGroup.add(mesh);
      planetMeshesRef.current[p.id] = mesh;
    });

    // 5. Animation Loop
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Rotate currently visible planet
      const currentMesh = planetMeshesRef.current[currentPlanet.id];
      if (currentMesh) {
        currentMesh.rotation.y += delta * 0.08;
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
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update visible 3D planet when currentIndex changes
  useEffect(() => {
    Object.entries(planetMeshesRef.current).forEach(([id, mesh]) => {
      mesh.visible = id === currentPlanet.id;
      if (id === currentPlanet.id) {
        mesh.rotation.y = 0;
      }
    });
    if (onSelectPlanet) onSelectPlanet(currentPlanet.id);
  }, [currentIndex, currentPlanet]);

  const handleNextPlanet = () => {
    sound.playToggle(true);
    setCurrentIndex(prev => (prev + 1) % PLANETS_CATALOG.length);
  };

  const handlePrevPlanet = () => {
    sound.playToggle(false);
    setCurrentIndex(prev => (prev - 1 + PLANETS_CATALOG.length) % PLANETS_CATALOG.length);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-space-950 font-sans select-none">
      {/* 3D Planet Viewport */}
      <div ref={mountRef} className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing" />

      {/* Top Header */}
      <header className="absolute top-0 left-0 right-0 z-20 p-5 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <button
            onClick={() => {
              sound.playClick();
              onBackToMenu();
            }}
            className="hud-panel p-2.5 rounded-lg border border-sky-500/30 text-slate-300 hover:text-white transition-colors flex items-center gap-2 text-xs font-mono"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>MAIN MENU</span>
          </button>
          <div>
            <div className="font-mono text-[10px] text-sky-400 uppercase tracking-widest flex items-center gap-2">
              <span>EXPLORATION DOSSIER // ORBITAL TELESCOPE VIEW</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <h1 className="font-orbitron font-extrabold text-xl sm:text-2xl text-white">
              SELECT MISSION DESTINATION
            </h1>
          </div>
        </div>

        {/* Planet Carousel Navigation Buttons */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={handlePrevPlanet}
            className="hud-panel p-2.5 rounded-lg border border-sky-500/30 text-sky-300 hover:text-white hover:border-sky-400 transition-colors"
            title="Previous Planet"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-mono text-xs text-slate-400 px-2">
            {currentIndex + 1} / {PLANETS_CATALOG.length}
          </span>
          <button
            onClick={handleNextPlanet}
            className="hud-panel p-2.5 rounded-lg border border-sky-500/30 text-sky-300 hover:text-white hover:border-sky-400 transition-colors"
            title="Next Planet"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Target Planet Info Card (Bottom-Left) */}
      <div className="absolute bottom-6 left-6 z-20 pointer-events-none max-w-md w-full">
        <div className="hud-panel p-5 rounded-2xl border border-sky-500/40 space-y-3.5 hud-bracket shadow-[0_0_30px_rgba(56,189,248,0.2)]">
          <div>
            <div className="font-mono text-[10px] text-sky-400 uppercase tracking-wider font-bold mb-1">
              TARGET CELESTIAL BODY
            </div>
            <h2 className="font-orbitron font-black text-2xl sm:text-3xl text-white tracking-wide">
              {currentPlanet.name}
            </h2>
            <div className="font-mono text-xs text-sky-200 mt-1">
              {currentPlanet.tagline}
            </div>
          </div>

          {/* Visual Engineering Metric Gauges */}
          <div className="grid grid-cols-3 gap-2 font-mono text-xs">
            {/* Distance */}
            <div className="bg-slate-950/70 p-2.5 rounded-lg border border-sky-500/20">
              <span className="text-slate-400 text-[9px] block uppercase flex items-center gap-1">
                <Compass className="w-3 h-3 text-sky-400" /> DISTANCE
              </span>
              <span className="font-orbitron font-bold text-white text-sm">
                {(currentPlanet.distanceKm / 1e6).toFixed(1)}M <span className="text-[9px] font-normal text-slate-400">KM</span>
              </span>
            </div>

            {/* Solar Irradiance */}
            <div className="bg-slate-950/70 p-2.5 rounded-lg border border-sky-500/20">
              <span className="text-slate-400 text-[9px] block uppercase flex items-center gap-1">
                <Sun className="w-3 h-3 text-yellow-400" /> SOLAR FLUX
              </span>
              <span className="font-orbitron font-bold text-yellow-300 text-sm">
                {Math.round(currentPlanet.solarFlux * 100)}%
              </span>
            </div>

            {/* Allocated Budget */}
            <div className="bg-slate-950/70 p-2.5 rounded-lg border border-sky-500/20">
              <span className="text-slate-400 text-[9px] block uppercase flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-emerald-400" /> BUDGET
              </span>
              <span className="font-orbitron font-bold text-emerald-400 text-sm">
                ${currentPlanet.budget}M
              </span>
            </div>
          </div>

          {/* Primary Recon Targets */}
          <div className="pt-2 border-t border-sky-500/20">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5 font-bold">
              PRIMARY SCIENTIFIC RECON TARGETS:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {currentPlanet.primaryTargets.map((target, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-sky-950/70 border border-sky-500/30 text-sky-300 font-mono text-[10px] flex items-center gap-1"
                >
                  <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                  <span>{target}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Select Destination Button (Bottom-Right) */}
      <div className="absolute bottom-6 right-6 z-20 pointer-events-auto">
        <button
          onClick={() => {
            sound.playClick();
            onConfirmDestination(currentPlanet);
          }}
          className="btn-aerospace py-4 px-8 rounded-xl text-xs sm:text-sm font-orbitron font-bold flex items-center gap-3 shadow-[0_0_30px_rgba(56,189,248,0.45)]"
        >
          <span>CHOOSE TARGET & CONFIGURE CRAFT</span>
          <ArrowRight className="w-4 h-4 text-sky-300" />
        </button>
      </div>
    </div>
  );
}


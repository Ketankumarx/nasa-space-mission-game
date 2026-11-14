// 3D Science Operations Scene for Screen J (Project Orbital)
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createMoonTexture, createMarsTexture, createAsteroidTexture } from '../../utils/textureGenerator';
import { buildSpacecraftGroup } from '../../utils/spacecraftBuilder';

export default function ScienceOperationsScene({
  activeMission,
  selectedComponentIds,
  activeScanEffect // null, 'camera', 'spectrometer', 'radar', 'radiation'
}) {
  const mountRef = useRef(null);
  const pulseGroupRef = useRef(null);
  const scanBeamRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 4, 16);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    // 2. Starfield
    const starGeom = new THREE.BufferGeometry();
    const starPositions = new Float32Array(1500 * 3);
    for (let i = 0; i < 1500 * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 600;
      starPositions[i + 1] = (Math.random() - 0.5) * 600;
      starPositions[i + 2] = (Math.random() - 0.5) * 600;
    }
    starGeom.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    scene.add(new THREE.Points(starGeom, new THREE.PointsMaterial({ size: 1.2, color: 0xffffff, transparent: true, opacity: 0.7 })));

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0x0f172a, 1.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff8eb, 3.2);
    sunLight.position.set(40, 15, 30);
    scene.add(sunLight);

    // 4. Destination Planet Mesh
    const planetRadius = 5.2;
    let planetMesh;

    if (activeMission?.id === 'lunar') {
      const geom = new THREE.SphereGeometry(planetRadius, 64, 64);
      const mat = new THREE.MeshStandardMaterial({ map: createMoonTexture(), roughness: 0.8 });
      planetMesh = new THREE.Mesh(geom, mat);
    } else if (activeMission?.id === 'mars') {
      const geom = new THREE.SphereGeometry(planetRadius, 64, 64);
      const mat = new THREE.MeshStandardMaterial({ map: createMarsTexture(), roughness: 0.7 });
      planetMesh = new THREE.Mesh(geom, mat);

      // Mars Atmosphere Haze
      const atmoGeom = new THREE.SphereGeometry(planetRadius + 0.15, 64, 64);
      const atmoMat = new THREE.MeshBasicMaterial({ color: 0xf97316, transparent: true, opacity: 0.12, side: THREE.BackSide });
      planetMesh.add(new THREE.Mesh(atmoGeom, atmoMat));
    } else {
      // Asteroid
      const geom = new THREE.DodecahedronGeometry(planetRadius, 2);
      const mat = new THREE.MeshStandardMaterial({ map: createAsteroidTexture(), roughness: 0.9 });
      planetMesh = new THREE.Mesh(geom, mat);
    }

    planetMesh.position.set(0, -1.8, 0);
    scene.add(planetMesh);

    // Planetary Scanning Reticle Grid (Equatorial / Polar Lat-Long lines)
    const gridMesh = new THREE.Mesh(
      new THREE.SphereGeometry(planetRadius + 0.05, 16, 12),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true, transparent: true, opacity: 0.15 })
    );
    planetMesh.add(gridMesh);

    // 5. Spacecraft in Close Orbit
    const orbitRadius = 8.5;
    const craftGroup = buildSpacecraftGroup(selectedComponentIds || []);
    craftGroup.scale.set(0.24, 0.24, 0.24);
    scene.add(craftGroup);

    // 6. Science Beam & Pulse Effect Group
    const pulseGroup = new THREE.Group();
    scene.add(pulseGroup);
    pulseGroupRef.current = pulseGroup;

    // Conical Sensor Ray from craft to planetary surface
    const beamGeom = new THREE.ConeGeometry(1.6, 3.5, 16, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
    });
    const scanBeam = new THREE.Mesh(beamGeom, beamMat);
    scanBeam.rotation.x = Math.PI;
    scene.add(scanBeam);
    scanBeamRef.current = scanBeam;

    // Animation Loop
    let animId;
    let orbitAngle = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Slow planetary spin
      planetMesh.rotation.y += delta * 0.06;

      // Spacecraft orbital trajectory
      orbitAngle += delta * 0.25;
      const craftX = Math.cos(orbitAngle) * orbitRadius;
      const craftZ = Math.sin(orbitAngle) * orbitRadius * 0.7;
      const craftY = 2.2 + Math.sin(orbitAngle * 1.5) * 0.8;

      craftGroup.position.set(craftX, craftY, craftZ);
      craftGroup.lookAt(0, -1.8, 0); // Always point instruments down at planet!

      // Update Active Instrument Scanning Effect
      if (activeScanEffect && scanBeamRef.current) {
        scanBeam.position.set(craftX, craftY - 1.6, craftZ);
        scanBeam.lookAt(0, -1.8, 0);
        scanBeam.rotateX(Math.PI / 2);

        if (activeScanEffect === 'camera') {
          // Camera optical snapshot strobe
          beamMat.color.setHex(0xffffff);
          beamMat.opacity = Math.sin(elapsed * 20) > 0 ? 0.7 : 0.05;
        } else if (activeScanEffect === 'spectrometer') {
          // Spectral laser scan (cycling rainbow / purple)
          beamMat.color.setHSL((elapsed * 0.8) % 1, 1.0, 0.6);
          beamMat.opacity = 0.5 + Math.sin(elapsed * 8) * 0.3;
        } else if (activeScanEffect === 'radar') {
          // Radar pulse waves
          beamMat.color.setHex(0x10b981);
          beamMat.opacity = (Math.sin(elapsed * 6) + 1) * 0.3;
        } else if (activeScanEffect === 'radiation') {
          // Radiation detector field
          beamMat.color.setHex(0xef4444);
          beamMat.opacity = 0.4 + Math.sin(elapsed * 12) * 0.2;
        }
      } else if (scanBeamRef.current) {
        scanBeam.material.opacity = 0;
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
  }, [activeMission, selectedComponentIds, activeScanEffect]);

  return <div ref={mountRef} className="w-full h-full absolute inset-0" />;
}


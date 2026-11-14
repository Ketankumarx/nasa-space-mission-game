// Interactive 3D Spacecraft Assembly Preview for Screen D (Designer)
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { buildSpacecraftGroup } from '../../utils/spacecraftBuilder';
import { RotateCw, Eye, Maximize2, RefreshCw } from 'lucide-react';

export default function SpacecraftViewer({ selectedComponentIds }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const craftRef = useRef(null);
  const cameraRef = useRef(null);

  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(4, 3, 7);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Starfield particles in the background
    const starGeom = new THREE.BufferGeometry();
    const starCoords = new Float32Array(800 * 3);
    for (let i = 0; i < 800 * 3; i += 3) {
      starCoords[i] = (Math.random() - 0.5) * 100;
      starCoords[i + 1] = (Math.random() - 0.5) * 100;
      starCoords[i + 2] = (Math.random() - 0.5) * 100;
    }
    starGeom.setAttribute('position', new THREE.BufferAttribute(starCoords, 3));
    const starMat = new THREE.PointsMaterial({ size: 1.0, color: 0x94a3b8, transparent: true, opacity: 0.6 });
    scene.add(new THREE.Points(starGeom, starMat));

    // Studio / Cleanroom Aerospace Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 3.5);
    keyLight.position.set(6, 8, 7);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.8);
    fillLight.position.set(-6, -2, -5);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x0ea5e9, 2.5, 20);
    rimLight.position.set(0, 5, -4);
    scene.add(rimLight);

    // Tech Grid floor
    const gridHelper = new THREE.GridHelper(12, 16, 0x0284c7, 0x0f2744);
    gridHelper.position.y = -2.6;
    scene.add(gridHelper);

    // Initial Spacecraft Assembly
    const craftGroup = buildSpacecraftGroup(selectedComponentIds, { wireframe });
    scene.add(craftGroup);
    craftRef.current = craftGroup;

    // Mouse Drag Controls
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e) => {
      if (!isDragging || !craftRef.current) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;

      craftRef.current.rotation.y += deltaX * 0.01;
      craftRef.current.rotation.x += deltaY * 0.01;

      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    // Zoom via Wheel
    const onWheel = (e) => {
      e.preventDefault();
      if (!cameraRef.current) return;
      cameraRef.current.position.z = Math.max(3.5, Math.min(12, cameraRef.current.position.z + e.deltaY * 0.005));
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('wheel', onWheel, { passive: false });

    // Touch support for mobile/trackpad
    let prevTouchX = 0;
    let prevTouchY = 0;
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevTouchX = e.touches[0].clientX;
        prevTouchY = e.touches[0].clientY;
      }
    };
    const onTouchMove = (e) => {
      if (!isDragging || !craftRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevTouchX;
      const deltaY = e.touches[0].clientY - prevTouchY;
      craftRef.current.rotation.y += deltaX * 0.01;
      craftRef.current.rotation.x += deltaY * 0.01;
      prevTouchX = e.touches[0].clientX;
      prevTouchY = e.touches[0].clientY;
    };
    const onTouchEnd = () => {
      isDragging = false;
    };
    dom.addEventListener('touchstart', onTouchStart, { passive: true });
    dom.addEventListener('touchmove', onTouchMove, { passive: true });
    dom.addEventListener('touchend', onTouchEnd, { passive: true });

    // Render Loop
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (autoRotate && craftRef.current && !isDragging) {
        craftRef.current.rotation.y += 0.005;
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
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('wheel', onWheel);
      dom.removeEventListener('touchstart', onTouchStart);
      dom.removeEventListener('touchmove', onTouchMove);
      dom.removeEventListener('touchend', onTouchEnd);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update 3D mesh when selected components or wireframe state changes
  useEffect(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;

    // Remove existing craft group
    if (craftRef.current) {
      scene.remove(craftRef.current);
    }

    // Build newly assembled craft
    const newCraft = buildSpacecraftGroup(selectedComponentIds, { wireframe });
    scene.add(newCraft);
    craftRef.current = newCraft;
  }, [selectedComponentIds, wireframe]);

  const handleResetView = () => {
    if (craftRef.current) {
      craftRef.current.rotation.set(0, 0, 0);
    }
    if (cameraRef.current) {
      cameraRef.current.position.set(4, 3, 7);
      cameraRef.current.lookAt(0, 0, 0);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[380px] rounded-lg overflow-hidden bg-space-950 border border-sky-500/20 hud-bracket">
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Aerospace Reticle HUD Overlays */}
      <div className="absolute top-3 left-3 pointer-events-none flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-mono text-xs text-sky-400 font-semibold tracking-wider">3D ASSEMBLY CAD PREVIEW</span>
        </div>
        <span className="font-mono text-[10px] text-slate-400">HARDPOINT STATUS: ACTIVE // SCALE 1:1</span>
      </div>

      {/* Floating CAD View Controls */}
      <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md p-1.5 rounded-md border border-sky-500/30">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`p-2 rounded text-xs flex items-center gap-1.5 transition-colors ${
            autoRotate ? 'bg-sky-500/30 text-sky-200 border border-sky-400/40' : 'text-slate-400 hover:text-white'
          }`}
          title="Toggle Auto Rotation"
        >
          <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
          <span className="font-mono text-[10px]">ROT</span>
        </button>

        <button
          onClick={() => setWireframe(!wireframe)}
          className={`p-2 rounded text-xs flex items-center gap-1.5 transition-colors ${
            wireframe ? 'bg-sky-500/30 text-sky-200 border border-sky-400/40' : 'text-slate-400 hover:text-white'
          }`}
          title="Toggle Wireframe Structural Analysis"
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="font-mono text-[10px]">WIRE</span>
        </button>

        <button
          onClick={handleResetView}
          className="p-2 rounded text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Reset Camera Orientation"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* CAD Center Crosshair */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-25">
        <div className="w-8 h-[1px] bg-sky-400" />
        <div className="h-8 w-[1px] bg-sky-400 absolute" />
      </div>
    </div>
  );
}


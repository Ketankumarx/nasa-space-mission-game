// Cinematic Earth Orbit Scene for Main Menu & Backgrounds
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createEarthTexture, createCloudTexture } from '../../utils/textureGenerator';
import { buildSpacecraftGroup } from '../../utils/spacecraftBuilder';
import { createCosmicEnvironment } from '../../utils/spaceEnvironment';

export default function EarthOrbitScene({ interactive = false }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 4, 18);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // Cosmic Nebula & Starfield
    createCosmicEnvironment(scene, { type: 'carina', radius: 450, starCount: 1800 });

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x111c33, 1.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff8eb, 3.2);
    sunLight.position.set(40, 15, 25);
    scene.add(sunLight);

    // Earth Sphere
    const earthRadius = 6.0;
    const earthGeom = new THREE.SphereGeometry(earthRadius, 64, 64);
    const earthTexture = createEarthTexture();
    const earthMat = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.65,
      metalness: 0.1
    });
    const earth = new THREE.Mesh(earthGeom, earthMat);
    earth.position.set(0, -1.5, 0);
    scene.add(earth);

    // Cloud Layer
    const cloudGeom = new THREE.SphereGeometry(earthRadius + 0.08, 64, 64);
    const cloudTexture = createCloudTexture();
    const cloudMat = new THREE.MeshStandardMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    const clouds = new THREE.Mesh(cloudGeom, cloudMat);
    earth.add(clouds);

    // Atmosphere Glow Rim (Fresnel Backing)
    const atmoGeom = new THREE.SphereGeometry(earthRadius + 0.28, 64, 64);
    const atmoMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.8);
          gl_FragColor = vec4(0.22, 0.74, 0.97, 1.0) * intensity * 1.6;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });
    const atmosphere = new THREE.Mesh(atmoGeom, atmoMat);
    earth.add(atmosphere);

    // Orbit Ring
    const orbitRadius = 9.5;
    const orbitGeom = new THREE.RingGeometry(orbitRadius - 0.02, orbitRadius + 0.02, 128);
    const orbitMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide
    });
    const orbitRing = new THREE.Mesh(orbitGeom, orbitMat);
    orbitRing.rotation.x = Math.PI / 2.3;
    orbitRing.position.set(0, -1.5, 0);
    scene.add(orbitRing);

    // Orbiting Spacecraft
    const defaultCraftComponents = ['prop_chemical', 'pwr_standard_solar', 'comm_highgain', 'inst_camera', 'nav_star_tracker'];
    const craftGroup = buildSpacecraftGroup(defaultCraftComponents);
    craftGroup.scale.set(0.22, 0.22, 0.22);
    scene.add(craftGroup);

    // Mouse Interaction if enabled
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    // Animation Loop
    let animId;
    let orbitAngle = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Earth rotation
      earth.rotation.y += delta * 0.05;
      clouds.rotation.y += delta * 0.07;

      // Orbit motion of spacecraft
      orbitAngle += delta * 0.35;
      const x = Math.cos(orbitAngle) * orbitRadius;
      const z = Math.sin(orbitAngle) * orbitRadius * Math.cos(Math.PI / 2.3);
      const y = -1.5 + Math.sin(orbitAngle) * orbitRadius * Math.sin(Math.PI / 2.3);

      craftGroup.position.set(x, y, z);
      craftGroup.rotation.y = orbitAngle + Math.PI / 2;
      craftGroup.rotation.z = Math.sin(elapsed * 0.5) * 0.1;

      // Subtle camera parallax
      if (interactive) {
        camera.position.x += (mouseX * 2.5 - camera.position.x) * 0.05;
        camera.position.y += (4 - mouseY * 1.5 - camera.position.y) * 0.05;
      } else {
        camera.position.x = Math.sin(elapsed * 0.08) * 1.5;
        camera.position.y = 4 + Math.cos(elapsed * 0.1) * 0.6;
      }
      camera.lookAt(0, -1, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (interactive) window.removeEventListener('mousemove', handleMouseMove);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [interactive]);

  return <div ref={mountRef} className="w-full h-full absolute inset-0 pointer-events-auto" />;
}


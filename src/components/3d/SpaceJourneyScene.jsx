// 3D Space Journey & Solar System Transfer Scene for Screen H & I
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createEarthTexture, createMoonTexture, createMarsTexture, createAsteroidTexture } from '../../utils/textureGenerator';
import { buildSpacecraftGroup } from '../../utils/spacecraftBuilder';

export default function SpaceJourneyScene({
  activeMission,
  selectedComponentIds,
  progressPct = 0, // 0 to 100
  cameraFocus = 'craft' // 'craft' or 'system'
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const craftRef = useRef(null);
  const cameraRef = useRef(null);
  const curveRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 25, 45);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 2. Starfield
    const starCount = 3000;
    const starGeom = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 800;
      starPositions[i + 1] = (Math.random() - 0.5) * 800;
      starPositions[i + 2] = (Math.random() - 0.5) * 800;
    }
    starGeom.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({ size: 1.2, color: 0xffffff, transparent: true, opacity: 0.8 });
    scene.add(new THREE.Points(starGeom, starMat));

    // 3. Central Sun (or primary reference)
    const isLunar = activeMission?.id === 'lunar';

    let sunMesh, sunLight;
    if (!isLunar) {
      // Heliocentric interplanetary transfer (Mars / Asteroid)
      const sunGeom = new THREE.SphereGeometry(3.5, 32, 32);
      const sunMat = new THREE.MeshBasicMaterial({ color: 0xffd700 });
      sunMesh = new THREE.Mesh(sunGeom, sunMat);
      sunMesh.position.set(0, 0, 0);
      scene.add(sunMesh);

      // Sun Corona Halo
      const coronaGeom = new THREE.SphereGeometry(4.2, 32, 32);
      const coronaMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.25 });
      const corona = new THREE.Mesh(coronaGeom, coronaMat);
      scene.add(corona);

      sunLight = new THREE.PointLight(0xfff5e6, 3.5, 300);
      sunLight.position.set(0, 0, 0);
      scene.add(sunLight);
    } else {
      // Earth-Moon system
      sunLight = new THREE.DirectionalLight(0xfff8eb, 2.5);
      sunLight.position.set(80, 20, 60);
      scene.add(sunLight);
    }

    const ambientLight = new THREE.AmbientLight(0x0f172a, 1.2);
    scene.add(ambientLight);

    // 4. Departure Body (Earth)
    const earthGeom = new THREE.SphereGeometry(isLunar ? 4.0 : 2.0, 32, 32);
    const earthMat = new THREE.MeshStandardMaterial({ map: createEarthTexture(), roughness: 0.7 });
    const earthMesh = new THREE.Mesh(earthGeom, earthMat);

    const earthOrigin = isLunar ? new THREE.Vector3(-14, 0, 0) : new THREE.Vector3(12, 0, 0);
    earthMesh.position.copy(earthOrigin);
    scene.add(earthMesh);

    // Earth Orbit Line (if heliocentric)
    if (!isLunar) {
      const earthOrbitGeom = new THREE.RingGeometry(11.95, 12.05, 96);
      const orbitMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.25, side: THREE.DoubleSide });
      const earthOrbit = new THREE.Mesh(earthOrbitGeom, orbitMat);
      earthOrbit.rotation.x = Math.PI / 2;
      scene.add(earthOrbit);
    }

    // 5. Target Destination Body
    let targetMesh;
    let targetDestPos;

    if (activeMission?.id === 'lunar') {
      // Moon
      const moonGeom = new THREE.SphereGeometry(1.6, 32, 32);
      const moonMat = new THREE.MeshStandardMaterial({ map: createMoonTexture(), roughness: 0.8 });
      targetMesh = new THREE.Mesh(moonGeom, moonMat);
      targetDestPos = new THREE.Vector3(14, 0, 0);
      targetMesh.position.copy(targetDestPos);
      scene.add(targetMesh);
    } else if (activeMission?.id === 'mars') {
      // Mars
      const marsGeom = new THREE.SphereGeometry(1.8, 32, 32);
      const marsMat = new THREE.MeshStandardMaterial({ map: createMarsTexture(), roughness: 0.7 });
      targetMesh = new THREE.Mesh(marsGeom, marsMat);
      targetDestPos = new THREE.Vector3(-22, 0, 10);
      targetMesh.position.copy(targetDestPos);
      scene.add(targetMesh);

      // Mars Orbit Ring
      const marsDist = Math.sqrt(22 * 22 + 10 * 10);
      const marsOrbitGeom = new THREE.RingGeometry(marsDist - 0.06, marsDist + 0.06, 96);
      const marsOrbit = new THREE.Mesh(marsOrbitGeom, new THREE.MeshBasicMaterial({ color: 0xf97316, transparent: true, opacity: 0.3, side: THREE.DoubleSide }));
      marsOrbit.rotation.x = Math.PI / 2;
      scene.add(marsOrbit);
    } else {
      // Asteroid
      const astGeom = new THREE.DodecahedronGeometry(1.2, 1);
      const astMat = new THREE.MeshStandardMaterial({ map: createAsteroidTexture(), roughness: 0.9 });
      targetMesh = new THREE.Mesh(astGeom, astMat);
      targetDestPos = new THREE.Vector3(-18, 0, -12);
      targetMesh.position.copy(targetDestPos);
      scene.add(targetMesh);

      const astDist = Math.sqrt(18 * 18 + 12 * 12);
      const astOrbitGeom = new THREE.RingGeometry(astDist - 0.06, astDist + 0.06, 96);
      const astOrbit = new THREE.Mesh(astOrbitGeom, new THREE.MeshBasicMaterial({ color: 0xa3a3a3, transparent: true, opacity: 0.3, side: THREE.DoubleSide }));
      astOrbit.rotation.x = Math.PI / 2;
      scene.add(astOrbit);
    }

    // 6. Hohmann Transfer Trajectory Spline Curve
    const midPoint = new THREE.Vector3(
      (earthOrigin.x + targetDestPos.x) / 2 + (isLunar ? 0 : 5),
      (isLunar ? 4 : 2),
      (earthOrigin.z + targetDestPos.z) / 2 + (isLunar ? 6 : -14)
    );

    const curve = new THREE.QuadraticBezierCurve3(
      earthOrigin,
      midPoint,
      targetDestPos
    );
    curveRef.current = curve;

    const points = curve.getPoints(64);
    const trajectoryGeom = new THREE.BufferGeometry().setFromPoints(points);
    const trajectoryMat = new THREE.LineDashedMaterial({
      color: 0x38bdf8,
      dashSize: 1.2,
      gapSize: 0.6,
      linewidth: 2,
      transparent: true,
      opacity: 0.8
    });
    const trajectoryLine = new THREE.Line(trajectoryGeom, trajectoryMat);
    trajectoryLine.computeLineDistances();
    scene.add(trajectoryLine);

    // 7. Spacecraft Model along Trajectory
    const craftGroup = buildSpacecraftGroup(selectedComponentIds || ['prop_chemical', 'pwr_standard_solar', 'comm_highgain']);
    craftGroup.scale.set(0.35, 0.35, 0.35);
    scene.add(craftGroup);
    craftRef.current = craftGroup;

    // 8. Animation & Parallax Loop
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Rotate celestial bodies
      earthMesh.rotation.y += delta * 0.1;
      if (targetMesh) targetMesh.rotation.y += delta * 0.08;

      // Update Craft position along transfer curve based on progressPct
      if (curveRef.current && craftRef.current) {
        const t = Math.max(0.01, Math.min(0.99, progressPct / 100));
        const craftPos = curveRef.current.getPoint(t);
        const tangent = curveRef.current.getTangent(t);

        craftRef.current.position.copy(craftPos);

        // Align craft orientation with transfer velocity vector
        const lookTarget = craftPos.clone().add(tangent);
        craftRef.current.lookAt(lookTarget);

        // Camera behavior
        if (cameraFocus === 'craft') {
          // Track alongside the spacecraft in cruise
          const camOffset = new THREE.Vector3(-4, 3, 7).applyEuler(craftRef.current.rotation);
          camera.position.lerp(craftPos.clone().add(camOffset), 0.05);
          camera.lookAt(craftPos);
        } else {
          // Macro orbital system view
          camera.position.lerp(new THREE.Vector3(0, 32, 48), 0.05);
          camera.lookAt(0, 0, 0);
        }
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
  }, [activeMission, selectedComponentIds, cameraFocus]);

  return <div ref={mountRef} className="w-full h-full absolute inset-0" />;
}


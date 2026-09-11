import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Scene02Scanning() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 5.8);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    // Soft lighting matching the references
    scene.add(new THREE.AmbientLight(0xffffff, 1.4));
    const pointLight1 = new THREE.PointLight(0xa855f7, 4, 12); // Soft Purple glow
    pointLight1.position.set(2, 2, 3);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x06b6d4, 3, 12); // Soft Cyan HUD glow
    pointLight2.position.set(-2, -2, 2);
    scene.add(pointLight2);

    // Holographic Prescription Document Plate
    const docGeo = new THREE.PlaneGeometry(2.2, 3.0);
    const docMat = new THREE.MeshPhysicalMaterial({
      color: 0xf3e8ff,
      roughness: 0.1,
      metalness: 0.2,
      transmission: 0.6,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide
    });
    const docMesh = new THREE.Mesh(docGeo, docMat);
    scene.add(docMesh);

    // Active Soft Neon Laser Scan Beam
    const beamGeo = new THREE.BoxGeometry(2.4, 0.05, 0.05);
    const beamMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    const scanBeam = new THREE.Mesh(beamGeo, beamMat);
    scene.add(scanBeam);

    // Floating Holographic Circuit Nodes (inspired by reference images)
    const nodeGroup = new THREE.Group();
    const nodeGeo = new THREE.SphereGeometry(0.06, 16, 16);
    const nodeMat = new THREE.MeshStandardMaterial({ color: 0xec4899, emissive: 0xec4899, emissiveIntensity: 0.8 });
    
    for (let i = 0; i < 6; i++) {
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      const angle = (i / 6) * Math.PI * 2;
      node.position.set(Math.cos(angle) * 2.3, Math.sin(angle) * 1.8, (Math.random() - 0.5) * 0.5);
      nodeGroup.add(node);
    }
    scene.add(nodeGroup);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Sweep laser scan beam smoothly
      scanBeam.position.y = Math.sin(elapsedTime * 3) * 1.3;

      // Gentle floating rotation
      docMesh.rotation.y = Math.sin(elapsedTime * 0.8) * 0.15;
      docMesh.rotation.x = Math.cos(elapsedTime * 0.6) * 0.1;
      scanBeam.rotation.y = docMesh.rotation.y;
      scanBeam.rotation.x = docMesh.rotation.x;

      nodeGroup.rotation.z = elapsedTime * 0.2;

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
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      if (container) container.innerHTML = '';
    };
  }, []);

  return (
    <div className="relative w-full h-56 rounded-3xl bg-linear-to-br from-purple-100 via-indigo-50 to-purple-200 border-2 border-purple-300 shadow-xl overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-radial from-cyan-400/10 via-transparent to-purple-500/10 pointer-events-none" />
      <div ref={mountRef} className="w-full h-full cursor-pointer touch-none relative z-10" />
      <div className="absolute bottom-3 px-3 py-1 bg-white/80 backdrop-blur-md rounded-full border border-purple-300 text-[10px] font-black text-indigo-700 shadow-md animate-pulse z-20">
         Scanning Prescription Hologram...
      </div>
    </div>
  );
}
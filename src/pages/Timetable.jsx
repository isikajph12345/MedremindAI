import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import toast from 'react-hot-toast';
import { getMedicines } from '../utils/storage';
import * as THREE from 'three';

export default function Timetable() {
  const navigate = useNavigate();
  
  const [breakfastDelay, setBreakfastDelay] = useState(0);
  const [lunchDelay, setLunchDelay] = useState(0);
  const [dinnerDelay, setDinnerDelay] = useState(0);
  
  const [lastDoseCompleted, setLastDoseCompleted] = useState(false);
  const canvasRef = useRef(null);

  const savedMeds = getMedicines();
  const activeMedicines = savedMeds && savedMeds.length > 0 ? savedMeds : [
    { id: 1, name: 'Morning Vitamin C', foodSlot: 'Before Breakfast', frequency: 'Every Day' },
    { id: 2, name: 'Paracetamol', foodSlot: 'After Lunch', frequency: 'Every Day' },
    { id: 3, name: 'Night Blood Pressure Med', foodSlot: 'Before Dinner', frequency: 'Every Day' },
  ];

  const hasBreakfastMeds = activeMedicines.some(m => m.foodSlot?.toLowerCase().includes('breakfast'));
  const hasLunchMeds = activeMedicines.some(m => m.foodSlot?.toLowerCase().includes('lunch'));
  const hasDinnerMeds = activeMedicines.some(m => m.foodSlot?.toLowerCase().includes('dinner') || m.foodSlot?.toLowerCase().includes('night'));

  useEffect(() => {
    const container = canvasRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 6.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    const rig = new THREE.Group();
    rig.rotation.x = 0.3;
    rig.rotation.y = -0.3;
    scene.add(rig);

    scene.add(new THREE.AmbientLight(0xffffff, 1.0));
    const keyLight = new THREE.PointLight(0xffd700, 4, 12);
    keyLight.position.set(2, 2, 3);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(0xff70e0, 3, 12);
    rimLight.position.set(-2, -2, -3);
    scene.add(rimLight);

    const makeGlowSprite = (color, size, opacity) => {
      const c = document.createElement('canvas');
      c.width = 128; c.height = 128;
      const ctx = c.getContext('2d');
      const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, color.replace('ALPHA', opacity));
      grad.addColorStop(1, color.replace('ALPHA', '0'));
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 128, 128);
      const tex = new THREE.CanvasTexture(c);
      const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
      const sprite = new THREE.Sprite(mat);
      sprite.scale.set(size, size, 1);
      return sprite;
    };
    const outerGlow = makeGlowSprite('rgba(255,112,166,ALPHA)', 7.5, '0.5');
    outerGlow.position.z = -1;
    rig.add(outerGlow);

    const clockGeometry = new THREE.TorusGeometry(1.8, 0.14, 24, 120);
    const clockMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xff9ecb,
      transmission: 0.8,
      roughness: 0.1,
      thickness: 0.7,
      metalness: 0.1,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      emissive: 0xff1493,
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.95,
    });
    const clockMesh = new THREE.Mesh(clockGeometry, clockMaterial);
    rig.add(clockMesh);

    const coreGeo = new THREE.SphereGeometry(0.45, 32, 32);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0xffe066,
      emissive: 0xffd700,
      emissiveIntensity: 1.2,
      transmission: 0.4,
      roughness: 0.2,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    rig.add(coreMesh);
    const coreGlow = makeGlowSprite('rgba(255,215,0,ALPHA)', 2.5, '0.8');
    coreMesh.add(coreGlow);

    const handMat = new THREE.MeshStandardMaterial({ color: 0x1e0038, emissive: 0xffffff, emissiveIntensity: 0.2 });
    const hourHand = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.8, 0.06), handMat);
    hourHand.geometry.translate(0, 0.4, 0);
    hourHand.position.z = 0.2;
    rig.add(hourHand);
    const minHand = new THREE.Mesh(new THREE.BoxGeometry(0.045, 1.15, 0.06), handMat);
    minHand.geometry.translate(0, 0.58, 0);
    minHand.position.z = 0.25;
    rig.add(minHand);

    const orbitRadius = 2.6;
    const capsuleColors = [0xffe066, 0xff70a6, 0xb794f6, 0x8ad1ff, 0x8FB996];
    const capsuleData = activeMedicines.slice(0, 6).map((_, i) => ({
      baseAngle: (i / Math.max(activeMedicines.length, 1)) * Math.PI * 2,
      speed: 0.18 + i * 0.03,
    }));
    const capsuleMeshes = capsuleData.map((d, i) => {
      const geo = new THREE.CapsuleGeometry(0.1, 0.24, 4, 8);
      const mat = new THREE.MeshPhysicalMaterial({
        color: capsuleColors[i % capsuleColors.length],
        emissive: capsuleColors[i % capsuleColors.length],
        emissiveIntensity: 0.7,
        transmission: 0.5,
        roughness: 0.2,
      });
      const mesh = new THREE.Mesh(geo, mat);
      rig.add(mesh);
      return mesh;
    });

    const makeParticles = (count, radiusMin, radiusSpread, z, size, color, opacity) => {
      const geo = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count * 3; i += 3) {
        const angle = Math.random() * Math.PI * 2;
        const radius = radiusMin + Math.random() * radiusSpread;
        positions[i] = Math.cos(angle) * radius;
        positions[i + 1] = Math.sin(angle) * radius;
        positions[i + 2] = z + (Math.random() - 0.5) * 0.5;
      }
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const mat = new THREE.PointsMaterial({ size, color, transparent: true, opacity });
      return new THREE.Points(geo, mat);
    };
    const nearParticles = makeParticles(60, 2.8, 0.5, 0.4, 0.08, 0xffd700, 0.9);
    const farParticles = makeParticles(50, 3.3, 0.7, -1.5, 0.05, 0xb794f6, 0.5);
    rig.add(nearParticles, farParticles);

    let dragging = false;
    let lastX = 0, lastY = 0;
    let targetRotY = -0.3, targetRotX = 0.3;

    const onDown = (x, y) => { dragging = true; lastX = x; lastY = y; };
    const onMove = (x, y) => {
      if (!dragging) return;
      targetRotY += (x - lastX) * 0.008;
      targetRotX += (y - lastY) * 0.008;
      lastX = x; lastY = y;
    };
    const onUp = () => { dragging = false; };

    container.addEventListener('pointerdown', (e) => onDown(e.clientX, e.clientY));
    window.addEventListener('pointermove', (e) => onMove(e.clientX, e.clientY));
    window.addEventListener('pointerup', onUp);

    let animationFrameId;
    let isVisible = true;
    const handleVisibility = () => { isVisible = !document.hidden; };
    document.addEventListener('visibilitychange', handleVisibility);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const t = performance.now() * 0.001;

      clockMesh.rotation.z += 0.0025;
      nearParticles.rotation.z -= 0.0035;
      farParticles.rotation.z += 0.002;

      const idleSpin = dragging ? 0 : t * 0.15;
      rig.rotation.y += ((targetRotY + idleSpin) - rig.rotation.y) * 0.06;
      rig.rotation.x += (targetRotX - rig.rotation.x) * 0.06;

      const pulse = 1 + Math.sin(t * 2.5) * 0.12;
      coreMesh.scale.setScalar(pulse);
      coreMat.emissiveIntensity = 1.0 + Math.sin(t * 2.5) * 0.4;

      const now = new Date();
      hourHand.rotation.z = -((now.getHours() % 12) / 12) * Math.PI * 2 - (now.getMinutes() / 60) * (Math.PI / 6);
      minHand.rotation.z = -(now.getMinutes() / 60) * Math.PI * 2;

      capsuleMeshes.forEach((mesh, i) => {
        const angle = capsuleData[i].baseAngle + t * capsuleData[i].speed;
        mesh.position.set(Math.cos(angle) * orbitRadius, Math.sin(angle) * orbitRadius, Math.sin(t * 1.5 + i) * 0.2);
        mesh.rotation.z = angle;
        const bob = 1 + Math.sin(t * 2 + i) * 0.08;
        mesh.scale.setScalar(bob);
      });

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
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('visibilitychange', handleVisibility);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      if (container) container.innerHTML = '';
    };
  }, []);

  const handleBreakfastDelay = () => {
    const newDelay = breakfastDelay === 0 ? 30 : 0;
    setBreakfastDelay(newDelay);
    if (newDelay > 0) {
      toast.success('Breakfast delayed by 30m! Cascading shift applied to Lunch & Dinner schedules.');
    } else {
      toast.success('Breakfast reset to On Time.');
    }
  };

  const handleLunchDelay = () => {
    const newDelay = lunchDelay === 0 ? 30 : 0;
    setLunchDelay(newDelay);
    if (newDelay > 0) {
      toast.success('Lunch delayed by 30m! Cascading shift applied to Dinner schedule.');
    } else {
      toast.success('Lunch reset to On Time.');
    }
  };

  const handleDinnerDelay = () => {
    const newDelay = dinnerDelay === 0 ? 30 : 0;
    setDinnerDelay(newDelay);
    if (newDelay > 0) {
      toast.success('Dinner delayed by 30m! Evening alarms shifted accordingly.');
    } else {
      toast.success('Dinner reset to On Time.');
    }
  };

  const handleCompleteCourse = () => {
    setLastDoseCompleted(true);
    toast.success('Final dose confirmed! Treatment course completed successfully.');
  };

  const getDynamicTimeLabel = (med) => {
    const slot = med.foodSlot?.toLowerCase() || '';
    let baseTimeHour = 8;
    let baseTimeMin = 0;
    let totalDelayApplied = 0;

    if (slot.includes('breakfast')) {
      baseTimeHour = 8;
      totalDelayApplied = breakfastDelay;
    } else if (slot.includes('lunch')) {
      baseTimeHour = 13;
      totalDelayApplied = breakfastDelay + lunchDelay;
    } else if (slot.includes('dinner') || slot.includes('night')) {
      baseTimeHour = 20;
      totalDelayApplied = breakfastDelay + lunchDelay + dinnerDelay;
    } else {
      return 'On Schedule';
    }

    const totalMinutes = baseTimeHour * 60 + baseTimeMin + totalDelayApplied;
    const h = Math.floor(totalMinutes / 60) % 24;
    const m = totalMinutes % 60;
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedHour = h % 12 === 0 ? 12 : h % 12;
    const formattedMin = m < 10 ? `0${m}` : m;

    if (totalDelayApplied === 0) {
      return `${formattedHour}:${formattedMin} ${ampm} (On Time)`;
    }
    return `${formattedHour}:${formattedMin} ${ampm} (Shifted)`;
  };

  return (
    <div className="relative z-10 flex flex-col justify-between min-h-[90vh] py-2 px-1 text-[#1E0038] space-y-3">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <BackButton onClick={() => navigate('/timetable-hub')} />
          <span className="text-xs font-black text-white px-3.5 py-1.5 rounded-full bg-indigo-700 border-2 border-white shadow-md animate-pulse">
            🕒 Active Timeline View
          </span>
        </div>

        <div className="relative p-2 rounded-3xl bg-linear-to-br from-purple-950 via-indigo-950 to-[#1E0038] border-2 border-white/40 shadow-2xl shadow-purple-900/60 flex flex-col items-center justify-center text-center overflow-hidden">
          <div className="absolute w-40 h-40 rounded-full bg-pink-500/30 blur-2xl animate-pulse pointer-events-none" />
          <div ref={canvasRef} className="w-full h-44 relative z-10 cursor-grab active:cursor-grabbing touch-none" />
          <h3 className="text-xs font-black text-white mt-1 relative z-10">Adaptive 3D Treatment Clock</h3>
          <p className="text-[10px] text-pink-300 font-bold relative z-10">Drag to spin 360° • Synced automatically with meals</p>
        </div>

        <div className="space-y-2">
          {hasBreakfastMeds && (
            <div className="p-2.5 rounded-2xl bg-amber-100/95 border-2 border-amber-400 shadow flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black text-amber-900">Breakfast running late?</h4>
                <p className="text-[10px] text-amber-800 font-bold">Defaults to On Time if ignored</p>
              </div>
              <button
                type="button"
                onClick={handleBreakfastDelay}
                className={`px-3 py-1.5 text-white text-xs font-black rounded-xl shadow cursor-pointer transition-all ${breakfastDelay > 0 ? 'bg-amber-600 animate-pulse' : 'bg-amber-500 hover:bg-amber-600'}`}
              >
                {breakfastDelay > 0 ? 'Shifted (+30m)' : 'Eating Now 🍳'}
              </button>
            </div>
          )}

          {hasLunchMeds && (
            <div className="p-2.5 rounded-2xl bg-orange-100/95 border-2 border-orange-400 shadow flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black text-orange-900">Lunch running late?</h4>
                <p className="text-[10px] text-orange-800 font-bold">Defaults to On Time if ignored</p>
              </div>
              <button
                type="button"
                onClick={handleLunchDelay}
                className={`px-3 py-1.5 text-white text-xs font-black rounded-xl shadow cursor-pointer transition-all ${lunchDelay > 0 ? 'bg-orange-600 animate-pulse' : 'bg-orange-500 hover:bg-orange-600'}`}
              >
                {lunchDelay > 0 ? 'Shifted (+30m)' : 'Eating Now '}
              </button>
            </div>
          )}

          {hasDinnerMeds && (
            <div className="p-2.5 rounded-2xl bg-indigo-100/95 border-2 border-indigo-400 shadow flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black text-indigo-900">Dinner running late?</h4>
                <p className="text-[10px] text-indigo-800 font-bold">Defaults to On Time if ignored</p>
              </div>
              <button
                type="button"
                onClick={handleDinnerDelay}
                className={`px-3 py-1.5 text-white text-xs font-black rounded-xl shadow cursor-pointer transition-all ${dinnerDelay > 0 ? 'bg-indigo-600 animate-pulse' : 'bg-indigo-500 hover:bg-indigo-600'}`}
              >
                {dinnerDelay > 0 ? 'Shifted (+30m)' : 'Eating Now '}
              </button>
            </div>
          )}
        </div>

        <div className="space-y-2 max-h-[22vh] overflow-y-auto pr-1">
          {activeMedicines.map((med, idx) => (
            <div key={med.id || idx} className="p-3 rounded-2xl bg-white/95 backdrop-blur-xl border-2 border-purple-200 flex items-center justify-between shadow">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-100 border border-purple-300 flex items-center justify-center text-base shadow-inner">
                  {idx === 0 ? '☀️' : idx === 1 ? '💊' : '🌙'}
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#1E0038]">{med.name}</h4>
                  <p className="text-[10px] text-pink-600 font-bold">{med.foodSlot || 'After Meal'} • {med.frequency || 'Every Day'}</p>
                </div>
              </div>
              <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200 text-right">
                {getDynamicTimeLabel(med)}
              </span>
            </div>
          ))}
        </div>

        <div className="p-3 rounded-2xl bg-purple-50 border-2 border-purple-300 flex items-center justify-between shadow-xs">
          <div>
            <h4 className="text-xs font-black text-purple-900">Course Completion Trigger</h4>
            <p className="text-[10px] text-purple-700">{lastDoseCompleted ? 'Course Successfully Finished! ' : 'Final dose remaining'}</p>
          </div>
          <button
            type="button"
            onClick={handleCompleteCourse}
            disabled={lastDoseCompleted}
            className={`px-3 py-1.5 rounded-xl text-xs font-black text-white shadow transition-all ${lastDoseCompleted ? 'bg-green-600 cursor-default' : 'bg-purple-600 hover:bg-purple-700 cursor-pointer'}`}
          >
            {lastDoseCompleted ? 'Completed' : 'Take Last Dose'}
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate('/timetable-hub')}
        className="w-full py-3 bg-linear-to-r from-purple-600 to-indigo-600 text-white font-black text-xs rounded-full shadow-lg border-2 border-white/60 active:scale-95 transition-all cursor-pointer uppercase tracking-wider"
      >
        ← Back to Timetable Hub
      </button>
    </div>
  );
}
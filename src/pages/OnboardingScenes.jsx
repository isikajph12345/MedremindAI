import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import { getProfileData } from '../utils/storage';

const scenes = [
  { id: 1, title: 'Prescription Scan', description: '3D prescription paper with an active scanning beam.', gradient: 'from-pink-500 to-rose-500', route: '/scan-prescription' },
  { id: 2, title: 'Smart Timetable', description: '3D clock scheduling meals and medication reminders.', gradient: 'from-indigo-500 to-blue-600', route: '/timetable-hub' },
  { id: 3, title: 'Report Analytics', description: 'Scan blood tests and lab reports with plain language AI insights.', gradient: 'from-purple-500 to-pink-600', route: '/reports' },
  { id: 4, title: 'AI Companion', description: 'Soft interactive check-ins on how you are feeling.', gradient: 'from-pink-500 to-purple-600' }, // no route — opens the modal instead
];

export default function OnboardingScenes() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('ISIKA');

  useEffect(() => {
    const profile = getProfileData();
    if (profile && profile.name) {
      setUserName(profile.name);
    }
  }, []);

  const handleCardClick = (scene) => {
    if (scene.id === 4) {
      // Feature 4 has no route — it opens the global AI Companion check-in modal instead
      if (window.triggerManualCheckIn) {
        window.triggerManualCheckIn();
      }
      return;
    }
    if (scene.route) {
      navigate(scene.route);
    }
  };

  return (
    <div className="relative z-10 flex flex-col justify-between min-h-[90vh] py-2 px-1 text-[#1E0038] space-y-3">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <BackButton onClick={() => navigate('/')} />

          <button
            onClick={() => navigate('/profile')}
            className="text-xs font-black text-white px-3.5 py-1.5 rounded-full bg-linear-to-r from-purple-700 to-indigo-700 border-2 border-white shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            Welcome, {userName}!
          </button>
        </div>

        <div>
          <div className="inline-block px-3 py-1 rounded-xl bg-purple-200/90 border border-purple-400 mb-1 shadow-xs">
            <h2 className="text-2xl font-black text-[#1E0038]">Features Overview</h2>
          </div>
          <p className="text-xs font-black text-[#2B0054] drop-shadow-xs">
            Experience smart 3D health reminders
          </p>
        </div>

        <div className="space-y-2.5 max-h-[46vh] overflow-y-auto pr-1">
          {scenes.map((scene) => (
            <div
              key={scene.id}
              onClick={() => handleCardClick(scene)}
              className={`p-3.5 rounded-2xl bg-white/90 backdrop-blur-xl border-2 border-purple-300 flex items-start gap-3 shadow-lg transition-all ${
                scene.route || scene.id === 4 ? 'cursor-pointer hover:border-purple-600 hover:scale-[1.01]' : ''
              }`}
            >
              <div className={`w-10 h-10 rounded-xl bg-linear-to-br ${scene.gradient} flex items-center justify-center text-base shadow-md shrink-0 text-white border border-white/40`}>
                {scene.icon}
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-pink-600">Feature {scene.id}</span>
                <h3 className="text-xs font-black text-[#1E0038]">{scene.title}</h3>
                <p className="text-[11px] text-[#2B0054] font-bold leading-tight">{scene.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate('/profile')}
        className="w-full py-4 bg-linear-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white font-black text-sm rounded-full shadow-xl shadow-purple-600/40 border-2 border-white/60 active:scale-95 transition-all cursor-pointer uppercase tracking-wider"
      >
        Go to Profile Timeline →
      </button>
    </div>
  );
}
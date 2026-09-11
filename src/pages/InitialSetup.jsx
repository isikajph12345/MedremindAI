import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import { saveProfileData } from '../utils/storage';
import toast from 'react-hot-toast';

export default function InitialSetup() {
  const navigate = useNavigate();

  // Patient Details
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  // Family Care / Emergency Contact Details
  const [familyName, setFamilyName] = useState('');
  const [familyRelation, setFamilyRelation] = useState('Son');
  const [familyEmail, setFamilyEmail] = useState('');

  // Daily Meal Timings
  const [breakfastTime, setBreakfastTime] = useState('08:00');
  const [lunchTime, setLunchTime] = useState('13:00');
  const [dinnerTime, setDinnerTime] = useState('20:00');

  const handleSaveSetup = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter your full name!');
      return;
    }

    const profileData = {
      name: name.trim(),
      age,
      familyName: familyName.trim(),
      familyRelation,
      familyEmail: familyEmail.trim(),
      mealTimings: {
        breakfast: breakfastTime,
        lunch: lunchTime,
        dinner: dinnerTime,
      },
    };

    const success = saveProfileData(profileData);

    if (success) {
      toast.success('Setup completed successfully!');
      navigate('/scenes'); // Routes to OnboardingScenes feature overview page
    } else {
      toast.error('Failed to save profile. Please try again.');
    }
  };

  return (
    <div className="relative z-10 flex flex-col justify-between min-h-[90vh] py-2 px-1 text-[#2B0054] space-y-3">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <BackButton onClick={() => navigate('/')} />
          <span className="text-xs font-black text-white px-3.5 py-1.5 rounded-full bg-linear-to-r from-purple-700 to-indigo-700 border-2 border-white shadow-md">
            Initial Setup
          </span>
        </div>

        <div>
          <div className="inline-block px-3 py-1 rounded-xl bg-purple-200/90 border border-purple-400 mb-1 shadow-xs">
            <h2 className="text-2xl font-black text-[#2B0054]">Welcome! Set Up Profile</h2>
          </div>
          <p className="text-xs font-black text-[#3B0764]">
            Configure your personal details, emergency contacts, and daily meal schedule
          </p>
        </div>

        <form onSubmit={handleSaveSetup} className="space-y-3 max-h-[66vh] overflow-y-auto pr-1">
          
          {/* Patient Details Section */}
          <div className="p-4 rounded-2xl bg-white/95 backdrop-blur-xl border-2 border-purple-400 shadow-xl space-y-2">
            <label className="text-[11px] font-black text-[#3B0764] uppercase tracking-wider block">
              Patient Details
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-black text-purple-800 block mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g., Isika Rakshit"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-purple-50 border-2 border-purple-300 text-[#2B0054] text-xs font-black focus:outline-none focus:border-purple-700"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-purple-800 block mb-1">Age</label>
                <input
                  type="number"
                  placeholder="e.g., 20"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-purple-50 border-2 border-purple-300 text-[#2B0054] text-xs font-black focus:outline-none focus:border-purple-700"
                />
              </div>
            </div>
          </div>

          {/* Family Care / Emergency Contact Section */}
          <div className="p-4 rounded-2xl bg-white/95 backdrop-blur-xl border-2 border-purple-400 shadow-xl space-y-2">
            <label className="text-[11px] font-black text-[#3B0764] uppercase tracking-wider block">
              Family Care / Emergency Contact
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-black text-purple-800 block mb-1">Contact Name</label>
                <input
                  type="text"
                  placeholder="e.g., John Doe"
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-purple-50 border-2 border-purple-300 text-[#2B0054] text-xs font-black focus:outline-none focus:border-purple-700"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-purple-800 block mb-1">Relation</label>
                <select
                  value={familyRelation}
                  onChange={(e) => setFamilyRelation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-purple-50 border-2 border-purple-300 text-[#2B0054] text-xs font-black focus:outline-none focus:border-purple-700 cursor-pointer"
                >
                  <option value="Son">Son</option>
                  <option value="Daughter">Daughter</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Parent">Parent</option>
                  <option value="Caregiver">Caregiver</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black text-purple-800 block mb-1">Contact Email</label>
              <input
                type="email"
                placeholder="e.g., family@example.com"
                value={familyEmail}
                onChange={(e) => setFamilyEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-purple-50 border-2 border-purple-300 text-[#2B0054] text-xs font-black focus:outline-none focus:border-purple-700"
              />
            </div>
          </div>

          {/* Daily Meal Timings Section */}
          <div className="p-4 rounded-2xl bg-white/95 backdrop-blur-xl border-2 border-purple-400 shadow-xl space-y-2">
            <label className="text-[11px] font-black text-[#3B0764] uppercase tracking-wider block">
              Daily Meal Timings
            </label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] font-black text-purple-800 block mb-1">Breakfast</label>
                <input
                  type="time"
                  value={breakfastTime}
                  onChange={(e) => setBreakfastTime(e.target.value)}
                  className="w-full px-2 py-2 rounded-xl bg-purple-50 border-2 border-purple-300 text-[#2B0054] text-xs font-black focus:outline-none focus:border-purple-700"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-purple-800 block mb-1">Lunch</label>
                <input
                  type="time"
                  value={lunchTime}
                  onChange={(e) => setLunchTime(e.target.value)}
                  className="w-full px-2 py-2 rounded-xl bg-purple-50 border-2 border-purple-300 text-[#2B0054] text-xs font-black focus:outline-none focus:border-purple-700"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-purple-800 block mb-1">Dinner</label>
                <input
                  type="time"
                  value={dinnerTime}
                  onChange={(e) => setDinnerTime(e.target.value)}
                  className="w-full px-2 py-2 rounded-xl bg-purple-50 border-2 border-purple-300 text-[#2B0054] text-xs font-black focus:outline-none focus:border-purple-700"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-linear-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-black text-xs rounded-xl shadow-xl uppercase tracking-wider cursor-pointer"
          >
            Save & Continue →
          </button>
        </form>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import { saveMedicine } from '../utils/storage';
import toast from 'react-hot-toast';

export default function Home() {
  const navigate = useNavigate();

  const [medicineName, setMedicineName] = useState('');
  const [dosage, setDosage] = useState('1 Tablet');
  const [foodSlot, setFoodSlot] = useState('After Breakfast');
  const [duration, setDuration] = useState('7');
  const [notes, setNotes] = useState('');

  const handleSaveMedicine = (e) => {
    e.preventDefault();

    if (!medicineName.trim()) {
      toast.error('Please enter the medicine name!');
      return;
    }

    const newMed = {
      name: medicineName.trim(),
      dosage,
      foodSlot,
      durationDays: parseInt(duration, 10) || 7,
      initialDurationDays: parseInt(duration, 10) || 7,
      notes: notes.trim(),
      startDate: new Date().toISOString(),
      id: Date.now()
    };

    const success = saveMedicine(newMed);
    if (success) {
      toast.success('Medicine saved! Redirecting to profile...');
      setMedicineName('');
      setNotes('');
      navigate('/profile'); // Directly navigates to Profile page. No dashboard!
    } else {
      toast.error('Failed to save medicine.');
    }
  };

  return (
    <div className="relative z-10 flex flex-col justify-between min-h-[90vh] py-2 px-1 text-[#1E0038] space-y-3">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <BackButton onClick={() => navigate('/scenes')} />
        </div>

        <div>
          <div className="inline-block px-3 py-1 rounded-xl bg-purple-200/90 border border-purple-400 mb-1 shadow-xs">
            <h2 className="text-2xl font-black text-[#1E0038]">Enter Medicine</h2>
          </div>
          <p className="text-xs font-black text-[#2B0054]">
            Register a new prescription or dose for active tracking
          </p>
        </div>

        {/* Input Form Card */}
        <form onSubmit={handleSaveMedicine} className="p-4 rounded-2xl bg-white/95 backdrop-blur-xl border-2 border-purple-400 shadow-xl space-y-3">
          <div>
            <label className="block text-[11px] font-black text-[#2B0054] uppercase tracking-wider mb-1">
              Medicine Name *
            </label>
            <input
              type="text"
              placeholder="e.g., Paracetamol 500mg"
              value={medicineName}
              onChange={(e) => setMedicineName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs font-black rounded-xl bg-purple-50/80 border-2 border-purple-300 text-[#1E0038] placeholder-purple-400 focus:outline-none focus:border-purple-700 shadow-inner"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-black text-[#2B0054] uppercase tracking-wider mb-1">
                Dosage
              </label>
              <select
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                className="w-full px-3 py-2 text-xs font-black rounded-xl bg-purple-50/80 border-2 border-purple-300 text-[#1E0038] focus:outline-none focus:border-purple-700 cursor-pointer"
              >
                <option value="1 Tablet">1 Tablet</option>
                <option value="2 Tablets">2 Tablets</option>
                <option value="5ml">5 ml Syrup</option>
                <option value="1 Capsule">1 Capsule</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-black text-[#2B0054] uppercase tracking-wider mb-1">
                Food Slot
              </label>
              <select
                value={foodSlot}
                onChange={(e) => setFoodSlot(e.target.value)}
                className="w-full px-3 py-2 text-xs font-black rounded-xl bg-purple-50/80 border-2 border-purple-300 text-[#1E0038] focus:outline-none focus:border-purple-700 cursor-pointer"
              >
                <option value="Before Breakfast">Before Breakfast</option>
                <option value="After Breakfast">After Breakfast</option>
                <option value="Before Lunch">Before Lunch</option>
                <option value="After Lunch">After Lunch</option>
                <option value="Before Dinner">Before Dinner</option>
                <option value="After Dinner">After Dinner</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-black text-[#2B0054] uppercase tracking-wider mb-1">
              Course Duration (Days) *
            </label>
            <input
              type="number"
              min="1"
              max="365"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-3.5 py-2 text-xs font-black rounded-xl bg-purple-50/80 border-2 border-purple-300 text-[#1E0038] focus:outline-none focus:border-purple-700 shadow-inner"
            />
          </div>

          <div>
            <label className="block text-[11px] font-black text-[#2B0054] uppercase tracking-wider mb-1">
              Notes / Instructions
            </label>
            <textarea
              rows="2"
              placeholder="e.g., Take with warm water"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 text-xs font-black rounded-xl bg-purple-50/80 border-2 border-purple-300 text-[#1E0038] placeholder-purple-400 focus:outline-none focus:border-purple-700 shadow-inner resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white font-black text-xs rounded-xl shadow-md border border-purple-300 active:scale-95 transition-all cursor-pointer uppercase tracking-wider"
          >
            Save Medicine
          </button>
        </form>
      </div>
    </div>
  );
}
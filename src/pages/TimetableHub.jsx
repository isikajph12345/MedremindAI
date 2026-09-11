import React from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import { PlusCircle, Calendar, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { getMedicines } from '../utils/storage';

export default function TimetableHub() {
  const navigate = useNavigate();

  const handleViewTimeline = () => {
    const meds = getMedicines();
    if (!meds || meds.length === 0) {
      toast.error("Can't show timeline: No medicines added yet! Please add a medicine first.");
      return;
    }
    navigate('/timetable');
  };

  return (
    <div className="relative z-10 flex flex-col justify-between min-h-[90vh] py-2 px-1 text-[#1E0038] space-y-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <BackButton onClick={() => navigate('/scenes')} />
          <span className="text-xs font-black text-white px-3.5 py-1.5 rounded-full bg-indigo-700 border-2 border-white shadow-md">
            Smart Timetable Hub
          </span>
        </div>

        <div>
          <div className="inline-block px-3 py-1 rounded-xl bg-purple-200/90 border border-purple-400 mb-1 shadow-xs">
            <h2 className="text-2xl font-black text-[#1E0038]">Choose an Action</h2>
          </div>
          <p className="text-xs font-black text-[#2B0054] drop-shadow-xs">
            Add new prescriptions or check your previous active treatment timeline
          </p>
        </div>

        <div className="space-y-3 pt-2">
          {/* Option 1: Manual Entry */}
          <div
            onClick={() => navigate('/manual-entry')}
            className="p-4 rounded-3xl bg-white/95 backdrop-blur-xl border-2 border-purple-300 shadow-xl flex items-center gap-4 cursor-pointer hover:border-purple-600 hover:scale-[1.02] transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shrink-0">
              <PlusCircle className="w-6 h-6 text-[#FFD700]" />
            </div>
            <div>
              <span className="text-[10px] font-black text-pink-600 uppercase tracking-wider">New Prescription</span>
              <h3 className="text-sm font-black text-[#1E0038]">Manual Entry</h3>
              <p className="text-[11px] text-[#2B0054] font-bold">Add and configure new medicine schedules</p>
            </div>
          </div>

          {/* Option 2: View Timeline */}
          <div
            onClick={handleViewTimeline}
            className="p-4 rounded-3xl bg-white/95 backdrop-blur-xl border-2 border-purple-300 shadow-xl flex items-center gap-4 cursor-pointer hover:border-purple-600 hover:scale-[1.02] transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-md shrink-0">
              <Calendar className="w-6 h-6 text-[#FFD700]" />
            </div>
            <div>
              <span className="text-[10px] font-black text-pink-600 uppercase tracking-wider">Active Track</span>
              <h3 className="text-sm font-black text-[#1E0038]">View Timeline</h3>
              <p className="text-[11px] text-[#2B0054] font-bold">Review existing medicines, 3D clock & meal adjusters</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 rounded-2xl bg-purple-900/40 border border-purple-300/40 text-center text-white text-[11px] font-bold">
         Changes made here automatically update your profile records.
      </div>
    </div>
  );
}
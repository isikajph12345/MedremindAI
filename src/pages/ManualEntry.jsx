import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, Pill, Plus, Trash2, Shield, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { getProfileData, getMedicines, saveMedicine } from '../utils/storage';

export default function ManualEntry() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  const [medicines, setMedicines] = useState([
    {
      id: Date.now(),
      medName: '',
      isEveryDay: true,
      selectedDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      foodSlots: ['After Breakfast'],
      duration: '7',
    },
  ]);

  const foodSlotOptions = [
    'Before Breakfast',
    'After Breakfast',
    'Before Lunch',
    'After Lunch',
    'Before Dinner',
    'After Dinner',
  ];

  useEffect(() => {
    const userProfile = getProfileData();
    if (userProfile) {
      setProfile(userProfile);
    }
  }, []);

  const addMedicineRow = () => {
    setMedicines([
      ...medicines,
      {
        id: Date.now() + Math.random(),
        medName: '',
        isEveryDay: true,
        selectedDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        foodSlots: ['After Breakfast'],
        duration: '7',
      },
    ]);
  };

  const removeMedicineRow = (id) => {
    if (medicines.length === 1) {
      toast.error('You must keep at least one medicine entry.');
      return;
    }
    setMedicines(medicines.filter((med) => med.id !== id));
  };

  const updateMedicineField = (id, field, value) => {
    setMedicines(
      medicines.map((med) => (med.id === id ? { ...med, [field]: value } : med))
    );
  };

  const toggleDayForMedicine = (id, day) => {
    setMedicines(
      medicines.map((med) => {
        if (med.id !== id) return med;
        const exists = med.selectedDays.includes(day);
        const updatedDays = exists
          ? med.selectedDays.filter((d) => d !== day)
          : [...med.selectedDays, day];
        return { ...med, selectedDays: updatedDays };
      })
    );
  };

  const toggleFoodSlotForMedicine = (id, slot) => {
    setMedicines(
      medicines.map((med) => {
        if (med.id !== id) return med;
        const exists = med.foodSlots.includes(slot);
        const updatedSlots = exists
          ? med.foodSlots.filter((s) => s !== slot)
          : [...med.foodSlots, slot];
        return { ...med, foodSlots: updatedSlots };
      })
    );
  };

  const handleSaveAllMedicines = (e) => {
    e.preventDefault();

    for (let i = 0; i < medicines.length; i++) {
      const med = medicines[i];
      if (!med.medName.trim()) {
        toast.error(`Please enter a name for Medicine #${i + 1}!`);
        return;
      }
      if (med.foodSlots.length === 0) {
        toast.error(`Please select at least one food timing slot for ${med.medName || `Medicine #${i + 1}`}!`);
        return;
      }
      if (!med.duration || isNaN(med.duration) || Number(med.duration) <= 0) {
        toast.error(`Please enter a valid duration for ${med.medName || `Medicine #${i + 1}`}!`);
        return;
      }
    }

    let allSuccessful = true;

    medicines.forEach((med) => {
      const totalDays = parseInt(med.duration, 10);
      const newMedicineData = {
        name: med.medName.trim(),
        frequency: med.isEveryDay ? 'Every Day' : med.selectedDays.join(', '),
        foodSlot: med.foodSlots.join(', '),
        durationDays: totalDays,
        initialDurationDays: totalDays,
        startDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        id: Date.now() + Math.random(),
      };

      const success = saveMedicine(newMedicineData);
      if (!success) allSuccessful = false;
    });

    if (allSuccessful) {
      toast.success(`${medicines.length} medicine(s) added successfully!`);
    } else {
      toast.error('Error saving medicines. Please try again.');
    }
  };

  const handleNavigateTimeline = () => {
    const currentMeds = getMedicines();
    if (!currentMeds || currentMeds.length === 0) {
      toast.error("Can't show timeline: No medicines added yet!");
      return;
    }
    navigate('/timetable');
  };

  const handleNavigateProfile = () => {
    const currentMeds = getMedicines();
    if (!currentMeds || currentMeds.length === 0) {
      toast.error("Can't open profile list: No medicines saved yet!");
      return;
    }
    navigate('/profile');
  };

  return (
    <div className="relative z-10 flex flex-col justify-between min-h-[90vh] py-2 px-1 text-[#1E0038] space-y-3">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/timetable-hub')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-linear-to-r from-purple-700 to-indigo-700 text-white border-2 border-white shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer text-xs font-black"
          >
            <ArrowLeft className="w-4 h-4 text-[#FFD700]" />
            <span>Hub Back</span>
          </button>
          <span className="text-xs font-black text-white px-3.5 py-1.5 rounded-full bg-linear-to-r from-purple-700 to-indigo-700 border-2 border-white shadow-md">
            Manual Entry Hub
          </span>
        </div>

        <div>
          <div className="inline-block px-3 py-1 rounded-xl bg-purple-200/90 border border-purple-400 mb-1 shadow-xs">
            <h2 className="text-xl font-black text-[#1E0038]">Add & Configure Medicines</h2>
          </div>
          <p className="text-xs font-black text-[#2B0054] drop-shadow-xs">
            Save your schedule, then view your profile or live timeline below
          </p>
        </div>

        <form onSubmit={handleSaveAllMedicines} className="space-y-3">
          <div className="space-y-3 max-h-[42vh] overflow-y-auto pr-1">
            {medicines.map((med, index) => (
              <div 
                key={med.id} 
                className="p-3.5 rounded-2xl bg-white/95 backdrop-blur-xl border-2 border-purple-300 shadow-lg space-y-2.5 relative"
              >
                <div className="flex items-center justify-between border-b border-purple-100 pb-1.5">
                  <span className="text-[11px] font-black text-purple-700 uppercase tracking-wider">
                    Medicine #{index + 1}
                  </span>
                  {medicines.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMedicineRow(med.id)}
                      className="text-rose-600 hover:text-rose-800 p-1 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div>
                  <label className="text-[10px] font-black text-[#2B0054] uppercase tracking-wider mb-0.5 flex items-center gap-1">
                    <Pill className="w-3 h-3 text-purple-700" /> Medicine Name *
                  </label>
                  <input
                    type="text"
                    value={med.medName}
                    onChange={(e) => updateMedicineField(med.id, 'medName', e.target.value)}
                    placeholder="e.g., Paracetamol"
                    className="w-full px-3 py-1.5 text-xs font-black rounded-xl bg-purple-50/80 border-2 border-purple-300 text-[#1E0038]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-black text-[#2B0054] uppercase tracking-wider flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-purple-700" /> Frequency *
                    </label>
                    <button
                      type="button"
                      onClick={() => updateMedicineField(med.id, 'isEveryDay', !med.isEveryDay)}
                      className="text-[10px] px-2.5 py-0.5 rounded-full font-black bg-purple-700 text-white cursor-pointer"
                    >
                      {med.isEveryDay ? 'Every Day' : 'Custom Days'}
                    </button>
                  </div>
                  {!med.isEveryDay && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDayForMedicine(med.id, day)}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-black cursor-pointer ${
                            med.selectedDays.includes(day) ? 'bg-purple-700 text-white' : 'bg-white text-purple-900 border'
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-[10px] font-black text-[#2B0054] uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-purple-700" /> Food Slots *
                  </label>
                  <div className="grid grid-cols-2 gap-1">
                    {foodSlotOptions.map((slot) => {
                      const isSelected = med.foodSlots.includes(slot);
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => toggleFoodSlotForMedicine(med.id, slot)}
                          className={`p-1.5 rounded-xl text-left border text-[10px] font-black cursor-pointer ${
                            isSelected ? 'bg-purple-700 text-white border-purple-900' : 'bg-purple-50 text-[#1E0038] border-purple-200'
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-[#2B0054] uppercase tracking-wider mb-0.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-purple-700" /> Duration (Days) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={med.duration}
                    onChange={(e) => updateMedicineField(med.id, 'duration', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs font-black rounded-xl bg-purple-50/80 border-2 border-purple-300 text-[#1E0038]"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={addMedicineRow}
              className="flex-1 py-2 bg-purple-100 text-purple-800 border-2 border-dashed border-purple-400 rounded-xl font-black text-xs flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add More
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-purple-700 text-white rounded-xl font-black text-xs shadow cursor-pointer uppercase tracking-wider"
            >
              Save Medicines
            </button>
          </div>
        </form>

        {/* Dual Destination Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-purple-200">
          <button
            type="button"
            onClick={handleNavigateProfile}
            className="py-3 bg-linear-to-r from-indigo-700 to-purple-800 hover:from-indigo-800 hover:to-purple-900 text-white font-black text-xs rounded-2xl shadow-md border-2 border-white/60 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
          >
            <User className="w-4 h-4 text-[#FFD700]" /> Go to Profile
          </button>
          <button
            type="button"
            onClick={handleNavigateTimeline}
            className="py-3 bg-linear-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white font-black text-xs rounded-2xl shadow-md border-2 border-white/60 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
          >
            <Shield className="w-4 h-4 text-[#FFD700]" /> View Timeline
          </button>
        </div>
      </div>
    </div>
  );
}
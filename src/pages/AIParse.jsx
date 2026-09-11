import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import toast from 'react-hot-toast';
import { getMedicines, saveMedicines } from '../utils/storage';

// Converts an alarm time + food instruction into a meal-slot label
// Timetable.jsx groups medicines by checking for "breakfast"/"lunch"/"dinner" in this string
function toFoodSlot(time, instruction) {
  const hour = parseInt((time || '08:00').split(':')[0], 10);
  let meal = 'Breakfast';
  if (hour >= 11 && hour < 17) meal = 'Lunch';
  else if (hour >= 17) meal = 'Dinner';

  const when = (instruction || '').toLowerCase().includes('before') ? 'Before' : 'After';
  if ((instruction || '').toLowerCase().includes('empty')) return `Empty Stomach (${meal})`;
  return `${when} ${meal}`;
}

export default function AIParse() {
  const location = useLocation();
  const navigate = useNavigate();
  const [medications, setMedications] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const rawData = location.state?.medicines || location.state?.data || location.state;
    const medsFromAI = Array.isArray(rawData) ? rawData : (rawData?.medicines || []);

    if (medsFromAI.length > 0) {
      const structured = medsFromAI.map((med, idx) => {
        const times = med.alarm_times || med.times || ["08:00"];
        const primaryTime = Array.isArray(times) ? times[0] : times;
        const durationDays = med.duration_days || parseInt(med.duration) || 5;

        return {
          id: Date.now() + idx,
          name: med.medicine_name || med.name || "Unknown Medicine",
          dosage: med.dosage || "As directed",
          foodSlot: toFoodSlot(primaryTime, med.instructions),
          frequency: 'Every Day',
          times: Array.isArray(times) ? times : [times],
          durationDays,
          initialDurationDays: durationDays,
          startDate: new Date().toISOString(),
          confidence: med.confidence || "high",
        };
      });
      setMedications(structured);
      toast.success(`AI extracted ${structured.length} medicine(s)!`, { id: 'extract-success' });
    } else {
      toast.error("No medicines found — please try scanning again.", { id: 'extract-error' });
    }
  }, [location.state]);

  const handleDeleteMed = (id, name) => {
    setMedications(medications.filter((med) => med.id !== id));
    toast.error(`Removed ${name}`, { id: 'delete-toast' });
  };

  const handleSaveAndSync = () => {
    if (isSyncing) return; // guards against the triple-toast issue — blocks duplicate calls
    if (medications.length === 0) {
      toast.error('No medications to save!', { id: 'empty-error' });
      return;
    }
    setIsSyncing(true);

    // Merge with whatever's already saved (manual entries etc.) instead of overwriting
    const existing = getMedicines();
    const merged = [...existing, ...medications];
    saveMedicines(merged);

    toast.success('Successfully synced to Timetable & Profile! ', { id: 'sync-success' });
    navigate('/timetable');
  };

  return (
    <div className="relative z-10 flex flex-col justify-between min-h-[90vh] py-3 px-2 text-[#1E0038] space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <BackButton onClick={() => navigate('/scan-or-manual')} />
          <span className="text-xs font-black text-white px-3.5 py-1.5 rounded-full bg-indigo-600 border-2 border-white shadow-md">
             AI Medication Parser
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-white/95 backdrop-blur-md border-2 border-purple-200 shadow-xl space-y-3">
          <div>
            <h3 className="text-sm font-black text-purple-900 uppercase tracking-wide">Extracted Medications</h3>
            <p className="text-xs text-indigo-700 font-bold">
              Review below — delete anything that looks wrong before saving.
            </p>
          </div>

          <div className="space-y-2 max-h-[42vh] overflow-y-auto pr-1">
            {medications.length > 0 ? (
              medications.map((med) => (
                <div key={med.id} className="p-3 rounded-2xl bg-purple-50/90 border-2 border-purple-200 flex items-center justify-between shadow-xs">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-black text-pink-600 uppercase tracking-wider">
                       {med.durationDays} Days | {med.dosage} | {med.foodSlot}
                    </span>
                    <h4 className="text-xs font-black text-[#1E0038]">
                      {med.name}
                      {med.confidence === "low" && (
                        <span className="ml-2 text-[9px] text-amber-600 font-bold">⚠ please verify</span>
                      )}
                    </h4>
                    <p className="text-[10px] text-indigo-800 font-bold"> {med.times.join(", ")}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteMed(med.id, med.name)}
                    className="px-2.5 py-1 bg-rose-500 hover:bg-rose-600 text-white text-[10px] font-black rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    Delete 🗑️
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-6 space-y-2">
                <p className="text-xs font-bold text-gray-500">No medications found. Go back and rescan.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSaveAndSync}
        disabled={isSyncing}
        className="w-full py-3.5 bg-linear-to-r from-purple-600 to-indigo-600 text-white font-black text-xs rounded-full shadow-lg border-2 border-white/60 active:scale-95 transition-all uppercase tracking-wider cursor-pointer disabled:opacity-50"
      >
        {isSyncing ? 'Syncing...' : 'Sync to 3D Timetable & Profile Hub '}
      </button>
    </div>
  );
}
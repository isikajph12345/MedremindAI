import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import { getProfileData, saveProfileData, getMedicines, saveMedicines, getReports } from '../utils/storage';
import toast from 'react-hot-toast';

export default function Profile() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  // Family Care Details
  const [familyName, setFamilyName] = useState('');
  const [familyRelation, setFamilyRelation] = useState('Son');
  const [familyEmail, setFamilyEmail] = useState('');

  const [medicines, setMedicines] = useState([]);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const profile = getProfileData();
    if (profile) {
      if (profile.name) setName(profile.name);
      if (profile.age) setAge(profile.age);
      if (profile.familyName) setFamilyName(profile.familyName);
      if (profile.familyRelation) setFamilyRelation(profile.familyRelation);
      if (profile.familyEmail) setFamilyEmail(profile.familyEmail);
    }

    const rawMeds = getMedicines();

    // Automatically decrement remaining days based on time elapsed since start date
    const updatedMeds = rawMeds.map(med => {
      if (!med.startDate || !med.initialDurationDays) return med;

      const startMs = new Date(med.startDate).getTime();
      const currentMs = Date.now();
      const daysPassed = Math.floor((currentMs - startMs) / (1000 * 60 * 60 * 24));

      let remaining = med.initialDurationDays - daysPassed;
      if (remaining < 0) remaining = 0;

      return {
        ...med,
        durationDays: remaining
      };
    });

    setMedicines(updatedMeds);
    saveMedicines(updatedMeds);

    // Fetch saved scan reports
    const savedReports = getReports();
    setReports(savedReports);
  }, []);

  const handleDeleteMedicine = (id) => {
    const updated = medicines.filter(med => med.id !== id);
    saveMedicines(updated);
    setMedicines(updated);
    toast.success('Medicine removed from history.');
  };

  const handleUpdatePreferences = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter your full name!');
      return;
    }

    const existing = getProfileData() || {};
    const updated = {
      ...existing,
      name: name.trim(),
      age,
      familyName: familyName.trim(),
      familyRelation,
      familyEmail: familyEmail.trim(),
    };

    const success = saveProfileData(updated);
    if (success) {
      toast.success('Preferences updated successfully!');
    } else {
      toast.error('Failed to save preferences.');
    }
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear your local storage data?')) {
      localStorage.clear();
      setName('');
      setAge('');
      setFamilyName('');
      setFamilyEmail('');
      setMedicines([]);
      setReports([]);
      toast.success('Local data cleared.');
      navigate('/');
    }
  };

  return (
    <div className="relative z-10 flex flex-col justify-between min-h-[90vh] py-2 px-1 text-[#1E0038] space-y-3">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <BackButton onClick={() => navigate('/manual-entry')} />
          <span className="text-xs font-black text-white px-3.5 py-1.5 rounded-full bg-linear-to-r from-purple-700 to-indigo-700 border-2 border-white shadow-md">
            My Profile & History
          </span>
        </div>

        <div>
          <div className="inline-block px-3 py-1 rounded-xl bg-purple-200/90 border border-purple-400 mb-1 shadow-xs">
            <h2 className="text-2xl font-black text-[#1E0038]">My Profile</h2>
          </div>
          <p className="text-xs font-black text-[#2B0054]">
            Manage account preferences and view active medicine history
          </p>
        </div>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">

          <div className="p-4 rounded-2xl bg-white/95 backdrop-blur-xl border-2 border-purple-400 shadow-xl space-y-2">
            <label className="text-[11px] font-black text-[#2B0054] uppercase tracking-wider block">
              Patient Details
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-black text-purple-800 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-purple-50 border-2 border-purple-300 text-[#1E0038] text-xs font-black focus:outline-none focus:border-purple-700"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-purple-800 block mb-1">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-purple-50 border-2 border-purple-300 text-[#1E0038] text-xs font-black focus:outline-none focus:border-purple-700"
                />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/95 backdrop-blur-xl border-2 border-purple-400 shadow-xl space-y-2">
            <label className="text-[11px] font-black text-[#2B0054] uppercase tracking-wider block">
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
                  className="w-full px-3 py-2 rounded-xl bg-purple-50 border-2 border-purple-300 text-[#1E0038] text-xs font-black focus:outline-none focus:border-purple-700"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-purple-800 block mb-1">Relation</label>
                <select
                  value={familyRelation}
                  onChange={(e) => setFamilyRelation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-purple-50 border-2 border-purple-300 text-[#1E0038] text-xs font-black focus:outline-none focus:border-purple-700 cursor-pointer"
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
                className="w-full px-3 py-2 rounded-xl bg-purple-50 border-2 border-purple-300 text-[#1E0038] text-xs font-black focus:outline-none focus:border-purple-700"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/95 backdrop-blur-xl border-2 border-purple-400 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-purple-200 pb-2">
              <label className="text-[11px] font-black text-[#2B0054] uppercase tracking-wider">
                Active Medicine History Timeline
              </label>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-700 text-white text-[10px] font-black">
                {medicines.length} Active
              </span>
            </div>

            {medicines.length === 0 ? (
              <p className="text-xs font-bold text-purple-800/80 text-center py-3">
                No active medicines registered yet.
              </p>
            ) : (
              <div className="space-y-3">
                {medicines.map((med, index) => {
                  const initialDays = med.initialDurationDays || 7;
                  const start = new Date(med.startDate || Date.now());
                  const today = new Date();
                  const diffTime = today - start;
                  const daysPassed = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
                  const isComplete = med.durationDays === 0;

                  return (
                    <div key={med.id || index} className="p-3.5 rounded-xl bg-purple-50/90 border-2 border-purple-300 space-y-2 shadow-xs">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-[#1E0038] uppercase">{med.name}</h4>
                        <div className="flex items-center gap-2">
                          {isComplete && (
                            <span className="text-[9px] font-black px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full flex items-center gap-1">
                              🎉 Course Complete
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteMedicine(med.id)}
                            className="text-[10px] font-black px-2 py-0.5 bg-rose-100 text-rose-700 border border-rose-300 rounded-lg hover:bg-rose-200 cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      <div className="text-[10px] font-bold text-purple-900 flex flex-wrap gap-3 pt-0.5">
                        <span><strong>Dosage:</strong> {med.dosage}</span>
                        <span><strong>Slot:</strong> {med.foodSlot}</span>
                        <span><strong>Duration Left:</strong> {med.durationDays} Days</span>
                      </div>

                      {/* Treatment Journey Day-Markers Visual */}
                      <div className="mt-2 pt-2 border-t border-purple-200/70">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[9px] font-black uppercase tracking-wider text-purple-900/60">
                            Treatment Journey Progress
                          </span>
                          <span className="text-[9px] font-black text-purple-700">
                            Day {Math.min(initialDays, daysPassed + 1)} of {initialDays}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                          {Array.from({ length: initialDays }).map((_, dIndex) => {
                            const dayNum = dIndex + 1;
                            const hasPassed = dIndex <= daysPassed;
                            const isLastDay = dIndex === initialDays - 1;

                            return (
                              <div key={dIndex} className="flex flex-col items-center gap-0.5">
                                {isLastDay && isComplete ? (
                                  <div className="w-4.5 h-4.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-black shadow-sm">
                                    ✓
                                  </div>
                                ) : hasPassed ? (
                                  <div className="w-3.5 h-3.5 rounded-full bg-purple-600 shadow-sm flex items-center justify-center text-[7px] text-white font-bold">
                                    •
                                  </div>
                                ) : (
                                  <div className="w-3.5 h-3.5 rounded-full border-2 border-purple-300 bg-white" />
                                )}
                                <span className="text-[8px] font-bold text-purple-900/40">{dayNum}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {med.notes && (
                        <p className="text-[10px] font-medium text-purple-800 italic pt-1 border-t border-purple-200/60">
                          Note: {med.notes}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Report History Section inside Profile */}
          <div className="p-4 rounded-2xl bg-white/95 backdrop-blur-xl border-2 border-purple-400 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-purple-200 pb-2">
              <label className="text-[11px] font-black text-[#2B0054] uppercase tracking-wider">
                Scanned Report History
              </label>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-700 text-white text-[10px] font-black">
                {reports.length} Reports
              </span>
            </div>

            {reports.length === 0 ? (
              <p className="text-xs font-bold text-purple-800/80 text-center py-2">
                No lab reports scanned yet. Visit the Reports section to upload.
              </p>
            ) : (
              <div className="space-y-2">
                {reports.map((rep, rIdx) => (
                  <div key={rIdx} className="p-3 rounded-xl bg-indigo-50/90 border-2 border-indigo-200 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-black text-[#1E0038]">{rep.title || 'Lab / Blood Report'}</h4>
                      <p className="text-[10px] text-indigo-800 font-bold">{rep.date || 'Recent Scan'}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate('/reports')}
                      className="text-[10px] font-black px-2.5 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer"
                    >
                      View Details →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-white/95 backdrop-blur-xl border-2 border-purple-400 shadow-xl space-y-2">
            <label className="text-[11px] font-black text-[#2B0054] uppercase tracking-wider block">
              Data Management
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleUpdatePreferences}
                className="flex-1 py-2.5 rounded-xl bg-purple-700 text-white text-xs font-black shadow-md hover:bg-purple-800 active:scale-95 transition-all cursor-pointer"
              >
                Update Preferences
              </button>
              <button
                type="button"
                onClick={handleClearData}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-black shadow-md hover:bg-rose-700 active:scale-95 transition-all cursor-pointer"
              >
                Clear Local Data
              </button>
            </div>
          </div>

        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate('/manual-entry')}
        className="w-full py-3.5 bg-linear-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white font-black text-xs rounded-full shadow-xl shadow-purple-600/40 border-2 border-white/60 active:scale-95 transition-all cursor-pointer uppercase tracking-wider"
      >
        ← Back to Manual Entry
      </button>
    </div>
  );
}
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { getMedicines, saveMedicines } from '../utils/storage';
import { sendFamilyAlert } from '../utils/emailAlerts';
import toast from 'react-hot-toast';

const AlarmContext = createContext();
const MISSED_DOSE_THRESHOLD_MS = 45 * 60 * 1000;

export const AlarmProvider = ({ children }) => {
  const [activeAlert, setActiveAlert] = useState(null);
  const missedTimers = useRef({});
  const audioUnlocked = useRef(false);
  
  // 🎥 STABLE AUDIO ENGINE REFERENCE
  const audioRef = useRef(null);

  // Initialize the audio instance once when the app loads
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/chime.mp3');
      audioRef.current.loop = true; // Loops the chime continuously until handled
      audioRef.current.volume = 1.0;
    }
  }, []);

  // Unlocks audio permissions as soon as the user touches/clicks anywhere on the page
  useEffect(() => {
    const unlockAudio = () => {
      if (audioUnlocked.current || !audioRef.current) return;
      
      audioRef.current.play()
        .then(() => {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          audioUnlocked.current = true;
          console.log('🔊 Audio playback system successfully unlocked!');
        })
        .catch(() => {
          // Browser still blocked it, will try again on next user click
        });
    };

    document.addEventListener('click', unlockAudio);
    document.addEventListener('touchstart', unlockAudio);

    return () => {
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
    };
  }, []);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const checkAlarms = () => {
      let medicines = getMedicines();
      if (!medicines || medicines.length === 0) return;

      const todayStr = new Date().toDateString();
      const needsReset = medicines.some(m => m.takenToday && m.takenDate !== todayStr);
      if (needsReset) {
        medicines = medicines.map(m =>
          m.takenToday && m.takenDate !== todayStr
            ? { ...m, takenToday: false, takenDate: undefined }
            : m
        );
        saveMedicines(medicines);
      }

      const now = new Date();
      const currentTimeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      // 🛠️ FIXED TEST LINE: Passes only the first single object item, not the entire array array
      //if (medicines.length > 0) { 
      //  triggerAlarm(medicines[0]); 
      //  return; 
      //}

      medicines.forEach(med => {
        if (med.takenToday) return;
        if (med.snoozedUntil && Date.now() < med.snoozedUntil) return;

        const times = med.times || [med.time || '08:00'];
        if (times.includes(currentTimeString)) {
          triggerAlarm(med);
        }
      });
    };

    const interval = setInterval(checkAlarms, 30000);
    return () => clearInterval(interval);
  }, [activeAlert]); // Keep tracking activeAlert context state safely

  const triggerAlarm = (med) => {
    // Avoid double triggering if this exact popup alert is already active on screen
    if (activeAlert?.id === med.id) return;
    
    setActiveAlert(med);

    // ⚡ FORCE RE-LOAD & PLAY
    if (audioRef.current) {
      try {
        audioRef.current.src = '/chime.mp3'; // Force explicitly set root domain asset path
        audioRef.current.load();             // Tell the browser to reload the audio binary data stream
        
        audioRef.current.play().catch(e => {
          console.warn("⚠️ Audio autoplay blocked! Please click anywhere on the webpage window to allow sound.", e);
        });
      } catch (err) {
        console.error("Audio playback error:", err);
      }
    }

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`Medication Reminder: ${med.name}`, {
        body: `Time to take your dose: ${med.dosage || '1 pill'} (${med.foodSlot || 'As directed'})`,
        icon: '/favicon.ico'
      });
    }

    toast.error(`⏰ Time for ${med.name} (${med.dosage})!`, { duration: 10000, id: `alarm-${med.id}` });

    if (missedTimers.current[med.id]) clearTimeout(missedTimers.current[med.id]);
    missedTimers.current[med.id] = setTimeout(() => {
      handleMissedDose(med);
    }, MISSED_DOSE_THRESHOLD_MS);
  };

  const handleMissedDose = async (med) => {
    const current = getMedicines().find(m => m.id === med.id);
    if (!current || current.takenToday) return;

    toast.error(`Missed dose detected for ${med.name}! Alerting family.`, { duration: 5000 });

    const result = await sendFamilyAlert('missed_dose', med.name);
    if (result.success) {
      toast.success(`Family notified about missed ${med.name}.`, { id: 'missed-email-sent' });
    }

    if (window.triggerMissedDoseAlert) {
      window.triggerMissedDoseAlert(med.name);
    }
  };

  const clearMissedTimer = (medId) => {
    if (missedTimers.current[medId]) {
      clearTimeout(missedTimers.current[medId]);
      delete missedTimers.current[medId];
    }
  };

  // 🛑 HELPER TO STOP AUDIO CLEANLY
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleTaken = () => {
    if (!activeAlert) return;
    clearMissedTimer(activeAlert.id);
    stopAudio(); // <-- Silences the sound engine

    const medicines = getMedicines();
    const updated = medicines.map(m =>
      m.id === activeAlert.id
        ? { ...m, takenToday: true, takenDate: new Date().toDateString() }
        : m
    );
    saveMedicines(updated);
    toast.success(`Great job! Marked ${activeAlert.name} as taken.`, { id: 'taken-toast' });
    setActiveAlert(null);
  };

  const handleSnooze = () => {
    if (!activeAlert) return;
    stopAudio(); // <-- Silences the sound engine
    
    const snoozeTime = Date.now() + 10 * 60 * 1000;
    const medicines = getMedicines();
    const updated = medicines.map(m =>
      m.id === activeAlert.id ? { ...m, snoozedUntil: snoozeTime } : m
    );
    saveMedicines(updated);
    toast('Snoozed for 10 minutes.', { icon: '⏱️', id: 'snooze-toast' });
    setActiveAlert(null);
  };

  return (
    <AlarmContext.Provider value={{ triggerAlarm }}>
      {children}

      {activeAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white/95 backdrop-blur-xl border-4 border-purple-400 rounded-3xl p-6 w-full max-w-sm text-center shadow-2xl space-y-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto text-3xl shadow-inner animate-bounce">
              ⏰
            </div>
            <div>
              <h2 className="text-lg font-black text-[#1E0038] uppercase">Medication Due!</h2>
              <p className="text-xs text-purple-800 font-bold mt-1">It's time to take your scheduled medicine.</p>
            </div>

            <div className="p-3 bg-purple-50 rounded-2xl border-2 border-purple-200 text-left space-y-1">
              <p className="text-xs font-black text-[#1E0038]">💊 {activeAlert.name}</p>
              <p className="text-[11px] text-purple-900"><strong>Dosage:</strong> {activeAlert.dosage || 'As prescribed'}</p>
              <p className="text-[11px] text-purple-900"><strong>Instruction:</strong> {activeAlert.foodSlot || 'With water'}</p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleSnooze}
                className="flex-1 py-3 bg-amber-100 text-amber-900 border-2 border-amber-300 font-black text-xs rounded-2xl shadow hover:bg-amber-200 active:scale-95 transition-all cursor-pointer"
              >
                Snooze (10m) ⏱️
              </button>
              <button
                type="button"
                onClick={handleTaken}
                className="flex-1 py-3 bg-purple-600 text-white font-black text-xs rounded-2xl shadow-lg hover:bg-purple-700 active:scale-95 transition-all cursor-pointer"
              >
                Mark Taken ✅
              </button>
            </div>
          </div>
        </div>
      )}
    </AlarmContext.Provider>
  );
};

export const useAlarm = () => useContext(AlarmContext);
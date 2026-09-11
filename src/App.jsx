import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { AlarmProvider } from './components/AlarmProvider';
import Background3DScene from './scenes/Background3DScene';
import Landing from './pages/Landing';
import InitialSetup from './pages/InitialSetup'; // Added new setup import
import OnboardingScenes from './pages/OnboardingScenes';
import Login from './pages/Login';
import Profile from './pages/Profile';
import ManualEntry from './pages/ManualEntry';
import TimetableHub from './pages/TimetableHub';
import Timetable from './pages/Timetable';
import ScanPrescription from './pages/ScanPrescription';
import AIParse from './pages/AIParse';
import Reports from './pages/Reports';
import CheckIn from './components/CheckIn';

export default function App() {
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [missedMedName, setMissedMedName] = useState(null);

  // Automatic evening check-in (after 6 PM, once per day)
  useEffect(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const todayStr = now.toDateString();
    const lastCheckedDate = localStorage.getItem('medremind_last_checkin_date');

    if (currentHour >= 18 && lastCheckedDate !== todayStr) {
      setMissedMedName(null);
      setShowCheckIn(true);
      localStorage.setItem('medremind_last_checkin_date', todayStr);

      toast('AI Companion: Time for your evening check-in!');
    }
  }, []);

  useEffect(() => {
    window.triggerMissedDoseAlert = (medicineName) => {
      setMissedMedName(medicineName);
      setShowCheckIn(true);

      toast.error(`Missed dose detected for ${medicineName}! Alerting family.`, {
        duration: 4000,
      });
    };

    return () => {
      delete window.triggerMissedDoseAlert;
    };
  }, []);

  useEffect(() => {
    window.triggerManualCheckIn = () => {
      setMissedMedName(null);
      setShowCheckIn(true);
    };

    return () => {
      delete window.triggerManualCheckIn;
    };
  }, []);

  return (
    <AlarmProvider>
      <div className="relative min-h-screen overflow-hidden flex flex-col justify-between">
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            style: {
              borderRadius: '16px',
              background: '#FFD700',
              color: '#1E0038',
              fontSize: '14px',
              fontWeight: '700',
              border: '2px solid #FFFFFF',
              boxShadow: '0 10px 25px -5px rgba(255, 215, 0, 0.4)',
            },
            success: {
              iconTheme: { primary: '#1E0038', secondary: '#FFD700' },
            },
          }}
        />

        <Background3DScene />

        <main className="relative z-10 max-w-sm w-full mx-auto min-h-screen p-4 flex flex-col justify-between">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/setup" element={<InitialSetup />} /> {/* Added Setup Route */}
            <Route path="/scenes" element={<OnboardingScenes />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/manual-entry" element={<ManualEntry />} />
            <Route path="/timetable-hub" element={<TimetableHub />} />
            <Route path="/timetable" element={<Timetable />} />
            <Route path="/scan-prescription" element={<ScanPrescription />} />
            <Route path="/ai-parse" element={<AIParse />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </main>

        <CheckIn
          isOpen={showCheckIn}
          onClose={() => setShowCheckIn(false)}
          missedMedicineName={missedMedName}
        />
      </div>
    </AlarmProvider>
  );
}
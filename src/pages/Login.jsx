import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import BackButton from '../components/BackButton';
import { getProfileData } from '../utils/storage';

export default function Login({ onBackToLanding }) {
  const navigate = useNavigate();
  const [accessCode, setAccessCode] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const cleanCode = accessCode.trim().toLowerCase();

    if (!cleanCode) {
      toast.error('Please enter your access code.');
      return;
    }

    // Retrieve the saved profile from storage
    const savedProfile = getProfileData();

    // Check if a profile exists
    if (!savedProfile || !savedProfile.name) {
      toast.error("This code doesn't exist! Please set up a profile first.");
      return;
    }

    const validName = savedProfile.name.trim().toLowerCase();
    const validAge = savedProfile.age ? savedProfile.age.toString().trim().toLowerCase() : '';
    
    // Possible valid combinations a user might enter:
    // 1. Name + Age (e.g., "ishika19")
    // 2. Just Name (e.g., "ishika")
    const combinedCode = `${validName}${validAge}`;
    const nameOnlyCode = validName;

    // Check if the entered code matches either the combined code or just the name
    if (cleanCode !== combinedCode && cleanCode !== nameOnlyCode) {
      toast.error("This code doesn't exist!");
      return;
    }

    // If valid, log in successfully
    toast.success(`Welcome back, ${savedProfile.name}! Signed in successfully.`);
    navigate('/scenes');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl border border-white/50 relative text-[#1E0038]">
        
        {/* BACK BUTTON */}
        <div className="absolute top-6 left-6">
          <BackButton 
            onClick={() => {
              toast('Returned to landing page', );
              if (typeof onBackToLanding === 'function') {
                onBackToLanding();
              } else {
                navigate('/');
              }
            }} 
          />
        </div>

        <div className="mt-8 animate-fadeIn space-y-6">
          
          <div className="text-center pt-2">
            <span className="text-xs font-black text-white px-3.5 py-1.5 rounded-full bg-linear-to-r from-purple-700 to-indigo-700 border-2 border-white shadow-md inline-block mb-3">
              Existing Account
            </span>
            <h2 className="text-2xl font-black text-gray-800">Welcome Back</h2>
            <p className="text-gray-500 text-xs mt-1">
              Login with your code (Your Name + Age, e.g., <span className="text-pink-600 font-black">Ishika19</span>)
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* INPUT CONTAINER WITH EXACT SETUP PAGE BORDER STYLE */}
            <div className="p-4 rounded-2xl bg-white/50 border border-purple-200 shadow-sm space-y-2">
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Enter Your Code
              </label>
              <div className="relative">
                <KeyRound className="w-5 h-5 absolute left-3.5 top-3.5 text-purple-500" />
                <input
                  type="text"
                  placeholder="e.g. Ishika19"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/60 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-gray-800 font-medium placeholder-gray-400 transition-all duration-200"
                />
              </div>
            </div>

            {/* PRIMARY BUTTON */}
            <button
              type="submit"
              className="w-full py-4 bg-linear-to-r from-purple-600 to-pink-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-purple-300/50 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              <span>Save & Go to Main Page</span>
              <Sparkles className="w-5 h-5" />
            </button>
          </form>

          {/* SWITCH BUTTON WITH MATCHING SETUP PAGE BORDER */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                toast('Navigating to profile setup', { icon: '📝' });
                navigate('/scenes'); // Updated to route directly to scenes/setup instead of /language
              }}
              className="w-full py-3.5 rounded-2xl bg-white/50 text-gray-700 font-medium text-xs border border-purple-200 shadow-sm transition-all duration-300 transform hover:scale-[1.01] hover:bg-white hover:border-purple-300 active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
            >
              <span>← Don't have an account? Setup Profile</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="relative z-10 flex flex-col justify-between min-h-[92vh] py-2 px-1 text-[#2B0054]">
      {/* Top Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-end">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100/70 backdrop-blur-md border border-purple-300 shadow-2xs">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-linear-to-r from-pink-500 to-purple-600 text-white text-[11px] font-extrabold shadow-2xs">
              ♥
            </span>
            <span className="font-black text-sm tracking-tight text-[#2B0054]">MedRemind-AI</span>
          </div>
        </div>

        <div>
          <span className="inline-block text-[11px] font-bold text-[#3B0764] px-3.5 py-1 rounded-full bg-purple-100/60 backdrop-blur-md border border-purple-300 shadow-2xs">
            Your Health. Our Care. Always There.
          </span>
        </div>
      </div>

      {/* Hero Content */}
      <div className="my-auto py-4 space-y-2.5 w-full">
        <h1 className="text-3xl font-black tracking-tight leading-tight text-[#2B0054]">
          Your Medicine. <br />
          <span className="text-[#560BAD]">Your Routine.</span> <br />
          <span className="bg-linear-to-r from-[#7209B7] via-[#F72585] to-[#3A0CA3] bg-clip-text text-transparent">
            Your Companion.
          </span>
        </h1>
        <p className="text-xs font-semibold text-[#3B0764]/90 leading-relaxed max-w-xs">
          Smart reminders, AI guidance and daily check-ins.
        </p>
      </div>

      {/* Primary and Secondary CTA Buttons */}
      <div className="space-y-3 pt-2">
        {/* Primary CTA Button with Full Violet Glow Aura */}
        <div className="relative group">
          {/* Violet Gradient Pop Effect Behind the Whole Button */}
          <div className="absolute -inset-1 bg-linear-to-r from-violet-600 via-purple-500 to-indigo-600 rounded-full blur-md opacity-20 group-hover:opacity-75 group-active:opacity-100 group-active:scale-105 transition-all duration-200 -z-10" />

          <button
            onClick={() => navigate('/setup')}
            className="w-full py-3.5 bg-linear-to-r from-[#FF1493] via-[#8B5CF6] to-[#4361EE] hover:from-[#4361EE] hover:to-[#FF1493] text-white font-extrabold text-sm rounded-full shadow-lg shadow-pink-500/30 active:scale-95 transition-all duration-150 flex items-center justify-center gap-2 border border-white/30 cursor-pointer"
          >
            <span>Get Started</span>
            <span className="text-base transition-transform group-hover:translate-x-1">→</span>
          </button>
        </div>

        {/* Secondary Glass Button with Richer Lavender Water Tint */}
        <div className="relative group">
          {/* Lavender Pop Glow Behind the Whole Button */}
          <div className="absolute -inset-1 bg-linear-to-r from-violet-400 to-purple-500 rounded-full blur-md opacity-0 group-hover:opacity-60 group-active:opacity-100 group-active:scale-102 transition-all duration-200 -z-10" />

          <button
            onClick={() => navigate('/login')}
            className="w-full py-3 bg-purple-100/70 hover:bg-purple-100 backdrop-blur-md font-bold text-xs text-[#2B0054] rounded-full active:scale-95 transition-all duration-150 border border-purple-300 shadow-2xs cursor-pointer"
          >
            I have an account
          </button>
        </div>
      </div>
    </div>
  );
}
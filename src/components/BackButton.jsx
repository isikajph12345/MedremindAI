import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function BackButton({ onClick, className = '' }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`px-3.5 py-1.5 rounded-full bg-linear-to-r from-purple-700 to-indigo-700 text-white font-black text-xs transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md flex items-center gap-1.5 cursor-pointer border-2 border-white ${className}`}
      aria-label="Go Back"
    >
      <ArrowLeft className="w-4 h-4 stroke-[3px]" />
      <span>Back</span>
    </button>
  );
}
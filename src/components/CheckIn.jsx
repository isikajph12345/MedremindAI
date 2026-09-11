import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { sendFamilyAlert } from '../utils/emailAlerts';

export default function CheckIn({ isOpen, onClose, missedMedicineName }) {
  const [answered, setAnswered] = useState(false);
  const [mood, setMood] = useState(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAnswered(false);
      setMood(null);
      setSending(false);
    }
  }, [isOpen, missedMedicineName]);

  if (!isOpen) return null;

  const handleAnswer = (value) => {
    setMood(value);
    setAnswered(true);

    // Log the check-in
    const logs = JSON.parse(localStorage.getItem('medremind_checkins') || '[]');
    logs.push({ date: new Date().toISOString(), mood: value });
    localStorage.setItem('medremind_checkins', JSON.stringify(logs));
  };

  const handleManualNotifyEmail = async () => {
    setSending(true);
    const result = await sendFamilyAlert('worse_checkin');
    setSending(false);

    if (result.success) {
      toast.success('Email sent to your family contact.');
    } else if (result.reason === 'no_email') {
      toast.error('No family email saved — add one in Profile first.');
    } else {
      toast.error('Could not send email. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl space-y-3 relative">
        
        {/* Optional small close X button on top right */}
        <button 
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-xs cursor-pointer"
        >
          ✕
        </button>

        <div>
          <h3 className="text-sm font-black text-[#2B0054]">
            {missedMedicineName ? 'Missed Dose Alert Sent!' : 'How are you feeling today?'}
          </h3>
          <p className="text-xs text-[#2B0054] font-bold mt-0.5">
            {missedMedicineName
              ? `An automatic notification email has been dispatched to your family for missing ${missedMedicineName}.`
              : 'Your daily check-in helps monitor your wellness progress.'}
          </p>
        </div>

        {!answered && !missedMedicineName ? (
          <div className="grid grid-cols-3 gap-2 pt-2">
            <button
              type="button"
              onClick={() => handleAnswer('Better')}
              className="py-3 px-2 rounded-2xl bg-linear-to-br from-green-500 to-emerald-600 text-white font-black text-xs shadow-md cursor-pointer hover:scale-105 transition-all"
            >
              😊 Better
            </button>
            <button
              type="button"
              onClick={() => handleAnswer('Same')}
              className="py-3 px-2 rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 text-white font-black text-xs shadow-md cursor-pointer hover:scale-105 transition-all"
            >
              😐 Same
            </button>
            <button
              type="button"
              onClick={() => handleAnswer('Worse')}
              className="py-3 px-2 rounded-2xl bg-linear-to-br from-rose-500 to-pink-600 text-white font-black text-xs shadow-md cursor-pointer hover:scale-105 transition-all"
            >
              🤒 Worse
            </button>
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            {mood && mood !== 'Worse' && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 space-y-3 text-center">
                <p className="text-xs font-black text-emerald-900">Thanks for checking in! Take care. 💚</p>
                {/* Done / Return back button */}
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow cursor-pointer transition-all uppercase tracking-wide"
                >
                  ← Done / Return to Dashboard
                </button>
              </div>
            )}

            {(mood === 'Worse' || missedMedicineName) && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-300 space-y-3 text-center">
                <p className="text-xs font-black text-rose-900 leading-relaxed">
                  {missedMedicineName
                    ? 'Your family has been automatically alerted via email. They can call you to support your recovery.'
                    : 'It might help to check in with your doctor or family right away.'}
                </p>
                <div className="flex flex-col gap-2">
                  {!missedMedicineName && (
                    <button
                      type="button"
                      onClick={handleManualNotifyEmail}
                      disabled={sending}
                      className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl shadow cursor-pointer transition-all uppercase tracking-wide flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      {sending ? 'Sending...' : '✉️ Email Family Now'}
                    </button>
                  )}
                  {/* Done / Return back button */}
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-2.5 bg-gray-800 hover:bg-black text-white text-xs font-black rounded-xl shadow cursor-pointer transition-all uppercase tracking-wide"
                  >
                    ← Done / Return to Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
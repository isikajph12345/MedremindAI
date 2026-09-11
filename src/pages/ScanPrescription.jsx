import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Scene02Scanning from '../components/Scene02Scanning';
import toast from 'react-hot-toast';

export default function ScanPrescription() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUploadAndScan = async () => {
    if (!selectedFile) {
      toast.error('Please select or capture a prescription image first!');
      return;
    }

    setIsScanning(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://localhost:8000/api/scan-prescription', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success && Array.isArray(data.medicines) && data.medicines.length > 0) {
        toast.success(`AI read ${data.medicines.length} medicine(s) from your prescription!`);
        navigate('/ai-parse', { state: { medicines: data.medicines } });
      } else if (data.success && data.medicines) {
        toast.error('No medicines detected — try a clearer photo.');
      } else {
        toast.error(data.error || 'AI could not read this prescription.');
      }
    } catch (error) {
      console.error('Backend connection error:', error);
      toast.error('Could not connect to server. Ensure backend is running.');
    } finally {
      setIsScanning(false);
    }
  };

  // Back button now behaves contextually:
  // - While scanning: cancel the scan and return to the upload screen (no navigation, no blank page)
  // - Otherwise: go to whichever page the user actually came from
  const handleBack = () => {
    if (isScanning) {
      setIsScanning(false);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="relative z-10 flex flex-col justify-between min-h-[90vh] py-3 px-2 text-[#1E0038] space-y-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <BackButton onClick={handleBack} />
          <span className="text-xs font-black text-white px-3 py-1.5 rounded-full bg-indigo-600 border-2 border-white shadow-md">
             Prescription AI Scan
          </span>
        </div>

        {isScanning ? (
          <Scene02Scanning />
        ) : (
          <div className="p-4 rounded-3xl bg-white/90 backdrop-blur-md border-2 border-purple-200 shadow-lg text-center space-y-3">
            <h3 className="text-sm font-black text-purple-900">Upload Prescription Photo</h3>
            <p className="text-xs text-indigo-700 font-bold">
              Snap a picture or upload an existing photo of your prescription. Our AI will read it and extract your medicines directly.
            </p>

            {previewUrl && (
              <div className="relative w-full h-36 rounded-xl overflow-hidden border-2 border-purple-300 shadow-inner">
                <img src={previewUrl} alt="Prescription preview" className="w-full h-full object-cover" />
              </div>
            )}

            <label className="block w-full py-3 bg-linear-to-r from-purple-600 to-indigo-600 text-white text-xs font-black rounded-2xl shadow-md cursor-pointer hover:opacity-95 transition-all text-center">
               Choose Image / Take Photo
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleUploadAndScan}
        disabled={!selectedFile || isScanning}
        className={`w-full py-3 text-white font-black text-xs rounded-full shadow-lg border-2 border-white/60 transition-all uppercase tracking-wider ${
          !selectedFile || isScanning ? 'bg-gray-400 cursor-not-allowed' : 'bg-linear-to-r from-purple-600 to-indigo-600 active:scale-95 cursor-pointer'
        }`}
      >
        {isScanning ? 'Reading with AI...' : 'Start AI Scan '}
      </button>
    </div>
  );
}
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUploader from '../components/ImageUploader';
import Loading from '../components/Loading';
import { predictCropDisease } from '../services/api';
import { AlertTriangle } from 'lucide-react';

export default function Scan() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleAnalyze = async (file) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await predictCropDisease(file);
      setIsLoading(false);
      if (data && data.disease) {
        // Navigate to result page passing state
        navigate('/result', { state: { resultData: data } });
      } else {
        setError('Failed to analyze image. Please try again.');
      }
    } catch (err) {
      setIsLoading(false);
      const detail = err.response?.data?.detail || err.message || 'Server connection error.';
      setError(detail);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-white mb-2">Scan Crop Leaf</h1>
        <p className="text-sm text-slate-400">
          Upload a high-resolution image of a tomato leaf to get instant disease diagnosis & management guide.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-3 text-sm max-w-2xl mx-auto">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {isLoading ? (
        <Loading message="AI Model Analyzing Tomato Leaf Features..." />
      ) : (
        <ImageUploader onAnalyze={handleAnalyze} isLoading={isLoading} />
      )}
    </div>
  );
}

const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);

    reader.onerror = (error) => reject(error);
  });
};

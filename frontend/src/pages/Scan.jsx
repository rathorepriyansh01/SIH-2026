import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ImageUploader from '../components/ImageUploader';
import FarmContextForm from '../components/FarmContextForm';
import Loading from '../components/Loading';

import { predictCropDisease } from '../services/api';
import { AlertTriangle } from 'lucide-react';

export default function Scan() {

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Selected image temporarily store karenge
  const [selectedFile, setSelectedFile] = useState(null);

  // Farm form show/hide
  const [showFarmForm, setShowFarmForm] = useState(false);

  const navigate = useNavigate();


  // ========================================
  // STEP 1: Image selected
  // ========================================

  const handleImageSelected = (file) => {

    setSelectedFile(file);

    setError(null);

    // Image ke baad farm context form dikhao
    setShowFarmForm(true);
  };


  // ========================================
  // STEP 2: Farm form submitted
  // ========================================

  const handleAnalyze = async (farmData) => {

    if (!selectedFile) {

      setError(
        'Please select a  leaf image first.'
      );

      return;
    }

    setIsLoading(true);
    setError(null);

    try {

      // ========================================
      // Create image preview
      // ========================================

      const imageUrl = await convertToBase64(
        selectedFile
      );


      // ========================================
      // Send IMAGE + FARM DATA to backend
      // ========================================

      const data = await predictCropDisease(
        selectedFile,
        farmData
      );


      console.log(
        'Prediction Response:',
        data
      );


      // ========================================
      // Check new backend response structure
      // ========================================

      if (
        data &&
        data.detection &&
        data.detection.disease
      ) {

        navigate('/result', {

          state: {

            // Complete backend response
            resultData: data,

            // Uploaded image
            imageUrl: imageUrl

          }

        });

      } else {

        setError(
          'Failed to analyze image. Please try again.'
        );

      }

    } catch (err) {

      console.error(
        'Prediction Error:',
        err
      );

      console.error(
        'Backend Response:',
        err.response
      );

      const detail =
        err.response?.data?.detail ||
        err.message ||
        'Server connection error.';

      setError(detail);

    } finally {

      setIsLoading(false);

    }

  };


  // ========================================
  // UI
  // ========================================

  return (

    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">


      {/* ================================== */}
      {/* HEADER */}
      {/* ================================== */}

      <div className="text-center">

        <h1 className="text-3xl font-extrabold text-white mb-2">

          Scan Crop Leaf

        </h1>


        <p className="text-sm text-slate-400">

          Upload a high-resolution image of a
           leaf to get instant disease
          diagnosis & management guide.

        </p>

      </div>



      {/* ================================== */}
      {/* ERROR */}
      {/* ================================== */}

      {error && (

        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-3 text-sm max-w-2xl mx-auto">

          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />

          <span>{error}</span>

        </div>

      )}



      {/* ================================== */}
      {/* LOADING */}
      {/* ================================== */}

      {isLoading ? (

        <Loading
          message="AI Model Analyzing  Leaf Features..."
        />

      ) : showFarmForm ? (

        /* ================================== */
        /* FARM CONTEXT FORM */
        /* ================================== */

        <FarmContextForm
          onSubmit={handleAnalyze}
          isLoading={isLoading}
        />

      ) : (

        /* ================================== */
        /* IMAGE UPLOADER */
        /* ================================== */

        <ImageUploader
          onAnalyze={handleImageSelected}
          isLoading={isLoading}
        />

      )}

    </div>

  );
}



// ========================================
// Convert uploaded image to Base64
// ========================================

const convertToBase64 = (file) => {

  return new Promise((resolve, reject) => {

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {

      resolve(reader.result);

    };

    reader.onerror = (error) => {

      reject(error);

    };

  });

};
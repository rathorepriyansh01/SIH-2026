import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ImageUploader from '../components/ImageUploader';
import FarmContextForm from '../components/FarmContextForm';
import Loading from '../components/Loading';

import { predictCropDisease } from '../services/api';
import { AlertTriangle } from 'lucide-react';

import { useLanguage } from '../i18n/LanguageContext';

export default function Scan() {

  const { language } = useLanguage();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);

  const [showFarmForm, setShowFarmForm] = useState(false);

  const navigate = useNavigate();


  // ========================================
  // TRANSLATIONS
  // ========================================

  const text = language === 'hi'
    ? {
        title: 'फसल की पत्ती स्कैन करें',

        description:
          'तुरंत रोग की पहचान और प्रबंधन संबंधी मार्गदर्शन प्राप्त करने के लिए पत्ती की उच्च-रिज़ॉल्यूशन तस्वीर अपलोड करें।',

        selectImage:
          'कृपया पहले पत्ती की तस्वीर चुनें।',

        analyzeError:
          'तस्वीर का विश्लेषण नहीं हो सका। कृपया दोबारा प्रयास करें।',

        loading:
          'AI मॉडल पत्ती के फीचर्स का विश्लेषण कर रहा है...',

        serverError:
          'सर्वर से कनेक्शन में समस्या हुई।',
      }
    : {
        title: 'Scan Crop Leaf',

        description:
          'Upload a high-resolution image of a leaf to get instant disease diagnosis & management guide.',

        selectImage:
          'Please select a leaf image first.',

        analyzeError:
          'Failed to analyze image. Please try again.',

        loading:
          'AI Model Analyzing Leaf Features...',

        serverError:
          'Server connection error.',
      };


  // ========================================
  // STEP 1: IMAGE SELECTED
  // ========================================

  const handleImageSelected = (file) => {

    setSelectedFile(file);

    setError(null);

    setShowFarmForm(true);
  };


  // ========================================
  // STEP 2: FARM FORM SUBMITTED
  // ========================================

  const handleAnalyze = async (farmData) => {

    if (!selectedFile) {

      setError(text.selectImage);

      return;
    }

    setIsLoading(true);
    setError(null);

    try {

      // ========================================
      // CREATE IMAGE PREVIEW
      // ========================================

      const imageUrl = await convertToBase64(
        selectedFile
      );


      // ========================================
      // SEND IMAGE + FARM DATA
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
      // CHECK BACKEND RESPONSE
      // ========================================

      if (
        data &&
        data.detection &&
        data.detection.disease
      ) {

        navigate('/result', {

          state: {

            resultData: data,

            imageUrl: imageUrl

          }

        });

      } else {

        setError(text.analyzeError);

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
        text.serverError;


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


      {/* HEADER */}

      <div className="text-center">

        <h1 className="text-3xl font-extrabold text-white mb-2">

          {text.title}

        </h1>


        <p className="text-sm text-slate-400">

          {text.description}

        </p>

      </div>


      {/* ERROR */}

      {error && (

        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-3 text-sm max-w-2xl mx-auto">

          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />

          <span>{error}</span>

        </div>

      )}


      {/* LOADING */}

      {isLoading ? (

        <Loading
          message={text.loading}
        />

      ) : showFarmForm ? (

        <FarmContextForm
          onSubmit={handleAnalyze}
          isLoading={isLoading}
        />

      ) : (

        <ImageUploader
          onAnalyze={handleImageSelected}
          isLoading={isLoading}
        />

      )}

    </div>

  );
}


// ========================================
// CONVERT IMAGE TO BASE64
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
import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  RefreshCw,
  AlertTriangle,
  Image as ImageIcon,
  CheckCircle,
  Activity
} from 'lucide-react';

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();

  const resultData = location.state?.resultData;
  const imageUrl = location.state?.imageUrl;

  console.log("RESULT DATA:", resultData);

  // Agar direct result page open kiya gaya ho
  if (!resultData) {
    return (
      <div className="max-w-md mx-auto my-16 text-center glass-panel p-8 rounded-3xl border border-slate-800 space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />

        <h2 className="text-xl font-bold text-white">
          No Result Data Available
        </h2>

        <p className="text-sm text-slate-400">
          Please upload an image from the Scan page first.
        </p>

        <Link
          to="/scan"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-agri-500 text-slate-950 font-bold text-sm"
        >
          Go to Scan Page
        </Link>
      </div>
    );
  }

  // Backend Response
  const disease = resultData.disease || "Unknown Disease";
  const confidence = Number(resultData.confidence || 0);
  const topPredictions = resultData.top_predictions || [];

  // Clean disease name
  const cleanDiseaseName = (name) => {
    if (!name) return "Unknown Disease";

    return name
      .replace("Tomato___", "")
      .replace(/_/g, " ");
  };

  const diseaseName = cleanDiseaseName(disease);

  // Confidence status
  let confidenceStatus = "Low";

  if (confidence >= 80) {
    confidenceStatus = "High";
  } else if (confidence >= 60) {
    confidenceStatus = "Medium";
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/scan')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Scan Another Leaf
        </button>

        <Link
          to="/scan"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-agri-400 hover:bg-slate-800"
        >
          <RefreshCw className="w-4 h-4" />
          New Scan
        </Link>
      </div>


      {/* LOW CONFIDENCE WARNING */}
      {confidence < 70 && (
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-4">

          <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />

          <div>
            <h4 className="text-sm font-bold text-amber-300">
              Low Confidence Warning
            </h4>

            <p className="text-sm text-amber-200/80 mt-1">
              Prediction confidence is below 70%. Please verify the disease
              with an agricultural expert or upload a clearer leaf image.
            </p>
          </div>

        </div>
      )}


      {/* MAIN RESULT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* IMAGE */}
        <div className="glass-panel p-4 rounded-3xl border border-slate-800">

          <div className="rounded-2xl overflow-hidden bg-slate-950 aspect-square flex items-center justify-center border border-slate-800">

            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Scanned tomato leaf"
                className="w-full h-full object-cover"
              />
            ) : (
              <ImageIcon className="w-16 h-16 text-slate-700" />
            )}

          </div>

          <p className="text-xs text-slate-400 mt-4">
            AI Crop Disease Analysis
          </p>

        </div>


        {/* PREDICTION */}
        <div className="md:col-span-2 glass-panel p-8 rounded-3xl border border-slate-800">

          <div className="flex items-center gap-3 mb-6">

            <div className="p-3 rounded-xl bg-agri-500/10">
              <Activity className="w-6 h-6 text-agri-400" />
            </div>

            <div>
              <p className="text-sm text-slate-400">
                AI DETECTED
              </p>

              <h1 className="text-3xl font-bold text-white">
                {diseaseName}
              </h1>
            </div>

          </div>


          {/* CONFIDENCE */}
          <div className="bg-slate-900/60 rounded-2xl p-5 border border-slate-800">

            <div className="flex justify-between mb-3">

              <span className="text-slate-400">
                Prediction Confidence
              </span>

              <span className="text-agri-400 font-bold">
                {confidence.toFixed(2)}%
              </span>

            </div>


            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">

              <div
                className="bg-agri-500 h-full rounded-full"
                style={{
                  width: `${Math.min(confidence, 100)}%`
                }}
              />

            </div>


            <p className="text-xs text-slate-500 mt-3">
              Confidence Level: {confidenceStatus}
            </p>

          </div>

        </div>

      </div>


      {/* TOP PREDICTIONS */}
      {topPredictions.length > 0 && (

        <div className="glass-panel p-6 rounded-3xl border border-slate-800">

          <h2 className="text-xl font-bold text-white mb-5">
            Other Possible Predictions
          </h2>


          <div className="space-y-3">

            {topPredictions.map((item, index) => (

              <div
                key={index}
                className="flex items-center justify-between bg-slate-900/60 p-4 rounded-xl border border-slate-800"
              >

                <div className="flex items-center gap-3">

                  <span className="text-agri-400 font-bold">
                    #{index + 1}
                  </span>

                  <span className="text-slate-200">
                    {cleanDiseaseName(item.disease)}
                  </span>

                </div>


                <span className="font-bold text-white">

                  {Number(item.confidence || 0).toFixed(2)}%

                </span>

              </div>

            ))}

          </div>

        </div>

      )}


      {/* ADVISORY */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800">

        <h2 className="text-2xl font-bold text-white mb-6">
          Crop Advisory & Action Plan
        </h2>


        <div className="grid md:grid-cols-2 gap-6">


          {/* IMMEDIATE ACTION */}
          <div>

            <h3 className="font-bold text-agri-400 mb-4">
              Immediate Actions
            </h3>


            <div className="space-y-3">

              {[
                "Inspect nearby tomato plants for similar symptoms.",
                "Remove severely infected leaves carefully.",
                "Avoid unnecessary pesticide application.",
                "Monitor the crop regularly for disease spread."
              ].map((action, index) => (

                <div
                  key={index}
                  className="flex gap-3 text-sm text-slate-300"
                >

                  <CheckCircle className="w-5 h-5 text-agri-400 shrink-0" />

                  {action}

                </div>

              ))}

            </div>

          </div>


          {/* PREVENTION */}
          <div>

            <h3 className="font-bold text-agri-400 mb-4">
              Prevention Tips
            </h3>


            <div className="space-y-3">

              {[
                "Maintain proper spacing between plants.",
                "Avoid excessive moisture on leaves.",
                "Ensure good air circulation.",
                "Regularly inspect leaves for early symptoms."
              ].map((tip, index) => (

                <div
                  key={index}
                  className="flex gap-3 text-sm text-slate-300"
                >

                  <CheckCircle className="w-5 h-5 text-agri-400 shrink-0" />

                  {tip}

                </div>

              ))}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
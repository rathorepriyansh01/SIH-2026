import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import PredictionCard from '../components/PredictionCard';
import AdvisoryCard from '../components/AdvisoryCard';
import { SERVER_URL } from '../services/api';
import { ArrowLeft, RefreshCw, AlertTriangle, Image as ImageIcon } from 'lucide-react';

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const resultData = location.state?.resultData;

  if (!resultData) {
    return (
      <div className="max-w-md mx-auto my-16 text-center glass-panel p-8 rounded-3xl border border-slate-800 space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">No Result Data Available</h2>
        <p className="text-sm text-slate-400">Please upload an image on the Scan page to view diagnostic results.</p>
        <Link
          to="/scan"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-agri-500 text-slate-950 font-bold text-sm"
        >
          Go to Scan Page
        </Link>
      </div>
    );
  }

  const { prediction, disease_information, recommended_actions, scan_metadata, warning_message } = resultData;
  const imageUrl = scan_metadata?.image_path
    ? (scan_metadata.image_path.startsWith('http') ? scan_metadata.image_path : `${SERVER_URL}${scan_metadata.image_path}`)
    : null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/scan')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Scan Another Leaf</span>
        </button>

        <Link
          to="/scan"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-agri-400 hover:bg-slate-800 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>New Scan</span>
        </Link>
      </div>

      {/* Low Confidence Warning Box */}
      {warning_message && (
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-start gap-4 shadow-lg">
          <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-1">Low Confidence Warning</h4>
            <p className="text-sm leading-relaxed text-amber-200/90">{warning_message}</p>
          </div>
        </div>
      )}

      {/* Grid: Uploaded Image & Prediction Metric Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Uploaded Image Thumbnail Card */}
        <div className="md:col-span-1 glass-panel p-4 rounded-3xl border border-slate-800 flex flex-col justify-between">
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-square flex items-center justify-center border border-slate-800 mb-4">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Scanned crop leaf"
                className="w-full h-full object-cover"
              />
            ) : (
              <ImageIcon className="w-12 h-12 text-slate-700" />
            )}
          </div>
          <div className="text-xs text-slate-400 space-y-1">
            <p><span className="font-semibold text-slate-300">Scan ID:</span> <code className="text-agri-400 font-mono">{scan_metadata?.scan_id?.slice(0, 12)}...</code></p>
          </div>
        </div>

        {/* Prediction Metrics Header Card */}
        <div className="md:col-span-2">
          <PredictionCard prediction={prediction} scanMetadata={scan_metadata} />
        </div>
      </div>

      {/* Advisory & Management System Section */}
      <div className="space-y-4 pt-4">
        <h3 className="text-2xl font-black tracking-tight text-white">Crop Advisory & Action Plan</h3>
        <AdvisoryCard diseaseInformation={disease_information} recommendedActions={recommended_actions} />
      </div>
    </div>
  );
}

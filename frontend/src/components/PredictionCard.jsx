import React from 'react';
import { CheckCircle2, AlertTriangle, AlertOctagon, ShieldCheck, Activity } from 'lucide-react';

export default function PredictionCard({ prediction, scanMetadata }) {
  if (!prediction) return null;

  const { crop, disease, confidence, risk_level, confidence_level } = prediction;

  const isHealthy = disease.toLowerCase() === 'healthy';

  const getConfidenceBadge = () => {
    if (confidence_level === 'High') {
      return {
        color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
        label: 'High Confidence (≥80%)',
        icon: ShieldCheck,
      };
    } else if (confidence_level === 'Moderate') {
      return {
        color: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
        label: 'Moderate Confidence (60-80%)',
        icon: AlertTriangle,
      };
    } else {
      return {
        color: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
        label: 'Low Confidence (<60%)',
        icon: AlertOctagon,
      };
    }
  };

  const getRiskBadge = () => {
    switch (risk_level?.toLowerCase()) {
      case 'none':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'high':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      default:
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    }
  };

  const badge = getConfidenceBadge();
  const BadgeIcon = badge.icon;

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 relative overflow-hidden">
      {/* Background Accent Glow */}
      <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-10 pointer-events-none ${
        isHealthy ? 'bg-emerald-500' : 'bg-amber-500'
      }`}></div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-agri-400 uppercase tracking-widest mb-1">
            <span>Crop Category</span>
            <span>•</span>
            <span>{crop}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-3">
            {disease}
            {isHealthy && <CheckCircle2 className="w-8 h-8 text-emerald-400 inline" />}
          </h2>
        </div>

        {/* Confidence Gauge */}
        <div className="flex items-center gap-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-800 w-full md:w-auto justify-between md:justify-start">
          <div>
            <p className="text-[11px] font-semibold uppercase text-slate-400">AI Confidence</p>
            <p className="text-3xl font-extrabold text-white tracking-tight">
              {confidence.toFixed(1)}<span className="text-xl text-agri-400">%</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-agri-400 border-r-agri-500 flex items-center justify-center font-bold text-xs text-agri-300">
            <Activity className="w-5 h-5 text-agri-400" />
          </div>
        </div>
      </div>

      {/* Badges Bar */}
      <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-semibold">
        <span className={`px-3.5 py-1.5 rounded-xl border flex items-center gap-2 ${badge.color}`}>
          <BadgeIcon className="w-4 h-4" />
          {badge.label}
        </span>

        <span className={`px-3.5 py-1.5 rounded-xl border ${getRiskBadge()}`}>
          Risk Level: {risk_level}
        </span>

        {scanMetadata?.timestamp && (
          <span className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400">
            Scanned: {new Date(scanMetadata.timestamp).toLocaleDateString()} at {new Date(scanMetadata.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
    </div>
  );
}

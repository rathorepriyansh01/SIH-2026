import React from 'react';
import { Stethoscope, FileText, AlertCircle, Zap, ShieldCheck, UserCheck } from 'lucide-react';

export default function AdvisoryCard({ diseaseInformation, recommendedActions }) {
  if (!diseaseInformation || !recommendedActions) return null;

  const { description, symptoms, possible_causes } = diseaseInformation;
  const { immediate_actions, prevention, when_to_seek_expert_help } = recommendedActions;

  return (
    <div className="space-y-6">
      {/* Overview & Description */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-3">
          <FileText className="w-5 h-5 text-agri-400" />
          Disease Overview
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed">{description}</p>
      </div>

      {/* Grid: Symptoms & Causes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Symptoms */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <h4 className="text-base font-bold text-white flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            Key Symptoms
          </h4>
          <ul className="space-y-2">
            {symptoms.map((symptom, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0"></span>
                <span>{symptom}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Possible Causes */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <h4 className="text-base font-bold text-white flex items-center gap-2 mb-3">
            <Stethoscope className="w-5 h-5 text-sky-400" />
            Possible Causes
          </h4>
          <ul className="space-y-2">
            {possible_causes.map((cause, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-2 shrink-0"></span>
                <span>{cause}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Immediate Actions */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-agri-950/30">
        <h4 className="text-base font-bold text-white flex items-center gap-2 mb-3">
          <Zap className="w-5 h-5 text-agri-400" />
          Immediate Recommended Actions
        </h4>
        <div className="space-y-2.5">
          {immediate_actions.map((action, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-agri-500/20 text-agri-400 text-xs font-bold shrink-0">
                {idx + 1}
              </span>
              <span className="text-sm font-medium text-slate-200">{action}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Prevention & Long-Term Care */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <h4 className="text-base font-bold text-white flex items-center gap-2 mb-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          Prevention & Integrated Management
        </h4>
        <ul className="space-y-2">
          {prevention.map((prev, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0"></span>
              <span>{prev}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Expert Help Guidance */}
      {when_to_seek_expert_help && (
        <div className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-start gap-4">
          <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-indigo-300 uppercase tracking-wider mb-1">
              When to Seek Agriculture Expert Help
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">{when_to_seek_expert_help}</p>
          </div>
        </div>
      )}
    </div>
  );
}

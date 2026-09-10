import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, UploadCloud, Cpu, Stethoscope, ShieldCheck, Sprout, Activity } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="relative text-center max-w-4xl mx-auto px-4 pt-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-agri-500/10 border border-agri-500/30 text-agri-400 text-xs font-semibold uppercase tracking-wider mb-6 shadow-inner">
          <Sprout className="w-4 h-4" />
          <span>Smart India Hackathon AI Prototype</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-6 leading-tight">
          Detect Crop Diseases Early.<br />
          <span className="gradient-text">Prevent Harvest Loss.</span>
        </h1>

        <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
          Crop Health AI leverages transfer learning deep neural networks to identify  foliage diseases in seconds, providing actionable disease advisory and management guidance.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/scan"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-agri-500 to-agri-600 hover:from-agri-400 hover:to-agri-500 text-slate-950 font-bold text-base flex items-center justify-center gap-3 shadow-xl shadow-agri-500/25 transition-all hover:scale-105"
          >
            <UploadCloud className="w-5 h-5 stroke-[2.5]" />
            <span>Scan Your Crop Now</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </Link>

          <Link
            to="/history"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-base flex items-center justify-center gap-2 transition-all"
          >
            <span>View Past Scans</span>
          </Link>
        </div>
      </section>

      {/* How It Works Flow */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">How It Works</h2>
          <p className="text-sm text-slate-400">4-step automated pipeline for instant crop diagnosis</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 glass-panel-hover text-left relative">
            <div className="w-12 h-12 rounded-xl bg-agri-500/20 text-agri-400 flex items-center justify-center mb-4 font-bold text-lg">
              <UploadCloud className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-agri-400 uppercase tracking-widest block mb-1">Step 01</span>
            <h3 className="text-lg font-bold text-white mb-2">Upload Image</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload a clear photo of your tomato leaf from phone or camera.
            </p>
          </div>

          {/* Step 2 */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 glass-panel-hover text-left relative">
            <div className="w-12 h-12 rounded-xl bg-agri-500/20 text-agri-400 flex items-center justify-center mb-4 font-bold text-lg">
              <Cpu className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-agri-400 uppercase tracking-widest block mb-1">Step 02</span>
            <h3 className="text-lg font-bold text-white mb-2">AI Analysis</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              FastAPI backend runs MobileNetV3 deep learning feature extraction.
            </p>
          </div>

          {/* Step 3 */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 glass-panel-hover text-left relative">
            <div className="w-12 h-12 rounded-xl bg-agri-500/20 text-agri-400 flex items-center justify-center mb-4 font-bold text-lg">
              <Activity className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-agri-400 uppercase tracking-widest block mb-1">Step 03</span>
            <h3 className="text-lg font-bold text-white mb-2">Disease Detection</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Model predicts disease class with precision confidence rating.
            </p>
          </div>

          {/* Step 4 */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 glass-panel-hover text-left relative">
            <div className="w-12 h-12 rounded-xl bg-agri-500/20 text-agri-400 flex items-center justify-center mb-4 font-bold text-lg">
              <Stethoscope className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-agri-400 uppercase tracking-widest block mb-1">Step 04</span>
            <h3 className="text-lg font-bold text-white mb-2">Recommended Actions</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              System fetches tailored immediate treatment & prevention advisory.
            </p>
          </div>
        </div>
      </section>

      {/* Target Tomato Classes */}
      <section className="max-w-5xl mx-auto px-4 bg-slate-900/50 p-8 rounded-3xl border border-slate-800">
        <h3 className="text-xl font-bold text-white mb-6 text-center">Supported Crop Disease Diagnostics</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {['Healthy', 'Early Blight', 'Late Blight', 'Leaf Mold', 'Septoria Leaf Spot'].map((cls, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <ShieldCheck className="w-6 h-6 text-agri-400 mx-auto mb-2" />
              <span className="text-xs font-semibold text-slate-200">{cls}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

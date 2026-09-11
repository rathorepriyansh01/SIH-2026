import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  UploadCloud,
  Cpu,
  Stethoscope,
  ShieldCheck,
  Sprout,
  Activity,
} from "lucide-react";

import { useLanguage } from "../i18n/LanguageContext";

export default function Home() {
  const { language } = useLanguage();

  // Directly get the current language's Home translations.
  // Isse existing LanguageContext ko change karne ki zarurat nahi hai.
  const home = language === "hi"
    ? {
        badge: "स्मार्ट इंडिया हैकाथॉन AI प्रोटोटाइप",
        title1: "फसल रोगों की जल्दी पहचान करें।",
        title2: "फसल के नुकसान को रोकें।",
        description:
          "Crop Health AI ट्रांसफर लर्निंग डीप न्यूरल नेटवर्क का उपयोग करके कुछ ही सेकंड में पत्तियों के रोगों की पहचान करता है और उपयोगी रोग सलाह तथा प्रबंधन संबंधी मार्गदर्शन प्रदान करता है।",
        scanNow: "अभी अपनी फसल स्कैन करें",
        pastScans: "पिछले स्कैन देखें",
        howItWorks: "यह कैसे काम करता है",
        pipeline: "तुरंत फसल निदान के लिए 4-चरणीय स्वचालित प्रक्रिया",
        step01: "चरण 01",
        uploadImage: "छवि अपलोड करें",
        uploadDescription:
          "अपने फोन या कैमरे से टमाटर की पत्ती की एक स्पष्ट तस्वीर अपलोड करें।",
        step02: "चरण 02",
        aiAnalysis: "AI विश्लेषण",
        aiAnalysisDescription:
          "FastAPI बैकएंड MobileNetV3 डीप लर्निंग फीचर एक्सट्रैक्शन चलाता है।",
        step03: "चरण 03",
        diseaseDetection: "रोग की पहचान",
        diseaseDetectionDescription:
          "मॉडल सटीकता और विश्वसनीयता के साथ रोग की श्रेणी की भविष्यवाणी करता है।",
        step04: "चरण 04",
        recommendedActions: "अनुशंसित कार्य",
        recommendedActionsDescription:
          "सिस्टम तुरंत उपचार और बचाव के लिए अनुकूलित सलाह प्रदान करता है।",
        supportedDiagnostics: "समर्थित फसल रोग निदान",
        healthy: "स्वस्थ",
        earlyBlight: "अर्ली ब्लाइट",
        lateBlight: "लेट ब्लाइट",
        leafMold: "लीफ मोल्ड",
        septoriaLeafSpot: "सेप्टोरिया लीफ स्पॉट",
      }
    : {
        badge: "Smart India Hackathon AI Prototype",
        title1: "Detect Crop Diseases Early.",
        title2: "Prevent Harvest Loss.",
        description:
          "Crop Health AI leverages transfer learning deep neural networks to identify foliage diseases in seconds, providing actionable disease advisory and management guidance.",
        scanNow: "Scan Your Crop Now",
        pastScans: "View Past Scans",
        howItWorks: "How It Works",
        pipeline: "4-step automated pipeline for instant crop diagnosis",
        step01: "Step 01",
        uploadImage: "Upload Image",
        uploadDescription:
          "Upload a clear photo of your tomato leaf from phone or camera.",
        step02: "Step 02",
        aiAnalysis: "AI Analysis",
        aiAnalysisDescription:
          "FastAPI backend runs MobileNetV3 deep learning feature extraction.",
        step03: "Step 03",
        diseaseDetection: "Disease Detection",
        diseaseDetectionDescription:
          "Model predicts disease class with precision confidence rating.",
        step04: "Step 04",
        recommendedActions: "Recommended Actions",
        recommendedActionsDescription:
          "System fetches tailored immediate treatment & prevention advisory.",
        supportedDiagnostics: "Supported Crop Disease Diagnostics",
        healthy: "Healthy",
        earlyBlight: "Early Blight",
        lateBlight: "Late Blight",
        leafMold: "Leaf Mold",
        septoriaLeafSpot: "Septoria Leaf Spot",
      };

  return (
    <div className="space-y-16 py-8">

      {/* Hero Section */}
      <section className="relative text-center max-w-4xl mx-auto px-4 pt-8">

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-agri-500/10 border border-agri-500/30 text-agri-400 text-xs font-semibold uppercase tracking-wider mb-6 shadow-inner">
          <Sprout className="w-4 h-4" />
          <span>{home.badge}</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-6 leading-tight">
          {home.title1}
          <br />
          <span className="gradient-text">{home.title2}</span>
        </h1>

        <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
          {home.description}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">

          <Link
            to="/scan"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-agri-500 to-agri-600 hover:from-agri-400 hover:to-agri-500 text-slate-950 font-bold text-base flex items-center justify-center gap-3 shadow-xl shadow-agri-500/25 transition-all hover:scale-105"
          >
            <UploadCloud className="w-5 h-5 stroke-[2.5]" />
            <span>{home.scanNow}</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </Link>

          <Link
            to="/history"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-base flex items-center justify-center gap-2 transition-all"
          >
            <span>{home.pastScans}</span>
          </Link>

        </div>
      </section>


      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-4">

        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            {home.howItWorks}
          </h2>

          <p className="text-sm text-slate-400">
            {home.pipeline}
          </p>
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Step 1 */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 glass-panel-hover text-left relative">

            <div className="w-12 h-12 rounded-xl bg-agri-500/20 text-agri-400 flex items-center justify-center mb-4">
              <UploadCloud className="w-6 h-6" />
            </div>

            <span className="text-xs font-bold text-agri-400 uppercase tracking-widest block mb-1">
              {home.step01}
            </span>

            <h3 className="text-lg font-bold text-white mb-2">
              {home.uploadImage}
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed">
              {home.uploadDescription}
            </p>

          </div>


          {/* Step 2 */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 glass-panel-hover text-left relative">

            <div className="w-12 h-12 rounded-xl bg-agri-500/20 text-agri-400 flex items-center justify-center mb-4">
              <Cpu className="w-6 h-6" />
            </div>

            <span className="text-xs font-bold text-agri-400 uppercase tracking-widest block mb-1">
              {home.step02}
            </span>

            <h3 className="text-lg font-bold text-white mb-2">
              {home.aiAnalysis}
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed">
              {home.aiAnalysisDescription}
            </p>

          </div>


          {/* Step 3 */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 glass-panel-hover text-left relative">

            <div className="w-12 h-12 rounded-xl bg-agri-500/20 text-agri-400 flex items-center justify-center mb-4">
              <Activity className="w-6 h-6" />
            </div>

            <span className="text-xs font-bold text-agri-400 uppercase tracking-widest block mb-1">
              {home.step03}
            </span>

            <h3 className="text-lg font-bold text-white mb-2">
              {home.diseaseDetection}
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed">
              {home.diseaseDetectionDescription}
            </p>

          </div>


          {/* Step 4 */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 glass-panel-hover text-left relative">

            <div className="w-12 h-12 rounded-xl bg-agri-500/20 text-agri-400 flex items-center justify-center mb-4">
              <Stethoscope className="w-6 h-6" />
            </div>

            <span className="text-xs font-bold text-agri-400 uppercase tracking-widest block mb-1">
              {home.step04}
            </span>

            <h3 className="text-lg font-bold text-white mb-2">
              {home.recommendedActions}
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed">
              {home.recommendedActionsDescription}
            </p>

          </div>

        </div>
      </section>


      {/* Supported Crop Disease Diagnostics */}
      <section className="max-w-5xl mx-auto px-4 bg-slate-900/50 p-8 rounded-3xl border border-slate-800">

        <h3 className="text-xl font-bold text-white mb-6 text-center">
          {home.supportedDiagnostics}
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">

          {[
            home.healthy,
            home.earlyBlight,
            home.lateBlight,
            home.leafMold,
            home.septoriaLeafSpot,
          ].map((cls, idx) => (

            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center"
            >
              <ShieldCheck className="w-6 h-6 text-agri-400 mx-auto mb-2" />

              <span className="text-xs font-semibold text-slate-200">
                {cls}
              </span>
            </div>

          ))}

        </div>
      </section>

    </div>
  );
}
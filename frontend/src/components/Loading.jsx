import React from 'react';
import { Cpu, Sparkles } from 'lucide-react';

export default function Loading({ message = "AI Model Analyzing Leaf Features..." }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center my-8">
      <div className="relative w-24 h-24 mb-6">
        {/* Glowing Spinning Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-agri-500/20 border-t-agri-400 border-r-agri-500 animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-4 border-slate-800 border-b-agri-300 animate-spin [animation-duration:1.5s]"></div>
        
        {/* Center Icon */}
        <div className="absolute inset-0 flex items-center justify-center text-agri-400">
          <Cpu className="w-8 h-8 animate-pulse" />
        </div>
      </div>

      <div className="flex items-center gap-2 text-lg font-bold text-white mb-2">
        <Sparkles className="w-5 h-5 text-agri-400 animate-spin" />
        <span>{message}</span>
      </div>

      <p className="text-xs text-slate-400 max-w-sm">
        Running MobileNetV3 deep neural network inference on leaf color distribution & spot features...
      </p>
    </div>
  );
}

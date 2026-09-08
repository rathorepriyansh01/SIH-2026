import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sprout, Scan, History, Home, Activity } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-agri-600 to-agri-400 flex items-center justify-center shadow-lg shadow-agri-500/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                Crop Health <span className="text-agri-400">AI</span>
              </span>
              <p className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold">
                Detect Early. Prevent Loss.
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Link
              to="/"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/')
                  ? 'bg-agri-500/15 text-agri-400 border border-agri-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>

            <Link
              to="/scan"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/scan')
                  ? 'bg-agri-500/15 text-agri-400 border border-agri-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Scan className="w-4 h-4" />
              <span>Scan Crop</span>
            </Link>

            <Link
              to="/history"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/history')
                  ? 'bg-agri-500/15 text-agri-400 border border-agri-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Scan History</span>
            </Link>

            {/* AI Model Status Badge */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300">
              <span className="w-2 h-2 rounded-full bg-agri-400 animate-pulse"></span>
              <span>MobileNetV3 PyTorch</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

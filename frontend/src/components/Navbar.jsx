import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sprout,
  Scan,
  History,
  Home,
  Languages,
} from "lucide-react";

import { useLanguage } from "../i18n/LanguageContext";

export default function Navbar() {
  const location = useLocation();

  const { language, changeLanguage, t } = useLanguage();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ========================= */}
          {/* BRAND */}
          {/* ========================= */}

          <Link to="/" className="flex items-center gap-3 group">

            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-agri-600 to-agri-400 flex items-center justify-center shadow-lg shadow-agri-500/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>

            <div>
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                Crop Health{" "}
                <span className="text-agri-400">AI</span>
              </span>

              <p className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold">
                {t.navbar.tagline}
              </p>
            </div>

          </Link>


          {/* ========================= */}
          {/* RIGHT SIDE */}
          {/* ========================= */}

          <div className="flex items-center space-x-1 sm:space-x-2">

            {/* HOME */}

            <Link
              to="/"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive("/")
                  ? "bg-agri-500/15 text-agri-400 border border-agri-500/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <Home className="w-4 h-4" />

              <span className="hidden sm:inline">
                {t.navbar.home}
              </span>
            </Link>


            {/* SCAN */}

            <Link
              to="/scan"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive("/scan")
                  ? "bg-agri-500/15 text-agri-400 border border-agri-500/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <Scan className="w-4 h-4" />

              <span className="hidden sm:inline">
                {t.navbar.scanCrop}
              </span>
            </Link>


            {/* HISTORY */}

            <Link
              to="/history"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive("/history")
                  ? "bg-agri-500/15 text-agri-400 border border-agri-500/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <History className="w-4 h-4" />

              <span className="hidden sm:inline">
                {t.navbar.scanHistory}
              </span>
            </Link>


            {/* ========================= */}
            {/* LANGUAGE SWITCH */}
            {/* ========================= */}

            <div className="flex items-center gap-1 ml-2 p-1 rounded-lg bg-slate-900 border border-slate-800">

              <Languages className="w-4 h-4 text-slate-400 ml-1" />

              <button
                type="button"
                onClick={() => changeLanguage("en")}
                className={`px-2.5 py-1.5 rounded-md text-xs font-bold transition-all ${
                  language === "en"
                    ? "bg-agri-500 text-slate-950"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                EN
              </button>

              <button
                type="button"
                onClick={() => changeLanguage("hi")}
                className={`px-2.5 py-1.5 rounded-md text-xs font-bold transition-all ${
                  language === "hi"
                    ? "bg-agri-500 text-slate-950"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                हिंदी
              </button>

            </div>


            {/* ========================= */}
            {/* AI MODEL STATUS */}
            {/* ========================= */}

            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300">

              <span className="w-2 h-2 rounded-full bg-agri-400 animate-pulse"></span>

              <span>
                {t.navbar.model}
              </span>

            </div>

          </div>

        </div>
      </div>
    </nav>
  );
}
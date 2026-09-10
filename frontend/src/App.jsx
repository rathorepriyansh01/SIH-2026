import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Scan from "./pages/Scan";
import Result from "./pages/Result";
import History from "./pages/History";

import { LanguageProvider } from "./i18n/LanguageContext";


function AppContent() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">

      <div>

        <Navbar />

        <main className="pb-16">

          <Routes>

            <Route
              path="/"
              element={<Home />}
            />

            <Route
              path="/scan"
              element={<Scan />}
            />

            <Route
              path="/result"
              element={<Result />}
            />

            <Route
              path="/history"
              element={<History />}
            />

          </Routes>

        </main>

      </div>


      {/* FOOTER */}

      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">

        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">

          <div className="flex items-center gap-2">

            <span className="font-bold text-slate-400">
              Crop Health AI
            </span>

            <span>
              •
            </span>

            <span>
              Smart India Hackathon Prototype
            </span>

          </div>

          <p>
            Powered by PyTorch Deep Learning & FastAPI Backend
          </p>

        </div>

      </footer>

    </div>
  );
}


export default function App() {
  return (
    <Router>

      <LanguageProvider>

        <AppContent />

      </LanguageProvider>

    </Router>
  );
}
import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Trash2, Sparkles, AlertCircle } from 'lucide-react';

export default function ImageUploader({ onAnalyze, isLoading }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/bmp'];

  const validateAndSelectFile = (file) => {
    setErrorMsg(null);
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrorMsg('Unsupported file format. Please upload a JPG, PNG, WEBP, or BMP leaf image.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setErrorMsg('File size exceeds 10MB limit.');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    validateAndSelectFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSelectFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setErrorMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedFile && !isLoading) {
      onAnalyze(selectedFile);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {errorMsg && (
        <div className="mb-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {!previewUrl ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-agri-400 bg-agri-500/10 scale-[1.01]'
              : 'border-slate-700/80 bg-slate-900/60 hover:border-agri-500/50 hover:bg-slate-900/80'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-agri-500/20 to-agri-400/10 border border-agri-500/30 flex items-center justify-center text-agri-400">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-semibold text-white mb-1">
            Upload  Leaf Image
          </h3>
          <p className="text-sm text-slate-400 mb-4 max-w-md mx-auto">
            Drag and drop your crop leaf photo here, or click to browse files
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300">
            <ImageIcon className="w-4 h-4 text-agri-400" />
            <span>Supports JPG, PNG, WEBP, BMP (Max 10MB)</span>
          </div>
        </div>
      ) : (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="relative rounded-xl overflow-hidden bg-slate-950 aspect-video max-h-80 mb-6 flex items-center justify-center border border-slate-800">
            <img
              src={previewUrl}
              alt="Leaf scan preview"
              className="max-h-full max-w-full object-contain"
            />
            <button
              type="button"
              onClick={handleRemove}
              disabled={isLoading}
              className="absolute top-3 right-3 p-2 rounded-xl bg-slate-900/90 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors border border-slate-700/80 shadow-lg"
              title="Remove Image"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <p className="text-xs font-medium text-slate-400">Selected File</p>
              <p className="text-sm font-semibold text-slate-200 truncate max-w-xs">
                {selectedFile?.name}
              </p>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-agri-500 to-agri-600 hover:from-agri-400 hover:to-agri-500 text-slate-950 font-bold flex items-center justify-center gap-2 shadow-lg shadow-agri-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
            >
              <Sparkles className="w-5 h-5 stroke-[2.5]" />
              <span>{isLoading ? 'Analyzing Leaf...' : 'Analyze Crop Health'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

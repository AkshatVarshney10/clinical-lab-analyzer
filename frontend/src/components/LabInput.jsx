import React, { useState } from 'react';
import { UploadCloud, Loader2, FileSpreadsheet } from 'lucide-react';

const LabInput = ({ onAnalyze }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/analyze_labs_csv', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      onAnalyze(data.data);
    } catch (error) {
      console.error("Error analyzing CSV:", error);
      alert("Failed to connect to backend. Is FastAPI running?");
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

      <div className="flex items-center gap-2 mb-6">
        <FileSpreadsheet className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-slate-800">Upload Dataset</h2>
      </div>

      <form onSubmit={handleFileUpload} className="flex flex-col gap-5">
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-colors group cursor-pointer relative">
          <input 
            type="file" 
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0])}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-3 group-hover:text-blue-500 transition-colors" />
          <p className="text-sm font-medium text-slate-700">
            {file ? file.name : "Drag & drop or click to browse"}
          </p>
          <p className="text-xs text-slate-500 mt-1">Supports Kaggle .csv files</p>
        </div>

        <button 
          type="submit" 
          disabled={!file || loading}
          className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 focus:ring-4 focus:ring-blue-100 disabled:opacity-50 disabled:hover:bg-slate-900 transition-all shadow-sm"
        >
          {loading ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing via XAI...</>
          ) : (
            'Process Results'
          )}
        </button>
      </form>
    </div>
  );
};

export default LabInput;
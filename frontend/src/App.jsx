import React, { useState } from 'react';
import LabInput from './components/LabInput';
import ResultsDisplay from './components/ResultsDisplay';
import { Activity, Beaker } from 'lucide-react';

function App() {
  const [results, setResults] = useState(null);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-200">
      {/* Premium Header */}
      <header className="bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/20 p-2 rounded-lg backdrop-blur-sm border border-blue-400/30">
              <Activity className="w-7 h-7 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
                Clinical AI Analyzer
              </h1>
              <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">XAI Results Routing</p>
            </div>
          </div>
          <Beaker className="w-6 h-6 text-slate-500 hidden sm:block" />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Upload */}
          <div className="lg:col-span-4 space-y-6">
            <LabInput onAnalyze={setResults} />
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-8">
             <ResultsDisplay results={results} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
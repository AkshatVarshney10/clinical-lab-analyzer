import React from 'react';
// src/components/ResultsDisplay.jsx (Line 2)
import { AlertTriangle, XOctagon, CheckCircle2, BrainCircuit, ArrowRight, Activity } from 'lucide-react';

const ResultCard = ({ lab, type }) => {
  const styles = {
    Critical: "bg-red-50 border-red-200",
    Warning: "bg-amber-50 border-amber-200",
    Normal: "bg-emerald-50 border-emerald-200 text-emerald-900"
  };

  const Icon = type === 'Critical' ? XOctagon : (type === 'Warning' ? AlertTriangle : CheckCircle2);
  const iconColor = type === 'Critical' ? "text-red-600" : (type === 'Warning' ? "text-amber-600" : "text-emerald-600");

  return (
    <div className={`border rounded-xl p-5 mb-4 shadow-sm transition-all hover:shadow-md ${styles[type]}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-lg shadow-sm">
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 capitalize">{lab.test_name || lab['Test Name'] || "Unknown Test"}</h3>
            <p className="text-sm font-medium text-slate-600 mt-0.5">
              Result: <span className="text-slate-900 font-bold bg-white px-2 py-0.5 rounded border shadow-sm mx-1">{lab.value || lab['Result']}</span> {lab.unit || lab['Unit']}
            </p>
          </div>
        </div>
      </div>

      {lab.explanation && (
        <div className="mt-4 bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/40 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <BrainCircuit className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-bold text-indigo-900 tracking-wide uppercase">AI Clinical Insight</span>
          </div>
          
          <div className="space-y-3">
            <p className="text-sm text-slate-700 leading-relaxed">
              <span className="font-semibold text-slate-900">Analysis:</span> {lab.explanation.why_flagged}
            </p>
            <p className="text-sm text-slate-700 leading-relaxed">
              <span className="font-semibold text-slate-900">Meaning:</span> {lab.explanation.meaning}
            </p>
            
            <div className="pt-2 mt-2 border-t border-slate-200/60">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Recommended Action</span>
              <ul className="space-y-1">
                {lab.explanation.next_steps.map((step, idx) => (
                  <li key={idx} className="text-sm text-slate-700 flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ResultsDisplay = ({ results }) => {
  if (!results) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-white rounded-2xl border border-slate-200 border-dashed p-12 min-h-[400px]">
        <Activity className="w-16 h-16 mb-4 text-slate-200" />
        <p className="text-lg font-medium">Awaiting lab results...</p>
        <p className="text-sm">Upload a CSV to begin XAI analysis.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {results.Critical?.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-red-100">
            <XOctagon className="w-5 h-5 text-red-600" />
            <h2 className="text-xl font-bold text-red-800">Critical Alerts</h2>
          </div>
          {results.Critical.map((lab, i) => <ResultCard key={`crit-${i}`} lab={lab} type="Critical" />)}
        </section>
      )}
      
      {results.Warning?.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-amber-100">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h2 className="text-xl font-bold text-amber-800">Abnormal Flags</h2>
          </div>
          {results.Warning.map((lab, i) => <ResultCard key={`warn-${i}`} lab={lab} type="Warning" />)}
        </section>
      )}
      
      {results.Normal?.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-emerald-100">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-bold text-emerald-800">Normal Range</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.Normal.map((lab, i) => <ResultCard key={`norm-${i}`} lab={lab} type="Normal" />)}
          </div>
        </section>
      )}
    </div>
  );
};

export default ResultsDisplay;
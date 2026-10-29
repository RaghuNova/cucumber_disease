import React, { useState, useEffect } from 'react';
import { DISEASES_DATA } from '../data/diseases';
import { Sparkles, ArrowRight, X, Shield, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export default function DiseaseGuide({ onOpenDiagnosis }) {
  const [selectedDisease, setSelectedDisease] = useState(null);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedDisease(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section id="disease-guide" className="py-24 bg-forest-950 bg-organic-vines border-b border-botanical-500/15 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-botanical-500/10 border border-botanical-400/30 text-xs font-mono text-botanical-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pretrained Taxonomic Scope</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-white font-normal">
            Eight Detectable <span className="italic text-botanical-300">Foliar Categories.</span>
          </h2>
          <p className="text-sage-200 text-base sm:text-lg font-light leading-relaxed">
            Our ConvNeXt classifier evaluates image representations across eight specific categories, 
            with specialized emphasis on primary threats: <span className="text-white font-medium">Downy Mildew</span>, <span className="text-white font-medium">Powdery Mildew</span>, and <span className="text-white font-medium">Healthy Leaves</span>.
          </p>
        </div>

        {/* 8 Disease Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DISEASES_DATA.map((disease) => {
            return (
              <div
                key={disease.id}
                className={`group rounded-2xl p-6 glass-panel border transition-all duration-300 flex flex-col justify-between text-left hover:-translate-y-1 hover:shadow-xl ${
                  disease.isPrimary 
                    ? 'border-botanical-400/40 bg-forest-900/60 hover:border-botanical-400' 
                    : 'border-botanical-500/15 bg-forest-950/70 hover:border-botanical-400/30'
                }`}
              >
                <div className="space-y-4">
                  
                  {/* Badge */}
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${disease.accentColor}`}>
                      {disease.tag}
                    </span>
                    {disease.isPrimary && (
                      <span className="text-[10px] font-mono text-botanical-300 uppercase tracking-wider">
                        ★ Primary
                      </span>
                    )}
                  </div>

                  {/* Title & Scientific */}
                  <div>
                    <h3 className="font-editorial text-xl font-bold text-white group-hover:text-botanical-300 transition-colors">
                      {disease.name}
                    </h3>
                    <p className="text-xs text-sage-400 italic font-mono mt-0.5">
                      {disease.scientificName}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-sage-200 font-light leading-relaxed line-clamp-3">
                    {disease.shortDescription}
                  </p>

                  {/* Symptoms bullet preview */}
                  <div className="space-y-1.5 pt-2 border-t border-botanical-500/15">
                    <span className="text-[11px] font-semibold text-sage-300 uppercase font-mono tracking-wider">
                      Key Indicators
                    </span>
                    <ul className="text-xs text-sage-400 space-y-1">
                      {disease.symptoms.slice(0, 2).map((s, idx) => (
                        <li key={idx} className="flex items-start space-x-1.5">
                          <span className="text-botanical-400 shrink-0 mt-0.5">•</span>
                          <span className="line-clamp-1">{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* Card Action */}
                <div className="pt-6">
                  <button
                    onClick={() => setSelectedDisease(disease)}
                    className="w-full py-2.5 px-4 rounded-xl bg-forest-900 group-hover:bg-botanical-600 text-sage-200 group-hover:text-white text-xs font-medium border border-botanical-500/30 group-hover:border-transparent transition-all flex items-center justify-center space-x-2"
                  >
                    <span>Explore Details</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Modal Inspector */}
        {selectedDisease && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="relative w-full max-w-2xl bg-forest-950 rounded-3xl border border-botanical-400/40 p-6 sm:p-8 text-left shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedDisease(null)}
                aria-label="Close details modal"
                className="absolute top-6 right-6 p-2 rounded-full bg-forest-900 text-sage-300 hover:text-white hover:bg-forest-800 transition-colors focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="border-b border-botanical-500/20 pb-4 space-y-2">
                <span className={`text-xs font-mono px-2.5 py-0.5 rounded-full border ${selectedDisease.accentColor}`}>
                  {selectedDisease.tag}
                </span>
                <h3 id="modal-title" className="font-editorial text-2xl sm:text-3xl font-bold text-white">
                  {selectedDisease.name}
                </h3>
                <p className="text-xs text-botanical-300 italic font-mono">
                  {selectedDisease.scientificName}
                </p>
                <p className="text-sm text-sage-200 font-light leading-relaxed pt-2">
                  {selectedDisease.shortDescription}
                </p>
              </div>

              {/* Symptoms */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider font-mono text-sage-300">
                  Diagnostic Visual Symptoms
                </h4>
                <ul className="space-y-2">
                  {selectedDisease.symptoms.map((s, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5 text-xs text-sage-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-botanical-400 mt-1.5 shrink-0"></span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contributing Causes */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider font-mono text-amber-300">
                  Contributing Factors & Microclimates
                </h4>
                <ul className="space-y-2">
                  {selectedDisease.causes.map((c, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5 text-xs text-sage-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Prevention & Field Protocol */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider font-mono text-emerald-300">
                  General Prevention & Field Care
                </h4>
                <ul className="space-y-2">
                  {selectedDisease.prevention.map((p, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5 text-xs text-sage-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Footer CTA */}
              <div className="pt-4 border-t border-botanical-500/20 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setSelectedDisease(null);
                    onOpenDiagnosis();
                  }}
                  className="flex-1 py-3 px-6 rounded-xl bg-botanical-500 hover:bg-botanical-400 text-white font-medium text-sm text-center shadow-lg transition-transform hover:scale-[1.01]"
                >
                  Analyze a Leaf for {selectedDisease.name}
                </button>
                <button
                  onClick={() => setSelectedDisease(null)}
                  className="py-3 px-6 rounded-xl bg-forest-900 hover:bg-forest-800 text-sage-200 font-medium text-sm text-center border border-botanical-500/30"
                >
                  Close Inspection
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}

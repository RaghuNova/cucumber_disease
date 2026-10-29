import React, { useState } from 'react';
import { SYMPTOM_EXPLORER_OPTIONS } from '../data/diseases';
import { HelpCircle, AlertTriangle, Search, Camera, ArrowRight, CheckCircle } from 'lucide-react';

export default function SymptomExplorer({ onOpenDiagnosis }) {
  const [selectedSymptom, setSelectedSymptom] = useState(SYMPTOM_EXPLORER_OPTIONS[0]);

  return (
    <section id="symptom-matcher" className="py-24 bg-forest-950 bg-organic-vines border-b border-botanical-500/15 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-botanical-500/10 border border-botanical-400/30 text-xs font-mono text-botanical-300">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Differential Diagnostic Guide</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-white font-normal">
            What Are You <span className="italic text-botanical-300">Noticing in the Field?</span>
          </h2>
          <p className="text-sage-200 text-base sm:text-lg font-light leading-relaxed">
            Select a prominent visual pattern to review potential causes, physical signs to corroborate, 
            and why photographic analysis is recommended over informal visual guesswork.
          </p>
        </div>

        {/* 2-Column Symptom Explorer Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Selectable Symptom Buttons */}
          <div className="lg:col-span-5 space-y-3 text-left">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-sage-400 block mb-2">
              Select Observed Symptom
            </span>
            {SYMPTOM_EXPLORER_OPTIONS.map((opt) => {
              const isSelected = selectedSymptom.id === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setSelectedSymptom(opt)}
                  className={`w-full p-4 rounded-2xl text-left transition-all duration-200 border flex items-center justify-between ${
                    isSelected
                      ? 'bg-botanical-500/15 border-botanical-400 text-white shadow-lg ring-1 ring-botanical-400/30'
                      : 'bg-forest-900/60 border-botanical-500/15 text-sage-300 hover:bg-forest-900 hover:text-white hover:border-botanical-400/30'
                  }`}
                >
                  <span className="font-editorial text-base font-medium">
                    {opt.label}
                  </span>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
                    isSelected ? 'border-botanical-400 bg-botanical-500 text-white' : 'border-sage-500 bg-transparent'
                  }`}>
                    {isSelected && <CheckCircle className="w-3.5 h-3.5" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Educational Context Panel */}
          <div className="lg:col-span-7 text-left">
            <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-botanical-400/30 bg-forest-950 space-y-6 shadow-2xl">
              
              <div className="border-b border-botanical-500/20 pb-4">
                <span className="text-xs font-mono text-botanical-400 uppercase tracking-wider">
                  Differential Agronomic Context
                </span>
                <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-white mt-1">
                  {selectedSymptom.label}
                </h3>
              </div>

              {/* Possible Explanations */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-xs font-semibold text-amber-300 font-mono uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Possible Explanations to Consider</span>
                </div>
                <p className="text-sm text-sage-100 font-light leading-relaxed">
                  {selectedSymptom.possibleCauses}
                </p>
              </div>

              {/* What to inspect next */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-xs font-semibold text-sage-300 font-mono uppercase tracking-wider">
                  <Search className="w-4 h-4 text-botanical-400" />
                  <span>Physical Signs to Check Next</span>
                </div>
                <p className="text-sm text-sage-200 font-light leading-relaxed">
                  {selectedSymptom.whatToCheck}
                </p>
              </div>

              {/* Why a photograph helps */}
              <div className="p-4 rounded-2xl bg-botanical-500/10 border border-botanical-500/25 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-semibold text-botanical-300 font-mono uppercase tracking-wider">
                  <Camera className="w-4 h-4 text-botanical-300" />
                  <span>Why ConvNeXt Classification Helps</span>
                </div>
                <p className="text-xs text-sage-200 leading-relaxed">
                  {selectedSymptom.whyPhotoHelps}
                </p>
              </div>

              {/* Disclaimer */}
              <p className="text-[11px] text-sage-400 italic">
                * Note: This is an educational symptom explorer, not a diagnostic engine. 
                Symptom selection does not diagnose the plant and does not override model predictions.
              </p>

              {/* CTA */}
              <div className="pt-2">
                <button
                  onClick={onOpenDiagnosis}
                  className="inline-flex items-center space-x-2.5 px-6 py-3.5 rounded-xl bg-botanical-500 hover:bg-botanical-400 text-white font-medium text-sm shadow-lg transition-transform hover:scale-[1.01]"
                >
                  <span>Upload & Analyze Leaf Photo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

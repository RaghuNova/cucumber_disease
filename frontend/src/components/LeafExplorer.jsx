import React, { useState } from 'react';
import { LEAF_HOTSPOTS } from '../data/diseases';
import { Eye, AlertCircle, Search, Sparkles, CheckCircle2 } from 'lucide-react';

export default function LeafExplorer({ onOpenDiagnosis }) {
  const [selectedHotspot, setSelectedHotspot] = useState(LEAF_HOTSPOTS[0]);

  return (
    <section id="leaf-explorer" className="py-20 lg:py-28 bg-forest-900 border-b border-botanical-500/15 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-botanical-500/10 border border-botanical-400/30 text-xs font-mono text-botanical-300">
            <Eye className="w-3.5 h-3.5" />
            <span>Interactive Foliar Anatomy</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-white font-normal">
            Get to Know Your <span className="italic text-botanical-300">Cucumber Leaf.</span>
          </h2>
          <p className="text-sage-200 text-base sm:text-lg font-light leading-relaxed">
            Botanical symptoms rarely exist in isolation. Click or focus on the four inspection zones 
            below to understand how lesion geometry, vascular veins, and margins reveal foliar health.
          </p>
        </div>

        {/* Interactive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left / Center: Interactive Leaf Visual with Hotspots */}
          <div className="lg:col-span-7 relative">
            <div className="relative rounded-3xl overflow-hidden glass-panel p-3 border border-botanical-500/25 shadow-2xl bg-forest-950">
              
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-forest-900">
                <img 
                  src="/samples/downy_sample.jpg" 
                  alt="Detailed cucumber leaf with visible foliar zones and symptoms" 
                  className="w-full h-full object-cover object-center filter contrast-[1.08] saturate-[1.05]"
                  loading="lazy"
                />
                
                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent to-forest-950/30 pointer-events-none"></div>

                {/* Hotspot buttons */}
                {LEAF_HOTSPOTS.map((hotspot, idx) => {
                  const isSelected = selectedHotspot.id === hotspot.id;
                  return (
                    <button
                      key={hotspot.id}
                      onClick={() => setSelectedHotspot(hotspot)}
                      onFocus={() => setSelectedHotspot(hotspot)}
                      style={{ top: hotspot.y, left: hotspot.x }}
                      aria-label={`Zone ${idx + 1}: ${hotspot.title}`}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 ${
                        isSelected ? 'z-30 scale-125' : 'z-20 hover:scale-115'
                      }`}
                    >
                      {/* Pulse Ring */}
                      <span className={`absolute -inset-2 rounded-full animate-ping opacity-75 ${
                        isSelected ? 'bg-botanical-400' : 'bg-botanical-500/30'
                      }`}></span>

                      {/* Hotspot Center Dot */}
                      <span className={`relative w-9 h-9 rounded-full flex items-center justify-center font-mono font-bold text-xs shadow-lg transition-colors border ${
                        isSelected 
                          ? 'bg-botanical-400 text-forest-950 border-white ring-4 ring-botanical-400/40' 
                          : 'bg-forest-950/90 text-botanical-300 border-botanical-400/60 hover:bg-botanical-500 hover:text-white'
                      }`}>
                        {idx + 1}
                      </span>
                    </button>
                  );
                })}

                {/* Hotspot Selector Pills (Mobile Friendly) */}
                <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2 justify-center">
                  {LEAF_HOTSPOTS.map((h, idx) => (
                    <button
                      key={h.id}
                      onClick={() => setSelectedHotspot(h)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur transition-all ${
                        selectedHotspot.id === h.id
                          ? 'bg-botanical-500 text-white shadow-md'
                          : 'bg-forest-950/80 text-sage-300 hover:bg-forest-900 border border-botanical-500/20'
                      }`}
                    >
                      Zone {idx + 1}: {h.title}
                    </button>
                  ))}
                </div>

              </div>

            </div>
          </div>

          {/* Right: Dynamic Information Panel */}
          <div className="lg:col-span-5 text-left">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-botanical-400/25 space-y-6 shadow-xl bg-forest-950/90">
              
              {/* Header */}
              <div className="border-b border-botanical-500/20 pb-4">
                <span className="text-xs font-mono text-botanical-400 uppercase tracking-wider">
                  Inspection Zone Profile
                </span>
                <h3 className="font-editorial text-2xl font-bold text-white mt-1">
                  {selectedHotspot.title}
                </h3>
              </div>

              {/* What You Are Observing */}
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2 text-xs font-semibold text-sage-300">
                  <Eye className="w-4 h-4 text-botanical-300" />
                  <span>What You Are Observing</span>
                </div>
                <p className="text-sm text-sage-100 font-light leading-relaxed">
                  {selectedHotspot.observation}
                </p>
              </div>

              {/* Possible Causes */}
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2 text-xs font-semibold text-amber-300">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span>Possible Causes (Differential)</span>
                </div>
                <p className="text-sm text-sage-200 font-light leading-relaxed">
                  {selectedHotspot.possibleCauses}
                </p>
              </div>

              {/* What Other Symptoms to Check */}
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2 text-xs font-semibold text-sage-300">
                  <Search className="w-4 h-4 text-botanical-400" />
                  <span>Other Signs to Check on the Plant</span>
                </div>
                <p className="text-sm text-sage-200 font-light leading-relaxed">
                  {selectedHotspot.symptomsToCheck}
                </p>
              </div>

              {/* When AI Screening Is Useful */}
              <div className="p-4 rounded-xl bg-botanical-500/10 border border-botanical-500/25 space-y-1.5">
                <div className="flex items-center space-x-2 text-xs font-semibold text-botanical-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>When AI Screening Is Useful</span>
                </div>
                <p className="text-xs text-sage-200 leading-relaxed">
                  {selectedHotspot.screeningRole}
                </p>
              </div>

              {/* Call to action inside panel */}
              <div className="pt-2">
                <button
                  onClick={onOpenDiagnosis}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-botanical-500 to-botanical-600 hover:from-botanical-400 hover:to-botanical-500 text-white font-medium text-sm text-center shadow-lg transition-transform hover:scale-[1.01]"
                >
                  Screen a Leaf from Your Field
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

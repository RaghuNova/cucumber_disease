import React, { useState } from 'react';
import { Sparkles, ArrowRight, Compass, Info, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function HeroSection({ onOpenDiagnosis, onExploreDiseases }) {
  const [activeHotspot, setActiveHotspot] = useState('spots');

  const heroHotspots = {
    spots: {
      title: "Leaf Spots & Lesions",
      desc: "Visible necrotic spots indicate cellular breakdown. Notice whether borders are vein-bounded (angular) or spreading freely across the leaf blade."
    },
    yellowing: {
      title: "Chlorotic Yellowing",
      desc: "Yellowing reveals chlorophyll degradation. Causes range from oomycete pathogens to micro-nutrient lockout or root moisture imbalances."
    },
    powder: {
      title: "White Powder-Like Patches",
      desc: "Superficial white powdery fungal patches are characteristic of powdery mildew colonies, forming first in shaded lower leaf microclimates."
    }
  };

  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center bg-forest-950 bg-organic-vines bg-leaf-grid overflow-hidden py-16 lg:py-24 border-b border-botanical-500/15">
      
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-botanical-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-forest-700/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 space-y-8 text-left">
            
            {/* Model Badge */}
            <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-forest-900/90 border border-botanical-400/30 text-xs font-mono text-sage-200 shadow-sm backdrop-blur">
              <span className="w-2 h-2 rounded-full bg-botanical-400 animate-pulse"></span>
              <span>Pretrained ConvNeXt Classifier • 8 Supported Categories</span>
            </div>

            {/* Main Editorial Headline */}
            <div className="space-y-4">
              <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-white font-normal tracking-tight leading-[1.12]">
                Every Leaf Tells <br />
                <span className="italic font-normal text-botanical-300 underline decoration-botanical-500/40 underline-offset-8">
                  a Story.
                </span>
              </h1>
              <p className="text-base sm:text-lg text-sage-200/90 max-w-2xl font-light leading-relaxed">
                Early symptom recognition allows cucurbit growers and agronomists to identify possible 
                foliar pathogens before widespread yield collapse. Screen leaves instantly with deep learning 
                backed by authoritative plant pathology guidance.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3.5 sm:space-y-0 sm:space-x-4 pt-2">
              <button
                onClick={onOpenDiagnosis}
                className="inline-flex items-center justify-center space-x-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-botanical-500 to-botanical-600 hover:from-botanical-400 hover:to-botanical-500 text-white font-semibold text-base shadow-xl shadow-botanical-500/25 border border-botanical-400/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Analyze a Leaf</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreDiseases}
                className="inline-flex items-center justify-center space-x-2 px-7 py-4 rounded-full bg-forest-900/80 hover:bg-forest-800 text-sage-100 hover:text-white font-medium text-base border border-botanical-500/30 transition-all"
              >
                <Compass className="w-4 h-4 text-botanical-300" />
                <span>Explore Leaf Diseases</span>
              </button>
            </div>

            {/* Scientific Trust Indicator */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-botanical-500/15 max-w-xl">
              <div>
                <p className="text-xl font-editorial font-bold text-white">8 Classes</p>
                <p className="text-xs text-sage-400">Complete cucurbit scope</p>
              </div>
              <div>
                <p className="text-xl font-editorial font-bold text-botanical-300">ConvNeXt</p>
                <p className="text-xs text-sage-400">Pure vision backbone</p>
              </div>
              <div>
                <p className="text-xl font-editorial font-bold text-white">Gemini 3.6</p>
                <p className="text-xs text-sage-400">Agronomic explanations</p>
              </div>
            </div>

          </div>

          {/* Right Column: Realistic Macro Leaf Visual with Hotspots */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden glass-panel p-2.5 shadow-2xl shadow-black/60 group">
              
              {/* Macro Leaf Image */}
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-forest-900">
                <img 
                  src="/samples/healthy_sample.jpg" 
                  alt="High resolution macro photograph of cucumber leaf showing intricate vascular veins and chlorophyll tissue"
                  className="w-full h-full object-cover object-center filter saturate-[1.1] contrast-[1.05] transition-transform duration-700 group-hover:scale-105"
                  loading="eager"
                />
                
                {/* Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/20 to-transparent pointer-events-none"></div>

                {/* Hotspot 1: Leaf Spots */}
                <button
                  onClick={() => setActiveHotspot('spots')}
                  onFocus={() => setActiveHotspot('spots')}
                  aria-label="Interactive hotspot: Leaf spots"
                  className={`absolute top-1/4 left-1/3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    activeHotspot === 'spots' 
                      ? 'bg-amber-400 text-forest-950 ring-4 ring-amber-400/40 scale-110' 
                      : 'bg-forest-900/80 text-amber-300 border border-amber-400/60 hover:scale-110'
                  }`}
                >
                  <span className="text-xs font-bold font-mono">1</span>
                </button>

                {/* Hotspot 2: Yellowing */}
                <button
                  onClick={() => setActiveHotspot('yellowing')}
                  onFocus={() => setActiveHotspot('yellowing')}
                  aria-label="Interactive hotspot: Yellowing"
                  className={`absolute top-1/2 right-1/4 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    activeHotspot === 'yellowing' 
                      ? 'bg-yellow-400 text-forest-950 ring-4 ring-yellow-400/40 scale-110' 
                      : 'bg-forest-900/80 text-yellow-300 border border-yellow-400/60 hover:scale-110'
                  }`}
                >
                  <span className="text-xs font-bold font-mono">2</span>
                </button>

                {/* Hotspot 3: White Powder */}
                <button
                  onClick={() => setActiveHotspot('powder')}
                  onFocus={() => setActiveHotspot('powder')}
                  aria-label="Interactive hotspot: White powder-like patches"
                  className={`absolute bottom-1/3 left-1/4 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    activeHotspot === 'powder' 
                      ? 'bg-teal-300 text-forest-950 ring-4 ring-teal-300/40 scale-110' 
                      : 'bg-forest-900/80 text-teal-200 border border-teal-300/60 hover:scale-110'
                  }`}
                >
                  <span className="text-xs font-bold font-mono">3</span>
                </button>

                {/* Bottom Overlay Label */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="p-3.5 rounded-xl bg-forest-950/90 backdrop-blur border border-botanical-500/30 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-botanical-300 flex items-center space-x-1.5">
                        <Info className="w-3.5 h-3.5" />
                        <span>{heroHotspots[activeHotspot].title}</span>
                      </span>
                      <span className="text-[10px] text-sage-400 font-mono">Interactive Observation</span>
                    </div>
                    <p className="text-xs text-sage-200 leading-snug">
                      {heroHotspots[activeHotspot].desc}
                    </p>
                    <p className="text-[10px] text-sage-400 mt-1 italic">
                      * Illustrative hotspot for educational orientation; not a diagnostic assessment.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

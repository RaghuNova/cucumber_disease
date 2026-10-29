import React from 'react';
import { Camera, Check, X, ArrowRight, Sun, Focus, Crop, Eye } from 'lucide-react';

export default function PhotoGuide({ onOpenDiagnosis }) {
  const tips = [
    {
      icon: Sun,
      title: "Diffused, Natural Daylight",
      good: "Soft morning or overcast daylight without harsh direct specular glare",
      bad: "Flash reflections, deep shadows, or extreme dark indoor lighting"
    },
    {
      icon: Focus,
      title: "Crisp Foliar Focus",
      good: "Camera focused directly on the vascular leaf lamina and lesion margins",
      bad: "Blurry camera motion or focus locked onto soil/trellis background"
    },
    {
      icon: Crop,
      title: "Balanced Framing",
      good: "Show the affected area alongside surrounding intact green leaf tissue",
      bad: "Extreme macro zoom showing only a brown dot without leaf architecture"
    },
    {
      icon: Eye,
      title: "Clean Background",
      good: "Leaf isolated against foliage canopy or neutral field backdrop",
      bad: "Hands, tools, boots, or heavy clutter obscuring the leaf blade"
    }
  ];

  return (
    <section id="photo-guide" className="py-24 bg-forest-900 border-b border-botanical-500/15 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-botanical-500/10 border border-botanical-400/30 text-xs font-mono text-botanical-300">
            <Camera className="w-3.5 h-3.5" />
            <span>Optimal Acquisition Protocol</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-white font-normal">
            How to Take a <span className="italic text-botanical-300">Diagnostic Leaf Photo.</span>
          </h2>
          <p className="text-sage-200 text-base sm:text-lg font-light leading-relaxed">
            ConvNeXt achieves its highest classification fidelity when foliar patterns are crisp, 
            evenly illuminated, and properly framed. Follow these four field guidelines.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14 text-left">
          {tips.map((tip, idx) => {
            const Icon = tip.icon;
            return (
              <div key={idx} className="glass-panel p-6 rounded-2xl border border-botanical-500/20 bg-forest-950 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-botanical-500/20 flex items-center justify-center text-botanical-300 border border-botanical-400/30">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-editorial text-lg font-bold text-white">
                    {tip.title}
                  </h3>
                </div>

                <div className="space-y-2.5 pt-3 border-t border-botanical-500/15 text-xs">
                  <div className="flex items-start space-x-2 text-emerald-300">
                    <Check className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                    <span><b>DO:</b> {tip.good}</span>
                  </div>
                  <div className="flex items-start space-x-2 text-rose-300">
                    <X className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                    <span><b>AVOID:</b> {tip.bad}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Banner */}
        <div className="glass-panel p-8 rounded-3xl border border-botanical-400/30 bg-forest-950 flex flex-col sm:flex-row items-center justify-between gap-6 text-left">
          <div className="space-y-1 max-w-xl">
            <h4 className="font-editorial text-xl font-bold text-white">
              Ready with a Specimen Photo?
            </h4>
            <p className="text-xs text-sage-300 font-light">
              Supported formats: JPEG, PNG, WEBP. Maximum file size: 15 MB. Uploaded images are processed in-memory for inference and are not permanently archived.
            </p>
          </div>
          <button
            onClick={onOpenDiagnosis}
            className="shrink-0 inline-flex items-center space-x-2 px-8 py-3.5 rounded-full bg-botanical-500 hover:bg-botanical-400 text-white font-semibold text-sm shadow-lg transition-transform hover:scale-[1.02]"
          >
            <span>Proceed to Upload</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}

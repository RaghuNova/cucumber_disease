import React from 'react';
import { Sun, Droplet, Sprout, ShieldAlert, Cpu, CheckSquare } from 'lucide-react';

export default function PhotosynthesisProblem() {
  return (
    <section className="py-24 bg-ivory-50 text-slate-800 border-b border-sage-200 relative overflow-hidden">
      
      {/* Subtle organic background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-pulp-100/60 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 text-left space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-botanical-600/10 border border-botanical-600/20 text-xs font-mono text-botanical-600">
            <Sun className="w-3.5 h-3.5" />
            <span>Foliar Photobiology & Agronomy</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-forest-950 font-normal leading-tight">
            The Solar Engine: <br />
            <span className="italic font-normal text-botanical-600">Why Cucumber Leaf Health Dictates the Harvest.</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg font-light leading-relaxed">
            In vine crops like cucumber (<i>Cucumis sativus</i>), leaves are not merely foliage—they are 
            the biochemical power plants translocating sugars into rapid fruit elongation. 
            Understanding the physiological chain reaction prevents irreversible yield drops.
          </p>
        </div>

        {/* 3 Editorial Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          
          {/* Pillar 1 */}
          <div className="bg-white rounded-2xl p-8 border border-sage-200/80 shadow-sm hover:shadow-md transition-shadow space-y-4 text-left">
            <div className="w-12 h-12 rounded-xl bg-pulp-100 flex items-center justify-center text-botanical-600 border border-botanical-500/20">
              <Sprout className="w-6 h-6" />
            </div>
            <h3 className="font-editorial text-xl font-bold text-forest-950">
              Photosynthetic Capacity & Sugar Loading
            </h3>
            <p className="text-sm text-slate-600 font-light leading-relaxed">
              Every cucumber fruit requires the carbohydrate output of multiple healthy, fully exposed leaves. 
              When downy mildew or powdery mildew colonies destroy chloroplastic tissue, vegetative growth stalls, 
              causing blossom drop, misshapen fruits, and severe sunscald.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white rounded-2xl p-8 border border-sage-200/80 shadow-sm hover:shadow-md transition-shadow space-y-4 text-left">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-500/20">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="font-editorial text-xl font-bold text-forest-950">
              The Symptom Mimic Dilemma
            </h3>
            <p className="text-sm text-slate-600 font-light leading-relaxed">
              Visual yellowing is often mistakenly diagnosed solely as a nitrogen deficit, when in reality 
              it may be early oomycete infection. Conversely, potassium deficiency mimics fungal scorch. 
              Treating fungal infection with fertilizers or vice-versa wastes inputs and worsens crop loss.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white rounded-2xl p-8 border border-sage-200/80 shadow-sm hover:shadow-md transition-shadow space-y-4 text-left">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-500/20">
              <Droplet className="w-6 h-6" />
            </div>
            <h3 className="font-editorial text-xl font-bold text-forest-950">
              Whole-Plant Context Is Indispensable
            </h3>
            <p className="text-sm text-slate-600 font-light leading-relaxed">
              A leaf screening is a rapid initial triage tool. To achieve lasting crop protection, growers must 
              couple leaf inspection with root evaluation, soil moisture monitoring, canopy airflow inspection, 
              and insect vector scouting (such as cucumber beetles).
            </p>
          </div>

        </div>

        {/* Scientific Detail Callout Banner */}
        <div className="rounded-2xl bg-forest-950 text-white p-8 lg:p-10 border border-botanical-500/30 flex flex-col lg:flex-row items-center justify-between gap-8 text-left">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2 text-xs font-mono text-botanical-300">
              <CheckSquare className="w-4 h-4 text-botanical-400" />
              <span>Integrated Pest Management (IPM) Standard</span>
            </div>
            <h4 className="font-editorial text-2xl font-bold text-white">
              Triage Early. Verify Holistically. Treat Responsibly.
            </h4>
            <p className="text-sm text-sage-200 font-light leading-relaxed">
              AI-assisted image screening offers objective, instant probabilistic classification, enabling growers 
              to isolate suspect zones days before widespread defoliation occurs.
            </p>
          </div>

          <div className="shrink-0 flex items-center space-x-4">
            <div className="px-5 py-3 rounded-xl bg-forest-900 border border-botanical-400/30 text-center">
              <span className="block text-2xl font-editorial font-bold text-botanical-300">224×224</span>
              <span className="text-[11px] text-sage-400 font-mono">Trained Resolution</span>
            </div>
            <div className="px-5 py-3 rounded-xl bg-forest-900 border border-botanical-400/30 text-center">
              <span className="block text-2xl font-editorial font-bold text-white">8</span>
              <span className="text-[11px] text-sage-400 font-mono">Classes Evaluated</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

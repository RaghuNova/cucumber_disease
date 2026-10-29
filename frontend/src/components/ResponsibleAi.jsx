import React from 'react';
import { ShieldCheck, AlertCircle, FileCheck, HelpCircle } from 'lucide-react';

export default function ResponsibleAi() {
  const commitments = [
    {
      title: "Probabilistic Screening, Not Absolute Diagnosis",
      desc: "Computer vision evaluates visual similarities between the image and training specimens. It is an initial decision-support filter, not a substitute for certified plant pathologists."
    },
    {
      title: "Strict 8-Category Scope",
      desc: "The classifier is bounded to exactly eight classes (Downy Mildew, Powdery Mildew, Healthy Leaves, Angular Leaf Spot, Anthracnose, Bacterial Wilt, Gummy Stem Blight, and Nutrient Deficiency). Non-cucurbit pathogens fall outside this model's scope."
    },
    {
      title: "Transparent Confidence Thresholds",
      desc: "Whenever prediction confidence falls below 45%, the application explicitly warns the grower that multiple stresses may overlap and recommends capturing a sharper photo or consulting extension services."
    },
    {
      title: "Evidence-Based Agronomy",
      desc: "All static and AI guidance adheres to standard IPM (Integrated Pest Management) protocols. We never advertise exaggerated cure claims, fabricated user counts, or fake crop-loss figures."
    }
  ];

  return (
    <section className="py-24 bg-forest-950 border-b border-botanical-500/15 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-botanical-500/10 border border-botanical-400/30 text-xs font-mono text-botanical-300">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Ethical Agronomic Standards</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-white font-normal">
            Responsible AI & <span className="italic text-botanical-300">Scientific Trust.</span>
          </h2>
          <p className="text-sage-200 text-base sm:text-lg font-light leading-relaxed">
            Agricultural intelligence requires absolute transparency. We design CucumberCare AI 
            to assist and empower growers—never to make reckless automated claims.
          </p>
        </div>

        {/* 4 Trust Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {commitments.map((c, idx) => (
            <div key={idx} className="p-8 rounded-2xl glass-panel border border-botanical-500/20 bg-forest-900/50 space-y-3">
              <div className="flex items-center space-x-3 text-botanical-300">
                <FileCheck className="w-5 h-5 text-botanical-400" />
                <h3 className="font-editorial text-lg font-bold text-white">
                  {c.title}
                </h3>
              </div>
              <p className="text-sm text-sage-200 font-light leading-relaxed">
                {c.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

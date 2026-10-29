import React, { useState } from 'react';
import { UploadCloud, Cpu, Sparkles, ArrowRight, CheckCircle2, Layers } from 'lucide-react';

export default function HowAiSees() {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      num: 1,
      title: "Leaf Image Capture & Preprocessing",
      subtitle: "Optical Ingestion & Normalization",
      icon: UploadCloud,
      summary: "You capture and upload a clear leaf image. The system resizes the matrix to 224×224 pixels and applies botanical channel normalization (ImageNet RGB standard).",
      details: [
        "Image decoded and checked for leaf color ratio",
        "Rescaled to 224×224 spatial dimensions required by ConvNeXt",
        "Standard tensor normalization: Mean [0.485, 0.456, 0.406], Std [0.229, 0.224, 0.225]"
      ]
    },
    {
      num: 2,
      title: "ConvNeXt Deep Feature Extraction",
      subtitle: "PyTorch timm Classifier",
      icon: Cpu,
      summary: "The convolutional neural network passes the tensor through hierarchal inverted bottleneck stages, calculating logits and calibrated softmax probabilities across all 8 classes.",
      details: [
        "Architecture: Pure vision ConvNeXt Small trained on cucumber disease pathology",
        "Generates full 8-class probability distribution without heuristic guessing",
        "Identifies top candidate and determines statistical confidence level"
      ]
    },
    {
      num: 3,
      title: "Agronomic Synthesis & Guidance",
      subtitle: "Gemini Natural-Language Engine",
      icon: Sparkles,
      summary: "The top prediction and confidence metrics are provided to Google Gemini (or Groq fallback) to generate actionable field steps and localized Kannada audio summaries.",
      details: [
        "Gemini generates concise agronomic explanation and practical field advice",
        "Offline botanical database guarantees instant answers if network APIs drop",
        "Real-time Kannada TTS streams audio for field workers and rural farmers"
      ]
    }
  ];

  return (
    <section id="how-ai-sees" className="py-24 bg-forest-900 border-b border-botanical-500/15 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-botanical-500/10 border border-botanical-400/30 text-xs font-mono text-botanical-300">
            <Layers className="w-3.5 h-3.5" />
            <span>Diagnostic Pipeline</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-white font-normal">
            How AI Sees <span className="italic text-botanical-300">a Cucumber Leaf.</span>
          </h2>
          <p className="text-sage-200 text-base sm:text-lg font-light leading-relaxed">
            Our pipeline strictly separates visual feature classification from natural-language advisory. 
            Click through each step below to inspect how a raw photo becomes an authoritative field recommendation.
          </p>
        </div>

        {/* Step Selector Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {steps.map((s) => {
            const Icon = s.icon;
            const isActive = activeStep === s.num;
            return (
              <button
                key={s.num}
                onClick={() => setActiveStep(s.num)}
                className={`p-6 rounded-2xl text-left transition-all duration-300 border flex flex-col justify-between ${
                  isActive
                    ? 'bg-forest-950 border-botanical-400 shadow-xl shadow-botanical-500/10'
                    : 'bg-forest-950/60 border-botanical-500/15 hover:border-botanical-400/40 opacity-80 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                    isActive ? 'bg-botanical-500 text-white' : 'bg-forest-900 text-sage-400'
                  }`}>
                    0{s.num}
                  </span>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-botanical-300' : 'text-sage-400'}`} />
                </div>
                <div>
                  <h3 className={`font-editorial text-lg font-bold ${isActive ? 'text-white' : 'text-sage-200'}`}>
                    {s.title}
                  </h3>
                  <p className="text-xs text-sage-400 font-mono mt-1">
                    {s.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Step Detail Card */}
        {(() => {
          const current = steps.find(s => s.num === activeStep);
          const Icon = current.icon;
          return (
            <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-botanical-400/30 text-left bg-forest-950 space-y-6">
              <div className="flex items-center space-x-3 text-botanical-300">
                <Icon className="w-6 h-6" />
                <span className="font-mono text-xs uppercase tracking-wider">
                  Step 0{current.num} Deep Dive • {current.subtitle}
                </span>
              </div>

              <h4 className="font-editorial text-2xl sm:text-3xl font-bold text-white">
                {current.title}
              </h4>

              <p className="text-base text-sage-100 font-light leading-relaxed max-w-3xl">
                {current.summary}
              </p>

              <div className="pt-4 border-t border-botanical-500/20">
                <h5 className="text-xs font-mono font-semibold uppercase tracking-wider text-sage-300 mb-3">
                  Technical Specifications
                </h5>
                <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {current.details.map((d, idx) => (
                    <li key={idx} className="p-4 rounded-xl bg-forest-900/80 border border-botanical-500/20 text-xs text-sage-200 flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-botanical-400 shrink-0 mt-0.5" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })()}

        {/* Explicit Role Separation Notice */}
        <div className="mt-8 p-6 rounded-2xl bg-forest-950/80 border border-amber-500/30 text-left flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono text-amber-300 uppercase tracking-wider font-semibold">
              Crucial Architectural Clarification
            </span>
            <p className="text-xs text-sage-200">
              <b>ConvNeXt</b> processes the pixel tensor and predicts the 8 category probabilities. 
              <b>Gemini</b> generates natural-language agronomic explanations from those predictions. 
              Neither Gemini nor Groq analyzes the raw photograph directly.
            </p>
          </div>
          <div className="shrink-0 font-mono text-[11px] px-3 py-1.5 rounded-lg bg-forest-900 text-sage-300 border border-botanical-500/20">
            Vision ≠ LLM
          </div>
        </div>

      </div>
    </section>
  );
}

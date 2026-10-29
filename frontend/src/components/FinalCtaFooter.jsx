import React from 'react';
import { ArrowRight, Leaf, Shield, Heart } from 'lucide-react';

export default function FinalCtaFooter({ onOpenDiagnosis, onScrollTo }) {
  return (
    <>
      {/* Final CTA Section */}
      <section className="py-24 bg-forest-900 bg-organic-vines relative overflow-hidden border-b border-botanical-500/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
          
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-botanical-500 to-forest-800 mx-auto flex items-center justify-center shadow-xl shadow-botanical-500/20 border border-botanical-400/30">
            <Leaf className="w-8 h-8 text-white" />
          </div>

          <div className="space-y-4">
            <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-white font-normal leading-tight">
              Give Every Leaf <br />
              <span className="italic font-normal text-botanical-300">a Closer Look.</span>
            </h2>
            <p className="text-sage-200 text-base sm:text-lg font-light max-w-2xl mx-auto leading-relaxed">
              Early detection protects healthy vines, avoids pesticide overuse, and safeguards cucumber yields. 
              Upload a photograph to receive an instant botanical screening.
            </p>
          </div>

          <div>
            <button
              onClick={onOpenDiagnosis}
              className="inline-flex items-center space-x-3 px-10 py-5 rounded-full bg-gradient-to-r from-botanical-500 to-botanical-600 hover:from-botanical-400 hover:to-botanical-500 text-white font-semibold text-lg shadow-2xl shadow-botanical-500/30 border border-botanical-400/40 transition-transform hover:scale-105 active:scale-95"
            >
              <span>Analyze a Leaf Now</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

        </div>
      </section>

      {/* Restrained Botanical Footer */}
      <footer className="bg-forest-950 text-sage-300 py-16 border-t border-botanical-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-left mb-12">
            
            {/* Col 1: Brand */}
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center space-x-2">
                <Leaf className="w-5 h-5 text-botanical-400" />
                <span className="font-editorial text-lg font-bold text-white">CucumberCare AI</span>
              </div>
              <p className="text-xs text-sage-400 leading-relaxed font-light">
                Agricultural computer vision & agronomic intelligence engineered for precision cucumber leaf pathology.
              </p>
              <p className="text-[11px] font-mono text-sage-500">
                PyTorch • timm ConvNeXt • Gemini 3.6
              </p>
            </div>

            {/* Col 2: Navigation */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-white">
                Platform Navigation
              </h4>
              <ul className="text-xs space-y-2">
                <li><button onClick={() => onScrollTo('hero')} className="hover:text-botanical-300">Foliar Overview</button></li>
                <li><button onClick={() => onScrollTo('leaf-explorer')} className="hover:text-botanical-300">Leaf Anatomy Explorer</button></li>
                <li><button onClick={() => onScrollTo('disease-guide')} className="hover:text-botanical-300">8 Supported Categories</button></li>
                <li><button onClick={() => onScrollTo('how-ai-sees')} className="hover:text-botanical-300">Diagnostic Pipeline</button></li>
                <li><button onClick={() => onScrollTo('symptom-matcher')} className="hover:text-botanical-300">Symptom Matcher</button></li>
                <li><button onClick={() => onScrollTo('photo-guide')} className="hover:text-botanical-300">Photo Quality Protocol</button></li>
              </ul>
            </div>

            {/* Col 3: Primary Targets */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-white">
                Primary Diseases
              </h4>
              <ul className="text-xs space-y-2 text-sage-400">
                <li>Downy Mildew (<i>Pseudoperonospora</i>)</li>
                <li>Powdery Mildew (<i>Podosphaera</i>)</li>
                <li>Healthy Baseline Leaves</li>
                <li>Angular Leaf Spot (<i>Pseudomonas</i>)</li>
                <li>Anthracnose (<i>Colletotrichum</i>)</li>
                <li>Bacterial Wilt (<i>Erwinia</i>)</li>
              </ul>
            </div>

            {/* Col 4: Attribution & Licensing */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-white">
                Model & Provenance
              </h4>
              <p className="text-xs text-sage-400 leading-relaxed">
                Backbone: <code className="font-mono text-botanical-300">ixrbhii/cucumber-disease-convnext</code> hosted on Hugging Face (Apache-2.0 License).
              </p>
              <p className="text-xs text-sage-400 leading-relaxed">
                Agronomic Engine: Google Gemini Interactions API with local static pathology fallback. Spoken guidance in Kannada.
              </p>
            </div>

          </div>

          {/* Legal / Disclaimer Bottom Bar */}
          <div className="pt-8 border-t border-botanical-500/15 flex flex-col sm:flex-row items-center justify-between text-[11px] text-sage-500 space-y-4 sm:space-y-0 text-left">
            <p>
              © {new Date().getFullYear()} CucumberCare AI Project. Educational screening system for agricultural decision-support.
            </p>
            <p className="max-w-md text-right text-[10px] text-sage-400">
              Disclaimer: Always consult qualified local agronomists before applying chemical or systemic treatments.
            </p>
          </div>

        </div>
      </footer>
    </>
  );
}

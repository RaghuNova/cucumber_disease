import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import LeafExplorer from './components/LeafExplorer';
import PhotosynthesisProblem from './components/PhotosynthesisProblem';
import DiseaseGuide from './components/DiseaseGuide';
import HowAiSees from './components/HowAiSees';
import SymptomExplorer from './components/SymptomExplorer';
import PhotoGuide from './components/PhotoGuide';
import ResponsibleAi from './components/ResponsibleAi';
import FinalCtaFooter from './components/FinalCtaFooter';
import DiagnosisWorkspace from './components/DiagnosisWorkspace';

export default function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'diagnosis'

  const scrollToSection = (id) => {
    setCurrentView('landing');
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const openDiagnosis = () => {
    setCurrentView('diagnosis');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-forest-950 text-slate-100 flex flex-col font-sans selection:bg-botanical-500 selection:text-white">
      {/* Navigation Bar */}
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'landing' ? (
          <div>
            {/* Section A: Immersive Hero */}
            <HeroSection 
              onOpenDiagnosis={openDiagnosis}
              onExploreDiseases={() => scrollToSection('disease-guide')}
            />

            {/* Section B: Interactive Leaf Explorer */}
            <LeafExplorer 
              onOpenDiagnosis={openDiagnosis}
            />

            {/* Section C: Why Leaf Health Matters */}
            <PhotosynthesisProblem />

            {/* Section D: 8 Detectable Categories */}
            <DiseaseGuide 
              onOpenDiagnosis={openDiagnosis}
            />

            {/* Section E: How AI Sees a Leaf */}
            <HowAiSees />

            {/* Section F: Symptom Comparison Matcher */}
            <SymptomExplorer 
              onOpenDiagnosis={openDiagnosis}
            />

            {/* Section G: Photo Quality Guide */}
            <PhotoGuide 
              onOpenDiagnosis={openDiagnosis}
            />

            {/* Section H: Responsible AI & Trust */}
            <ResponsibleAi />

            {/* Section I: Final CTA & Footer */}
            <FinalCtaFooter 
              onOpenDiagnosis={openDiagnosis}
              onScrollTo={scrollToSection}
            />
          </div>
        ) : (
          /* Dedicated Diagnosis Workspace View */
          <DiagnosisWorkspace 
            onBackToLanding={() => {
              setCurrentView('landing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>
    </div>
  );
}

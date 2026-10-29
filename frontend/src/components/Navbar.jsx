import React, { useState } from 'react';
import { Leaf, Microscope, Sparkles, Menu, X, ArrowUpRight } from 'lucide-react';

export default function Navbar({ currentView, setCurrentView }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    if (currentView !== 'landing') {
      setCurrentView('landing');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-forest-950/85 backdrop-blur-md border-b border-botanical-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Botanical Brand */}
          <div 
            onClick={() => setCurrentView('landing')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-botanical-500 to-forest-800 flex items-center justify-center shadow-lg shadow-botanical-500/20 border border-botanical-400/30 group-hover:scale-105 transition-transform">
              <Leaf className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-editorial text-xl font-bold tracking-tight text-white group-hover:text-botanical-300 transition-colors">
                  CucumberCare<span className="text-botanical-400 font-sans font-medium text-xs ml-1 px-1.5 py-0.5 rounded bg-botanical-500/20 border border-botanical-400/30">AI</span>
                </span>
              </div>
              <p className="text-[10px] text-sage-300 font-mono tracking-wider uppercase">
                Botanical Pathology Lab
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-sage-200">
            <button 
              onClick={() => scrollToSection('hero')} 
              className="hover:text-white transition-colors focus:outline-none"
            >
              Overview
            </button>
            <button 
              onClick={() => scrollToSection('leaf-explorer')} 
              className="hover:text-white transition-colors focus:outline-none"
            >
              Leaf Explorer
            </button>
            <button 
              onClick={() => scrollToSection('disease-guide')} 
              className="hover:text-white transition-colors focus:outline-none"
            >
              8 Categories
            </button>
            <button 
              onClick={() => scrollToSection('how-ai-sees')} 
              className="hover:text-white transition-colors focus:outline-none"
            >
              How AI Sees
            </button>
            <button 
              onClick={() => scrollToSection('symptom-matcher')} 
              className="hover:text-white transition-colors focus:outline-none"
            >
              Symptom Matcher
            </button>
            <button 
              onClick={() => scrollToSection('photo-guide')} 
              className="hover:text-white transition-colors focus:outline-none"
            >
              Photo Guide
            </button>
          </nav>

          {/* Right Action CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="text-right">
              <div className="flex items-center justify-end space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs text-sage-300 font-mono">ConvNeXt Active</span>
              </div>
            </div>

            <button
              onClick={() => setCurrentView(currentView === 'diagnosis' ? 'landing' : 'diagnosis')}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-botanical-500 to-botanical-600 hover:from-botanical-400 hover:to-botanical-500 text-white font-medium text-sm shadow-md shadow-botanical-500/25 border border-botanical-400/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Microscope className="w-4 h-4" />
              <span>{currentView === 'diagnosis' ? 'Explore Landing Page' : 'Diagnosis Workspace'}</span>
              <ArrowUpRight className="w-4 h-4 opacity-75" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-sage-200 hover:text-white hover:bg-forest-900 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-forest-900/95 border-b border-botanical-500/30 px-4 pt-3 pb-6 space-y-3">
          <button 
            onClick={() => scrollToSection('hero')} 
            className="block w-full text-left py-2 text-base font-medium text-sage-100 hover:text-white"
          >
            Overview
          </button>
          <button 
            onClick={() => scrollToSection('leaf-explorer')} 
            className="block w-full text-left py-2 text-base font-medium text-sage-100 hover:text-white"
          >
            Leaf Explorer
          </button>
          <button 
            onClick={() => scrollToSection('disease-guide')} 
            className="block w-full text-left py-2 text-base font-medium text-sage-100 hover:text-white"
          >
            8 Detectable Categories
          </button>
          <button 
            onClick={() => scrollToSection('how-ai-sees')} 
            className="block w-full text-left py-2 text-base font-medium text-sage-100 hover:text-white"
          >
            How AI Sees a Leaf
          </button>
          <button 
            onClick={() => scrollToSection('symptom-matcher')} 
            className="block w-full text-left py-2 text-base font-medium text-sage-100 hover:text-white"
          >
            Symptom Matcher
          </button>
          <button 
            onClick={() => scrollToSection('photo-guide')} 
            className="block w-full text-left py-2 text-base font-medium text-sage-100 hover:text-white"
          >
            Photo Guide
          </button>
          
          <div className="pt-3 border-t border-botanical-500/20">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setCurrentView(currentView === 'diagnosis' ? 'landing' : 'diagnosis');
              }}
              className="w-full py-3 rounded-xl bg-botanical-500 text-white font-medium text-center flex items-center justify-center space-x-2"
            >
              <Microscope className="w-5 h-5" />
              <span>{currentView === 'diagnosis' ? 'Back to Landing' : 'Open Diagnosis Workspace'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

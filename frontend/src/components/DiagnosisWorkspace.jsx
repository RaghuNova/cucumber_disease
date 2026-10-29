import React, { useState, useRef } from 'react';
import { 
  UploadCloud, Microscope, RefreshCw, Volume2, VolumeX, Download, 
  AlertTriangle, CheckCircle, Info, ShieldAlert, ArrowLeft, FileText, 
  Sparkles, Check, ChevronDown, ChevronUp, Droplet, Sun, Wind, Activity
} from 'lucide-react';

export default function DiagnosisWorkspace({ onBackToLanding }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [predictionResult, setPredictionResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [nutritionExpanded, setNutritionExpanded] = useState(true);

  const fileInputRef = useRef(null);
  const abortControllerRef = useRef(null);
  const audioRef = useRef(null);

  // Sample leaf presets for instant testing
  const samplePresets = [
    { name: "Healthy Leaf Sample", url: "/samples/healthy_sample.jpg", label: "Healthy Leaves" },
    { name: "Downy Mildew Sample", url: "/samples/downy_sample.jpg", label: "Downy Mildew" },
    { name: "Powdery Mildew Sample", url: "/samples/powdery_sample.jpg", label: "Powdery Mildew" }
  ];

  const handleFileSelect = (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage("Please select a valid image file (JPEG, PNG, WEBP).");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage("Image exceeds the 15 MB size limit. Please choose a smaller photo.");
      return;
    }

    setErrorMessage(null);
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setPredictionResult(null);
  };

  const loadSample = async (preset) => {
    try {
      setErrorMessage(null);
      setPredictionResult(null);
      const res = await fetch(preset.url);
      const blob = await res.blob();
      const file = new File([blob], `${preset.label.toLowerCase().replace(/ /g, '_')}_specimen.jpg`, { type: "image/jpeg" });
      setSelectedFile(file);
      setPreviewUrl(preset.url);
    } catch (e) {
      setErrorMessage("Could not load sample image. Please upload a file manually.");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const runAnalysis = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setErrorMessage(null);
    setStatusMessage("Ingesting specimen tensor into memory...");

    abortControllerRef.current = new AbortController();

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const t1 = setTimeout(() => setStatusMessage("Extracting ConvNeXt feature maps (224×224)..."), 400);
      const t2 = setTimeout(() => setStatusMessage("Evaluating 8-class softmax probability distribution..."), 900);
      const t3 = setTimeout(() => setStatusMessage("Synthesizing agronomic guidance with Gemini engine..."), 1500);

      const response = await fetch("/api/predict", {
        method: "POST",
        body: formData,
        signal: abortControllerRef.current.signal
      });

      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server responded with status ${response.status}`);
      }

      const data = await response.json();
      setPredictionResult(data);
    } catch (err) {
      if (err.name === 'AbortError') {
        setErrorMessage("Analysis was cancelled by the user.");
      } else {
        setErrorMessage(err.message || "An error occurred while analyzing the specimen.");
      }
    } finally {
      setIsAnalyzing(false);
      setStatusMessage('');
    }
  };

  const cancelAnalysis = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsAnalyzing(false);
  };

  const resetWorkspace = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setPredictionResult(null);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Play spoken Kannada audio
  const toggleKannadaAudio = () => {
    if (isPlayingAudio && audioRef.current) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
      return;
    }

    if (!predictionResult) return;

    const speechText = predictionResult.kannada_audio_text || "";
    const audioUrl = `/api/speak?text=${encodeURIComponent(speechText)}&condition=${encodeURIComponent(predictionResult.prediction)}`;
    
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    audio.onplay = () => setIsPlayingAudio(true);
    audio.onended = () => setIsPlayingAudio(false);
    audio.onerror = () => {
      setIsPlayingAudio(false);
      alert("Could not stream spoken audio. Please check audio device settings.");
    };

    audio.play().catch(e => {
      console.warn("Audio autoplay blocked:", e);
      setIsPlayingAudio(false);
    });
  };

  // Download PDF Report
  const downloadPdfReport = async () => {
    if (!predictionResult) return;

    setIsGeneratingPdf(true);
    try {
      const payload = {
        prediction: predictionResult.prediction,
        confidence_percentage: predictionResult.confidence_percentage,
        confidence_level: predictionResult.confidence_level,
        scientific_name: predictionResult.scientific_name || "",
        provider: predictionResult.provider || "Gemini 3.6 Flash",
        top_3: predictionResult.top_3 || [],
        what_it_is: predictionResult.what_it_is || "",
        common_visible_symptoms: predictionResult.common_visible_symptoms || [],
        likely_causes: predictionResult.likely_causes || [],
        distinguishing_features: predictionResult.distinguishing_features || "",
        immediate_actions: predictionResult.immediate_actions || [],
        prevention_checklist: predictionResult.prevention_checklist || [],
        when_to_seek_expert: predictionResult.when_to_seek_expert || "",
        treatment_cautions: predictionResult.treatment_cautions || "",
        nutrient_assessment: predictionResult.nutrient_assessment || {},
        disclaimer: predictionResult.disclaimer || ""
      };

      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed to generate PDF report.");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `CucumberCare_Assessment_${predictionResult.prediction.replace(/ /g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      alert("Error downloading diagnostic report: " + e.message);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Visual styling helper for primary card
  const getResultStyle = (prediction, confidence) => {
    if (confidence < 0.45) {
      return {
        badgeBg: "bg-amber-500/20 border-amber-500/40 text-amber-300",
        borderColor: "border-amber-500/50",
        cardBg: "from-amber-950/25 to-forest-950",
        accent: "text-amber-400"
      };
    }
    if (prediction === "Healthy Leaves" || prediction === "Healthy") {
      return {
        badgeBg: "bg-emerald-500/20 border-emerald-500/40 text-emerald-300",
        borderColor: "border-emerald-500/50",
        cardBg: "from-emerald-950/25 to-forest-950",
        accent: "text-emerald-400"
      };
    }
    if (prediction === "Downy Mildew") {
      return {
        badgeBg: "bg-yellow-500/20 border-yellow-500/40 text-yellow-300",
        borderColor: "border-yellow-500/50",
        cardBg: "from-yellow-950/25 to-forest-950",
        accent: "text-yellow-400"
      };
    }
    if (prediction === "Powdery Mildew") {
      return {
        badgeBg: "bg-teal-500/20 border-teal-500/40 text-teal-300",
        borderColor: "border-teal-500/50",
        cardBg: "from-teal-950/25 to-forest-950",
        accent: "text-teal-400"
      };
    }
    if (prediction === "Nutrient Deficiency") {
      return {
        badgeBg: "bg-lime-500/20 border-lime-500/40 text-lime-300",
        borderColor: "border-lime-500/50",
        cardBg: "from-lime-950/25 to-forest-950",
        accent: "text-lime-400"
      };
    }
    return {
      badgeBg: "bg-botanical-500/20 border-botanical-500/40 text-botanical-300",
      borderColor: "border-botanical-500/50",
      cardBg: "from-botanical-950/25 to-forest-950",
      accent: "text-botanical-400"
    };
  };

  return (
    <div className="min-h-screen bg-forest-950 bg-leaf-grid text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Workspace Top Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-botanical-500/20">
          <div className="flex items-center space-x-4 text-left">
            <button
              onClick={onBackToLanding}
              className="p-2.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-sage-300 hover:text-white border border-botanical-500/30 transition-all flex items-center space-x-1.5 text-xs font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Overview</span>
            </button>
            <div>
              <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Leaf Health Assessment
              </h1>
              <p className="text-xs text-sage-400 font-mono">
                Disease-First Classification • Pretrained ConvNeXt (8-Class) • Separate Nutritional Assessment
              </p>
            </div>
          </div>

          {previewUrl && (
            <button
              onClick={resetWorkspace}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-forest-900 hover:bg-forest-800 text-xs font-mono text-sage-300 hover:text-white border border-botanical-500/30 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset & New Specimen</span>
            </button>
          )}
        </div>

        {/* Error banner */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-950/70 border border-rose-500/40 text-rose-200 text-xs flex items-center justify-between text-left animate-fade-in">
            <div className="flex items-center space-x-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button onClick={() => setErrorMessage(null)} className="text-rose-400 hover:text-white font-mono text-xs">
              Dismiss
            </button>
          </div>
        )}

        {/* Main 2-Column Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
          
          {/* ================================================= */}
          {/* LEFT COLUMN: Upload, Sample Presets, Preview      */}
          {/* ================================================= */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Upload Zone Card */}
            <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-botanical-500/25 bg-forest-950/90 space-y-5">
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-botanical-400">
                  Specimen Ingestion
                </span>
                <span className="text-[11px] font-mono text-sage-400">
                  Max: 15 MB
                </span>
              </div>

              {/* Drag and Drop Zone */}
              {!previewUrl ? (
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  className="border-2 border-dashed border-botanical-500/40 hover:border-botanical-400/80 rounded-2xl p-8 sm:p-10 text-center cursor-pointer bg-forest-900/40 hover:bg-forest-900/70 transition-all space-y-4 group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-botanical-500/20 group-hover:scale-110 flex items-center justify-center mx-auto text-botanical-300 border border-botanical-400/30 transition-transform">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      Drop cucumber leaf photo here, or <span className="text-botanical-400 underline underline-offset-4">browse files</span>
                    </p>
                    <p className="text-xs text-sage-400 mt-1 font-light">
                      Supports high-resolution JPEG, PNG, or WEBP photos
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                  />
                </div>
              ) : (
                /* Specimen Image Preview Container with Laser Scanner */
                <div className="relative rounded-2xl overflow-hidden border border-botanical-500/30 bg-forest-900 aspect-[4/3] group">
                  <img
                    src={previewUrl}
                    alt="Uploaded cucumber specimen preview"
                    className="w-full h-full object-cover object-center"
                  />

                  {/* Animated Scanner Laser Bar when analyzing */}
                  {isAnalyzing && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-lg shadow-emerald-400/80 animate-scanner"></div>
                      <div className="absolute inset-0 bg-botanical-500/10 backdrop-blur-[1px]"></div>
                    </div>
                  )}

                  {/* File Metadata Overlay Pill */}
                  <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-forest-950/85 backdrop-blur border border-botanical-500/20 text-xs flex items-center justify-between">
                    <span className="truncate max-w-[200px] text-sage-200 font-mono text-[11px]">
                      {selectedFile ? selectedFile.name : "Sample Specimen"}
                    </span>
                    <button
                      onClick={() => fileInputRef.current && fileInputRef.current.click()}
                      className="text-botanical-300 hover:text-white underline text-[11px] font-mono"
                    >
                      Change Photo
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons: Run or Cancel */}
              {previewUrl && (
                <div className="space-y-3 pt-2">
                  {!isAnalyzing ? (
                    <button
                      onClick={runAnalysis}
                      disabled={isAnalyzing}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-botanical-500 to-botanical-600 hover:from-botanical-400 hover:to-botanical-500 text-white font-semibold text-sm shadow-xl shadow-botanical-500/25 flex items-center justify-center space-x-2 transition-transform hover:scale-[1.01] active:scale-[0.99]"
                    >
                      <Microscope className="w-4 h-4" />
                      <span>{predictionResult ? "Re-Analyze Specimen" : "Run Deep Classification"}</span>
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div className="p-3.5 rounded-xl bg-forest-900 border border-botanical-400/30 flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <span className="w-3 h-3 rounded-full border-2 border-botanical-400 border-t-transparent animate-spin"></span>
                          <span className="text-xs text-sage-200 font-mono">{statusMessage}</span>
                        </div>
                        <button
                          onClick={cancelAnalysis}
                          className="text-xs text-rose-400 hover:text-white font-mono px-2 py-1 rounded bg-rose-950/60 border border-rose-500/30"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Privacy and Storage Note */}
              <p className="text-[11px] text-sage-400 leading-normal font-light">
                <b>Privacy Notice:</b> Images are processed in-memory for deep learning inference and are not permanently saved or used for continuous model retraining.
              </p>

            </div>

            {/* Quick Test Sample Presets Card */}
            <div className="glass-panel p-6 rounded-3xl border border-botanical-500/20 bg-forest-950/70 space-y-3">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-sage-300 block">
                Instant Evaluation Presets
              </span>
              <p className="text-xs text-sage-400 font-light">
                Don't have a leaf photograph ready? Test the real pipeline with verified specimens:
              </p>
              <div className="grid grid-cols-3 gap-2.5 pt-1">
                {samplePresets.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => loadSample(preset)}
                    className="p-2.5 rounded-xl bg-forest-900 hover:bg-forest-800 border border-botanical-500/30 hover:border-botanical-400 text-left transition-all group"
                  >
                    <div className="aspect-square rounded-lg overflow-hidden mb-2 bg-forest-950">
                      <img src={preset.url} alt={preset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <span className="text-[11px] font-medium text-sage-200 group-hover:text-white block truncate">
                      {preset.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* ================================================= */}
          {/* RIGHT COLUMN: Diagnostic Results Workspace        */}
          {/* ================================================= */}
          <div className="lg:col-span-7 space-y-8">
            
            {!predictionResult ? (
              /* Empty state before diagnosis */
              <div className="glass-panel p-10 sm:p-14 rounded-3xl border border-botanical-500/20 bg-forest-950/50 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-forest-900 mx-auto flex items-center justify-center text-botanical-400 border border-botanical-500/20">
                  <Microscope className="w-8 h-8" />
                </div>
                <h3 className="font-editorial text-2xl font-bold text-white">
                  Awaiting Specimen Submission
                </h3>
                <p className="text-sm text-sage-300 font-light max-w-md mx-auto leading-relaxed">
                  Upload a photo on the left or select an evaluation preset. The ConvNeXt classifier will 
                  evaluate all eight categories and compile authoritative agronomic guidance.
                </p>
              </div>
            ) : (
              /* Verified Diagnosis Results */
              (() => {
                const style = getResultStyle(predictionResult.prediction, predictionResult.confidence);
                const isNutrientPrimary = predictionResult.prediction === "Nutrient Deficiency";
                const isLowConfidence = predictionResult.confidence < 0.45;

                return (
                  <div className="space-y-8 animate-fade-in">
                    
                    {/* ======================================================= */}
                    {/* SECTION A: Primary Disease or Health Classification      */}
                    {/* ======================================================= */}
                    <div className={`glass-panel p-6 sm:p-8 rounded-3xl border ${style.borderColor} bg-gradient-to-b ${style.cardBg} space-y-6 shadow-2xl`}>
                      
                      {/* Section A Header */}
                      <div className="flex items-center justify-between border-b border-botanical-500/20 pb-3">
                        <span className="text-xs font-mono font-bold tracking-wider uppercase text-botanical-300 flex items-center space-x-1.5">
                          <Activity className="w-4 h-4 text-botanical-400" />
                          <span>Section A: Primary Disease or Health Classification</span>
                        </span>
                        <span className="text-[11px] font-mono text-sage-400">
                          Pretrained Vision Model Output
                        </span>
                      </div>

                      {/* Primary Classification Details */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border ${style.badgeBg}`}>
                              {predictionResult.is_primary ? "★ Primary Focus Category" : "Supported Category"}
                            </span>
                            <span className="text-xs font-mono text-sage-300">
                              • {predictionResult.confidence_level}
                            </span>
                          </div>
                          <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-white tracking-tight">
                            {predictionResult.prediction}
                          </h2>
                          <p className="text-xs text-botanical-300 font-mono italic">
                            {predictionResult.scientific_name}
                          </p>
                        </div>

                        {/* Model Confidence Score */}
                        <div className="text-right sm:shrink-0 bg-forest-900/90 px-5 py-3 rounded-2xl border border-botanical-500/30">
                          <span className="block text-3xl font-editorial font-bold text-white">
                            {predictionResult.confidence_percentage}%
                          </span>
                          <span className="text-[10px] text-sage-400 font-mono uppercase tracking-wider">
                            Actual Model Probability
                          </span>
                        </div>
                      </div>

                      {/* Low Confidence Transparent Warning */}
                      {isLowConfidence && (
                        <div className="p-4 rounded-xl bg-amber-950/70 border border-amber-500/50 text-amber-200 text-xs flex items-start space-x-3">
                          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <span className="font-bold block text-amber-300">
                              Limited Confidence Notice ({predictionResult.confidence_percentage}%):
                            </span>
                            <p className="leading-relaxed">
                              The model's highest scoring category is <b>{predictionResult.prediction}</b>, but multiple conditions show overlapping resemblance. 
                              Alternative candidates are shown below. We strongly recommend capturing a clearer photo in even daylight or having an agronomist inspect the physical vine before applying chemical treatments.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Top-3 Candidates Probability Distribution Horizontal Bar Chart */}
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-sage-300 uppercase tracking-wider font-semibold">
                            Top-3 Candidate Predictions
                          </span>
                          <span className="text-sage-400 text-[11px]">Direct Model Output</span>
                        </div>

                        <div className="space-y-2.5">
                          {predictionResult.top_3.map((cand, idx) => {
                            const pct = Math.round(cand.probability * 1000) / 10;
                            return (
                              <div key={idx} className="space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span className="font-medium text-sage-100 flex items-center space-x-1.5">
                                    <span className="font-mono text-sage-400 text-[11px]">#{idx + 1}</span>
                                    <span>{cand.class_name}</span>
                                    {idx === 0 && <span className="text-[10px] text-botanical-300 font-mono">(Top Result)</span>}
                                  </span>
                                  <span className="font-mono font-bold text-botanical-300">{pct}%</span>
                                </div>
                                <div className="w-full h-2 rounded-full bg-forest-900 overflow-hidden border border-botanical-500/20">
                                  <div
                                    className={`h-full rounded-full transition-all duration-700 ${
                                      idx === 0 ? 'bg-botanical-400' : 'bg-sage-600'
                                    }`}
                                    style={{ width: `${Math.max(pct, 2)}%` }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Condition Pathology Description */}
                      {predictionResult.what_it_is && (
                        <div className="p-4 rounded-xl bg-forest-900/60 border border-botanical-500/20 text-xs text-sage-200 leading-relaxed space-y-1">
                          <span className="font-mono uppercase font-semibold text-botanical-300 block text-[11px]">
                            Condition Overview
                          </span>
                          <p>{predictionResult.what_it_is}</p>
                        </div>
                      )}

                      {/* Visible Symptoms & Distinguishing Features */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {predictionResult.common_visible_symptoms && predictionResult.common_visible_symptoms.length > 0 && (
                          <div className="p-4 rounded-xl bg-forest-900/60 border border-botanical-500/20 space-y-2">
                            <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-sage-300">
                              Common Visible Symptoms
                            </h4>
                            <ul className="space-y-1.5 text-xs text-sage-200">
                              {predictionResult.common_visible_symptoms.map((s, idx) => (
                                <li key={idx} className="flex items-start space-x-2">
                                  <span className="text-botanical-400 shrink-0 mt-0.5">•</span>
                                  <span>{s}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {predictionResult.distinguishing_features && (
                          <div className="p-4 rounded-xl bg-forest-900/60 border border-botanical-500/20 space-y-2">
                            <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-amber-300">
                              Differential Diagnosis
                            </h4>
                            <p className="text-xs text-sage-200 leading-relaxed">
                              {predictionResult.distinguishing_features}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Numbered Recommended Field Actions */}
                      {predictionResult.immediate_actions && predictionResult.immediate_actions.length > 0 && (
                        <div className="space-y-3 pt-1">
                          <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-emerald-300 flex items-center space-x-1.5">
                            <Check className="w-4 h-4 text-emerald-400" />
                            <span>Recommended Immediate Field Actions</span>
                          </h4>
                          <div className="space-y-2">
                            {predictionResult.immediate_actions.map((act, idx) => (
                              <div key={idx} className="p-3 rounded-xl bg-forest-900/90 border border-emerald-500/20 flex items-start space-x-3 text-xs text-sage-100">
                                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold flex items-center justify-center shrink-0 text-[11px] mt-0.5">
                                  {idx + 1}
                                </span>
                                <span className="leading-relaxed">{act}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Prevention Checklist */}
                      {predictionResult.prevention_checklist && predictionResult.prevention_checklist.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-sage-300">
                            Prevention & Cultural Care Checklist
                          </h4>
                          <ul className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            {predictionResult.prevention_checklist.map((prev, idx) => (
                              <li key={idx} className="p-3 rounded-xl bg-forest-900/50 border border-botanical-500/15 text-xs text-sage-300 flex items-start space-x-2">
                                <CheckCircle className="w-3.5 h-3.5 text-botanical-400 shrink-0 mt-0.5" />
                                <span>{prev}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* When to Seek Expert & Treatment Cautions */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
                        {predictionResult.when_to_seek_expert && (
                          <div className="p-4 rounded-xl bg-forest-900/40 border border-botanical-500/20 space-y-1">
                            <span className="font-mono uppercase font-semibold text-sage-300 block text-[11px]">
                              When to Seek Agronomist Consultation
                            </span>
                            <p className="text-sage-300 font-light leading-relaxed">
                              {predictionResult.when_to_seek_expert}
                            </p>
                          </div>
                        )}

                        {predictionResult.treatment_cautions && (
                          <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/30 space-y-1">
                            <span className="font-mono uppercase font-semibold text-amber-300 block text-[11px]">
                              Treatment & Safety Caution
                            </span>
                            <p className="text-amber-200/90 font-light leading-relaxed">
                              {predictionResult.treatment_cautions}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Natural Language AI Assessment Narrative */}
                      <div className="p-5 rounded-2xl bg-forest-900/80 border border-botanical-500/25 space-y-2">
                        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-botanical-300 flex items-center space-x-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Agronomic Summary ({predictionResult.provider === 'gemini' ? 'Gemini 3.6 Flash' : 'Botanical Knowledge Base'})</span>
                        </span>
                        <p className="text-xs sm:text-sm text-sage-100 font-light leading-relaxed whitespace-pre-line">
                          {predictionResult.narrative}
                        </p>
                      </div>

                    </div>


                    {/* ======================================================= */}
                    {/* SECTION B: Nutritional & Physiological Assessment       */}
                    {/* ======================================================= */}
                    <div className="glass-panel rounded-3xl border border-botanical-400/30 bg-forest-950 p-6 sm:p-8 space-y-6 shadow-xl text-left">
                      
                      <div 
                        onClick={() => setNutritionExpanded(!nutritionExpanded)}
                        className="flex items-center justify-between cursor-pointer border-b border-botanical-500/20 pb-4 select-none"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-mono font-bold tracking-wider uppercase text-emerald-300">
                              Section B: Nutritional & Physiological Assessment
                            </span>
                            {isNutrientPrimary && (
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-lime-500/20 text-lime-300 border border-lime-500/30">
                                Primary Prediction Match
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-sage-300 font-light">
                            Separate differential review of Nitrogen, Potassium, Magnesium, Iron, and root-zone abiotic stress.
                          </p>
                        </div>
                        <button className="p-2 rounded-lg bg-forest-900 text-sage-300 hover:text-white">
                          {nutritionExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>

                      {nutritionExpanded && (
                        <div className="space-y-6 animate-fade-in">
                          
                          {/* Context Note */}
                          <div className="p-4 rounded-xl bg-forest-900/60 border border-botanical-500/20 text-xs text-sage-200 leading-relaxed">
                            <p>
                              {predictionResult.nutrient_assessment?.context_note || 
                                "Visual appearance alone may not reliably distinguish nutrient deficiency from pathogen infection. Chlorosis and marginal necrosis can arise from abiotic imbalances even when pathogens are absent."}
                            </p>
                          </div>

                          {/* 4 Nutrient Cards */}
                          <div className="space-y-3">
                            <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-sage-300">
                              Key Macro & Micronutrient Symptoms in Cucurbits
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {predictionResult.nutrient_assessment?.nutrients?.map((n, idx) => (
                                <div key={idx} className="p-4 rounded-2xl bg-forest-900/80 border border-botanical-500/20 space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="font-editorial text-sm font-bold text-white">
                                      {n.nutrient}
                                    </span>
                                    <span className="text-[10px] font-mono text-sage-400">
                                      {n.category}
                                    </span>
                                  </div>
                                  <p className="text-xs text-sage-200 font-light leading-snug">
                                    <b>Symptom:</b> {n.symptoms}
                                  </p>
                                  <p className="text-[11px] text-botanical-300 font-light">
                                    <b>Distinction:</b> {n.distinction}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Abiotic Stresses */}
                          <div className="p-4 rounded-2xl bg-forest-900/50 border border-botanical-500/20 space-y-2.5">
                            <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-sage-300">
                              Common Abiotic & Root-Zone Factors
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-sage-300">
                              {predictionResult.nutrient_assessment?.abiotic_stresses?.map((stress, idx) => (
                                <div key={idx} className="p-3 rounded-xl bg-forest-950/80 border border-botanical-500/15 space-y-1">
                                  <span className="font-semibold text-sage-100 block">{stress.factor}</span>
                                  <p className="text-[11px] text-sage-400 leading-snug">{stress.impact}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Soil & Tissue Testing Checklist */}
                          <div className="p-4 rounded-xl bg-botanical-500/10 border border-botanical-500/25 space-y-2">
                            <span className="text-xs font-mono uppercase font-semibold text-botanical-300 block">
                              Diagnostic Soil & Petiole Testing Recommendations
                            </span>
                            <ul className="space-y-1.5 text-xs text-sage-200">
                              {predictionResult.nutrient_assessment?.testing_recommendations?.map((rec, idx) => (
                                <li key={idx} className="flex items-start space-x-2">
                                  <Check className="w-3.5 h-3.5 text-botanical-400 shrink-0 mt-0.5" />
                                  <span>{rec}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                        </div>
                      )}

                    </div>


                    {/* ======================================================= */}
                    {/* Audio, PDF, and Disclaimer Action Bar                   */}
                    {/* ======================================================= */}
                    <div className="pt-2 flex flex-col sm:flex-row gap-3">
                      
                      {/* Spoken Kannada Button */}
                      <button
                        onClick={toggleKannadaAudio}
                        className={`flex-1 py-3 px-4 rounded-xl border text-xs font-medium flex items-center justify-center space-x-2 transition-all ${
                          isPlayingAudio
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300 animate-pulse'
                            : 'bg-forest-900 hover:bg-forest-800 border-botanical-500/30 text-sage-200 hover:text-white'
                        }`}
                      >
                        {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-botanical-400" />}
                        <span>{isPlayingAudio ? "Stop Audio / ನಿಲ್ಲಿಸಿ" : "🔊 Listen in Kannada / ಕನ್ನಡದಲ್ಲಿ ಕೇಳಿ"}</span>
                      </button>

                      {/* Download PDF Report Button */}
                      <button
                        onClick={downloadPdfReport}
                        disabled={isGeneratingPdf}
                        className="flex-1 py-3 px-4 rounded-xl bg-botanical-600 hover:bg-botanical-500 text-white border border-botanical-400/30 text-xs font-medium flex items-center justify-center space-x-2 shadow-lg transition-transform hover:scale-[1.01]"
                      >
                        <Download className="w-4 h-4" />
                        <span>{isGeneratingPdf ? "Compiling PDF..." : "Download Official PDF Report"}</span>
                      </button>

                    </div>

                    {/* Official Screening Disclaimer */}
                    <p className="text-[11px] text-sage-400 font-light italic border-t border-botanical-500/15 pt-3 leading-normal">
                      {predictionResult.disclaimer}
                    </p>

                  </div>
                );
              })()
            )}

          </div>

        </div>

      </div>
    </div>
  );
}

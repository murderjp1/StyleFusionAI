import React, { useState, useRef } from 'react';
import { Header } from './components/Header';
import { ImageUpload } from './components/ImageUpload';
import { Button } from './components/Button';
import { ImageState, ProcessingStatus } from './types';
import { generateTryOnImage } from './services/geminiService';

const initialState: ImageState = {
  file: null,
  preview: null,
  base64: null,
  mimeType: '',
};

const App: React.FC = () => {
  const [personImage, setPersonImage] = useState<ImageState>(initialState);
  const [clothingImage, setClothingImage] = useState<ImageState>(initialState);
  const [status, setStatus] = useState<ProcessingStatus>(ProcessingStatus.IDLE);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const resultRef = useRef<HTMLDivElement>(null);

  const handleCombine = async () => {
    if (!personImage.base64 || !clothingImage.base64) {
      setError("Please upload both images first.");
      return;
    }

    setStatus(ProcessingStatus.GENERATING);
    setError(null);
    setResultImage(null);

    try {
      const generatedImage = await generateTryOnImage(
        personImage.base64,
        clothingImage.base64,
        personImage.mimeType,
        clothingImage.mimeType
      );
      
      setResultImage(generatedImage);
      setStatus(ProcessingStatus.SUCCESS);
      
      // Smooth scroll to result
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
      setStatus(ProcessingStatus.ERROR);
    }
  };

  const handleReset = () => {
    setPersonImage(initialState);
    setClothingImage(initialState);
    setResultImage(null);
    setStatus(ProcessingStatus.IDLE);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const downloadImage = () => {
    if (resultImage) {
      const link = document.createElement('a');
      link.href = resultImage;
      link.download = `stylefusion-tryon-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen relative selection:bg-indigo-500/30 overflow-x-hidden flex flex-col">
      {/* Ambient Background Lights */}
      <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[120px] animate-float" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[100px] animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-[10%] left-[20%] w-[60%] h-[40%] rounded-full bg-pink-600/5 blur-[120px] animate-float" style={{ animationDelay: '4s' }} />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid z-0" />
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-24 relative z-10 flex-grow w-full">
        <Header />

        {/* Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mt-8">
          <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <ImageUpload 
              label="1. Person Photo" 
              imageState={personImage} 
              onChange={setPersonImage}
              placeholderText="Upload a clear photo of the person"
            />
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <ImageUpload 
              label="2. Clothing Item" 
              imageState={clothingImage} 
              onChange={setClothingImage}
              placeholderText="Upload the outfit to try on"
            />
          </div>
        </div>

        {/* Action Section */}
        <div className="mt-16 flex flex-col items-center justify-center gap-6 sticky bottom-10 z-50">
          <div className="p-2 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
             <div className="flex gap-4 items-center">
               <Button 
                onClick={handleCombine}
                disabled={!personImage.base64 || !clothingImage.base64 || status === ProcessingStatus.GENERATING}
                isLoading={status === ProcessingStatus.GENERATING}
                className="min-w-[240px] text-lg tracking-wide"
              >
                {status === ProcessingStatus.GENERATING ? 'Generating...' : 'Generate Try-On'}
              </Button>
              
              {(status === ProcessingStatus.SUCCESS || resultImage) && (
                 <Button variant="secondary" onClick={handleReset} className="text-sm px-6">
                   Reset
                 </Button>
              )}
            </div>
          </div>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-6 py-3 rounded-xl animate-bounce backdrop-blur-md shadow-[0_0_20px_rgba(239,68,68,0.2)]">
              <span className="font-bold mr-2">Error:</span> {error}
            </div>
          )}
        </div>

        {/* Result Section */}
        {resultImage && (
          <div ref={resultRef} className="mt-24 animate-fade-in-up scroll-mt-24">
             <div className="flex items-center gap-6 mb-10">
                <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent flex-1"></div>
                <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200 text-glow">
                  Result
                </h2>
                <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent flex-1"></div>
             </div>

            <div className="relative max-w-2xl mx-auto rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(79,70,229,0.15)] border border-slate-700/50 group bg-slate-900">
              <img 
                src={resultImage} 
                alt="Generated Try-On" 
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-10">
                 <Button onClick={downloadImage} variant="primary" icon={
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                   </svg>
                 }>
                   Download Image
                 </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="w-full py-8 text-center relative z-10 border-t border-slate-800/50 bg-slate-950/30 backdrop-blur-sm mt-auto">
         <p className="text-slate-500 text-sm">
           &copy; 2025 StyleFusion AI. All rights reserved.
         </p>
      </footer>
    </div>
  );
};

export default App;
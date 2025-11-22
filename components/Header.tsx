import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="w-full py-12 text-center relative z-10">
      <div className="inline-block mb-4 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-md">
        <span className="text-indigo-300 text-xs font-bold tracking-widest uppercase text-glow-sm">Powered by AI</span>
      </div>
      
      <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight text-glow">
        Style<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Fusion</span> AI
      </h1>
      
      <p className="text-slate-400 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
        Upload a photo and an outfit. Watch our AI fuse them seamlessly with 
        <span className="text-white font-medium ml-1">photorealistic lighting</span> and 
        <span className="text-white font-medium ml-1">physics</span>.
      </p>
    </header>
  );
};
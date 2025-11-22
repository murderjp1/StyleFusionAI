import React, { useRef, useState } from 'react';
import { ImageState } from '../types';

interface ImageUploadProps {
  label: string;
  imageState: ImageState;
  onChange: (newState: ImageState) => void;
  placeholderText?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ 
  label, 
  imageState, 
  onChange,
  placeholderText = "Click to upload or drag and drop"
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    processFile(file);
  };

  const processFile = (file: File | undefined) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onChange({
        file,
        preview: result,
        base64: result,
        mimeType: file.type
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange({ file: null, preview: null, base64: null, mimeType: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 text-indigo-400 font-bold text-sm">
          {label.split('.')[0]}
        </div>
        <label className="text-slate-200 font-semibold text-sm uppercase tracking-widest text-glow-sm">
          {label.split('. ')[1] || label}
        </label>
      </div>
      
      <div 
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative group cursor-pointer box-glow
          border-2 rounded-3xl h-[400px] w-full
          flex flex-col items-center justify-center
          transition-all duration-300 ease-out
          overflow-hidden backdrop-blur-sm
          ${isDragging 
            ? 'border-indigo-400 bg-slate-800/80 scale-[1.02] shadow-[0_0_30px_rgba(99,102,241,0.2)]' 
            : ''}
          ${imageState.preview 
            ? 'border-indigo-500/30 bg-slate-900/40' 
            : 'border-slate-700/50 hover:border-indigo-400/50 bg-slate-900/40 hover:bg-slate-800/60'
          }
        `}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {imageState.preview ? (
          <>
            <img 
              src={imageState.preview} 
              alt="Preview" 
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
               <button 
                onClick={handleRemove}
                className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 text-red-400 hover:text-red-300 px-6 py-3 rounded-xl font-semibold shadow-[0_0_15px_rgba(239,68,68,0.2)] transition-all transform translate-y-4 group-hover:translate-y-0"
              >
                Remove Image
              </button>
            </div>
          </>
        ) : (
          <div className="text-center p-8 flex flex-col items-center pointer-events-none">
             <div className={`w-20 h-20 mb-6 rounded-2xl bg-slate-800/50 border border-slate-700 flex items-center justify-center text-indigo-400 transition-all duration-300 ${isDragging ? 'scale-110 shadow-[0_0_20px_rgba(99,102,241,0.4)] border-indigo-500' : 'group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] group-hover:border-indigo-500/50'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
             </div>
            <p className="text-slate-200 font-bold text-lg mb-2">
              {isDragging ? "Drop it like it's hot" : "Upload Image"}
            </p>
            <p className="text-slate-500 text-sm max-w-[200px]">{placeholderText}</p>
          </div>
        )}
      </div>
    </div>
  );
};
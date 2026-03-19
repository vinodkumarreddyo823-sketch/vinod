import React, { useRef, useState } from 'react';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface UploaderProps {
  onDataLoaded: (data: number[], sampleRate: number) => void;
}

export const Uploader: React.FC<UploaderProps> = ({ onDataLoaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setError(null);
    if (!file.name.endsWith('.csv') && !file.name.endsWith('.json')) {
      setError('Please upload a CSV or JSON file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        let data: number[] = [];
        let sampleRate = 1000; // Default

        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(content);
          if (Array.isArray(parsed)) {
            data = parsed.map(Number);
          } else if (parsed.data && Array.isArray(parsed.data)) {
            data = parsed.data.map(Number);
            if (parsed.sampleRate) sampleRate = Number(parsed.sampleRate);
          }
        } else {
          // CSV
          data = content.split(/[,\n]/).map(v => v.trim()).filter(v => v !== '').map(Number);
        }

        if (data.length === 0 || data.some(isNaN)) {
          throw new Error('Invalid data format');
        }

        onDataLoaded(data, sampleRate);
      } catch (err) {
        setError('Failed to parse file. Ensure it contains a list of numbers.');
      }
    };
    reader.readAsText(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-xl p-12 transition-all cursor-pointer flex flex-col items-center justify-center gap-4",
          isDragging ? "border-[#00FF00] bg-[#00FF00]/5" : "border-[#333] hover:border-[#444] bg-[#141414]"
        )}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".csv,.json"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        <div className="w-16 h-16 rounded-full bg-[#222] flex items-center justify-center border border-[#333]">
          <Upload className="w-8 h-8 text-[#00FF00]" />
        </div>
        <div className="text-center">
          <p className="text-[#E4E3E0] font-mono text-sm uppercase italic">Upload Signal Data</p>
          <p className="text-[#666] text-xs mt-1">Drag and drop CSV or JSON files</p>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-500 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <div className="mt-6 flex justify-center gap-8">
        <button 
          onClick={() => onDataLoaded(Array.from({length: 1000}, (_, i) => Math.sin(i * 0.1) + Math.random() * 0.5), 1000)}
          className="text-[#666] hover:text-[#00FF00] font-mono text-[10px] uppercase tracking-widest transition-colors"
        >
          [ Use Sample Data ]
        </button>
      </div>
    </div>
  );
};

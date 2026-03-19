/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Uploader } from './components/Uploader';
import { SignalChart } from './components/SignalChart';
import { AnalysisResults } from './components/AnalysisResults';
import { analyzeSignal, SignalAnalysis } from './services/geminiService';
import { Activity, RefreshCw, Cpu, Database, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [signalData, setSignalData] = useState<number[] | null>(null);
  const [sampleRate, setSampleRate] = useState<number>(1000);
  const [analysis, setAnalysis] = useState<SignalAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDataLoaded = async (data: number[], rate: number) => {
    setSignalData(data);
    setSampleRate(rate);
    setAnalysis(null);
    setError(null);
    
    setIsAnalyzing(true);
    try {
      const result = await analyzeSignal(data, rate);
      setAnalysis(result);
    } catch (err) {
      setError('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setSignalData(null);
    setAnalysis(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E4E3E0] font-sans selection:bg-[#00FF00]/30">
      {/* Header */}
      <header className="border-b border-[#1A1A1A] bg-[#0A0A0A]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#00FF00] flex items-center justify-center">
              <Activity className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className="text-sm font-mono font-bold tracking-tighter uppercase">SignalAI</h1>
              <p className="text-[10px] text-[#666] font-mono uppercase tracking-widest">v1.0.4 // Technical Analysis</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Cpu className="w-3 h-3 text-[#666]" />
              <span className="text-[10px] font-mono text-[#666] uppercase tracking-widest">Gemini Engine</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="w-3 h-3 text-[#666]" />
              <span className="text-[10px] font-mono text-[#666] uppercase tracking-widest">Real-time DSP</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {!signalData ? (
            <motion.div
              key="uploader"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center min-h-[60vh]"
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl font-mono font-bold tracking-tighter uppercase mb-4 italic">
                  Analyze Your Signals
                </h2>
                <p className="text-[#666] max-w-lg mx-auto text-sm leading-relaxed">
                  Upload raw time-series data in CSV or JSON format. Our AI engine will analyze frequency components, noise levels, and hidden patterns.
                </p>
              </div>
              <Uploader onDataLoaded={handleDataLoaded} />
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {/* Dashboard Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#1A1A1A]">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[#666] text-[10px] font-mono uppercase tracking-widest">
                    <button onClick={reset} className="hover:text-[#00FF00] transition-colors">Dashboard</button>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-[#00FF00]">Signal Analysis</span>
                  </div>
                  <h2 className="text-2xl font-mono font-bold uppercase italic">Active Analysis Session</h2>
                </div>
                
                <div className="flex items-center gap-4">
                  <button 
                    onClick={reset}
                    className="px-4 py-2 bg-[#141414] border border-[#333] text-[#E4E3E0] font-mono text-[10px] uppercase tracking-widest hover:bg-[#222] transition-all"
                  >
                    [ New Analysis ]
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="grid grid-cols-1 gap-8">
                <SignalChart data={signalData} sampleRate={sampleRate} />
                
                <div className="relative">
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-[#0A0A0A]/50 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-lg border border-[#333]">
                      <RefreshCw className="w-8 h-8 text-[#00FF00] animate-spin mb-4" />
                      <p className="text-[#00FF00] font-mono text-xs uppercase tracking-widest animate-pulse">
                        AI Processing Signal Data...
                      </p>
                    </div>
                  )}
                  
                  {error && (
                    <div className="p-8 bg-red-500/5 border border-red-500/20 rounded-lg text-center">
                      <p className="text-red-500 font-mono text-sm uppercase mb-4">{error}</p>
                      <button 
                        onClick={() => handleDataLoaded(signalData, sampleRate)}
                        className="text-[#E4E3E0] font-mono text-[10px] uppercase underline underline-offset-4 hover:text-[#00FF00]"
                      >
                        Retry Analysis
                      </button>
                    </div>
                  )}

                  {analysis && <AnalysisResults analysis={analysis} />}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t border-[#1A1A1A] py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00FF00] animate-pulse" />
            <span className="text-[10px] font-mono text-[#666] uppercase tracking-widest">System Operational</span>
          </div>
          <p className="text-[10px] font-mono text-[#444] uppercase tracking-widest">
            © 2026 SignalAI Systems // Neural Signal Processing Unit
          </p>
        </div>
      </footer>
    </div>
  );
}

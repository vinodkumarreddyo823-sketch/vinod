import React from 'react';
import { SignalAnalysis } from '../services/geminiService';
import { Activity, Zap, AlertCircle, Info, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface AnalysisResultsProps {
  analysis: SignalAnalysis;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ analysis }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#141414] border border-[#333] p-6 rounded-lg"
      >
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-[#00FF00]" />
          <h3 className="text-[#E4E3E0] font-mono text-sm uppercase italic">Signal Summary</h3>
        </div>
        <p className="text-[#AAA] text-sm leading-relaxed font-sans">
          {analysis.summary}
        </p>
        
        <div className="mt-6 flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-[#666] font-mono text-[10px] uppercase">Noise Level</span>
            <span className={`text-sm font-mono uppercase ${
              analysis.noiseLevel === 'Low' ? 'text-[#00FF00]' : 
              analysis.noiseLevel === 'Medium' ? 'text-yellow-500' : 'text-red-500'
            }`}>
              {analysis.noiseLevel}
            </span>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[#141414] border border-[#333] p-6 rounded-lg"
      >
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-[#00FF00]" />
          <h3 className="text-[#E4E3E0] font-mono text-sm uppercase italic">Frequencies & Patterns</h3>
        </div>
        <div className="space-y-4">
          <div>
            <span className="text-[#666] font-mono text-[10px] uppercase block mb-2">Dominant Frequencies</span>
            <div className="flex flex-wrap gap-2">
              {analysis.dominantFrequencies.map((freq, i) => (
                <span key={i} className="bg-[#222] text-[#E4E3E0] px-2 py-1 text-[10px] font-mono border border-[#333]">
                  {freq}
                </span>
              ))}
            </div>
          </div>
          <div>
            <span className="text-[#666] font-mono text-[10px] uppercase block mb-2">Detected Patterns</span>
            <div className="flex flex-wrap gap-2">
              {analysis.patterns.map((pattern, i) => (
                <span key={i} className="bg-[#222] text-[#E4E3E0] px-2 py-1 text-[10px] font-mono border border-[#333]">
                  {pattern}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="md:col-span-2 bg-[#141414] border border-[#333] p-6 rounded-lg"
      >
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-4 h-4 text-[#00FF00]" />
          <h3 className="text-[#E4E3E0] font-mono text-sm uppercase italic">Recommendations</h3>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysis.recommendations.map((rec, i) => (
            <li key={i} className="flex items-start gap-3 text-[#AAA] text-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00FF00] mt-1.5 shrink-0" />
              {rec}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};

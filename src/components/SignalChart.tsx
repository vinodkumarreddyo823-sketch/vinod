import React, { useState } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { computeFFT } from '../lib/dspUtils';

interface SignalChartProps {
  data: number[];
  sampleRate: number;
}

export const SignalChart: React.FC<SignalChartProps> = ({ data, sampleRate }) => {
  const [view, setView] = useState<'time' | 'frequency'>('time');
  
  const timeData = data.slice(0, 1000).map((value, index) => ({
    time: (index / sampleRate).toFixed(4),
    value,
  }));

  const spectrum = computeFFT(data.slice(0, 1024));
  const freqData = spectrum.map((magnitude, index) => ({
    frequency: Math.round((index * sampleRate) / 1024),
    magnitude,
  }));

  return (
    <div className="w-full bg-[#141414] border border-[#333] p-6 rounded-lg">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-[#E4E3E0] font-mono text-sm uppercase tracking-wider italic">
            Signal Visualization
          </h3>
          <p className="text-[#666] text-[10px] uppercase font-mono mt-1">
            {view === 'time' ? 'Time Domain Analysis' : 'Frequency Domain (FFT)'}
          </p>
        </div>
        
        <div className="flex bg-[#0A0A0A] p-1 border border-[#333] rounded">
          <button 
            onClick={() => setView('time')}
            className={`px-3 py-1 font-mono text-[10px] uppercase transition-all ${
              view === 'time' ? 'bg-[#00FF00] text-black' : 'text-[#666] hover:text-[#E4E3E0]'
            }`}
          >
            Time
          </button>
          <button 
            onClick={() => setView('frequency')}
            className={`px-3 py-1 font-mono text-[10px] uppercase transition-all ${
              view === 'frequency' ? 'bg-[#00FF00] text-black' : 'text-[#666] hover:text-[#E4E3E0]'
            }`}
          >
            Frequency
          </button>
        </div>
      </div>

      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {view === 'time' ? (
            <LineChart data={timeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
              <XAxis 
                dataKey="time" 
                stroke="#444" 
                fontSize={10} 
                tickFormatter={(val) => `${val}s`}
                label={{ value: 'Time (s)', position: 'insideBottom', offset: -5, fill: '#444', fontSize: 10 }}
              />
              <YAxis 
                stroke="#444" 
                fontSize={10}
                label={{ value: 'Amplitude', angle: -90, position: 'insideLeft', fill: '#444', fontSize: 10 }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#141414', border: '1px solid #333', color: '#E4E3E0', fontSize: '10px' }}
                itemStyle={{ color: '#00FF00' }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#00FF00" 
                strokeWidth={1.5} 
                dot={false} 
                isAnimationActive={false}
              />
            </LineChart>
          ) : (
            <AreaChart data={freqData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
              <XAxis 
                dataKey="frequency" 
                stroke="#444" 
                fontSize={10} 
                tickFormatter={(val) => `${val}Hz`}
                label={{ value: 'Frequency (Hz)', position: 'insideBottom', offset: -5, fill: '#444', fontSize: 10 }}
              />
              <YAxis 
                stroke="#444" 
                fontSize={10}
                label={{ value: 'Magnitude', angle: -90, position: 'insideLeft', fill: '#444', fontSize: 10 }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#141414', border: '1px solid #333', color: '#E4E3E0', fontSize: '10px' }}
                itemStyle={{ color: '#00FF00' }}
              />
              <Area 
                type="monotone" 
                dataKey="magnitude" 
                stroke="#00FF00" 
                fill="#00FF00" 
                fillOpacity={0.1}
                isAnimationActive={false}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 flex justify-between items-center text-[10px] font-mono text-[#444] uppercase tracking-widest">
        <span>Sampling: {sampleRate} Hz</span>
        <span>Window: 1024 Samples</span>
      </div>
    </div>
  );
};

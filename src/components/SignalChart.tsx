import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface SignalChartProps {
  data: number[];
  sampleRate: number;
}

export const SignalChart: React.FC<SignalChartProps> = ({ data, sampleRate }) => {
  const chartData = data.slice(0, 1000).map((value, index) => ({
    time: (index / sampleRate).toFixed(4),
    value,
  }));

  return (
    <div className="w-full h-[400px] bg-[#141414] border border-[#333] p-4 rounded-lg">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-[#E4E3E0] font-mono text-sm uppercase tracking-wider italic">
          Signal Waveform (First 1000 samples)
        </h3>
        <span className="text-[#888] font-mono text-xs uppercase">
          Sample Rate: {sampleRate} Hz
        </span>
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
          <XAxis 
            dataKey="time" 
            stroke="#666" 
            fontSize={10} 
            tickFormatter={(val) => `${val}s`}
            label={{ value: 'Time (s)', position: 'insideBottom', offset: -5, fill: '#666', fontSize: 10 }}
          />
          <YAxis 
            stroke="#666" 
            fontSize={10}
            label={{ value: 'Amplitude', angle: -90, position: 'insideLeft', fill: '#666', fontSize: 10 }}
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
      </ResponsiveContainer>
    </div>
  );
};

import React from 'react';
import { Target } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';

export default function WagonWheel() {
  const { match } = useCricket();

  const shots = match.wagon_wheel || [];

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Target className="w-5 h-5 text-[#00D26A]" />
          <h3 className="font-heading font-extrabold text-white text-lg">Interactive Wagon Wheel</h3>
        </div>
        <span className="text-xs text-slate-400 font-medium">{shots.length} Shot Plots</span>
      </div>

      <div className="relative flex flex-col items-center justify-center p-4">
        {/* SVG Cricket Pitch & Field Canvas */}
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full bg-emerald-950/60 border-4 border-emerald-600/40 shadow-2xl flex items-center justify-center overflow-hidden">
          
          {/* Pitch Overlay */}
          <div className="w-12 h-36 bg-amber-200/20 border border-amber-300/40 rounded-sm"></div>

          {/* Field Labels */}
          <span className="absolute top-3 text-[10px] font-extrabold text-emerald-300 uppercase tracking-widest">LONG ON</span>
          <span className="absolute bottom-3 text-[10px] font-extrabold text-emerald-300 uppercase tracking-widest">FINE LEG</span>
          <span className="absolute right-3 text-[10px] font-extrabold text-emerald-300 uppercase tracking-widest">COVER</span>
          <span className="absolute left-3 text-[10px] font-extrabold text-emerald-300 uppercase tracking-widest">POINT</span>

          {/* SVG Shot Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 300 300">
            {shots.map((s, idx) => (
              <g key={idx}>
                <line
                  x1="150"
                  y1="150"
                  x2={s.x}
                  y2={s.y}
                  stroke={s.runs === 6 ? '#00D26A' : s.runs === 4 ? '#FBBF24' : '#94A3B8'}
                  strokeWidth={s.runs >= 4 ? "3" : "1.5"}
                  strokeDasharray={s.runs === 6 ? "4" : "0"}
                />
                <circle
                  cx={s.x}
                  cy={s.y}
                  r={s.runs >= 4 ? "5" : "3"}
                  fill={s.runs === 6 ? '#00D26A' : s.runs === 4 ? '#FBBF24' : '#94A3B8'}
                />
              </g>
            ))}
          </svg>

        </div>

        {/* Legend */}
        <div className="flex items-center justify-center space-x-6 text-xs font-semibold pt-4">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-[#00D26A]"></span>
            <span className="text-white">6 Runs</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-400"></span>
            <span className="text-white">4 Runs</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-400"></span>
            <span className="text-slate-400">1-3 Runs</span>
          </div>
        </div>

      </div>
    </div>
  );
}

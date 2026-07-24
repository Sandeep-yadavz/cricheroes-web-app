import React from 'react';
import { MessageSquare, Flame } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';

export default function Commentary() {
  const { match } = useCricket();

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-[#00D26A]" />
          <h3 className="font-heading font-extrabold text-white text-lg">Ball-by-Ball Live Commentary</h3>
        </div>
        <span className="text-xs font-semibold text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
          Auto Update Active
        </span>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
        {match.ball_history.map((b, idx) => (
          <div
            key={idx}
            className={`p-3.5 rounded-xl border transition-all ${
              b.type === 'SIX'
                ? 'bg-[#00D26A]/10 border-[#00D26A]/40'
                : b.type === 'FOUR'
                ? 'bg-amber-400/10 border-amber-400/40'
                : b.type === 'WICKET'
                ? 'bg-red-500/10 border-red-500/40'
                : 'bg-slate-900/60 border-slate-800/80'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-black text-slate-400">OVER {b.ball}</span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                  b.type === 'SIX'
                    ? 'bg-[#00D26A] text-black'
                    : b.type === 'FOUR'
                    ? 'bg-amber-400 text-black'
                    : b.type === 'WICKET'
                    ? 'bg-red-500 text-white'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {b.type}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-200 leading-relaxed">{b.commentary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

import React from 'react';
import { Compass } from 'lucide-react';

const ZONES = [
  { id: 'Cover', label: 'Cover', angle: -20 },
  { id: 'Point', label: 'Point', angle: 30 },
  { id: 'Third Man', label: 'Third Man', angle: 90 },
  { id: 'Fine Leg', label: 'Fine Leg', angle: 140 },
  { id: 'Square Leg', label: 'Square Leg', angle: 175 },
  { id: 'Mid Wicket', label: 'Mid Wicket', angle: -130 },
  { id: 'Mid On', label: 'Mid On', angle: -90 },
  { id: 'Mid Off', label: 'Mid Off', angle: -60 }
];

export default function MiniWagonWheelSelector({ selectedZone, onSelectZone }) {
  return (
    <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-[#00D26A]" /> Shot Direction: <strong className="text-[#00D26A] ml-1">{selectedZone}</strong>
        </span>
        <span className="text-[10px] text-slate-400 font-semibold">Tap to set shot location</span>
      </div>

      <div className="grid grid-cols-4 gap-1.5">
        {ZONES.map((z) => (
          <button
            key={z.id}
            type="button"
            onClick={() => onSelectZone(z.id)}
            className={`py-1.5 px-2 rounded-xl text-[11px] font-extrabold transition border ${
              selectedZone === z.id
                ? 'bg-[#00D26A] text-black border-[#00FF95] shadow-md shadow-[#00D26A]/20 scale-105'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
            }`}
          >
            {z.label}
          </button>
        ))}
      </div>
    </div>
  );
}

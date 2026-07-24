import React from 'react';
import { MessageSquare, Flame, Volume2, VolumeX } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';

export default function Commentary() {
  const { match, soundEnabled, setSoundEnabled } = useCricket();

  const balls = match?.ball_history || [
    {
      id: "b1",
      over: "14.3",
      runs: 4,
      extra_type: null,
      is_wicket: false,
      striker_name: "Rohit Varma",
      bowler_name: "Rashid Khan",
      shot_zone: "Cover",
      description: "14.3 Rashid Khan to Rohit Varma, FOUR RUNS! Beautifully driven along the ground to Cover!"
    },
    {
      id: "b2",
      over: "14.2",
      runs: 1,
      extra_type: "noball",
      is_wicket: false,
      striker_name: "Rohit Varma",
      bowler_name: "Rashid Khan",
      shot_zone: "Mid Off",
      description: "14.2 Rashid Khan to Rohit Varma, NO BALL + 1 RUN! Smashed firmly towards Mid Off! Free Hit coming up!"
    },
    {
      id: "b3",
      over: "14.1",
      runs: 6,
      extra_type: null,
      is_wicket: false,
      striker_name: "Rohit Varma",
      bowler_name: "Rashid Khan",
      shot_zone: "Mid Wicket",
      description: "14.1 Rashid Khan to Rohit Varma, SIX RUNS! Massive hit high into the stands at Mid Wicket!"
    }
  ];

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4 shadow-xl">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-[#00D26A]" />
          <h3 className="font-heading font-extrabold text-white text-lg">Ball-by-Ball Live Commentary</h3>
        </div>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition"
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#00D26A]" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
          <span>{soundEnabled ? "Audio On" : "Audio Mute"}</span>
        </button>
      </div>

      {/* Live Commentary Feed */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
        {balls.map((b, idx) => {
          const isFour = b.runs === 4 && !b.extra_type;
          const isSix = b.runs === 6 && !b.extra_type;
          const isWicket = b.is_wicket;
          const isExtra = !!b.extra_type;

          const overLabel = b.over || b.ball || "0.0";
          const descText = b.description || b.commentary || `${overLabel} ${b.bowler_name || 'Bowler'} to ${b.striker_name || 'Batter'}, ${b.runs || 0} run(s).`;
          
          let badgeText = `${b.runs || 0} RUNS`;
          if (isWicket) badgeText = "WICKET";
          else if (isSix) badgeText = "SIX 🚀";
          else if (isFour) badgeText = "FOUR 💥";
          else if (b.extra_type === 'noball') badgeText = `NB+${Math.max(0, (b.runs || 1) - 1)}`;
          else if (b.extra_type === 'wide') badgeText = `WD+${Math.max(0, (b.runs || 1) - 1)}`;
          else if (b.extra_type === 'bye') badgeText = `BYE+${b.runs || 1}`;
          else if (b.extra_type === 'legbye') badgeText = `LB+${b.runs || 1}`;

          return (
            <div
              key={b.id || idx}
              className={`p-3.5 rounded-2xl border transition-all ${
                isWicket
                  ? 'bg-red-500/10 border-red-500/40 shadow-sm shadow-red-500/10'
                  : isSix
                  ? 'bg-amber-400/10 border-amber-400/40 shadow-sm shadow-amber-400/10'
                  : isFour
                  ? 'bg-[#00D26A]/10 border-[#00D26A]/40 shadow-sm shadow-[#00D26A]/10'
                  : isExtra
                  ? 'bg-orange-500/10 border-orange-500/40'
                  : 'bg-slate-900/70 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-black text-slate-300 font-heading">
                  OVER {overLabel}
                </span>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                    isWicket
                      ? 'bg-red-600 text-white'
                      : isSix
                      ? 'bg-amber-400 text-black'
                      : isFour
                      ? 'bg-[#00D26A] text-black'
                      : isExtra
                      ? 'bg-orange-500 text-black'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  {badgeText}
                </span>
              </div>

              <p className="text-sm font-medium text-slate-200 leading-relaxed">
                {descText}
              </p>
            </div>
          );
        })}
      </div>

    </div>
  );
}

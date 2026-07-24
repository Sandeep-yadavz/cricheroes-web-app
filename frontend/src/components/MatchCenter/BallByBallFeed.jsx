import React from 'react';
import { Volume2, VolumeX, Sparkles, Flame, ShieldAlert } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';

export default function BallByBallFeed() {
  const { match, soundEnabled, setSoundEnabled } = useCricket();

  const balls = match.ball_history || [
    {
      id: "b1",
      over: "14.3",
      runs: 4,
      extra_type: null,
      is_wicket: false,
      striker_name: "Rohit Varma",
      bowler_name: "Rashid Khan",
      shot_zone: "Cover",
      description: "14.3 Rashid Khan to Rohit Varma, FOUR RUNS! Smashed gracefully through cover for a boundary!"
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
      description: "14.2 Rashid Khan to Rohit Varma, NO BALL + 1 RUN! Overstepped the crease, Free Hit coming up!"
    }
  ];

  return (
    <div className="glass-card rounded-3xl p-5 border border-slate-800 space-y-4 shadow-2xl">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#00D26A] to-[#00FF95] text-black flex items-center justify-center font-bold">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-white text-base">Live Ball-by-Ball Commentary</h3>
            <p className="text-[11px] text-slate-400">Real-Time Commentary &amp; Extras Feed</p>
          </div>
        </div>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
          title={soundEnabled ? "Mute Voice Commentary" : "Enable Voice Commentary"}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-[#00D26A]" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
        </button>
      </div>

      {/* Commentary Feed List */}
      <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
        {balls.map((b) => {
          const isFour = b.runs === 4 && !b.extra_type;
          const isSix = b.runs === 6 && !b.extra_type;
          const isNoBall = b.extra_type === 'noball';

          return (
            <div
              key={b.id}
              className={`p-3.5 rounded-2xl border transition flex items-start space-x-3 ${
                b.is_wicket
                  ? 'bg-red-500/10 border-red-500/30'
                  : isSix
                  ? 'bg-amber-400/10 border-amber-400/30'
                  : isFour
                  ? 'bg-[#00D26A]/10 border-[#00D26A]/30'
                  : isNoBall
                  ? 'bg-orange-500/10 border-orange-500/30'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              {/* Over Badge */}
              <div className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 font-heading font-black text-xs text-white shrink-0">
                {b.over}
              </div>

              {/* Commentary Content */}
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">
                    {b.bowler_name || "Bowler"} to {b.striker_name || "Batter"}
                  </span>

                  {/* Run Badge */}
                  <span className={`text-xs font-heading font-black px-2 py-0.5 rounded-md ${
                    b.is_wicket
                      ? 'bg-red-500 text-white'
                      : isSix
                      ? 'bg-amber-400 text-black'
                      : isFour
                      ? 'bg-[#00D26A] text-black'
                      : isNoBall
                      ? 'bg-orange-500 text-black'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {b.is_wicket ? 'WICKET' : isNoBall ? `NB+${Math.max(0, b.runs - 1)}` : `${b.runs} RUNS`}
                  </span>
                </div>

                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  {b.description || `${b.over} ${b.bowler_name} to ${b.striker_name}, ${b.runs} runs.`}
                </p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}

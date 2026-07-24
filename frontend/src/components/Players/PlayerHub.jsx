import React, { useState } from 'react';
import { Users, Award, Star, Zap, Shield, X, Activity } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';

export default function PlayerHub() {
  const { players, teams } = useCricket();
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const playerList = Object.values(players);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-heading font-black text-white">Player Directory &amp; Career Cards</h2>
            <p className="text-xs text-slate-400">Official CricHeroes Player Pass &amp; Achievements</p>
          </div>
        </div>
        <span className="text-xs font-bold text-[#00D26A] bg-[#00D26A]/10 px-3 py-1.5 rounded-full border border-[#00D26A]/30">
          {playerList.length} Verified Players
        </span>
      </div>

      {/* Players Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {playerList.map((p) => {
          const team = teams[p.team_id] || { short_name: "MUM", logo: "🔥" };
          return (
            <div
              key={p.id}
              onClick={() => setSelectedPlayer(p)}
              className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-[#00D26A]/50 transition-all cursor-pointer group space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="relative">
                  <img
                    src={p.avatar}
                    alt={p.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-700 group-hover:border-[#00D26A] transition"
                  />
                  <span className="absolute -bottom-1 -right-1 text-sm bg-slate-900 rounded-lg p-0.5 border border-slate-800">
                    {team.logo}
                  </span>
                </div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-1 rounded-md bg-slate-900 text-slate-300 border border-slate-800">
                  {p.role}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white group-hover:text-[#00D26A] transition">{p.name}</h3>
                <p className="text-xs text-slate-400 font-medium">{team.short_name} • {p.batting_style || "Right Hand"}</p>
              </div>

              {/* Quick Stat Highlights */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-center">
                <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800/60">
                  <span className="text-xs text-slate-400 font-semibold block">RUNS</span>
                  <span className="text-sm font-extrabold text-white">{p.runs}</span>
                </div>
                <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800/60">
                  <span className="text-xs text-slate-400 font-semibold block">WICKETS</span>
                  <span className="text-sm font-extrabold text-[#00D26A]">{p.wickets}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Player Detailed Career Modal */}
      {selectedPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-[#121824] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-4">
                <img
                  src={selectedPlayer.avatar}
                  alt={selectedPlayer.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-[#00D26A]"
                />
                <div>
                  <h3 className="text-xl font-heading font-black text-white">{selectedPlayer.name}</h3>
                  <p className="text-xs text-[#00D26A] font-bold uppercase">{selectedPlayer.role}</p>
                  <p className="text-xs text-slate-400">Batting: {selectedPlayer.batting_style || "Right Hand"}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPlayer(null)}
                className="p-1 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Comprehensive Statistics Grid */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 block uppercase">Matches</span>
                <span className="text-lg font-heading font-black text-white">{selectedPlayer.matches || 24}</span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 block uppercase">Runs</span>
                <span className="text-lg font-heading font-black text-orange-400">{selectedPlayer.runs}</span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 block uppercase">High Score</span>
                <span className="text-lg font-heading font-black text-amber-400">{selectedPlayer.highest_score}</span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 block uppercase">Bat Avg</span>
                <span className="text-lg font-heading font-black text-white">{selectedPlayer.avg || 42.1}</span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 block uppercase">Strike Rate</span>
                <span className="text-lg font-heading font-black text-[#00D26A]">{selectedPlayer.sr || 145.2}</span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 block uppercase">Wickets</span>
                <span className="text-lg font-heading font-black text-purple-400">{selectedPlayer.wickets}</span>
              </div>
            </div>

            {/* Earned Career Badges */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Career Badges &amp; Honors</span>
              <div className="flex flex-wrap gap-2">
                {(selectedPlayer.badges || ["Century Maker", "Power Hitter"]).map((badge) => (
                  <span
                    key={badge}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-amber-400/10 text-amber-300 border border-amber-400/30"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>{badge}</span>
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

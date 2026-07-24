import React from 'react';
import { Sparkles, Trophy, Award, Zap, Shield } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';

export default function FantasyHub() {
  const { players, match, teams } = useCricket();

  const playerList = Object.values(players);

  // Fantasy Points Calculation Formula:
  // Runs: 1 pt/run, 4s: +1 bonus, 6s: +2 bonus, 50s: +8 bonus, 100s: +16 bonus
  // Wickets: 25 pts/wicket, 3-wkt: +8 bonus, 5-wkt: +16 bonus
  const fantasyLeaderboard = playerList.map((p) => {
    let pts = (p.runs * 1) + (p.wickets * 25);
    if (p.runs >= 50) pts += 8;
    if (p.runs >= 100) pts += 16;
    if (p.wickets >= 3) pts += 8;
    if (p.wickets >= 5) pts += 16;
    return { ...p, fantasy_points: pts };
  }).sort((a, b) => b.fantasy_points - a.fantasy_points);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
            <Sparkles className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-extrabold uppercase text-purple-400 tracking-wider">CricHeroes Dream XI</span>
            <h2 className="text-2xl font-heading font-black text-white">Fantasy Points Leaderboard</h2>
            <p className="text-xs text-slate-400">Live Dream11 style player scoring breakdown</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800 text-xs font-semibold text-slate-300">
          <span>Formula: 1 pt/Run • 25 pts/Wkt • +8 Bonus 50/3-Wkt</span>
        </div>
      </div>

      {/* Top 3 Fantasy Dream XI Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {fantasyLeaderboard.slice(0, 3).map((p, idx) => {
          const team = teams[p.team_id] || { short_name: "MUM", logo: "🔥" };
          const borderColors = ['border-amber-400', 'border-slate-300', 'border-amber-600'];
          const medalBadges = ['🥇 1st Place', '🥈 2nd Place', '🥉 3rd Place'];

          return (
            <div key={p.id} className={`glass-card rounded-2xl p-5 border-2 ${borderColors[idx]} space-y-4 text-center relative overflow-hidden`}>
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-900 text-amber-300 border border-slate-800">
                {medalBadges[idx]}
              </span>

              <img src={p.avatar} alt={p.name} className="w-20 h-20 mx-auto rounded-full object-cover border-2 border-slate-700 shadow-xl" />

              <div>
                <h3 className="text-lg font-heading font-black text-white">{p.name}</h3>
                <p className="text-xs text-slate-400 font-semibold">{team.logo} {team.short_name} • {p.role}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">FANTASY POINTS</span>
                <span className="text-2xl font-heading font-black text-purple-400">{p.fantasy_points} PTS</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Fantasy Leaderboard Table */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-heading font-extrabold text-white text-lg flex items-center gap-2">
            <Trophy className="w-5 h-5 text-purple-400" />
            Complete Player Fantasy Rankings
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">#</th>
                <th className="py-3 px-3">Player</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3 text-right">Runs (Pts)</th>
                <th className="py-3 px-3 text-right">Wickets (Pts)</th>
                <th className="py-3 px-3 text-right">Total Fantasy PTS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-semibold">
              {fantasyLeaderboard.map((p, idx) => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-3 font-bold text-slate-500">{idx + 1}</td>
                  <td className="py-3.5 px-3 font-bold text-white flex items-center space-x-2.5">
                    <img src={p.avatar} alt={p.name} className="w-7 h-7 rounded-full object-cover" />
                    <span>{p.name}</span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-400">{p.role}</td>
                  <td className="py-3.5 px-3 text-right text-orange-400 font-bold">{p.runs} ({p.runs} pts)</td>
                  <td className="py-3.5 px-3 text-right text-purple-400 font-bold">{p.wickets} ({p.wickets * 25} pts)</td>
                  <td className="py-3.5 px-3 text-right font-black text-[#00D26A] text-sm">{p.fantasy_points} PTS</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

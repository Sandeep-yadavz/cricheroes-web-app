import React, { useState } from 'react';
import { Trophy, Award, ShieldCheck, PlusCircle, Layers } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';
import TournamentBracket from './TournamentBracket';
import CreateTeamModal from './CreateTeamModal';

export default function TournamentCenter() {
  const { players, teams } = useCricket();
  const [activeTab, setActiveTab] = useState('points'); // 'points', 'bracket', 'leaderboard'
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);

  const standings = [
    { team_id: "t1", name: "Mumbai Strikers", logo: "🔥", p: 3, w: 2, l: 1, t: 0, pts: 4, nrr: "+0.852" },
    { team_id: "t2", name: "Delhi Dynamites", logo: "⚡", p: 3, w: 2, l: 1, t: 0, pts: 4, nrr: "+0.448" },
    { team_id: "t3", name: "Bangalore Blasters", logo: "💥", p: 3, w: 1, l: 2, t: 0, pts: 2, nrr: "-0.957" },
    { team_id: "t4", name: "Chennai Super Kings", logo: "🦁", p: 3, w: 1, l: 2, t: 0, pts: 2, nrr: "-0.311" }
  ];

  const playerList = Object.values(players);
  const orangeCap = [...playerList].sort((a, b) => b.runs - a.runs).slice(0, 5);
  const purpleCap = [...playerList].sort((a, b) => b.wickets - a.wickets).slice(0, 5);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      
      {/* Tournament Header */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Trophy className="w-8 h-8 text-black" />
          </div>
          <div>
            <span className="text-xs font-extrabold uppercase text-amber-400 tracking-wider">Official Tournament</span>
            <h2 className="text-2xl font-heading font-black text-white">Grassroots Champions Trophy 2026</h2>
            <p className="text-xs text-slate-400 font-medium">T20 Format • Leather Ball • Central Cricket Ground, Mumbai</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsCreateTeamOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition border border-slate-700"
          >
            <PlusCircle className="w-4 h-4 text-[#00D26A]" />
            <span>Add Custom Team</span>
          </button>
        </div>
      </div>

      {/* View Switcher Sub-Tabs */}
      <div className="flex items-center space-x-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto">
        <button
          onClick={() => setActiveTab('points')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
            activeTab === 'points'
              ? 'bg-[#00D26A] text-black shadow-md shadow-[#00D26A]/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Points Table (NRR)</span>
        </button>

        <button
          onClick={() => setActiveTab('bracket')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
            activeTab === 'bracket'
              ? 'bg-[#00D26A] text-black shadow-md shadow-[#00D26A]/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Knockout Playoff Brackets</span>
        </button>

        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
            activeTab === 'leaderboard'
              ? 'bg-[#00D26A] text-black shadow-md shadow-[#00D26A]/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Orange &amp; Purple Caps</span>
        </button>
      </div>

      {/* Render Active View */}
      {activeTab === 'points' && (
        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-heading font-extrabold text-white text-lg flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#00D26A]" />
              Tournament Standings
            </h3>
            <span className="text-xs font-semibold text-slate-400">Net Run Rate (NRR) Enabled</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3">#</th>
                  <th className="py-3 px-3">Team</th>
                  <th className="py-3 px-3 text-center">P</th>
                  <th className="py-3 px-3 text-center">W</th>
                  <th className="py-3 px-3 text-center">L</th>
                  <th className="py-3 px-3 text-center">T</th>
                  <th className="py-3 px-3 text-center">Pts</th>
                  <th className="py-3 px-3 text-right">NRR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-semibold">
                {standings.map((t, idx) => (
                  <tr key={t.team_id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-3 font-bold text-slate-400">{idx + 1}</td>
                    <td className="py-3.5 px-3 font-bold text-white flex items-center space-x-2.5">
                      <span className="text-lg">{t.logo}</span>
                      <span>{t.name}</span>
                    </td>
                    <td className="py-3.5 px-3 text-center text-slate-300">{t.p}</td>
                    <td className="py-3.5 px-3 text-center text-[#00D26A] font-extrabold">{t.w}</td>
                    <td className="py-3.5 px-3 text-center text-red-400">{t.l}</td>
                    <td className="py-3.5 px-3 text-center text-slate-400">{t.t}</td>
                    <td className="py-3.5 px-3 text-center font-extrabold text-amber-400 text-sm">{t.pts}</td>
                    <td className={`py-3.5 px-3 text-right font-extrabold ${t.nrr.startsWith('+') ? 'text-[#00D26A]' : 'text-red-400'}`}>
                      {t.nrr}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'bracket' && <TournamentBracket />}

      {activeTab === 'leaderboard' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
            <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
                🧢
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-white text-lg">Orange Cap Leaderboard</h3>
                <p className="text-xs text-slate-400">Most runs scored in tournament</p>
              </div>
            </div>

            <div className="space-y-3">
              {orangeCap.map((p, idx) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="flex items-center space-x-3">
                    <span className="font-extrabold text-slate-500 w-4 text-center">{idx + 1}</span>
                    <img src={p.avatar} alt={p.name} className="w-9 h-9 rounded-full object-cover border border-slate-700" />
                    <div>
                      <h4 className="text-sm font-bold text-white">{p.name}</h4>
                      <p className="text-[11px] text-slate-400">SR: {p.sr} • Avg: {p.avg}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-heading font-black text-orange-400">{p.runs}</span>
                    <span className="text-[10px] text-slate-400 block font-semibold">RUNS</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
            <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                🟣
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-white text-lg">Purple Cap Leaderboard</h3>
                <p className="text-xs text-slate-400">Most wickets taken in tournament</p>
              </div>
            </div>

            <div className="space-y-3">
              {purpleCap.map((p, idx) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="flex items-center space-x-3">
                    <span className="font-extrabold text-slate-500 w-4 text-center">{idx + 1}</span>
                    <img src={p.avatar} alt={p.name} className="w-9 h-9 rounded-full object-cover border border-slate-700" />
                    <div>
                      <h4 className="text-sm font-bold text-white">{p.name}</h4>
                      <p className="text-[11px] text-slate-400">Best: {p.highest_score > 50 ? '3/24' : '5/12'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-heading font-black text-purple-400">{p.wickets}</span>
                    <span className="text-[10px] text-slate-400 block font-semibold">WKTS</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <CreateTeamModal isOpen={isCreateTeamOpen} onClose={() => setIsCreateTeamOpen(false)} />
    </div>
  );
}

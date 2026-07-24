import React, { useState } from 'react';
import { User, Flame, Compass, ChevronDown, ChevronUp } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';
import DraggableFieldingWagonWheel from '../Scorer/DraggableFieldingWagonWheel';
import TeamLogo from '../Common/TeamLogo';

export default function LiveScorecard() {
  const { match, teams } = useCricket();
  const [activeSubTab, setActiveSubTab] = useState('summary'); // summary, batting, bowling, wagon

  const currKey = `innings_${match.current_innings || 1}`;
  const inn = match[currKey] || match.innings_1 || { runs: 0, wickets: 0, overs: 0.0 };
  const batTeam = teams[inn.batting_team_id] || { name: "Mumbai Strikers", logo: "🔥" };
  const bowlTeam = teams[inn.bowling_team_id] || { name: "Delhi Dynamites", logo: "⚡" };

  const battingStats = inn.batting_stats || [];
  const bowlingStats = inn.bowling_stats || [];

  return (
    <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-6 shadow-2xl">
      
      {/* Sub Tab Navigation */}
      <div className="flex space-x-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('summary')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition ${
            activeSubTab === 'summary'
              ? 'bg-[#00D26A] text-black shadow-lg shadow-[#00D26A]/20'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          Summary
        </button>
        <button
          onClick={() => setActiveSubTab('batting')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition ${
            activeSubTab === 'batting'
              ? 'bg-[#00D26A] text-black shadow-lg shadow-[#00D26A]/20'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          Batting Card
        </button>
        <button
          onClick={() => setActiveSubTab('bowling')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition ${
            activeSubTab === 'bowling'
              ? 'bg-[#00D26A] text-black shadow-lg shadow-[#00D26A]/20'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          Bowling Card
        </button>
        <button
          onClick={() => setActiveSubTab('wagon')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition ${
            activeSubTab === 'wagon'
              ? 'bg-[#00D26A] text-black shadow-lg shadow-[#00D26A]/20'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          Live Wagon Wheel
        </button>
      </div>

      {/* SUMMARY TAB */}
      {activeSubTab === 'summary' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Batting Team Summary */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <TeamLogo logo={batTeam.logo} name={batTeam.name} size="md" />
                  <h4 className="font-heading font-extrabold text-white text-base">{batTeam.name}</h4>
                </div>
                <span className="text-xs font-bold text-[#00D26A]">Batting</span>
              </div>
              <div className="flex items-baseline justify-between pt-2">
                <span className="text-3xl font-heading font-black text-white">{inn.runs}/{inn.wickets}</span>
                <span className="text-xs font-bold text-slate-400">({inn.overs} Overs)</span>
              </div>
            </div>

            {/* Bowling Team Summary */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <TeamLogo logo={bowlTeam.logo} name={bowlTeam.name} size="md" />
                  <h4 className="font-heading font-extrabold text-white text-base">{bowlTeam.name}</h4>
                </div>
                <span className="text-xs font-bold text-slate-400">Bowling</span>
              </div>
              <div className="flex items-baseline justify-between pt-2">
                <span className="text-sm font-bold text-slate-300">Wides: {inn.extras?.wides || 0} • NB: {inn.extras?.noballs || 0}</span>
                <span className="text-xs font-bold text-slate-400">Target: {match.overs_limit || 20} Ov</span>
              </div>
            </div>

          </div>

          {/* Batting Highlights Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Current Batters</h4>
            <div className="space-y-2">
              {battingStats.filter(b => !b.out).map((b) => (
                <div key={b.player_id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-[#00D26A]" />
                    <span className="text-xs font-bold text-white">{b.name} {b.player_id === inn.striker_id ? '*' : ''}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-[#00D26A]">{b.runs}</span>
                    <span className="text-[10px] text-slate-400 ml-1">({b.balls}b • {b.fours}x4 • {b.sixes}x6 • SR {b.sr})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* BATTING CARD TAB */}
      {activeSubTab === 'batting' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase font-heading font-extrabold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Batter</th>
                <th className="py-3 px-4">Dismissal</th>
                <th className="py-3 px-4 text-right">R</th>
                <th className="py-3 px-4 text-right">B</th>
                <th className="py-3 px-4 text-right">4s</th>
                <th className="py-3 px-4 text-right">6s</th>
                <th className="py-3 px-4 text-right">SR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium text-slate-200">
              {battingStats.map((b) => (
                <tr key={b.player_id} className="hover:bg-slate-900/40">
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-1.5">
                    {b.name} {b.player_id === inn.striker_id ? <span className="w-2 h-2 rounded-full bg-[#00D26A]"></span> : ''}
                  </td>
                  <td className={`py-3 px-4 font-medium ${b.out ? 'text-red-400' : 'text-[#00D26A]'}`}>
                    {b.dismissal || (b.out ? 'Out' : 'Not Out')}
                  </td>
                  <td className="py-3 px-4 text-right font-black text-[#00D26A]">{b.runs}</td>
                  <td className="py-3 px-4 text-right">{b.balls}</td>
                  <td className="py-3 px-4 text-right">{b.fours}</td>
                  <td className="py-3 px-4 text-right">{b.sixes}</td>
                  <td className="py-3 px-4 text-right font-bold text-white">{b.sr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* BOWLING CARD TAB */}
      {activeSubTab === 'bowling' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase font-heading font-extrabold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Bowler</th>
                <th className="py-3 px-4 text-right">O</th>
                <th className="py-3 px-4 text-right">M</th>
                <th className="py-3 px-4 text-right">R</th>
                <th className="py-3 px-4 text-right">W</th>
                <th className="py-3 px-4 text-right">ECON</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium text-slate-200">
              {bowlingStats.map((bw) => (
                <tr key={bw.player_id} className="hover:bg-slate-900/40">
                  <td className="py-3 px-4 font-bold text-white">{bw.name}</td>
                  <td className="py-3 px-4 text-right font-bold">{bw.overs}</td>
                  <td className="py-3 px-4 text-right">{bw.maidens}</td>
                  <td className="py-3 px-4 text-right">{bw.runs}</td>
                  <td className="py-3 px-4 text-right font-black text-amber-400">{bw.wickets}</td>
                  <td className="py-3 px-4 text-right font-bold text-white">{bw.economy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* WAGON WHEEL TAB */}
      {activeSubTab === 'wagon' && (
        <DraggableFieldingWagonWheel isEditable={false} />
      )}

    </div>
  );
}

import React from 'react';
import { Printer, Download, UserCheck, Shield } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';
import DraggableFieldingWagonWheel from '../Scorer/DraggableFieldingWagonWheel';

export default function LiveScorecard() {
  const { match, teams, players } = useCricket();

  const currKey = `innings_${match.current_innings}`;
  const inn = match[currKey] || match.innings_1;
  const batTeam = teams[inn.batting_team_id] || { name: "Mumbai Strikers", logo: "🔥" };
  const bowlTeam = teams[inn.bowling_team_id] || { name: "Delhi Dynamites", logo: "⚡" };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Batting Card */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{batTeam.logo}</span>
            <h3 className="font-heading font-black text-white text-lg">{batTeam.name} Batting Innings</h3>
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold border border-slate-800 transition"
          >
            <Printer className="w-4 h-4 text-[#00D26A]" />
            <span>Print Scorecard</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Batter</th>
                <th className="py-3 px-3">Dismissal Status</th>
                <th className="py-3 px-3 text-right">R</th>
                <th className="py-3 px-3 text-right">B</th>
                <th className="py-3 px-3 text-right">4s</th>
                <th className="py-3 px-3 text-right">6s</th>
                <th className="py-3 px-3 text-right">SR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-semibold">
              {inn.batting_stats.map((b) => (
                <tr key={b.player_id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-3 font-bold text-white flex items-center space-x-2">
                    <span>{b.name}</span>
                    {!b.out && <span className="text-[#00D26A] text-[10px] font-extrabold bg-[#00D26A]/10 px-1.5 py-0.5 rounded">*</span>}
                  </td>
                  <td className="py-3.5 px-3 text-slate-400 font-medium">{b.dismissal}</td>
                  <td className="py-3.5 px-3 text-right font-black text-white text-sm">{b.runs}</td>
                  <td className="py-3.5 px-3 text-right text-slate-400">{b.balls}</td>
                  <td className="py-3.5 px-3 text-right text-[#00D26A] font-bold">{b.fours}</td>
                  <td className="py-3.5 px-3 text-right text-amber-400 font-bold">{b.sixes}</td>
                  <td className="py-3.5 px-3 text-right text-slate-300 font-bold">{b.sr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bowling Card */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
          <span className="text-2xl">{bowlTeam.logo}</span>
          <h3 className="font-heading font-black text-white text-lg">{bowlTeam.name} Bowling Figures</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Bowler</th>
                <th className="py-3 px-3 text-right">O</th>
                <th className="py-3 px-3 text-right">M</th>
                <th className="py-3 px-3 text-right">R</th>
                <th className="py-3 px-3 text-right">W</th>
                <th className="py-3 px-3 text-right">Econ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-semibold">
              {inn.bowling_stats.map((bw) => (
                <tr key={bw.player_id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-3 font-bold text-white">{bw.name}</td>
                  <td className="py-3.5 px-3 text-right font-bold text-white">{bw.overs}</td>
                  <td className="py-3.5 px-3 text-right text-slate-400">{bw.maidens}</td>
                  <td className="py-3.5 px-3 text-right text-slate-300 font-bold">{bw.runs}</td>
                  <td className="py-3.5 px-3 text-right font-black text-[#00D26A] text-sm">{bw.wickets}</td>
                  <td className="py-3.5 px-3 text-right text-slate-300 font-bold">{bw.economy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Read-Only Wagon Wheel on Scorecard View (isEditable = false) */}
      <DraggableFieldingWagonWheel isEditable={false} />

    </div>
  );
}

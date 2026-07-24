import React from 'react';
import { Printer, Download } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';

export default function LiveScorecard() {
  const { match, teams } = useCricket();

  const currKey = `innings_${match.current_innings}`;
  const inn = match[currKey];
  const batTeam = teams[inn.batting_team_id] || { name: "Batting Team", logo: "🏏" };
  const bowlTeam = teams[inn.bowling_team_id] || { name: "Bowling Team", logo: "⚡" };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Scorecard Action Banner */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Official Match Scorecard Report</span>
        <button
          onClick={handlePrint}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition border border-slate-700"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Export Scorecard</span>
        </button>
      </div>

      {/* Batting Card Table */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xl">{batTeam.logo}</span>
            <h3 className="font-heading font-extrabold text-white text-lg">{batTeam.name} - Batting</h3>
          </div>
          <span className="text-sm font-bold text-[#00D26A]">
            {inn.runs}/{inn.wickets} <span className="text-slate-400">({inn.overs} Ov)</span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Batter</th>
                <th className="py-2.5 px-3">Dismissal</th>
                <th className="py-2.5 px-3 text-right">R</th>
                <th className="py-2.5 px-3 text-right">B</th>
                <th className="py-2.5 px-3 text-right">4s</th>
                <th className="py-2.5 px-3 text-right">6s</th>
                <th className="py-2.5 px-3 text-right">SR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {inn.batting_stats.map((b) => (
                <tr key={b.player_id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-3 font-bold text-white flex items-center space-x-2">
                    <span>{b.name}</span>
                    {!b.out && <span className="w-2 h-2 rounded-full bg-[#00D26A]"></span>}
                  </td>
                  <td className="py-3 px-3 text-slate-400 italic text-[11px]">{b.dismissal}</td>
                  <td className="py-3 px-3 text-right font-extrabold text-white">{b.runs}</td>
                  <td className="py-3 px-3 text-right text-slate-400">{b.balls}</td>
                  <td className="py-3 px-3 text-right text-amber-400 font-bold">{b.fours}</td>
                  <td className="py-3 px-3 text-right text-[#00D26A] font-bold">{b.sixes}</td>
                  <td className="py-3 px-3 text-right text-slate-300 font-semibold">{b.sr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Extras Summary */}
        <div className="flex items-center justify-between pt-2 text-xs text-slate-400 border-t border-slate-800/60">
          <span>Extras: <strong>{inn.extras.wides + inn.extras.noballs + inn.extras.byes + inn.extras.legbyes}</strong> (w {inn.extras.wides}, nb {inn.extras.noballs}, b {inn.extras.byes}, lb {inn.extras.legbyes})</span>
          <span className="font-bold text-white">Total: {inn.runs}/{inn.wickets} ({inn.overs} Overs)</span>
        </div>
      </div>

      {/* Bowling Card Table */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xl">{bowlTeam.logo}</span>
            <h3 className="font-heading font-extrabold text-white text-lg">{bowlTeam.name} - Bowling</h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Bowler</th>
                <th className="py-2.5 px-3 text-right">O</th>
                <th className="py-2.5 px-3 text-right">M</th>
                <th className="py-2.5 px-3 text-right">R</th>
                <th className="py-2.5 px-3 text-right">W</th>
                <th className="py-2.5 px-3 text-right">Econ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {inn.bowling_stats.map((bw) => (
                <tr key={bw.player_id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-3 font-bold text-white">{bw.name}</td>
                  <td className="py-3 px-3 text-right text-slate-300 font-semibold">{bw.overs}</td>
                  <td className="py-3 px-3 text-right text-slate-400">{bw.maidens}</td>
                  <td className="py-3 px-3 text-right text-slate-300">{bw.runs}</td>
                  <td className="py-3 px-3 text-right text-red-400 font-extrabold">{bw.wickets}</td>
                  <td className="py-3 px-3 text-right text-[#00D26A] font-semibold">{bw.economy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

import React, { useState } from 'react';
import { X, PlusCircle, Trophy, Flame } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';

export default function CreateMatchModal({ isOpen, onClose }) {
  const { teams, setMatch, setActiveTab } = useCricket();

  const teamList = Object.values(teams);
  const [teamA, setTeamA] = useState('t1');
  const [teamB, setTeamB] = useState('t2');
  const [overs, setOvers] = useState(20);
  const [tossWinner, setTossWinner] = useState('t1');
  const [tossDecision, setTossDecision] = useState('bat');

  if (!isOpen) return null;

  const handleCreate = (e) => {
    e.preventDefault();
    if (teamA === teamB) {
      alert("Please select two different teams!");
      return;
    }

    const batTeamId = tossDecision === 'bat' ? tossWinner : (tossWinner === teamA ? teamB : teamA);
    const bowlTeamId = batTeamId === teamA ? teamB : teamA;

    const newMatch = {
      id: `m_${Date.now()}`,
      tournament_name: "Grassroots Champions Trophy 2026",
      overs_limit: parseInt(overs),
      status: "LIVE",
      current_innings: 1,
      innings_1: {
        batting_team_id: batTeamId,
        bowling_team_id: bowlTeamId,
        runs: 0,
        wickets: 0,
        overs: 0.0,
        extras: { wides: 0, noballs: 0, byes: 0, legbyes: 0 },
        striker_id: "p1",
        non_striker_id: "p2",
        current_bowler_id: "p8",
        batting_stats: [],
        bowling_stats: []
      },
      innings_2: {
        batting_team_id: bowlTeamId,
        bowling_team_id: batTeamId,
        runs: 0,
        wickets: 0,
        overs: 0.0,
        extras: { wides: 0, noballs: 0, byes: 0, legbyes: 0 },
        striker_id: "p5",
        non_striker_id: "p7",
        current_bowler_id: "p3",
        batting_stats: [],
        bowling_stats: []
      },
      ball_history: [],
      wagon_wheel: []
    };

    setMatch(newMatch);
    onClose();
    setActiveTab('scorer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="w-full max-w-md my-auto bg-[#121824] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 sticky top-0 bg-[#121824] z-10 pt-1">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#00D26A]/20 text-[#00D26A] flex items-center justify-center font-bold">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-heading font-bold text-white">Start New Match</h3>
              <p className="text-xs text-slate-400">Configure team rosters, overs &amp; toss</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleCreate} className="space-y-4 pt-1">
          {/* Team A Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Batting First (Team A)</label>
            <select
              value={teamA}
              onChange={(e) => setTeamA(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm font-semibold focus:outline-none focus:border-[#00D26A]"
            >
              {teamList.map((t) => (
                <option key={t.id} value={t.id}>{t.logo} {t.name} ({t.short_name})</option>
              ))}
            </select>
          </div>

          {/* Team B Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Fielding / Bowling (Team B)</label>
            <select
              value={teamB}
              onChange={(e) => setTeamB(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm font-semibold focus:outline-none focus:border-[#00D26A]"
            >
              {teamList.map((t) => (
                <option key={t.id} value={t.id}>{t.logo} {t.name} ({t.short_name})</option>
              ))}
            </select>
          </div>

          {/* Overs Limit */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Overs Limit</label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 15, 20].map((ov) => (
                <button
                  key={ov}
                  type="button"
                  onClick={() => setOvers(ov)}
                  className={`py-2 rounded-xl text-xs font-bold transition border ${
                    overs === ov
                      ? 'bg-[#00D26A] text-black border-[#00D26A]'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  {ov} Overs
                </button>
              ))}
            </div>
          </div>

          {/* Toss Winner & Decision */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Toss Winner</label>
              <select
                value={tossWinner}
                onChange={(e) => setTossWinner(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold"
              >
                <option value={teamA}>Team A</option>
                <option value={teamB}>Team B</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Elected To</label>
              <select
                value={tossDecision}
                onChange={(e) => setTossDecision(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold"
              >
                <option value="bat">Bat First</option>
                <option value="bowl">Bowl First</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 font-semibold text-sm hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-[#00D26A] hover:bg-[#00FF95] text-black font-extrabold text-sm shadow-lg shadow-[#00D26A]/20"
            >
              Start Match
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

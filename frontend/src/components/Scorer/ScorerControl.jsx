import React, { useState } from 'react';
import { RotateCcw, ArrowRightLeft, Target, AlertTriangle, ChevronRight, UserCheck, Trophy } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';
import WicketModal from './WicketModal';
import MatchWinnerModal from './MatchWinnerModal';

export default function ScorerControl() {
  const {
    match,
    players,
    teams,
    handleScoreBall,
    handleUndoBall,
    swapStrikers,
    setIsWicketModalOpen
  } = useCricket();

  const [shotZone, setShotZone] = useState('Cover');
  const [extraMode, setExtraMode] = useState(null); // 'wide', 'noball', 'bye', 'legbye'
  const [isWinnerOpen, setIsWinnerOpen] = useState(false);

  const currKey = `innings_${match.current_innings}`;
  const inn = match[currKey];
  const batTeam = teams[inn.batting_team_id] || { name: "Batting Team", logo: "🏏" };

  const striker = players[inn.striker_id] || { name: "Rohit Varma" };
  const nonStriker = players[inn.non_striker_id] || { name: "Virat Saxena" };
  const bowler = players[inn.current_bowler_id] || { name: "Rashid Khan" };

  const strikerStat = inn.batting_stats.find(b => b.player_id === inn.striker_id) || { runs: 72, balls: 44, fours: 7, sixes: 4, sr: 163.6 };
  const nonStrikerStat = inn.batting_stats.find(b => b.player_id === inn.non_striker_id) || { runs: 45, balls: 31, fours: 5, sixes: 1, sr: 145.2 };
  const bowlerStat = inn.bowling_stats.find(bw => bw.player_id === inn.current_bowler_id) || { overs: 3.5, runs: 32, wickets: 2, economy: 8.3 };

  const shotZones = ['Cover', 'Long On', 'Mid Off', 'Fine Leg', 'Square Leg', 'Point'];

  const onScoreClick = (runs) => {
    handleScoreBall({
      runs: runs,
      extra_type: extraMode,
      is_wicket: false,
      shot_zone: shotZone
    });
    setExtraMode(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      
      {/* Top Match Header Card */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{batTeam.logo}</span>
            <div>
              <h2 className="text-xl font-heading font-extrabold text-white">{batTeam.name}</h2>
              <p className="text-xs text-slate-400 font-medium">Innings {match.current_innings} • {match.tournament_name}</p>
            </div>
          </div>

          <div className="text-right flex md:flex-col items-center md:items-end justify-between w-full md:w-auto">
            <div className="text-3xl font-heading font-black text-white">
              {inn.runs}<span className="text-slate-400">/</span><span className="text-[#00D26A]">{inn.wickets}</span>
            </div>
            <p className="text-xs text-slate-400 font-semibold">
              {inn.overs} <span className="text-slate-500">/ {match.overs_limit} Overs</span>
            </p>
          </div>
        </div>

        {/* Current Over Ball Chips Ticker & Action Buttons */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2 overflow-x-auto py-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">This Over:</span>
            {match.ball_history.slice(0, 6).map((b, idx) => (
              <span
                key={idx}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center justify-center border shadow-sm ${
                  b.type === 'SIX'
                    ? 'bg-[#00D26A] text-black border-[#00D26A] shadow-md shadow-[#00D26A]/20'
                    : b.type === 'FOUR'
                    ? 'bg-amber-400 text-black border-amber-300'
                    : b.type === 'WICKET'
                    ? 'bg-red-500 text-white border-red-400'
                    : 'bg-slate-800 text-slate-200 border-slate-700'
                }`}
              >
                {b.runs}
              </span>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsWinnerOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-400 text-black text-xs font-extrabold transition shadow-md shadow-amber-400/20"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>End Match</span>
            </button>

            <button
              onClick={handleUndoBall}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition border border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Undo Ball</span>
            </button>
          </div>
        </div>
      </div>

      {/* Players On Field (Striker, Non-Striker & Bowler Card) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Batters Card */}
        <div className="glass-panel rounded-2xl p-4 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Batters</span>
            <button
              onClick={swapStrikers}
              className="flex items-center space-x-1 text-xs font-semibold text-[#00D26A] hover:underline"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Swap Striker</span>
            </button>
          </div>

          {/* Striker */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#00D26A]/10 border border-[#00D26A]/30">
            <div className="flex items-center space-x-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00D26A] animate-pulse"></span>
              <div>
                <p className="text-sm font-bold text-white flex items-center gap-1.5">
                  {striker.name} <span className="text-[10px] bg-[#00D26A] text-black font-extrabold px-1.5 py-0.5 rounded">STRIKER</span>
                </p>
                <p className="text-xs text-slate-400">SR: {strikerStat.sr}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-white">{strikerStat.runs}</span>
              <span className="text-xs text-slate-400 font-medium"> ({strikerStat.balls}b, {strikerStat.fours}x4, {strikerStat.sixes}x6)</span>
            </div>
          </div>

          {/* Non-Striker */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 opacity-80">
            <div className="flex items-center space-x-3">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-600"></span>
              <div>
                <p className="text-sm font-bold text-slate-300">{nonStriker.name}</p>
                <p className="text-xs text-slate-400">SR: {nonStrikerStat.sr}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-slate-200">{nonStrikerStat.runs}</span>
              <span className="text-xs text-slate-400 font-medium"> ({nonStrikerStat.balls}b)</span>
            </div>
          </div>
        </div>

        {/* Bowler Card */}
        <div className="glass-panel rounded-2xl p-4 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Bowler</span>
            <span className="text-xs text-[#00D26A] font-semibold">Over in progress</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-sm">
                🎯
              </div>
              <div>
                <p className="text-sm font-bold text-white">{bowler.name}</p>
                <p className="text-xs text-slate-400">Econ: {bowlerStat.economy}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-red-400">{bowlerStat.wickets}</span>
              <span className="text-[#00D26A] font-bold text-lg"> / {bowlerStat.runs}</span>
              <p className="text-xs text-slate-400">({bowlerStat.overs} ov)</p>
            </div>
          </div>

          {/* Shot Zone Selector for Wagon Wheel */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Shot Direction (Wagon Wheel)
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {shotZones.map((zone) => (
                <button
                  key={zone}
                  onClick={() => setShotZone(zone)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition border ${
                    shotZone === zone
                      ? 'bg-[#00D26A]/20 text-[#00D26A] border-[#00D26A]'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {zone}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Extras Selector Mode */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 space-y-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Extras &amp; Special Events</span>
        <div className="grid grid-cols-4 gap-2">
          {['wide', 'noball', 'bye', 'legbye'].map((ext) => (
            <button
              key={ext}
              onClick={() => setExtraMode(extraMode === ext ? null : ext)}
              className={`py-2 px-3 rounded-xl text-xs font-extrabold uppercase transition border ${
                extraMode === ext
                  ? 'bg-amber-400 text-black border-amber-300 shadow-md shadow-amber-400/20'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              {ext} {extraMode === ext ? '✓' : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Touch Scoring Deck */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Scoring Console</span>
          {extraMode && (
            <span className="text-xs font-bold text-amber-400 animate-pulse">
              [ {extraMode.toUpperCase()} MODE ACTIVE - Tap runs to record ]
            </span>
          )}
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
          {[0, 1, 2, 3, 4, 6].map((num) => (
            <button
              key={num}
              onClick={() => onScoreClick(num)}
              className={`score-btn py-5 rounded-2xl font-heading font-black text-2xl border shadow-lg transition-all ${
                num === 6
                  ? 'bg-gradient-to-tr from-[#00D26A] to-[#00FF95] text-black border-[#00D26A] shadow-[#00D26A]/30 hover:scale-105'
                  : num === 4
                  ? 'bg-gradient-to-tr from-amber-400 to-amber-300 text-black border-amber-400 shadow-amber-400/30 hover:scale-105'
                  : num === 0
                  ? 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                  : 'bg-slate-800 text-white border-slate-700 hover:bg-slate-700'
              }`}
            >
              {num === 0 ? 'DOT' : num}
            </button>
          ))}

          {/* Wicket Button */}
          <button
            onClick={() => setIsWicketModalOpen(true)}
            className="score-btn col-span-2 sm:col-span-1 py-5 rounded-2xl bg-gradient-to-tr from-red-600 to-red-500 text-white font-heading font-black text-xl border border-red-400 shadow-lg shadow-red-500/30 hover:scale-105"
          >
            WKT
          </button>
        </div>
      </div>

      <WicketModal />
      <MatchWinnerModal isOpen={isWinnerOpen} onClose={() => setIsWinnerOpen(false)} />
    </div>
  );
}

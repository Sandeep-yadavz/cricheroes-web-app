import React, { useState } from 'react';
import { RotateCcw, UserCheck, Shield, Trophy, CheckCircle2, Flame } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';
import WicketModal from './WicketModal';
import MatchWinnerModal from './MatchWinnerModal';
import DraggableFieldingWagonWheel from './DraggableFieldingWagonWheel';
import AssignScorerModal from '../Tournaments/AssignScorerModal';

export default function ScorerControl() {
  const { match, teams, handleScoreBall, handleUndoBall, setIsWicketModalOpen, setIsWinnerModalOpen, currentUser } = useCricket();
  const [selectedShotZone, setSelectedShotZone] = useState('Cover');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [showNoBallOptions, setShowNoBallOptions] = useState(false);

  const currKey = `innings_${match.current_innings || 1}`;
  const inn = match[currKey] || match.innings_1 || { runs: 0, wickets: 0, overs: 0.0 };
  const batTeam = teams[inn.batting_team_id] || { name: "Mumbai Strikers", logo: "🔥", short_name: "MUM" };
  const bowlTeam = teams[inn.bowling_team_id] || { name: "Delhi Dynamites", logo: "⚡", short_name: "DEL" };

  const strikerStat = inn?.batting_stats?.find(b => b.player_id === inn.striker_id) || { name: "Rohit Varma", runs: 68, balls: 42 };
  const nonStrikerStat = inn?.batting_stats?.find(b => b.player_id === inn.non_striker_id) || { name: "Virat Saxena", runs: 45, balls: 31 };

  const isTournamentAdmin = currentUser && (currentUser.role === 'ORGANIZER' || currentUser.id === match.admin_id);

  const onScore = (runs, extra_type = null) => {
    handleScoreBall({
      runs,
      extra_type,
      is_wicket: false,
      shot_zone: selectedShotZone
    });
    setShowNoBallOptions(false);
  };

  const crr = inn.overs > 0 ? (inn.runs / (Math.floor(inn.overs) + (inn.overs % 1) * (10 / 6))).toFixed(2) : "0.00";

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-24">
      
      {/* Sleek Top Banner Header */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#00D26A] to-[#00FF95] text-black flex items-center justify-center font-bold shadow-lg shadow-[#00D26A]/20">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-extrabold uppercase text-[#00D26A] tracking-wider">Official Scorer Console</span>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#00D26A]/20 text-[#00D26A] border border-[#00D26A]/40 uppercase flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Live Scoring Active
              </span>
            </div>
            <h2 className="text-2xl font-heading font-black text-white">Match Scorer Console</h2>
            <p className="text-xs text-slate-400 font-semibold">
              Scorer: <strong className="text-white">{currentUser?.name || "Official Scorer"}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {isTournamentAdmin && (
            <button
              onClick={() => setIsAssignModalOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-extrabold shadow-lg shadow-amber-500/20 transition"
            >
              <UserCheck className="w-4 h-4" />
              <span>Assign Scorer</span>
            </button>
          )}

          <button
            onClick={handleUndoBall}
            className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-800 transition"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span>Undo Ball</span>
          </button>
          <button
            onClick={() => setIsWinnerModalOpen(true)}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black shadow-lg shadow-red-600/20 transition"
          >
            <Trophy className="w-4 h-4" />
            <span>End Match</span>
          </button>
        </div>
      </div>

      {/* 🎯 Clean Compact Live Score Display */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4 bg-gradient-to-br from-slate-900/90 to-slate-950/90 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{batTeam.logo}</span>
            <h3 className="font-heading font-black text-white text-xl">{batTeam.name}</h3>
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase">Innings {match.current_innings || 1} • CRR: {crr}</span>
        </div>

        {/* Big Live Score Numbers */}
        <div className="flex items-baseline justify-between py-1">
          <div>
            <span className="text-4xl sm:text-5xl font-heading font-black text-white">{inn.runs}</span>
            <span className="text-2xl sm:text-3xl font-heading font-extrabold text-[#00D26A]">/{inn.wickets}</span>
            <span className="text-sm font-bold text-slate-400 ml-3">({inn.overs} / {match.overs_limit || 20} ov)</span>
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-400 font-medium">Target / Par</div>
            <div className="text-sm font-extrabold text-white">Vs {bowlTeam.name}</div>
          </div>
        </div>

        {/* Current Batters Row */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00D26A] animate-pulse"></span>
              {strikerStat.name} *
            </span>
            <span className="text-sm font-black text-[#00D26A]">{strikerStat.runs} <span className="text-[10px] text-slate-400">({strikerStat.balls}b)</span></span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">{nonStrikerStat.name}</span>
            <span className="text-sm font-black text-slate-300">{nonStrikerStat.runs} <span className="text-[10px] text-slate-400">({nonStrikerStat.balls}b)</span></span>
          </div>
        </div>
      </div>

      {/* Touch Run Scoring Keypad */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-heading font-extrabold text-white text-base">Touch Score Keypad</h3>
          <span className="text-xs font-bold text-[#00D26A]">Tap runs or extras to score</span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
          <button onClick={() => onScore(0)} className="py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-heading font-black text-xl border border-slate-800 shadow-md active:scale-95 transition">0</button>
          <button onClick={() => onScore(1)} className="py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-heading font-black text-xl border border-slate-800 shadow-md active:scale-95 transition">1</button>
          <button onClick={() => onScore(2)} className="py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-heading font-black text-xl border border-slate-800 shadow-md active:scale-95 transition">2</button>
          <button onClick={() => onScore(3)} className="py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-heading font-black text-xl border border-slate-800 shadow-md active:scale-95 transition">3</button>
          <button onClick={() => onScore(4)} className="py-4 rounded-2xl bg-gradient-to-tr from-[#00D26A] to-[#00FF95] text-black font-heading font-black text-2xl shadow-lg shadow-[#00D26A]/20 active:scale-95 transition">4</button>
          <button onClick={() => onScore(6)} className="py-4 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-300 text-black font-heading font-black text-2xl shadow-lg shadow-amber-400/20 active:scale-95 transition">6</button>
          <button onClick={() => setIsWicketModalOpen(true)} className="py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-heading font-black text-lg col-span-2 sm:col-span-1 shadow-lg shadow-red-600/30 active:scale-95 transition">WKT</button>
        </div>

        {/* Extras & No Ball Combo Row */}
        <div className="space-y-3 pt-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button onClick={() => onScore(0, 'wide')} className="py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-amber-300 font-extrabold text-xs border border-slate-800 active:scale-95 transition">WD (Wide)</button>
            <button onClick={() => setShowNoBallOptions(!showNoBallOptions)} className="py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-black font-extrabold text-xs shadow-md shadow-orange-500/20 active:scale-95 transition">⚡ NB (No Ball + Runs)</button>
            <button onClick={() => onScore(1, 'bye')} className="py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 font-extrabold text-xs border border-slate-800 active:scale-95 transition">B (Bye)</button>
            <button onClick={() => onScore(1, 'legbye')} className="py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 font-extrabold text-xs border border-slate-800 active:scale-95 transition">LB (Leg Bye)</button>
          </div>

          {/* No-Ball Options Sub-Row: No Ball + 0, No Ball + 1, No Ball + 2, No Ball + 4, No Ball + 6 */}
          {showNoBallOptions && (
            <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/30 space-y-2 animate-fadeIn">
              <span className="text-[11px] font-extrabold text-orange-400 uppercase tracking-wider block">
                Select Runs Scored Off No-Ball (1 Extra Penalty Added Automatically)
              </span>
              <div className="grid grid-cols-5 gap-2">
                <button onClick={() => onScore(0, 'noball')} className="py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-orange-300 font-extrabold text-xs border border-slate-800">NB + 0</button>
                <button onClick={() => onScore(1, 'noball')} className="py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-orange-300 font-extrabold text-xs border border-slate-800">NB + 1</button>
                <button onClick={() => onScore(2, 'noball')} className="py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-orange-300 font-extrabold text-xs border border-slate-800">NB + 2</button>
                <button onClick={() => onScore(4, 'noball')} className="py-2.5 rounded-xl bg-orange-500 text-black font-extrabold text-xs shadow-md">NB + 4 🚀</button>
                <button onClick={() => onScore(6, 'noball')} className="py-2.5 rounded-xl bg-amber-400 text-black font-extrabold text-xs shadow-md">NB + 6 💥</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Single Draggable Fielding Wagon Wheel */}
      <DraggableFieldingWagonWheel onZoneSelect={(zone) => setSelectedShotZone(zone)} isEditable={true} />

      <WicketModal />
      <MatchWinnerModal isOpen={false} onClose={() => {}} />
      <AssignScorerModal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} />
    </div>
  );
}

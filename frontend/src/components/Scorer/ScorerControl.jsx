import React, { useState } from 'react';
import { RotateCcw, AlertTriangle, UserCheck, Flame, Shield, ArrowRightLeft, Volume2, Target, Trophy, Award, Lock, ShieldAlert, ArrowRight, Eye } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';
import WicketModal from './WicketModal';
import MatchWinnerModal from './MatchWinnerModal';
import DraggableFieldingWagonWheel from './DraggableFieldingWagonWheel';
import AssignScorerModal from '../Tournaments/AssignScorerModal';

export default function ScorerControl() {
  const { match, handleScoreBall, handleUndoBall, setIsWicketModalOpen, setIsWinnerModalOpen, currentUser, handleLogin } = useCricket();
  const [selectedShotZone, setSelectedShotZone] = useState('Cover');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const currKey = `innings_${match.current_innings}`;
  const inn = match[currKey] || match.innings_1;
  const strikerStat = inn.batting_stats.find(b => b.player_id === inn.striker_id) || { name: "Rohit Varma", runs: 68, balls: 42 };
  const nonStrikerStat = inn.batting_stats.find(b => b.player_id === inn.non_striker_id) || { name: "Virat Saxena", runs: 45, balls: 31 };

  // Check if current user is Assigned Scorer or Tournament Admin
  const isAssignedScorer = currentUser && (currentUser.id === match.assigned_scorer_id || currentUser.role === 'SCORER' || currentUser.role === 'ORGANIZER');
  const isTournamentAdmin = currentUser && (currentUser.role === 'ORGANIZER' || currentUser.id === match.admin_id);

  const onScore = (runs, extra_type = null) => {
    if (!isAssignedScorer) {
      alert(`Permission Locked: Only Assigned Scorer (${match.assigned_scorer_name || 'Official Scorer'}) can record balls.`);
      return;
    }
    handleScoreBall({
      runs,
      extra_type,
      is_wicket: false,
      shot_zone: selectedShotZone
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
      
      {/* Top Banner Header */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#00D26A] to-[#00FF95] text-black flex items-center justify-center font-bold shadow-lg shadow-[#00D26A]/20">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-extrabold uppercase text-[#00D26A] tracking-wider">Official Scorer Console</span>
              {isAssignedScorer ? (
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#00D26A]/20 text-[#00D26A] border border-[#00D26A]/40 uppercase">
                  🛡️ You are Assigned Scorer
                </span>
              ) : (
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                  👁️ Spectator Read-Only Mode
                </span>
              )}
            </div>
            <h2 className="text-2xl font-heading font-black text-white">Ball-by-Ball Live Scoring</h2>
            <p className="text-xs text-slate-400 font-semibold">
              Assigned Scorer: <strong className="text-white">{match.assigned_scorer_name || "Official Scorer Rohit"}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {isTournamentAdmin && (
            <button
              onClick={() => setIsAssignModalOpen(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-extrabold shadow-lg shadow-amber-500/20 transition"
            >
              <UserCheck className="w-4 h-4" />
              <span>Assign Scorer</span>
            </button>
          )}

          {isAssignedScorer && (
            <>
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
            </>
          )}
        </div>
      </div>

      {/* Spectator Read-Only Informational Alert if non-assigned */}
      {!isAssignedScorer && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Eye className="w-5 h-5 text-amber-400 shrink-0" />
            <span>
              <strong>Spectator Mode:</strong> You are viewing live match updates in real-time as <strong>{match.assigned_scorer_name || "Official Scorer Rohit"}</strong> scores this match. Touch controls &amp; fielder dragging are locked for spectators.
            </span>
          </div>
        </div>
      )}

      {/* Main Scorecard Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase">On Strike (Batter)</span>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-heading font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00D26A] animate-pulse"></span>
              {strikerStat.name} *
            </h3>
            <span className="text-lg font-heading font-black text-[#00D26A]">{strikerStat.runs} <span className="text-xs text-slate-400">({strikerStat.balls}b)</span></span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase">Non-Striker</span>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-heading font-bold text-slate-300">{nonStrikerStat.name}</h3>
            <span className="text-lg font-heading font-black text-slate-300">{nonStrikerStat.runs} <span className="text-xs text-slate-400">({nonStrikerStat.balls}b)</span></span>
          </div>
        </div>
      </div>

      {/* Touch Run Scoring Keypad */}
      <div className={`glass-card rounded-3xl p-6 border border-slate-800 space-y-5 ${!isAssignedScorer ? 'opacity-60 pointer-events-none' : ''}`}>
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-heading font-extrabold text-white text-base">Touch Score Keypad</h3>
          <span className="text-xs font-bold text-slate-400">{isAssignedScorer ? 'Tap runs or extras to score' : '🔒 Scorer Keypad Locked'}</span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
          <button onClick={() => onScore(0)} className="py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-heading font-black text-xl border border-slate-800 shadow-md">0</button>
          <button onClick={() => onScore(1)} className="py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-heading font-black text-xl border border-slate-800 shadow-md">1</button>
          <button onClick={() => onScore(2)} className="py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-heading font-black text-xl border border-slate-800 shadow-md">2</button>
          <button onClick={() => onScore(3)} className="py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-heading font-black text-xl border border-slate-800 shadow-md">3</button>
          <button onClick={() => onScore(4)} className="py-4 rounded-2xl bg-gradient-to-tr from-[#00D26A] to-[#00FF95] text-black font-heading font-black text-2xl shadow-lg shadow-[#00D26A]/20">4</button>
          <button onClick={() => onScore(6)} className="py-4 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-300 text-black font-heading font-black text-2xl shadow-lg shadow-amber-400/20">6</button>
          <button onClick={() => setIsWicketModalOpen(true)} className="py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-heading font-black text-lg col-span-2 sm:col-span-1 shadow-lg shadow-red-600/30">WKT</button>
        </div>

        {/* Extras Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <button onClick={() => onScore(0, 'wide')} className="py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-amber-300 font-extrabold text-xs border border-slate-800">WD (Wide)</button>
          <button onClick={() => onScore(0, 'noball')} className="py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-orange-400 font-extrabold text-xs border border-slate-800">NB (No Ball)</button>
          <button onClick={() => onScore(1, 'bye')} className="py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 font-extrabold text-xs border border-slate-800">B (Bye)</button>
          <button onClick={() => onScore(1, 'legbye')} className="py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 font-extrabold text-xs border border-slate-800">LB (Leg Bye)</button>
        </div>
      </div>

      {/* Draggable Wagon Wheel & Fielder Placement Widget (Editable only by Assigned Scorer!) */}
      <DraggableFieldingWagonWheel onZoneSelect={(zone) => setSelectedShotZone(zone)} isEditable={isAssignedScorer} />

      <WicketModal />
      <MatchWinnerModal isOpen={false} onClose={() => {}} />
      <AssignScorerModal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} />
    </div>
  );
}

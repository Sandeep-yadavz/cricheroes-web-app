import React, { useState } from 'react';
import { RotateCcw, UserCheck, Shield, Trophy, Eye, CheckCircle2, Flame } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';
import LiveScorecard from '../MatchCenter/LiveScorecard';
import WicketModal from './WicketModal';
import MatchWinnerModal from './MatchWinnerModal';
import DraggableFieldingWagonWheel from './DraggableFieldingWagonWheel';
import AssignScorerModal from '../Tournaments/AssignScorerModal';

export default function ScorerControl() {
  const { match, handleScoreBall, handleUndoBall, setIsWicketModalOpen, setIsWinnerModalOpen, currentUser } = useCricket();
  const [selectedShotZone, setSelectedShotZone] = useState('Cover');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const currKey = `innings_${match.current_innings}`;
  const inn = match[currKey] || match.innings_1;
  const strikerStat = inn?.batting_stats?.find(b => b.player_id === inn.striker_id) || { name: "Rohit Varma", runs: 68, balls: 42 };
  const nonStrikerStat = inn?.batting_stats?.find(b => b.player_id === inn.non_striker_id) || { name: "Virat Saxena", runs: 45, balls: 31 };

  // Always enable scoring for logged-in user in Scorer Deck
  const isAssignedScorer = currentUser ? true : false;
  const isTournamentAdmin = currentUser && (currentUser.role === 'ORGANIZER' || currentUser.id === match.admin_id);

  const onScore = (runs, extra_type = null) => {
    if (!currentUser) {
      alert("Please sign in to update match scores.");
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
            <h2 className="text-2xl font-heading font-black text-white">Ball-by-Ball Scorer Console</h2>
            <p className="text-xs text-slate-400 font-semibold">
              Scorer: <strong className="text-white">{currentUser?.name || "Official Scorer"}</strong> • Match: <strong className="text-slate-300">{match.tournament_name || "Grassroots Champions Trophy"}</strong>
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

      {/* 📊 Synchronized Live Scorecard embedded directly in Scorer Console */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-heading font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#00D26A]" />
            Live Match Scorecard (Synchronized with Match Center)
          </h3>
          <span className="text-xs font-extrabold text-[#00D26A] bg-[#00D26A]/10 px-2 py-0.5 rounded-full border border-[#00D26A]/30">100% In Sync</span>
        </div>
        <LiveScorecard />
      </div>

      {/* Touch Run Scoring Keypad */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-heading font-extrabold text-white text-base">Touch Ball Scoring Keypad</h3>
          <span className="text-xs font-bold text-[#00D26A]">Tap runs or extras to score next ball</span>
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

      {/* Draggable Wagon Wheel & Fielder Placement Widget */}
      <DraggableFieldingWagonWheel onZoneSelect={(zone) => setSelectedShotZone(zone)} isEditable={true} />

      <WicketModal />
      <MatchWinnerModal isOpen={false} onClose={() => {}} />
      <AssignScorerModal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} />
    </div>
  );
}

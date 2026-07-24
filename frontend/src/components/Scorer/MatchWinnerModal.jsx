import React from 'react';
import { Trophy, Award, Flame, X, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCricket } from '../../context/CricketContext';

export default function MatchWinnerModal({ isOpen, onClose }) {
  const { match, teams, players } = useCricket();

  React.useEffect(() => {
    if (isOpen) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#00D26A', '#FFD700', '#FF3366', '#0066FF']
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const inn1 = match.innings_1;
  const batTeam = teams[inn1.batting_team_id] || { name: "Mumbai Strikers", logo: "🔥" };
  const bowlTeam = teams[inn1.bowling_team_id] || { name: "Delhi Dynamites", logo: "⚡" };

  const potm = players["p1"] || { name: "Rohit Varma", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80", runs: 72, balls: 44, wickets: 0 };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg bg-[#121824] border-2 border-[#00D26A]/50 rounded-3xl p-6 shadow-2xl space-y-6 text-center relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#00D26A]/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg">
          <X className="w-5 h-5" />
        </button>

        {/* Trophy Icon */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500 to-amber-300 text-black flex items-center justify-center shadow-xl shadow-amber-500/30">
          <Trophy className="w-10 h-10" />
        </div>

        {/* Title & Winner Summary */}
        <div>
          <span className="text-xs font-extrabold uppercase text-[#00D26A] tracking-widest block">MATCH COMPLETED</span>
          <h2 className="text-2xl font-heading font-black text-white mt-1">{batTeam.name} WON!</h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Won by {inn1.runs} runs against {bowlTeam.name}
          </p>
        </div>

        {/* Score Summary Box */}
        <div className="flex items-center justify-around p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="text-center">
            <span className="text-2xl">{batTeam.logo}</span>
            <p className="text-xs font-bold text-white mt-1">{batTeam.name}</p>
            <p className="text-lg font-heading font-black text-[#00D26A]">{inn1.runs}/{inn1.wickets}</p>
            <span className="text-[10px] text-slate-400">({inn1.overs} ov)</span>
          </div>

          <span className="text-slate-600 font-black">VS</span>

          <div className="text-center">
            <span className="text-2xl">{bowlTeam.logo}</span>
            <p className="text-xs font-bold text-white mt-1">{bowlTeam.name}</p>
            <p className="text-lg font-heading font-black text-slate-400">0/0</p>
            <span className="text-[10px] text-slate-400">(0.0 ov)</span>
          </div>
        </div>

        {/* Player of the Match Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-amber-500/10 border border-amber-500/30 space-y-3">
          <div className="flex items-center justify-center space-x-1.5 text-xs font-extrabold text-amber-400 uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>PLAYER OF THE MATCH</span>
          </div>

          <div className="flex items-center justify-center space-x-4">
            <img src={potm.avatar} alt={potm.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400" />
            <div className="text-left">
              <h4 className="text-base font-bold text-white">{potm.name}</h4>
              <p className="text-xs text-amber-400 font-bold">{potm.runs} Runs ({potm.balls} Balls) • 4x4, 4x6</p>
              <p className="text-[10px] text-slate-400">Strike Rate: 163.6</p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-xl bg-[#00D26A] hover:bg-[#00FF95] text-black font-heading font-extrabold text-sm shadow-lg shadow-[#00D26A]/20 transition"
        >
          View Full Match Center &amp; Stats
        </button>

      </div>
    </div>
  );
}

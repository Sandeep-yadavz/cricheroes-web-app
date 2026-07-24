import React from 'react';
import { MapPin, Calendar, Clock, Trophy, Flame } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';
import TeamLogo from '../Common/TeamLogo';

export default function MatchHeader() {
  const { match, teams } = useCricket();

  const currKey = `innings_${match.current_innings || 1}`;
  const inn = match[currKey] || match.innings_1 || { runs: 0, wickets: 0, overs: 0.0 };
  const teamA = teams[inn.batting_team_id] || { name: "Mumbai Strikers", logo: "🔥", short_name: "MUM" };
  const teamB = teams[inn.bowling_team_id] || { name: "Delhi Dynamites", logo: "⚡", short_name: "DEL" };

  const crr = inn.overs > 0 ? (inn.runs / (Math.floor(inn.overs) + (inn.overs % 1) * (10 / 6))).toFixed(2) : "0.00";
  const currentOverBalls = (match.ball_history || []).slice(0, 8);

  return (
    <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-5 shadow-2xl relative overflow-hidden">
      
      {/* Top Match Metadata */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-slate-300">{match.tournament_name || "Grassroots Champions Trophy"}</span>
        </div>
        <div className="flex items-center space-x-3 text-xs font-semibold text-slate-400">
          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#00D26A]" /> {match.venue || "Central Ground"}</span>
          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-amber-400" /> Live Match</span>
        </div>
      </div>

      {/* Live Match Scoreboard Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        
        {/* Team A */}
        <div className="flex items-center space-x-4">
          <TeamLogo logo={teamA.logo} name={teamA.name} size="lg" />
          <div>
            <h3 className="font-heading font-black text-white text-xl">{teamA.name}</h3>
            <p className="text-xs text-slate-400 font-bold">Batting Innings {match.current_innings || 1}</p>
          </div>
        </div>

        {/* Big Live Score */}
        <div className="text-center space-y-1">
          <div className="flex items-baseline justify-center space-x-2">
            <span className="text-5xl font-heading font-black text-white">{inn.runs}</span>
            <span className="text-3xl font-heading font-extrabold text-[#00D26A]">/{inn.wickets}</span>
          </div>
          <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wide">
            ({inn.overs} / {match.overs_limit || 20} Overs) • CRR: {crr}
          </p>
        </div>

        {/* Team B */}
        <div className="flex items-center justify-end space-x-4">
          <div className="text-right">
            <h3 className="font-heading font-black text-white text-xl">{teamB.name}</h3>
            <p className="text-xs text-slate-400 font-bold">Bowling Team</p>
          </div>
          <TeamLogo logo={teamB.logo} name={teamB.name} size="lg" />
        </div>

      </div>

      {/* 🏏 "THIS OVER BALLS" Tracker Bar */}
      <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
        <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-[#00D26A]" /> THIS OVER BALLS
        </span>
        <div className="flex items-center space-x-2 overflow-x-auto">
          {currentOverBalls.length === 0 ? (
            <span className="text-xs text-slate-500 font-semibold">Start of over</span>
          ) : (
            currentOverBalls.map((b, idx) => {
              const isW = b.is_wicket;
              const isSix = b.runs === 6 && !b.extra_type;
              const isFour = b.runs === 4 && !b.extra_type;
              const isExtra = !!b.extra_type;

              return (
                <span
                  key={b.id || idx}
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-heading font-black border transition ${
                    isW
                      ? 'bg-red-600 text-white border-red-500'
                      : isSix
                      ? 'bg-amber-400 text-black border-amber-300'
                      : isFour
                      ? 'bg-[#00D26A] text-black border-[#00FF95]'
                      : isExtra
                      ? 'bg-orange-500 text-black border-orange-400'
                      : 'bg-slate-900 text-white border-slate-800'
                  }`}
                >
                  {isW ? 'W' : isExtra ? `${b.extra_type === 'noball' ? 'NB' : b.extra_type === 'wide' ? 'WD' : 'B'}${b.runs > 0 ? b.runs : ''}` : b.runs}
                </span>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
}

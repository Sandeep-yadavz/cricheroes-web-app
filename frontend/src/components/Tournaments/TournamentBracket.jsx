import React from 'react';
import { Trophy, CheckCircle, Clock, Zap } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';

export default function TournamentBracket() {
  const { teams } = useCricket();

  const mum = teams['t1'] || { name: "Mumbai Strikers", logo: "🔥", short_name: "MUM" };
  const del = teams['t2'] || { name: "Delhi Dynamites", logo: "⚡", short_name: "DEL" };
  const blr = teams['t3'] || { name: "Bangalore Blasters", logo: "💥", short_name: "BLR" };
  const che = teams['t4'] || { name: "Chennai Super Kings", logo: "🦁", short_name: "CHE" };

  return (
    <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-white text-lg">Knockout Stage &amp; Playoff Brackets</h3>
            <p className="text-xs text-slate-400">Road to the Grassroots Champions Trophy 2026</p>
          </div>
        </div>
        <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/30">
          Playoffs
        </span>
      </div>

      {/* Bracket Tree Flow */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center pt-2">
        
        {/* Semi Finals Column */}
        <div className="space-y-4">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest block text-center">Semi Final 1</span>
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-lg">
            <div className="flex items-center justify-between font-semibold text-xs">
              <span className="flex items-center space-x-2 text-white">
                <span>{mum.logo}</span>
                <span>{mum.name}</span>
              </span>
              <span className="text-[#00D26A] font-extrabold">146/3</span>
            </div>
            <div className="flex items-center justify-between font-semibold text-xs border-t border-slate-800/80 pt-2">
              <span className="flex items-center space-x-2 text-slate-300">
                <span>{del.logo}</span>
                <span>{del.name}</span>
              </span>
              <span className="text-red-400 font-extrabold">0/0</span>
            </div>
            <span className="text-[10px] font-extrabold text-red-400 bg-red-500/10 px-2 py-0.5 rounded block text-center">LIVE NOW</span>
          </div>

          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest block text-center pt-2">Semi Final 2</span>
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-lg">
            <div className="flex items-center justify-between font-semibold text-xs">
              <span className="flex items-center space-x-2 text-white">
                <span>{blr.logo}</span>
                <span>{blr.name}</span>
              </span>
              <span className="text-amber-400 font-extrabold">182/4 ✓</span>
            </div>
            <div className="flex items-center justify-between font-semibold text-xs border-t border-slate-800/80 pt-2 opacity-60">
              <span className="flex items-center space-x-2 text-slate-300">
                <span>{che.logo}</span>
                <span>{che.name}</span>
              </span>
              <span className="text-slate-400">164/8</span>
            </div>
            <span className="text-[10px] font-extrabold text-slate-400 bg-slate-800 px-2 py-0.5 rounded block text-center">BLR WON BY 18 RUNS</span>
          </div>
        </div>

        {/* Divider Lines */}
        <div className="hidden md:flex flex-col items-center justify-center space-y-8">
          <div className="w-full h-0.5 bg-gradient-to-r from-slate-800 via-[#00D26A] to-amber-400"></div>
          <div className="p-2 rounded-full bg-slate-900 border border-slate-800 text-amber-400 font-black text-xs">
            VS
          </div>
          <div className="w-full h-0.5 bg-gradient-to-r from-slate-800 via-amber-400 to-[#00D26A]"></div>
        </div>

        {/* Final Match Column */}
        <div className="space-y-4">
          <span className="text-[11px] font-extrabold text-amber-400 uppercase tracking-widest block text-center">GRAND FINAL</span>
          <div className="p-5 rounded-2xl bg-gradient-to-b from-amber-500/10 to-slate-900 border-2 border-amber-400/40 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-400 text-black flex items-center justify-center font-bold shadow-lg shadow-amber-400/20">
              <Trophy className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2 text-sm font-bold text-white">
                <span>{blr.logo} {blr.short_name}</span>
                <span className="text-amber-400 font-extrabold">VS</span>
                <span className="text-slate-400">SF1 Winner</span>
              </div>
              <p className="text-xs text-slate-400 font-semibold">Central Cricket Ground, Mumbai</p>
              <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-extrabold">
                <Clock className="w-3 h-3 mr-1" />
                SCHEDULED SUNDAY 4:00 PM
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

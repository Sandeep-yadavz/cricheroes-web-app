import React from 'react';
import { Share2, Trophy, Flame, Check, Copy } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';

export default function MatchShareCard() {
  const { match, teams, players } = useCricket();
  const [copied, setCopied] = React.useState(false);

  const currKey = `innings_${match.current_innings}`;
  const inn = match[currKey];
  const batTeam = teams[inn.batting_team_id] || { name: "Mumbai Strikers", logo: "🔥", short_name: "MUM" };
  const bowlTeam = teams[inn.bowling_team_id] || { name: "Delhi Dynamites", logo: "⚡", short_name: "DEL" };

  const topBatter = inn.batting_stats[0] || { name: "Rohit Varma", runs: 72, balls: 44 };
  const topBowler = inn.bowling_stats[0] || { name: "Rashid Khan", wickets: 2, runs: 32, overs: 3.5 };

  const handleCopySummary = () => {
    const text = `🏏 CRICHEROES MATCH UPDATE 🏏\n${match.tournament_name}\n\n🔥 ${batTeam.name}: ${inn.runs}/${inn.wickets} (${inn.overs} Ov)\n⚡ ${bowlTeam.name}: Yet to bat\n\n🌟 Top Batter: ${topBatter.name} ${topBatter.runs}* (${topBatter.balls}b)\n🎯 Top Bowler: ${topBowler.name} ${topBowler.wickets}/${topBowler.runs}\n\nScored live on CricHeroes Platform!`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-white text-lg">Match Graphic Poster</h3>
            <p className="text-xs text-slate-400">Shareable social media card for WhatsApp &amp; Instagram</p>
          </div>
        </div>

        <button
          onClick={handleCopySummary}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#00D26A] text-black font-extrabold text-xs shadow-md shadow-[#00D26A]/20 hover:opacity-95 transition"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? "Copied!" : "Copy Summary Text"}</span>
        </button>
      </div>

      {/* Visual Poster Card Container */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0B0E14] via-[#121824] to-[#1A2332] border-2 border-[#00D26A]/40 p-6 space-y-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#00D26A]/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Header */}
        <div className="flex items-center justify-between">
          <span className="font-heading font-black text-lg text-white tracking-wider">CRIC<span className="text-[#00D26A]">HEROES</span></span>
          <span className="text-[11px] font-extrabold uppercase px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">LIVE MATCH</span>
        </div>

        {/* Tournament Name */}
        <div className="text-center">
          <p className="text-xs text-slate-400 font-extrabold uppercase tracking-widest">{match.tournament_name}</p>
        </div>

        {/* Teams Score Grid */}
        <div className="flex items-center justify-around py-4 bg-slate-900/60 rounded-xl border border-slate-800">
          <div className="text-center space-y-1">
            <span className="text-3xl">{batTeam.logo}</span>
            <h4 className="text-sm font-extrabold text-white">{batTeam.short_name}</h4>
            <div className="text-xl font-heading font-black text-[#00D26A]">{inn.runs}/{inn.wickets}</div>
            <p className="text-[10px] text-slate-400">({inn.overs} Ov)</p>
          </div>

          <div className="text-slate-600 font-black text-xl">VS</div>

          <div className="text-center space-y-1">
            <span className="text-3xl">{bowlTeam.logo}</span>
            <h4 className="text-sm font-extrabold text-white">{bowlTeam.short_name}</h4>
            <div className="text-xl font-heading font-black text-slate-400">0/0</div>
            <p className="text-[10px] text-slate-400">(0.0 Ov)</p>
          </div>
        </div>

        {/* Top Performers Banner */}
        <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Top Batter</span>
            <p className="font-extrabold text-white">{topBatter.name}</p>
            <p className="text-amber-400 font-bold">{topBatter.runs}* runs ({topBatter.balls}b)</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Top Bowler</span>
            <p className="font-extrabold text-white">{topBowler.name}</p>
            <p className="text-purple-400 font-bold">{topBowler.wickets}/{topBowler.runs} ({topBowler.overs}ov)</p>
          </div>
        </div>

      </div>

    </div>
  );
}

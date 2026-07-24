import React, { useState } from 'react';
import { FileText, MessageSquare, TrendingUp, Target, Share2, Zap, Layers, ChevronDown } from 'lucide-react';
import LiveScorecard from './LiveScorecard';
import Commentary from './Commentary';
import WormChart from './WormChart';
import WagonWheel from './WagonWheel';
import MatchShareCard from './MatchShareCard';
import { useCricket } from '../../context/CricketContext';

export default function MatchCenter() {
  const [activeSubTab, setActiveSubTab] = useState('scorecard'); // scorecard, commentary, worm, wagon, share
  const { match, setMatch, teams } = useCricket();

  const currKey = `innings_${match.current_innings}`;
  const inn = match[currKey] || match.innings_1;
  const batTeam = teams[inn.batting_team_id] || { name: "Mumbai Strikers", logo: "🔥", short_name: "MUM" };
  const bowlTeam = teams[inn.bowling_team_id] || { name: "Delhi Dynamites", logo: "⚡", short_name: "DEL" };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      
      {/* Live Match Main Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950 via-[#121824] to-slate-900 border border-slate-800 p-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00D26A]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Batting Team Side */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-center text-4xl shadow-lg">
              {batTeam.logo}
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase text-[#00D26A] tracking-wider">
                {match.status === 'COMPLETED' ? 'Match Finished' : 'Batting First'}
              </span>
              <h2 className="text-2xl font-heading font-black text-white">{batTeam.name}</h2>
              <p className="text-xs text-slate-400 font-medium">{match.tournament_name}</p>
            </div>
          </div>

          {/* Big Score Display */}
          <div className="text-center bg-slate-900/80 px-6 py-3 rounded-2xl border border-slate-800 shadow-inner">
            <div className="text-4xl font-heading font-black text-white tracking-tight">
              {inn.runs} <span className="text-slate-500">/</span> <span className="text-[#00D26A]">{inn.wickets}</span>
            </div>
            <p className="text-xs text-slate-400 font-bold mt-0.5">
              OVERS: <span className="text-white">{inn.overs}</span> / {match.overs_limit}
            </p>
          </div>

          {/* Bowling Team Side */}
          <div className="flex items-center space-x-4 md:flex-row-reverse md:space-x-reverse">
            <div className="w-16 h-16 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-center text-4xl shadow-lg">
              {bowlTeam.logo}
            </div>
            <div className="md:text-right">
              <span className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">
                {match.status === 'COMPLETED' ? 'Opponent' : 'Bowling'}
              </span>
              <h2 className="text-2xl font-heading font-black text-white">{bowlTeam.name}</h2>
              <p className="text-xs text-slate-400 font-medium">
                {match.result || "Target: Pending"}
              </p>
            </div>
          </div>

        </div>

        {/* Live Match Summary Banner */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="flex items-center space-x-1.5 text-amber-400 font-semibold">
            <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>Rohit Varma 72* (44b) &amp; Virat Saxena 45* (31b) leading the charge!</span>
          </span>
          <span className="text-slate-400 font-bold">
            CRR: {((inn.runs / (Math.floor(inn.overs) + (inn.overs % 1)*1.666 || 1))).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center space-x-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('scorecard')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
            activeSubTab === 'scorecard'
              ? 'bg-[#00D26A] text-black shadow-md shadow-[#00D26A]/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Scorecard</span>
        </button>

        <button
          onClick={() => setActiveSubTab('commentary')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
            activeSubTab === 'commentary'
              ? 'bg-[#00D26A] text-black shadow-md shadow-[#00D26A]/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Commentary ({match.ball_history.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('worm')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
            activeSubTab === 'worm'
              ? 'bg-[#00D26A] text-black shadow-md shadow-[#00D26A]/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Worm Graph</span>
        </button>

        <button
          onClick={() => setActiveSubTab('wagon')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
            activeSubTab === 'wagon'
              ? 'bg-[#00D26A] text-black shadow-md shadow-[#00D26A]/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>Wagon Wheel</span>
        </button>

        <button
          onClick={() => setActiveSubTab('share')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
            activeSubTab === 'share'
              ? 'bg-[#00D26A] text-black shadow-md shadow-[#00D26A]/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>Share Graphic Card</span>
        </button>
      </div>

      {/* Sub-Tab View Rendering */}
      {activeSubTab === 'scorecard' && <LiveScorecard />}
      {activeSubTab === 'commentary' && <Commentary />}
      {activeSubTab === 'worm' && <WormChart />}
      {activeSubTab === 'wagon' && <WagonWheel />}
      {activeSubTab === 'share' && <MatchShareCard />}

    </div>
  );
}

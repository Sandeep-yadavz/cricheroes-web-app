import React, { useState } from 'react';
import { Shield, Radio, Trophy, Users, Calculator, Volume2, VolumeX, Flame, PlusCircle, LogOut, Lock, Sparkles } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';
import CreateMatchModal from '../Scorer/CreateMatchModal';
import AuthModal from '../Auth/AuthModal';

export default function Navbar() {
  const { activeTab, setActiveTab, soundEnabled, setSoundEnabled, match, teams, currentUser, handleLogout } = useCricket();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Scorer Deck Tab visibility check: ONLY visible for Assigned Scorer or Tournament Admin!
  const isScorerForMatch = currentUser && (currentUser.id === match.assigned_scorer_id || currentUser.id === match.admin_id);

  return (
    <header className="sticky top-0 z-40 bg-[#0B0E14]/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Live Badge */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('match_center')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00D26A] to-[#00FF95] flex items-center justify-center shadow-lg shadow-[#00D26A]/20">
              <Flame className="w-6 h-6 text-black font-extrabold" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-heading font-black text-xl tracking-tight text-white">CRIC<span className="text-[#00D26A]">HEROES</span></span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5 animate-live-pulse"></span>
                  LIVE
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">Grassroots Cricket Engine</p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('match_center')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'match_center'
                  ? 'bg-[#00D26A] text-black shadow-md shadow-[#00D26A]/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Radio className="w-4 h-4" />
              <span>Match Center</span>
            </button>

            {/* Scorer Deck: ONLY visible if logged in user is Assigned Scorer or Tournament Admin */}
            {isScorerForMatch && (
              <button
                onClick={() => setActiveTab('scorer')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === 'scorer'
                    ? 'bg-[#00D26A] text-black shadow-md shadow-[#00D26A]/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Scorer Deck</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('tournaments')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'tournaments'
                  ? 'bg-[#00D26A] text-black shadow-md shadow-[#00D26A]/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Tournaments</span>
            </button>

            <button
              onClick={() => setActiveTab('fantasy')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'fantasy'
                  ? 'bg-[#00D26A] text-black shadow-md shadow-[#00D26A]/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Fantasy XI</span>
            </button>

            <button
              onClick={() => setActiveTab('players')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'players'
                  ? 'bg-[#00D26A] text-black shadow-md shadow-[#00D26A]/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Players &amp; Stats</span>
            </button>

            <button
              onClick={() => setActiveTab('nrr')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'nrr'
                  ? 'bg-[#00D26A] text-black shadow-md shadow-[#00D26A]/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>NRR Calc</span>
            </button>
          </nav>

          {/* Controls: Auth User, New Match, Sound */}
          <div className="flex items-center space-x-3">
            {currentUser ? (
              <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <span className="text-[#00D26A]">👤</span>
                  {currentUser.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-slate-500 hover:text-red-400 p-0.5 rounded transition"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold border border-slate-800 transition"
              >
                <Lock className="w-3.5 h-3.5 text-[#00D26A]" />
                <span>Sign In</span>
              </button>
            )}

            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#00D26A] hover:bg-[#00FF95] text-black font-extrabold text-xs transition shadow-md shadow-[#00D26A]/20"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">New Match</span>
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
              title={soundEnabled ? "Mute Match Audio" : "Enable Match Audio"}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5 text-[#00D26A]" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
            </button>
          </div>

        </div>
      </div>

      <CreateMatchModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </header>
  );
}

import React from 'react';
import Navbar from './components/Navigation/Navbar';
import TabBar from './components/Navigation/TabBar';
import MatchCenter from './components/MatchCenter/MatchCenter';
import GlobalSearchHub from './components/Search/GlobalSearchHub';
import ScorerControl from './components/Scorer/ScorerControl';
import TournamentCenter from './components/Tournaments/TournamentCenter';
import FantasyHub from './components/Fantasy/FantasyHub';
import PlayerHub from './components/Players/PlayerHub';
import NRRModal from './components/NRRCalculator/NRRModal';
import LoginPage from './components/Auth/LoginPage';
import CelebrationOverlay from './components/Celebration/CelebrationOverlay';
import { useCricket } from './context/CricketContext';

export default function App() {
  const { activeTab, currentUser, celebrationType, setCelebrationType } = useCricket();

  // If user is not signed in / registered, present full-screen Login / Register Screen!
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#0B0E14] text-slate-100 flex flex-col font-sans">
        <header className="bg-[#0B0E14] border-b border-slate-800 py-4 px-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-[#00D26A] text-black font-black flex items-center justify-center text-lg">
              🔥
            </div>
            <span className="font-heading font-black text-xl text-white">CRIC<span className="text-[#00D26A]">HEROES</span></span>
          </div>
          <span className="text-xs font-bold text-slate-400">Universal Grassroots Access</span>
        </header>

        <main className="flex-1 flex items-center justify-center p-4">
          <LoginPage />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-100 font-sans selection:bg-[#00D26A] selection:text-black">
      {/* Top App Navbar */}
      <Navbar />

      {/* Main App Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'match_center' && <MatchCenter />}
        {activeTab === 'search' && <GlobalSearchHub />}
        {activeTab === 'scorer' && <ScorerControl />}
        {activeTab === 'tournaments' && <TournamentCenter />}
        {activeTab === 'fantasy' && <FantasyHub />}
        {activeTab === 'players' && <PlayerHub />}
        {activeTab === 'nrr' && <NRRModal />}
      </main>

      {/* Explosive Celebration Overlay for 4, 6, and Wicket */}
      <CelebrationOverlay type={celebrationType} onClose={() => setCelebrationType(null)} />

      {/* Mobile Navigation TabBar */}
      <TabBar />
    </div>
  );
}

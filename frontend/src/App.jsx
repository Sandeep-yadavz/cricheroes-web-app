import React from 'react';
import { CricketProvider, useCricket } from './context/CricketContext';
import Navbar from './components/Navigation/Navbar';
import TabBar from './components/Navigation/TabBar';
import MatchCenter from './components/MatchCenter/MatchCenter';
import ScorerControl from './components/Scorer/ScorerControl';
import TournamentCenter from './components/Tournaments/TournamentCenter';
import PlayerHub from './components/Players/PlayerHub';
import NRRModal from './components/NRRCalculator/NRRModal';
import LoginPage from './components/Auth/LoginPage';
import FantasyHub from './components/Fantasy/FantasyHub';

function MainLayout() {
  const { activeTab } = useCricket();

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'match_center' && <MatchCenter />}
        {activeTab === 'scorer' && <ScorerControl />}
        {activeTab === 'tournaments' && <TournamentCenter />}
        {activeTab === 'fantasy' && <FantasyHub />}
        {activeTab === 'players' && <PlayerHub />}
        {activeTab === 'nrr' && <NRRModal />}
        {activeTab === 'login' && <LoginPage />}
      </main>

      <TabBar />
    </div>
  );
}

export default function App() {
  return (
    <CricketProvider>
      <MainLayout />
    </CricketProvider>
  );
}

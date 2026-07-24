import React from 'react';
import { Radio, Shield, Trophy, Users, Sparkles } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';

export default function TabBar() {
  const { activeTab, setActiveTab, currentUser, match } = useCricket();

  const isScorerForMatch = currentUser && (currentUser.id === match.assigned_scorer_id || currentUser.id === match.admin_id);

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B0E14]/95 backdrop-blur-lg border-t border-slate-800 py-2 px-4">
      <div className="flex items-center justify-around">
        <button
          onClick={() => setActiveTab('match_center')}
          className={`flex flex-col items-center space-y-1 transition ${
            activeTab === 'match_center' ? 'text-[#00D26A]' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Radio className="w-5 h-5" />
          <span className="text-[10px] font-bold">Center</span>
        </button>

        {/* Scorer Deck Tab: Only visible if assigned scorer or tournament admin */}
        {isScorerForMatch && (
          <button
            onClick={() => setActiveTab('scorer')}
            className={`flex flex-col items-center space-y-1 transition ${
              activeTab === 'scorer' ? 'text-[#00D26A]' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Shield className="w-5 h-5" />
            <span className="text-[10px] font-bold">Scorer</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('tournaments')}
          className={`flex flex-col items-center space-y-1 transition ${
            activeTab === 'tournaments' ? 'text-[#00D26A]' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Trophy className="w-5 h-5" />
          <span className="text-[10px] font-bold">Tourneys</span>
        </button>

        <button
          onClick={() => setActiveTab('fantasy')}
          className={`flex flex-col items-center space-y-1 transition ${
            activeTab === 'fantasy' ? 'text-[#00D26A]' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px] font-bold">Fantasy</span>
        </button>

        <button
          onClick={() => setActiveTab('players')}
          className={`flex flex-col items-center space-y-1 transition ${
            activeTab === 'players' ? 'text-[#00D26A]' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] font-bold">Stats</span>
        </button>
      </div>
    </div>
  );
}

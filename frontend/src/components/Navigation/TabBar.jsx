import React from 'react';
import { Radio, Shield, Trophy, Users, Calculator } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';

export default function TabBar() {
  const { activeTab, setActiveTab } = useCricket();

  const tabs = [
    { id: 'match_center', label: 'Match Center', icon: Radio },
    { id: 'scorer', label: 'Scorer', icon: Shield },
    { id: 'tournaments', label: 'Tournaments', icon: Trophy },
    { id: 'players', label: 'Players', icon: Users },
    { id: 'nrr', label: 'NRR Calc', icon: Calculator },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0B0E14]/95 backdrop-blur-lg border-t border-slate-800 px-2 py-2">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                isActive ? 'text-[#00D26A] font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`p-1 rounded-lg ${isActive ? 'bg-[#00D26A]/10' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

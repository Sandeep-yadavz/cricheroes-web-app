import React, { useState } from 'react';
import { Search, MapPin, Trophy, Users, Radio, ArrowRight, Shield, Flame, Sparkles } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';

export default function GlobalSearchHub() {
  const { match, teams, players, tournaments, setActiveTab } = useCricket();
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // ALL, NEARBY, TOURNAMENTS, TEAMS, PLAYERS

  const teamList = Object.values(teams);
  const playerList = Object.values(players);

  // Mock Nearby Live Matches list with distance metadata
  const nearbyMatches = [
    {
      id: "m1",
      tournament_name: "Grassroots Champions Trophy 2026",
      team_a_name: "Mumbai Strikers",
      team_b_name: "Delhi Dynamites",
      score: "142/3 (14.3 overs)",
      venue: "Central Cricket Ground, Churchgate",
      distance: "1.2 km away",
      status: "LIVE"
    },
    {
      id: "m2",
      tournament_name: "Corporate Super League 2026",
      team_a_name: "Bangalore Blasters",
      team_b_name: "Chennai Super Kings",
      score: "178/6 (19.1 overs)",
      venue: "Gymkhana Cricket Turf, Bandra",
      distance: "3.5 km away",
      status: "LIVE"
    },
    {
      id: "m3",
      tournament_name: "Suburban T20 Cup",
      team_a_name: "Pune Warriors",
      team_b_name: "Nagpur Titans",
      score: "92/2 (9.4 overs)",
      venue: "Shivaji Park Ground, Dadar",
      distance: "4.8 km away",
      status: "LIVE"
    }
  ];

  const filteredNearby = nearbyMatches.filter(m =>
    m.tournament_name.toLowerCase().includes(query.toLowerCase()) ||
    m.team_a_name.toLowerCase().includes(query.toLowerCase()) ||
    m.team_b_name.toLowerCase().includes(query.toLowerCase()) ||
    m.venue.toLowerCase().includes(query.toLowerCase())
  );

  const filteredTournaments = (tournaments || []).filter(t =>
    t.name.toLowerCase().includes(query.toLowerCase()) ||
    t.location.toLowerCase().includes(query.toLowerCase())
  );

  const filteredTeams = teamList.filter(t =>
    t.name.toLowerCase().includes(query.toLowerCase()) ||
    t.short_name.toLowerCase().includes(query.toLowerCase())
  );

  const filteredPlayers = playerList.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.role.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
      
      {/* Header Search Box */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4 shadow-2xl">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#00D26A] to-[#00FF95] text-black flex items-center justify-center font-bold shadow-lg shadow-[#00D26A]/20">
            <Search className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-2xl font-heading font-black text-white">Grassroots Discovery &amp; Nearby Matches</h2>
            <p className="text-xs text-slate-400">Search tournaments, teams, players, and discover nearby live scorecards</p>
          </div>
        </div>

        {/* Global Input Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-500 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search by tournament name, team, player, or nearby location..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-[#00D26A]"
          />
        </div>

        {/* Filter Type Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pt-1">
          {[
            { id: 'ALL', label: '⚡ All Results' },
            { id: 'NEARBY', label: '📍 Nearby Live Matches' },
            { id: 'TOURNAMENTS', label: '🏆 Tournaments' },
            { id: 'TEAMS', label: '🛡️ Teams' },
            { id: 'PLAYERS', label: '👤 Players' }
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilterType(btn.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                filterType === btn.id
                  ? 'bg-[#00D26A] text-black shadow-md shadow-[#00D26A]/20'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* 📍 Nearby Live Matches Section */}
      {(filterType === 'ALL' || filterType === 'NEARBY') && (
        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <span className="text-red-500 animate-pulse text-lg">📍</span>
              <h3 className="font-heading font-extrabold text-white text-lg">Nearby Live Matches &amp; Scorecards</h3>
            </div>
            <span className="text-xs font-semibold text-[#00D26A]">{filteredNearby.length} Matches Found</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredNearby.map((m) => (
              <div key={m.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span> LIVE
                  </span>
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {m.distance}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400">{m.tournament_name}</h4>
                  <h3 className="text-sm font-heading font-black text-white mt-0.5">{m.team_a_name} vs {m.team_b_name}</h3>
                  <p className="text-xs font-extrabold text-[#00D26A] mt-1">{m.score}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                  <span className="text-[11px] text-slate-400 font-medium truncate max-w-[200px]">{m.venue}</span>
                  <button
                    onClick={() => setActiveTab('match_center')}
                    className="px-3 py-1 rounded-lg bg-[#00D26A]/20 text-[#00D26A] hover:bg-[#00D26A]/30 text-[11px] font-bold transition flex items-center space-x-1"
                  >
                    <span>View Live</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🏆 Tournaments Search Results */}
      {(filterType === 'ALL' || filterType === 'TOURNAMENTS') && (
        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h3 className="font-heading font-extrabold text-white text-lg">Tournaments</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTournaments.map((t) => (
              <div key={t.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-heading font-bold text-white">{t.name}</h4>
                  <p className="text-xs text-slate-400 font-medium">Format: {t.format} • {t.location}</p>
                </div>
                <button
                  onClick={() => setActiveTab('tournaments')}
                  className="px-3 py-1.5 rounded-xl bg-amber-400/20 text-amber-300 text-xs font-bold hover:bg-amber-400/30 transition"
                >
                  Explore
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🛡️ Teams & 👤 Players Results */}
      {(filterType === 'ALL' || filterType === 'TEAMS' || filterType === 'PLAYERS') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(filterType === 'ALL' || filterType === 'TEAMS') && (
            <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                <Shield className="w-5 h-5 text-[#00D26A]" />
                <h3 className="font-heading font-extrabold text-white text-lg">Teams</h3>
              </div>
              {filteredTeams.map((tm) => (
                <div key={tm.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-xl">{tm.logo}</span>
                    <div>
                      <h4 className="text-xs font-bold text-white">{tm.name}</h4>
                      <p className="text-[10px] text-slate-400">Code: {tm.short_name}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {(filterType === 'ALL' || filterType === 'PLAYERS') && (
            <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                <Users className="w-5 h-5 text-indigo-400" />
                <h3 className="font-heading font-extrabold text-white text-lg">Players</h3>
              </div>
              {filteredPlayers.map((p) => (
                <div key={p.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <img src={p.avatar} alt={p.name} className="w-8 h-8 rounded-full object-cover border border-slate-700" />
                    <div>
                      <h4 className="text-xs font-bold text-white">{p.name}</h4>
                      <p className="text-[10px] text-slate-400">{p.role} • {p.runs} Runs</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}

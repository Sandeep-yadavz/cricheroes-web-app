import React, { useState, useEffect } from 'react';
import { Search, MapPin, Trophy, Users, Radio, ArrowRight, Shield, Flame, Inbox } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';
import { apiClient } from '../../api/apiClient';

export default function GlobalSearchHub() {
  const { teams, players, tournaments, setActiveTab } = useCricket();
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // ALL, NEARBY, TOURNAMENTS, TEAMS, PLAYERS
  const [searchResults, setSearchResults] = useState(null);

  const teamList = Object.values(teams || {});
  const playerList = Object.values(players || {});

  // Fetch search query from backend API database or fallback to safe filtering
  useEffect(() => {
    async function fetchSearch() {
      try {
        const res = await apiClient.get(`/api/search?q=${encodeURIComponent(query)}`);
        if (res && res.matches) {
          setSearchResults(res);
          return;
        }
      } catch (err) {}
    }

    const timer = setTimeout(fetchSearch, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Safe waterproof string matcher (never throws TypeError!)
  const safeMatches = (str, q) => {
    if (!str || typeof str !== 'string') return false;
    return str.toLowerCase().includes((q || '').toLowerCase().trim());
  };

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
    }
  ];

  const filteredNearby = (searchResults?.matches || nearbyMatches).filter(m =>
    !query || safeMatches(m.tournament_name, query) || safeMatches(m.team_a_name, query) || safeMatches(m.team_b_name, query) || safeMatches(m.venue, query)
  );

  const filteredTournaments = (searchResults?.tournaments || tournaments || []).filter(t =>
    !query || safeMatches(t.name, query) || safeMatches(t.location, query) || safeMatches(t.format, query)
  );

  const filteredTeams = (searchResults?.teams || teamList).filter(t =>
    !query || safeMatches(t.name, query) || safeMatches(t.short_name, query)
  );

  const filteredPlayers = (searchResults?.players || playerList).filter(p =>
    !query || safeMatches(p.name, query) || safeMatches(p.role, query)
  );

  const hasAnyResults = filteredNearby.length > 0 || filteredTournaments.length > 0 || filteredTeams.length > 0 || filteredPlayers.length > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
      
      {/* Header Search Box */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4 shadow-2xl">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#00D26A] to-[#00FF95] text-black flex items-center justify-center font-bold shadow-lg shadow-[#00D26A]/20">
            <Search className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-2xl font-heading font-black text-white">Database Search &amp; Nearby Matches</h2>
            <p className="text-xs text-slate-400">Search backend tournaments, teams, players, and nearby live scorecards</p>
          </div>
        </div>

        {/* Global Input Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-500 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Type to search tournaments, teams, players, or nearby venues..."
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

      {/* Empty State Banner if no search matches found */}
      {!hasAnyResults && (
        <div className="glass-card rounded-3xl p-10 border border-slate-800 text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
            <Inbox className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-heading font-bold text-white">No Matching Results Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No tournaments, teams, or live matches match your query "<strong className="text-slate-200">{query}</strong>". Try searching for "Mumbai", "Champions", or "Rohit".
          </p>
        </div>
      )}

      {/* 📍 Nearby Live Matches Section */}
      {hasAnyResults && (filterType === 'ALL' || filterType === 'NEARBY') && filteredNearby.length > 0 && (
        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <span className="text-red-500 animate-pulse text-lg">📍</span>
              <h3 className="font-heading font-extrabold text-white text-lg">Nearby Live Matches &amp; Scorecards</h3>
            </div>
            <span className="text-xs font-semibold text-[#00D26A]">{filteredNearby.length} Matches</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredNearby.map((m) => (
              <div key={m.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span> LIVE
                  </span>
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {m.distance || '1.2 km away'}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400">{m.tournament_name || 'Tournament Match'}</h4>
                  <h3 className="text-sm font-heading font-black text-white mt-0.5">{m.team_a_name || 'Mumbai Strikers'} vs {m.team_b_name || 'Delhi Dynamites'}</h3>
                  <p className="text-xs font-extrabold text-[#00D26A] mt-1">{m.score || '142/3 (14.3 overs)'}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                  <span className="text-[11px] text-slate-400 font-medium truncate max-w-[200px]">{m.venue || 'Cricket Ground'}</span>
                  <button
                    onClick={() => setActiveTab('match_center')}
                    className="px-3 py-1 rounded-lg bg-[#00D26A]/20 text-[#00D26A] hover:bg-[#00D26A]/30 text-[11px] font-bold transition flex items-center space-x-1"
                  >
                    <span>View Scorecard</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🏆 Tournaments Search Results */}
      {hasAnyResults && (filterType === 'ALL' || filterType === 'TOURNAMENTS') && filteredTournaments.length > 0 && (
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
                  <p className="text-xs text-slate-400 font-medium">Format: {t.format || 'T20'} • {t.location || 'Mumbai'}</p>
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
      {hasAnyResults && (filterType === 'ALL' || filterType === 'TEAMS' || filterType === 'PLAYERS') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(filterType === 'ALL' || filterType === 'TEAMS') && filteredTeams.length > 0 && (
            <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                <Shield className="w-5 h-5 text-[#00D26A]" />
                <h3 className="font-heading font-extrabold text-white text-lg">Teams</h3>
              </div>
              {filteredTeams.map((tm) => (
                <div key={tm.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-xl">{tm.logo || '🏏'}</span>
                    <div>
                      <h4 className="text-xs font-bold text-white">{tm.name}</h4>
                      <p className="text-[10px] text-slate-400">Code: {tm.short_name || 'TM'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {(filterType === 'ALL' || filterType === 'PLAYERS') && filteredPlayers.length > 0 && (
            <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                <Users className="w-5 h-5 text-indigo-400" />
                <h3 className="font-heading font-extrabold text-white text-lg">Players</h3>
              </div>
              {filteredPlayers.map((p) => (
                <div key={p.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <img src={p.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"} alt={p.name} className="w-8 h-8 rounded-full object-cover border border-slate-700" />
                    <div>
                      <h4 className="text-xs font-bold text-white">{p.name}</h4>
                      <p className="text-[10px] text-slate-400">{p.role || 'Player'} • {p.runs || 0} Runs</p>
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

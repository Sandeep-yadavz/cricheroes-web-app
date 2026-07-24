import React, { createContext, useContext, useState, useEffect } from 'react';
import { playMatchSound } from '../utils/audioSynth';
import { commentaryVoice } from '../utils/speechSynth';
import { apiClient } from '../api/apiClient';

const CricketContext = createContext();

const INITIAL_FIELDERS = [
  { id: 'f1', name: 'Wicket Keeper', zone: 'Keeper', x: 200, y: 310, isFixed: true },
  { id: 'f2', name: '1st Slip', zone: 'Slips', x: 225, y: 315, isFixed: false },
  { id: 'f3', name: 'Point', zone: 'Point', x: 280, y: 200, isFixed: false },
  { id: 'f4', name: 'Cover', zone: 'Cover', x: 260, y: 150, isFixed: false },
  { id: 'f5', name: 'Mid Off', zone: 'Mid Off', x: 220, y: 130, isFixed: false },
  { id: 'f6', name: 'Mid On', zone: 'Mid On', x: 180, y: 130, isFixed: false },
  { id: 'f7', name: 'Mid Wicket', zone: 'Mid Wicket', x: 140, y: 160, isFixed: false },
  { id: 'f8', name: 'Square Leg', zone: 'Square Leg', x: 120, y: 200, isFixed: false },
  { id: 'f9', name: 'Fine Leg', zone: 'Fine Leg', x: 140, y: 280, isFixed: false },
  { id: 'f10', name: 'Third Man', zone: 'Third Man', x: 290, y: 290, isFixed: false },
  { id: 'f11', name: 'Bowler', zone: 'Bowler', x: 200, y: 145, isFixed: true }
];

const INITIAL_TEAMS = {
  t1: { id: "t1", name: "Mumbai Strikers", short_name: "MUM", logo: "🔥", color: "#0066FF" },
  t2: { id: "t2", name: "Delhi Dynamites", short_name: "DEL", logo: "⚡", color: "#FF3366" },
  t3: { id: "t3", name: "Bangalore Blasters", short_name: "BLR", logo: "💥", color: "#00D26A" },
  t4: { id: "t4", name: "Chennai Super Kings", short_name: "CHE", logo: "🦁", color: "#FFCC00" }
};

const INITIAL_PLAYERS = {
  p1: { id: "p1", name: "Rohit Varma", team_id: "t1", role: "Batter", runs: 842, wickets: 4, highest_score: 112, sr: 145.2, avg: 42.1, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" },
  p2: { id: "p2", name: "Virat Saxena", team_id: "t1", role: "Batter", runs: 1150, wickets: 8, highest_score: 128, sr: 138.5, avg: 52.2, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" },
  p4: { id: "p4", name: "Hardik Patel", team_id: "t1", role: "All-Rounder", runs: 620, wickets: 32, highest_score: 78, sr: 162.4, avg: 31.0, avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80" },
  p5: { id: "p5", name: "Rishabh Singh", team_id: "t1", role: "Wicket-Keeper Batter", runs: 790, wickets: 0, highest_score: 95, sr: 154.8, avg: 37.6, avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80" }
};

const INITIAL_TOURNAMENTS = [
  {
    id: "tour1",
    name: "Grassroots Champions Trophy 2026",
    admin_id: "u2",
    admin_name: "Amit Sharma",
    format: "T20",
    ball_type: "Leather",
    overs_limit: 20,
    location: "Central Cricket Ground, Mumbai",
    status: "Ongoing"
  }
];

const INITIAL_MATCH = {
  id: "m1",
  tournament_id: "tour1",
  tournament_name: "Grassroots Champions Trophy 2026",
  team_a: "t1",
  team_b: "t2",
  overs_limit: 20,
  status: "LIVE",
  toss_winner: "t1",
  toss_decision: "bat",
  current_innings: 1,
  assigned_scorer_id: "u1",
  assigned_scorer_name: "Rohit Varma",
  fielding_positions: INITIAL_FIELDERS,
  innings_1: {
    batting_team_id: "t1",
    bowling_team_id: "t2",
    runs: 142,
    wickets: 3,
    overs: 14.3,
    extras: { wides: 6, noballs: 2, byes: 1, legbyes: 3 },
    striker_id: "p1",
    non_striker_id: "p2",
    current_bowler_id: "p8",
    batting_stats: [
      { player_id: "p1", name: "Rohit Varma", runs: 68, balls: 42, fours: 7, sixes: 3, sr: 161.9, out: false, dismissal: "Not Out" },
      { player_id: "p2", name: "Virat Saxena", runs: 45, balls: 31, fours: 5, sixes: 1, sr: 145.2, out: false, dismissal: "Not Out" }
    ],
    bowling_stats: [
      { player_id: "p8", name: "Rashid Khan", overs: 3.3, maidens: 0, runs: 28, wickets: 2, economy: 8.0 }
    ]
  },
  innings_2: {
    batting_team_id: "t2",
    bowling_team_id: "t1",
    runs: 0,
    wickets: 0,
    overs: 0.0,
    extras: { wides: 0, noballs: 0, byes: 0, legbyes: 0 },
    striker_id: "p5",
    non_striker_id: "p7",
    current_bowler_id: "p3",
    batting_stats: [],
    bowling_stats: []
  },
  ball_history: [],
  wagon_wheel: []
};

export function CricketProvider({ children }) {
  const [activeTab, setActiveTab] = useState('match_center');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [match, setMatch] = useState(INITIAL_MATCH);
  const [teams, setTeams] = useState(INITIAL_TEAMS);
  const [players, setPlayers] = useState(INITIAL_PLAYERS);
  const [tournaments, setTournaments] = useState(INITIAL_TOURNAMENTS);
  const [celebrationType, setCelebrationType] = useState(null);

  const [currentUser, setCurrentUser] = useState({
    id: "u1",
    name: "Rohit Varma",
    email: "scorer@gmail.com",
    phone_number: "+91 9876543210",
    age: 26,
    token: "token_scorer_secret_123"
  });

  const [isWicketModalOpen, setIsWicketModalOpen] = useState(false);
  const [isWinnerModalOpen, setIsWinnerModalOpen] = useState(false);

  const handleUpdateFieldingPositions = (newFielders) => {
    setMatch((prev) => ({
      ...prev,
      fielding_positions: newFielders
    }));
    apiClient.post(`/api/matches/${match.id}/update-fielding`, {
      fielding_positions: newFielders
    }).catch(() => {});
  };

  const handleScoreBall = async ({ runs = 0, extra_type = null, is_wicket = false, wicket_type = null, fielder_name = null, out_batter = "striker", new_batter_id = "p4", shot_zone = "Cover" }) => {
    if (is_wicket) {
      setCelebrationType('wicket');
      if (soundEnabled) playMatchSound('wicket');
    } else if (runs === 6) {
      setCelebrationType('six');
      if (soundEnabled) playMatchSound('six');
    } else if (runs === 4) {
      setCelebrationType('four');
      if (soundEnabled) playMatchSound('four');
    } else if (soundEnabled) {
      playMatchSound('dot');
    }

    try {
      const res = await apiClient.post(`/api/matches/${match.id}/score-ball`, {
        runs,
        extra_type,
        is_wicket,
        wicket_type,
        fielder_name,
        out_batter,
        new_batter_id,
        shot_zone
      });

      if (res && res.match) {
        setMatch(res.match);
        return;
      }
    } catch (e) {}

    // Fallback local update
    setMatch((prevMatch) => {
      const newMatch = JSON.parse(JSON.stringify(prevMatch));
      const currKey = `innings_${newMatch.current_innings}`;
      const inn = newMatch[currKey];

      let addedRuns = runs;
      let isLegal = true;

      if (extra_type === 'wide' || extra_type === 'noball') {
        isLegal = false;
        addedRuns += 1;
        inn.extras[`${extra_type}s`] += 1;
      } else if (extra_type === 'bye' || extra_type === 'legbye') {
        inn.extras[`${extra_type}s`] += runs;
      }

      inn.runs += addedRuns;

      let completedOvers = Math.floor(inn.overs);
      let balls = Math.round((inn.overs - completedOvers) * 10);

      if (isLegal) {
        balls += 1;
        if (balls === 6) {
          completedOvers += 1;
          balls = 0;
        }
      }

      inn.overs = parseFloat(`${completedOvers}.${balls}`);
      if (is_wicket) {
        inn.wickets += 1;
        const newB = players[new_batter_id] || { name: "Hardik Patel" };

        // Mark dismissed batter as out
        const dismissedId = out_batter === 'striker' ? inn.striker_id : inn.non_striker_id;
        const dismissedStat = inn.batting_stats.find(b => b.player_id === dismissedId);
        if (dismissedStat) {
          dismissedStat.out = true;
          dismissedStat.dismissal = wicket_type === 'Run Out' ? `run out (${fielder_name || 'Rashid'})` : `b Bowler`;
        }

        // Switch to new batsman
        if (out_batter === 'striker') {
          inn.striker_id = new_batter_id;
        } else {
          inn.non_striker_id = new_batter_id;
        }

        inn.batting_stats.push({
          player_id: new_batter_id,
          name: newB.name,
          runs: 0,
          balls: 0,
          fours: 0,
          sixes: 0,
          sr: 0.0,
          out: false,
          dismissal: "Not Out"
        });
      }

      return newMatch;
    });
  };

  const handleUndoBall = async () => {
    try {
      const res = await apiClient.post(`/api/matches/${match.id}/undo-ball`);
      if (res && res.match) {
        setMatch(res.match);
        return;
      }
    } catch (e) {}
  };

  const handleLogin = async (email, password) => {
    try {
      const res = await apiClient.post('/api/auth/login', { email, password });
      if (res && res.user) {
        setCurrentUser(res.user);
        apiClient.setToken(res.token);
        return res.user;
      }
    } catch (e) {}
    const fakeUser = { id: "u1", name: "Rohit Varma", email, phone_number: "+91 9876543210", age: 26 };
    setCurrentUser(fakeUser);
    return fakeUser;
  };

  const handleRegister = async ({ name, email, phone_number, age, password }) => {
    try {
      const res = await apiClient.post('/api/auth/register', { name, email, phone_number, age: parseInt(age), password });
      if (res && res.user) {
        setCurrentUser(res.user);
        apiClient.setToken(res.token);
        return res.user;
      }
    } catch (e) {}
    const newU = { id: `u_${Date.now()}`, name, email, phone_number, age: parseInt(age) };
    setCurrentUser(newU);
    return newU;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    apiClient.clearToken();
  };

  return (
    <CricketContext.Provider
      value={{
        activeTab,
        setActiveTab,
        soundEnabled,
        setSoundEnabled,
        match,
        setMatch,
        handleUpdateFieldingPositions,
        teams,
        setTeams,
        players,
        setPlayers,
        tournaments,
        setTournaments,
        currentUser,
        celebrationType,
        setCelebrationType,
        handleLogin,
        handleRegister,
        handleLogout,
        handleScoreBall,
        handleUndoBall,
        isWicketModalOpen,
        setIsWicketModalOpen,
        isWinnerModalOpen,
        setIsWinnerModalOpen
      }}
    >
      {children}
    </CricketContext.Provider>
  );
}

export function useCricket() {
  return useContext(CricketContext);
}

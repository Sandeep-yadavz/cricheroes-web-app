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

const INITIAL_BALL_HISTORY = [
  {
    id: "b1",
    over: "14.3",
    runs: 4,
    extra_type: null,
    is_wicket: false,
    striker_name: "Rohit Varma",
    bowler_name: "Rashid Khan",
    shot_zone: "Cover",
    description: "14.3 Rashid Khan to Rohit Varma, FOUR RUNS! Beautifully driven along the ground to Cover!"
  },
  {
    id: "b2",
    over: "14.2",
    runs: 1,
    extra_type: "noball",
    is_wicket: false,
    striker_name: "Rohit Varma",
    bowler_name: "Rashid Khan",
    shot_zone: "Mid Off",
    description: "14.2 Rashid Khan to Rohit Varma, NO BALL + 1 RUN! Smashed firmly towards Mid Off! Free Hit coming up!"
  }
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
  p5: { id: "p5", name: "Rishabh Singh", team_id: "t1", role: "Wicket-Keeper Batter", runs: 790, wickets: 0, highest_score: 95, sr: 154.8, avg: 37.6, avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80" },
  p8: { id: "p8", name: "Rashid Khan", team_id: "t2", role: "Bowler", runs: 310, wickets: 52, highest_score: 42, sr: 160.0, avg: 18.2, avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80" }
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
  ball_history: INITIAL_BALL_HISTORY,
  wagon_wheel: []
};

const normalizeTeams = (rawTeams) => {
  if (!rawTeams) return {};
  if (Array.isArray(rawTeams)) {
    return rawTeams.reduce((acc, t) => {
      if (t && t.id) acc[t.id] = t;
      return acc;
    }, {});
  }
  return rawTeams;
};

export function CricketProvider({ children }) {
  const [activeTab, setActiveTab] = useState('match_center');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [match, setMatch] = useState(INITIAL_MATCH);
  const [teams, setTeamsState] = useState(INITIAL_TEAMS);
  const [players, setPlayers] = useState(INITIAL_PLAYERS);
  const [tournaments, setTournaments] = useState(INITIAL_TOURNAMENTS);
  const [celebrationType, setCelebrationType] = useState(null);

  const setTeams = (newTeams) => {
    setTeamsState(normalizeTeams(newTeams));
  };

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

  useEffect(() => {
    async function loadData() {
      try {
        const matchRes = await apiClient.get('/api/matches/m1');
        if (matchRes && matchRes.match) {
          setMatch(matchRes.match);
          if (matchRes.teams) setTeamsState(normalizeTeams(matchRes.teams));
          if (matchRes.players) setPlayers(matchRes.players);
        }
      } catch (err) {}
    }
    loadData();
  }, []);

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
    try {
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
    } catch (e) {}

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

      if (res && res.match && res.match.id) {
        setMatch(res.match);

        if (soundEnabled && res.match.ball_history && res.match.ball_history.length > 0) {
          const latestBall = res.match.ball_history[0];
          commentaryVoice(latestBall.description || `${latestBall.over} ${latestBall.striker_name} scores ${latestBall.runs} runs.`);
        }
        return;
      }
    } catch (e) {}

    setMatch((prevMatch) => {
      try {
        const newMatch = JSON.parse(JSON.stringify(prevMatch || INITIAL_MATCH));
        const cInnings = newMatch.current_innings || 1;
        const currKey = `innings_${cInnings}`;
        
        if (!newMatch[currKey]) {
          newMatch[currKey] = {
            batting_team_id: "t1", bowling_team_id: "t2", runs: 0, wickets: 0, overs: 0.0,
            extras: { wides: 0, noballs: 0, byes: 0, legbyes: 0 },
            striker_id: "p1", non_striker_id: "p2", current_bowler_id: "p8",
            batting_stats: [], bowling_stats: []
          };
        }

        const inn = newMatch[currKey];
        if (!inn.extras) inn.extras = { wides: 0, noballs: 0, byes: 0, legbyes: 0 };
        if (!inn.batting_stats) inn.batting_stats = [];

        let addedRuns = runs;
        let isLegal = true;

        if (extra_type === 'wide') {
          isLegal = false;
          addedRuns = 1 + runs;
          inn.extras.wides = (inn.extras.wides || 0) + 1;
        } else if (extra_type === 'noball') {
          isLegal = false;
          addedRuns = 1 + runs;
          inn.extras.noballs = (inn.extras.noballs || 0) + 1;
        } else if (extra_type === 'bye') {
          inn.extras.byes = (inn.extras.byes || 0) + runs;
        } else if (extra_type === 'legbye') {
          inn.extras.legbyes = (inn.extras.legbyes || 0) + runs;
        }

        inn.runs = (inn.runs || 0) + addedRuns;

        let completedOvers = Math.floor(inn.overs || 0);
        let balls = Math.round(((inn.overs || 0) - completedOvers) * 10);

        if (isLegal) {
          balls += 1;
          if (balls === 6) {
            completedOvers += 1;
            balls = 0;
          }
        }

        const overStr = `${completedOvers}.${balls}`;
        inn.overs = parseFloat(overStr);

        const strikerObj = players[inn.striker_id] || { name: "Rohit Varma" };
        const bowlerObj = players[inn.current_bowler_id] || { name: "Rashid Khan" };

        let descText = "";
        if (is_wicket) {
          inn.wickets = (inn.wickets || 0) + 1;
          const newB = players[new_batter_id] || { name: "Hardik Patel" };
          descText = `${overStr} ${bowlerObj.name} to ${strikerObj.name}, OUT (${wicket_type || 'Bowled'})! Big wicket falls at ${shot_zone}! New batter ${newB.name} enters!`;
        } else if (runs === 6) {
          descText = `${overStr} ${bowlerObj.name} to ${strikerObj.name}, SIX RUNS! Massive hit over ${shot_zone}!`;
        } else if (runs === 4) {
          descText = `${overStr} ${bowlerObj.name} to ${strikerObj.name}, FOUR RUNS! Driven nicely to ${shot_zone}!`;
        } else {
          descText = `${overStr} ${bowlerObj.name} to ${strikerObj.name}, ${runs} run(s) towards ${shot_zone}.`;
        }

        const newBall = {
          id: `b_${Date.now()}`,
          over: overStr,
          runs: addedRuns,
          extra_type,
          is_wicket,
          striker_name: strikerObj.name,
          bowler_name: bowlerObj.name,
          shot_zone: shot_zone,
          description: descText
        };

        if (!newMatch.ball_history) newMatch.ball_history = [];
        newMatch.ball_history.unshift(newBall);

        if (soundEnabled) commentaryVoice(descText);

        return newMatch;
      } catch (err) {
        return prevMatch;
      }
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

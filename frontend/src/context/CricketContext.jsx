import React, { createContext, useContext, useState, useEffect } from 'react';
import { playMatchSound } from '../utils/audioSynth';
import { commentaryVoice } from '../utils/speechSynth';
import { apiClient } from '../api/apiClient';

const CricketContext = createContext();

const INITIAL_TEAMS = {
  t1: { id: "t1", name: "Mumbai Strikers", short_name: "MUM", logo: "🔥", color: "#0066FF" },
  t2: { id: "t2", name: "Delhi Dynamites", short_name: "DEL", logo: "⚡", color: "#FF3366" },
  t3: { id: "t3", name: "Bangalore Blasters", short_name: "BLR", logo: "💥", color: "#00D26A" },
  t4: { id: "t4", name: "Chennai Super Kings", short_name: "CHE", logo: "🦁", color: "#FFCC00" }
};

const INITIAL_PLAYERS = {
  p1: { id: "p1", name: "Rohit Varma", team_id: "t1", role: "Batter", runs: 842, wickets: 4, highest_score: 112, sr: 145.2, avg: 42.1, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" },
  p2: { id: "p2", name: "Virat Saxena", team_id: "t1", role: "Batter", runs: 1150, wickets: 8, highest_score: 128, sr: 138.5, avg: 52.2, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" },
  p3: { id: "p3", name: "Jasprit Kumar", team_id: "t1", role: "Bowler", runs: 140, wickets: 45, highest_score: 34, sr: 110.0, avg: 14.0, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80" },
  p4: { id: "p4", name: "Hardik Patel", team_id: "t1", role: "All-Rounder", runs: 620, wickets: 32, highest_score: 78, sr: 162.4, avg: 31.0, avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80" },
  p5: { id: "p5", name: "Rishabh Singh", team_id: "t2", role: "Wicket-Keeper Batter", runs: 790, wickets: 0, highest_score: 95, sr: 154.8, avg: 37.6, avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80" },
  p6: { id: "p6", name: "Ravindra Jadeja", team_id: "t2", role: "All-Rounder", runs: 580, wickets: 38, highest_score: 64, sr: 135.0, avg: 29.0, avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80" },
  p7: { id: "p7", name: "KL Rahul", team_id: "t2", role: "Batter", runs: 890, wickets: 0, highest_score: 104, sr: 141.0, avg: 44.5, avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80" },
  p8: { id: "p8", name: "Rashid Khan", team_id: "t2", role: "Bowler", runs: 310, wickets: 52, highest_score: 42, sr: 160.0, avg: 18.2, avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80" }
};

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
      { player_id: "p2", name: "Virat Saxena", runs: 45, balls: 31, fours: 5, sixes: 1, sr: 145.2, out: false, dismissal: "Not Out" },
      { player_id: "p4", name: "Hardik Patel", runs: 18, balls: 11, fours: 2, sixes: 1, sr: 163.6, out: true, dismissal: "c Rishabh b Rashid" }
    ],
    bowling_stats: [
      { player_id: "p8", name: "Rashid Khan", overs: 3.3, maidens: 0, runs: 28, wickets: 2, economy: 8.0 },
      { player_id: "p6", name: "Ravindra Jadeja", overs: 4.0, maidens: 0, runs: 32, wickets: 1, economy: 8.0 }
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
  ball_history: [
    { ball: 14.3, over: 14, ball_num: 3, runs: 6, type: "RUNS", bowler_id: "p8", striker_id: "p1", commentary: "14.3 - Rashid Khan to Rohit Varma, SIX! Stand and deliver! Crinkled over long-on for a monster maximum!" },
    { ball: 14.2, over: 14, ball_num: 2, runs: 4, type: "RUNS", bowler_id: "p8", striker_id: "p1", commentary: "14.2 - Rashid Khan to Rohit Varma, FOUR! Glorious cover drive finding the boundary gap precisely!" },
    { ball: 14.1, over: 14, ball_num: 1, runs: 1, type: "RUNS", bowler_id: "p8", striker_id: "p2", commentary: "14.1 - Rashid Khan to Virat Saxena, 1 run, pushed down to mid-off for a quick single." }
  ],
  wagon_wheel: [
    { x: 120, y: 80, runs: 6, shot_type: "Long On" },
    { x: 220, y: 90, runs: 4, shot_type: "Cover" },
    { x: 160, y: 190, runs: 1, shot_type: "Mid Off" }
  ]
};

export function CricketProvider({ children }) {
  const [activeTab, setActiveTab] = useState('match_center'); // match_center, scorer, tournaments, fantasy, players, nrr, login
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [match, setMatch] = useState(INITIAL_MATCH);
  const [teams, setTeams] = useState(INITIAL_TEAMS);
  const [players, setPlayers] = useState(INITIAL_PLAYERS);
  const [currentUser, setCurrentUser] = useState({
    id: "u1",
    name: "Official Scorer Rohit",
    email: "scorer@cricheroes.in",
    role: "SCORER",
    token: "token_scorer_secret_123"
  });

  const [isWicketModalOpen, setIsWicketModalOpen] = useState(false);
  const [isWinnerModalOpen, setIsWinnerModalOpen] = useState(false);

  // Sync with Backend FastAPI on load
  useEffect(() => {
    async function loadData() {
      try {
        const matchRes = await apiClient.get('/api/matches/m1');
        if (matchRes && matchRes.match) {
          setMatch(matchRes.match);
          if (matchRes.teams) setTeams(matchRes.teams);
          if (matchRes.players) setPlayers(matchRes.players);
        }
      } catch (err) {
        console.log("Using initial state fallback");
      }
    }
    loadData();
  }, []);

  const handleScoreBall = async ({ runs = 0, extra_type = null, is_wicket = false, wicket_type = null, fielder_name = null, shot_zone = "Cover" }) => {
    if (soundEnabled) {
      if (is_wicket) playMatchSound('wicket');
      else if (runs === 6) playMatchSound('six');
      else if (runs === 4) playMatchSound('four');
      else playMatchSound('dot');
    }

    try {
      const res = await apiClient.post(`/api/matches/${match.id}/score-ball`, {
        runs,
        extra_type,
        is_wicket,
        wicket_type,
        fielder_name,
        shot_zone
      });

      if (res && res.match) {
        setMatch(res.match);
        if (res.latest_commentary && soundEnabled) {
          commentaryVoice.speak(res.latest_commentary);
        }
        return;
      }
    } catch (e) {
      console.log("Backend offline or error, updating local state fallback");
    }

    // Local state fallback calculation
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
      }

      const strikerId = inn.striker_id;
      let strikerStat = inn.batting_stats.find(b => b.player_id === strikerId);
      if (!strikerStat) {
        const pInfo = players[strikerId] || { name: "Batter" };
        strikerStat = { player_id: strikerId, name: pInfo.name, runs: 0, balls: 0, fours: 0, sixes: 0, sr: 0, out: false, dismissal: "Not Out" };
        inn.batting_stats.push(strikerStat);
      }

      if (extra_type !== 'wide') {
        strikerStat.balls += 1;
        if (extra_type !== 'bye' && extra_type !== 'legbye') {
          strikerStat.runs += runs;
          if (runs === 4) strikerStat.fours += 1;
          if (runs === 6) strikerStat.sixes += 1;
        }
      }

      if (strikerStat.balls > 0) {
        strikerStat.sr = parseFloat(((strikerStat.runs / strikerStat.balls) * 100).toFixed(1));
      }

      if (is_wicket) {
        strikerStat.out = true;
        strikerStat.dismissal = `${wicket_type || 'Out'} b Bowler`;
      }

      const commText = is_wicket
        ? `${inn.overs} - WICKET! ${strikerStat.name} is out (${wicket_type || 'Dismissed'})!`
        : `${inn.overs} - ${strikerStat.name} scores ${runs} run(s) towards ${shot_zone}.`;

      if (soundEnabled) {
        commentaryVoice.speak(commText);
      }

      newMatch.ball_history.unshift({
        ball: inn.overs,
        over: completedOvers,
        ball_num: balls,
        runs: addedRuns,
        type: is_wicket ? 'WICKET' : (runs === 4 ? 'FOUR' : (runs === 6 ? 'SIX' : 'RUNS')),
        commentary: commText
      });

      if (isLegal && runs % 2 === 1) {
        const temp = inn.striker_id;
        inn.striker_id = inn.non_striker_id;
        inn.non_striker_id = temp;
      }

      if (isLegal && balls === 0 && (completedOvers > 0)) {
        const temp = inn.striker_id;
        inn.striker_id = inn.non_striker_id;
        inn.non_striker_id = temp;
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
    } catch (e) {
      console.log("Backend undo fallback");
    }

    setMatch((prevMatch) => {
      const newMatch = JSON.parse(JSON.stringify(prevMatch));
      if (!newMatch.ball_history || newMatch.ball_history.length === 0) return prevMatch;

      const lastBall = newMatch.ball_history.shift();
      const currKey = `innings_${newMatch.current_innings}`;
      const inn = newMatch[currKey];

      inn.runs = Math.max(0, inn.runs - lastBall.runs);
      if (lastBall.type === 'WICKET') {
        inn.wickets = Math.max(0, inn.wickets - 1);
      }

      return newMatch;
    });
  };

  const handleCreateMatchState = (newMatch) => {
    setMatch(newMatch);
    apiClient.post('/api/matches', newMatch).catch(() => {});
  };

  const handleLogin = async (email, password) => {
    try {
      const res = await apiClient.post('/api/auth/login', { email, password });
      if (res && res.user) {
        setCurrentUser(res.user);
        apiClient.setToken(res.token);
        return res.user;
      }
    } catch (e) {
      console.log("Auth backend fallback");
    }
    const fakeUser = { id: "u_demo", name: "Official Scorer Rohit", email, role: "SCORER" };
    setCurrentUser(fakeUser);
    return fakeUser;
  };

  const handleRegister = async (name, email, password, role) => {
    try {
      const res = await apiClient.post('/api/auth/register', { name, email, password, role });
      if (res && res.user) {
        setCurrentUser(res.user);
        apiClient.setToken(res.token);
        return res.user;
      }
    } catch (e) {
      console.log("Auth backend fallback");
    }
    const newU = { id: `u_${Date.now()}`, name, email, role };
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
        setMatch: handleCreateMatchState,
        teams,
        setTeams,
        players,
        setPlayers,
        currentUser,
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

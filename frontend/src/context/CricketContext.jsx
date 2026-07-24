import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { sendScoreBall, sendUndoBall, fetchMatchDetail, loginUser, registerUser } from '../api/apiClient';
import { matchAudio } from '../utils/audioSynth';

const CricketContext = createContext();

const INITIAL_PLAYERS = {
  p1: { id: "p1", name: "Rohit Varma", team_id: "t1", role: "Batter", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80", runs: 842, wickets: 4, highest_score: 112, avg: 42.1, sr: 145.2, badges: ["Century Maker", "Pinch Hitter", "Captain Supreme"] },
  p2: { id: "p2", name: "Virat Saxena", team_id: "t1", role: "Batter", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80", runs: 1150, wickets: 8, highest_score: 128, avg: 52.2, sr: 138.5, badges: ["Run Machine", "Master Chaser", "Century Maker"] },
  p3: { id: "p3", name: "Jasprit Kumar", team_id: "t1", role: "Bowler", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80", runs: 140, wickets: 45, highest_score: 34, avg: 14.0, sr: 110.0, badges: ["Yorker King", "5-Wkt Haul", "Economy King"] },
  p4: { id: "p4", name: "Hardik Patel", team_id: "t1", role: "All-Rounder", avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80", runs: 620, wickets: 32, highest_score: 78, avg: 31.0, sr: 162.4, badges: ["Power Hitter", "All-Round Master", "Hat-Trick Hero"] },
  p5: { id: "p5", name: "Rishabh Singh", team_id: "t2", role: "Wicket-Keeper Batter", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80", runs: 790, wickets: 0, highest_score: 95, avg: 37.6, sr: 154.8, badges: ["360 Player", "Lightning Hands", "Finisher"] },
  p6: { id: "p6", name: "Ravindra Jadeja", team_id: "t2", role: "All-Rounder", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80", runs: 580, wickets: 38, highest_score: 64, avg: 29.0, sr: 135.0, badges: ["Gun Fielder", "Economy King", "Match Winner"] },
  p7: { id: "p7", name: "KL Rahul", team_id: "t2", role: "Batter", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80", runs: 890, wickets: 0, highest_score: 104, avg: 44.5, sr: 141.0, badges: ["Century Maker", "Classy Strokeplay"] },
  p8: { id: "p8", name: "Rashid Khan", team_id: "t2", role: "Bowler", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80", runs: 310, wickets: 52, highest_score: 42, avg: 18.2, sr: 160.0, badges: ["Purple Cap Leader", "Mystery Spinner", "5-Wkt Haul"] }
};

const INITIAL_TEAMS = {
  t1: { id: "t1", name: "Mumbai Strikers", short_name: "MUM", logo: "🔥", color: "#0066FF" },
  t2: { id: "t2", name: "Delhi Dynamites", short_name: "DEL", logo: "⚡", color: "#FF3366" },
  t3: { id: "t3", name: "Bangalore Blasters", short_name: "BLR", logo: "💥", color: "#00D26A" },
  t4: { id: "t4", name: "Chennai Super Kings", short_name: "CHE", logo: "🦁", color: "#FFCC00" }
};

const INITIAL_MATCH = {
  id: "m1",
  tournament_name: "Grassroots Champions Trophy 2026",
  overs_limit: 20,
  status: "LIVE",
  current_innings: 1,
  innings_1: {
    batting_team_id: "t1",
    bowling_team_id: "t2",
    runs: 146,
    wickets: 3,
    overs: 14.5,
    extras: { wides: 6, noballs: 2, byes: 1, legbyes: 3 },
    striker_id: "p1",
    non_striker_id: "p2",
    current_bowler_id: "p8",
    batting_stats: [
      { player_id: "p1", name: "Rohit Varma", runs: 72, balls: 44, fours: 7, sixes: 4, sr: 163.6, out: false, dismissal: "Not Out" },
      { player_id: "p2", name: "Virat Saxena", runs: 45, balls: 31, fours: 5, sixes: 1, sr: 145.2, out: false, dismissal: "Not Out" },
      { player_id: "p4", name: "Hardik Patel", runs: 18, balls: 11, fours: 2, sixes: 1, sr: 163.6, out: true, dismissal: "c Rishabh b Rashid" }
    ],
    bowling_stats: [
      { player_id: "p8", name: "Rashid Khan", overs: 3.5, maidens: 0, runs: 32, wickets: 2, economy: 8.3 },
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
    { ball: 14.5, over: 14, ball_num: 5, runs: 4, type: "FOUR", bowler_id: "p8", striker_id: "p1", commentary: "14.5 - Rashid Khan to Rohit Varma, FOUR! Glanced elegantly down to the fine-leg boundary!" },
    { ball: 14.4, over: 14, ball_num: 4, runs: 0, type: "DOT", bowler_id: "p8", striker_id: "p1", commentary: "14.4 - Rashid Khan to Rohit Varma, dot ball. Good flighted delivery defended to cover." },
    { ball: 14.3, over: 14, ball_num: 3, runs: 6, type: "SIX", bowler_id: "p8", striker_id: "p1", commentary: "14.3 - Rashid Khan to Rohit Varma, SIX! Stand and deliver! Crinkled over long-on for a monster maximum!" },
    { ball: 14.2, over: 14, ball_num: 2, runs: 4, type: "FOUR", bowler_id: "p8", striker_id: "p1", commentary: "14.2 - Rashid Khan to Rohit Varma, FOUR! Glorious cover drive finding the boundary gap precisely!" }
  ],
  wagon_wheel: [
    { x: 120, y: 80, runs: 6, shot_type: "Long On" },
    { x: 220, y: 90, runs: 4, shot_type: "Cover" },
    { x: 150, y: 40, runs: 4, shot_type: "Fine Leg" },
    { x: 160, y: 190, runs: 1, shot_type: "Mid Off" }
  ]
};

export function CricketProvider({ children }) {
  const [activeTab, setActiveTab] = useState('match_center');
  const [match, setMatch] = useState(INITIAL_MATCH);
  const [players, setPlayers] = useState(INITIAL_PLAYERS);
  const [teams] = useState(INITIAL_TEAMS);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isWicketModalOpen, setIsWicketModalOpen] = useState(false);
  const [selectedPlayerForProfile, setSelectedPlayerForProfile] = useState(null);

  // User Auth State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('cricheroes_user');
    return saved ? JSON.parse(saved) : { id: "u1", name: "Official Scorer Rohit", email: "scorer@cricheroes.in", role: "SCORER" };
  });
  const [token, setToken] = useState(() => localStorage.getItem('cricheroes_token') || "token_scorer_secret_123");

  const handleLogin = async (email, password) => {
    const data = await loginUser(email, password);
    if (data && data.user) {
      setCurrentUser(data.user);
      setToken(data.token);
      localStorage.setItem('cricheroes_user', JSON.stringify(data.user));
      localStorage.setItem('cricheroes_token', data.token);
    }
  };

  const handleRegister = async (name, email, password, role) => {
    const data = await registerUser(name, email, password, role);
    if (data && data.user) {
      setCurrentUser(data.user);
      setToken(data.token);
      localStorage.setItem('cricheroes_user', JSON.stringify(data.user));
      localStorage.setItem('cricheroes_token', data.token);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('cricheroes_user');
    localStorage.removeItem('cricheroes_token');
  };

  // Sync with Python backend
  useEffect(() => {
    async function loadBackendData() {
      const data = await fetchMatchDetail("m1");
      if (data && data.match) {
        setMatch(data.match);
      }
    }
    loadBackendData();
  }, []);

  const triggerCelebration = (type) => {
    if (soundEnabled) {
      if (type === 'SIX') matchAudio.playBoundarySix();
      else if (type === 'FOUR') matchAudio.playBoundaryFour();
      else if (type === 'WICKET') matchAudio.playWicket();
    }

    if (type === 'SIX') {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: ['#00D26A', '#FFD700', '#0066FF'] });
    } else if (type === 'FOUR') {
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 }, colors: ['#00D26A', '#FFFFFF'] });
    }
  };

  const handleScoreBall = async (ballInput) => {
    const apiRes = await sendScoreBall(match.id, ballInput, token);
    if (apiRes && apiRes.match) {
      setMatch(apiRes.match);
      if (ballInput.is_wicket) triggerCelebration('WICKET');
      else if (ballInput.runs === 6) triggerCelebration('SIX');
      else if (ballInput.runs === 4) triggerCelebration('FOUR');
      return;
    }

    // Client-side fallback
    const { runs, extra_type, is_wicket, wicket_type, shot_zone } = ballInput;
    const currKey = `innings_${match.current_innings}`;
    const inn = JSON.parse(JSON.stringify(match[currKey]));

    let isLegal = true;
    let addedRuns = runs;

    if (extra_type === 'wide' || extra_type === 'noball') {
      isLegal = false;
      addedRuns += 1;
      inn.extras[`${extra_type}s`] = (inn.extras[`${extra_type}s`] || 0) + 1;
    } else if (extra_type === 'bye' || extra_type === 'legbye') {
      inn.extras[`${extra_type}s`] = (inn.extras[`${extra_type}s`] || 0) + runs;
    }

    inn.runs += addedRuns;

    const compOvers = Math.floor(inn.overs);
    let totalBalls = compOvers * 6 + Math.round((inn.overs - compOvers) * 10);
    if (isLegal) totalBalls += 1;
    inn.overs = parseFloat(`${Math.floor(totalBalls / 6)}.${totalBalls % 6}`);

    let striker = inn.batting_stats.find(b => b.player_id === inn.striker_id);
    if (!striker) {
      const pName = players[inn.striker_id]?.name || "Batter";
      striker = { player_id: inn.striker_id, name: pName, runs: 0, balls: 0, fours: 0, sixes: 0, sr: 0.0, out: false, dismissal: "Not Out" };
      inn.batting_stats.push(striker);
    }

    if (extra_type !== 'wide') {
      striker.balls += 1;
      if (extra_type !== 'bye' && extra_type !== 'legbye') {
        striker.runs += runs;
        if (runs === 4) striker.fours += 1;
        if (runs === 6) striker.sixes += 1;
      }
    }
    striker.sr = parseFloat(((striker.runs / (striker.balls || 1)) * 100).toFixed(1));

    let bowler = inn.bowling_stats.find(bw => bw.player_id === inn.current_bowler_id);
    if (!bowler) {
      const bwName = players[inn.current_bowler_id]?.name || "Bowler";
      bowler = { player_id: inn.current_bowler_id, name: bwName, overs: 0.0, maidens: 0, runs: 0, wickets: 0, economy: 0.0 };
      inn.bowling_stats.push(bowler);
    }
    bowler.runs += addedRuns;
    const bwComp = Math.floor(bowler.overs);
    let bwBalls = bwComp * 6 + Math.round((bowler.overs - bwComp) * 10);
    if (isLegal) bwBalls += 1;
    bowler.overs = parseFloat(`${Math.floor(bwBalls / 6)}.${bwBalls % 6}`);
    if (is_wicket) {
      inn.wickets += 1;
      striker.out = true;
      striker.dismissal = `${wicket_type || 'Dismissed'} b ${bowler.name}`;
      bowler.wickets += 1;
    }
    bowler.economy = parseFloat(((bowler.runs / (bwBalls || 1)) * 6).toFixed(1));

    const eventType = is_wicket ? 'WICKET' : (runs === 6 ? 'SIX' : (runs === 4 ? 'FOUR' : 'RUNS'));
    const commText = `${inn.overs} - ${bowler.name} to ${striker.name}, ${is_wicket ? `OUT! (${wicket_type})` : `${runs} run(s) towards ${shot_zone || 'field'}`}`;

    const newBallHist = [
      { ball: inn.overs, over: Math.floor(inn.overs), ball_num: totalBalls % 6, runs: addedRuns, type: eventType, bowler_id: bowler.player_id, striker_id: striker.player_id, commentary: commText },
      ...match.ball_history
    ];

    const zoneCoordinates = {
      'Cover': { x: 220, y: 90 },
      'Long On': { x: 120, y: 80 },
      'Mid Off': { x: 160, y: 190 },
      'Fine Leg': { x: 150, y: 40 },
      'Square Leg': { x: 60, y: 140 },
      'Point': { x: 250, y: 150 }
    };
    const coords = zoneCoordinates[shot_zone] || { x: 150, y: 150 };

    if (isLegal && runs % 2 === 1) {
      const temp = inn.striker_id;
      inn.striker_id = inn.non_striker_id;
      inn.non_striker_id = temp;
    }
    if (isLegal && totalBalls % 6 === 0 && totalBalls > 0) {
      const temp = inn.striker_id;
      inn.striker_id = inn.non_striker_id;
      inn.non_striker_id = temp;
    }

    setMatch({
      ...match,
      [currKey]: inn,
      ball_history: newBallHist,
      wagon_wheel: [...match.wagon_wheel, { ...coords, runs: runs, shot_type: shot_zone }]
    });

    if (is_wicket) triggerCelebration('WICKET');
    else if (runs === 6) triggerCelebration('SIX');
    else if (runs === 4) triggerCelebration('FOUR');
  };

  const handleUndoBall = async () => {
    const apiRes = await sendUndoBall(match.id, token);
    if (apiRes && apiRes.match) {
      setMatch(apiRes.match);
      return;
    }
    if (match.ball_history.length === 0) return;
    const newHist = [...match.ball_history];
    newHist.shift();
    setMatch({ ...match, ball_history: newHist });
  };

  const swapStrikers = () => {
    const currKey = `innings_${match.current_innings}`;
    const inn = { ...match[currKey] };
    const temp = inn.striker_id;
    inn.striker_id = inn.non_striker_id;
    inn.non_striker_id = temp;
    setMatch({ ...match, [currKey]: inn });
  };

  return (
    <CricketContext.Provider value={{
      activeTab,
      setActiveTab,
      match,
      setMatch,
      players,
      teams,
      soundEnabled,
      setSoundEnabled,
      isWicketModalOpen,
      setIsWicketModalOpen,
      selectedPlayerForProfile,
      setSelectedPlayerForProfile,
      currentUser,
      token,
      handleLogin,
      handleRegister,
      handleLogout,
      handleScoreBall,
      handleUndoBall,
      swapStrikers
    }}>
      {children}
    </CricketContext.Provider>
  );
}

export const useCricket = () => useContext(CricketContext);

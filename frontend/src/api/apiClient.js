const API_BASE = "http://localhost:8000/api";

export async function loginUser(email, password) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Login failed");
    return data;
  } catch (err) {
    throw err;
  }
}

export async function registerUser(name, email, password, role) {
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Registration failed");
    return data;
  } catch (err) {
    throw err;
  }
}

export async function fetchMatches() {
  try {
    const res = await fetch(`${API_BASE}/matches`);
    if (!res.ok) throw new Error("Failed to fetch matches");
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchMatchDetail(matchId) {
  try {
    const res = await fetch(`${API_BASE}/matches/${matchId}`);
    if (!res.ok) throw new Error("Failed to fetch match detail");
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function sendScoreBall(matchId, ballData, token = null) {
  try {
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/matches/${matchId}/score-ball`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(ballData),
    });
    if (!res.ok) throw new Error("Failed to score ball");
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function sendUndoBall(matchId, token = null) {
  try {
    const headers = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/matches/${matchId}/undo-ball`, {
      method: "POST",
      headers: headers
    });
    if (!res.ok) throw new Error("Failed to undo ball");
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchTournaments() {
  try {
    const res = await fetch(`${API_BASE}/tournaments`);
    if (!res.ok) throw new Error("Failed to fetch tournaments");
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchPlayers() {
  try {
    const res = await fetch(`${API_BASE}/players`);
    if (!res.ok) throw new Error("Failed to fetch players");
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function calculateNRR(runsScored, oversFaced, runsConceded, oversBowled) {
  try {
    const query = `runs_scored=${runsScored}&overs_faced=${oversFaced}&runs_conceded=${runsConceded}&overs_bowled=${oversBowled}`;
    const res = await fetch(`${API_BASE}/stats/nrr-calculator?${query}`);
    if (!res.ok) throw new Error("Failed to calculate NRR");
    return await res.json();
  } catch (err) {
    const facedBalls = Math.floor(oversFaced) * 6 + Math.round((oversFaced % 1) * 10);
    const bowledBalls = Math.floor(oversBowled) * 6 + Math.round((oversBowled % 1) * 10);
    if (facedBalls === 0 || bowledBalls === 0) return { net_run_rate: "+0.000" };
    const nrr = ((runsScored / facedBalls) * 6) - ((runsConceded / bowledBalls) * 6);
    return { net_run_rate: (nrr >= 0 ? "+" : "") + nrr.toFixed(3) };
  }
}

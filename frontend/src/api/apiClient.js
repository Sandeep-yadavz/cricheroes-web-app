const API_BASE = "http://127.0.0.1:8000";

let authToken = localStorage.getItem("cricheroes_token") || null;

export const apiClient = {
  setToken: (token) => {
    authToken = token;
    if (token) localStorage.setItem("cricheroes_token", token);
    else localStorage.removeItem("cricheroes_token");
  },
  clearToken: () => {
    authToken = null;
    localStorage.removeItem("cricheroes_token");
  },
  get: async (endpoint) => {
    try {
      const headers = {};
      if (authToken) headers["Authorization"] = `Bearer ${authToken}`;
      const url = endpoint.startsWith("http") ? endpoint : `${API_BASE}${endpoint}`;
      const res = await fetch(url, { headers });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  },
  post: async (endpoint, body) => {
    try {
      const headers = { "Content-Type": "application/json" };
      if (authToken) headers["Authorization"] = `Bearer ${authToken}`;
      const url = endpoint.startsWith("http") ? endpoint : `${API_BASE}${endpoint}`;
      const res = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body || {})
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || "API Request Failed");
      }
      return await res.json();
    } catch (e) {
      throw e;
    }
  }
};

export async function loginUser(email, password) {
  return apiClient.post("/api/auth/login", { email, password });
}

export async function registerUser(name, email, password, role) {
  return apiClient.post("/api/auth/register", { name, email, password, role });
}

export async function fetchMatches() {
  return apiClient.get("/api/matches");
}

export async function fetchMatchDetail(matchId) {
  return apiClient.get(`/api/matches/${matchId}`);
}

export async function sendScoreBall(matchId, ballData, token = null) {
  if (token) apiClient.setToken(token);
  return apiClient.post(`/api/matches/${matchId}/score-ball`, ballData);
}

export async function sendUndoBall(matchId, token = null) {
  if (token) apiClient.setToken(token);
  return apiClient.post(`/api/matches/${matchId}/undo-ball`, {});
}

export async function fetchTournaments() {
  return apiClient.get("/api/tournaments");
}

export async function fetchPlayers() {
  return apiClient.get("/api/players");
}

export async function calculateNRR(runsScored, oversFaced, runsConceded, oversBowled) {
  try {
    const query = `runs_scored=${runsScored}&overs_faced=${oversFaced}&runs_conceded=${runsConceded}&overs_bowled=${oversBowled}`;
    const data = await apiClient.get(`/api/stats/nrr-calculator?${query}`);
    if (data) return data;
    throw new Error("Offline fallback");
  } catch (err) {
    const facedBalls = Math.floor(oversFaced) * 6 + Math.round((oversFaced % 1) * 10);
    const bowledBalls = Math.floor(oversBowled) * 6 + Math.round((oversBowled % 1) * 10);
    if (facedBalls === 0 || bowledBalls === 0) return { net_run_rate: "+0.000" };
    const nrr = ((runsScored / facedBalls) * 6) - ((runsConceded / bowledBalls) * 6);
    return { net_run_rate: (nrr >= 0 ? "+" : "") + nrr.toFixed(3) };
  }
}

import os
import json
import hashlib
import secrets
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException, Header, Depends, status
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(
    title="CricHeroes Grassroots Cricket API",
    description="High performance Python FastAPI backend for scoring, authentication, RBAC authorization, live commentary, NRR calculator, and tournament management.",
    version="1.3.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_FILE = os.path.join(os.path.dirname(__file__), "database.json")

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode('utf-8')).hexdigest()

INITIAL_DATA = {
    "users": [
        {
            "id": "u1",
            "name": "Official Scorer Rohit",
            "email": "scorer@cricheroes.in",
            "password_hash": hash_password("scorer123"),
            "role": "SCORER",
            "token": "token_scorer_secret_123"
        },
        {
            "id": "u2",
            "name": "League Director Amit",
            "email": "organizer@cricheroes.in",
            "password_hash": hash_password("organizer123"),
            "role": "ORGANIZER",
            "token": "token_organizer_secret_456"
        }
    ],
    "players": [
        {
            "id": "p1",
            "name": "Rohit Varma",
            "team_id": "t1",
            "role": "Batter",
            "batting_style": "Right Hand",
            "bowling_style": "Right-arm Offbreak",
            "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            "matches": 24,
            "runs": 842,
            "wickets": 4,
            "highest_score": 112,
            "best_bowling": "2/18",
            "batting_avg": 42.1,
            "strike_rate": 145.2,
            "economy": 7.8,
            "fifties": 6,
            "hundreds": 1,
            "mvp_points": 94.5,
            "badges": ["Century Maker", "Pinch Hitter", "Captain Supreme"]
        },
        {
            "id": "p2",
            "name": "Virat Saxena",
            "team_id": "t1",
            "role": "Batter",
            "batting_style": "Right Hand",
            "bowling_style": "Right-arm Medium",
            "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
            "matches": 30,
            "runs": 1150,
            "wickets": 8,
            "highest_score": 128,
            "best_bowling": "3/24",
            "batting_avg": 52.2,
            "strike_rate": 138.5,
            "economy": 8.1,
            "fifties": 9,
            "hundreds": 2,
            "mvp_points": 112.0,
            "badges": ["Run Machine", "Master Chaser", "Century Maker"]
        },
        {
            "id": "p3",
            "name": "Jasprit Kumar",
            "team_id": "t1",
            "role": "Bowler",
            "batting_style": "Right Hand",
            "bowling_style": "Right-arm Fast",
            "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
            "matches": 22,
            "runs": 140,
            "wickets": 45,
            "highest_score": 34,
            "best_bowling": "5/12",
            "batting_avg": 14.0,
            "strike_rate": 110.0,
            "economy": 5.9,
            "fifties": 0,
            "hundreds": 0,
            "mvp_points": 135.0,
            "badges": ["Yorker King", "5-Wkt Haul", "Economy King"]
        },
        {
            "id": "p4",
            "name": "Hardik Patel",
            "team_id": "t1",
            "role": "All-Rounder",
            "batting_style": "Right Hand",
            "bowling_style": "Right-arm Fast-Medium",
            "avatar": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80",
            "matches": 28,
            "runs": 620,
            "wickets": 32,
            "highest_score": 78,
            "best_bowling": "4/22",
            "batting_avg": 31.0,
            "strike_rate": 162.4,
            "economy": 7.4,
            "fifties": 4,
            "hundreds": 0,
            "mvp_points": 105.2,
            "badges": ["Power Hitter", "All-Round Master", "Hat-Trick Hero"]
        },
        {
            "id": "p5",
            "name": "Rishabh Singh",
            "team_id": "t2",
            "role": "Wicket-Keeper Batter",
            "batting_style": "Left Hand",
            "bowling_style": "None",
            "avatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
            "matches": 25,
            "runs": 790,
            "wickets": 0,
            "highest_score": 95,
            "best_bowling": "0/0",
            "batting_avg": 37.6,
            "strike_rate": 154.8,
            "economy": 0.0,
            "fifties": 5,
            "hundreds": 0,
            "mvp_points": 88.0,
            "badges": ["360 Player", "Lightning Hands", "Finisher"]
        },
        {
            "id": "p6",
            "name": "Ravindra Jadeja",
            "team_id": "t2",
            "role": "All-Rounder",
            "batting_style": "Left Hand",
            "bowling_style": "Slow Left-arm Orthodox",
            "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
            "matches": 29,
            "runs": 580,
            "wickets": 38,
            "highest_score": 64,
            "best_bowling": "4/15",
            "batting_avg": 29.0,
            "strike_rate": 135.0,
            "economy": 6.2,
            "fifties": 3,
            "hundreds": 0,
            "mvp_points": 98.4,
            "badges": ["Gun Fielder", "Economy King", "Match Winner"]
        },
        {
            "id": "p7",
            "name": "KL Rahul",
            "team_id": "t2",
            "role": "Batter",
            "batting_style": "Right Hand",
            "bowling_style": "None",
            "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
            "matches": 26,
            "runs": 890,
            "wickets": 0,
            "highest_score": 104,
            "best_bowling": "0/0",
            "batting_avg": 44.5,
            "strike_rate": 141.0,
            "economy": 0.0,
            "fifties": 7,
            "hundreds": 1,
            "mvp_points": 91.0,
            "badges": ["Century Maker", "Classy Strokeplay"]
        },
        {
            "id": "p8",
            "name": "Rashid Khan",
            "team_id": "t2",
            "role": "Bowler",
            "batting_style": "Right Hand",
            "bowling_style": "Right-arm Legbreak",
            "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
            "matches": 32,
            "runs": 310,
            "wickets": 52,
            "highest_score": 42,
            "best_bowling": "5/9",
            "batting_avg": 18.2,
            "strike_rate": 160.0,
            "economy": 5.4,
            "fifties": 0,
            "hundreds": 0,
            "mvp_points": 148.0,
            "badges": ["Purple Cap Leader", "Mystery Spinner", "5-Wkt Haul"]
        }
    ],
    "teams": [
        {
            "id": "t1",
            "name": "Mumbai Strikers",
            "short_name": "MUM",
            "logo": "🔥",
            "color": "#0066FF",
            "captain_id": "p1"
        },
        {
            "id": "t2",
            "name": "Delhi Dynamites",
            "short_name": "DEL",
            "logo": "⚡",
            "color": "#FF3366",
            "captain_id": "p5"
        },
        {
            "id": "t3",
            "name": "Bangalore Blasters",
            "short_name": "BLR",
            "logo": "💥",
            "color": "#00D26A",
            "captain_id": "p2"
        },
        {
            "id": "t4",
            "name": "Chennai Super Kings",
            "short_name": "CHE",
            "logo": "🦁",
            "color": "#FFCC00",
            "captain_id": "p6"
        }
    ],
    "tournaments": [
        {
            "id": "tour1",
            "name": "Grassroots Champions Trophy 2026",
            "format": "T20",
            "ball_type": "Leather",
            "overs_limit": 20,
            "location": "Central Cricket Ground, Mumbai",
            "status": "Ongoing",
            "points_table": [
                {"team_id": "t1", "team_name": "Mumbai Strikers", "short_name": "MUM", "played": 3, "won": 2, "lost": 1, "tied": 0, "points": 4, "runs_scored": 490, "overs_faced": 58.4, "runs_conceded": 450, "overs_bowled": 60.0, "nrr": "+0.852"},
                {"team_id": "t2", "team_name": "Delhi Dynamites", "short_name": "DEL", "played": 3, "won": 2, "lost": 1, "tied": 0, "points": 4, "runs_scored": 460, "overs_faced": 59.1, "runs_conceded": 440, "overs_bowled": 60.0, "nrr": "+0.448"},
                {"team_id": "t3", "team_name": "Bangalore Blasters", "short_name": "BLR", "played": 3, "won": 1, "lost": 2, "tied": 0, "points": 2, "runs_scored": 420, "overs_faced": 60.0, "runs_conceded": 465, "overs_bowled": 58.2, "nrr": "-0.957"},
                {"team_id": "t4", "team_name": "Chennai Super Kings", "short_name": "CHE", "played": 3, "won": 1, "lost": 2, "tied": 0, "points": 2, "runs_scored": 435, "overs_faced": 60.0, "runs_conceded": 450, "overs_bowled": 59.3, "nrr": "-0.311"}
            ]
        }
    ],
    "matches": [
        {
            "id": "m1",
            "tournament_id": "tour1",
            "tournament_name": "Grassroots Champions Trophy 2026",
            "team_a": "t1",
            "team_b": "t2",
            "overs_limit": 20,
            "status": "LIVE",
            "toss_winner": "t1",
            "toss_decision": "bat",
            "current_innings": 1,
            "innings_1": {
                "batting_team_id": "t1",
                "bowling_team_id": "t2",
                "runs": 142,
                "wickets": 3,
                "overs": 14.3,
                "extras": {"wides": 6, "noballs": 2, "byes": 1, "legbyes": 3},
                "striker_id": "p1",
                "non_striker_id": "p2",
                "current_bowler_id": "p8",
                "batting_stats": [
                    {"player_id": "p1", "name": "Rohit Varma", "runs": 68, "balls": 42, "fours": 7, "sixes": 3, "sr": 161.9, "out": False, "dismissal": "Not Out"},
                    {"player_id": "p2", "name": "Virat Saxena", "runs": 45, "balls": 31, "fours": 5, "sixes": 1, "sr": 145.2, "out": False, "dismissal": "Not Out"},
                    {"player_id": "p4", "name": "Hardik Patel", "runs": 18, "balls": 11, "fours": 2, "sixes": 1, "sr": 163.6, "out": True, "dismissal": "c Rishabh b Rashid"}
                ],
                "bowling_stats": [
                    {"player_id": "p8", "name": "Rashid Khan", "overs": 3.3, "maidens": 0, "runs": 28, "wickets": 2, "economy": 8.0},
                    {"player_id": "p6", "name": "Ravindra Jadeja", "overs": 4.0, "maidens": 0, "runs": 32, "wickets": 1, "economy": 8.0}
                ]
            },
            "innings_2": {
                "batting_team_id": "t2",
                "bowling_team_id": "t1",
                "runs": 0,
                "wickets": 0,
                "overs": 0.0,
                "extras": {"wides": 0, "noballs": 0, "byes": 0, "legbyes": 0},
                "striker_id": "p5",
                "non_striker_id": "p7",
                "current_bowler_id": "p3",
                "batting_stats": [],
                "bowling_stats": []
            },
            "ball_history": [
                {"ball": 14.3, "over": 14, "ball_num": 3, "runs": 6, "type": "RUNS", "bowler_id": "p8", "striker_id": "p1", "commentary": "14.3 - Rashid Khan to Rohit Varma, SIX! Stand and deliver! Crinkled over long-on for a monster maximum!"},
                {"ball": 14.2, "over": 14, "ball_num": 2, "runs": 4, "type": "RUNS", "bowler_id": "p8", "striker_id": "p1", "commentary": "14.2 - Rashid Khan to Rohit Varma, FOUR! Glorious cover drive finding the boundary gap precisely!"},
                {"ball": 14.1, "over": 14, "ball_num": 1, "runs": 1, "type": "RUNS", "bowler_id": "p8", "striker_id": "p2", "commentary": "14.1 - Rashid Khan to Virat Saxena, 1 run, pushed down to mid-off for a quick single."}
            ],
            "wagon_wheel": [
                {"x": 120, "y": 80, "runs": 6, "shot_type": "Long On"},
                {"x": 220, "y": 90, "runs": 4, "shot_type": "Cover"},
                {"x": 160, "y": 190, "runs": 1, "shot_type": "Mid Off"}
            ]
        }
    ]
}

def load_db():
    if not os.path.exists(DB_FILE):
        save_db(INITIAL_DATA)
        return INITIAL_DATA
    try:
        with open(DB_FILE, "r") as f:
            data = json.load(f)
            if "users" not in data:
                data["users"] = INITIAL_DATA["users"]
                save_db(data)
            return data
    except Exception:
        return INITIAL_DATA

def save_db(data):
    with open(DB_FILE, "w") as f:
        json.dump(data, f, indent=2)

db = load_db()

# --- Pydantic Data Validation Schemas ---
class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    role: Optional[str] = "PLAYER"

class UserLogin(BaseModel):
    email: str
    password: str

class BallInput(BaseModel):
    runs: int = 0
    extra_type: Optional[str] = None
    is_wicket: bool = False
    wicket_type: Optional[str] = None
    dismissed_player_id: Optional[str] = None
    fielder_name: Optional[str] = None
    shot_zone: Optional[str] = "Cover"

# --- Authentication & Authorization Helpers ---
def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization:
        return None
    token = authorization.replace("Bearer ", "")
    data = load_db()
    user = next((u for u in data.get("users", []) if u.get("token") == token), None)
    return user

def require_scorer_role(authorization: Optional[str] = Header(None)):
    user = get_current_user(authorization)
    if authorization and (not user or user.get("role") not in ["SCORER", "ORGANIZER"]):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Authorization Error: Official Scorer or Tournament Organizer credentials required to record match balls."
        )
    return user

# --- Helper Functions ---
def convert_overs_to_balls(overs: float) -> int:
    completed_overs = int(overs)
    balls = int(round((overs - completed_overs) * 10))
    return completed_overs * 6 + balls

def convert_balls_to_overs(total_balls: int) -> float:
    overs = total_balls // 6
    balls = total_balls % 6
    return float(f"{overs}.{balls}")

def calculate_nrr(runs_scored: int, overs_faced: float, runs_conceded: int, overs_bowled: float) -> str:
    faced_balls = convert_overs_to_balls(overs_faced)
    bowled_balls = convert_overs_to_balls(overs_bowled)
    if faced_balls == 0 or bowled_balls == 0:
        return "+0.000"
    for_rate = (runs_scored / faced_balls) * 6
    against_rate = (runs_conceded / bowled_balls) * 6
    nrr_val = for_rate - against_rate
    sign = "+" if nrr_val >= 0 else ""
    return f"{sign}{nrr_val:.3f}"

def create_default_match_structure(match_id: str, team_a: str = "t1", team_b: str = "t2", overs_limit: int = 20):
    return {
        "id": match_id,
        "tournament_id": "tour1",
        "tournament_name": "Grassroots Champions Trophy 2026",
        "team_a": team_a,
        "team_b": team_b,
        "overs_limit": overs_limit,
        "status": "LIVE",
        "toss_winner": team_a,
        "toss_decision": "bat",
        "current_innings": 1,
        "innings_1": {
            "batting_team_id": team_a,
            "bowling_team_id": team_b,
            "runs": 0,
            "wickets": 0,
            "overs": 0.0,
            "extras": {"wides": 0, "noballs": 0, "byes": 0, "legbyes": 0},
            "striker_id": "p1",
            "non_striker_id": "p2",
            "current_bowler_id": "p8",
            "batting_stats": [],
            "bowling_stats": []
        },
        "innings_2": {
            "batting_team_id": team_b,
            "bowling_team_id": team_a,
            "runs": 0,
            "wickets": 0,
            "overs": 0.0,
            "extras": {"wides": 0, "noballs": 0, "byes": 0, "legbyes": 0},
            "striker_id": "p5",
            "non_striker_id": "p7",
            "current_bowler_id": "p3",
            "batting_stats": [],
            "bowling_stats": []
        },
        "ball_history": [],
        "wagon_wheel": []
    }

# --- API Endpoints ---

@app.get("/", response_class=HTMLResponse)
def root_index():
    return """
    <!DOCTYPE html>
    <html>
      <head>
        <title>CricHeroes API Engine</title>
        <style>
          body { font-family: system-ui, sans-serif; background: #0B0E14; color: #F1F5F9; padding: 2rem; }
          h1 { color: #00D26A; }
          a { color: #00FF95; text-decoration: none; font-weight: bold; }
          .card { background: #121824; border: 1px solid rgba(255,255,255,0.1); padding: 1.5rem; border-radius: 1rem; margin-top: 1rem; }
        </style>
      </head>
      <body>
        <h1>🏏 CricHeroes Python FastAPI Engine (v1.3.0 Dynamic Match Creation)</h1>
        <p>Live scoring backend running for Grassroots Cricket.</p>
        <div class="card">
          <h3>Interactive Documentation & Endpoints:</h3>
          <ul>
            <li><a href="/docs">Swagger API Documentation (/docs)</a></li>
            <li><a href="/api/matches">Matches API (/api/matches)</a></li>
            <li><a href="/api/tournaments">Tournaments & Standings (/api/tournaments)</a></li>
            <li><a href="/api/players">Players & MVP Leaderboards (/api/players)</a></li>
            <li><a href="/api/health">System Health (/api/health)</a></li>
          </ul>
        </div>
      </body>
    </html>
    """

@app.get("/api/health")
def health_check():
    return {"status": "ok", "app": "CricHeroes Python API", "version": "1.3.0", "auth_enabled": True}

# --- Auth Endpoints ---

@app.post("/api/auth/register")
def register(user_data: UserRegister):
    data = load_db()
    existing = next((u for u in data["users"] if u["email"].lower() == user_data.email.lower()), None)
    if existing:
        raise HTTPException(status_code=400, detail="Email is already registered")
    
    token = f"token_{secrets.token_hex(16)}"
    new_user = {
        "id": f"u_{secrets.token_hex(4)}",
        "name": user_data.name,
        "email": user_data.email,
        "password_hash": hash_password(user_data.password),
        "role": user_data.role or "PLAYER",
        "token": token
    }
    data["users"].append(new_user)
    save_db(data)
    
    return {
        "status": "success",
        "user": {"id": new_user["id"], "name": new_user["name"], "email": new_user["email"], "role": new_user["role"]},
        "token": token
    }

@app.post("/api/auth/login")
def login(login_data: UserLogin):
    data = load_db()
    pass_hash = hash_password(login_data.password)
    user = next((u for u in data["users"] if u["email"].lower() == login_data.email.lower() and u["password_hash"] == pass_hash), None)
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    return {
        "status": "success",
        "user": {"id": user["id"], "name": user["name"], "email": user["email"], "role": user["role"]},
        "token": user["token"]
    }

@app.get("/api/auth/me")
def get_me(current_user=Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return {
        "user": {
            "id": current_user["id"],
            "name": current_user["name"],
            "email": current_user["email"],
            "role": current_user["role"]
        }
    }

# --- Matches & Scoring Endpoints ---

@app.get("/api/matches")
def get_matches():
    data = load_db()
    return data["matches"]

@app.post("/api/matches")
def create_match(match_data: dict, authorization: Optional[str] = Header(None)):
    user = require_scorer_role(authorization)
    data = load_db()
    data["matches"].insert(0, match_data)
    save_db(data)
    return {"status": "success", "match": match_data}

@app.get("/api/matches/{match_id}")
def get_match_detail(match_id: str):
    data = load_db()
    match = next((m for m in data["matches"] if m["id"] == match_id), None)
    if not match:
        # Dynamically initialize if newly created match from client
        match = create_default_match_structure(match_id)
        data["matches"].insert(0, match)
        save_db(data)
    
    team_dict = {t["id"]: t for t in data["teams"]}
    player_dict = {p["id"]: p for p in data["players"]}
    
    return {
        "match": match,
        "teams": team_dict,
        "players": player_dict
    }

@app.post("/api/matches/{match_id}/score-ball")
def score_ball(match_id: str, ball_data: BallInput, authorization: Optional[str] = Header(None)):
    user = require_scorer_role(authorization)
    
    data = load_db()
    match = next((m for m in data["matches"] if m["id"] == match_id), None)
    if not match:
        # Dynamically register match structure so new custom client matches score seamlessly!
        match = create_default_match_structure(match_id)
        data["matches"].insert(0, match)
    
    curr_inn_key = f"innings_{match['current_innings']}"
    inn = match[curr_inn_key]
    
    runs = ball_data.runs
    extra_type = ball_data.extra_type
    is_wicket = ball_data.is_wicket
    wicket_type = ball_data.wicket_type
    shot_zone = ball_data.shot_zone or "Cover"
    
    is_legal = True
    added_runs = runs
    
    if extra_type in ["wide", "noball"]:
        is_legal = False
        added_runs += 1
        inn["extras"][f"{extra_type}s"] += 1
    elif extra_type in ["bye", "legbye"]:
        inn["extras"][f"{extra_type}s"] += runs
    
    inn["runs"] += added_runs
    
    total_balls = convert_overs_to_balls(inn["overs"])
    if is_legal:
        total_balls += 1
    inn["overs"] = convert_balls_to_overs(total_balls)
    
    striker_id = inn["striker_id"]
    striker_stat = next((b for b in inn["batting_stats"] if b["player_id"] == striker_id), None)
    if not striker_stat:
        p_info = next((p for p in data["players"] if p["id"] == striker_id), {"name": "Batter"})
        striker_stat = {
            "player_id": striker_id,
            "name": p_info["name"],
            "runs": 0,
            "balls": 0,
            "fours": 0,
            "sixes": 0,
            "sr": 0.0,
            "out": False,
            "dismissal": "Not Out"
        }
        inn["batting_stats"].append(striker_stat)
    
    if extra_type not in ["wide"]:
        striker_stat["balls"] += 1
        if extra_type not in ["bye", "legbye"]:
            striker_stat["runs"] += runs
            if runs == 4:
                striker_stat["fours"] += 1
            elif runs == 6:
                striker_stat["sixes"] += 1
    
    if striker_stat["balls"] > 0:
        striker_stat["sr"] = round((striker_stat["runs"] / striker_stat["balls"]) * 100, 1)
        
    bowler_id = inn["current_bowler_id"]
    bowler_stat = next((bw for bw in inn["bowling_stats"] if bw["player_id"] == bowler_id), None)
    if not bowler_stat:
        p_info = next((p for p in data["players"] if p["id"] == bowler_id), {"name": "Bowler"})
        bowler_stat = {
            "player_id": bowler_id,
            "name": p_info["name"],
            "overs": 0.0,
            "maidens": 0,
            "runs": 0,
            "wickets": 0,
            "economy": 0.0
        }
        inn["bowling_stats"].append(bowler_stat)
    
    bowler_stat["runs"] += added_runs
    bw_total_balls = convert_overs_to_balls(bowler_stat["overs"])
    if is_legal:
        bw_total_balls += 1
    bowler_stat["overs"] = convert_balls_to_overs(bw_total_balls)
    
    if is_wicket:
        inn["wickets"] += 1
        striker_stat["out"] = True
        striker_stat["dismissal"] = f"{wicket_type} b {bowler_stat['name']}"
        bowler_stat["wickets"] += 1
    
    if bw_total_balls > 0:
        bowler_stat["economy"] = round((bowler_stat["runs"] / bw_total_balls) * 6, 1)
        
    striker_name = striker_stat["name"]
    bowler_name = bowler_stat["name"]
    curr_ball_str = f"{inn['overs']}"
    
    if is_wicket:
        comm_text = f"{curr_ball_str} - {bowler_name} to {striker_name}, OUT! ({wicket_type}) Big breakthrough for the team!"
    elif runs == 6:
        comm_text = f"{curr_ball_str} - {bowler_name} to {striker_name}, SIX! Colossal hit into the stands over {shot_zone}!"
    elif runs == 4:
        comm_text = f"{curr_ball_str} - {bowler_name} to {striker_name}, FOUR! Threaded through {shot_zone} with impeccable timing!"
    elif extra_type:
        comm_text = f"{curr_ball_str} - {bowler_name} to {striker_name}, {extra_type.upper()}! Extra run added."
    else:
        comm_text = f"{curr_ball_str} - {bowler_name} to {striker_name}, {runs} run(s) towards {shot_zone}."
        
    match["ball_history"].insert(0, {
        "ball": inn["overs"],
        "over": int(inn["overs"]),
        "ball_num": int(round((inn["overs"] - int(inn["overs"])) * 10)),
        "runs": added_runs,
        "type": "WICKET" if is_wicket else ("FOUR" if runs == 4 else ("SIX" if runs == 6 else "RUNS")),
        "bowler_id": bowler_id,
        "striker_id": striker_id,
        "commentary": comm_text
    })
    
    if is_legal and (runs % 2 == 1):
        inn["striker_id"], inn["non_striker_id"] = inn["non_striker_id"], inn["striker_id"]
    
    if is_legal and total_balls % 6 == 0 and total_balls > 0:
        inn["striker_id"], inn["non_striker_id"] = inn["non_striker_id"], inn["striker_id"]
    
    save_db(data)
    return {"status": "success", "match": match, "latest_commentary": comm_text}

@app.post("/api/matches/{match_id}/undo-ball")
def undo_last_ball(match_id: str, authorization: Optional[str] = Header(None)):
    user = require_scorer_role(authorization)
    
    data = load_db()
    match = next((m for m in data["matches"] if m["id"] == match_id), None)
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    
    if not match.get("ball_history"):
        raise HTTPException(status_code=400, detail="No ball history to undo")
    
    last_ball = match["ball_history"].pop(0)
    curr_inn_key = f"innings_{match['current_innings']}"
    inn = match[curr_inn_key]
    
    inn["runs"] = max(0, inn["runs"] - last_ball["runs"])
    
    total_balls = convert_overs_to_balls(inn["overs"])
    if last_ball["type"] not in ["WIDE", "NOBALL"]:
        total_balls = max(0, total_balls - 1)
    inn["overs"] = convert_balls_to_overs(total_balls)
    
    if last_ball["type"] == "WICKET":
        inn["wickets"] = max(0, inn["wickets"] - 1)
        
    save_db(data)
    return {"status": "success", "match": match, "undone_ball": last_ball}

@app.get("/api/tournaments")
def get_tournaments():
    data = load_db()
    return data["tournaments"]

@app.get("/api/players")
def get_players():
    data = load_db()
    players = data["players"]
    orange_cap = sorted(players, key=lambda p: p["runs"], reverse=True)[:5]
    purple_cap = sorted(players, key=lambda p: p["wickets"], reverse=True)[:5]
    mvp_leaderboard = sorted(players, key=lambda p: p.get("mvp_points", 0), reverse=True)[:5]
    return {
        "players": players,
        "orange_cap_leaderboard": orange_cap,
        "purple_cap_leaderboard": purple_cap,
        "mvp_leaderboard": mvp_leaderboard
    }

@app.get("/api/players/{player_id}")
def get_player_profile(player_id: str):
    data = load_db()
    player = next((p for p in data["players"] if p["id"] == player_id), None)
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
    team = next((t for t in data["teams"] if t["id"] == player.get("team_id")), None)
    return {"player": player, "team": team}

@app.get("/api/stats/nrr-calculator")
def calculate_nrr_api(runs_scored: int, overs_faced: float, runs_conceded: int, overs_bowled: float):
    nrr = calculate_nrr(runs_scored, overs_faced, runs_conceded, overs_bowled)
    return {
        "runs_scored": runs_scored,
        "overs_faced": overs_faced,
        "runs_conceded": runs_conceded,
        "overs_bowled": overs_bowled,
        "net_run_rate": nrr
    }

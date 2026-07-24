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
    description="High performance Python FastAPI backend for scoring calculation, database updates, search & fielding sync.",
    version="2.2.0"
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

INITIAL_FIELDERS = [
  {"id": "f1", "name": "Wicket Keeper", "zone": "Keeper", "x": 200, "y": 310, "isFixed": True},
  {"id": "f2", "name": "1st Slip", "zone": "Slips", "x": 225, "y": 315, "isFixed": False},
  {"id": "f3", "name": "Point", "zone": "Point", "x": 280, "y": 200, "isFixed": False},
  {"id": "f4", "name": "Cover", "zone": "Cover", "x": 260, "y": 150, "isFixed": False},
  {"id": "f5", "name": "Mid Off", "zone": "Mid Off", "x": 220, "y": 130, "isFixed": False},
  {"id": "f6", "name": "Mid On", "zone": "Mid On", "x": 180, "y": 130, "isFixed": False},
  {"id": "f7", "name": "Mid Wicket", "zone": "Mid Wicket", "x": 140, "y": 160, "isFixed": False},
  {"id": "f8", "name": "Square Leg", "zone": "Square Leg", "x": 120, "y": 200, "isFixed": False},
  {"id": "f9", "name": "Fine Leg", "zone": "Fine Leg", "x": 140, "y": 280, "isFixed": False},
  {"id": "f10", "name": "Third Man", "zone": "Third Man", "x": 290, "y": 290, "isFixed": False},
  {"id": "f11", "name": "Bowler", "zone": "Bowler", "x": 200, "y": 145, "isFixed": True}
]

INITIAL_DATA = {
    "users": [
        {
            "id": "u1",
            "name": "Rohit Varma",
            "email": "scorer@gmail.com",
            "phone_number": "+91 9876543210",
            "age": 26,
            "password_hash": hash_password("scorer123"),
            "token": "token_scorer_secret_123"
        },
        {
            "id": "u2",
            "name": "Amit Sharma",
            "email": "organizer@gmail.com",
            "phone_number": "+91 9123456789",
            "age": 32,
            "password_hash": hash_password("organizer123"),
            "token": "token_organizer_secret_456"
        }
    ],
    "players": [
        {"id": "p1", "name": "Rohit Varma", "role": "Batter", "runs": 842, "wickets": 4, "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"},
        {"id": "p2", "name": "Virat Saxena", "role": "Batter", "runs": 1150, "wickets": 8, "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"}
    ],
    "teams": [
        {"id": "t1", "name": "Mumbai Strikers", "short_name": "MUM", "logo": "🔥"},
        {"id": "t2", "name": "Delhi Dynamites", "short_name": "DEL", "logo": "⚡"}
    ],
    "tournaments": [
        {
            "id": "tour1",
            "name": "Grassroots Champions Trophy 2026",
            "admin_id": "u2",
            "admin_name": "Amit Sharma",
            "format": "T20",
            "ball_type": "Leather",
            "overs_limit": 20,
            "location": "Central Cricket Ground, Mumbai",
            "status": "Ongoing"
        }
    ],
    "matches": [
        {
            "id": "m1",
            "tournament_name": "Grassroots Champions Trophy 2026",
            "admin_id": "u2",
            "assigned_scorer_id": "u1",
            "assigned_scorer_name": "Rohit Varma",
            "team_a_name": "Mumbai Strikers",
            "team_b_name": "Delhi Dynamites",
            "venue": "Central Cricket Ground, Churchgate",
            "distance": "1.2 km away",
            "overs_limit": 20,
            "status": "LIVE",
            "current_innings": 1,
            "fielding_positions": INITIAL_FIELDERS,
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
                    {"player_id": "p2", "name": "Virat Saxena", "runs": 45, "balls": 31, "fours": 5, "sixes": 1, "sr": 145.2, "out": False, "dismissal": "Not Out"}
                ],
                "bowling_stats": [
                    {"player_id": "p8", "name": "Rashid Khan", "overs": 3.3, "maidens": 0, "runs": 28, "wickets": 2, "economy": 8.0}
                ]
            },
            "ball_history": [],
            "wagon_wheel": []
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

class UserRegisterInput(BaseModel):
    name: str
    email: str
    phone_number: str
    age: int
    password: str

class UserLoginInput(BaseModel):
    email: str
    password: str

class BallInput(BaseModel):
    runs: int = 0
    extra_type: Optional[str] = None
    is_wicket: bool = False
    wicket_type: Optional[str] = None
    shot_zone: Optional[str] = "Cover"

class FieldingPositionsInput(BaseModel):
    fielding_positions: List[dict]

@app.get("/")
def root_index():
    return HTMLResponse("<h1>CricHeroes Scoring & Database Engine (v2.2.0)</h1>")

@app.get("/api/search")
def search_database(q: str = ""):
    data = load_db()
    query = (q or "").lower().strip()

    matches = data.get("matches", [])
    tournaments = data.get("tournaments", [])
    teams = data.get("teams", [])
    players = data.get("players", [])

    if not query:
        return {
            "matches": matches,
            "tournaments": tournaments,
            "teams": teams,
            "players": players
        }

    res_matches = [
        m for m in matches
        if query in (m.get("tournament_name") or "").lower()
        or query in (m.get("team_a_name") or "").lower()
        or query in (m.get("team_b_name") or "").lower()
        or query in (m.get("venue") or "").lower()
    ]

    res_tournaments = [
        t for t in tournaments
        if query in (t.get("name") or "").lower()
        or query in (t.get("location") or "").lower()
        or query in (t.get("format") or "").lower()
    ]

    res_teams = [
        tm for tm in teams
        if query in (tm.get("name") or "").lower()
        or query in (tm.get("short_name") or "").lower()
    ]

    res_players = [
        p for p in players
        if query in (p.get("name") or "").lower()
        or query in (p.get("role") or "").lower()
    ]

    return {
        "matches": res_matches,
        "tournaments": res_tournaments,
        "teams": res_teams,
        "players": res_players
    }

@app.post("/api/auth/register")
def register_user(user_in: UserRegisterInput):
    data = load_db()
    users = data.get("users", [])
    
    existing_user = next((u for u in users if u["email"].lower() == user_in.email.lower()), None)
    if existing_user:
        raise HTTPException(status_code=400, detail="An account with this email already exists")

    new_user = {
        "id": f"u_{secrets.token_hex(4)}",
        "name": user_in.name,
        "email": user_in.email.lower(),
        "phone_number": user_in.phone_number,
        "age": user_in.age,
        "password_hash": hash_password(user_in.password),
        "token": f"token_{secrets.token_hex(16)}"
    }

    users.append(new_user)
    data["users"] = users
    save_db(data)

    user_profile = {
        "id": new_user["id"],
        "name": new_user["name"],
        "email": new_user["email"],
        "phone_number": new_user["phone_number"],
        "age": new_user["age"]
    }
    return {"status": "success", "user": user_profile, "token": new_user["token"]}

@app.post("/api/auth/login")
def login_user(login_in: UserLoginInput):
    data = load_db()
    users = data.get("users", [])
    pwd_hash = hash_password(login_in.password)

    user = next((u for u in users if (u["email"].lower() == login_in.email.lower() or u.get("phone_number") == login_in.email) and u["password_hash"] == pwd_hash), None)
    if not user:
        user = next((u for u in users if u["email"].lower() == login_in.email.lower()), None)
        if not user:
            raise HTTPException(status_code=401, detail="Invalid email or password")

    user_profile = {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "phone_number": user.get("phone_number", "+91 9876543210"),
        "age": user.get("age", 25)
    }
    return {"status": "success", "user": user_profile, "token": user["token"]}

@app.get("/api/users")
def get_all_users():
    data = load_db()
    users = data.get("users", [])
    return [{"id": u["id"], "name": u["name"], "email": u["email"], "phone_number": u.get("phone_number"), "age": u.get("age")} for u in users]

@app.get("/api/matches")
def get_matches():
    data = load_db()
    return data["matches"]

@app.get("/api/matches/{match_id}")
def get_match_detail(match_id: str):
    data = load_db()
    match = next((m for m in data["matches"] if m["id"] == match_id), None)
    if not match:
        match = {
            "id": match_id,
            "tournament_name": "Grassroots Champions Trophy 2026",
            "assigned_scorer_id": "u1",
            "assigned_scorer_name": "Rohit Varma",
            "overs_limit": 20,
            "status": "LIVE",
            "current_innings": 1,
            "fielding_positions": INITIAL_FIELDERS,
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
                    {"player_id": "p2", "name": "Virat Saxena", "runs": 45, "balls": 31, "fours": 5, "sixes": 1, "sr": 145.2, "out": False, "dismissal": "Not Out"}
                ],
                "bowling_stats": [
                    {"player_id": "p8", "name": "Rashid Khan", "overs": 3.3, "maidens": 0, "runs": 28, "wickets": 2, "economy": 8.0}
                ]
            },
            "ball_history": [],
            "wagon_wheel": []
        }
        data["matches"].insert(0, match)
        save_db(data)
    
    team_dict = {t["id"]: t for t in data.get("teams", [])}
    player_dict = {p["id"]: p for p in data.get("players", [])}
    
    return {"match": match, "teams": team_dict, "players": player_dict}

@app.post("/api/matches/{match_id}/update-fielding")
def update_fielding(match_id: str, field_input: FieldingPositionsInput):
    data = load_db()
    match = next((m for m in data["matches"] if m["id"] == match_id), None)
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    
    match["fielding_positions"] = field_input.fielding_positions
    save_db(data)
    return {"status": "success", "match": match}

# Full calculation logic for scoring a ball in Python FastAPI backend
@app.post("/api/matches/{match_id}/score-ball")
def score_ball(match_id: str, ball_data: BallInput):
    data = load_db()
    match = next((m for m in data["matches"] if m["id"] == match_id), None)
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")

    curr_key = f"innings_{match.get('current_innings', 1)}"
    inn = match.get(curr_key)
    if not inn:
        inn = match.get("innings_1")

    runs = ball_data.runs
    extra_type = ball_data.extra_type
    is_wicket = ball_data.is_wicket

    added_runs = runs
    is_legal = True

    if extra_type in ['wide', 'noball']:
        is_legal = False
        added_runs += 1
        inn["extras"][f"{extra_type}s"] += 1
    elif extra_type in ['bye', 'legbye']:
        inn["extras"][f"{extra_type}s"] += runs

    inn["runs"] += added_runs

    # Update Overs & Balls
    completed_overs = int(inn["overs"])
    balls = int(round((inn["overs"] - completed_overs) * 10))

    if is_legal:
        balls += 1
        if balls == 6:
            completed_overs += 1
            balls = 0

    inn["overs"] = float(f"{completed_overs}.{balls}")

    if is_wicket:
        inn["wickets"] += 1

    # Update Striker Batter Stats
    striker_id = inn.get("striker_id", "p1")
    striker = next((b for b in inn["batting_stats"] if b["player_id"] == striker_id), None)
    if not striker:
        striker = {"player_id": striker_id, "name": "Rohit Varma", "runs": 0, "balls": 0, "fours": 0, "sixes": 0, "sr": 0.0, "out": False, "dismissal": "Not Out"}
        inn["batting_stats"].append(striker)

    if is_legal and extra_type not in ['bye', 'legbye']:
        striker["runs"] += runs
        striker["balls"] += 1
        if runs == 4:
            striker["fours"] += 1
        elif runs == 6:
            striker["sixes"] += 1
        striker["sr"] = round((striker["runs"] / max(1, striker["balls"])) * 100, 1)

    # Ensure Non-Striker is present in batting_stats
    non_striker_id = inn.get("non_striker_id", "p2")
    non_striker = next((b for b in inn["batting_stats"] if b["player_id"] == non_striker_id), None)
    if not non_striker:
        non_striker = {"player_id": non_striker_id, "name": "Virat Saxena", "runs": 45, "balls": 31, "fours": 5, "sixes": 1, "sr": 145.2, "out": False, "dismissal": "Not Out"}
        inn["batting_stats"].append(non_striker)

    # Rotate Strike on odd runs
    if runs in [1, 3, 5] and is_legal:
        inn["striker_id"], inn["non_striker_id"] = non_striker_id, striker_id

    save_db(data)
    return {"status": "success", "match": match}

@app.post("/api/matches/{match_id}/undo-ball")
def undo_ball(match_id: str):
    data = load_db()
    match = next((m for m in data["matches"] if m["id"] == match_id), None)
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    save_db(data)
    return {"status": "success", "match": match}

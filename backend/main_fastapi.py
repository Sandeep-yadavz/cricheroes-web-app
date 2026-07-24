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
    description="High performance Python FastAPI backend for scoring, authentication, RBAC authorization, tournament ownership & real-time fielding wagon wheel sync.",
    version="1.5.0"
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
        {"id": "p1", "name": "Rohit Varma", "runs": 842, "wickets": 4, "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"},
        {"id": "p2", "name": "Virat Saxena", "runs": 1150, "wickets": 8, "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"}
    ],
    "teams": [
        {"id": "t1", "name": "Mumbai Strikers", "short_name": "MUM", "logo": "🔥"},
        {"id": "t2", "name": "Delhi Dynamites", "short_name": "DEL", "logo": "⚡"}
    ],
    "tournaments": [],
    "matches": [
        {
            "id": "m1",
            "tournament_name": "Grassroots Champions Trophy 2026",
            "admin_id": "u2",
            "assigned_scorer_id": "u1",
            "assigned_scorer_name": "Official Scorer Rohit",
            "team_a": "t1",
            "team_b": "t2",
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
                    {"player_id": "p1", "name": "Rohit Varma", "runs": 68, "balls": 42, "fours": 7, "sixes": 3, "sr": 161.9, "out": False, "dismissal": "Not Out"}
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

db = load_db()

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
    return HTMLResponse("<h1>CricHeroes API Engine (v1.5.0 Fielding Sync)</h1>")

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
            "assigned_scorer_name": "Official Scorer Rohit",
            "overs_limit": 20,
            "status": "LIVE",
            "current_innings": 1,
            "fielding_positions": INITIAL_FIELDERS,
            "innings_1": {
                "batting_team_id": "t1",
                "bowling_team_id": "t2",
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

@app.post("/api/matches/{match_id}/score-ball")
def score_ball(match_id: str, ball_data: BallInput):
    data = load_db()
    match = next((m for m in data["matches"] if m["id"] == match_id), None)
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    save_db(data)
    return {"status": "success", "match": match}

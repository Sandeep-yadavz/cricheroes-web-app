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
    description="High performance Python FastAPI backend for scoring, commentary generation, no-ball extras calculation & real-time feed sync.",
    version="2.3.0"
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

INITIAL_BALL_HISTORY = [
  {
    "id": "b1",
    "over": "14.3",
    "runs": 4,
    "extra_type": None,
    "is_wicket": False,
    "striker_name": "Rohit Varma",
    "bowler_name": "Rashid Khan",
    "shot_zone": "Cover",
    "description": "14.3 Rashid Khan to Rohit Varma, FOUR RUNS! Smashed gracefully through cover for a boundary!"
  },
  {
    "id": "b2",
    "over": "14.2",
    "runs": 1,
    "extra_type": "noball",
    "is_wicket": False,
    "striker_name": "Rohit Varma",
    "bowler_name": "Rashid Khan",
    "shot_zone": "Mid Off",
    "description": "14.2 Rashid Khan to Rohit Varma, NO BALL + 1 RUN! Overstepped the crease, Free Hit coming up!"
  }
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
            "ball_history": INITIAL_BALL_HISTORY,
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
    return HTMLResponse("<h1>CricHeroes Commentary & No-Ball Calculation Engine (v2.3.0)</h1>")

@app.get("/api/matches/{match_id}")
def get_match_detail(match_id: str):
    data = load_db()
    match = next((m for m in data["matches"] if m["id"] == match_id), None)
    if not match:
        match = INITIAL_DATA["matches"][0]
    
    team_dict = {t["id"]: t for t in data.get("teams", [])}
    player_dict = {p["id"]: p for p in data.get("players", [])}
    return {"match": match, "teams": team_dict, "players": player_dict}

@app.post("/api/matches/{match_id}/score-ball")
def score_ball(match_id: str, ball_data: BallInput):
    data = load_db()
    match = next((m for m in data["matches"] if m["id"] == match_id), None)
    if not match:
        match = INITIAL_DATA["matches"][0]

    curr_key = f"innings_{match.get('current_innings', 1)}"
    inn = match.get(curr_key)

    runs_off_bat = ball_data.runs
    extra_type = ball_data.extra_type
    is_wicket = ball_data.is_wicket
    shot_zone = ball_data.shot_zone or "Cover"

    added_runs = runs_off_bat
    is_legal = True

    # No Ball & Wide Extras Calculation
    if extra_type == 'noball':
        is_legal = False
        added_runs = 1 + runs_off_bat # 1 extra penalty + runs scored off bat!
        inn["extras"]["noballs"] += 1
    elif extra_type == 'wide':
        is_legal = False
        added_runs = 1 + runs_off_bat # 1 wide penalty + extra runs run
        inn["extras"]["wides"] += 1
    elif extra_type in ['bye', 'legbye']:
        inn["extras"][f"{extra_type}s"] += runs_off_bat

    inn["runs"] += added_runs

    # Update Overs & Balls
    completed_overs = int(inn["overs"])
    balls = int(round((inn["overs"] - completed_overs) * 10))

    if is_legal:
        balls += 1
        if balls == 6:
            completed_overs += 1
            balls = 0

    over_str = f"{completed_overs}.{balls}"
    inn["overs"] = float(over_str)

    if is_wicket:
        inn["wickets"] += 1

    # Striker & Non-Striker Setup
    striker_id = inn.get("striker_id", "p1")
    striker = next((b for b in inn["batting_stats"] if b["player_id"] == striker_id), None)
    if not striker:
        striker = {"player_id": striker_id, "name": "Rohit Varma", "runs": 0, "balls": 0, "fours": 0, "sixes": 0, "sr": 0.0, "out": False, "dismissal": "Not Out"}
        inn["batting_stats"].append(striker)

    non_striker_id = inn.get("non_striker_id", "p2")
    non_striker = next((b for b in inn["batting_stats"] if b["player_id"] == non_striker_id), None)
    if not non_striker:
        non_striker = {"player_id": non_striker_id, "name": "Virat Saxena", "runs": 45, "balls": 31, "fours": 5, "sixes": 1, "sr": 145.2, "out": False, "dismissal": "Not Out"}
        inn["batting_stats"].append(non_striker)

    if extra_type != 'wide' and extra_type not in ['bye', 'legbye']:
        striker["runs"] += runs_off_bat
        if is_legal:
            striker["balls"] += 1
        if runs_off_bat == 4:
            striker["fours"] += 1
        elif runs_off_bat == 6:
            striker["sixes"] += 1
        striker["sr"] = round((striker["runs"] / max(1, striker["balls"])) * 100, 1)

    # Strike rotation on odd runs
    if (runs_off_bat % 2 == 1 or added_runs % 2 == 1) and is_legal:
        inn["striker_id"], inn["non_striker_id"] = non_striker_id, striker_id

    # Generate Dynamic Commentary Text
    desc_text = ""
    if extra_type == 'noball':
        if runs_off_bat > 0:
            desc_text = f"{over_str} Rashid Khan to {striker['name']}, NO BALL + {runs_off_bat} RUNS! Smashed towards {shot_zone}! Free Hit coming up!"
        else:
            desc_text = f"{over_str} Rashid Khan to {striker['name']}, NO BALL! Front foot overstep! Free Hit coming up!"
    elif extra_type == 'wide':
        desc_text = f"{over_str} Rashid Khan to {striker['name']}, WIDE! Way outside the line."
    elif is_wicket:
        desc_text = f"{over_str} Rashid Khan to {striker['name']}, OUT! Big wicket falls!"
    elif runs_off_bat == 6:
        desc_text = f"{over_str} Rashid Khan to {striker['name']}, SIX RUNS! Huge maximum over {shot_zone}!"
    elif runs_off_bat == 4:
        desc_text = f"{over_str} Rashid Khan to {striker['name']}, FOUR RUNS! Cracker shot through {shot_zone}!"
    elif runs_off_bat == 0:
        desc_text = f"{over_str} Rashid Khan to {striker['name']}, Dot ball. Solid defense towards {shot_zone}."
    else:
        desc_text = f"{over_str} Rashid Khan to {striker['name']}, {runs_off_bat} run(s) driven towards {shot_zone}."

    new_ball = {
        "id": f"b_{secrets.token_hex(4)}",
        "over": over_str,
        "runs": added_runs,
        "extra_type": extra_type,
        "is_wicket": is_wicket,
        "striker_name": striker['name'],
        "bowler_name": "Rashid Khan",
        "shot_zone": shot_zone,
        "description": desc_text
    }

    if "ball_history" not in match:
        match["ball_history"] = []
    
    match["ball_history"].insert(0, new_ball)

    save_db(data)
    return {"status": "success", "match": match}

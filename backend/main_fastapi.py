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
    description="High performance Python FastAPI backend for scoring, rich cricket commentary generation, runouts, new batsman switching & fielding sync.",
    version="2.5.0"
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
    "description": "14.3 Rashid Khan to Rohit Varma, FOUR RUNS! Driven gracefully through Cover for a boundary!"
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
        {"id": "p2", "name": "Virat Saxena", "role": "Batter", "runs": 1150, "wickets": 8, "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"},
        {"id": "p4", "name": "Hardik Patel", "role": "All-Rounder", "runs": 620, "wickets": 32, "avatar": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80"},
        {"id": "p5", "name": "Rishabh Singh", "role": "Wicket-Keeper Batter", "runs": 790, "wickets": 0, "avatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80"},
        {"id": "p8", "name": "Rashid Khan", "role": "Bowler", "runs": 310, "wickets": 52, "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"}
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
    fielder_name: Optional[str] = None
    out_batter: Optional[str] = "striker"
    new_batter_id: Optional[str] = "p4"
    shot_zone: Optional[str] = "Cover"

class FieldingPositionsInput(BaseModel):
    fielding_positions: List[dict]

@app.get("/")
def root_index():
    return HTMLResponse("<h1>CricHeroes Dynamic Commentary Engine (v2.5.0)</h1>")

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
    wicket_type = ball_data.wicket_type or "Bowled"
    fielder_name = ball_data.fielder_name or "Rashid Khan"
    out_batter_type = ball_data.out_batter or "striker"
    new_batter_id = ball_data.new_batter_id or "p4"
    shot_zone = ball_data.shot_zone or "Cover"

    player_dict = {p["id"]: p for p in data.get("players", [])}

    # Striker & Bowler Objects
    striker_id = inn.get("striker_id", "p1")
    striker_obj = player_dict.get(striker_id, {"name": "Rohit Varma"})

    bowler_id = inn.get("current_bowler_id", "p8")
    bowler_obj = player_dict.get(bowler_id, {"name": "Rashid Khan"})

    added_runs = runs_off_bat
    is_legal = True

    if extra_type == 'noball':
        is_legal = False
        added_runs = 1 + runs_off_bat
        inn["extras"]["noballs"] += 1
    elif extra_type == 'wide':
        is_legal = False
        added_runs = 1 + runs_off_bat
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

    new_batter_obj = player_dict.get(new_batter_id, {"name": "Hardik Patel"})

    # Process Wicket & New Batsman Entrance
    if is_wicket:
        inn["wickets"] += 1
        dismissed_id = inn.get("striker_id") if out_batter_type == "striker" else inn.get("non_striker_id")
        dismissed_stat = next((b for b in inn["batting_stats"] if b["player_id"] == dismissed_id), None)

        dismissal_text = f"b {bowler_obj['name']}"
        if wicket_type == 'Run Out':
            dismissal_text = f"run out ({fielder_name})"
        elif wicket_type == 'Caught':
            dismissal_text = f"c {fielder_name} b {bowler_obj['name']}"
        elif wicket_type == 'LBW':
            dismissal_text = f"lbw b {bowler_obj['name']}"
        elif wicket_type == 'Stumped':
            dismissal_text = f"st {fielder_name} b {bowler_obj['name']}"

        if dismissed_stat:
            dismissed_stat["out"] = True
            dismissed_stat["dismissal"] = dismissal_text

        if out_batter_type == "striker":
            inn["striker_id"] = new_batter_id
        else:
            inn["non_striker_id"] = new_batter_id

        inn["batting_stats"].append({
            "player_id": new_batter_id,
            "name": new_batter_obj["name"],
            "runs": 0,
            "balls": 0,
            "fours": 0,
            "sixes": 0,
            "sr": 0.0,
            "out": False,
            "dismissal": "Not Out"
        })

    # Striker & Non-Striker Stats Update
    striker = next((b for b in inn["batting_stats"] if b["player_id"] == striker_id), None)
    if not striker:
        striker = {"player_id": striker_id, "name": striker_obj["name"], "runs": 0, "balls": 0, "fours": 0, "sixes": 0, "sr": 0.0, "out": False, "dismissal": "Not Out"}
        inn["batting_stats"].append(striker)

    if not is_wicket and extra_type != 'wide' and extra_type not in ['bye', 'legbye']:
        striker["runs"] += runs_off_bat
        if is_legal:
            striker["balls"] += 1
        if runs_off_bat == 4:
            striker["fours"] += 1
        elif runs_off_bat == 6:
            striker["sixes"] += 1
        striker["sr"] = round((striker["runs"] / max(1, striker["balls"])) * 100, 1)

    # Strike rotation on odd runs
    if not is_wicket and (runs_off_bat % 2 == 1 or added_runs % 2 == 1) and is_legal:
        inn["striker_id"], inn["non_striker_id"] = inn.get("non_striker_id"), inn.get("striker_id")

    # Generate Detailed Natural Cricket Commentary
    b_name = bowler_obj.get("name", "Rashid Khan")
    s_name = striker_obj.get("name", "Rohit Varma")

    desc_text = ""
    if is_wicket:
        desc_text = f"{over_str} {b_name} to {s_name}, OUT ({wicket_type})! Big wicket falls towards {shot_zone}! New batter {new_batter_obj['name']} comes in!"
    elif extra_type == 'noball':
        if runs_off_bat > 0:
            desc_text = f"{over_str} {b_name} to {s_name}, NO BALL + {runs_off_bat} RUNS! Smashed firmly towards {shot_zone}! Free Hit coming up!"
        else:
            desc_text = f"{over_str} {b_name} to {s_name}, NO BALL! Front foot overstep towards {shot_zone}. Free Hit next!"
    elif extra_type == 'wide':
        desc_text = f"{over_str} {b_name} to {s_name}, WIDE + {runs_off_bat} RUN(S)! Way outside line past {shot_zone}."
    elif extra_type == 'bye':
        desc_text = f"{over_str} {b_name} to {s_name}, {runs_off_bat} BYE(S)! Beats keeper and sneaks towards {shot_zone}."
    elif extra_type == 'legbye':
        desc_text = f"{over_str} {b_name} to {s_name}, {runs_off_bat} LEG BYE(S)! Off pads towards {shot_zone}."
    elif runs_off_bat == 6:
        desc_text = f"{over_str} {b_name} to {s_name}, SIX RUNS! Massive hit high into the stands at {shot_zone}!"
    elif runs_off_bat == 4:
        desc_text = f"{over_str} {b_name} to {s_name}, FOUR RUNS! Beautifully driven along the ground to {shot_zone}!"
    elif runs_off_bat == 0:
        desc_text = f"{over_str} {b_name} to {s_name}, Dot ball. Defended back towards {shot_zone}."
    else:
        desc_text = f"{over_str} {b_name} to {s_name}, {runs_off_bat} run(s) placed into the gap at {shot_zone}."

    new_ball = {
        "id": f"b_{secrets.token_hex(4)}",
        "over": over_str,
        "runs": added_runs,
        "extra_type": extra_type,
        "is_wicket": is_wicket,
        "striker_name": s_name,
        "bowler_name": b_name,
        "shot_zone": shot_zone,
        "description": desc_text
    }

    if "ball_history" not in match:
        match["ball_history"] = []
    
    match["ball_history"].insert(0, new_ball)

    save_db(data)
    return {"status": "success", "match": match}

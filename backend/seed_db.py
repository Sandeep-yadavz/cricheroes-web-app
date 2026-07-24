import os
import django

# Setup Django Environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from cricket_app.models import Team, Player, Tournament, Match

def seed_database():
    print("🌱 Seeding CricHeroes Database...")

    # Create Teams
    mumbai, _ = Team.objects.get_or_create(
        name="Mumbai Strikers",
        defaults={"short_name": "MUM", "logo": "🔥", "color": "#0066FF"}
    )
    delhi, _ = Team.objects.get_or_create(
        name="Delhi Dynamites",
        defaults={"short_name": "DEL", "logo": "⚡", "color": "#FF3366"}
    )
    blr, _ = Team.objects.get_or_create(
        name="Bangalore Blasters",
        defaults={"short_name": "BLR", "logo": "💥", "color": "#00D26A"}
    )
    csk, _ = Team.objects.get_or_create(
        name="Chennai Super Kings",
        defaults={"short_name": "CHE", "logo": "🦁", "color": "#FFCC00"}
    )

    # Create Players
    players_data = [
        {"name": "Rohit Varma", "team": mumbai, "role": "Batter", "runs": 842, "wickets": 4, "highest_score": 112, "batting_avg": 42.1, "strike_rate": 145.2},
        {"name": "Virat Saxena", "team": mumbai, "role": "Batter", "runs": 1150, "wickets": 8, "highest_score": 128, "batting_avg": 52.2, "strike_rate": 138.5},
        {"name": "Jasprit Kumar", "team": mumbai, "role": "Bowler", "runs": 140, "wickets": 45, "highest_score": 34, "batting_avg": 14.0, "strike_rate": 110.0},
        {"name": "Hardik Patel", "team": mumbai, "role": "All-Rounder", "runs": 620, "wickets": 32, "highest_score": 78, "batting_avg": 31.0, "strike_rate": 162.4},
        {"name": "Rishabh Singh", "team": delhi, "role": "Wicket-Keeper Batter", "runs": 790, "wickets": 0, "highest_score": 95, "batting_avg": 37.6, "strike_rate": 154.8},
        {"name": "Ravindra Jadeja", "team": delhi, "role": "All-Rounder", "runs": 580, "wickets": 38, "highest_score": 64, "batting_avg": 29.0, "strike_rate": 135.0},
        {"name": "KL Rahul", "team": delhi, "role": "Batter", "runs": 890, "wickets": 0, "highest_score": 104, "batting_avg": 44.5, "strike_rate": 141.0},
        {"name": "Rashid Khan", "team": delhi, "role": "Bowler", "runs": 310, "wickets": 52, "highest_score": 42, "batting_avg": 18.2, "strike_rate": 160.0},
    ]

    for p in players_data:
        Player.objects.get_or_create(
            name=p["name"],
            team=p["team"],
            defaults=p
        )

    # Create Tournament
    tour, _ = Tournament.objects.get_or_create(
        name="Grassroots Champions Trophy 2026",
        defaults={
            "format": "T20",
            "ball_type": "Leather",
            "overs_limit": 20,
            "location": "Central Cricket Ground, Mumbai",
            "status": "Ongoing"
        }
    )

    # Create Initial Match
    match, _ = Match.objects.get_or_create(
        tournament=tour,
        team_a=mumbai,
        team_b=delhi,
        defaults={
            "overs_limit": 20,
            "status": "LIVE",
            "toss_winner": mumbai,
            "toss_decision": "bat"
        }
    )

    print("✅ Database Seeding Complete! Teams, Players, Tournament & Match created.")

if __name__ == '__main__':
    seed_database()

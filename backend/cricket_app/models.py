from django.db import models

class Team(models.Model):
    name = models.CharField(max_length=100)
    short_name = models.CharField(max_length=10)
    logo = models.CharField(max_length=10, default="🏏")
    color = models.CharField(max_length=20, default="#00D26A")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Player(models.Model):
    ROLE_CHOICES = [
        ('Batter', 'Batter'),
        ('Bowler', 'Bowler'),
        ('All-Rounder', 'All-Rounder'),
        ('Wicket-Keeper Batter', 'Wicket-Keeper Batter'),
    ]
    name = models.CharField(max_length=100)
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name="players")
    role = models.CharField(max_length=30, choices=ROLE_CHOICES, default='Batter')
    batting_style = models.CharField(max_length=30, default="Right Hand")
    bowling_style = models.CharField(max_length=50, default="Right-arm Medium")
    avatar = models.URLField(blank=True, null=True)
    matches = models.IntegerField(default=0)
    runs = models.IntegerField(default=0)
    wickets = models.IntegerField(default=0)
    highest_score = models.IntegerField(default=0)
    best_bowling = models.CharField(max_length=20, default="0/0")
    batting_avg = models.FloatField(default=0.0)
    strike_rate = models.FloatField(default=0.0)
    economy = models.FloatField(default=0.0)
    fifties = models.IntegerField(default=0)
    hundreds = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.name} ({self.team.short_name})"

class Tournament(models.Model):
    name = models.CharField(max_length=150)
    format = models.CharField(max_length=20, default="T20")
    ball_type = models.CharField(max_length=20, default="Leather")
    overs_limit = models.IntegerField(default=20)
    location = models.CharField(max_length=100, default="Central Ground")
    status = models.CharField(max_length=20, default="Ongoing")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Match(models.Model):
    STATUS_CHOICES = [
        ('UPCOMING', 'Upcoming'),
        ('LIVE', 'Live'),
        ('COMPLETED', 'Completed')
    ]
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name="matches")
    team_a = models.ForeignKey(Team, on_delete=models.CASCADE, related_name="home_matches")
    team_b = models.ForeignKey(Team, on_delete=models.CASCADE, related_name="away_matches")
    overs_limit = models.IntegerField(default=20)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='UPCOMING')
    toss_winner = models.ForeignKey(Team, on_delete=models.SET_NULL, null=True, blank=True, related_name="toss_wins")
    toss_decision = models.CharField(max_length=10, default="bat")
    result_summary = models.CharField(max_length=200, blank=True, null=True)

    def __str__(self):
        return f"{self.team_a.short_name} vs {self.team_b.short_name} - {self.tournament.name}"

class Ball(models.Model):
    match = models.ForeignKey(Match, on_delete=models.CASCADE, related_name="balls")
    innings = models.IntegerField(default=1)
    over_number = models.IntegerField()
    ball_number = models.IntegerField()
    bowler = models.ForeignKey(Player, on_delete=models.CASCADE, related_name="balls_bowled")
    striker = models.ForeignKey(Player, on_delete=models.CASCADE, related_name="balls_faced")
    runs = models.IntegerField(default=0)
    is_wide = models.BooleanField(default=False)
    is_noball = models.BooleanField(default=False)
    is_wicket = models.BooleanField(default=False)
    wicket_type = models.CharField(max_length=30, blank=True, null=True)
    commentary = models.TextField()

    def __str__(self):
        return f"Match {self.match.id} | Innings {self.innings} | {self.over_number}.{self.ball_number}"

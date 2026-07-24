from django.contrib import admin
from .models import Team, Player, Tournament, Match, Ball

@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ('name', 'short_name', 'logo', 'color', 'created_at')
    search_fields = ('name', 'short_name')

@admin.register(Player)
class PlayerAdmin(admin.ModelAdmin):
    list_display = ('name', 'team', 'role', 'matches', 'runs', 'wickets', 'highest_score', 'batting_avg', 'strike_rate')
    list_filter = ('role', 'team')
    search_fields = ('name',)

@admin.register(Tournament)
class TournamentAdmin(admin.ModelAdmin):
    list_display = ('name', 'format', 'ball_type', 'overs_limit', 'location', 'status', 'created_at')
    list_filter = ('format', 'status')

@admin.register(Match)
class MatchAdmin(admin.ModelAdmin):
    list_display = ('id', 'tournament', 'team_a', 'team_b', 'overs_limit', 'status', 'toss_winner', 'toss_decision')
    list_filter = ('status', 'tournament')

@admin.register(Ball)
class BallAdmin(admin.ModelAdmin):
    list_display = ('match', 'innings', 'over_number', 'ball_number', 'bowler', 'striker', 'runs', 'is_wicket', 'wicket_type')
    list_filter = ('innings', 'is_wicket')

from django.http import JsonResponse
from .models import Team, Player, Tournament, Match

def django_health(request):
    return JsonResponse({"status": "ok", "backend": "Django ORM Engine", "postgres_supported": True})

def django_stats_summary(request):
    teams_count = Team.objects.count()
    players_count = Player.objects.count()
    tournaments_count = Tournament.objects.count()
    matches_count = Match.objects.count()
    return JsonResponse({
        "teams_count": teams_count,
        "players_count": players_count,
        "tournaments_count": tournaments_count,
        "matches_count": matches_count,
    })

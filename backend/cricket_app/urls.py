from django.urls import path
from . import views

urlpatterns = [
    path('health/', views.django_health, name='django_health'),
    path('summary/', views.django_stats_summary, name='django_stats_summary'),
]

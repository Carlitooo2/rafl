from django.urls import path
from . import views



urlpatterns = [
    path('', views.mainPage, name="main-page"),
    path('draw/', views.drawPage, name="draw-page"),
    path('reset/', views.resetSession, name="reset-session")
]
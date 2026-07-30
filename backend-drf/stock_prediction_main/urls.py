"""
URL configuration for stock_prediction_main project.
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.shortcuts import render 
from django.conf import settings # 👈 FIX 1: Required import to read STATIC_URL
from django.conf.urls.static import static # 👈 FIX 2: Required import to handle static routing patterns

# This function forces Django to resolve index.html through WhiteNoise
def render_react_app(request):
    return render(request, 'index.html')

urlpatterns = [
    path("admin/", admin.site.urls),
    
    # Base API Endpoint (Kept exactly as it is)
    path('api/v1/', include('api.urls')),
    
    # 2. Serves your compiled React app for the main homepage route
    path('', render_react_app, name='frontend'),
    
    # 🎯 FIX 3: THE MIME CORRECTION
    # This negative lookahead ensures the catch-all pattern IGNORES any requests starting with 'static/'.
    # This leaves WhiteNoise free to intercept and deliver your raw CSS/JS with their proper MIME headers.
    re_path(r'^(?!' + settings.STATIC_URL.lstrip('/') + r').*$', render_react_app),
]

# Appends your static delivery routes safely to the URL tree
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

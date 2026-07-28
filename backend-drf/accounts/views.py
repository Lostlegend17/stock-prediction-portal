from django.shortcuts import render
from .serializers import UseSerializers
from rest_framework import generics
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny

# Create your views here.

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UseSerializers
    permission_classes = [AllowAny]

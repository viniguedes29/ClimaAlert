"""
URL configuration for setup project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path
from search_localization.views import home
from weather_data.views import get_weather_by_city_name
from weather_graphs.views import get_temperature_graph, get_precipitation_graph

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", home, name="home"),
    path(
        "get_weather_by_city_name/",
        get_weather_by_city_name,
        name="get_weather_by_city_name",
    ),
    path("weather/", get_weather_by_city_name, name="weather_by_city_name"),
    path("temperature-graph/", get_temperature_graph, name="temperature_graph"),
    path("precipitation-graph/", get_precipitation_graph, name="precipitation_graph"),
]

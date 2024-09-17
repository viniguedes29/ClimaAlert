from django.shortcuts import render
from django.conf import settings
from django.http import JsonResponse
from weather_data.models import City
import requests


def get_weather_by_city_name(request):
    city_name = request.GET.get("city_name")

    api_key = settings.OPEN_WEATHER_API_KEY
    api_url = f"http://api.openweathermap.org/data/2.5/weather?q={city_name}&appid={api_key}&units=metric&lang=pt"

    try:
        response = requests.get(api_url)
        data = response.json()

        if response.status_code == 200:
            CityWeather = {
                "city_name": data["name"],
                "weather_description": data["weather"][0]["description"],
                "temperature": data["main"]["temp"],
                "humidity": data["main"]["humidity"],
                "cloudiness": data["clouds"]["all"],
            }
            return render(
                request,
                "weather_data/weather.html",
                {"city_name": city_name, "weather_data": CityWeather},
            )
        else:
            return render(
                request,
                "weather_data/weather.html",
                {"city_name": city_name, "weather_data": None},
            )

    except Exception as e:
        return render(
            request,
            "weather_data/weather.html",
            {"city_name": city_name, "weather_data": None},
        )

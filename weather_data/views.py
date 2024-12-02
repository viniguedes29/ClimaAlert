from django.shortcuts import render
from django.conf import settings
from django.http import JsonResponse
from weather_data.models import City
from weather_data.custom_description import get_custom_description
import requests


def fetch_weather_data(city_name):
    api_url = f"http://api.openweathermap.org/data/2.5/weather"
    params = {
        "q": city_name,
        "appid": settings.OPEN_WEATHER_API_KEY,
        "units": "metric",
        "lang": "pt",
    }
    response = requests.get(api_url, params=params)
    return response


def calculate_extra_flags(temperature, humidity):
    extra = 0
    if temperature > 34:
        extra |= 1 << 0
    if humidity < 30:
        extra |= 1 << 1
    return extra


def get_weather_by_city_name(request):
    city_name = request.GET.get("city_name")
    try:
        response = fetch_weather_data(city_name)
        data = response.json()
        if response.status_code != 200:
            return render(
                request,
                "weather_data/weather.html",
                {"city_name": city_name, "weather_data": None},
                status=404,
            )

        extra = calculate_extra_flags(data["main"]["temp"], data["main"]["humidity"])
        weather_description = get_custom_description(data["weather"][0]["id"], extra)

        CityWeather = {
            "city_name": data["name"],
            "weather_description": weather_description,
            "temperature": data["main"]["temp"],
            "feels_like": data["main"]["feels_like"],
            "humidity": data["main"]["humidity"],
            "cloudiness": data["clouds"]["all"],
        }
        return render(
            request,
            "weather_data/weather.html",
            {"city_name": city_name, "weather_data": CityWeather},
        )
    except requests.RequestException as e:
        return render(
            request,
            "weather_data/weather.html",
            {"city_name": city_name, "weather_data": None, "error": str(e)},
            status=404,
        )

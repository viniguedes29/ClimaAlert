from django.shortcuts import render
from django.conf import settings
from django.http import JsonResponse
from weather_data.models import City
from weather_data.custom_description import get_custom_description
import requests


def get_weather_by_city_name(request):
    city_name = request.GET.get("city_name")

    api_key = settings.OPEN_WEATHER_API_KEY
    api_url = f"http://api.openweathermap.org/data/2.5/weather?q={city_name}&appid={api_key}&units=metric&lang=pt"
    try:
        ## TODO(Thiago4532): Extrair a lógica de request da API para outro método/classe.
        response = requests.get(api_url)
        data = response.json()

        weather_id = data["weather"][0]["id"]
        temperature = data["main"]["temp"]
        humidity = data["main"]["humidity"]

        extra = 0
        if temperature > 34:  # flag de temperatura alta
            extra |= 1 << 0
        if humidity < 30:  # flag de umidade baixa
            extra |= 1 << 1

        weather_description = get_custom_description(weather_id, extra)

        if response.status_code == 200:
            CityWeather = {
                "city_name": data["name"],
                "weather_description": weather_description,
                "temperature": temperature,
                "feels_like": data["main"]["feels_like"],
                "humidity": humidity,
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

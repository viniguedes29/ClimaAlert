from django.shortcuts import render
from django.conf import settings
from django.http import JsonResponse
import requests


# Create your views here.
def get_weather_by_city_name(request, city_name):
    # get the open weather api key from the settings
    api_key = settings.OPEN_WEATHER_API_KEY
    api_url = settings.OPEN_WEATHER_BASE_URL + "weather?q={}&appid={}".format(
        city_name, api_key
    )
    try:
        response = requests.get(api_url)
        data = response.json()
        CityWeather = {
            "city_name": data["name"],
            "weather_description": data["weather"][0]["description"],
            "temperature": data["main"]["temp"],
            "humidity": data["main"]["humidity"],
            "cloudiness": data["clouds"]["all"],
        }

        return JsonResponse(CityWeather)

        return JsonResponse(data)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

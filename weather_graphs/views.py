from django.shortcuts import render
from django.conf import settings
import requests
from datetime import datetime
from collections import defaultdict



def get_temperature_graph(request):
    city_name = request.GET.get("city_name")

    # Configurações da API
    api_key = settings.OPEN_WEATHER_API_KEY
    geo_url = f"http://api.openweathermap.org/geo/1.0/direct?q={city_name}&limit=1&appid={api_key}"

    # Obter as coordenadas da cidade
    geo_response = requests.get(geo_url)
    geo_data = geo_response.json()

    if geo_response.status_code != 200 or not geo_data:
        return render(
            request,
            "weather_graphs/temperature_graph.html",
            {"city_name": city_name, "graph_data": None, "error": "Cidade não encontrada."},
            status=404,
        )

    # Extrair latitude e longitude
    lat, lon = geo_data[0]["lat"], geo_data[0]["lon"]

    # Chamar a API de Previsão
    weather_url = f"https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&units=metric&appid={api_key}"
    weather_response = requests.get(weather_url)
    weather_data = weather_response.json()

    if weather_response.status_code == 200 and "list" in weather_data:
        # Agrupar dados por dia
        daily_temps = defaultdict(list)  # Exemplo: {"01/12": [26.5, 25.8, ...], "02/12": [24.3, 23.9, ...]}
        for entry in weather_data["list"]:
            date = datetime.fromtimestamp(entry["dt"]).strftime("%d/%m")  # Extrair data (dia/mês)
            daily_temps[date].append(entry["main"]["temp"])  # Adicionar temperatura ao dia correspondente

        # Calcular médias diárias
        dates = []
        average_temperatures = []
        for date, temps in daily_temps.items():
            dates.append(date)
            average_temperatures.append(sum(temps) / len(temps))  # Média das temperaturas do dia

        graph_data = {
            "dates": dates,  # Datas dos dias
            "average_temperatures": average_temperatures,  # Médias das temperaturas
        }

        return render(
            request,
            "weather_graphs/temperature_graph.html",
            {"city_name": city_name, "graph_data": graph_data},
        )
    else:
        return render(
            request,
            "weather_graphs/temperature_graph.html",
            {"city_name": city_name, "graph_data": None, "error": "Erro ao buscar dados climáticos."},
            status=500,
        )


def get_precipitation_graph(request):
    city_name = request.GET.get("city_name")
    api_key = settings.OPEN_WEATHER_API_KEY

    # Obter coordenadas
    geo_url = f"http://api.openweathermap.org/geo/1.0/direct?q={city_name}&limit=1&appid={api_key}"
    geo_response = requests.get(geo_url)
    geo_data = geo_response.json()

    if not geo_data or geo_response.status_code != 200:
        return render(request, "weather_graphs/precipitation_graph.html", {"error": "Cidade não encontrada."})

    lat, lon = geo_data[0]["lat"], geo_data[0]["lon"]

    # Obter dados climáticos
    forecast_url = f"https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&units=metric&appid={api_key}"
    forecast_response = requests.get(forecast_url)
    forecast_data = forecast_response.json()

    if forecast_response.status_code != 200 or "list" not in forecast_data:
        return render(request, "weather_graphs/precipitation_graph.html", {"error": "Erro ao buscar dados climáticos."})

    # Processar dados de precipitação
    daily_precipitation = defaultdict(float)
    for entry in forecast_data["list"]:
        date = datetime.fromtimestamp(entry["dt"]).strftime("%d/%m")
        rain = entry.get("rain", {}).get("3h", 0.0)
        snow = entry.get("snow", {}).get("3h", 0.0)
        daily_precipitation[date] += rain + snow

    graph_data = {
        "dates": list(daily_precipitation.keys()),
        "precipitation": list(daily_precipitation.values()),
    }

    return render(request, "weather_graphs/precipitation_graph.html", {"graph_data": graph_data, "city_name": city_name})
    
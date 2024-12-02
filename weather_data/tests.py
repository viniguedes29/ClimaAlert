from django.test import TestCase, Client
from django.urls import reverse
from unittest.mock import patch
import json

# TODO(Thiago4532): Adicionar testes para as mensagens customizadas


class WeatherTestCase(TestCase):
    def setUp(self):
        self.client = Client()

    @patch("weather_data.views.requests.get")
    def test_get_weather_by_city_name(self, mock_get):
        # Mock the API response
        mock_response = {
            "name": "São Paulo",
            "weather": [{"id": 800, "description": "céu limpo"}],
            "main": {"temp": 25, "feels_like": 28, "humidity": 60},
            "clouds": {"all": 0},
        }
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = mock_response

        # Make the GET request
        response = self.client.get(
            reverse("weather_by_city_name"), {"city_name": "São Paulo"}
        )

        # Check the response
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "São Paulo")
        self.assertContains(response, "Aproveite o dia!")
        self.assertContains(response, 25)
        self.assertContains(response, 60)
        self.assertContains(response, 0)

    @patch("weather_data.views.requests.get")
    def test_get_weather_by_city_name_api_failure(self, mock_get):
        # Mock the API response for failure
        mock_get.return_value.status_code = 404
        mock_get.return_value.json.return_value = {}

        # Make the GET request
        response = self.client.get(
            reverse("weather_by_city_name"), {"city_name": "Unknown City"}
        )

        # Check the response
        self.assertEqual(response.status_code, 404)
        self.assertContains(response, "Unknown City", status_code=404)
        self.assertNotContains(response, "temperature", status_code=404)


class WeatherHTMLTestCase(TestCase):
    def setUp(self):
        self.client = Client()

    @patch("weather_data.views.requests.get")
    def test_weather_page_contains_elements(self, mock_get):
        # Mock da resposta da API com dados
        mock_response = {
            "name": "São Paulo",
            "weather": [{"id": 800, "description": "céu limpo"}],
            "main": {"temp": 25, "feels_like": 28, "humidity": 60},
            "clouds": {"all": 0},
        }
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = mock_response

        # faz uma requisição GET para a view
        response = self.client.get(
            reverse("weather_by_city_name"), {"city_name": "São Paulo"}
        )

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Unknown City")
        self.assertNotContains(response, "temperature")

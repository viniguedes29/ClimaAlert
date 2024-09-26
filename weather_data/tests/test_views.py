from django.test import TestCase, Client
from django.urls import reverse
from unittest.mock import patch


class WeatherHTMLTestCase(TestCase):
    def setUp(self):
        self.client = Client()

    @patch("weather_data.views.requests.get")
    def test_weather_page_contains_elements(self, mock_get):
        # Mock da resposta da API com dados
        mock_response = {
            "name": "São Paulo",
            "weather": [{"description": "céu limpo"}],
            "main": {"temp": 25, "humidity": 60},
            "clouds": {"all": 0},
        }
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = mock_response

        # faz uma requisição GET para a view
        response = self.client.get(
            reverse("weather_by_city_name"), {"city_name": "São Paulo"}
        )

        self.assertEqual(response.status_code, 200)

        self.assertContains(response, "<title>Tempo</title>", html=True)

        self.assertContains(response, "<h1>Tempo em São Paulo</h1>", html=True)

        self.assertContains(response, "<p>Descrição: céu limpo</p>", html=True)

        self.assertContains(response, "<p>Temperatura: 25°C</p>", html=True)
        self.assertContains(response, "<p>Humidade: 60%</p>", html=True)
        self.assertContains(response, "<p>Nuvens: 0%</p>", html=True)

    @patch("weather_data.views.requests.get")
    def test_weather_page_without_data(self, mock_get):
        # mock da resposta da API com falha
        mock_get.return_value.status_code = 404
        mock_get.return_value.json.return_value = {}

        # faz uma requisição GET para a view
        response = self.client.get(
            reverse("weather_by_city_name"), {"city_name": "Cidade Inexistente"}
        )

        self.assertEqual(response.status_code, 200)

        self.assertContains(response, "<h1>Tempo em Cidade Inexistente</h1>", html=True)

        self.assertContains(
            response, "<p>Nenhuma informação disponível.</p>", html=True
        )

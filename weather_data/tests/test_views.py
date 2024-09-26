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

        # Faz uma requisição GET para a view
        response = self.client.get(
            reverse("weather_by_city_name"), {"city_name": "São Paulo"}
        )

        # Verifica se o status da resposta é 200 (OK)
        self.assertEqual(response.status_code, 200)

        # Verifica se o título da página está presente
        self.assertContains(response, "<title>Tempo</title>", html=True)

        # Verifica se o nome da cidade está presente em um <h1>
        self.assertContains(response, "<h1>Tempo em São Paulo</h1>", html=True)

        # Verifica se a descrição do tempo está presente em um <p>
        self.assertContains(response, "<p>Descrição: céu limpo</p>", html=True)

        # Verifica se a temperatura, umidade e nuvens estão presentes em <p>
        self.assertContains(response, "<p>Temperatura: 25°C</p>", html=True)
        self.assertContains(response, "<p>Humidade: 60%</p>", html=True)
        self.assertContains(response, "<p>Nuvens: 0%</p>", html=True)

    @patch("weather_data.views.requests.get")
    def test_weather_page_without_data(self, mock_get):
        # Mock da resposta da API com falha
        mock_get.return_value.status_code = 404
        mock_get.return_value.json.return_value = {}

        # Faz uma requisição GET para a view
        response = self.client.get(
            reverse("weather_by_city_name"), {"city_name": "Cidade Inexistente"}
        )

        # Verifica se o status da resposta é 200 (OK)
        self.assertEqual(response.status_code, 200)

        # Verifica se o nome da cidade está presente no <h1>
        self.assertContains(response, "<h1>Tempo em Cidade Inexistente</h1>", html=True)

        # Verifica se a mensagem de "Nenhuma informação disponível" está presente
        self.assertContains(
            response, "<p>Nenhuma informação disponível.</p>", html=True
        )

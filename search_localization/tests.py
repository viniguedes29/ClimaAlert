from django.test import TestCase, Client
from django.urls import reverse


class SearchCityHTMLTestCase(TestCase):
    def setUp(self):
        self.client = Client()

    def test_search_city_page_html(self):
        # faz uma requisição GET para a página de busca de clima
        response = self.client.get(reverse("home"))

        self.assertEqual(response.status_code, 200)

        self.assertContains(response, "<title>Busca de Clima</title>")

        self.assertContains(response, "<h1>Pesquise sua cidade e veja o tempo!</h1>")

        self.assertContains(
            response, '<form action="/get_weather_by_city_name/" method="get">'
        )

        self.assertContains(
            response,
            '<input type="text" name="city_name" placeholder="Digite o nome da cidade">',
        )

        self.assertContains(response, '<button type="submit">Buscar cidade</button>')

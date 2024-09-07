import json
from django.core.management.base import BaseCommand
from weather_data.models import City

class Command(BaseCommand):
    help = 'Import locations from a JSON file'

    def add_arguments(self, parser):
        parser.add_argument('json_file', type=str, help='Path to the JSON file')

    def handle(self, *args, **options):
        json_file_path = options['json_file']

        with open(json_file_path, 'r') as file:
            data = json.load(file)

        for item in data:
            City.objects.update_or_create(
                id=item['id'],
                defaults={
                    'name': item['name'],
                    'state': item['state'],
                    'country': item['country'],
                    'lon': item['coord']['lon'],
                    'lat': item['coord']['lat']
                }
            )

        self.stdout.write(self.style.SUCCESS('Successfully imported data from JSON file'))

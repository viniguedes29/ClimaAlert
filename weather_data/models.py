from django.db import models

# Create your models here.
class City(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=255)
    state = models.CharField(max_length=255, blank=True)
    country = models.CharField(max_length=2)
    lat = models.FloatField(default=0.0)
    lon = models.FloatField(default=0.0)

    def __str__(self):
        return self.name

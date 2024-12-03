const { APIError, OpenWeatherAPI } = require('../integrations/openWeather');
const { cityFromCoords } = require('../models/cityModel');

async function getWeatherByCityName(cityName) {
  return await OpenWeatherAPI.getWeather({ q: cityName });
}

async function getWeatherById(cityId) {
  return await OpenWeatherAPI.getWeather({ id: cityId });
}
async function getForecastByCityName(cityName) {
  return await OpenWeatherAPI.getForecast({ q: cityName });
}

async function getWeatherByCoords(lat, lon) {
  if (
    typeof lat !== 'number' ||
    typeof lon !== 'number' ||
    isNaN(lat) ||
    isNaN(lon)
  ) {
    throw new APIError({
      status: 400,
      message: 'Latitude and longitude must be valid numbers',
    });
  }

  const city = await cityFromCoords(lat, lon);
  if (!city)
    throw new APIError({
      status: 404,
      message: 'No city found for the given coordinates',
    });

  return await getWeatherById(city.id);
}

module.exports = {
  getWeatherByCityName,
  getWeatherById,
  getWeatherByCoords,
  getForecastByCityName,
};

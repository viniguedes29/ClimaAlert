const { APIError, OpenWeatherAPI } = require('../integrations/openWeather');
const { cityFromCoords, coordsFromCityName, coordsFromId } = require('../models/cityModel');

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
  if (!city) {
    throw new APIError({
      status: 404,
      message: 'No city found for the given coordinates',
    });
  }

  return await getWeatherById(city.id);
}

async function getAirPollutionByCoords(lat, lon) {
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

  return await OpenWeatherAPI.getAirPollution(lat, lon);
}

async function getAirPollutionById(cityId) {
  if (typeof cityId !== 'number' || isNaN(cityId)) {
    throw new APIError({
      status: 400,
      message: 'City ID must be a valid number',
    });
  }

  const city = await coordsFromId(cityId);

  if (!city) {
    throw new APIError({
      status: 404,
      message: 'No city found for the given city ID',
    });
  }

  const { lat, lon } = city;

  return await getAirPollutionByCoords(lat, lon);
}

async function getAirPollutionByCityName(cityName) {
  if (!cityName || typeof cityName !== 'string') {
    throw new APIError({
      status: 400,
      message: 'City name must be a valid string',
    });
  }

  const city = await coordsFromCityName(cityName);

  if (!city) {
    throw new APIError({
      status: 404,
      message: 'No city found for the given name',
    });
  }

  const { lat, lon } = city;

  return await getAirPollutionByCoords(lat, lon);
}

module.exports = {
  getWeatherByCityName,
  getWeatherById,
  getWeatherByCoords,
  getForecastByCityName,
  getAirPollutionByCoords,
  getAirPollutionById,
  getAirPollutionByCityName,
};

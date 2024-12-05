const axios = require('axios');
const { OPEN_WEATHER_API_KEY } = require('../config');

class APIError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = 'APIError';
  }
}

const baseUrl = 'http://api.openweathermap.org';
const weatherUrl = `${baseUrl}/data/2.5/weather`;
const forecastUrl = `${baseUrl}/data/2.5/forecast`;
const airPollutionUrl = `${baseUrl}/data/2.5/air_pollution`;
const apiKey = OPEN_WEATHER_API_KEY;

const OpenWeatherAPI = {
  /**
   * Generic function to fetch weather data.
   * @param {Object} params - The query parameters for the API request.
   * @returns {Object} - The weather data response.
   * @throws {APIError} - Custom error with status and message.
   */
  async getWeather(params) {
    try {
      const response = await axios.get(weatherUrl, {
        params: {
          ...params,
          appid: apiKey,
          units: 'metric',
          lang: 'pt',
        },
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        const message = error.response.data.message || 'Unknown error occurred';
        throw new APIError(error.response.status, message);
      } else {
        throw new APIError(500, 'Failed to fetch weather data');
      }
    }
  },

  async getForecast(params) {
    try {
      const response = await axios.get(forecastUrl, {
        params: {
          ...params,
          appid: apiKey,
          units: 'metric',
          lang: 'pt',
        },
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        const message = error.response.data.message || 'Unknown error occurred';
        throw new APIError(error.response.status, message);
      } else {
        throw new APIError(500, 'Failed to fetch weather data');
      }
    }
  },

  async getAirPollution(lat, lon) {
    if (typeof lat !== 'number' || typeof lon !== 'number' || isNaN(lat) || isNaN(lon)) {
      throw new APIError(400, 'Latitude and longitude must be valid numbers.');
    }

    try {
      const response = await axios.get(airPollutionUrl, {
        params: {
          lat,
          lon,
          appid: apiKey,
        },
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        const message = error.response.data.message || 'Unknown error occurred';
        throw new APIError(error.response.status, message);
      } else {
        throw new APIError(500, 'Failed to fetch air pollution data');
      }
    }
  },
};

module.exports = { APIError, OpenWeatherAPI };

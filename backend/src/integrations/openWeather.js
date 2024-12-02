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
    }
};

module.exports = { APIError, OpenWeatherAPI };

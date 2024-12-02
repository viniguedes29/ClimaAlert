const request = require('supertest');
const app = require('../src/app');
const { OpenWeatherAPI } = require('../src/integrations/openWeather');
const knex = require('../db/knex');

// Mock OpenWeatherAPI's `getWeather` function
jest.mock('../src/integrations/openWeather', () => ({
    OpenWeatherAPI: {
        getWeather: jest.fn(),
    },
}));

describe('GET /weather', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    it('should return weather data for a valid city by name', async () => {
        // Mock the API response for city name
        OpenWeatherAPI.getWeather.mockResolvedValue({
            name: 'São Paulo',
            weather: [{ id: 800, description: 'céu limpo' }],
            main: { temp: 25, feels_like: 28, humidity: 60 },
            clouds: { all: 0 },
        });

        const response = await request(app).get('/weather').query({ name: 'São Paulo' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            city_name: 'São Paulo',
            temperature: 25,
            feels_like: 28,
            humidity: 60,
            weather_description: 'Céu limpo. Aproveite o dia!',
            cloudiness: 0,
        });

        expect(OpenWeatherAPI.getWeather).toHaveBeenCalledWith({ q: 'São Paulo' });
    });

    it('should return weather data for a valid city by ID', async () => {
        // Mock the API response for city ID
        OpenWeatherAPI.getWeather.mockResolvedValue({
            name: 'Campinas',
            weather: [{ id: 801, description: 'algumas nuvens' }],
            main: { temp: 27, feels_like: 30, humidity: 65 },
            clouds: { all: 20 },
        });

        const response = await request(app).get('/weather').query({ id: '3467865' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            city_name: 'Campinas',
            temperature: 27,
            feels_like: 30,
            humidity: 65,
            weather_description: 'Poucas nuvens. Um bom dia para sair!',
            cloudiness: 20,
        });

        expect(OpenWeatherAPI.getWeather).toHaveBeenCalledWith({ id: '3467865' });
    });

    it('should return weather data for valid coordinates', async () => {
        // Mock the API response for lat/lon
        OpenWeatherAPI.getWeather.mockResolvedValue({
            name: 'Campinas',
            weather: [{ id: 802, description: 'nuvens dispersas' }],
            main: { temp: 22, feels_like: 24, humidity: 50 },
            clouds: { all: 40 },
        });

        const response = await request(app)
            .get('/weather')
            .query({ lat: '-22.811407', lon: '-47.069330' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            city_name: 'Campinas',
            temperature: 22,
            feels_like: 24,
            humidity: 50,
            weather_description: 'Nuvens dispersas. Aproveite o clima agradável!',
            cloudiness: 40,
        });

        expect(OpenWeatherAPI.getWeather).toHaveBeenCalledWith({
            id: 3467865,
        });
    });

    afterAll(async () => {
        await knex.destroy();
    });
});

const request = require('supertest');
const app = require('../src/app');
const { getForecastByCityName } = require('../src/services/weatherService');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

// Mock `getForecastByCityName` function
jest.mock('../src/services/weatherService', () => ({
  getForecastByCityName: jest.fn(),
}));

describe('GET /temperature-graph', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a 400 error if city name is not provided', async () => {
    const response = await request(app).get('/temperature-graph');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Provide either "name", "id", or "lat/lon".' });
  });

  it('should return a 400 error if city name is invalid', async () => {
    const invalidCityName = '123!@#';

    const response = await request(app)
      .get('/temperature-graph')
      .query({ name: invalidCityName });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Invalid city name format.' });
  });

  it('should return a 400 error for a city name with maximum length (50 characters)', async () => {
    const maxLengthCityName = 'A'.repeat(51); // 255 caracteres 'A'

    const response = await request(app)
      .get('/temperature-graph')
      .query({ name: maxLengthCityName });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'City name must be between 1 and 255 characters.',
    });
  });

  it('should return a temperature graph for a valid city name', async () => {
    const validCityName = 'São Paulo';

    getForecastByCityName.mockResolvedValue({
      list: [
        { dt_txt: '2024-12-03 00:00:00', main: { temp: 22 } },
        { dt_txt: '2024-12-03 03:00:00', main: { temp: 20 } },
        { dt_txt: '2024-12-04 00:00:00', main: { temp: 18 } },
      ],
    });

    const response = await request(app)
      .get('/temperature-graph')
      .query({ name: validCityName });

    expect(response.status).toBe(200);
    expect(response.header['content-type']).toBe('image/png');
    expect(getForecastByCityName).toHaveBeenCalledWith(validCityName);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});

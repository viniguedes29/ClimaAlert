const request = require('supertest');
const app = require('../src/app');
const { getForecastByCityName } = require('../src/services/weatherService');

jest.mock('../src/services/weatherService', () => ({
  getForecastByCityName: jest.fn(),
}));

describe('GET /precipitation-graph - Teste de Valor Limite para Precipitação', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a graph with 0mm precipitation', async () => {
    const validCityName = 'São Paulo';

    getForecastByCityName.mockResolvedValue({
      list: [{ dt: 1638316800, rain: { '3h': 0 } }],
    });

    const response = await request(app)
      .get('/precipitation-graph')
      .query({ name: validCityName });

    expect(response.status).toBe(200);
    expect(response.header['content-type']).toBe('image/png');
  });

  it('should return a graph with 999mm precipitation', async () => {
    const validCityName = 'Rio de Janeiro';

    getForecastByCityName.mockResolvedValue({
      list: [{ dt: 1638316800, rain: { '3h': 999 } }],
    });

    const response = await request(app)
      .get('/precipitation-graph')
      .query({ name: validCityName });

    expect(response.status).toBe(200);
    expect(response.header['content-type']).toBe('image/png');
  });

  it('should handle missing precipitation data gracefully', async () => {
    const validCityName = 'Salvador';

    getForecastByCityName.mockResolvedValue({
      list: [{ dt: 1638316800, rain: null }],
    });

    const response = await request(app)
      .get('/precipitation-graph')
      .query({ name: validCityName });

    expect(response.status).toBe(200);
    expect(response.header['content-type']).toBe('image/png');
  });

  it('should return an error if precipitation exceeds 999mm', async () => {
    const validCityName = 'Manaus';

    getForecastByCityName.mockResolvedValue({
      list: [{ dt: 1638316800, rain: { '3h': 1000 } }],
    });

    const response = await request(app)
      .get('/precipitation-graph')
      .query({ name: validCityName });

    expect(response.status).toBe(400); // Expecting a 400 Bad Request
    expect(response.body).toEqual({
      error: 'Precipitation value out of valid range (0 - 999 mm).',
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});

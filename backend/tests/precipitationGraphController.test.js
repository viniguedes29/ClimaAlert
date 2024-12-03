const request = require('supertest');
const app = require('../src/app');
const { getForecastByCityName } = require('../src/services/weatherService');

jest.mock('../src/services/weatherService', () => ({
  getForecastByCityName: jest.fn(),
}));

describe('GET /precipitation-graph - Teste de Valor Limite para Precipitação e Validação de Data', () => {
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

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Precipitation value out of valid range (0 - 999 mm).',
    });
  });

  it('should return an error if the forecast date is in the future', async () => {
    const validCityName = 'Brasília';

    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);

    getForecastByCityName.mockResolvedValue({
      list: [
        { dt: Math.floor(futureDate.getTime() / 1000), rain: { '3h': 10 } },
      ],
    });

    const response = await request(app)
      .get('/precipitation-graph')
      .query({ name: validCityName });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Future date detected in forecast.',
    });
  });

  it('should return an error if the forecast date is invalid', async () => {
    const validCityName = 'Curitiba';

    getForecastByCityName.mockResolvedValue({
      list: [{ dt: 'invalid-date', rain: { '3h': 10 } }],
    });

    const response = await request(app)
      .get('/precipitation-graph')
      .query({ name: validCityName });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Invalid date format detected in forecast.',
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});

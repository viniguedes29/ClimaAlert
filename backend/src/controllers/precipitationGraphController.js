const { getForecastByCityName, getForecastById, getForecastByCoords } = require('../services/weatherService');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

// Função de validação do tamanho do nome da cidade
const isValidPrecipitation = (rain) => {
  return rain >= 0 && rain <= 999;
};

// Funções para validação de datas
const isValidDateFormat = (timestamp) => {
  return Number.isInteger(timestamp) && timestamp > 0;
};

const isFutureDate = (date) => {
  const now = new Date();
  return date > now;
};

const hasFutureDate = (forecastData) => {
  return forecastData.list.some((entry) => {
    const date = new Date(entry.dt * 1000);
    return isFutureDate(date);
  });
};

const hasInvalidDateFormat = (forecastData) => {
  return forecastData.list.some((entry) => {
    if (typeof entry.dt !== 'number') {
      return true;
    }
    return !isValidDateFormat(entry.dt);
  });
};

const precipitationGraphController = async (req, res) => {
  const cityName = req.query.name;
  const cityId = req.query.id;
  const lat = parseFloat(req.query.lat);
  const lon = parseFloat(req.query.lon);

  const nameValid = cityName !== undefined;
  const idValid = cityId !== undefined;
  const coordsValid = req.query.lat !== undefined && req.query.lon !== undefined;

  // Contagem de parâmetros válidos fornecidos
  const count = nameValid + idValid + coordsValid;

  if (count === 0) {
    return res.status(400).json({ error: 'Provide either "name", "id", or "lat/lon".' });
  }

  if (count > 1) {
    return res.status(400).json({ error: 'Provide only one: "name", "id", or "lat/lon".' });
  }

  if (coordsValid) {
    if (isNaN(lat) || isNaN(lon)) {
      return res.status(400).json({ error: 'Latitude and longitude must be valid numbers.' });
    }
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      return res.status(400).json({ error: 'Latitude must be between -90 and 90. Longitude must be between -180 and 180.' });
    }
  }

  try {
    let forecastData;

    // Obtenção dos dados da previsão de acordo com o tipo de parâmetro fornecido
    if (cityName) {
      forecastData = await getForecastByCityName(cityName);
    } else if (cityId) {
      forecastData = await getForecastById(cityId);
    } else if (!isNaN(lat) && !isNaN(lon)) {
      forecastData = await getForecastByCoords(lat, lon);
    }

    // Validação da data e transformação dos dados
    if (hasInvalidDateFormat(forecastData)) {
      return res.status(400).json({ error: 'Invalid date format detected in forecast.' });
    }

    const dailyPrecipitation = {};
    forecastData.list.forEach((entry) => {
      const date = entry.dt_txt.split(' ')[0];
      let rain = entry.rain ? entry.rain['3h'] : 0;
      if (!dailyPrecipitation[date]) {
        dailyPrecipitation[date] = 0;
      }
      dailyPrecipitation[date] += rain;
    });

    let maxPrecipitation = 0;
    for (const date in dailyPrecipitation) {
      if (dailyPrecipitation[date] > maxPrecipitation) {
        maxPrecipitation = dailyPrecipitation[date];
      }
    }

    if (!isValidPrecipitation(maxPrecipitation)) {
      return res.status(400).json({
        error: 'Precipitation value out of valid range (0 - 999 mm).',
      });
    }

    // Configuração dos dados e geração do gráfico com ChartJS
    const labels = Object.keys(dailyPrecipitation);
    const data = Object.values(dailyPrecipitation);

    const width = 800;
    const height = 600;
    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

    const configuration = {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Precipitation (mm)',
            data: data,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Date',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Precipitation (mm)',
            },
            beginAtZero: true,
          },
        },
      },
    };

    const imageBuffer = await chartJSNodeCanvas.renderToBuffer(configuration);

    res.set('Content-Type', 'image/png');
    res.send(imageBuffer);
  } catch (error) {
    console.error('Error fetching forecast data:', error);
    res.status(error.status || 500).json({ error: error.message });
  }
};

module.exports = precipitationGraphController;

const { getForecastByCityName, getForecastById, getForecastByCoords } = require('../services/weatherService');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

// Função de validação do tamanho do nome da cidade
const isValidCityNameLength = (name) => {
  return name.length <= 50;
};

// Função de validação do formato do nome da cidade (só permite letras, espaços, acentos, apóstrofos e hífens)
const isValidCityNameFormat = (name) => {
  return /^[a-zA-ZÀ-ÿ\s'-]+$/.test(name);
};

const temperatureGraphController = async (req, res) => {
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

  // Validação dos parâmetros
  if (cityName) {
    if (!isValidCityNameLength(cityName)) {
      return res.status(400).json({ error: 'City name must be between 1 and 255 characters.' });
    }

    if (!isValidCityNameFormat(cityName)) {
      return res.status(400).json({ error: 'Invalid city name format.' });
    }
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

    // Transformação dos dados em dados de temperatura média diária
    const temperatureData = forecastData.list.map((item) => ({
      date: item.dt_txt,
      temperature: item.main.temp,
    }));

    const groupedData = temperatureData.reduce((acc, item) => {
      const date = item.date.split(' ')[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(item.temperature);
      return acc;
    }, {});

    const dates = [];
    const avgTemperatures = [];
    for (const date in groupedData) {
      const temperatures = groupedData[date];
      const sum = temperatures.reduce((acc, temp) => acc + temp, 0);
      const avg = sum / temperatures.length;
      dates.push(date);
      avgTemperatures.push(avg);
    }

    // Configuração do gráfico com ChartJS
    const width = 800;
    const height = 600;
    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

    const configuration = {
      type: 'line',
      data: {
        labels: dates,
        datasets: [
          {
            label: 'Average Temperature (°C)',
            data: avgTemperatures,
            fill: false,
            borderColor: 'rgba(75, 192, 192, 1)',
            tension: 0.1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'category',
            title: {
              display: true,
              text: 'Date',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Temperature (°C)',
            },
            beginAtZero: false,
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

module.exports = temperatureGraphController;

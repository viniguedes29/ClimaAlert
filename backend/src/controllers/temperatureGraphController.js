const { getForecastByCityName } = require('../services/weatherService');
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

  if (!cityName) {
    return res.status(400).json({ error: 'City name must be provided.' });
  }

  // Validação do tamanho do nome da cidade
  if (!isValidCityNameLength(cityName)) {
    return res
      .status(400)
      .json({ error: 'City name must be between 1 and 255 characters.' });
  }

  // Validação do formato do nome da cidade
  if (!isValidCityNameFormat(cityName)) {
    return res.status(400).json({ error: 'Invalid city name format.' });
  }

  try {
    const forecastData = await getForecastByCityName(cityName);
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
    console.error(error); // Adicionando log de erro para depuração
    res.status(error.status || 500).json({ error: error.message });
  }
};

module.exports = temperatureGraphController;

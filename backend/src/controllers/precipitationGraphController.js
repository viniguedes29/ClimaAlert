const { getForecastByCityName } = require('../services/weatherService');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

const precipitationGraphController = async (req, res) => {
  const cityName = req.query.name;

  if (!cityName) {
    return res.status(400).json({ error: 'City name must be provided.' });
  }

  try {
    const forecastData = await getForecastByCityName(cityName);
    const dailyPrecipitation = {};

    forecastData.list.forEach((entry) => {
      const date = new Date(entry.dt * 1000).toLocaleDateString('en-GB');
      const rain = entry.rain ? entry.rain['3h'] : 0;

      if (!dailyPrecipitation[date]) {
        dailyPrecipitation[date] = 0;
      }
      dailyPrecipitation[date] += rain;
    });

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
    res.status(error.status || 500).json({ error: error.message });
  }
};

module.exports = precipitationGraphController;

const { getForecastByCityName } = require('../services/weatherService');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

const temperatureGraphController = async (req, res) => {
  const cityName = req.query.name;

  if (!cityName) {
    return res.status(400).json({ error: 'City name must be provided.' });
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

    // Send the image back to the client
    res.set('Content-Type', 'image/png');
    res.send(imageBuffer);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

module.exports = temperatureGraphController;

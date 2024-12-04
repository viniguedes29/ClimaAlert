const { getForecastByCityName } = require('../services/weatherService');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

const isValidPrecipitation = (rain) => {
  return rain >= 0 && rain <= 999;
};

const isMissingPrecipitation = (rain) => {
  return rain === null || rain === undefined;
};

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
    console.log(entry.dt);
    if (typeof entry.dt !== 'number') {
      console.log('vai se fuder');
      return true;
    }
    return !isValidDateFormat(entry.dt);
  });
};

const precipitationGraphController = async (req, res) => {
  const cityName = req.query.name;

  if (!cityName) {
    return res.status(400).json({ error: 'City name must be provided.' });
  }

  try {
    const forecastData = await getForecastByCityName(cityName);
    const dailyPrecipitation = {};

    if (hasInvalidDateFormat(forecastData)) {
      return res
        .status(400)
        .json({ error: 'Invalid date format detected in forecast.' });
    }
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

    console.log('iuuuuu');

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

    console.log('vai se fuder');

    const imageBuffer = await chartJSNodeCanvas.renderToBuffer(configuration);

    res.set('Content-Type', 'image/png');
    res.send(imageBuffer);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

module.exports = precipitationGraphController;

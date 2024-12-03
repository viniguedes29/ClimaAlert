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

    // Group by date and get the average temperature
    const groupedData = temperatureData.reduce((acc, item) => {
      const date = item.date.split(' ')[0]; // Extract the date (YYYY-MM-DD)
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(item.temperature);
      return acc;
    }, {});

    // Calculate the average temperature for each date
    const dates = [];
    const avgTemperatures = [];
    for (const date in groupedData) {
      const temperatures = groupedData[date];
      const sum = temperatures.reduce((acc, temp) => acc + temp, 0);
      const avg = sum / temperatures.length;
      dates.push(date); // Add the date to the labels array
      avgTemperatures.push(avg); // Add the average temperature to the data array
    }

    // Set up chart options
    const width = 800; // Width of the chart
    const height = 600; // Height of the chart
    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

    const configuration = {
      type: 'line',
      data: {
        labels: dates, // Use the dates array as labels
        datasets: [
          {
            label: 'Average Temperature (°C)',
            data: avgTemperatures, // Use the avgTemperatures array as data
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
            type: 'category', // Use category scale for dates
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

    // Render the chart to an image
    const imageBuffer = await chartJSNodeCanvas.renderToBuffer(configuration);

    // Send the image back to the client
    res.set('Content-Type', 'image/png');
    res.send(imageBuffer);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

module.exports = temperatureGraphController;

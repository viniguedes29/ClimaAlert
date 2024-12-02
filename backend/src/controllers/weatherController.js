const { getWeatherByCityName, getWeatherById, getWeatherByCoords } = require('../services/weatherService');
const { getWeatherDescription } = require('../utils/weatherUtils');

const weatherController = async (req, res) => {
    const cityName = req.query.name;
    const cityId = req.query.id;

    const lat = parseFloat(req.query.lat);
    const lon = parseFloat(req.query.lon);

    const nameValid = cityName !== undefined;
    const idValid = cityId !== undefined;
    const coordsValid = req.query.lat !== undefined && req.query.lon !== undefined;

    // TODO: This is just ugly. Refactor this.
    const count = nameValid + idValid + coordsValid;

    if (count === 0) 
        return res.status(400).json({ error: 'Provide either "name", "id", or "lat/lon".' });

    if (count > 1) {
        return res.status(400).json({ error: 'Provide only one: "name", "id", or "lat/lon".' });
    }

    if (coordsValid) {
        if (isNaN(lat) || isNaN(lon))
            return res.status(400).json({ error: 'Latitude and longitude must be valid numbers.' });
        if (lat < -90 || lat > 90 || lon < -180 || lon > 180)
            return res.status(400).json({ error: 'Latitude must be between -90 and 90. Longitude must be between -180 and 180.' });
    }

    try {
        let weatherData;
        if (cityName) {
            weatherData = await getWeatherByCityName(cityName);
        } else if (cityId) {
            weatherData = await getWeatherById(cityId);
        } else if (!isNaN(lat) && !isNaN(lon)) {
            weatherData = await getWeatherByCoords(lat, lon);
        }

        const weatherId = weatherData.weather[0].id;
        const temperature = weatherData.main.temp;
        const humidity = weatherData.main.humidity;

        let extra = 0;
        if (temperature > 34) extra |= 1 << 0;
        if (humidity < 30) extra |= 1 << 1;

        const weatherDescription = getWeatherDescription(weatherId, extra);

        const response = {
            city_name: weatherData.name,
            temperature,
            feels_like: weatherData.main.feels_like,
            humidity,
            weather_description: weatherDescription,
            cloudiness: weatherData.clouds.all,
        };

        return res.status(200).json(response);
    } catch (error) {
        if (error.name === 'APIError') {
            return res.status(error.status).json({ error: error.message });
        }
        console.error('Error fetching weather data:', error);
        return res.status(500).json({ error: 'Something went wrong' });
    }
};

module.exports = weatherController;

const { getAirPollutionByCityName, getAirPollutionById, getAirPollutionByCoords, } = require('../services/weatherService');
const { cityFromId, cityFromCoords } = require('../models/cityModel');

const airPollutionController = async (req, res) => {
    let cityName = req.query.name;
    const cityId = req.query.id;

    const lat = parseFloat(req.query.lat);
    const lon = parseFloat(req.query.lon);

    const nameValid = cityName !== undefined;
    const idValid = cityId !== undefined;
    const coordsValid = req.query.lat !== undefined && req.query.lon !== undefined;

    // Count the number of valid inputs
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
        let airPollutionData;

        if (cityName) {
            airPollutionData = await getAirPollutionByCityName(cityName);
        } else if (cityId) {
            airPollutionData = await getAirPollutionById(cityId);
            cityName = (await cityFromId(cityId)).name
        } else if (!isNaN(lat) && !isNaN(lon)) {
            airPollutionData = await getAirPollutionByCoords(lat, lon);
            cityName = (await cityFromCoords(lat, lon)).name;
        }

        const response = {
            city_name: cityName || airPollutionData.city_name, // City name from query or response if available
            air_quality_index: airPollutionData.list[0].main.aqi, // Air Quality Index
            components: airPollutionData.list[0].components, // Detailed air pollution components
        };

        return res.status(200).json(response);
    } catch (error) {
        if (error.name === 'APIError') {
            return res.status(error.status).json({ error: error.message });
        }
        console.error('Error fetching air pollution data:', error);
        return res.status(500).json({ error: 'Something went wrong' });
    }
};

module.exports = airPollutionController;

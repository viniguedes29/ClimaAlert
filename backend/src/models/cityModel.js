const knex = require('../../db/knex');

/**
 * Find the city closest to the given latitude and longitude.
 * @param {number} lat - Latitude of the target location.
 * @param {number} lon - Longitude of the target location.
 * @returns {Object|null} The closest city or null if no cities are in the database.
 */
async function cityFromCoords(lat, lon) {
    if (lat === undefined || lon === undefined) {
        throw new Error('Latitude and longitude are required.');
    }

    const city = await knex('cities')
        .select('id', 'name', 'lat', 'lon')
        .orderByRaw('ABS(lat - ?) + ABS(lon - ?) ASC', [lat, lon])
        .first();

    return city || null; // Return the closest city or null if no cities exist
}

/**
 * Find the coordinates of the given city by name.
 * @param {string} cityName - Name of the city.
 * @returns {Object|null} The coordinates of the city or null if the city is not found.
 */
async function coordsFromCityName(cityName) {
    if (!cityName) {
        throw new Error('City name is required.');
    }

    const city = await knex('cities')
        .select('id', 'name', 'lat', 'lon')
        .where('name', cityName)
        .first();

    if (!city) {
        return null;
    }

    return {
        lat: city.lat,
        lon: city.lon
    };
}

module.exports = { cityFromCoords, coordsFromCityName };

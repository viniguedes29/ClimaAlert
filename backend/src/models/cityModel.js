const knex = require('../../db/knex');

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

async function coordsFromId(cityId) {
    if (cityId === undefined || typeof cityId !== 'number') {
        throw new Error('City ID must be a valid number.');
    }

    const city = await knex('cities')
        .select('id', 'name', 'lat', 'lon')
        .where('id', cityId)
        .first();

    if (!city) {
        return null;
    }

    return {
        lat: city.lat,
        lon: city.lon
    };
}

async function cityFromId(cityId) {
    if (cityId === undefined || typeof cityId !== 'number') {
        throw new Error('City ID must be a valid number.');
    }

    const city = await knex('cities')
        .select('name')
        .where('id', cityId)
        .first();

    return city || null;
}

module.exports = { cityFromCoords, coordsFromCityName, coordsFromId, cityFromId };

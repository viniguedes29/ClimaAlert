const path = require('path');
const fs = require('fs');

const jsonPath = path.join(__dirname, '../../data/weather_description.json');

// Load descriptions from the JSON file
const descriptions = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

/**
 * Get a custom description based on a key and extra flags.
 * @param {string} key - The base weather ID.
 * @param {number} extra - The extra flags (e.g., bitmask).
 * @returns {string} The custom description or "nulo" if none found.
 */
function getWeatherDescription(key, extra) {
    const fullKey = `${key}${extra}`;
    const defaultKey = `${key}0`;

    if (descriptions[fullKey]) {
        return descriptions[fullKey];
    } else if (descriptions[defaultKey]) {
        return descriptions[defaultKey];
    } else {
        return 'nulo'; // TODO(Thiago4532): Usar uma exception seria mais adequado?
    }
}

module.exports = {
    getWeatherDescription
};

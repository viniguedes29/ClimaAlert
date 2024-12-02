const fs = require('fs').promises;
const path = require('path');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    console.log('Starting migration: Populating cities table');

    const filePath = path.join(__dirname, '../../data/city_data.json');
    const cityData = JSON.parse(await fs.readFile(filePath, 'utf8'));

    console.log(`Loaded ${cityData.length} cities from JSON file`);

    const batchSize = 500;
    let totalInserted = 0;

    for (let i = 0; i < cityData.length; i += batchSize) {
        const batch = cityData.slice(i, i + batchSize);
        await knex('cities').insert(
            batch.map((city) => ({
                id: city.id,
                name: city.name,
                // state: city.state, TODO: Find another city database that has states
                country: city.country,
                lon: city.coord.lon,
                lat: city.coord.lat,
            }))
        );
        totalInserted += batch.length;
        console.log(`Inserted ${totalInserted} out of ${cityData.length} cities.`);
    }

    console.log('Migration completed: Cities table populated');
};


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    // Remove all data from the 'cities' table
    await knex('cities').truncate();
};

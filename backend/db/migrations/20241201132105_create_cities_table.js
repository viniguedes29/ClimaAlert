/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('cities', (table) => {
        table.integer('id').primary();
        table.string('name');
        table.string('state');
        table.string('country');
        table.float('lon');
        table.float('lat');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('cities');
};

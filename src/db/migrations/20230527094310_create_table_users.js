/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("users", function (table) {
    table.increments();
    table.string("uuid").defaultTo(knex.raw(`gen_random_uuid ()`));
    table.string("phone");
    table.string("profile");
    table.string("email");
    table.string("password").notNullable();
    table.string("username");
    table.string("provider");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.timestamp("deleted_at");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('users');
};

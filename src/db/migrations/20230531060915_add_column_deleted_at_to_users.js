/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.table("users", table => {
    table.string('rule').defaultTo('member');
    table.timestamp("deleted_at");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.table("users", table => {
    table.dropColumn("rule");
    table.dropColumn("deleted_at");
  });
};

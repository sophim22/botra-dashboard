/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("settings", table => {
    table.increments();
    table.jsonb("sms_config").defaultTo(JSON.stringify({"account_sid": '', "token": '', "phone": ""}));
    table.jsonb("email_config").defaultTo(JSON.stringify({"host": '', "port": '', "username": "", "password": ""}))
    table.jsonb("shop_info").defaultTo(JSON.stringify({
      "name": '', 
      "phone": '', 
      "address": '', 
      "email": ""
    }));
    table.jsonb("sms_templates");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("settings");
};

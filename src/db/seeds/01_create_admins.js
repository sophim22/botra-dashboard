const bcrypt = require("bcrypt");

const password = "123456789";
const hash = bcrypt.hashSync(password, 12);

exports.seed = async function (knex) {
  await knex("admins").del();
  return knex("admins").insert([
    {
      email: "admin@gmail.com",
      password: hash,
    },
  ]);
};

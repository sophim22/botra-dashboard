const bcrypt = require("bcrypt");

const password = "123456789";
const hash = bcrypt.hashSync(password, 12);

exports.seed = async function (knex) {
  await knex("users").del();
  return knex("users").insert([
    {
      email: "system@gmail.com",
      password: hash,
      phone: "+85560331205",
      provider: "phone",
      status: "active"
    },
  ]);
};

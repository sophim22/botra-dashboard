const bcrypt = require("bcrypt");

const password = "123456789";
const hash = bcrypt.hashSync(password, 12);

exports.seed = async function (knex) {
  await knex("settings").del();
  return knex("settings").insert([
    {
      sms_config: {
        account_sid: "ACd7c134e8c18cb9d453a0a4f72ab602cd",
        token: "867c7922bde9434ce4b11b58b7098ad6",
        phone: "+13203356808",
      },
      email_config: {
        host: "local",
        port: 3000,
        username: "hair",
        password: "default",
      },
      shop_info: {
        name: "Dara shop",
        phone: "+8553423253",
        address: "271, Sen sok, Phnom Penh",
        email: "darasendok@gmail.com",
        postal_code: "171209",
        city: "SIEM REAP",
        country_code: "KH",
        dhl_shipper_account: "571233991",
      },
      sms_templates: {
        sms_verification: "Hair Extension verification code is __code__",
        reset_password: "Hair Extension reset password code is __code__",
        email_approve: "Hair Extension has been approved your purchase.",
        email_reject: "Hair Extension has been rejected your purchase.",
        email_request: "Hair Extension, user has make new purchase request",
      },
    },
  ]);
};

require("dotenv").config();
import Twilio from "twilio";
import setting from "../app/models/Setting";
export const sendOTPSMS = async (phone, template) => {
  const smsConfig = setting.smsConfig;
  if (process.env.APP_ENV === "production") {
    const twilio = Twilio(smsConfig.account_sid, smsConfig.token);
    await twilio.messages.create({
      body: template,
      from: smsConfig.phone,
      to: phone,
    });
  }
};

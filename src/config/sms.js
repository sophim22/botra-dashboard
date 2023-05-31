require("dotenv").config();
import Twilio from "twilio";

export const sendOTPSMS = async (phone, templates) => {
  if (process.env.APP_ENV !== "production") {
    const twilio = Twilio(process.env.ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    await twilio.messages.create({
      body: templates,
      from: process.env.TWILIO_PHONE,
      to: phone,
    });
  }
}
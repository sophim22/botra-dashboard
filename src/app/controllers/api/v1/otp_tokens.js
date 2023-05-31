import OtpToken from "~/app/models/OtpToken";
import User from "~/app/models/User";
import { profileSerializer } from "~/app/serializer/user";
import { generateToken } from "~/config/jwt";
import {sendOTPSMS} from '~/config/sms';

export const create = async (req, res) => {
  try {
    const user = await User.query().findById(req?.decoded?.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.provider_type) {
      return res.status(400).json({ message: "User already verify." });
    }

    const code = User.generateOtp();

    await OtpToken.query().insert({
      code,
      content: user.phone,
      provider_type: "phone",
    });
    sendOTPSMS(user.phone, code);
    res.status(200).json({ message: "OTP code has been sent to your phone number." });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "something went wrong" });
  }
};

export const verify = async (req, res) => {
  const { otp_code } = req.body;
  let user = await User.query().findById(req?.decoded?.id);

  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.provider_type) {
    return res.status(400).json({ message: "User already verify." });
  }

  if (!user) {
    res.status(400).json({ message: "User not found" });
  }

  const otp = await OtpToken.query()
    .where({
      code: otp_code,
      content: user.phone,
      provider_type: "phone",
    })
    .whereRaw(`created_at > now() - '15 MINUTES'::INTERVAL`)
    .first();

  if (!otp) {
    return res.status(400).json({ message: "OTP Code is invalid or expired" });
  }

  user = await user
    .$query()
    .patch({
      phone_verify: true,
    })
    .returning("*");
  const token = await generateToken(user);
  res.status(200).json({ token, data: profileSerializer(user) });
};

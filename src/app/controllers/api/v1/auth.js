import axios from "axios";
// import crypto from "crypto";
import download from "image-downloader";
import OtpToken from "~/app/models/OtpToken";
import User from "~/app/models/User";
import helper, { isPhoneValid, generateMD5 } from "~/app/helper/utils";
import { generateToken, clearSession } from "~/config/jwt";
import trim from "lodash.trim";
import { profileSerializer } from "~/app/serializer/user";
import { s3Upload } from "~/config/s3Client";
import { sendOTPSMS } from "~/config/sms";
import DeviceToken from "~/app/models/DeviceToken";

export const google = async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) {
    return res.status(400).json({ message: "Oop, sorry something went wrong with your data." });
  }
  try {
    const resp = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
    const data = resp.data;
    const pwd = await User.generatePassword(`${data.sub}${data.nonce}`);
    const username = `${data.given_name.toLowerCase()}_${data.family_name.toLowerCase()}`;
    const params = {
      phone: "",
      username,
      email: data.email,
      password: pwd,
      provider: "google",
    };
    let account = await User.query().where({ uid: params.uid, provider: "google" }).first();
    if (!account) {
      if (data.email) {
        const user = await User.query().findOne({
          email: data.email,
        });
        if (user) {
          return res.status(400).json({
            message: `Your email is connect with ${user.provider} provider. Please choose difference login method.`,
          });
        }
      }
      const key = generateMD5(`${+new Date()}${data.sub}${data.nonce}`);
      const filePath = `${process.cwd()}/tmp/${key}.jpg`;
      await download.image({
        url: data.picture,
        dest: filePath,
      });
      const s3Key = await s3Upload(filePath, "uploads/avatar/");
      params.profile = s3Key;
      account = await User.query().insertAndFetch(params);
    }

    if (account.status === "blocked") {
      return res.status(400).json({ message: "Your account is blocked!" });
    }

    const token = await generateToken(account);
    return res.status(200).json({ token: token, data: profileSerializer(account) });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
};

export const register = async (req, res) => {
  const { phone, password, username } = req.body;

  if (!phone || !password) {
    return res.status(400).json({ message: "Phone or Password is required" });
  }
  const { countryCode } = helper.getCountryCode(phone);

  if (!isPhoneValid(phone, countryCode)) {
    return res.status(400).json({ message: "Phone is invalid!" });
  }

  const value = trim(phone);

  const users = await User.query().where({ phone: value });

  if (users) {
    const isExisting = users.find(user => user.phone_verify);
    if (isExisting) return res.status(400).json({ message: "Phone is already taken!" });
  }

  if (password.length <= 6) {
    return res.status(400).json({ message: "Password is too short. Minimum 6 character." });
  }

  const pwd = await User.generatePassword(password);

  const params = {
    phone,
    username,
    password: pwd,
    provider: "phone",
  };

  try {
    let account;
    const user = await User.query()
      .where({
        phone: value,
        provider: "phone",
      })
      .first();

    if (user && user.phone_verify) {
      return res.status(400).json({ message: "Your account already exist, please sign in instead." });
    }
    if (user) {
      account = await user.$query().patch(params).returning("*");
    } else {
      account = await User.query().insertAndFetch(params);
    }
    const token = await generateToken(account);
    const otpToken = await OtpToken.query().whereRaw(`created_at > now() - '15 MINUTES'::INTERVAL`).findOne({
      content: phone,
      provider_type: "phone",
    });
    if (!otpToken) {
      // SEND SMS FOR ACCOUNT VERIFICATION
      const code = User.generateOtp();

      await OtpToken.query().insert({
        code,
        content: phone,
        provider_type: "phone",
      });
      sendOTPSMS(phone, code);
    }

    return res.status(200).json({ token: token, data: profileSerializer(account) });
  } catch (err) {
    if (err?.data) {
      return res.status(400).json({ ...err?.data });
    }
    console.log(err);
    res.status(400).json({ message: "Oop, something went wrong." });
  }
};

export const session = async (req, res) => {
  const phone = req.body.phone || "";
  const password = req.body.password || "";
  const errors = {
    success: false,
    message: ["Invalid Phone or Password"],
  };

  if (password.length && phone.length) {
    const value = trim(phone);

    const user = await User.query().where({ phone: value, phone_verify: true }).first();
    if (user) {
      if (user.status != "active") {
        return res.status(400).json({ message: "Your account is blocked!" });
      }
      const isValid = await user.validPassword(password);

      if (isValid) {
        const token = await generateToken(user);
        return res.status(200).json({ token: token, data: profileSerializer(user) });
      }
    }
  }

  res.status(401).json(errors);
};

export const logout = async (req, res) => {
  const { id } = req.decoded;
  const { token_id } = req.body;
  if (token_id) {
    await DeviceToken.query()
      .where({
        user_id: id,
        token_id: token_id,
      })
      .delete();
  }
  await clearSession(req.auth_token);
  res.status(200).json({ message: "Account logout!." });
};

export const verify = (req, res) => {
  res.status(200).json({ data: profileSerializer(req.currentUser) });
};

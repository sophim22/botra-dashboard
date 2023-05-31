import groupBy from "lodash/groupBy";
import User from "~/app/models/User";
import DeviceToken from "~/app/models/DeviceToken";
import { profileSerializer } from "~/app/serializer/user";
import { validationResult } from "express-validator";
import { errorSerialize } from "~/app/validations/api/users";
import dayjs from "dayjs";
import {clearSession} from "~/config/jwt";

export const deviceToken = async (req, res) => {
  try {
    const { token_id: tokenId, uuid } = req.body;
    const token = await DeviceToken.query().findOne({
      token_id: tokenId,
      user_id: req.decoded.id,
    });

    if (!token) {
      await DeviceToken.query().insert({
        token_id: tokenId,
        user_id: req.decoded.id,
        unique_id: uuid,
      });
    }

    res.status(200).json({ message: "success" });
  } catch (error) {
    return res.status(400).json({ message: "Oop, sorry. Something went wrong!" });
  }
};

export const updateProfile = async (req, res) => {
  const body = req.body;
  const avatar = req.file?.filename || req.file?.key;
  const params = {
    username: body.username,
    email: body?.email || "",
  };
  const result = validationResult(req);
  const errors = groupBy(result.errors, "param");
  const errorsMessage = errorSerialize(errors);

  if (result.errors.length) {
    return res.status(400).json(errorsMessage);
  }

  if (avatar) {
    params.profile = avatar;
  }

  let user = await User.query().findById(req.decoded.id);
  await user.$query().patch({ ...params, updated_at: new Date() });

  user = await User.query().findById(req.decoded.id);

  res.status(200).json({ data: profileSerializer(user) });
};

export const profile = async (req, res) => {
  res.status(200).json({ data: profileSerializer(req.currentUser) });
};

export const changePassword = async (req, res) => {
  const body = req.body;
  const result = validationResult(req);
  const errors = groupBy(result.errors, "param");
  const errorsMessage = errorSerialize(errors);

  if (result.errors.length) {
    return res.status(400).json(errorsMessage);
  }
  const pwd = await User.generatePassword(body.password);
  const user = await User.query().findById(req.decoded.id);
  await user.$query().patch({ password: pwd, updated_at: new Date() });

  res.status(200).json({ data: profileSerializer(user) });
};

export const destroy = async (req, res) => {
  const {id} = req.decoded;
  try {
    const user =  await User.query().findById(id);
    if(!user) {
      return res.status(404).json({message: "User not found"})
    }
    const timestamp = dayjs().unix()
    await user.$query().patch({deleted_at: new Date(), email: `${timestamp}_${user.email}`, phone: `${timestamp}_${user.phone}` , username: `${timestamp}_${user.username}`});
    await clearSession(req.auth_token);
    await DeviceToken.query().where({user_id: id}).delete();

    return res.status(200).json({message: "Your account has been successfully deleted!"})
  } catch (error) {
    console.log(error)
    res.status(400).json({message: "Something when wrong"})
  }
}

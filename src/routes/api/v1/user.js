import express from "express";
import authMiddleware from "~/middlewares/auth";
import * as controller from "~/app/controllers/api/v1/users";
import uploader from '~/config/uploader';
import {changePassword, updateProfileValidator} from '~/app/validations/api/users'

require("express-async-errors");

const userRouter = express.Router();

userRouter.route("/").get(authMiddleware, controller.profile);
userRouter.route('/').put(authMiddleware, uploader.single('profile'), updateProfileValidator, controller.updateProfile);
userRouter.route("/").delete(authMiddleware, controller.destroy);
userRouter.route("/devices").post(authMiddleware, controller.deviceToken);
userRouter.route("/passwords").post(authMiddleware, changePassword, controller.changePassword);

export default userRouter;

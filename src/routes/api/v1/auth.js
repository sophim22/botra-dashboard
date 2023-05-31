import express from "express";
import authMiddleware from "~/middlewares/auth";
import * as controller from "~/app/controllers/api/v1/auth";
// import * as passwords from "~/app/controllers/api/v1/passwords";
import * as otp from "~/app/controllers/api/v1/otp_tokens";

require("express-async-errors");

const authRouter = express.Router();

authRouter.route("/").post(controller.session);
authRouter.route("/register").post(controller.register);
authRouter.route("/google").post(controller.google);
authRouter.delete("/logout", authMiddleware, controller.logout);
// authRouter.route("/passwords").post(passwords.requestReset);
// authRouter.route("/passwords").put(passwords.resetPassword);
// authRouter.route("/passwords/code").post(passwords.requestCode);
// authRouter.route("/otp").post(authMiddleware, otp.create);
// authRouter.route("/otp").put(authMiddleware, otp.verify);

export default authRouter;

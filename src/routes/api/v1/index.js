import express from "express";
import authRouter from "./auth";
import homeRouter from "./home";
import userRouter from "./user";
require("express-async-errors");

export const routes = express.Router();

routes.use("/", homeRouter);
routes.use("/auth", authRouter);
routes.use("/users", userRouter);


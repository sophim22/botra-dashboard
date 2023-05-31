import express from "express";
import authRouter from "./auth";
import homeRouter from "./home";
require("express-async-errors");

export const routes = express.Router();

routes.use("/", homeRouter);
routes.use("/auth", authRouter);


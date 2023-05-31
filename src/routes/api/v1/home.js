import express from "express";
import * as controller from "~/app/controllers/api/v1/home";

const homeRouter = express.Router();

homeRouter.route("/").get(controller.index);

export default homeRouter;

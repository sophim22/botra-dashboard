import express from "express";
import expressip from "express-ip";
import csrf from "csurf";
import defaultMiddleware from "../middleware/app";
import homeRouter from "../routes/home";

require("express-async-errors");

export default (app) => {
  const router = express.Router();
  app.use(expressip().getIpInfoMiddleware);
  app.use(csrf({ cookie: true }));
  app.use(defaultMiddleware);
  app.use("/", homeRouter(router));

  app.use((req, res, next) => {
    return res.render("404", { message: "Route" + req.url + " Not found." });
  });

  app.use((err, req, res, next) => {
    if (err.code === "EBADCSRFTOKEN") {
      if (
        req.headers &&
        req.headers.accept &&
        req.headers.accept.includes("application/json")
      ) {
        return res.status(400).json({ message: err.message });
      }
      req.flash("error", { message: err.message });
      return res.redirect("/");
    }
    console.log(`===================================`);
    console.log(err);
    console.log(`===================================`);
    return res.render("500", { message: err.message });
  });
};

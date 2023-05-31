
import requestIp from "request-ip";
import expressip from "express-ip";
import { routes } from "../routes/api/v1";
import defaultMiddleware from "~/middlewares/app";
import homeRouter from "../routes/dashboard/home";
import csrf from "csurf";
require("express-async-errors");

export default app => {
  app.use(requestIp.mw());
  app.use(expressip().getIpInfoMiddleware);
  app.use("/v1", routes);

  app.use(csrf({ cookie: true }));
  app.use(defaultMiddleware);
  app.use("/", homeRouter);
  app.use((req, res, next) => {
    return res.render("404", { message: "Route" + req.url + " Not found." });
  });

  app.use((err, req, res, next) => {
    if (err.code === "EBADCSRFTOKEN") {
      if (req.headers && req.headers.accept && req.headers["content-type"]?.includes("application/json")) {
        return res.status(400).json({ message: err.message });
      }
      req.flash("error", { message: err.message });
      return res.redirect("/");
    }
    console.log(`===================================`);
    console.log(err);
    console.log(`===================================`);
    console.log(req.headers);
    if (req.headers && req.headers.accept && req.headers["content-type"]?.includes("application/json")) {
      return res.status(500).json({ message: err.message });
    }
    return res.render("500", { message: err.message });
  });
};

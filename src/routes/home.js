import Home from "../app/controllers/home";

export default (router) => {
  router.get("/", Home.index);
  return router;
};

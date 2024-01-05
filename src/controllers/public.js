import { Router } from "express";

import authHandler from "./auth.js";

const router = Router();

const routes = [
  {
    path: "/auth",
    requestHandler: authHandler,
  }
];

routes.forEach((route) => {
  router.use(route.path, route.requestHandler);
});

export default router;

import { Router } from "express";

import authHandler from "./auth.js";
import booksHandler from "./books.js";

const router = Router();

const routes = [
  {
    path: "/auth",
    requestHandler: authHandler,
  },
  {
    path: "/books",
    requestHandler: booksHandler,
  }
];

routes.forEach((route) => {
  router.use(route.path, route.requestHandler);
});

export default router;

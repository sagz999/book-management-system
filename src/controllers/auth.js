import { Router } from "express";

const auth = Router();

auth.post("/signup", async (req, res, next) => {
  try {
    return res.status(403).json({ message: "Signup" })
  } catch (err) {
    return next(err);
  }
});

auth.post("/login", async (req, res, next) => {
  try {
    return res.status(403).json({ message: "Login" })
  } catch (err) {
    return next(err);
  }
});

export default auth;

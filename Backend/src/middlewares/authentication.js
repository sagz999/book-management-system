import jwt from "jsonwebtoken";
import HttpError from "../utils/HttpError.js";

const jwtSecretKey = process.env.JWT_SECRET;

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (
    (req.originalUrl === "/api/auth/login" ||
      req.originalUrl === "/api/auth/signup") &&
    !token
  )
    return next();

  if (!token) {
    throw new HttpError(401, { message: "Unauthorized" });
  }

  jwt.verify(token, jwtSecretKey, (err, user) => {
    if (err) throw new HttpError(401, { message: "Invalid token" });
    req.user = user;
    next();
  });
};

export default {};

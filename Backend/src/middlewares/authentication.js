import jwt from "jsonwebtoken";
import HttpError from "../utils/HttpError.js";

const jwtSecretKey =  process.env.JWT_SECRET ?? 'fabc4842baa614703de304efff8c9db3c2ba8a97cc8f8f1ae745c25304459178'

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) throw new HttpError(401,{ message: "Unauthorized" });
  next()

  jwt.verify(token, jwtSecretKey, (err, user) => {
    if (err) throw new HttpError(401,{ message: "Invalid token" });
    console.log("user",user);
    req.user = user;
    next();
  });
};

export default {};

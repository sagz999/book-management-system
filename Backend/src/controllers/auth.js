import { Router } from "express";

import { createUser, logInUser } from "../libs/auth.js";
import { authDto } from "../dto/auth.js";
import HttpError from "../utils/HttpError.js";
import HttpRes from '../utils/HttpRes.js'


const auth = Router();

auth.post("/signup", async (req, res, next) => {
  try {

    if (!authDto(req.body)) throw new HttpError(400, authDto.errors)

    const credentials = req.body
    const token = await createUser(credentials)

    const response = new HttpRes(201, {token})
    return res.status(response.status).send(response)

  } catch (err) {
    return next(err);
  }
});

auth.post("/login", async (req, res, next) => {
  try {

    if (!authDto(req.body)) throw new HttpError(400, authDto.errors)

    const credentials = req.body
    const token = await logInUser(credentials)
    const response = new HttpRes(200, {token})
    return res.status(response.status).send(response)
  } catch (err) {
    return next(err);
  }
});

export default auth;

import { Router } from "express";

const books = Router();

books.post("/publish", async (req, res, next) => {
  try {

  } catch (err) {
    return next(err);
  }
});

books.get("/search", async (req, res, next) => {
  try {
    console.log("hello");
  } catch (err) {
    return next(err);
  }
});

books.put("/unpublish/:bookId", async (req, res, next) => {
  try {
  } catch (err) {
    return next(err);
  }
});

books.get("/user", async (req, res, next) => {
  try {
  } catch (err) {
    return next(err);
  }
});

books.get("/published", async (req, res, next) => {
  try {
  } catch (err) {
    return next(err);
  }
});

export default books;

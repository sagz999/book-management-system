import { Router } from "express";

import HttpRes from "../utils/HttpRes.js";
import HttpError from "../utils/HttpError.js";

import {
  getUserPublishedBooks,
  publishBook,
  searchBooks,
  unpublishBook,
} from "../libs/books.js";
import { publishBookDto } from "../dto/books.js";
import { getBooks, getBooksCount } from "../dbContext/books.js";

const books = Router();

books.post("/publish", async (req, res, next) => {
  try {
    if (!publishBookDto(req.body))
      throw new HttpError(400, publishBookDto.errors);

    const bookData = {
      title: req.body.title,
      author:req.body.author,
      user: req.user,
    };

    const bookId = await publishBook(bookData);

    const response = new HttpRes(201, {
      message: `Book published. BookId:${bookId}`,
    });
    return res.status(response.status).send(response);
  } catch (err) {
    return next(err);
  }
});

books.get("/search", async (req, res, next) => {
  try {
    const params = {
      searchKey: req.query.title,
    };

    const books = await searchBooks(params);

    const response = new HttpRes(200, books);
    return res.status(response.status).send(response);
  } catch (err) {
    return next(err);
  }
});

books.put("/unpublish/:bookId", async (req, res, next) => {
  try {
    const params = {
      bookId: req.params.bookId,
      user: req.user,
    };
    
    if (!params.bookId) throw new HttpError(400, { message: "Invalid bookId" });

    await unpublishBook(params);

    const response = new HttpRes(200, {
      message: `Unpublished Book:${params.bookId}`,
    });
    return res.status(response.status).send(response);
  } catch (err) {
    return next(err);
  }
});

books.get("/user", async (req, res, next) => {
  try {
    const user = req.user;
    const books = await getUserPublishedBooks(user);
    const response = new HttpRes(200, books);
    return res.status(response.status).send(response);
  } catch (err) {
    return next(err);
  }
});

books.get("/published", async (req, res, next) => {
  try {
    let perPage = 10;
    let page = 1;

    if (req.query.page === "all" || !req.query.page  ) {
      perPage = null;
      page = "all";
    } else {
      perPage = parseInt(req.query.per_page, 10) || 10;
      page = parseInt(req.query.page, 10) || 1;
    }

    const offset = page !== "all" ? parseInt(perPage * (page - 1), 10) : 0;
    const limit = page !== "all" ? parseInt(perPage, 10) : 0;

    const pagination = {
      skip: offset,
      limit: limit,
    };
    const books = await getBooks(
      { published: true },
      { sort: { _id: -1 } },
      pagination
    );
    const response = new HttpRes(200, books);
    return res.status(response.status).send(response);
  } catch (err) {
    return next(err);
  }
});

books.get("/published/counts", async (req, res, next) => {
  try {
    const counts = await getBooksCount(
      { published: true }
    );
    const response = new HttpRes(200, counts);
    return res.status(response.status).send(response);
  } catch (err) {
    return next(err);
  }
});

export default books;

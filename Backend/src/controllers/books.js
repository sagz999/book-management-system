import { Router } from "express";

import HttpRes from '../utils/HttpRes.js'
import HttpError from "../utils/HttpError.js";

import { getUserPublishedBooks, publishBook, searchBooks, unpublishBook } from "../libs/books.js";
import { publishBookDto } from "../dto/books.js";
import { getBooks } from "../dbContext/books.js";




const books = Router();

books.post("/publish" ,async (req, res, next) => {
  try {
    // if (!publishBookDto(req.body)) throw new HttpError(400, publishBookDto.errors)

    const bookData = {
  title:req.body.title,
  user:req.user ?? req.body.user
  }

  console.log("body",req.body);
  console.log("user",req.user);


  const bookId = await publishBook(bookData)

  const response = new HttpRes(201, {message:`Book published. BookId:${bookId}`})
    return res.status(response.status).send(response)

  } catch (err) {
    return next(err);
  }
});

books.get("/search", async (req, res, next) => {
  try {

    const params ={
      searchKey : req.query.title,
      user:req.user

    }

    const books = searchBooks(params)
    const response = new HttpRes(201, books)
    return res.status(response.status).send(response)

  } catch (err) {
    return next(err);
  }
});

books.put("/unpublish/:bookId", async (req, res, next) => {
  try {
    if (!editBookDto(req.body)) throw new HttpError(400, editBookDto.errors)

    const bookId = req.params.bookId
    await unpublishBook(bookId)
    const response = new HttpRes(200, {message:`Unpublished Book:${bookId}`})
    return res.status(response.status).send(response)

  } catch (err) {
    return next(err);
  }
});

books.get("/user", async (req, res, next) => {
  try {
    const user = req.user
    const books =  await getUserPublishedBooks(user)
    const response = new HttpRes(200, books)
    return res.status(response.status).send(response)
  } catch (err) {
    return next(err);
  }
});

books.get("/published", async (req, res, next) => {
  try {

    const books = await getBooks({published:true})
    const response = new HttpRes(200, books)
    return res.status(response.status).send(response)
  } catch (err) {
    return next(err);
  }
});

export default books;

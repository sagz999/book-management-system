import { ObjectId } from "mongodb";

import { addBook, getBook } from "../dbContext/books.js";
import HttpError from "../utils/HttpError.js";

export const publishBook = async (bookData) => {
  const { title, user } = bookData;

  console.log("bookData==>", bookData);

  const book = await getBook({ title, published: true });
  if (book)
    throw new HttpError(409, {
      message: "Book with same title is already published",
    });

  const bookObj = {
    title,
    user_id: user?.user_id ?? user,
    published: true,
    published_on: new Date(),
  };

  const { insertedId: bookId } = await addBook(bookObj);

  return bookId?.toString();
};

export const searchBooks = async (params) => {
  const { searchKey, user } = params;

  return getBook({
    title: new RegExp(searchKey, "i"),
    user_id: user?._id?.toString(),
  });
};

export const unpublishBook = async (bookId) => {
  return updateBook(
    { _id: new ObjectId(bookId) },
    { $set: { published: false } }
  );
};

export const getUserPublishedBooks = async (user) => {
  return getBook({ user_id: user?._id?.toString(), publiched: true });
};

export default {};

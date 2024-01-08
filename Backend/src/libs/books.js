import { ObjectId } from "mongodb";

import { addBook, getBook, getBooks, updateBook } from "../dbContext/books.js";
import HttpError from "../utils/HttpError.js";

export const publishBook = async (bookData) => {
  const { title, user,author } = bookData;

  const book = await getBook({ title,author, published: true });
  if (book)
    throw new HttpError(409, {
      message: "Book is already published",
    });

  const bookObj = {
    title,
    author,
    published_by: user?.user_id,
    published: true
  };

  const { insertedId: bookId } = await addBook(bookObj);

  return bookId?.toString();
};

export const searchBooks = async (params) => {
  const { searchKey } = params;

  return getBook({
    title: new RegExp(searchKey, "i"),
    published:true,
  });
};

export const unpublishBook = async (params) => {
  const { bookId, user } = params;

  return updateBook(
    { _id: new ObjectId(bookId), published_by: user?.user_id },
    { $set: { published: false } }
  );
};

export const getUserPublishedBooks = async (user) => {
  return getBooks({ published_by: user?.user_id, published: true });
};

export default {};

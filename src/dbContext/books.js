import mongoClient from "./mongo.js";

export const addBook = (bookData) => mongoClient.insertOne("books", bookData);

export const getBooks = (
  filters,
  options = {},
  pagination = { skip: 0, limit: 0 }
) =>
  mongoClient
    .findMany("books", filters, options)
    .skip(pagination.skip)
    .limit(pagination.limit)
    .toArray();

export const updateBook = (filters, update) => {
  mongoClient.updateOne("books", filters, update);
};

export default {}


import mongoClient from "./mongo.js";

export const addBook = async (bookData) => mongoClient.insertOne("books", bookData);

export const getBook = async (filters) => mongoClient.findOne("books", filters);

export const getBooks = async(
  filters,
  options = {},
  pagination = { skip: 0, limit: 0 }
) =>
  mongoClient
    .findMany("books", filters, options)
    .skip(pagination.skip)
    .limit(pagination.limit)
    .toArray();

export const updateBook =async (filters, update) => {
  mongoClient.updateOne("books", filters, update);
};

export default {}


/* eslint-disable no-console */
import { MongoClient, MongoError } from 'mongodb'

const url = process.env.MONGO_CONNECTION_URL ?? 'mongodb://localhost:27017'
const DATABASE_NAME = process.env.DB_NAME ?? 'Books'
const ARCHIVE_COLLECTION_NAME = process.env.ARCHIVE_COLL_NAME ?? 'archive'

/**
 *
 */
class DbClient {
  /** @type {import('../../node_modules/mongodb/mongodb.js').Db} */
  db

  /** @type {import('../../node_modules/mongodb/mongodb.js').MongoClient} */
  client

  constructor() {
    this.client = new MongoClient(url, {
      appName: 'intracity',
      connectTimeoutMS: 5 * 1000,
      maxIdleTimeMS: 5 * 60 * 1000,
      maxPoolSize: 20,
      minPoolSize: 5,
      compressors: 'zlib',
      zlibCompressionLevel: 6,
      readPreference: 'secondaryPreferred'
    })
  }

  async start() {
    await this.client.connect()
    console.log(`[${new Date().toISOString()}] [INFO] local - Mongo db connection established`)
    this.db = this.client.db(DATABASE_NAME)
  }

  /**
   *
   * @param {string} coll Name of the database
   * @param {Filter<Document>} filter
   * @param {UpdateFilter<Document>} update
   * @param {UpdateOptions} options
   */
  updateMany(coll, filter, update, options = {}) {
    return this.db.collection(coll).updateMany(
      filter,
      {
        ...update,
        $set: {
          ...update.$set,
          updatedAt: new Date()
        }
      },
      options
    )
  }

  /**
   *
   * @param {string} coll Name of the database
   * @param {import('../../node_modules/mongodb/mongodb.js').Filter} filter
   * @param {import('../../node_modules/mongodb/mongodb.js').UpdateFilter} update
   * @param {import('../../node_modules/mongodb/mongodb.js').UpdateOptions} options
   * @returns {Promise<import('../../node_modules/mongodb/mongodb.js'>).UpdateResult}
   */
  updateOne(coll, filter, update, options = {}) {
    return this.db.collection(coll).updateOne(
      filter,
      {
        ...update,
        $set: {
          ...update.$set,
          updatedAt: new Date()
        }
      },
      options
    )
  }

  /**
   *
   * @param {string} coll Name of the database
   * @param {import('../../node_modules/mongodb/mongodb.js').Filter} filter
   * @param {import('../../node_modules/mongodb/mongodb.js').UpdateFilter} update
   * @param {import('../../node_modules/mongodb/mongodb.js').FindOneAndUpdateOptions} options
   * @returns {Promise<import('../../node_modules/mongodb/mongodb.js').ModifyResult>}
   */
  findOneAndUpdate(coll, filter, update, options) {
    return this.db.collection(coll).findOneAndUpdate(
      filter,
      {
        ...update,
        $set: {
          ...update.$set,
          updatedAt: new Date()
        }
      },
      options
    )
  }

  /**
   *
   * @param {string} coll
   * @param {*} docs
   * @param {import('../../node_modules/mongodb/mongodb.js').BulkWriteOptions} options
   * @returns {Promise<import('../../node_modules/mongodb/mongodb.js').InsertManyResult>>}
   */
  insertMany(coll, docs, options) {
    return this.db.collection(coll).insertMany(
      docs.map(doc => ({
        ...doc,
        createdAt: new Date()
      })),
      options
    )
  }

  /**
   *
   * @param {string} coll
   * @param {*} doc
   * @param {BulkWriteOptions} options
   */
  insertOne(coll, doc, options) {
    return this.db.collection(coll).insertOne(
      {
        ...doc,
        createdAt: new Date()
      },
      options
    )
  }

  /**
   *
   * @param {string} coll name of the collection
   * @param {import('../../node_modules/mongodb/mongodb.js').Filter} filter
   * @param {import('../../node_modules/mongodb/mongodb.js').FindOptions} options
   * @returns {import('../../node_modules/mongodb/mongodb.js').FindCursor<any>}
   */
  findMany(coll, filter, options) {
    return this.db.collection(coll).find(filter, options)
  }

  /**
   *
   * @param {string} coll name of the collection
   * @param {*} filter
   * @returns
   */
  findOne(coll, filter, options) {
    return this.db.collection(coll).findOne(filter, options)
  }

  /**
   *
   * @param {string} coll name of the collection
   * @param {*} filter
   * @returns
   */
  count(coll, filter) {
    return this.db.collection(coll).countDocuments(filter)
  }

  /**
   *
   * @param {string} coll name of the collection
   * @param {*} filter
   * @param {*} options
   */
  async archive(coll, filter, options) {
    const session = this.client.startSession()
    try {
      session.startTransaction()

      const docs = await this.client
        .db(DATABASE_NAME)
        .collection(coll)
        .find(filter, { ...options, session })
        .toArray()

      await this.client
        .db(DATABASE_NAME)
        .collection(ARCHIVE_COLLECTION_NAME)
        .insertMany(
          docs.map(doc => ({
            ...doc,
            archivedAt: new Date(),
            collectionName: coll
          })),
          { session }
        )

      await this.client.db(DATABASE_NAME).collection(coll).deleteMany(filter, { session })

      await session.commitTransaction()
    } catch (error) {
      if (error instanceof MongoError && error.hasErrorLabel('UnknownTransactionCommitResult')) {
        // add your logic to retry or handle the error
      } else if (error instanceof MongoError && error.hasErrorLabel('TransientTransactionError')) {
        // add your logic to retry or handle the error
      } else
        console.error(`An error occurred in the transaction, performing a data rollback:${error}`)

      await session.abortTransaction()
    } finally {
      await session.endSession()
    }
  }

  /**
   *
   * @param {string} coll
   * @param {Document[]} pipeline
   * @param {AggregateOptions} options
   */
  aggregate(coll, pipeline, options) {
    return this.db.collection(coll).aggregate(pipeline, options)
  }

  /**
   *
   * @param {string} coll
   * @param {string} id
   *
   */
  async deleteOne(coll, id) {
    return this.db.collection(coll).deleteOne(id)
  }

  /**
   *
   * @param {string} coll
   * @param {string[]} id
   * @returns {Promise<import('../../node_modules/mongodb/mongodb.js').DeleteResult>}
   */
  async deleteMany(coll, id) {
    return this.db.collection(coll).deleteMany(id)
  }

  async createSession() {
    const session = this.client.startSession()
    return session
  }
}

//  create a index on the collection
export const createIndex = async (coll, index) => {
  const client = new DbClient()
  await client.start()
  await client.db.collection(coll).createIndex(index, { unique: true })
}

export default new DbClient()

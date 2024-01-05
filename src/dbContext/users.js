import mongoClient from './mongo.js'

export const insertUser = userData => mongoClient.insertOne('users', userData)

export default {}

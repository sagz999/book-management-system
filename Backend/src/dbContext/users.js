import mongoClient from './mongo.js'

export const addUser = async userData => mongoClient.insertOne('users', userData)
export const getUser = async filters => mongoClient.findOne('users', filters)


export default {}

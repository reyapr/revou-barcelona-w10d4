const { MongoClient } = require('mongodb')

const databaseMiddleware = async (req, res, next) => {
  const mongoClient = await new MongoClient('mongodb://127.0.0.1:27017').connect()
  db = mongoClient.db('revou-d2')
  
  req.db = db
  
  next()
}

module.exports = databaseMiddleware
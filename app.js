const MongoClient = require('mongodb').MongoClient
const assert = require('assert')
const express = require("express")

// Connection URL, DB, collection
const url = 'mongodb://api:hoge22@mongo:27017/?authMechanism=SCRAM-SHA-1&authSource=laxury'
const dbName = 'laxury'
const collectionName = "bill"

// Setup express
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Get connection
let collection
const connectOption = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}
MongoClient.connect(url, connectOption, (err, client) => {
  if (err) {
    console.log(err);
    return;
  }
  const db = client.db(dbName);
  collection = db.collection(collectionName);
  app.listen(3000, () => console.log('server starts listening 3000'))
})

// Routing
app.get('/laxury/latest', async (req, res) => {
  const count = await collection.countDocuments() - 1
  collection.find().skip(count).toArray()
    .then(bill => res.send(bill))
    .catch(err => {
      console.log(err)
      res.status(500).send()
    })
})

app.get('/laxury/all', (req, res) => {
  collection.find().toArray()
    .then(bill => res.send(bill))
    .catch(err => {
      console.log(err)
      res.status(500).send()
    })
})

app.post('/laxury/regist', (req, res) => {
  const date = req.body.date
  const item = req.body.item
  collection.insertOne({ _id: date, name: item })
    .then(() => res.send('registration succeeded'))
    .catch(err => {
      console.log(err)
      if (err.code == 11000) res.send('already registered')
      else res.status(500).send()
    })
})
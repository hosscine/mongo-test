const MongoClient = require('mongodb').MongoClient
const assert = require('assert')
const express = require("express")

// Connection URL, DB, collection
const url = 'mongodb://api:hoge22@localhost:27017/?authMechanism=SCRAM-SHA-1&authSource=laxury'
const dbName = 'laxury'
const collectionName = "bill"

// get connection
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

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

app.get('/laxury/latest', async (req, res) => {
  const option = { $group: { _id: '', last: { $max: "$_id" } } }
  try {
    const bill = await collection.aggregate(option).toArray()
    console.log(bill)
    res.send(bill)
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
})

app.get('/laxury/all', async (req, res) => {
  const option = { $group: { _id: '', last: { $max: "$_id" } } }
  try {
    const bill = await collection.find({}).toArray()
    res.send(bill)
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
})

app.post('/laxury/regist', async (req, res) => {
  const date = req.body.date
  const item = req.body.item
  try {
    collection.insertOne({ _id: date, item: item })
    res.render('regist', { action: req.path, message: 'registration is success' }).send()
  } catch (err) {
    console.log(err, err.code)
    if (err.code == 11000) res.status(208).send("already registered")
    else res.status(500).send()
    res.status(208).send("already registered")
  }
})
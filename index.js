const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mps7w.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

// middle wares
app.use(bodyParser.json());
app.use(cors());

const port = 5000
// console.log(process.env.DB_NAME)


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emaJohnStore").collection("products");
    // console.log('database connected');

    // api, adding items
    // getting the data from client admin side
    app.post('/addProduct', (req, res) => {
        const products = req.body;
        // console.log(products);
        productsCollection.insertOne(products)
        .then(result => {
            console.log(result.insertedCount);
            res.send(result.insertedCount);
        })
    })

    app.get('/products', (req, res) => {
      productsCollection.find({})
      .toArray( (err, documents) => {
        res.send(documents);
      })
    })

    app.get('/product/:key', (req, res) => {
      productsCollection.find({key: req.params.key})
      .toArray( (err, documents) => {
        res.send(documents[0]);
      })
    })

    app.post('/productsByKeys', (req, res) => {
      const productkeys = req.body;
      productsCollection.find({key: {$in: productkeys} })
      .toArray((err, documents) => {
        res.send(documents);
      })
    })
});

app.get('/', (req, res) => {
    res.send('Hello World!')
  })


app.listen(port)
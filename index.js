const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

// middleware
app.use(cors());
app.use(express.json());

// database connection and functionalties
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qkxnppv.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    // Establish and verify connection
      const menuCollection = client.db("restroDB").collection("menu");
      const contactCollection = client.db("restroDB").collection("contact");
      const cartCollection = client.db("restroDB").collection("carts");




    // all get request
    //menu collection for get request
    app.get('/menu', async (req, res) => {
      const cursor = menuCollection.find({});
      const menu = await cursor.toArray();
      res.send(menu);
    });
    // cart collection for get request
    app.get('/carts', async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await cartCollection.find(query).toArray();
      res.send(result);
    });

    // all post request
    //contact collection for post request
    app.post('/contact', async (req, res) => {
      const newContact = req.body;
      const result = await contactCollection.insertOne(newContact);
      res.json(result);
    });

    //cart collection for post request
    app.post('/carts', async (req, res) => {
      const cartItem = req.body;
      const result = await cartCollection.insertOne(cartItem);
      res.send(result);
    });


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



// route
app.get ('/', (req, res) => {
    res.send('Retro`s server is running');
});

// listen
app.listen(port, () => {
    console.log(`Retro's server is running on port: ${port}`);
});
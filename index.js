const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const port = process.env.PORT || 5000;

//middle ware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dw55m.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const serviceCollection = client.db("fastCityDB").collection("services");
    const bookedCollection = client.db("fastCityDB").collection("booked");


    app.get('/allServices', async (req, res) => {
        const result = await serviceCollection.find({}).toArray();
        res.send(result);
    })

    app.get('/booking/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await serviceCollection.findOne(query);
        res.send(result);
    })

    app.post('/booking', async (req, res) => {
        const cursor = req.body;
        const result = await bookedCollection.insertOne(cursor);
        res.send(result);
    })

    // Get my booking
    app.get('/orders/:email', async(req, res) =>{
        bookedCollection.find({email: req.params.email})
        .toArray((err, results)  =>{
            res.send(results);
        })
    })

    // client.close();
});


app.get('/', (req, res) => {
    res.send("Fast City Server is Running...");
})

app.listen(port, () => {
    console.log("Fast City Server is running on port: ", port);
})
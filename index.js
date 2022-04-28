const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// use middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.41efc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

async function run() {
    try {
        await client.connect();
        const serviceCollection = client.db("geniusCar").collection("service");
        const orderCollection = client.db("geniusCar").collection("order");

        // get
        app.get("/services", async(req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });
        // get single data
        app.get("/services/:id", async(req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            console.log(query);
            const result = await serviceCollection.findOne(query);
            res.send(result);
        });

        // delete
        app.delete("/services/:id", async(req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.deleteOne(query);
            res.send(result);
        });
        // post
        app.post("/services", async(req, res) => {
            // const id = req.params.id;
            const service = req.body;
            console.log(service);
            const result = await serviceCollection.insertOne(service);
            res.send(result);
        });

        // put / update
        app.put("/services/:id", async(req, res) => {
            const updateId = req.params.id;
            const updateService = req.body;
            const updateDoc = {
                $set: {
                    name: updateService.name,
                    description: updateService.description,
                    price: updateService.price,
                    img: updateService.img,
                },
            };
            const filter = { _id: ObjectId(updateId) };
            const options = { upsert: true };
            const result = await serviceCollection.updateOne(
                filter,
                updateDoc,
                options
            );
            res.json(result);
        });

        // orders post added 
        app.post('/ordersDetail', async(req, res) => {
                const order = req.body;
                // console.log(order)
                const result = await orderCollection.insertOne(order);
                res.send(result);
            })
            // get order 
        app.get('/orders', async(req, res) => {
            const email = req.query.email;
            const query = { email };
            console.log(query)
            const cursor = orderCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders)
        })


    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


// root method
app.get('/', (req, res) => {
    res.send("Genius car sevice server is running.........")
})

app.listen(port, () => {
    console.log("Listening to port", port);
});
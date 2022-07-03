const express = require('express')
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kfi6xss.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const tasksCollection = client.db('to_do_list').collection('tasks');


        //?---------------Get Api-------------------*/
        app.get("/addtask", async (req, res) => {
            const task = await tasksCollection.find({}).toArray();
            res.send(task);
        });

        app.get('/addtask/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const tasks = await tasksCollection.find(query).toArray();
            res.send(tasks);
        });

        app.post("/addtask", async (req, res) => {
            const data = req.body;
            const result = await tasksCollection.insertOne(data);
            res.send(result);
        });

        app.delete("/addtask/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await tasksCollection.deleteOne(query);
            res.send(result);
        });

        app.get("/complete/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await tasksCollection.findOne(query);
            res.send(result);
        });
        app.get("/completed-task", async (req, res) => {
            const id = req.params.id;
            const query = { complete: true };
            const result = await tasksCollection.find(query).toArray();
            res.send(result);
        });
        app.put("/completed-task/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const updatedData = {
                $set: { complete: true },
            };
            const result = await tasksCollection.updateOne(filter, updatedData);
            res.send(result);
        });

        app.patch("/edit-task/:id", async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            const filter = { _id: ObjectId(id) };
            const updatedData = {
                $set: data,
            };
            const result = await tasksCollection.updateOne(filter, updatedData);
            res.send(result);
        });

        app.get("/edittask/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await tasksCollection.findOne(query);
            res.send(result);
        });
    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
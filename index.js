require("dotenv").config();
const { response } = require("express");
const express = require("express");
const app = express();
const {MongoClient, ObjectId} = require("mongodb");
const DATABASE_NAME = "crud";

app.use(express.json());

let db;

const todoAppRoutes = express.Router();

// READ
todoAppRoutes.route("/").get((req, res)=>{
    db.collection("todos")
        .find()
        .toArray((err, items)=>{
            res.send(items)
        })
})

// CREATE
todoAppRoutes.route("/add").post((req, res) => {
    const doObject = req.body;
    db.collection("todos").insertOne(doObject, (err, info) => {
        res.json(info);
    })
});

// UPDATE
todoAppRoutes.route("/update/:id").put((req, res)=>{
    const recordId = req.params.id;
    const body = req.body;
    db.collection("todos").findOneAndUpdate({
        _id: new ObjectId(recordId)
    }, {
        $set: {
            todo_description: body.todo_description,
            todo_responsible: body.todo_responsible,
            todo_priority: body.todo_priority,
            todo_completed: body.todo_completed
        }
    }, ()=> {
        res.send("updated successfully!")
    })
})

// DELETE
todoAppRoutes.route("/delete/:id").delete((req, res)=>{
    const todoId = req.params.id;
    db.collection("todos").deleteOne({
        _id: new ObjectId(todoId)
    }, ()=>{
        res.send("Deleted Successfully!")
    })
})

app.use("/todos", todoAppRoutes);

MongoClient.connect(
    process.env.MONGO_URL,
    {useNewUrlParser: true},
    (error, client) => {
        if(error) {
            console.log("Connection Failed!");
            console.log(error.message);
            return
        } else {
            console.log("connection established!");
            db = client.db(DATABASE_NAME);
            startHttpServer()
        }
    }
)

function startHttpServer() {
    app.listen(process.env.SERVER_PORT, () => {
        console.log("Server is running on port", process.env.SERVER_PORT)
    })
}
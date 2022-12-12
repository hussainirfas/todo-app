require("dotenv").config();
const express = require("express");
const app = express();
const {MongoClient, ObjectId} = require("mongodb");
const DATABASE_NAME = "crud";

let db;

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
            client.db(DATABASE_NAME)
        }
    }
)

function startHttpServer() {
    app.listen(process.env.SERVER_PORT, () => {
        console.log("Server is running on port", process.env.SERVER_PORT)
    })
}
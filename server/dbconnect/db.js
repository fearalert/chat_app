const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const connection = () => {
    mongoose.connect(process.env.MONGO_DB_URI,{
        dbName: "chat-app"
    }).then(() => {
        console.log("Connected to MongoDB");
    }).catch((err) => {
        console.log(`Error while connecting MongoDB ${err}`);
    })
}

module.exports = connection;
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const connection = () => {
    mongoose.connect(process.env.MONGO_DB_URI,{
        // mongoose.connect(`mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.75n35.mongodb.net/`,{
        dbName: "chat-app"
    }).then(() => {
        console.log("Connected to MongoDB");
    }).catch((err) => {
        console.log(`Error while connecting MongoDB ${err}`);
    })
}

module.exports = connection;
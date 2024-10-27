const express = require("express");
const cors = require("cors");
const connection = require("./dbconnect/db");
const socketconnect = require("./socket/socket");
const msgRouter = require("./routes/messageRoutes");
const userRouter = require("./routes/authRoutes");

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(express.json());

connection();

app.use("/api/auth", userRouter);
app.use("/api/messages", msgRouter);

app.get("/working", (_req, res) => {
    return res.status(200).json({ msg: "Working Successfully" });
});

const portNumber = process.env.PORT ? process.env.PORT : 3000;

const server = app.listen(portNumber, () =>
    console.log(`Server started on ${portNumber}`)
);

socketconnect(server);
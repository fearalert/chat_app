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
    return res.json({ msg: "Working Successfully" });
  });

const server = app.listen(process.env.PORT, () =>
    console.log(`Server started on ${process.env.PORT}`)
);

socketconnect(server);
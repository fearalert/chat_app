const { addMessage, getMessages } = require("../controllers/messageController");

const msgRouter = require("express").Router();

msgRouter.post("/addmsg/", addMessage);
msgRouter.post("/getmsg/", getMessages);

module.exports = msgRouter;
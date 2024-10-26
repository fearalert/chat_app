const socket = require("socket.io");
const cors = require("cors");

require("dotenv").config();

const socketconnect = (server) =>{
    const io = socket(server, {
        cors: {
          origin: "http://localhost:5173",
          credentials: true,
        },
      });
      
      global.onlineUsers = new Map();
      io.on("connection", (socket) => {
        console.log("Socket Connection");
        global.chatSocket = socket;
        socket.on("add-user", (userId) => {
          onlineUsers.set(userId, socket.id);
        });
      
        socket.on("send-msg", (data) => {
          const sendUserSocket = onlineUsers.get(data.to);
          if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-recieve", data.msg);
          }
        });
      });
}

module.exports = socketconnect;
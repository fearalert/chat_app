const socket = require("socket.io");

require("dotenv").config();
const socketconnect = (server) =>{
    const io = socket(server, {
        cors: {
          origin: process.env.FRONT_END_URL,
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
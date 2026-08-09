const { Server } = require("socket.io");
const registerEventRoomHandlers = require("./eventRoom.socket.js");

let ioInstance = null;

const initSocket = (server) => {
  ioInstance = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"],
    },
  });

  ioInstance.on("connection", (clientSocket) => {
    console.log(`Client connected! Socket ID: ${clientSocket.id}`);

    // Register room join/leave/disconnect handlers for this connected socket
    registerEventRoomHandlers(ioInstance, clientSocket);

    clientSocket.on("disconnect", () => {
      console.log(`Client disconnected! Socket ID: ${clientSocket.id}`);
    });
  });

  return ioInstance;
};

const getIo = () => {
  if (!ioInstance) {
    throw new Error("Socket.io has not been initialized!");
  }
  return ioInstance;
};

module.exports = { initSocket, getIo };

const { Server } = require("socket.io");

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

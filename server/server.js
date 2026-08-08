require("dotenv").config();
const connectDB = require("./src/config/db.js");
const app = require("./app.js");
const http = require("http");
const { initSocket } = require("./src/sockets/index.js");

const server = http.createServer(app);
initSocket(server);

const PORT = process.env.PORT || 3001;
const startServer = async () => {
  await connectDB();

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();

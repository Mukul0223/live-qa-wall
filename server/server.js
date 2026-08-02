require("dotenv").config();
const connectDB = require("./src/config/db.js");
const app = require("./app.js");

const PORT = process.env.PORT || 3001;
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/api/health", (req, res) => {
  const timestamp = new Date().toISOString()
  res.json({
    message: `Server working`,
    timestamp: timestamp,
});
});

module.exports = app

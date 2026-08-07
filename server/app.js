const express = require("express");
const cors = require("cors");
require("dotenv").config();

const errorHandler = require("./src/middleware/error.middleware.js");
const authRoutes = require("./src/routes/auth.routes.js");
const eventRoutes = require("./src/routes/event.routes.js");
const questionRoutes = require("./src/routes/question.routes.js");

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
  const timestamp = new Date().toISOString();
  res.json({
    message: `Server working`,
    timestamp: timestamp,
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/questions", questionRoutes);

app.use(errorHandler);

module.exports = app;

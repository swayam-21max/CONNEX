const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const contactRoutes = require("./routes/contactRoutes");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/contactsdb";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    isConnected = true;
  } catch (err) {
    console.error(`❌ MongoDB connection failed: ${err.message}`);
    throw err;
  }
};

connectDB().catch((err) => {
  console.error("Could not connect to MongoDB on startup:", err.message);
});

const allowedOrigins = [
  "http://localhost:5173",
  "https://connex-tau.vercel.app",
  "https://connex-g2r2.vercel.app",
  ...(process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
    : []),
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error(`CORS: origin '${origin}' is not allowed`));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
  }),
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ success: true, message: "Welcome to the CONNEX API" });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "CONNEX API is running",
    timestamp: new Date().toISOString(),
    db: isConnected ? "connected" : "disconnected",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);

app.use((req, res) => {
  res
    .status(404)
    .json({ success: false, message: `Route ${req.originalUrl} not found` });
});

app.use(errorHandler);

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(
      `🌐 Allowed CORS origins:\n${allowedOrigins.map((o) => `   • ${o}`).join("\n")}`,
    );
  });
}

module.exports = app;

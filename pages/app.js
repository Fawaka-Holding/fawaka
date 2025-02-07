require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const logger = require("./utils/logger");
const tradeRoutes = require("./routes/trade");
const userRoutes = require("./routes/user");
const stakingRoutes = require("./routes/staking");
const documentRoutes = require("./routes/documents");
app.use("/api/documents", documentRoutes);

const app = express();
const PORT = process.env.PORT || 5000;

/** 📌 Middleware Setup */
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // Allow Cross-Origin Requests
app.use(helmet()); // Security headers
app.use(cookieParser()); // Parse cookies

/** 📌 Rate Limiting (Protect against DDoS) */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // Limit to 100 requests per IP
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", apiLimiter);

/** 📌 MongoDB Connection (If applicable) */
if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => logger.info("✅ MongoDB Connected"))
    .catch((err) => logger.error("MongoDB Connection Error:", err));
}

/** 📌 Routes */
app.use("/api/trade", tradeRoutes);
app.use("/api/user", userRoutes);
app.use("/api/staking", stakingRoutes);

/** 📌 Root Route */
app.get("/", (req, res) => {
  res.send("🔥 XRPL Wallet & DEX API Running...");
});

/** 📌 Start Server */
app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
});

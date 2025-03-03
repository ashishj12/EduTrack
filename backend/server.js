import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import logger from "./utils/logger.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "*", // Allow all origins in development
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.DB_URI)
  .then(() => logger.info("Connected to MongoDB"))
  .catch((e) => logger.error("MongoDB connection error:", e));

// Set up routes
app.use("/api/auth", authRoutes);

// Error handler middleware should be after routes
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

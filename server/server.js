import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoutes.js";
import pdfRoutes from "./routes/pdfRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// DB connection
connectDB();

// Routes
app.use("/api/auth", authRoute);
app.use("/api/pdf", pdfRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send("API is running ✅");
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

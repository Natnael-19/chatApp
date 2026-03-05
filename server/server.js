import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: "https://chat-app-red-omega.vercel.app", // frontend URL
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));

// Routes
app.use("/api/status", (req, res) => res.send("server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// Connect to DB
await connectDB();

// Export Express app for Vercel
export default app;

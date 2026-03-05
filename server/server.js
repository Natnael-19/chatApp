import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";
dotenv.config();

const app = express();
const server = http.createServer(app);
//initialize socket.io
export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
//store online users
export const userSocketMap = {}; // {userId: socketId}
//socket.io connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log(" user connected", userId);
  if (userId) {
    userSocketMap[userId] = socket.id;
  }
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  socket.on("disconnect", () => {
    console.log(" user disconnected", userId);
    if (userSocketMap[userId] === socket.id) {
      delete userSocketMap[userId];
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});
//middleware setup
app.use(cors());
app.use(express.json({ limit: "10mb" }));
//routes setup
app.use("/api/status", (req, res) => {
  res.send("server is live");
});

app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);
await connectDB();
if (process.env.NODE_ENV !== "PRODUCTION") {
  const PORT = process.env.PORT || 8000;

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
//for vercel
export default server;

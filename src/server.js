import { createServer } from "http";
import { Server } from "socket.io";
import createApp from "./app.js";
import config from "./config/index.js";
import registerChatHandlers from "./utils/socketHandler.js";

const app = createApp();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:5173", // Development
      "https://panggilaja.space", // Production frontend
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
  pingTimeout: 60000,
  pingInterval: 25000,
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("✅ New client connected:", socket.id);
  console.log("🔗 Transport:", socket.conn.transport.name);

  registerChatHandlers(io, socket);

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

httpServer.listen(config.port, () => {
  console.info(`🚀 Server running on port ${config.port}`);
  console.info("🔌 Socket.IO ready for connections"); // 🔥 Tambah log socket ready
});

process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("💥 Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

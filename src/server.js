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
      "http://localhost:5173",
      "http://localhost:5173",
      "https://www.panggilaja.space",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("✅ New client connected:", socket.id);

  registerChatHandlers(io, socket);

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

httpServer.listen(config.port, () => {
  console.info(`🚀 Server running on port ${config.port}`);
  console.info("📚 Swagger docs available at http://localhost:5000/docs");
});

process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("💥 Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

// socketTest.js
import { io } from "socket.io-client";

const SERVER_URL = "http://localhost:3000"; // ganti sesuai port backend kamu
const socket = io(SERVER_URL, {
  transports: ["websocket"],
});

const buyerId = "buyer123";
const sellerId = "seller456";

// Saat terhubung
socket.on("connect", () => {
  console.log("✅ Connected to server");

  // Gabung ke room buyer-seller
  socket.emit("join_room", { buyerId, sellerId });
  console.log(`📦 Joined room: ${buyerId}_${sellerId}`);

  // Kirim pesan uji coba
  setTimeout(() => {
    socket.emit("send_message", {
      id_buyer: buyerId,
      id_seller: sellerId,
      text: "Halo seller, ini pesan test!",
    });
  }, 2000);
});

// Saat menerima pesan
socket.on("receive_message", (msg) => {
  console.log("📩 Pesan diterima:", msg);
});

// Saat pesan ditandai sudah dibaca
socket.on("messages_seen", (info) => {
  console.log("👀 Pesan sudah dibaca:", info);
});

// Jika error
socket.on("error_message", (err) => {
  console.error("❌ Error:", err);
});

// Disconnect handler
socket.on("disconnect", () => {
  console.log("❎ Disconnected from server");
});

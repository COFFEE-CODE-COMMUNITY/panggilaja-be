import chatService from "../services/chatService.js";

export default function registerChatHandlers(io, socket) {
  // Join room berdasarkan kombinasi buyer-seller
  socket.on("join_room", ({ buyerId, sellerId }) => {
    const roomId = `${buyerId}_${sellerId}`;
    socket.join(roomId);
    console.log(`👥 ${socket.id} joined room ${roomId}`);
  });

  // Kirim pesan baru
  socket.on("send_message", async (data) => {
    try {
      const { id_buyer, id_seller, text } = data;

      // Simpan ke DB lewat service yang sudah kamu punya
      const message = await chatService.sendMessage(id_buyer, id_seller, {
        text,
      });

      // Broadcast ke semua dalam room (realtime update)
      const roomId = `${id_buyer}_${id_seller}`;
      socket.to(roomId).emit("receive_message", message);

      console.log(`💬 Message sent to room ${roomId}`);
    } catch (error) {
      console.error("Error sending message:", error.message);
      socket.emit("error_message", { error: "Failed to send message" });
    }
  });

  // Tandai pesan sudah dibaca
  socket.on("mark_seen", async ({ buyerId, sellerId }) => {
    try {
      await chatService.markMessagesAsSeen(buyerId, sellerId);
      io.to(`${buyerId}_${sellerId}`).emit("messages_seen", {
        buyerId,
        sellerId,
      });
    } catch (error) {
      console.error("Error marking as seen:", error.message);
    }
  });
}

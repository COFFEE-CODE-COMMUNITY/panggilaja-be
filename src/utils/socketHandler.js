import chatService from "../services/chatService.js";

const registerChatHandlers = (io, socket) => {
  socket.on("join_room", ({ buyerId, sellerId }) => {
    const roomId = `${buyerId}_${sellerId}`;
    socket.join(roomId);
    console.log(`👥 ${socket.id} joined room ${roomId}`);

    socket.emit("joined_room", { roomId, success: true });
  });

  socket.on("send_message", async (data) => {
    try {
      const { id_buyer, id_seller, text, sender_role } = data;

      const message = await chatService.sendMessage(
        id_buyer,
        id_seller,
        { text },
        sender_role
      );

      const roomId = `${id_buyer}_${id_seller}`;
      io.to(roomId).emit("receive_message", {
        ...message,
        senderId: sender_role === "BUYER" ? id_buyer : id_seller,
      });

      console.log(`💬 Message sent to room ${roomId}`);
    } catch (error) {
      console.error("Error sending message:", error.message);
      socket.emit("error_message", { error: "Failed to send message" });
    }
  });

  socket.on("mark_seen", async ({ buyerId, sellerId }) => {
    try {
      await chatService.markMessagesAsSeen(buyerId, sellerId);
      const roomId = `${buyerId}_${sellerId}`;
      io.to(roomId).emit("messages_seen", { buyerId, sellerId });
      console.log(`✅ Messages marked as seen in room ${roomId}`);
    } catch (error) {
      console.error("Error marking as seen:", error.message);
    }
  });

  socket.on("typing", ({ roomId, userId, isTyping }) => {
    socket.to(roomId).emit("user_typing", { userId, isTyping });
  });
};

export default registerChatHandlers;

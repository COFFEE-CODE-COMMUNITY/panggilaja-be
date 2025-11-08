import chatService from "../services/chatService.js";

const registerChatHandlers = (io, socket) => {
  // ===== JOIN CHAT ROOM =====
  socket.on("join_room", ({ buyerId, sellerId }) => {
    const roomId = `${buyerId}_${sellerId}`;
    socket.join(roomId);
    console.log(`👥 ${socket.id} joined room ${roomId}`);
    socket.emit("joined_room", { roomId, success: true });
  });

  // ===== 🆕 JOIN USER ROOM (untuk notifikasi contact list) =====
  socket.on("join_user_room", ({ userId, role }) => {
    const userRoom = `user_${role}_${userId}`;
    socket.join(userRoom);
    console.log(`🔔 ${socket.id} joined user room: ${userRoom}`);
  });

  // ===== SEND MESSAGE =====
  socket.on("send_message", async (data) => {
    try {
      const { id_buyer, id_seller, text, sender_role } = data;

      // Simpan pesan ke database
      const message = await chatService.sendMessage(
        id_buyer,
        id_seller,
        { text },
        sender_role
      );

      // 1️⃣ Emit ke chat room (untuk chat window)
      const roomId = `${id_buyer}_${id_seller}`;
      io.to(roomId).emit("receive_message", {
        ...message,
        senderId: sender_role === "BUYER" ? id_buyer : id_seller,
        id_buyer: id_buyer,
        id_seller: id_seller,
      });
      console.log(`💬 Message sent to chat room ${roomId}`);

      // 2️⃣ Emit ke buyer room (untuk update contact list buyer)
      const buyerRoom = `user_buyer_${id_buyer}`;
      io.to(buyerRoom).emit("contact_list_updated", {
        type: "new_message",
        partnerId: id_seller, // ✅ Buyer chat dengan seller ini
        lastMessage: {
          text: message.text,
          created_at: message.created_at,
        },
        isNewContact: false,
      });
      console.log(
        `📬 Contact update sent to ${buyerRoom} (partnerId: ${id_seller})`
      );

      // 3️⃣ Emit ke seller room (untuk update contact list seller)
      const sellerRoom = `user_seller_${id_seller}`;
      io.to(sellerRoom).emit("contact_list_updated", {
        type: "new_message",
        partnerId: id_buyer, // ✅ Seller chat dengan buyer ini
        lastMessage: {
          text: message.text,
          created_at: message.created_at,
        },
        isNewContact: true,
      });
      console.log(
        `📬 Contact update sent to ${sellerRoom} (partnerId: ${id_buyer})`
      );
    } catch (error) {
      console.error("❌ Error sending message:", error.message);
      socket.emit("error_message", { error: "Failed to send message" });
    }
  });

  // ===== MARK AS SEEN =====
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

  // ===== TYPING INDICATOR =====
  socket.on("typing", ({ roomId, userId, isTyping }) => {
    socket.to(roomId).emit("user_typing", { userId, isTyping });
  });

  // ===== DISCONNECT =====
  socket.on("disconnect", () => {
    console.log(`🔌 ${socket.id} disconnected`);
  });
};

export default registerChatHandlers;

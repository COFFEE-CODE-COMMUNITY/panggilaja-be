import chatService from "../services/chatService.js";

// TRACK ONLINE USERS GLOBAL STATE
// Map <"${role}_${userId}", Set<socketId>>
const onlineUsers = new Map();

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

    // Track user with composite key using normalized role
    const normalizedRole = role.toLowerCase();
    const userKey = `${normalizedRole}_${userId}`;

    if (!onlineUsers.has(userKey)) {
      onlineUsers.set(userKey, new Set());
      // Emit ONLINE status to everyone with ROLE info
      io.emit("user_status_update", { userId, role: normalizedRole, isOnline: true });
      console.log(`🟢 User ${userKey} is now ONLINE`);
    }
    onlineUsers.get(userKey).add(socket.id);

    // Attach user info to socket instance for simpler disconnect handling
    socket.userInfo = { userId, role: normalizedRole, userKey };
  });

  // ===== 🆕 GET ONLINE USERS (Init state sync) =====
  socket.on("get_online_users", () => {
    const onlineList = Array.from(onlineUsers.keys()).map(key => {
      const [role, userId] = key.split('_');
      return { userId, role };
    });
    socket.emit("online_users_list", onlineList);
    console.log(`📡 Sending online users list to ${socket.id} (Count: ${onlineList.length})`);
  });

  // ===== DISCONNECT =====
  socket.on("disconnect", () => {
    console.log(`🔌 ${socket.id} disconnected`);

    if (socket.userInfo) {
      const { userId, role, userKey } = socket.userInfo;
      if (onlineUsers.has(userKey)) {
        const userSockets = onlineUsers.get(userKey);
        userSockets.delete(socket.id);

        if (userSockets.size === 0) {
          onlineUsers.delete(userKey);
          // Emit OFFLINE status
          io.emit("user_status_update", { userId, role, isOnline: false });
          console.log(`🔴 User ${userKey} is now OFFLINE`);
        }
      }
    }
  });

  // ===== SEND MESSAGE =====
  socket.on("send_message", async (data) => {
    try {
      const { id_buyer, id_seller, text, sender_role } = data;

      // START DEBUG LOG
      console.log(`📨 Processing message from ${sender_role}:`, { id_buyer, id_seller, text });

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
          sender_role: sender_role, // ✅ Add sender info
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
          sender_role: sender_role, // ✅ Add sender info
        },
        isNewContact: true,
      });
      console.log(
        `📬 Contact update sent to ${sellerRoom} (partnerId: ${id_buyer})`
      );
    } catch (error) {
      console.error("❌ Error sending message:", error.message);
      socket.emit("error_message", { error: "Failed to send message: " + error.message });
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
};

export default registerChatHandlers;

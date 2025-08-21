import http from "http";
import { Server } from "socket.io";
import app from "./app"; // import your Express app
import sequelize from "./database/db";
import { User, Message } from "./models";
import Room from "./models/Room";
import RoomMember from "./models/RoomMember";
import { checkRateLimit } from "./utils/rateLimiter";

const RATE_LIMIT = { maxMessages: 5, timeWindowMs: 10000 };

// Create HTTP server from Express app
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  path: "/socket.io",
  cors: {
    origin: "*", // restrict later
    methods: ["GET", "POST"],
  },
});

const chatNamespace = io.of("/chat");

chatNamespace.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // 🔹 Authentication
  socket.on("authenticate", async (userId: string) => {
    console.log(`👤 User ${userId} authenticated on socket ${socket.id}`);
    socket.data.userId = userId;

    try {
      await User.update({ isOnline: true }, { where: { id: userId } });
      console.log(`🟢 User ${userId} is now online`);
    } catch (err) {
      console.error("❌ Error setting user online:", err);
    }
  });

  // 🔹 Join room with access control
  socket.on("join_room", async (roomId: string) => {
    try {
      const room = await Room.findByPk(roomId);
      if (!room) {
        socket.emit("error_message", { message: "Room does not exist" });
        return;
      }

      if (room.type === "private") {
        const member = await RoomMember.findOne({
          where: { roomId, userId: socket.data.userId },
        });

        if (!member) {
          socket.emit("error_message", {
            message: "Access denied: You are not a member of this room",
          });
          return;
        }
      }

      socket.join(roomId);
      console.log(`👥 User ${socket.data.userId} joined room ${roomId}`);
      socket.to(roomId).emit("user_joined", {
        userId: socket.data.userId,
        roomId,
      });
    } catch (err) {
      console.error("❌ Error joining room:", err);
      socket.emit("error_message", { message: "Failed to join room" });
    }
  });

  // 🔹 Typing
  socket.on("typing", (roomId: string) => {
    chatNamespace
      .to(roomId)
      .emit("typing", `User ${socket.data.userId} is typing...`);
  });

  // 🔹 Send message with rate limiter and validation
  socket.on(
    "send_message",
    async (payload: { roomId: string; userId: string; content: string }) => {
      try {
        // Rate limit check
        const rate = checkRateLimit(payload.userId, RATE_LIMIT);
        if (!rate.allowed) {
          socket.emit("rate_limited", {
            message: "Too many messages! Slow down.",
            retryAfter: rate.retryAfter,
          });
          return;
        }

        // Message validation
        if (!payload.content || payload.content.trim() === "") {
          socket.emit("error_message", { error: "Message cannot be empty" });
          return;
        }

        payload.content = payload.content
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");

        //  re-check private room membership
        const room = await Room.findByPk(payload.roomId);
        if (room?.type === "private") {
          const member = await RoomMember.findOne({
            where: { roomId: payload.roomId, userId: socket.data.userId },
          });
          if (!member) {
            socket.emit("error_message", {
              message: "Access denied: You are not a member of this room",
            });
            return;
          }
        }

        // Original code to save and broadcast message
        socket.join(payload.roomId);

        const message = await Message.create({
          roomId: payload.roomId,
          senderId: payload.userId,
          content: payload.content,
        });

        const savedMessage = await Message.findByPk(message.id, {
          include: [{ model: User, as: "sender", attributes: ["fullName"] }],
        });

        chatNamespace
          .to(payload.roomId)
          .emit("receive_message", JSON.stringify(savedMessage));

        console.log(`💬 Message saved for room ${payload.roomId}`);
      } catch (err) {
        console.error("❌ Error saving message:", err);
        socket.emit("error_message", { error: "Failed to send message" });
      }
    }
  );

  // 🔹 Disconnect
  socket.on("disconnect", async () => {
    const userId = socket.data.userId;
    console.log("Client disconnected:", socket.id);

    if (userId) {
      try {
        await User.update(
          { isOnline: false, lastSeen: new Date() },
          { where: { id: userId } }
        );
        console.log(`⚫ User ${userId} went offline`);
      } catch (err) {
        console.error("❌ Error setting user offline:", err);
      }
    }
  });
});

// Use Render's dynamic port
const PORT = process.env.PORT || 4000;

// Connect to DB first, then start server
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");

    server.listen(PORT, () => {
      console.log("🚀 Server running at http://localhost:4000");
      console.log(
        "📡 Chat namespace available at ws://localhost:4000/chat (path=/socket.io)"
      );
    });
  } catch (err) {
    console.error("❌ Database connection failed:", err);
  }
})();

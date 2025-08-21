import { io as Client } from "socket.io-client";
import readline from "readline";

// 🔹 Replace with your real IDs
const SOCKET_URL = "http://localhost:4000/chat"; // namespace = /chat
const userId = process.argv[2] || "bb300001-0b06-4120-9853-6cc5a8dc0d0c";
const roomId = process.argv[3] || "af04a882-a936-4f24-a591-8b7f3e257cb8";

// Setup readline for CLI input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "💬 You> ",
});

// Connect to Socket.IO
const socket = Client(SOCKET_URL, {
  path: "/socket.io",
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("✅ Connected to server:", socket.id);

  // Step 1: Authenticate
  socket.emit("authenticate", userId);
  console.log("➡️ Sent authenticate");

  // Step 2: Join room
  socket.emit("join_room", roomId);
  console.log(`➡️ Joined room ${roomId}`);

  // Start input prompt
  rl.prompt();
});

// Listen for messages from server

socket.on("receive_message", (msg) => {
  const messageReceived :any= JSON.parse(msg) 
  
  console.log(
    `\n📩 New message from ${messageReceived.sender?.fullName || "Unknown"}: ${messageReceived.content}`
  );
  rl.prompt();
});

// Handle user input
rl.on("line", (line) => {
  const trimmed = line.trim();
  if (!trimmed) {
    rl.prompt();
    return;
  }

  // Send message
  socket.emit("send_message", {
    roomId: roomId,
    userId: userId,
    content: trimmed,
  });

  console.log(`➡️ You sent: ${trimmed}`);
  rl.prompt();
});

// Handle disconnect
socket.on("disconnect", () => {
  console.log("❌ Disconnected from server");
  process.exit(0);
});





// import { io } from "socket.io-client";
// import readline from "readline";

// // args: userId + roomId
// const userId = process.argv[2] || "default-user";
// const roomId = process.argv[3] || "default-room";

// const socket = io("http://localhost:4000");

// socket.on("connect", () => {
//   console.log(`✅ Connected to server: ${socket.id}`);
//   socket.emit("authenticate", userId);
//   socket.emit("joinRoom", roomId);
// });

// // 📜 Show chat history
// socket.on("history", (messages: any[]) => {
//   console.log("📜 Chat History:");
//   messages.forEach((m) => {
//     console.log(
//       `[${new Date(m.createdAt).toLocaleTimeString()}] ${m.userId}: ${
//         m.content
//       }`
//     );
//   });
//   console.log("──────────────────────────────");
// });

// // 📩 Listen for new messages
// socket.on("new_message", (msg) => {
//   console.log(
//     `📩 [${new Date(msg.createdAt).toLocaleTimeString()}] ${msg.userId}: ${
//       msg.content
//     }`
//   );
// });

// // 📝 CLI Input
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// rl.setPrompt("💬 You> ");
// rl.prompt();

// rl.on("line", (line) => {
//   const trimmed = line.trim();
//   if (trimmed.length > 0) {
//     socket.emit("send_message", {
//       roomId,
//       userId,
//       content: trimmed,
//     });
//     console.log(`➡️ You sent: ${trimmed}`);
//   }
//   rl.prompt();
// });

import { Router } from "express";
import {
  createRoom,
  joinRoom,
  getUserRooms,
  getRoomMembers,
} from "../controllers/roomController";
import { getRoomMessages } from "../controllers/chatController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/create-room", authMiddleware, createRoom);
router.post("/join-room", authMiddleware, joinRoom);
router.get("/rooms", authMiddleware, getUserRooms);
router.get("/rooms/:roomId/members", getRoomMembers);

router.get("/chats-histories/:roomId", getRoomMessages);

export default router;

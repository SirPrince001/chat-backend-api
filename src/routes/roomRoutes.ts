import { Router } from "express";
import {
  createRoom,
  joinRoom,
  getUserRooms,
} from "../controllers/roomController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/create-room", authMiddleware, createRoom);
router.post("/join-room", authMiddleware, joinRoom);
router.get("/rooms", authMiddleware, getUserRooms);

export default router;

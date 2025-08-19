import { Request, Response } from "express";
import Room from "../models/Room";
import UserRoom from "../models/UserRoom";
import { User } from "../models"; // import associations
// Extend Express Request to include user
interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

// Create a room
export const createRoom = async (req: Request, res: Response) => {
  try {
    const { name, isPrivate } = req.body;
    const userId = (req as any).user.id; // assuming JWT middleware attaches user

    // Create room
    const room = await Room.create({
      name,
      isPrivate,
      createdBy: userId,
    });

    // Add creator as member
    await UserRoom.create({ userId, roomId: room.id });

    res.status(201).json({ message: "Room created successfully", room });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};




//join a room
export const joinRoom = async (req: AuthRequest, res: Response) => {
  try {
    const { roomId, inviteCode } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!roomId && !inviteCode) {
      return res.status(400).json({ message: "roomId or inviteCode is required" });
    }

    let room = null;
    if (roomId) {
      room = await Room.findByPk(roomId);
    } else if (inviteCode) {
      room = await Room.findOne({ where: { inviteCode } });
    }

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Check if private room requires invite code
    if (room.type === "private" && !inviteCode) {
      return res
        .status(403)
        .json({ message: "Invite code required for private room" });
    }

    // Check if already a member
    const existing = await UserRoom.findOne({
      where: { userId, roomId: room.id },
    });

    if (existing) {
      return res.status(400).json({ message: "Already a member" });
    }

    // Add user to room
    await UserRoom.create({ userId, roomId: room.id });

    res.status(200).json({
      message: "Joined room successfully",
      room: {
        id: room.id,
        name: room.name,
        type: room.type, 
        inviteCode: room.inviteCode,
      },
    });
  } catch (err) {
    console.error("Join room error:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

//get all chat rooms
export const getUserRooms = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findByPk(userId, {
      include: [
        {
          model: Room,
          as: "rooms", 
          through: { attributes: [] },
        },
      ],
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      message: "User rooms fetched successfully",
      rooms: user.rooms, // list of rooms the user belongs to
    });
  } catch (err) {
    console.error("Get user rooms error:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

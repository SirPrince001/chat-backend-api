import { Request, Response } from "express";
import Message from "../models/Message";
import User from "../models/User";

/**
 * GET /api/rooms/:roomId/messages?page=1&limit=20
 * Returns paginated messages for a room, newest first
 */
export const getRoomMessages = async (req: Request, res: Response) => {
  const { roomId } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const offset = (page - 1) * limit;

  try {
    const { rows: messages, count } = await Message.findAndCountAll({
      where: { roomId },
      include: [{ model: User, as: "sender", attributes: ["fullName"] }],
      order: [["createdAt", "DESC"]], // newest first
      limit,
      offset,
    });

    return res.json({
      roomId,
      page,
      limit,
      totalMessages: count,
      totalPages: Math.ceil(count / limit),
      messages,
    });
  } catch (err) {
    console.error("❌ Error fetching messages:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

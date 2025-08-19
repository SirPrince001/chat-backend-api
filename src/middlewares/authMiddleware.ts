import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Authorization header missing or invalid" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token is missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;

    if (!decoded?.id) {
      return res
        .status(403)
        .json({ message: "Access denied: Business ID missing" });
    }

    (req as any).user = decoded; // Controller can access req.user.id
    next();
  } catch (err) {
    console.error("Business auth error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import {
  registerUserSchema,
  loginUserSchema,
} from "../validators/userValidator";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

//user registerion
export const register = async (req: Request, res: Response) => {
  const { error } = registerUserSchema.validate(req.body);
  if (error)
    return res
      .status(400)
      .json({ errors: error.details.map((e) => e.message) });

  try {
    const { fullName, email, password } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing)
      return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ fullName, email, password: hashed });
    res.status(201).json({ message: "User registered", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

//login registered user
export const login = async (req: Request, res: Response) => {
  
  // ✅ Step 1: Validate request
  const { error } = loginUserSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ errors: error.details.map((e) => e.message) });
  }

  try {
    const { email, password } = req.body;
    console.log("Login request body:", req.body);

    // ✅ Step 2: Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log("User not found for email:", email);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Found user:", user.toJSON());

    // const hashedPassword = user.getDataValue("password");
    // const match = await bcrypt.compare(password, hashedPassword);
    const match = await bcrypt.compare(password, user.password);
    console.log("Password match result:", match);

    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ✅ Step 4: Sign JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    // ✅ Step 5: Response
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

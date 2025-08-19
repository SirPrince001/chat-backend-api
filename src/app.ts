import express from "express";
import cors from "cors";
import sequelize from "./database/db";
import authRoutes from "./routes/authRoute";
import roomRoutes from "./routes/roomRoutes";
import "./models/index";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//sync database
sequelize
  .authenticate()
  .then(() => {
    console.log("Database Connected.. ");
  })
  .catch((error: any) => {
    console.log(" Error connecting to database:", error);
  });

app.get("/health", (_, res) => res.json({ ok: true }));
// Routes
app.use("/api/auth", authRoutes);

app.use("/api/rooms", roomRoutes);

export default app;

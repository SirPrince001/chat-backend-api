import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../database/db";
import User from "./User";


class Room extends Model {
  declare id: string;
  declare name: string;
  declare type: "public" | "private";
  declare inviteCode: string;
  declare createdBy: string;
  declare readonly createdAt: Date;
  declare readonly updatedA: Date;
}

Room.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("public", "private"),
      allowNull: false,
      defaultValue: "public",
    },
    inviteCode: {
      type: DataTypes.STRING,
      unique: true,
      defaultValue: () => Math.random().toString(36).substring(2, 10), // auto-generate
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "Rooms",
    modelName: "Room",
  }
);




export default Room;

import { DataTypes, Model } from "sequelize";
import sequelize from "../database/db";
import User from "./User";
import Room from "./Room";

class Message extends Model {
  declare id: string;
  declare content: string;
  declare senderId: string;
  declare roomId: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Message.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    senderId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    roomId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "Messages",
    modelName: "Message",
  }
);



export default Message;

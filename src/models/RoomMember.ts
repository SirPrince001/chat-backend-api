import { DataTypes, Model } from "sequelize";
import sequelize from "../database/db";
import User from "./User";
import Room from "./Room";

class RoomMember extends Model {
  declare id: number;
  declare roomId: string;
  declare userId: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

RoomMember.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    roomId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Room,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
  {
    sequelize,
    tableName: "room_members",
    modelName: "RoomMember",
  }
);



export default RoomMember;

import { DataTypes, Model } from "sequelize";
import sequelize from "../database/db";

class UserRoom extends Model {
  declare id: string;
  declare userId: string;
  declare roomId: string;
}

UserRoom.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
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
    tableName: "UserRooms",
    modelName: "UserRoom",
  }
);

export default UserRoom;

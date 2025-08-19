import { DataTypes, Model } from "sequelize";
import sequelize from "../database/db";
import type Room from "./Room";



class User extends Model {
  declare id: string;
  declare fullName: string;
  declare email: string;
  declare password: string;
  declare isOnline: boolean;
  declare lastSeen: Date | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare rooms?: Room[];
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isOnline: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    lastSeen: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "Users",
    modelName: "User",
  }
);

export default User;

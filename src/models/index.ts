import User from "./User";
import Room from "./Room";
import UserRoom from "../models/UserRoom";
import Message from "../models/Message";

// Room.belongsTo(User, { foreignKey: "createdBy", as: "creator" });
// User.hasMany(Room, { foreignKey: "createdBy", as: "createdRooms" });

// 🔹 One-to-Many: User -> Rooms (created rooms)
User.hasMany(Room, { foreignKey: "createdBy", as: "createdRooms" });
Room.belongsTo(User, { foreignKey: "createdBy", as: "creator" });

// 🔹 Many-to-Many: Users <-> Rooms through UserRooms
User.belongsToMany(Room, {
  through: UserRoom,
  foreignKey: "userId",
  as: "rooms",
});
Room.belongsToMany(User, {
  through: UserRoom,
  foreignKey: "roomId",
  as: "members",
});

// Associations
Message.belongsTo(User, { foreignKey: "senderId", as: "sender" });
Message.belongsTo(Room, { foreignKey: "roomId", as: "room" });

export { User, Room, UserRoom };

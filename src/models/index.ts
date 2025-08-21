import User from "./User";
import Room from "./Room";
import UserRoom from "./UserRoom";
import Message from "./Message";
import RoomMember from './RoomMember'
/**
 * 🔹 One-to-Many: User -> Rooms (created rooms)
 */
User.hasMany(Room, { foreignKey: "createdBy", as: "createdRooms" });
Room.belongsTo(User, { foreignKey: "createdBy", as: "creator" });

/**
 * 🔹 Many-to-Many: Users <-> Rooms through UserRoom
 */
User.belongsToMany(Room, {
  through: UserRoom,
  foreignKey: "userId",
  otherKey: "roomId",
  as: "rooms",
});
Room.belongsToMany(User, {
  through: UserRoom,
  foreignKey: "roomId",
  otherKey: "userId",
  as: "members",
});

/**
 * 🔹 One-to-Many: User -> Messages
 * (Each message belongs to one sender, one sender can send many messages)
 */
User.hasMany(Message, { foreignKey: "senderId", as: "messages" });
Message.belongsTo(User, { foreignKey: "senderId", as: "sender" });

/**
 * 🔹 One-to-Many: Room -> Messages
 * (Each room has many messages, each message belongs to one room)
 */
Room.hasMany(Message, { foreignKey: "roomId", as: "messages" });
Message.belongsTo(Room, { foreignKey: "roomId", as: "room" });
// Optional: Sequelize associations
User.belongsToMany(Room, { through: RoomMember, foreignKey: "userId" });
Room.belongsToMany(User, { through: RoomMember, foreignKey: "roomId" });

export { User, Room, UserRoom, Message };

const mongoose = require("mongoose");
const { Roles } = require("../constants/UserRoles");
const { UserStatus } = require("../constants/UserStatus");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "userName is required"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
    },
    role: {
      type: String,
      enum: Object.values(Roles),
      default: Roles.USER,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  }
);

const UserModel = mongoose.model("users", userSchema);

module.exports = UserModel;

import mongoose, { Model, Schema } from "mongoose";
import UserRoles from "../constants/user.roles.enum";
import UserStatus from "../constants/user.status.enum";
import IUser from "./interfaces/user.interface";

const userSchema: Schema<IUser> = new Schema<IUser>(
  {
    userName: {
      type: String,
      required: [true, "userName is required"],
      minlength: 5,
      maxlength: 18,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
        "Please provide a valid email address",
      ],
      index: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: 50,
    },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.INACTIVE,
    },
    role: {
      type: String,
      enum: [UserRoles.GUEST, UserRoles.USER, UserRoles.MODERATOR],
      default: UserRoles.GUEST,
    },
    otp: {
      code: {
        type: String
      },
      expiryDate: {
        type: Date
      }
    },
    last_modified_by: {
      type: String,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
    collection: "users",
  }
);

const UserModel: Model<IUser> = mongoose.model<IUser>("user", userSchema);

export default UserModel;

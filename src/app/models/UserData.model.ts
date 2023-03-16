import mongoose, { Model, Schema } from "mongoose";
import IUserData from "./interfaces/IUserData";

const userDataSchema: Schema<IUserData> = new Schema<IUserData>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      unique: true,
    },
    seenTitles: {
      type: [{
        type: Schema.Types.ObjectId,
        ref: 'title'
      }],
    },
    unseenTitles: {
      type: [{
        type: Schema.Types.ObjectId,
        ref: 'title'
      }],
    },
    starredTitles: {
      type: [{
        type: Schema.Types.ObjectId,
        ref: 'title'
      }],
    },
    favouriteTitles: {
      type: [{
        type: Schema.Types.ObjectId,
        ref: 'title'
      }],
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
    collection: "user_data"
  }
);

const UserDataModel: Model<IUserData> = mongoose.model<IUserData>("UserData", userDataSchema);

export default UserDataModel;

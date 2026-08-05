import mongoose, { Schema, Model } from "mongoose";
import { ADMIN, CUSTOMER } from "../../config/vars.js";
import { Users } from "../../utils/types.js";

// Schema
const UsersSchema: Schema<Users> = new Schema(
  {
    name: { type: String, required: true, minlength: 3, maxlength: 50 },
    email: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
      unique: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      enum: [ADMIN, CUSTOMER],
    },

    avatar: { type: String },
  },
  {
    timestamps: true,
  },
);

// Model
const Users: Model<Users> = mongoose.model<Users>("Users", UsersSchema);

export default Users;

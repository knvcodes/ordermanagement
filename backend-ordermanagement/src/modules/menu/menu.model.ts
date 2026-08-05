import mongoose, { Schema, Model } from "mongoose";
import { IMenu } from "../../utils/types.js";

const MenuSchema: Schema<IMenu> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    image: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
MenuSchema.index({ category: 1, isAvailable: 1 });
MenuSchema.index({ name: "text", description: "text" });

const Menu: Model<IMenu> = mongoose.model<IMenu>("Menu", MenuSchema);

export default Menu;

import mongoose, { Schema, Model } from "mongoose";
import { IOrder } from "../../utils/types.js";

const OrderSchema: Schema<IOrder> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        "ORDER_RECEIVED",
        "PREPARING",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED",
      ],
      default: "ORDER_RECEIVED",
      index: true,
    },

    delivery: {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      phone: {
        type: String,
        required: true,
        trim: true,
      },

      address: {
        type: String,
        required: true,
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });

const Order: Model<IOrder> = mongoose.model<IOrder>("Order", OrderSchema);

export default Order;

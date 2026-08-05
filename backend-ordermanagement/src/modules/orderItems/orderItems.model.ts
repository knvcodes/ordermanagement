import mongoose, { Schema, Document, Model, Types } from "mongoose";

// Interface
export interface IOrderItem extends Document {
  orderId: Types.ObjectId;
  menuItemId: Types.ObjectId;

  itemName: string;
  itemPrice: number;

  quantity: number;
  subtotal: number;

  createdAt: Date;
  updatedAt: Date;
}

// Schema
const OrderItemSchema: Schema<IOrderItem> = new Schema(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },

    menuItemId: {
      type: Schema.Types.ObjectId,
      ref: "Menu",
      required: true,
      index: true,
    },

    // Snapshot of menu item
    itemName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    itemPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

// Model
const OrderItem: Model<IOrderItem> = mongoose.model<IOrderItem>(
  "OrderItem",
  OrderItemSchema,
);

export default OrderItem;

import mongoose, { Schema, Document, Model, Types } from "mongoose";

// Interface
export interface IOrders extends Document {
  name: string;
  description?: string;
  age?: number;
  isActive: boolean;
  tags?: string[];
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
  profile: Record<string, unknown>;
  items: Record<string, unknown>[];
  userId?: Types.ObjectId; // ✅ relation type
}

// Schema
const OrdersSchema: Schema<IOrders> = new Schema(
  {
    name: { type: String, required: true, minlength: 3, maxlength: 50 },

    description: { type: String, minlength: 3, maxlength: 50 },

    age: { type: Number },

    isActive: { type: Boolean, default: true },

    tags: [{ type: String }],

    metadata: { type: Schema.Types.Mixed },

    // Example nested object
    profile: {
      firstName: { type: String },
      lastName: { type: String },
    },

    // Example array of objects
    items: [
      {
        title: { type: String },
        value: { type: Number },
      },
    ],

    // Example reference (relation)
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { 
    timestamps: true,

    toJSON: {
      transform(doc, ret) {
        delete ret._id;
        delete ret.__v; // bonus garbage removal
      },
    },
    toObject: {
      transform(doc, ret) {
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

// Model
const Orders: Model<IOrders> = mongoose.model<IOrders>(
  "Orders",
  OrdersSchema
);

export default Orders;
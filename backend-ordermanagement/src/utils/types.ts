import { Request } from "express";
import { Types } from "mongoose";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// auth middleware

export type TokenPayload = {
  id: string;
  name: string;
  role: string;
};

export interface CustomRequest extends Request {
  user: {
    id: string;
  };
}

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        // add other user properties as needed
      };
    }
  }
}

// Interface
export interface Users extends Document {
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar?: string;
}

export interface IMenu extends Document {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderStatus =
  | "ORDER_RECEIVED"
  | "PREPARING"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export interface IOrder extends Document {
  userId: Types.ObjectId;

  totalAmount: number;

  status: OrderStatus;

  delivery: {
    name: string;
    phone: string;
    address: string;
  };

  createdAt: Date;
  updatedAt: Date;
}

import { Request } from "express";
import Order from "./orders.model.js";
import mongoose from "mongoose";
import Menu from "../menu/menu.model.js";
import OrderItem from "../orderItems/orderItems.model.js";
import { NotFoundError } from "../../utils/errors.js";

export const getOrders = async (req: Request) => {
  try {
    const { id } = req.params;

    const orders = await Order.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "orderitems", // MongoDB collection name
          localField: "_id",
          foreignField: "orderId",
          as: "items",
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);

    return orders;
  } catch (error) {
    throw error;
  }
};

export const getOrderDetails = async (req: Request) => {
  try {
    const { id } = req.params;

    const orders = await Order.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "orderitems", // MongoDB collection name
          localField: "_id",
          foreignField: "orderId",
          as: "items",
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);
    if (orders.length == 0) {
      throw new NotFoundError("Order not found");
    }

    return orders;
  } catch (error) {
    throw error;
  }
};

export const updateOrderStatus = async (req: Request) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      {
        new: true,
        runValidators: true,
      },
    );

    // Check if the order actually exists
    if (!updatedOrder) {
      throw new Error("Order not found");
    }

    return updatedOrder;
  } catch (error) {
    throw error;
  }
};

export const placeOrder = async (req: Request) => {
  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    const { userId, delivery, items } = req.body;

    if (!items?.length) {
      throw new Error("Order must contain at least one item.");
    }

    // Fetch all menu items
    const menuIds = items.map((item: any) => item.menuItemId);

    const menus = await Menu.find({
      _id: { $in: menuIds },
    }).session(session);

    const menuMap = new Map(menus.map((menu) => [menu._id.toString(), menu]));

    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const menu = menuMap.get(item.menuItemId);

      if (!menu) {
        throw new Error(`Menu item ${item.menuItemId} not found`);
      }

      const subtotal = menu.price * item.quantity;
      totalAmount += subtotal;

      orderItems.push({
        menuItemId: menu._id,
        itemName: menu.name,
        itemPrice: menu.price,
        quantity: item.quantity,
        subtotal,
      });
    }

    // Create Order
    const [order] = await Order.create(
      [
        {
          userId,
          delivery,
          totalAmount,
        },
      ],
      { session },
    );

    // Attach orderId
    const orderItemDocs = orderItems.map((item) => ({
      ...item,
      orderId: order._id,
    }));

    await OrderItem.insertMany(orderItemDocs, { session });

    await session.commitTransaction();

    return order;
  } catch (error: unknown) {
    throw error;
  }
};

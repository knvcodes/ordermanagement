import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Request } from "express";
import mongoose from "mongoose";
import {
  getOrders,
  getOrderDetails,
  placeOrder,
  updateOrderStatus,
} from "./orders.service.js";
import Order from "./orders.model.js";
import Menu from "../menu/menu.model.js";
import OrderItem from "../orderItems/orderItems.model.js";
import { NotFoundError } from "../../utils/errors.js";
import { sendOrderStatusUpdate } from "../../services/sse.service.js";

vi.mock("./orders.model.js", () => ({
  default: {
    aggregate: vi.fn(),
    findByIdAndUpdate: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock("../menu/menu.model.js", () => ({
  default: {
    find: vi.fn(),
  },
}));

vi.mock("../orderItems/orderItems.model.js", () => ({
  default: {
    insertMany: vi.fn(),
  },
}));

vi.mock("../../utils/errors.js", () => {
  class NotFoundError extends Error {
    statusCode: number;

    constructor(message?: string) {
      super(message);
      this.name = "NotFoundError";
      this.statusCode = 404;
    }
  }

  return {
    NotFoundError,
  };
});

vi.mock("../../services/sse.service.js", () => ({
  sendOrderStatusUpdate: vi.fn(),
}));

vi.mock("mongoose", () => {
  class ObjectId {
    id: string;

    constructor(id: string) {
      this.id = id;
    }

    toString() {
      return this.id;
    }
  }

  const mongooseMock = {
    startSession: vi.fn(),
    Types: {
      ObjectId,
    },
  };

  return {
    default: mongooseMock,
    startSession: mongooseMock.startSession,
    Types: mongooseMock.Types,
  };
});

const mockedStartSession = vi.mocked(mongoose.startSession);
const mockedSendOrderStatusUpdate = vi.mocked(sendOrderStatusUpdate);

const delivery = {
  name: "John Doe",
  phone: "1234567890",
  address: "Street 1, City",
};

const createSessionMock = () => ({
  startTransaction: vi.fn(),
  commitTransaction: vi.fn(),
  endSession: vi.fn(),
});

describe("orders service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe("getOrders", () => {
    it("should return user orders", async () => {
      const orders = [{ _id: "order-1" }];

      vi.mocked(Order.aggregate).mockResolvedValue(orders as any);

      const req = {
        params: {
          id: "user-123",
        },
      } as unknown as Request;

      const result = await getOrders(req);

      expect(result).toEqual(orders);
      expect(Order.aggregate).toHaveBeenCalledTimes(1);

      const pipeline = vi.mocked(Order.aggregate).mock.calls[0]?.[0] as any[];

      expect(pipeline[0].$match.userId.toString()).toBe("user-123");

      expect(pipeline).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            $lookup: expect.objectContaining({
              from: "orderitems",
              localField: "_id",
              foreignField: "orderId",
              as: "items",
            }),
          }),
          expect.objectContaining({
            $sort: {
              createdAt: -1,
            },
          }),
        ]),
      );
    });

    it("should rethrow aggregate errors", async () => {
      vi.mocked(Order.aggregate).mockRejectedValueOnce(
        new Error("Aggregate failed"),
      );

      const req = {
        params: {
          id: "user-123",
        },
      } as unknown as Request;

      await expect(getOrders(req)).rejects.toThrow("Aggregate failed");
    });
  });

  describe("getOrderDetails", () => {
    it("should return order details and schedule status updates", async () => {
      vi.useFakeTimers();

      const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0.4);

      const orders = [{ _id: "order-123" }];

      vi.mocked(Order.aggregate).mockResolvedValue(orders as any);

      const req = {
        params: {
          id: "order-123",
        },
      } as unknown as Request;

      const result = await getOrderDetails(req);

      expect(result).toEqual(orders);

      const pipeline = vi.mocked(Order.aggregate).mock.calls[0]?.[0] as any[];

      expect(pipeline[0].$match._id.toString()).toBe("order-123");

      expect(mockedSendOrderStatusUpdate).toHaveBeenCalledTimes(1);

      expect(mockedSendOrderStatusUpdate).toHaveBeenCalledWith(
        "order-123",
        expect.objectContaining({
          type: "status_update",
          status: "ORDER_RECEIVED",
        }),
      );

      await vi.advanceTimersByTimeAsync(5000);

      expect(mockedSendOrderStatusUpdate).toHaveBeenCalledTimes(2);

      expect(mockedSendOrderStatusUpdate).toHaveBeenCalledWith(
        "order-123",
        expect.objectContaining({
          type: "status_update",
          status: "PREPARING",
        }),
      );

      await vi.advanceTimersByTimeAsync(5000);

      expect(mockedSendOrderStatusUpdate).toHaveBeenCalledTimes(3);

      expect(mockedSendOrderStatusUpdate).toHaveBeenCalledWith(
        "order-123",
        expect.objectContaining({
          type: "status_update",
          status: "OUT_FOR_DELIVERY",
        }),
      );

      await vi.advanceTimersByTimeAsync(5000);

      expect(mockedSendOrderStatusUpdate).toHaveBeenCalledTimes(4);

      expect(mockedSendOrderStatusUpdate).toHaveBeenCalledWith(
        "order-123",
        expect.objectContaining({
          type: "status_update",
          status: "DELIVERED",
        }),
      );

      randomSpy.mockRestore();
    });

    it("should throw NotFoundError when order does not exist", async () => {
      vi.mocked(Order.aggregate).mockResolvedValue([] as any);

      const req = {
        params: {
          id: "order-123",
        },
      } as unknown as Request;

      await expect(getOrderDetails(req)).rejects.toBeInstanceOf(NotFoundError);

      expect(mockedSendOrderStatusUpdate).not.toHaveBeenCalled();
    });

    it("should rethrow aggregate errors", async () => {
      vi.mocked(Order.aggregate).mockRejectedValueOnce(
        new Error("Order details failed"),
      );

      const req = {
        params: {
          id: "order-123",
        },
      } as unknown as Request;

      await expect(getOrderDetails(req)).rejects.toThrow(
        "Order details failed",
      );
    });
  });

  describe("updateOrderStatus", () => {
    it("should update and return order", async () => {
      const updatedOrder = {
        _id: "order-123",
        status: "DELIVERED",
      };

      vi.mocked(Order.findByIdAndUpdate).mockResolvedValue(updatedOrder as any);

      const req = {
        params: {
          id: "order-123",
        },
        body: {
          status: "DELIVERED",
        },
      } as unknown as Request;

      const result = await updateOrderStatus(req);

      expect(Order.findByIdAndUpdate).toHaveBeenCalledWith(
        "order-123",
        {
          status: "DELIVERED",
        },
        {
          new: true,
          runValidators: true,
        },
      );

      expect(result).toEqual(updatedOrder);
    });

    it("should throw error when order is not found", async () => {
      vi.mocked(Order.findByIdAndUpdate).mockResolvedValue(null as any);

      const req = {
        params: {
          id: "order-123",
        },
        body: {
          status: "DELIVERED",
        },
      } as unknown as Request;

      await expect(updateOrderStatus(req)).rejects.toThrow("Order not found");
    });

    it("should rethrow update errors", async () => {
      vi.mocked(Order.findByIdAndUpdate).mockRejectedValueOnce(
        new Error("Update failed"),
      );

      const req = {
        params: {
          id: "order-123",
        },
        body: {
          status: "DELIVERED",
        },
      } as unknown as Request;

      await expect(updateOrderStatus(req)).rejects.toThrow("Update failed");
    });
  });

  describe("placeOrder", () => {
    it("should place order successfully", async () => {
      const sessionMock = createSessionMock();

      mockedStartSession.mockResolvedValue(sessionMock as any);

      const menuDocuments = [
        {
          _id: "menu-1",
          name: "Pizza",
          price: 10,
        },
      ];

      const menuFindSessionMock = {
        session: vi.fn().mockResolvedValue(menuDocuments),
      };

      vi.mocked(Menu.find).mockReturnValue(menuFindSessionMock as any);

      const createdOrder = {
        _id: "order-1",
        userId: "user-1",
        totalAmount: 20,
      };

      vi.mocked(Order.create).mockResolvedValue([createdOrder] as any);
      vi.mocked(OrderItem.insertMany).mockResolvedValue([] as any);

      const req = {
        body: {
          userId: "user-1",
          delivery,
          items: [
            {
              menuItemId: "menu-1",
              quantity: 2,
            },
          ],
        },
      } as unknown as Request;

      const result = await placeOrder(req);

      expect(sessionMock.startTransaction).toHaveBeenCalled();

      expect(Menu.find).toHaveBeenCalledWith({
        _id: {
          $in: ["menu-1"],
        },
      });

      expect(menuFindSessionMock.session).toHaveBeenCalledWith(sessionMock);

      expect(Order.create).toHaveBeenCalledWith(
        [
          {
            userId: "user-1",
            delivery,
            totalAmount: 20,
          },
        ],
        {
          session: sessionMock,
        },
      );

      expect(OrderItem.insertMany).toHaveBeenCalledWith(
        [
          expect.objectContaining({
            orderId: "order-1",
            menuItemId: "menu-1",
            itemName: "Pizza",
            itemPrice: 10,
            quantity: 2,
            subtotal: 20,
          }),
        ],
        {
          session: sessionMock,
        },
      );

      expect(sessionMock.commitTransaction).toHaveBeenCalled();
      expect(result).toEqual(createdOrder);
    });

    it("should throw error when items array is empty", async () => {
      const sessionMock = createSessionMock();

      mockedStartSession.mockResolvedValue(sessionMock as any);

      const req = {
        body: {
          userId: "user-1",
          delivery,
          items: [],
        },
      } as unknown as Request;

      await expect(placeOrder(req)).rejects.toThrow(
        "Order must contain at least one item.",
      );

      expect(sessionMock.startTransaction).toHaveBeenCalled();
      expect(Order.create).not.toHaveBeenCalled();
      expect(sessionMock.commitTransaction).not.toHaveBeenCalled();
    });

    it("should throw error when menu item does not exist", async () => {
      const sessionMock = createSessionMock();

      mockedStartSession.mockResolvedValue(sessionMock as any);

      const menuFindSessionMock = {
        session: vi.fn().mockResolvedValue([]),
      };

      vi.mocked(Menu.find).mockReturnValue(menuFindSessionMock as any);

      const req = {
        body: {
          userId: "user-1",
          delivery,
          items: [
            {
              menuItemId: "missing-menu-item",
              quantity: 1,
            },
          ],
        },
      } as unknown as Request;

      await expect(placeOrder(req)).rejects.toThrow(
        "Menu item missing-menu-item not found",
      );

      expect(sessionMock.commitTransaction).not.toHaveBeenCalled();
    });

    it("should rethrow menu lookup errors", async () => {
      const sessionMock = createSessionMock();

      mockedStartSession.mockResolvedValue(sessionMock as any);

      const menuFindSessionMock = {
        session: vi.fn().mockRejectedValue(new Error("Menu lookup failed")),
      };

      vi.mocked(Menu.find).mockReturnValue(menuFindSessionMock as any);

      const req = {
        body: {
          userId: "user-1",
          delivery,
          items: [
            {
              menuItemId: "menu-1",
              quantity: 1,
            },
          ],
        },
      } as unknown as Request;

      await expect(placeOrder(req)).rejects.toThrow("Menu lookup failed");

      expect(sessionMock.commitTransaction).not.toHaveBeenCalled();
    });
  });
});

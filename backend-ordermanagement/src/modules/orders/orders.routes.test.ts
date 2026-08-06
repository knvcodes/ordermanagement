import express from "express";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ordersRouter from "./orders.routes.js";
import {
  getOrders,
  getOrderDetails,
  placeOrder,
  updateOrderStatus,
} from "./orders.service.js";
import { globalErrorHandler, NotFoundError } from "../../utils/errors.js";
import { handleResponse } from "../../utils/helpers.js";

vi.mock("./orders.service.js", () => ({
  getOrders: vi.fn(),
  placeOrder: vi.fn(),
  getOrderDetails: vi.fn(),
  updateOrderStatus: vi.fn(),
}));

vi.mock("../../utils/helpers.js", () => ({
  handleResponse: vi.fn(),
}));

vi.mock("../../utils/logger.js", () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
    fatal: vi.fn(),
    trace: vi.fn(),
    silent: vi.fn(),
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
    globalErrorHandler: vi.fn(),
  };
});

const mockedGetOrders = vi.mocked(getOrders);
const mockedPlaceOrder = vi.mocked(placeOrder);
const mockedGetOrderDetails = vi.mocked(getOrderDetails);
const mockedUpdateOrderStatus = vi.mocked(updateOrderStatus);
const mockedHandleResponse = vi.mocked(handleResponse);
const mockedGlobalErrorHandler = vi.mocked(globalErrorHandler);

const validPlaceBody = {
  userId: "user-123",
  delivery: {
    name: "John Doe",
    phone: "1234567890",
    address: "Street 1, City",
  },
  items: [
    {
      menuItemId: "menu-123",
      quantity: 2,
    },
  ],
};

const createTestApp = () => {
  const app = express();

  app.use(express.json());
  app.use("/api/order", ordersRouter);

  app.use((err: any, req: any, res: any, next: any) => {
    return (mockedGlobalErrorHandler as any)(err, req, res, next);
  });

  return app;
};

describe("orders routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockedHandleResponse.mockImplementation(((
      res: any,
      message: string,
      data: unknown,
    ) => {
      return res.status(200).json({
        message,
        data: data ?? null,
      });
    }) as any);

    mockedGlobalErrorHandler.mockImplementation(((
      err: any,
      _req: any,
      res: any,
      _next: any,
    ) => {
      const status =
        err?.status ||
        err?.statusCode ||
        (err?.name === "ZodError" ? 400 : 500);

      const message = err?.message || "Internal server error";

      return res.status(status).json({
        success: false,
        error: message,
      });
    }) as any);
  });

  describe("GET /api/order/:id", () => {
    it("should return user orders", async () => {
      const orders = [{ _id: "order-1" }];

      mockedGetOrders.mockResolvedValueOnce(orders as any);

      const response = await request(createTestApp()).get(
        "/api/order/user-123",
      );

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        message: "User's orders fetched successfully",
        data: orders,
      });

      expect(mockedGetOrders).toHaveBeenCalledWith(
        expect.objectContaining({
          params: {
            id: "user-123",
          },
        }),
      );

      expect(mockedHandleResponse).toHaveBeenCalledWith(
        expect.anything(),
        "User's orders fetched successfully",
        orders,
      );
    });

    it("should return 500 when service throws Error", async () => {
      mockedGetOrders.mockRejectedValueOnce(new Error("getOrders failed"));

      const response = await request(createTestApp()).get(
        "/api/order/user-123",
      );

      expect(response.status).toBe(500);

      expect(response.body).toEqual({
        success: false,
        error: "getOrders failed",
      });

      expect(mockedHandleResponse).not.toHaveBeenCalled();
    });

    it("should return 500 when service rejects with non-Error value", async () => {
      mockedGetOrders.mockRejectedValueOnce("Unexpected failure");

      const response = await request(createTestApp()).get(
        "/api/order/user-123",
      );

      expect(response.status).toBe(500);

      expect(response.body).toEqual({
        success: false,
        error: "Internal server error",
      });

      expect(mockedHandleResponse).not.toHaveBeenCalled();
    });
  });

  describe("POST /api/order/place", () => {
    it("should place order successfully", async () => {
      const createdOrder = {
        _id: "order-1",
        userId: "user-123",
        totalAmount: 20,
      };

      mockedPlaceOrder.mockResolvedValueOnce(createdOrder as any);

      const response = await request(createTestApp())
        .post("/api/order/place")
        .send(validPlaceBody);

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        message: "Order placed successfully",
        data: createdOrder,
      });

      expect(mockedPlaceOrder).toHaveBeenCalledWith(
        expect.objectContaining({
          body: validPlaceBody,
        }),
      );

      expect(mockedHandleResponse).toHaveBeenCalledWith(
        expect.anything(),
        "Order placed successfully",
        createdOrder,
      );
    });

    it("should return 400 when userId is missing", async () => {
      const invalidBody = { ...validPlaceBody } as any;
      delete invalidBody.userId;

      const response = await request(createTestApp())
        .post("/api/order/place")
        .send(invalidBody);

      expect(response.status).toBe(400);
      expect(mockedPlaceOrder).not.toHaveBeenCalled();
    });

    it("should return 400 when delivery phone is missing", async () => {
      const invalidBody = {
        ...validPlaceBody,
        delivery: {
          name: "John Doe",
          address: "Street 1",
        },
      };

      const response = await request(createTestApp())
        .post("/api/order/place")
        .send(invalidBody);

      expect(response.status).toBe(400);
      expect(mockedPlaceOrder).not.toHaveBeenCalled();
    });

    it("should return 400 when items array is empty", async () => {
      const invalidBody = {
        ...validPlaceBody,
        items: [],
      };

      const response = await request(createTestApp())
        .post("/api/order/place")
        .send(invalidBody);

      expect(response.status).toBe(400);
      expect(mockedPlaceOrder).not.toHaveBeenCalled();
    });

    it("should return 400 when quantity is invalid", async () => {
      const invalidBody = {
        ...validPlaceBody,
        items: [
          {
            menuItemId: "menu-123",
            quantity: 0,
          },
        ],
      };

      const response = await request(createTestApp())
        .post("/api/order/place")
        .send(invalidBody);

      expect(response.status).toBe(400);
      expect(mockedPlaceOrder).not.toHaveBeenCalled();
    });

    it("should return 500 when placeOrder fails", async () => {
      mockedPlaceOrder.mockRejectedValueOnce(new Error("placeOrder failed"));

      const response = await request(createTestApp())
        .post("/api/order/place")
        .send(validPlaceBody);

      expect(response.status).toBe(500);

      expect(response.body).toEqual({
        success: false,
        error: "placeOrder failed",
      });

      expect(mockedHandleResponse).not.toHaveBeenCalled();
    });
  });

  describe("GET /api/order/details/:id", () => {
    it("should return order details", async () => {
      const orderDetails = [{ _id: "order-123" }];

      mockedGetOrderDetails.mockResolvedValueOnce(orderDetails as any);

      const response = await request(createTestApp()).get(
        "/api/order/details/order-123",
      );

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        message: "Order details fetched successfully",
        data: orderDetails,
      });

      expect(mockedGetOrderDetails).toHaveBeenCalledWith(
        expect.objectContaining({
          params: {
            id: "order-123",
          },
        }),
      );
    });

    it("should return 404 when order is not found", async () => {
      const notFoundError = new NotFoundError("Order not found");

      mockedGetOrderDetails.mockRejectedValueOnce(notFoundError);

      const response = await request(createTestApp()).get(
        "/api/order/details/order-123",
      );

      expect(response.status).toBe(404);

      expect(response.body).toEqual({
        success: false,
        error: "Order not found",
      });

      expect(mockedHandleResponse).not.toHaveBeenCalled();
    });

    it("should return 500 when getOrderDetails fails", async () => {
      mockedGetOrderDetails.mockRejectedValueOnce(
        new Error("getOrderDetails failed"),
      );

      const response = await request(createTestApp()).get(
        "/api/order/details/order-123",
      );

      expect(response.status).toBe(500);

      expect(response.body).toEqual({
        success: false,
        error: "getOrderDetails failed",
      });

      expect(mockedHandleResponse).not.toHaveBeenCalled();
    });
  });

  describe("PUT /api/order/:id", () => {
    it("should update order status successfully", async () => {
      const updatedOrder = {
        _id: "order-123",
        status: "DELIVERED",
      };

      mockedUpdateOrderStatus.mockResolvedValueOnce(updatedOrder as any);

      const response = await request(createTestApp())
        .put("/api/order/order-123")
        .send({
          status: "DELIVERED",
        });

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        message: "Order status updated successfully",
        data: updatedOrder,
      });

      expect(mockedUpdateOrderStatus).toHaveBeenCalledWith(
        expect.objectContaining({
          params: {
            id: "order-123",
          },
          body: {
            status: "DELIVERED",
          },
        }),
      );
    });

    it("should return 400 when status is invalid", async () => {
      const response = await request(createTestApp())
        .put("/api/order/order-123")
        .send({
          status: "INVALID_STATUS",
        });

      expect(response.status).toBe(400);
      expect(mockedUpdateOrderStatus).not.toHaveBeenCalled();
    });

    it("should return 400 when status is missing", async () => {
      const response = await request(createTestApp())
        .put("/api/order/order-123")
        .send({});

      expect(response.status).toBe(400);
      expect(mockedUpdateOrderStatus).not.toHaveBeenCalled();
    });

    it("should return 500 when updateOrderStatus fails", async () => {
      mockedUpdateOrderStatus.mockRejectedValueOnce(
        new Error("updateOrderStatus failed"),
      );

      const response = await request(createTestApp())
        .put("/api/order/order-123")
        .send({
          status: "DELIVERED",
        });

      expect(response.status).toBe(500);

      expect(response.body).toEqual({
        success: false,
        error: "updateOrderStatus failed",
      });

      expect(mockedHandleResponse).not.toHaveBeenCalled();
    });
  });
});

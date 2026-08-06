import { describe, expect, it } from "vitest";
import {
  ordersDetailsSchema,
  orderPlaceSchema,
  UpdateOrderStatusSchema,
} from "./orders.validate.js";

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

describe("ordersDetailsSchema", () => {
  it("should accept a valid order id param", () => {
    const result = ordersDetailsSchema.safeParse({
      params: {
        id: "order-123",
      },
    });

    expect(result.success).toBe(true);
  });

  it("should reject empty order id param", () => {
    const result = ordersDetailsSchema.safeParse({
      params: {
        id: "",
      },
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      const hasIdError = result.error.issues.some((issue) =>
        issue.path.includes("id"),
      );

      expect(hasIdError).toBe(true);
    }
  });

  it("should reject missing params", () => {
    const result = ordersDetailsSchema.safeParse({});

    expect(result.success).toBe(false);
  });
});

describe("orderPlaceSchema", () => {
  it("should accept a valid order body", () => {
    const result = orderPlaceSchema.safeParse({
      body: validPlaceBody,
    });

    expect(result.success).toBe(true);
  });

  it("should accept multiple order items", () => {
    const result = orderPlaceSchema.safeParse({
      body: {
        ...validPlaceBody,
        items: [
          {
            menuItemId: "menu-1",
            quantity: 1,
          },
          {
            menuItemId: "menu-2",
            quantity: 3,
          },
        ],
      },
    });

    expect(result.success).toBe(true);
  });

  it("should reject missing userId", () => {
    const invalidBody = { ...validPlaceBody } as any;
    delete invalidBody.userId;

    const result = orderPlaceSchema.safeParse({
      body: invalidBody,
    });

    expect(result.success).toBe(false);
  });

  it("should reject missing delivery name", () => {
    const result = orderPlaceSchema.safeParse({
      body: {
        ...validPlaceBody,
        delivery: {
          phone: "1234567890",
          address: "Street 1",
        },
      },
    });

    expect(result.success).toBe(false);
  });

  it("should reject missing delivery phone", () => {
    const result = orderPlaceSchema.safeParse({
      body: {
        ...validPlaceBody,
        delivery: {
          name: "John Doe",
          address: "Street 1",
        },
      },
    });

    expect(result.success).toBe(false);
  });

  it("should reject missing delivery address", () => {
    const result = orderPlaceSchema.safeParse({
      body: {
        ...validPlaceBody,
        delivery: {
          name: "John Doe",
          phone: "1234567890",
        },
      },
    });

    expect(result.success).toBe(false);
  });

  it("should reject empty items array", () => {
    const result = orderPlaceSchema.safeParse({
      body: {
        ...validPlaceBody,
        items: [],
      },
    });

    expect(result.success).toBe(false);
  });

  it("should reject missing menuItemId", () => {
    const result = orderPlaceSchema.safeParse({
      body: {
        ...validPlaceBody,
        items: [
          {
            quantity: 2,
          },
        ],
      },
    });

    expect(result.success).toBe(false);
  });

  it("should reject zero quantity", () => {
    const result = orderPlaceSchema.safeParse({
      body: {
        ...validPlaceBody,
        items: [
          {
            menuItemId: "menu-123",
            quantity: 0,
          },
        ],
      },
    });

    expect(result.success).toBe(false);
  });

  it("should reject negative quantity", () => {
    const result = orderPlaceSchema.safeParse({
      body: {
        ...validPlaceBody,
        items: [
          {
            menuItemId: "menu-123",
            quantity: -1,
          },
        ],
      },
    });

    expect(result.success).toBe(false);
  });

  it("should reject non-integer quantity", () => {
    const result = orderPlaceSchema.safeParse({
      body: {
        ...validPlaceBody,
        items: [
          {
            menuItemId: "menu-123",
            quantity: 1.5,
          },
        ],
      },
    });

    expect(result.success).toBe(false);
  });
});

describe("UpdateOrderStatusSchema", () => {
  it("should accept valid order statuses", () => {
    const validStatuses = [
      "ORDER_RECEIVED",
      "PREPARING",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
      "CANCELLED",
    ];

    for (const status of validStatuses) {
      const result = UpdateOrderStatusSchema.safeParse({
        body: {
          status,
        },
      });

      expect(result.success).toBe(true);
    }
  });

  it("should reject invalid order status", () => {
    const result = UpdateOrderStatusSchema.safeParse({
      body: {
        status: "INVALID_STATUS",
      },
    });

    expect(result.success).toBe(false);
  });

  it("should reject missing status", () => {
    const result = UpdateOrderStatusSchema.safeParse({
      body: {},
    });

    expect(result.success).toBe(false);
  });
});

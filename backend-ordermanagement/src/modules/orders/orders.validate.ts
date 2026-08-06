import { z } from "zod";

// Validation schema for orders details
export const ordersDetailsSchema = z.object({
  params: z.object({
    id: z.string().min(1, "orders id is required"),
  }),
});

export const orderPlaceSchema = z.object({
  body: z.object({
    userId: z.string().min(1, "userId is required"),
    delivery: z.object({
      name: z.string().min(1, "Delivery name is required"),
      phone: z.string().min(1, "Phone number is required"),
      address: z.string().min(1, "Delivery address is required"),
    }),
    items: z
      .array(
        z.object({
          menuItemId: z.string().min(1, "menuItemId is required"),
          quantity: z
            .number()
            .int()
            .positive("Quantity must be a positive integer"),
        }),
      )
      .min(1, "Order must contain at least one item"),
  }),
});

enum OrderStatus {
  ORDER_RECEIVED = "ORDER_RECEIVED",
  PREPARING = "PREPARING",
  OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export const UpdateOrderStatusSchema = z.object({
  body: z.object({
    status: z.nativeEnum(OrderStatus),
  }),
});

export type UpdateOrderStatusInput = z.infer<typeof UpdateOrderStatusSchema>;

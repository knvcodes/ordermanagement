import { z } from "zod";

// Validation schema for listing orderss
export const ordersListingSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    limit: z
      .string()
      .regex(/^[0-9]+$/, "Limit must be a valid number")
      .optional(),
  }),
});

// Validation schema for orders details
export const ordersDetailsSchema = z.object({
  params: z.object({
    id: z.string().min(1, "orders id is required"),
  }),
});

export enum OrderStatus {
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

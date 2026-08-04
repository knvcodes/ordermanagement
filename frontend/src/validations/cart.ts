import { z } from "zod";

export const addToCartSchema = z.object({
  itemId: z.string().min(1, "Item ID is required"),
  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1")
    .max(20, "Maximum 20 items per entry"),
});

export const updateCartItemSchema = z.object({
  itemId: z.string().min(1, "Item ID is required"),
  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .min(0, "Quantity cannot be negative")
    .max(20, "Maximum 20 items per entry"),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;

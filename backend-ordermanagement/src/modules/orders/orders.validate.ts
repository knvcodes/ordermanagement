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
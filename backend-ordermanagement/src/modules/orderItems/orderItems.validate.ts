import { z } from "zod";

// Validation schema for listing orderItemss
export const orderItemsListingSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    limit: z
      .string()
      .regex(/^[0-9]+$/, "Limit must be a valid number")
      .optional(),
  }),
});

// Validation schema for orderItems details
export const orderItemsDetailsSchema = z.object({
  params: z.object({
    id: z.string().min(1, "orderItems id is required"),
  }),
});
import { z } from "zod";

// Validation schema for listing menus
export const menuListingSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    page: z
      .string()
      .regex(/^[0-9]+$/, "Page must be a valid number")
      .optional(),

    limit: z
      .string()
      .regex(/^[0-9]+$/, "Limit must be a valid number")
      .optional(),
  }),
});

// Validation schema for menu details
export const menuItemDetailsSchema = z.object({
  params: z.object({
    id: z.string().min(1, "menu id is required"),
  }),
});

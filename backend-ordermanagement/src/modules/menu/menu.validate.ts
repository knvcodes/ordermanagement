import { z } from "zod";

enum Categories {
  ALL = "All",
  PIZZA = "Pizza",
  BURGER = "Burger",
  PASTA = "Pasta",
  SALAD = "Salad",
  DRINK = "Drink",
  DESSERT = "Dessert",
}

// Validation schema for listing menus
export const menuListingSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    category: z.nativeEnum(Categories),
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

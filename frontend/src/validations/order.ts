import { z } from "zod";

export const deliveryFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  phone: z
    .string()
    .regex(
      /^\+?[\d\s\-()]{7,15}$/,
      "Please enter a valid phone number (e.g., +1 555-123-4567)",
    ),
  notes: z.string().max(200, "Notes must be under 200 characters").optional(),
});

export type DeliveryFormData = z.infer<typeof deliveryFormSchema>;

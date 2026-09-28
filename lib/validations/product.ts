import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().nullable(),
  price: z.number().min(0, "Price must be a valid positive number"),
  priceVaries: z.boolean().optional(),
  imageUrl: z.string().url().optional().nullable(),
  categoryId: z.string().min(1, "Category is required"),
  available: z.boolean().optional(),
  featured: z.boolean().optional(),
  sortOrder: z.number().optional(),
  notes: z.string().optional().nullable(),
});

export type ProductInput = z.infer<typeof productSchema>;

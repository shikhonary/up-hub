import { z } from "zod";
import { nameSchema, uuidSchema, timestampSchema } from "./shared/fields";

/**
 * Trade License Category Schema
 */

export const tradeLicenseCategoryFormSchema = z.object({
  typeEn: nameSchema.describe("English type name (e.g., WHOLESALE_BUSINESS)"),
  typeBn: z.string().min(1, "Bengali name is required").max(100),
});

export type TradeLicenseCategoryFormValues = z.infer<typeof tradeLicenseCategoryFormSchema>;

export const tradeLicenseCategorySchema = tradeLicenseCategoryFormSchema.extend({
  id: uuidSchema,
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
});

export type TradeLicenseCategory = z.infer<typeof tradeLicenseCategorySchema>;

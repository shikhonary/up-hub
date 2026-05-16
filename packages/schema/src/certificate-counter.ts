import { z } from "zod";
import { nameSchema, uuidSchema, timestampSchema } from "./shared/fields";

/**
 * Certificate Counter Schema
 */

export const certificateCounterFormSchema = z.object({
  typeEn: nameSchema.describe("English type name (e.g., CITIZEN_CERTIFICATE)"),
  typeBn: z.string().min(1, "Bengali name is required").max(100),
  count: z.coerce.number().int().min(0),
});

export type CertificateCounterFormValues = z.infer<typeof certificateCounterFormSchema>;

export const certificateCounterSchema = certificateCounterFormSchema.extend({
  id: uuidSchema,
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
});

export type CertificateCounter = z.infer<typeof certificateCounterSchema>;

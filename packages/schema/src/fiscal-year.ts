import { z } from "zod";
import { nameSchema } from "./shared/fields";

/**
 * Fiscal Year Schema
 */

export const fiscalYearFormSchema = z.object({
  name: nameSchema.describe("Fiscal Year Name (e.g., 2023-2024)"),
  nameBn: z.string().min(1, "Bengali name is required").max(100),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }),
  isCurrent: z.boolean(),
  isActive: z.boolean(),
});

export type FiscalYearFormValues = z.infer<typeof fiscalYearFormSchema>;

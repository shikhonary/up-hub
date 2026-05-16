import { z } from "zod";
import { baseListInputSchema, zNullishString } from "../filters";

export const listHoldingTaxInput = baseListInputSchema.extend({
  assessmentId: z.string().uuid().optional().nullable(),
  citizenId: z.string().uuid().optional().nullable(),
  fiscalYearId: z.string().uuid().optional().nullable(),
  status: z.string().optional().nullable(),
  wardNo: z.coerce.number().optional().nullable(),
  villageBn: zNullishString,
  search: zNullishString,
});

export const idSchema = z.string().uuid();

export const collectHoldingTaxInput = z.object({
  id: z.string().uuid(),
  paidAmount: z.number().min(0),
});

export const updateHoldingTaxInput = z.object({
  id: z.string().uuid(),
  totalAmount: z.number().min(0).optional(),
  status: z.enum(["UNPAID", "PARTIAL", "PAID"]).optional(),
});

export const analyticsHoldingTaxInput = z.object({
  fiscalYearId: z.string().uuid().optional().nullable(),
  wardNo: z.coerce.number().optional().nullable(),
  villageBn: zNullishString,
});

export const reportHoldingTaxInput = analyticsHoldingTaxInput.extend({
  status: z.string().optional().nullable(),
});

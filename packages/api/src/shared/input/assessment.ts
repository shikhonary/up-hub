import { z } from "zod";
import { baseListInputSchema, zNullishString } from "../filters";

export const listAssessmentInput = baseListInputSchema.extend({
  wardNo: z.coerce.number().optional().nullable(),
  villageBn: zNullishString,
  holdingNo: zNullishString,
});

export const idSchema = z.string().uuid();
export const bulkGenerateTaxInput = z.object({
  assessmentIds: z.array(z.string().uuid()),
  fiscalYearId: z.string().uuid(),
});

export const collectTaxInput = z.object({
  taxId: z.string().uuid(),
  paidAmount: z.number().min(0),
});

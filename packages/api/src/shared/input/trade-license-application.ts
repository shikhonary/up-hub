import { z } from "zod";

export const idSchema = z.string().uuid();

export const listTradeLicenseApplicationInput = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  search: z.string().optional().nullable(),
  wardNo: z.number().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  fiscalYearId: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  sortBy: z.string().optional().nullable(),
  sortOrder: z.enum(["asc", "desc"]).optional().nullable(),
});

export const updateStatusInput = z.object({
  id: idSchema,
  status: z.string(),
});

import { z } from "zod";
import { baseListInputSchema } from "../filters";

export const listFamilyInput = baseListInputSchema.extend({
  search: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  citizenId: z.string().optional().nullable(),
});

export const familyIdSchema = z.string().uuid();

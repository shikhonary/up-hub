import z from "zod";
import { baseListInputSchema } from "../filters";
import { fiscalYearFormSchema } from "@workspace/schema";

export const listInput = baseListInputSchema.extend({});

export type listInputType = z.infer<typeof listInput>;

export const idSchema = z.string().uuid({ message: "Invalid UUID format" });

export type idInputType = z.infer<typeof idSchema>;

export const updateFiscalYearSchema = fiscalYearFormSchema.extend({
  id: idSchema,
});

export type updateFiscalYearInputType = z.infer<typeof updateFiscalYearSchema>;

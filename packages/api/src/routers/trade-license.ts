import { z } from "zod";
import {
  createTRPCRouter,
  tenantProcedure,
  baseTenantMutationProcedure,
} from "../trpc/index";
import { TradeLicenseService } from "../services/trade-license.service";

const listTradeLicenseInput = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  search: z.string().optional().nullable(),
  fiscalYearId: z.string().optional().nullable(),
  paymentStatus: z.string().optional().nullable(),
  isExpired: z.boolean().optional().nullable(),
  sortBy: z.string().optional().nullable(),
  sortOrder: z.enum(["asc", "desc"]).optional().nullable(),
});

export const tradeLicenseRouter = createTRPCRouter({
  list: tenantProcedure
    .input(listTradeLicenseInput)
    .query(async ({ ctx, input }) => {
      const service = new TradeLicenseService(ctx.tenantClient);
      return await service.list(input);
    }),

  getById: tenantProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const service = new TradeLicenseService(ctx.tenantClient);
      return await service.getById(input);
    }),

  getStats: tenantProcedure.query(async ({ ctx }) => {
    const service = new TradeLicenseService(ctx.tenantClient);
    return await service.getStats();
  }),
});

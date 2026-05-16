import { type TRPCRouterRecord } from "@trpc/server";
import {
  createTRPCRouter,
  tenantProcedure,
  baseTenantMutationProcedure,
} from "../trpc/index";
import { HoldingTaxService } from "../services/holding-tax.service";
import {
  listHoldingTaxInput,
  idSchema,
  collectHoldingTaxInput,
  analyticsHoldingTaxInput,
  reportHoldingTaxInput,
} from "../shared/input/holding-tax";

export const holdingTaxRouter = createTRPCRouter({
  list: tenantProcedure.input(listHoldingTaxInput).query(async ({ ctx, input }) => {
    const service = new HoldingTaxService(ctx.tenantClient);
    return await service.list(input);
  }),

  getById: tenantProcedure.input(idSchema).query(async ({ ctx, input }) => {
    const service = new HoldingTaxService(ctx.tenantClient);
    return await service.getById(input);
  }),

  getStats: tenantProcedure.query(async ({ ctx }) => {
    const service = new HoldingTaxService(ctx.tenantClient);
    return await service.getStats();
  }),

  getAnalytics: tenantProcedure
    .input(analyticsHoldingTaxInput)
    .query(async ({ ctx, input }) => {
      const service = new HoldingTaxService(ctx.tenantClient);
      return await service.getAnalytics(input);
    }),

  getReportData: tenantProcedure
    .input(reportHoldingTaxInput)
    .query(async ({ ctx, input }) => {
      const service = new HoldingTaxService(ctx.tenantClient);
      return await service.getReportData(input);
    }),

  collect: baseTenantMutationProcedure
    .input(collectHoldingTaxInput)
    .mutation(async ({ ctx, input }) => {
      const { id, paidAmount } = input;
      const service = new HoldingTaxService(ctx.tenantClient);
      return await service.collectTax(id, {
        paidAmount,
        collectedById: ctx.userId!,
        collectedByName: ctx.user?.name || "System",
      });
    }),
});

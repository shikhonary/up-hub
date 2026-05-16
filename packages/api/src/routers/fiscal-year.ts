import { z } from "zod";
import { type TRPCRouterRecord } from "@trpc/server";
import {
  createTRPCRouter,
  tenantProcedure,
  baseTenantMutationProcedure,
} from "../trpc/index";
import { FiscalYearService } from "../services/fiscal-year.service";
import { idSchema, listInput, updateFiscalYearSchema } from "../shared/input/fiscal-year";
import { fiscalYearFormSchema } from "@workspace/schema";

export const fiscalYearRouter = createTRPCRouter({
  list: tenantProcedure.input(listInput).query(async ({ ctx, input }) => {
    const service = new FiscalYearService(ctx.tenantClient);
    const data = await service.list(input);
    return {
      success: true,
      data,
    };
  }),

  getById: tenantProcedure.input(idSchema).query(async ({ ctx, input }) => {
    const service = new FiscalYearService(ctx.tenantClient);
    const data = await service.getById(input);
    return {
      success: true,
      data,
    };
  }),

  getCurrent: tenantProcedure.query(async ({ ctx }) => {
    const service = new FiscalYearService(ctx.tenantClient);
    const data = await service.getCurrent();
    return {
      success: true,
      data,
    };
  }),

  create: baseTenantMutationProcedure
    .input(fiscalYearFormSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new FiscalYearService(ctx.tenantClient);
      const data = await service.create(input);
      return {
        success: true,
        message: "Fiscal year created successfully",
        data,
      };
    }),

  update: baseTenantMutationProcedure
    .input(updateFiscalYearSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new FiscalYearService(ctx.tenantClient);
      const data = await service.update(input);
      return {
        success: true,
        message: "Fiscal year updated successfully",
        data,
      };
    }),

  delete: baseTenantMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new FiscalYearService(ctx.tenantClient);
      const data = await service.delete(input.id);
      return {
        success: true,
        message: "Fiscal year deleted successfully",
        data,
      };
    }),

  setCurrent: baseTenantMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new FiscalYearService(ctx.tenantClient);
      const data = await service.setCurrent(input.id);
      return {
        success: true,
        message: "Current fiscal year updated successfully",
        data,
      };
    }),

  toggleActive: baseTenantMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new FiscalYearService(ctx.tenantClient);
      const data = await service.toggleActive(input.id);
      return {
        success: true,
        message: "Fiscal year status toggled successfully",
        data,
      };
    }),

  forSelection: tenantProcedure.query(async ({ ctx }) => {
    const service = new FiscalYearService(ctx.tenantClient);
    const data = await service.forSelection();
    return {
      success: true,
      data,
    };
  }),

  getStats: tenantProcedure.query(async ({ ctx }) => {
    const service = new FiscalYearService(ctx.tenantClient);
    const data = await service.getStats();
    return {
      success: true,
      data,
    };
  }),
} satisfies TRPCRouterRecord);


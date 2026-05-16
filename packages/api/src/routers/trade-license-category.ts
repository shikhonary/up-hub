import { z } from "zod";
import { type TRPCRouterRecord } from "@trpc/server";
import {
  createTRPCRouter,
  tenantProcedure,
  baseTenantMutationProcedure,
} from "../trpc/index";
import { TradeLicenseCategoryService } from "../services/trade-license-category.service";
import {
  idSchema,
  listInput,
  updateTradeLicenseCategorySchema,
} from "../shared/input/trade-license-category";
import { tradeLicenseCategoryFormSchema } from "@workspace/schema";

export const tradeLicenseCategoryRouter = createTRPCRouter({
  list: tenantProcedure.input(listInput).query(async ({ ctx, input }) => {
    const service = new TradeLicenseCategoryService(ctx.tenantClient);
    const data = await service.list(input);
    return {
      success: true,
      data,
    };
  }),

  getById: tenantProcedure.input(idSchema).query(async ({ ctx, input }) => {
    const service = new TradeLicenseCategoryService(ctx.tenantClient);
    const data = await service.getById(input);
    return {
      success: true,
      data,
    };
  }),

  create: baseTenantMutationProcedure
    .input(tradeLicenseCategoryFormSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new TradeLicenseCategoryService(ctx.tenantClient);
      const data = await service.create(input);
      return {
        success: true,
        message: "Trade license category created successfully",
        data,
      };
    }),

  update: baseTenantMutationProcedure
    .input(updateTradeLicenseCategorySchema)
    .mutation(async ({ ctx, input }) => {
      const service = new TradeLicenseCategoryService(ctx.tenantClient);
      const data = await service.update(input);
      return {
        success: true,
        message: "Trade license category updated successfully",
        data,
      };
    }),

  delete: baseTenantMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new TradeLicenseCategoryService(ctx.tenantClient);
      const data = await service.delete(input.id);
      return {
        success: true,
        message: "Trade license category deleted successfully",
        data,
      };
    }),
} satisfies TRPCRouterRecord)

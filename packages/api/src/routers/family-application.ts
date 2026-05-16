import { z } from "zod";
import { type TRPCRouterRecord } from "@trpc/server";
import {
  createTRPCRouter,
  tenantProcedure,
  baseTenantMutationProcedure,
} from "../trpc/index";
import { familyApplicationSchema } from "@workspace/schema";
import { FamilyApplicationService } from "../services/family-application.service";
import { familyIdSchema, listFamilyInput } from "../shared/input/family-application";

export const familyApplicationRouter = createTRPCRouter({
  list: tenantProcedure.input(listFamilyInput).query(async ({ ctx, input }) => {
    const service = new FamilyApplicationService(ctx.tenantClient);
    return await service.list(input);
  }),

  getById: tenantProcedure.input(familyIdSchema).query(async ({ ctx, input }) => {
    const service = new FamilyApplicationService(ctx.tenantClient);
    return await service.getById(input);
  }),

  create: baseTenantMutationProcedure
    .input(familyApplicationSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new FamilyApplicationService(ctx.tenantClient);
      return await service.create(input);
    }),

  update: baseTenantMutationProcedure
    .input(
      familyApplicationSchema.partial().extend({
        id: familyIdSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const service = new FamilyApplicationService(ctx.tenantClient);
      return await service.update(id, data);
    }),

  delete: baseTenantMutationProcedure
    .input(familyIdSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new FamilyApplicationService(ctx.tenantClient);
      return await service.delete(input);
    }),

  approve: baseTenantMutationProcedure
    .input(familyIdSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new FamilyApplicationService(ctx.tenantClient);
      return await service.approve(input);
    }),

  reject: baseTenantMutationProcedure
    .input(familyIdSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new FamilyApplicationService(ctx.tenantClient);
      return await service.reject(input);
    }),

  getStats: tenantProcedure.query(async ({ ctx }) => {
    const service = new FamilyApplicationService(ctx.tenantClient);
    return await service.getStats();
  }),
} satisfies TRPCRouterRecord)

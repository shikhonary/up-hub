import { type TRPCRouterRecord } from "@trpc/server";
import {
  createTRPCRouter,
  tenantProcedure,
  baseTenantMutationProcedure,
} from "../trpc/index";
import { assessmentApplicationSchema } from "@workspace/schema";
import { AssessmentService } from "../services/assessment.service";
import { idSchema, listAssessmentInput, bulkGenerateTaxInput } from "../shared/input/assessment";

export const assessmentRouter = createTRPCRouter({
  list: tenantProcedure.input(listAssessmentInput).query(async ({ ctx, input }) => {
    const service = new AssessmentService(ctx.tenantClient);
    return await service.list(input);
  }),

  getById: tenantProcedure.input(idSchema).query(async ({ ctx, input }) => {
    const service = new AssessmentService(ctx.tenantClient);
    return await service.getById(input);
  }),

  create: baseTenantMutationProcedure
    .input(assessmentApplicationSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new AssessmentService(ctx.tenantClient);
      return await service.create(input);
    }),

  update: baseTenantMutationProcedure
    .input(
      assessmentApplicationSchema.partial().extend({
        id: idSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const service = new AssessmentService(ctx.tenantClient);
      return await service.update(id, data);
    }),

  delete: baseTenantMutationProcedure
    .input(idSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new AssessmentService(ctx.tenantClient);
      return await service.delete(input);
    }),

  getStats: tenantProcedure.query(async ({ ctx }) => {
    const service = new AssessmentService(ctx.tenantClient);
    return await service.getStats();
  }),

  bulkGenerateTax: baseTenantMutationProcedure
    .input(bulkGenerateTaxInput)
    .mutation(async ({ ctx, input }) => {
      const { assessmentIds, fiscalYearId } = input;
      const service = new AssessmentService(ctx.tenantClient);
      return await service.bulkGenerateTax(assessmentIds, fiscalYearId);
    }),
} satisfies TRPCRouterRecord);

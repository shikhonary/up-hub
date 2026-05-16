import {
  createTRPCRouter,
  tenantProcedure,
  baseTenantMutationProcedure,
} from "../trpc/index";
import { successionApplicationSchema } from "@workspace/schema";
import { SuccessionApplicationService } from "../services/succession-application.service";
import { 
  idSchema, 
  listSuccessionApplicationInput, 
  updateStatusInput 
} from "../shared/input/succession-application";

export const successionApplicationRouter = createTRPCRouter({
  list: tenantProcedure
    .input(listSuccessionApplicationInput)
    .query(async ({ ctx, input }) => {
      const service = new SuccessionApplicationService(ctx.tenantClient);
      return await service.list(input);
    }),

  getById: tenantProcedure
    .input(idSchema)
    .query(async ({ ctx, input }) => {
      const service = new SuccessionApplicationService(ctx.tenantClient);
      return await service.getById(input);
    }),

  create: baseTenantMutationProcedure
    .input(successionApplicationSchema)
    .mutation(async ({ ctx, input }) => {
      const tenantWithLocation = await ctx.db.tenant.findUnique({
        where: { id: ctx.tenant?.id },
        include: { division: true, district: true, upazila: true },
      });

      if (tenantWithLocation) {
        const locationData = {
          presentDistrictEn: tenantWithLocation.district.name,
          presentDistrictBn: tenantWithLocation.district.nameBn,
          presentUpazilaEn: tenantWithLocation.upazila.name,
          presentUpazilaBn: tenantWithLocation.upazila.nameBn,
          
          permanentDistrictEn: tenantWithLocation.district.name,
          permanentDistrictBn: tenantWithLocation.district.nameBn,
          permanentUpazilaEn: tenantWithLocation.upazila.name,
          permanentUpazilaBn: tenantWithLocation.upazila.nameBn,
        };
        Object.assign(input, locationData);
      }

      const service = new SuccessionApplicationService(ctx.tenantClient);
      return await service.create(input);
    }),

  update: baseTenantMutationProcedure
    .input(
      successionApplicationSchema.partial().extend({
        id: idSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const service = new SuccessionApplicationService(ctx.tenantClient);
      return await service.update(id, data);
    }),

  delete: baseTenantMutationProcedure
    .input(idSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new SuccessionApplicationService(ctx.tenantClient);
      return await service.delete(input);
    }),

  getStats: tenantProcedure.query(async ({ ctx }) => {
    const service = new SuccessionApplicationService(ctx.tenantClient);
    return await service.getStats();
  }),

  updateStatus: baseTenantMutationProcedure
    .input(updateStatusInput)
    .mutation(async ({ ctx, input }) => {
      const { id, status } = input;
      const service = new SuccessionApplicationService(ctx.tenantClient);
      return await service.updateStatus(id, status);
    }),
});

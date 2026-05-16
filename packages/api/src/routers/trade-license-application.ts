import { z } from "zod";
import { type TRPCRouterRecord } from "@trpc/server";
import {
  createTRPCRouter,
  tenantProcedure,
  baseTenantMutationProcedure,
} from "../trpc/index";
import { tradeLicenseApplicationSchema, generateTradeLicenseSchema } from "@workspace/schema";
import { TradeLicenseApplicationService } from "../services/trade-license-application.service";
import { 
  idSchema, 
  listTradeLicenseApplicationInput, 
  updateStatusInput 
} from "../shared/input/trade-license-application";

export const tradeLicenseApplicationRouter = createTRPCRouter({
  list: tenantProcedure
    .input(listTradeLicenseApplicationInput)
    .query(async ({ ctx, input }) => {
      const service = new TradeLicenseApplicationService(ctx.tenantClient);
      return await service.list(input);
    }),

  getById: tenantProcedure
    .input(idSchema)
    .query(async ({ ctx, input }) => {
      const service = new TradeLicenseApplicationService(ctx.tenantClient);
      return await service.getById(input);
    }),

  create: baseTenantMutationProcedure
    .input(tradeLicenseApplicationSchema)
    .mutation(async ({ ctx, input }) => {
      const tenantWithLocation = await ctx.db.tenant.findUnique({
        where: { id: ctx.tenant?.id },
        include: { division: true, district: true, upazila: true },
      });

      if (tenantWithLocation) {
        const locationData = {
          presentDivisionEn: tenantWithLocation.division.name,
          presentDivisionBn: tenantWithLocation.division.nameBn,
          presentDistrictEn: tenantWithLocation.district.name,
          presentDistrictBn: tenantWithLocation.district.nameBn,
          presentUpazilaEn: tenantWithLocation.upazila.name,
          presentUpazilaBn: tenantWithLocation.upazila.nameBn,
          
          permanentDivisionEn: tenantWithLocation.division.name,
          permanentDivisionBn: tenantWithLocation.division.nameBn,
          permanentDistrictEn: tenantWithLocation.district.name,
          permanentDistrictBn: tenantWithLocation.district.nameBn,
          permanentUpazilaEn: tenantWithLocation.upazila.name,
          permanentUpazilaBn: tenantWithLocation.upazila.nameBn,

          businessDivisionEn: tenantWithLocation.division.name,
          businessDivisionBn: tenantWithLocation.division.nameBn,
          businessDistrictEn: tenantWithLocation.district.name,
          businessDistrictBn: tenantWithLocation.district.nameBn,
          businessUpazilaEn: tenantWithLocation.upazila.name,
          businessUpazilaBn: tenantWithLocation.upazila.nameBn,
        };
        Object.assign(input, locationData);
      }

      const service = new TradeLicenseApplicationService(ctx.tenantClient);
      return await service.create(input);
    }),

  update: baseTenantMutationProcedure
    .input(
      tradeLicenseApplicationSchema.partial().extend({
        id: idSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const service = new TradeLicenseApplicationService(ctx.tenantClient);
      return await service.update(id, data);
    }),

  delete: baseTenantMutationProcedure
    .input(idSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new TradeLicenseApplicationService(ctx.tenantClient);
      return await service.delete(input);
    }),

  getStats: tenantProcedure.query(async ({ ctx }) => {
    const service = new TradeLicenseApplicationService(ctx.tenantClient);
    return await service.getStats();
  }),

  updateStatus: baseTenantMutationProcedure
    .input(updateStatusInput)
    .mutation(async ({ ctx, input }) => {
      const { id, status } = input;
      const service = new TradeLicenseApplicationService(ctx.tenantClient);
      return await service.updateStatus(id, status);
    }),

  generateLicense: baseTenantMutationProcedure
    .input(generateTradeLicenseSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new TradeLicenseApplicationService(ctx.tenantClient);
      return await service.generateLicense(input);
    }),

  collectPayment: baseTenantMutationProcedure
    .input(z.object({
      licenseId: z.string(),
      paymentType: z.string(),
      paymentDate: z.coerce.date(),
    }))
    .mutation(async ({ ctx, input }) => {
      const service = new TradeLicenseApplicationService(ctx.tenantClient);
      return await service.collectPayment(input);
    }),
});

import { z } from "zod";
import { type TRPCRouterRecord } from "@trpc/server";
import { createTRPCRouter, publicProcedure, tenantProcedure } from "../trpc/index";
import { LocationService } from "../services/location.service";

export const locationRouter = createTRPCRouter({
  getDivisions: publicProcedure.query(async ({ ctx }) => {
    const service = new LocationService(ctx.db);
    return await service.getDivisions();
  }),

  getDistricts: publicProcedure
    .input(z.object({ divisionId: z.string().optional().nullish() }))
    .query(async ({ ctx, input }) => {
      const service = new LocationService(ctx.db);
      return await service.getDistricts(input.divisionId);
    }),

  getUpazilas: publicProcedure
    .input(z.object({ districtId: z.string().optional().nullish() }))
    .query(async ({ ctx, input }) => {
      const service = new LocationService(ctx.db);
      return await service.getUpazilas(input.districtId);
    }),

  getUnions: publicProcedure
    .input(z.object({ upazilaId: z.string().optional().nullish() }))
    .query(async ({ ctx, input }) => {
      const service = new LocationService(ctx.db);
      return await service.getUnions(input.upazilaId);
    }),

  getPostOffices: publicProcedure
    .input(z.object({ upazilaId: z.string().optional().nullish() }))
    .query(async ({ ctx, input }) => {
      const service = new LocationService(ctx.db);
      return await service.getPostOffices(input.upazilaId);
    }),

  getTenantPostOffices: tenantProcedure
    .query(async ({ ctx }) => {
      const upazilaId = ctx.tenant?.upazilaId;
      if (!upazilaId) return [];
      const service = new LocationService(ctx.db);
      return await service.getPostOffices(upazilaId);
    }),
} satisfies TRPCRouterRecord);

import { z } from "zod";
import { type TRPCRouterRecord } from "@trpc/server";
import {
  createTRPCRouter,
  tenantProcedure,
  baseTenantMutationProcedure,
} from "../trpc/index";
import { CertificateCounterService } from "../services/certificate-counter.service";
import {
  idSchema,
  listInput,
  updateCertificateCounterSchema,
} from "../shared/input/certificate-counter";
import { certificateCounterFormSchema } from "@workspace/schema";

export const certificateCounterRouter = createTRPCRouter({
  list: tenantProcedure.input(listInput).query(async ({ ctx, input }) => {
    const service = new CertificateCounterService(ctx.tenantClient);
    const data = await service.list(input);
    return {
      success: true,
      data,
    };
  }),

  getById: tenantProcedure.input(idSchema).query(async ({ ctx, input }) => {
    const service = new CertificateCounterService(ctx.tenantClient);
    const data = await service.getById(input);
    return {
      success: true,
      data,
    };
  }),

  getByType: tenantProcedure
    .input(z.object({ typeEn: z.string() }))
    .query(async ({ ctx, input }) => {
      const service = new CertificateCounterService(ctx.tenantClient);
      const data = await service.getByType(input.typeEn);
      return {
        success: true,
        data,
      };
    }),

  create: baseTenantMutationProcedure
    .input(certificateCounterFormSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new CertificateCounterService(ctx.tenantClient);
      const data = await service.create(input);
      return {
        success: true,
        message: "Certificate counter created successfully",
        data,
      };
    }),

  update: baseTenantMutationProcedure
    .input(updateCertificateCounterSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new CertificateCounterService(ctx.tenantClient);
      const data = await service.update(input);
      return {
        success: true,
        message: "Certificate counter updated successfully",
        data,
      };
    }),

  delete: baseTenantMutationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new CertificateCounterService(ctx.tenantClient);
      const data = await service.delete(input.id);
      return {
        success: true,
        message: "Certificate counter deleted successfully",
        data,
      };
    }),

  increment: baseTenantMutationProcedure
    .input(z.object({ typeEn: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new CertificateCounterService(ctx.tenantClient);
      const data = await service.increment(input.typeEn);
      return {
        success: true,
        message: "Certificate counter incremented successfully",
        data,
      };
    }),
} satisfies TRPCRouterRecord);

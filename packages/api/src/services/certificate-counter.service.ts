import { type TenantClient } from "@workspace/db";
import { handlePrismaError } from "../middleware/error-handler";
import {
  certificateCounterFormSchema,
  uuidSchema,
  type CertificateCounterFormValues,
} from "@workspace/schema";
import {
  buildPagination,
  buildOrderBy,
  buildWhere,
} from "../shared/query-builder";
import {
  type idInputType,
  type listInputType,
  type updateCertificateCounterInputType,
} from "../shared/input/certificate-counter";

/**
 * Service for managing Certificate Counters (Tenant Level)
 */
export class CertificateCounterService {
  constructor(private db: TenantClient) {}

  async list(input: listInputType) {
    try {
      const where = buildWhere(input, ["typeEn", "typeBn"]);
      const orderBy = buildOrderBy(input);
      const pagination = buildPagination(input);

      const [items, total] = await Promise.all([
        this.db.certificateCounter.findMany({
          where,
          orderBy,
          ...pagination,
        }),
        this.db.certificateCounter.count({ where }),
      ]);

      return {
        items,
        total,
      };
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getById(input: idInputType) {
    try {
      const validatedId = uuidSchema.parse(input);
      return await this.db.certificateCounter.findUnique({
        where: { id: validatedId },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async create(input: CertificateCounterFormValues) {
    try {
      const data = certificateCounterFormSchema.parse(input);
      return await this.db.certificateCounter.create({
        data,
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async update(input: updateCertificateCounterInputType) {
    try {
      const { id, ...data } = input;
      return await this.db.certificateCounter.update({
        where: { id },
        data,
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async delete(input: idInputType) {
    try {
      const validatedId = uuidSchema.parse(input);
      return await this.db.certificateCounter.delete({
        where: { id: validatedId },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  /**
   * Atomic increment for a specific certificate type
   */
  async increment(typeEn: string) {
    try {
      const counter = await this.db.certificateCounter.update({
        where: { typeEn },
        data: {
          count: {
            increment: 1,
          },
        },
      });
      return counter;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  /**
   * Get a counter by its English type name
   */
  async getByType(typeEn: string) {
    try {
      return await this.db.certificateCounter.findUnique({
        where: { typeEn },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }
}

import { type TenantClient } from "@workspace/db";
import { handlePrismaError } from "../middleware/error-handler";
import {
  tradeLicenseCategoryFormSchema,
  uuidSchema,
  type TradeLicenseCategoryFormValues,
} from "@workspace/schema";
import {
  buildPagination,
  buildOrderBy,
  buildWhere,
} from "../shared/query-builder";
import {
  type idInputType,
  type listInputType,
  type updateTradeLicenseCategoryInputType,
} from "../shared/input/trade-license-category";

/**
 * Service for managing Trade License Categories (Tenant Level)
 */
export class TradeLicenseCategoryService {
  constructor(private db: TenantClient) {}

  async list(input: listInputType) {
    try {
      const where = buildWhere(input, ["typeEn", "typeBn"]);
      const orderBy = buildOrderBy(input);
      const pagination = buildPagination(input);

      const [items, total] = await Promise.all([
        this.db.tradeLicenseCategory.findMany({
          where,
          orderBy,
          ...pagination,
        }),
        this.db.tradeLicenseCategory.count({ where }),
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
      return await this.db.tradeLicenseCategory.findUnique({
        where: { id: validatedId },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async create(input: TradeLicenseCategoryFormValues) {
    try {
      const data = tradeLicenseCategoryFormSchema.parse(input);
      return await this.db.tradeLicenseCategory.create({
        data,
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async update(input: updateTradeLicenseCategoryInputType) {
    try {
      const { id, ...data } = input;
      return await this.db.tradeLicenseCategory.update({
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
      return await this.db.tradeLicenseCategory.delete({
        where: { id: validatedId },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }
}

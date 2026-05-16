import { type TenantClient } from "@workspace/db";
import { handlePrismaError } from "../middleware/error-handler";
import {
  fiscalYearFormSchema,
  uuidSchema,
  type FiscalYearFormValues,
} from "@workspace/schema";
import {
  buildPagination,
  buildOrderBy,
  buildWhere,
} from "../shared/query-builder";
import {
  type idInputType,
  type listInputType,
  type updateFiscalYearInputType,
} from "../shared/input/fiscal-year";

/**
 * Service for managing Fiscal Years (Tenant Level)
 */
export class FiscalYearService {
  constructor(private db: TenantClient) {}

  async list(input: listInputType) {
    try {
      const where = buildWhere(input, ["name", "nameBn"]);
      const orderBy = buildOrderBy(input);
      const pagination = buildPagination(input);

      const [items, total] = await Promise.all([
        this.db.fiscalYear.findMany({
          where,
          orderBy,
          ...pagination,
        }),
        this.db.fiscalYear.count({ where }),
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
      return await this.db.fiscalYear.findUnique({
        where: { id: validatedId },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async create(input: FiscalYearFormValues) {
    try {
      const data = fiscalYearFormSchema.parse(input);

      // If this is set as current, unset any other current fiscal year
      if (data.isCurrent) {
        await this.db.fiscalYear.updateMany({
          where: { isCurrent: true },
          data: { isCurrent: false },
        });
      }

      return await this.db.fiscalYear.create({
        data,
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async update(input: updateFiscalYearInputType) {
    try {
      const { id, ...data } = input;

      // If updating to current, unset others
      if (data.isCurrent) {
        await this.db.fiscalYear.updateMany({
          where: { isCurrent: true, id: { not: id } },
          data: { isCurrent: false },
        });
      }

      return await this.db.fiscalYear.update({
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
      return await this.db.fiscalYear.delete({ where: { id: validatedId } });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async toggleActive(input: string) {
    try {
      const validatedId = uuidSchema.parse(input);
      const year = await this.db.fiscalYear.findUnique({
        where: { id: validatedId },
      });

      if (!year) throw new Error("Fiscal year not found");

      return await this.db.fiscalYear.update({
        where: { id: validatedId },
        data: { isActive: !year.isActive },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async setCurrent(id: string) {
    try {
      const validatedId = uuidSchema.parse(id);

      // Unset current for all
      await this.db.fiscalYear.updateMany({
        where: { isCurrent: true },
        data: { isCurrent: false },
      });

      // Set current for target
      return await this.db.fiscalYear.update({
        where: { id: validatedId },
        data: { isCurrent: true },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getCurrent() {
    try {
      return await this.db.fiscalYear.findFirst({
        where: { isCurrent: true, isActive: true },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async forSelection() {
    try {
      return await this.db.fiscalYear.findMany({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          nameBn: true,
          isCurrent: true,
        },
        orderBy: {
          startDate: "desc",
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async getStats() {
    try {
      const [total, active, inactive] = await Promise.all([
        this.db.fiscalYear.count(),
        this.db.fiscalYear.count({ where: { isActive: true } }),
        this.db.fiscalYear.count({ where: { isActive: false } }),
      ]);

      return { total, active, inactive };
    } catch (error) {
      handlePrismaError(error);
    }
  }
}


import { type TenantClient } from "@workspace/db";
import { enToBnNumber } from "@workspace/utils";

export class TradeLicenseService {
  constructor(private prisma: TenantClient) { }

  async list(filters: {
    page?: number;
    limit?: number;
    search?: string | null;
    fiscalYearId?: string | null;
    paymentStatus?: string | null;
    isExpired?: boolean | null;
    sortBy?: string | null;
    sortOrder?: "asc" | "desc" | null;
  }) {
    const {
      page = 1,
      limit = 10,
      search,
      fiscalYearId,
      paymentStatus,
      isExpired,
      sortBy = "createdAt",
      sortOrder = "desc"
    } = filters;

    const skip = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where.OR = [
        { licenseNo: { contains: search, mode: "insensitive" } },
        { trackingNo: { contains: search, mode: "insensitive" } },
        {
          application: {
            OR: [
              { orgNameBn: { contains: search, mode: "insensitive" } },
              { fullNameBn: { contains: search, mode: "insensitive" } },
            ]
          }
        }
      ];
    }

    if (fiscalYearId) where.fiscalYearId = fiscalYearId;
    if (paymentStatus) where.paymentStatus = paymentStatus;
    
    if (isExpired) {
      where.expiryDate = {
        lt: new Date()
      };
    }

    const finalSortBy = sortBy || "createdAt";
    const finalSortOrder = sortOrder || "desc";

    const [items, total] = await Promise.all([
      this.prisma.tradeLicense.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [finalSortBy]: finalSortOrder },
        include: {
          application: {
            include: {
              tradeLicenseCategory: true
            }
          },
          fiscalYear: true,
        }
      }),
      this.prisma.tradeLicense.count({ where }),
    ]);

    return {
      success: true,
      data: items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id: string) {
    const license = await this.prisma.tradeLicense.findUnique({
      where: { id },
      include: {
        application: {
          include: {
            tradeLicenseCategory: true
          }
        },
        fiscalYear: true,
      },
    });

    if (!license) {
      throw new Error("লাইসেন্সটি পাওয়া যায়নি");
    }

    return {
      success: true,
      data: license,
    };
  }

  async getStats() {
    const [total, paid, unpaid, totalAmount] = await Promise.all([
      this.prisma.tradeLicense.count(),
      this.prisma.tradeLicense.count({ where: { paymentStatus: "PAID" } }),
      this.prisma.tradeLicense.count({ where: { paymentStatus: "UNPAID" } }),
      this.prisma.tradeLicense.aggregate({
        _sum: { totalAmount: true },
        where: { paymentStatus: "PAID" }
      }),
    ]);

    return {
      success: true,
      data: {
        total,
        paid,
        unpaid,
        totalRevenue: totalAmount._sum.totalAmount || 0,
      },
    };
  }
}

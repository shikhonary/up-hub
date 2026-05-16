import { TenantClient } from "@workspace/db";
import {
  TradeLicenseApplicationFormValues,
  tradeLicenseApplicationSchema,
  GenerateTradeLicenseValues,
  generateTradeLicenseSchema
} from "@workspace/schema";
import { enToBnNumber } from "@workspace/utils";

export class TradeLicenseApplicationService {
  constructor(private readonly prisma: TenantClient) { }

  async create(data: TradeLicenseApplicationFormValues) {
    const validatedData = tradeLicenseApplicationSchema.parse(data);

    // Generate numeric tracking ID: YYMMDDHHMMSS + 2 random digits
    const now = new Date();
    const yy = now.getFullYear().toString().slice(-2);
    const mm = (now.getMonth() + 1).toString().padStart(2, '0');
    const dd = now.getDate().toString().padStart(2, '0');
    const hh = now.getHours().toString().padStart(2, '0');
    const min = now.getMinutes().toString().padStart(2, '0');
    const ss = now.getSeconds().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 90 + 10);
    const trackingId = `${yy}${mm}${dd}${hh}${min}${ss}${random}`;

    const application = await this.prisma.tradeLicenseApplication.create({
      data: {
        ...validatedData,
        trackingId,
      },
    });

    return {
      success: true,
      message: "ট্রেড লাইসেন্স আবেদন সফলভাবে তৈরি করা হয়েছে",
      data: application,
    };
  }

  async update(id: string, data: Partial<TradeLicenseApplicationFormValues>) {
    const validatedData = tradeLicenseApplicationSchema.partial().parse(data);

    const application = await this.prisma.tradeLicenseApplication.update({
      where: { id },
      data: validatedData,
    });

    return {
      success: true,
      message: "ট্রেড লাইসেন্স আবেদন সফলভাবে আপডেট করা হয়েছে",
      data: application,
    };
  }

  async getById(id: string) {
    const application = await this.prisma.tradeLicenseApplication.findUnique({
      where: { id },
      include: {
        tradeLicenseCategory: true,
        fiscalYear: true,
        tradeLicense: true,
      },
    });

    if (!application) {
      throw new Error("আবেদনটি পাওয়া যায়নি");
    }

    return {
      success: true,
      data: application,
    };
  }

  async delete(id: string) {
    await this.prisma.tradeLicenseApplication.delete({
      where: { id },
    });

    return {
      success: true,
      message: "আবেদনটি সফলভাবে মুছে ফেলা হয়েছে",
    };
  }

  async list(filters: {
    page?: number;
    limit?: number;
    search?: string | null;
    wardNo?: number | null;
    categoryId?: string | null;
    fiscalYearId?: string | null;
    status?: string | null;
    sortBy?: string | null;
    sortOrder?: "asc" | "desc" | null;
  }) {
    const {
      page = 1,
      limit = 10,
      search,
      wardNo,
      categoryId,
      fiscalYearId,
      status,
      sortBy = "createdAt",
      sortOrder = "desc"
    } = filters;

    const skip = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where.OR = [
        { orgNameBn: { contains: search, mode: "insensitive" } },
        { orgNameEn: { contains: search, mode: "insensitive" } },
        { trackingId: { contains: search, mode: "insensitive" } },
        { fullNameBn: { contains: search, mode: "insensitive" } },
        { mobileBn: { contains: search, mode: "insensitive" } },
      ];
    }

    if (wardNo) where.businessWardNo = wardNo;
    if (categoryId) where.tradeLicenseCategoryId = categoryId;
    if (fiscalYearId) where.fiscalYearId = fiscalYearId;
    if (status) where.status = status;

    const finalSortBy = sortBy || "createdAt";
    const finalSortOrder = sortOrder || "desc";

    const [items, total] = await Promise.all([
      this.prisma.tradeLicenseApplication.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [finalSortBy]: finalSortOrder },
        include: {
          tradeLicenseCategory: true,
          fiscalYear: true,
          tradeLicense: true,
        }
      }),
      this.prisma.tradeLicenseApplication.count({ where }),
    ]);

    return {
      success: true,
      data: {
        items,
        total,
        page,
        limit,
      },
    };
  }

  async getStats() {
    const [total, pending, approved, rejected] = await Promise.all([
      this.prisma.tradeLicenseApplication.count(),
      this.prisma.tradeLicenseApplication.count({ where: { status: "PENDING" } }),
      this.prisma.tradeLicenseApplication.count({ where: { status: "APPROVED" } }),
      this.prisma.tradeLicenseApplication.count({ where: { status: "REJECTED" } }),
    ]);

    return {
      success: true,
      data: {
        total,
        pending,
        approved,
        rejected,
      },
    };
  }

  async updateStatus(id: string, status: string) {
    const application = await this.prisma.tradeLicenseApplication.update({
      where: { id },
      data: { status },
    });

    return {
      success: true,
      message: `আবেদনটি সফলভাবে ${status === "APPROVED" ? "অনুমোদন" : status === "REJECTED" ? "বাতিল" : "আপডেট"} করা হয়েছে`,
      data: application,
    };
  }

  async generateLicense(data: GenerateTradeLicenseValues) {
    const validatedData = generateTradeLicenseSchema.parse(data);

    const application = await this.prisma.tradeLicenseApplication.findUnique({
      where: { id: validatedData.applicationId },
      include: { fiscalYear: true }
    });

    if (!application) {
      throw new Error("আবেদনটি পাওয়া যায়নি");
    }

    // Generate a license number (tracking no + some random)
    const licenseNo = `${enToBnNumber(new Date().getFullYear())}-${Math.floor(100000 + Math.random() * 900000)}`;

    const result = await this.prisma.$transaction(async (tx) => {
      const license = await tx.tradeLicense.create({
        data: {
          applicationId: validatedData.applicationId,
          fiscalYearId: application.fiscalYearId,
          trackingNo: application.trackingId || validatedData.applicationId.slice(0, 10).toUpperCase(),
          licenseNo,
          licenseFee: validatedData.licenseFee,
          arrears: validatedData.arrears,
          arrearsFiscalYear: validatedData.arrearsFiscalYear,
          discount: validatedData.discount,
          vatAmount: validatedData.vatAmount,
          signboardTax: validatedData.signboardTax,
          professionalTax: validatedData.professionalTax,
          subCharge: validatedData.subCharge,
          totalAmount: validatedData.totalAmount,
          paymentStatus: validatedData.paymentStatus,
          paymentType: validatedData.paymentType,
          paymentDate: validatedData.paymentDate,
          expiryDate: application.fiscalYear.endDate,
        }
      });

      await tx.tradeLicenseApplication.update({
        where: { id: validatedData.applicationId },
        data: { status: "APPROVED" }
      });

      return license;
    });

    return {
      success: true,
      message: "ট্রেড লাইসেন্স সফলভাবে জেনারেট করা হয়েছে",
      data: result,
    };
  }

  async collectPayment(data: { licenseId: string; paymentType: string; paymentDate: Date }) {
    const license = await this.prisma.tradeLicense.update({
      where: { id: data.licenseId },
      data: {
        paymentStatus: "PAID",
        paymentType: data.paymentType,
        paymentDate: data.paymentDate,
      },
    });

    return {
      success: true,
      message: "পেমেন্ট সফলভাবে সংগ্রহ করা হয়েছে",
      data: license,
    };
  }
}

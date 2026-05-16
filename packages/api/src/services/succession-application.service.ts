import { TenantClient } from "@workspace/db";
import {
  SuccessionApplicationFormValues,
  successionApplicationSchema,
} from "@workspace/schema";

export class SuccessionApplicationService {
  constructor(private readonly prisma: TenantClient) { }

  async create(data: SuccessionApplicationFormValues) {
    const validatedData = successionApplicationSchema.parse(data);
    const { heirs, ...applicationData } = validatedData;

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

    const application = await this.prisma.successionApplication.create({
      data: {
        ...applicationData,
        trackingId,
        heirs: {
          create: heirs || [],
        },
      },
      include: {
        heirs: true,
      },
    });

    return {
      success: true,
      message: "উত্তরাধিকার সনদ আবেদন সফলভাবে তৈরি করা হয়েছে",
      data: application,
    };
  }

  async update(id: string, data: Partial<SuccessionApplicationFormValues>) {
    const validatedData = successionApplicationSchema.partial().parse(data);
    const { heirs, ...applicationData } = validatedData;

    const application = await this.prisma.successionApplication.update({
      where: { id },
      data: {
        ...applicationData,
        ...(heirs && {
          heirs: {
            deleteMany: {},
            create: heirs,
          },
        }),
      },
      include: {
        heirs: true,
      },
    });

    return {
      success: true,
      message: "উত্তরাধিকার সনদ আবেদন সফলভাবে আপডেট করা হয়েছে",
      data: application,
    };
  }

  async getById(id: string) {
    const application = await this.prisma.successionApplication.findUnique({
      where: { id },
      include: {
        heirs: true,
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
    await this.prisma.successionApplication.delete({
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
    status?: string | null;
    sortBy?: string | null;
    sortOrder?: "asc" | "desc" | null;
  }) {
    const {
      page = 1,
      limit = 10,
      search,
      wardNo,
      status,
      sortBy = "createdAt",
      sortOrder = "desc"
    } = filters;

    const skip = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where.OR = [
        { nameBn: { contains: search, mode: "insensitive" } },
        { nameEn: { contains: search, mode: "insensitive" } },
        { trackingId: { contains: search, mode: "insensitive" } },
        { nidNo: { contains: search, mode: "insensitive" } },
        { mobile: { contains: search, mode: "insensitive" } },
        { applicantNameBn: { contains: search, mode: "insensitive" } },
      ];
    }

    if (wardNo) where.presentWardNo = wardNo;
    if (status) where.status = status;

    const finalSortBy = sortBy || "createdAt";
    const finalSortOrder = sortOrder || "desc";

    const [items, total] = await Promise.all([
      this.prisma.successionApplication.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [finalSortBy]: finalSortOrder },
        include: {
          heirs: true,
        }
      }),
      this.prisma.successionApplication.count({ where }),
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
      this.prisma.successionApplication.count(),
      this.prisma.successionApplication.count({ where: { status: "PENDING" } }),
      this.prisma.successionApplication.count({ where: { status: "APPROVED" } }),
      this.prisma.successionApplication.count({ where: { status: "REJECTED" } }),
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
    const application = await this.prisma.successionApplication.update({
      where: { id },
      data: { status },
    });

    return {
      success: true,
      message: `আবেদনটি সফলভাবে ${status === "APPROVED" ? "অনুমোদন" : status === "REJECTED" ? "বাতিল" : "আপডেট"} করা হয়েছে`,
      data: application,
    };
  }
}

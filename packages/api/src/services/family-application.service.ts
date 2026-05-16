import { TenantClient } from "@workspace/db";
import { FamilyApplicationValues, familyApplicationSchema } from "@workspace/schema";
import { FAMILY_APPLICATION_STATUS } from "@workspace/utils";

export class FamilyApplicationService {
  constructor(private readonly prisma: TenantClient) {}

  async create(data: FamilyApplicationValues) {
    const validatedData = familyApplicationSchema.parse(data);

    const application = await this.prisma.familyApplication.create({
      data: {
        applicantName: validatedData.applicantName,
        citizenId: validatedData.citizenId,
        status: validatedData.status,
        members: {
          create: validatedData.members.map((member) => ({
            nameBengali: member.nameBengali,
            nameEnglish: member.nameEnglish,
            relationBengali: member.relationBengali,
            relationEnglish: member.relationEnglish,
            dateOrAge: member.dateOrAge,
            identityNumber: member.identityNumber,
            maritalStatus: member.maritalStatus,
            vitalStatus: member.vitalStatus,
            citizenId: member.citizenId,
          })),
        },
      },
      include: {
        members: true,
      },
    });

    return {
      success: true,
      message: "Family application created successfully",
      data: application,
    };
  }

  async update(id: string, data: Partial<FamilyApplicationValues>) {
    const validatedData = familyApplicationSchema.partial().parse(data);

    // If members are provided, we might need to handle updates/deletes/creates
    // For simplicity, let's assume we update the main fields first.
    // Real-world might need a more complex member sync logic.
    
    const { members, ...mainData } = validatedData;

    const application = await this.prisma.familyApplication.update({
      where: { id },
      data: {
        ...mainData,
        // Members update logic would go here if needed
      },
      include: {
        members: true,
      },
    });

    return {
      success: true,
      message: "Family application updated successfully",
      data: application,
    };
  }

  async getById(id: string) {
    const application = await this.prisma.familyApplication.findUnique({
      where: { id },
      include: {
        members: true,
        citizen: true,
      },
    });

    if (!application) {
      throw new Error("Family application not found");
    }

    return {
      success: true,
      data: application,
    };
  }

  async delete(id: string) {
    await this.prisma.familyApplication.delete({
      where: { id },
    });

    return {
      success: true,
      message: "Family application deleted successfully",
    };
  }

  async list(filters: {
    page?: number;
    limit?: number;
    search?: string | null;
    status?: string | null;
    citizenId?: string | null;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      citizenId,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { applicantName: { contains: search, mode: "insensitive" } },
        {
          members: {
            some: {
              nameBengali: { contains: search, mode: "insensitive" },
            },
          },
        },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (citizenId) {
      where.citizenId = citizenId;
    }

    const [items, total] = await Promise.all([
      this.prisma.familyApplication.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          _count: {
            select: { members: true },
          },
        },
      }),
      this.prisma.familyApplication.count({ where }),
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

  async approve(id: string) {
    const application = await this.prisma.familyApplication.update({
      where: { id },
      data: { status: FAMILY_APPLICATION_STATUS.APPROVED },
    });

    return {
      success: true,
      message: "Family application approved successfully",
      data: application,
    };
  }

  async reject(id: string) {
    const application = await this.prisma.familyApplication.update({
      where: { id },
      data: { status: FAMILY_APPLICATION_STATUS.REJECTED },
    });

    return {
      success: true,
      message: "Family application rejected successfully",
      data: application,
    };
  }

  async getStats() {
    const [total, pending, approved, rejected] = await Promise.all([
      this.prisma.familyApplication.count(),
      this.prisma.familyApplication.count({
        where: { status: FAMILY_APPLICATION_STATUS.PENDING },
      }),
      this.prisma.familyApplication.count({
        where: { status: FAMILY_APPLICATION_STATUS.APPROVED },
      }),
      this.prisma.familyApplication.count({
        where: { status: FAMILY_APPLICATION_STATUS.REJECTED },
      }),
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
}

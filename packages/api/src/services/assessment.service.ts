import { TenantClient } from "@workspace/db";
import { AssessmentApplicationFormValues, assessmentApplicationSchema } from "@workspace/schema";

export class AssessmentService {
  constructor(private readonly prisma: TenantClient) {}

  async create(data: AssessmentApplicationFormValues) {
    const validatedData = assessmentApplicationSchema.parse(data);

    // Auto-link citizen if NID matches and citizenId not provided
    if (!validatedData.citizenId && validatedData.nid) {
      const citizen = await this.prisma.citizen.findUnique({
        where: { nid: validatedData.nid },
        select: { id: true },
      });
      if (citizen) {
        validatedData.citizenId = citizen.id;
      }
    }

    const assessment = await this.prisma.assessmentApplication.create({
      data: validatedData,
    });

    return {
      success: true,
      message: "এসেসমেন্ট সফলভাবে তৈরি করা হয়েছে",
      data: assessment,
    };
  }

  async update(id: string, data: Partial<AssessmentApplicationFormValues>) {
    const validatedData = assessmentApplicationSchema.partial().parse(data);

    // Auto-link citizen if NID matches and citizenId not provided during update
    if (!validatedData.citizenId && validatedData.nid) {
      const citizen = await this.prisma.citizen.findUnique({
        where: { nid: validatedData.nid },
        select: { id: true },
      });
      if (citizen) {
        validatedData.citizenId = citizen.id;
      }
    }

    const assessment = await this.prisma.assessmentApplication.update({
      where: { id },
      data: validatedData,
    });

    return {
      success: true,
      message: "এসেসমেন্ট সফলভাবে আপডেট করা হয়েছে",
      data: assessment,
    };
  }

  async getById(id: string) {
    const assessment = await this.prisma.assessmentApplication.findUnique({
      where: { id },
      include: {
        citizen: true,
      },
    });

    if (!assessment) {
      throw new Error("এসেসমেন্ট পাওয়া যায়নি");
    }

    return {
      success: true,
      data: assessment,
    };
  }

  async delete(id: string) {
    await this.prisma.assessmentApplication.delete({
      where: { id },
    });

    return {
      success: true,
      message: "এসেসমেন্ট সফলভাবে মুছে ফেলা হয়েছে",
    };
  }

  async list(filters: {
    page?: number;
    limit?: number;
    search?: string | null;
    wardNo?: number | null;
    villageBn?: string | null;
    holdingNo?: string | null;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      wardNo, 
      villageBn,
      holdingNo,
      sortBy = "createdAt", 
      sortOrder = "desc" 
    } = filters;
    
    const skip = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where.OR = [
        { fullNameBn: { contains: search, mode: "insensitive" } },
        { nid: { contains: search, mode: "insensitive" } },
        { mobile: { contains: search, mode: "insensitive" } },
        { holdingNo: { contains: search, mode: "insensitive" } },
      ];
    }

    if (wardNo) where.wardNo = wardNo;
    if (villageBn) where.villageBn = villageBn;
    if (holdingNo) {
      where.holdingNo = { contains: holdingNo, mode: "insensitive" };
    }

    const [items, total] = await Promise.all([
      this.prisma.assessmentApplication.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          citizen: {
            select: {
              id: true,
              fullNameBn: true,
              nid: true,
            }
          }
        }
      }),
      this.prisma.assessmentApplication.count({ where }),
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
    const [total, totalTax] = await Promise.all([
      this.prisma.assessmentApplication.count(),
      this.prisma.assessmentApplication.aggregate({
        _sum: {
          totalTax: true,
        },
      }),
    ]);

    const totalTaxAmount = totalTax._sum.totalTax || 0;
    const averageTax = total > 0 ? totalTaxAmount / total : 0;

    return {
      success: true,
      data: {
        totalAssessments: total,
        totalHoldings: total, // For now, 1 assessment = 1 holding record
        totalTaxAmount,
        averageTax,
      },
    };
  }

  async bulkGenerateTax(assessmentIds: string[], fiscalYearId: string) {
    const assessments = await this.prisma.assessmentApplication.findMany({
      where: { id: { in: assessmentIds } },
    });

    // Bulk fetch citizens for all assessments with NID to auto-link if possible
    const nids = assessments.map((a) => a.nid).filter(Boolean) as string[];
    const citizens = await this.prisma.citizen.findMany({
      where: { nid: { in: nids } },
      select: { id: true, nid: true },
    });
    const nidToCitizenId = Object.fromEntries(citizens.map((c) => [c.nid, c.id]));

    const results = await Promise.all(
      assessments.map(async (assessment) => {
        const citizenId =
          assessment.citizenId || (assessment.nid ? nidToCitizenId[assessment.nid] : null);

        return this.prisma.holdingTax.upsert({
          where: {
            assessmentId_fiscalYearId: {
              assessmentId: assessment.id,
              fiscalYearId,
            },
          },
          update: {
            totalAmount: assessment.totalTax,
            dueAmount: assessment.totalTax,
            citizenId: citizenId || undefined,
          },
          create: {
            assessmentId: assessment.id,
            fiscalYearId,
            totalAmount: assessment.totalTax,
            dueAmount: assessment.totalTax,
            status: "UNPAID",
            citizenId: citizenId || undefined,
          },
        });
      })
    );

    return {
      success: true,
      message: `${results.length}টি ট্যাক্স রেকর্ড সফলভাবে জেনারেট করা হয়েছে`,
      data: results,
    };
  }

}

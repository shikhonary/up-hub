import { TenantClient } from "@workspace/db";
import { listHoldingTaxInput, collectHoldingTaxInput, updateHoldingTaxInput } from "../shared/input/holding-tax";

export class HoldingTaxService {
  constructor(private readonly prisma: TenantClient) {}

  async list(filters: any) {
    const {
      page = 1,
      limit = 10,
      search,
      assessmentId,
      citizenId,
      fiscalYearId,
      status,
      wardNo,
      villageBn,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = filters;

    const skip = (page - 1) * limit;
    const where: any = {};

    if (assessmentId) where.assessmentId = assessmentId;
    if (citizenId) where.citizenId = citizenId;
    if (fiscalYearId) where.fiscalYearId = fiscalYearId;
    if (status) where.status = status;

    if (search || wardNo || villageBn) {
      where.assessment = {};
      if (search) {
        where.assessment.OR = [
          { fullNameBn: { contains: search, mode: "insensitive" } },
          { nid: { contains: search, mode: "insensitive" } },
          { holdingNo: { contains: search, mode: "insensitive" } },
        ];
      }
      if (wardNo) where.assessment.wardNo = wardNo;
      if (villageBn) where.assessment.villageBn = villageBn;
    }

    const [items, total] = await Promise.all([
      this.prisma.holdingTax.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          assessment: true,
          citizen: true,
          fiscalYear: true,
        },
      }),
      this.prisma.holdingTax.count({ where }),
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

  async getById(id: string) {
    const tax = await this.prisma.holdingTax.findUnique({
      where: { id },
      include: {
        assessment: true,
        citizen: true,
        fiscalYear: true,
      },
    });

    if (!tax) {
      throw new Error("ট্যাক্স রেকর্ড পাওয়া যায়নি");
    }

    return {
      success: true,
      data: tax,
    };
  }

  async collectTax(id: string, data: { paidAmount: number; collectedById: string; collectedByName: string }) {
    const tax = await this.prisma.holdingTax.findUnique({
      where: { id },
    });

    if (!tax) {
      throw new Error("ট্যাক্স রেকর্ড পাওয়া যায়নি");
    }

    const newPaidAmount = tax.paidAmount + data.paidAmount;
    const newDueAmount = Math.max(0, tax.totalAmount - newPaidAmount);
    const status = newDueAmount === 0 ? "PAID" : "PARTIAL";

    const updatedTax = await this.prisma.holdingTax.update({
      where: { id },
      data: {
        paidAmount: newPaidAmount,
        dueAmount: newDueAmount,
        status,
        collectedById: data.collectedById,
        collectedByName: data.collectedByName,
        paidAt: new Date(),
      },
    });

    return {
      success: true,
      message: "ট্যাক্স সফলভাবে সংগ্রহ করা হয়েছে",
      data: updatedTax,
    };
  }

  async getStats() {
    const [stats, statusGroups] = await Promise.all([
      this.prisma.holdingTax.aggregate({
        _sum: {
          totalAmount: true,
          paidAmount: true,
          dueAmount: true,
        },
        _count: {
          id: true,
        },
      }),
      this.prisma.holdingTax.groupBy({
        by: ["status"],
        _count: {
          id: true,
        },
      }),
    ]);

    return {
      success: true,
      data: {
        totalRecords: stats._count.id,
        totalAmount: stats._sum.totalAmount || 0,
        paidAmount: stats._sum.paidAmount || 0,
        dueAmount: stats._sum.dueAmount || 0,
        statusBreakdown: statusGroups.map((g) => ({
          status: g.status,
          count: g._count.id,
        })),
      },
    };
  }

  async getAnalytics(filters: { fiscalYearId?: string | null; wardNo?: number | null; villageBn?: string | null }) {
    const { fiscalYearId, wardNo, villageBn } = filters;
    const where: any = {};

    if (fiscalYearId) where.fiscalYearId = fiscalYearId;
    if (wardNo || villageBn) {
      where.assessment = {};
      if (wardNo) where.assessment.wardNo = wardNo;
      if (villageBn) where.assessment.villageBn = villageBn;
    }

    const [overview, statusStats, fiscalYearTrend, wardWiseData] = await Promise.all([
      // Overall Overview
      this.prisma.holdingTax.aggregate({
        where,
        _sum: { totalAmount: true, paidAmount: true, dueAmount: true },
        _count: { id: true },
      }),
      // Status Distribution
      this.prisma.holdingTax.groupBy({
        where,
        by: ["status"],
        _count: { id: true },
        _sum: { paidAmount: true },
      }),
      // Fiscal Year Trend (for the last 5 years or based on filter)
      this.prisma.holdingTax.groupBy({
        where: wardNo || villageBn ? where : {}, // If filtered by ward, show trend for that ward
        by: ["fiscalYearId"],
        _sum: { paidAmount: true, totalAmount: true },
        _count: { id: true },
      }),
      // Ward-wise Distribution (using findMany since groupBy relation is limited)
      this.prisma.holdingTax.findMany({
        where,
        select: {
          paidAmount: true,
          totalAmount: true,
          dueAmount: true,
          assessment: { select: { wardNo: true } },
        },
      }),
    ]);

    // Process Ward-wise data
    const wardMap: Record<number, { total: number; paid: number; due: number; count: number }> = {};
    wardWiseData.forEach((item) => {
      const ward = item.assessment?.wardNo ?? 0;
      if (!wardMap[ward]) wardMap[ward] = { total: 0, paid: 0, due: 0, count: 0 };
      wardMap[ward].total += item.totalAmount;
      wardMap[ward].paid += item.paidAmount;
      wardMap[ward].due += item.dueAmount;
      wardMap[ward].count += 1;
    });

    // Fetch fiscal year names for trend
    const fiscalYears = await this.prisma.fiscalYear.findMany({
      where: { id: { in: fiscalYearTrend.map((t) => t.fiscalYearId) } },
      select: { id: true, nameBn: true },
    });

    const trendData = fiscalYearTrend.map((t) => ({
      fiscalYearId: t.fiscalYearId,
      fiscalYearName: fiscalYears.find((fy) => fy.id === t.fiscalYearId)?.nameBn ?? "Unknown",
      paidAmount: t._sum.paidAmount ?? 0,
      totalAmount: t._sum.totalAmount ?? 0,
      count: t._count.id,
    }));

    return {
      success: true,
      data: {
        overview: {
          totalAmount: overview._sum.totalAmount ?? 0,
          paidAmount: overview._sum.paidAmount ?? 0,
          dueAmount: overview._sum.dueAmount ?? 0,
          totalHoldings: overview._count.id,
        },
        statusDistribution: statusStats.map((s) => ({
          status: s.status,
          count: s._count.id,
          paid: s._sum.paidAmount ?? 0,
        })),
        fiscalYearTrend: trendData.sort((a, b) => a.fiscalYearName.localeCompare(b.fiscalYearName)),
        wardWiseData: Object.entries(wardMap)
          .map(([ward, stats]) => ({
            ward: Number(ward),
            ...stats,
          }))
          .sort((a, b) => a.ward - b.ward),
      },
    };
  }

  async getReportData(filters: any) {
    const { fiscalYearId, wardNo, villageBn, status } = filters;
    const where: any = {};

    if (fiscalYearId) where.fiscalYearId = fiscalYearId;
    if (status) where.status = status;
    
    where.assessment = {};
    if (wardNo) where.assessment.wardNo = wardNo;
    if (villageBn) where.assessment.villageBn = villageBn;

    const data = await this.prisma.holdingTax.findMany({
      where,
      include: {
        assessment: true,
        fiscalYear: true,
      },
      orderBy: [
        { assessment: { wardNo: "asc" } },
        { assessment: { villageBn: "asc" } },
        { assessment: { holdingNo: "asc" } },
      ],
    });

    // Grouping for the report
    const groupedByWard: any = {};
    data.forEach((item) => {
      const ward = item.assessment?.wardNo ?? 0;
      if (!groupedByWard[ward]) groupedByWard[ward] = { ward, items: [], totalAmount: 0, paidAmount: 0, dueAmount: 0 };
      groupedByWard[ward].items.push(item);
      groupedByWard[ward].totalAmount += item.totalAmount;
      groupedByWard[ward].paidAmount += item.paidAmount;
      groupedByWard[ward].dueAmount += item.dueAmount;
    });

    return {
      success: true,
      data: {
        allRecords: data,
        byWard: Object.values(groupedByWard),
        summary: {
            totalAmount: data.reduce((acc, curr) => acc + curr.totalAmount, 0),
            paidAmount: data.reduce((acc, curr) => acc + curr.paidAmount, 0),
            dueAmount: data.reduce((acc, curr) => acc + curr.dueAmount, 0),
            totalRecords: data.length,
        }
      },
    };
  }
}

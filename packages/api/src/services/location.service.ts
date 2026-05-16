import { type PrismaClient } from "@workspace/db";

export class LocationService {
  constructor(private db: PrismaClient) {}

  async getDivisions() {
    return this.db.division.findMany({
      orderBy: { name: "asc" },
    });
  }

  async getDistricts(divisionId?: string | null) {
    if (!divisionId) return [];
    return this.db.district.findMany({
      where: { divisionId },
      orderBy: { name: "asc" },
    });
  }

  async getUpazilas(districtId?: string | null) {
    if (!districtId) return [];
    return this.db.upazila.findMany({
      where: { districtId },
      orderBy: { name: "asc" },
    });
  }

  async getUnions(upazilaId?: string | null) {
    if (!upazilaId) return [];
    return this.db.union.findMany({
      where: { upazilaId },
      orderBy: { name: "asc" },
    });
  }

  async getPostOffices(upazilaId?: string | null) {
    if (!upazilaId) return [];
    return this.db.postOffice.findMany({
      where: { upazilaId },
      orderBy: { name: "asc" },
    });
  }
}

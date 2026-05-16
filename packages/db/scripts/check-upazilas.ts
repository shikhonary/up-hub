import { prisma } from "../src/client";

async function check() {
  const upazilas = await prisma.upazila.findMany({
    where: {
      OR: [
        { nameBn: { contains: "a" } },
        { nameBn: { contains: "e" } },
        { nameBn: { contains: "i" } },
        { nameBn: { contains: "o" } },
        { nameBn: { contains: "u" } },
      ]
    }
  });
  console.log(`Found ${upazilas.length} upazilas with English characters in nameBn`);
  console.log(JSON.stringify(upazilas.map(u => ({ id: u.id, name: u.name, nameBn: u.nameBn })), null, 2));
}

check().catch(console.error).finally(() => prisma.$disconnect());

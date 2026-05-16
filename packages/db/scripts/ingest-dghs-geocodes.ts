import { prisma } from "../src/client";
import { readFileSync } from "fs";
import { resolve } from "path";

async function ingestDghsGeoCodes() {
  console.log("Starting DGHS GeoCode Ingestion...");

  const geoCodePath = resolve(process.cwd(), "../../scratch/bd-geocodes.json");
  const geoCodeData = JSON.parse(readFileSync(geoCodePath, "utf8"));

  // The codes are in the "concept" array (though the narrative also has them)
  // Let's check if "concept" exists, otherwise we'll have to parse the narrative div (ugh)
  // Wait, I saw "concept" in my mind but didn't verify in the JSON. Let's verify.
  
  const concepts = geoCodeData.concept || [];
  if (concepts.length === 0) {
    console.error("No concepts found in the JSON file. It might be a different structure.");
    // Let's try to find them in the narrative if needed, but usually FHIR CodeSystems have 'concept'
    return;
  }

  console.log(`Found ${concepts.length} concepts.`);

  // Mapping strategies:
  // 2 digits: Division
  // 4 digits: District
  // 8 digits: Upazila
  // 10 digits: Paurasava / Union groups

  const divisions = concepts.filter((c: any) => c.code.length === 2);
  const districts = concepts.filter((c: any) => c.code.length === 4);
  const upazilas = concepts.filter((c: any) => c.code.length === 8);
  const others = concepts.filter((c: any) => c.code.length === 10);

  console.log(`Divisions: ${divisions.length}, Districts: ${districts.length}, Upazilas: ${upazilas.length}, Others: ${others.length}`);

  // 1. Update Divisions
  for (const div of divisions) {
    const name = div.display.trim();
    const existing = await prisma.division.findFirst({
      where: {
        OR: [
          { name: { equals: name, mode: 'insensitive' } },
          { nameBn: { equals: name, mode: 'insensitive' } }
        ]
      }
    });

    if (existing) {
      await prisma.division.update({
        where: { id: existing.id },
        data: { geoCode: div.code }
      });
      console.log(`Updated Division: ${name} -> ${div.code}`);
    } else {
      console.warn(`Division not found in DB: ${name}`);
    }
  }

  // 2. Update Districts
  const districtAliases: Record<string, string[]> = {
    "Maulvibazar": ["Moulvibazar"],
    "Chapainawabganj": ["Chapai Nawabganj"],
    "Jhalokathi": ["Jhalokati"],
    "Bandarban": ["Bandarban Sadar"]
  };

  for (const dist of districts) {
    const name = dist.display.trim();
    const aliases = districtAliases[name] || [];
    
    const existing = await prisma.district.findFirst({
      where: {
        OR: [
          { name: { equals: name, mode: 'insensitive' } },
          { nameBn: { equals: name, mode: 'insensitive' } },
          ...aliases.map(a => ({ name: { equals: a, mode: 'insensitive' } as any }))
        ]
      }
    });

    if (existing) {
      await prisma.district.update({
        where: { id: existing.id },
        data: { geoCode: dist.code }
      });
      console.log(`Updated District: ${name} -> ${dist.code}`);
    } else {
      console.warn(`District not found in DB: ${name}`);
    }
  }

  // 3. Update Upazilas
  const upazilaAliases: Record<string, string[]> = {
    "Ishwarganj": ["Isshwargonj"],
    "Sharsha": ["Sarsa"],
    "Madhukhali": ["Madukhali"],
    "Assasuni": ["Ashashuni"],
    "Dharampasha": ["Dharmapasha"],
    "Kachua": ["Kachua UPO"],
    "Ramgarh": ["Ramghar Head Office"],
    "Kishoreganj": ["Kishoriganj"]
  };

  for (const up of upazilas) {
    const name = up.display.trim();
    const aliases = upazilaAliases[name] || [];
    
    // 1. Direct or Alias Match
    let existing = await prisma.upazila.findFirst({
      where: {
        OR: [
          { name: { equals: name, mode: 'insensitive' } },
          { nameBn: { equals: name, mode: 'insensitive' } },
          ...aliases.map(a => ({ name: { equals: a, mode: 'insensitive' } as any }))
        ]
      }
    });

    // 2. Fuzzy Match (Sadar / Containment)
    if (!existing) {
      if (name.toLowerCase().includes("sadar")) {
        const baseName = name.replace(/sadar/i, "").trim();
        existing = await prisma.upazila.findFirst({
          where: {
            OR: [
              { name: { contains: baseName, mode: 'insensitive' } },
              { nameBn: { contains: baseName, mode: 'insensitive' } }
            ]
          }
        });
      }
    }

    // 3. Normalized Match (Remove non-alpha characters)
    if (!existing) {
      const normalizedName = name.toLowerCase().replace(/[^a-z]/g, "");
      // This is expensive to do on all records, so we only do it if others fail
      const allUpazilas = await prisma.upazila.findMany({ where: { geoCode: null } });
      const found = allUpazilas.find(u => 
        u.name.toLowerCase().replace(/[^a-z]/g, "") === normalizedName ||
        u.name.toLowerCase().replace(/[^a-z]/g, "").includes(normalizedName) ||
        normalizedName.includes(u.name.toLowerCase().replace(/[^a-z]/g, ""))
      );
      if (found) existing = found as any;
    }

    if (existing) {
      await prisma.upazila.update({
        where: { id: existing.id },
        data: { geoCode: up.code }
      });
      console.log(`Updated Upazila: ${name} -> ${up.code}`);
    } else {
      console.warn(`Upazila not found in DB: ${name}`);
    }
  }

  // 4. Update Unions / Paurasavas (Others)
  for (const other of others) {
    const name = other.display.trim();
    if (name.toLowerCase().includes("paurasava") || name.toLowerCase().includes("paurashava") || name.toLowerCase().includes("paurashaba")) {
      const baseName = name.replace(/paurasava|paurashava|paurashaba/gi, "").trim();
      const existing = await prisma.union.findFirst({
        where: {
          OR: [
            { name: { contains: baseName, mode: 'insensitive' } },
            { nameBn: { contains: baseName, mode: 'insensitive' } }
          ]
        }
      });
      if (existing) {
        await prisma.union.update({
          where: { id: existing.id },
          data: { geoCode: other.code }
        });
        console.log(`Updated Paurasava (Union): ${name} -> ${other.code}`);
      }
    }
  }

  console.log("Ingestion completed!");
}

ingestDghsGeoCodes()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

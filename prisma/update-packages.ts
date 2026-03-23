import { PrismaClient } from "../src/generated/prisma";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const url = process.env.TURSO_DATABASE_URL || "file:./prisma/dev.db";
const authToken = process.env.TURSO_AUTH_TOKEN;
const adapter = new PrismaLibSql({ url, authToken });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Find durations with 300 minutes for maderoterapija and rucna-anticelulit-masaza
  const services = await prisma.service.findMany({
    where: { slug: { in: ["maderoterapija", "rucna-anticelulit-masaza"] } },
    include: { durations: true },
  });

  for (const service of services) {
    console.log(`\n${service.name}:`);
    for (const dur of service.durations) {
      console.log(`  ${dur.minutes} min, ${dur.price} RSD, packageCount: ${dur.packageCount}`);
      if (dur.minutes === 300) {
        await prisma.serviceDuration.update({
          where: { id: dur.id },
          data: { minutes: 30, packageCount: 10 },
        });
        console.log(`  -> Updated to 10 x 30 min`);
      }
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

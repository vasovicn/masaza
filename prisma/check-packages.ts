import { PrismaClient } from "../src/generated/prisma";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({ url: "file:./prisma/dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  const s = await prisma.service.findFirst({
    where: { slug: "maderoterapija" },
    include: { durations: true },
  });
  console.log(JSON.stringify(s?.durations, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());

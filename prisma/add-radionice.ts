import { PrismaClient } from "../src/generated/prisma";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const url = process.env.TURSO_DATABASE_URL || "file:./prisma/dev.db";
const authToken = process.env.TURSO_AUTH_TOKEN;
const adapter = new PrismaLibSql({ url, authToken });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Create the category
  const radionice = await prisma.serviceCategory.create({
    data: {
      name: "Radionice",
      sequence: 4,
    },
  });

  // Create the service with bookableOnline: false and no durations
  await prisma.service.create({
    data: {
      name: "Radionice telesne svesnosti \"Susreti kod Olje\"",
      slug: "radionice-telesne-svesnosti-susreti-kod-olje",
      description:
        "Radionice telesne svesnosti za dublje povezivanje sa sopstvenim telom kroz grupni rad i vežbe svesnog pokreta.",
      categoryId: radionice.id,
      image:
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
      bookableOnline: false,
      sequence: 1,
    },
  });

  console.log("Added: Radionice telesne svesnosti");
  console.log("Done!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

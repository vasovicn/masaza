import { PrismaClient } from "../src/generated/prisma";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const url = process.env.TURSO_DATABASE_URL || "file:./prisma/dev.db";
const authToken = process.env.TURSO_AUTH_TOKEN;
const adapter = new PrismaLibSql({ url, authToken });
const prisma = new PrismaClient({ adapter });

// Slugs from the user's price list (seed-services.ts)
const validSlugs = [
  "terapijska-masaza",
  "mfr-tretman",
  "masaza-cupping",
  "relax-celog-tela",
  "antistres-masaza",
  "masaza-trudnica",
  "refleksologija-stopala",
  "maderoterapija",
  "rucna-anticelulit-masaza",
  "limfna-drenaza",
  "mezoterapija-tela",
];

// Appropriate Unsplash images for each service
const imageMap: Record<string, string> = {
  "terapijska-masaza":
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",
  "mfr-tretman":
    "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800&q=80",
  "masaza-cupping":
    "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&q=80",
  "relax-celog-tela":
    "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800&q=80",
  "antistres-masaza":
    "https://images.unsplash.com/photo-1591343395082-e120087004b4?w=800&q=80",
  "masaza-trudnica":
    "https://images.unsplash.com/photo-1519824145371-296894a0daa9?w=800&q=80",
  "refleksologija-stopala":
    "https://images.unsplash.com/photo-1516401266446-6571d40cc7e0?w=800&q=80",
  "maderoterapija":
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80",
  "rucna-anticelulit-masaza":
    "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
  "limfna-drenaza":
    "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&q=80",
  "mezoterapija-tela":
    "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80",
};

async function main() {
  // 1. Find and delete services NOT on the price list
  const allServices = await prisma.service.findMany();
  const toDelete = allServices.filter((s) => !validSlugs.includes(s.slug));

  for (const service of toDelete) {
    // Delete related bookings first
    await prisma.booking.deleteMany({ where: { serviceId: service.id } });
    // Delete durations
    await prisma.serviceDuration.deleteMany({
      where: { serviceId: service.id },
    });
    // Delete service
    await prisma.service.delete({ where: { id: service.id } });
    console.log(`Deleted: ${service.name}`);
  }

  // 2. Delete empty categories (categories with no remaining services)
  const categories = await prisma.serviceCategory.findMany({
    include: { services: true },
  });
  for (const cat of categories) {
    if (cat.services.length === 0) {
      await prisma.serviceCategory.delete({ where: { id: cat.id } });
      console.log(`Deleted empty category: ${cat.name}`);
    }
  }

  // 3. Add images to the valid services
  for (const [slug, imageUrl] of Object.entries(imageMap)) {
    const result = await prisma.service.updateMany({
      where: { slug },
      data: { image: imageUrl },
    });
    if (result.count > 0) {
      console.log(`Added image for: ${slug}`);
    }
  }

  console.log("\nCleanup and image update completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
import { PrismaClient } from "../src/generated/prisma";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const url = process.env.TURSO_DATABASE_URL || "file:./prisma/dev.db";
const authToken = process.env.TURSO_AUTH_TOKEN;
const adapter = new PrismaLibSql({ url, authToken });
const prisma = new PrismaClient({ adapter });

async function main() {
  // 1. Fix missing image for refleksologija stopala
  await prisma.service.updateMany({
    where: { slug: "refleksologija-stopala" },
    data: {
      image:
        "https://images.unsplash.com/photo-1519824145371-296894a0daa9?w=800&q=80",
    },
  });
  console.log("Fixed image for: Refleksologija stopala");

  // 2. Create Kozmetički tretmani category
  const kozmeticki = await prisma.serviceCategory.create({
    data: {
      name: "Kozmetički tretmani",
      sequence: 3,
    },
  });

  // --- KOZMETIČKI TRETMANI ---

  await prisma.service.create({
    data: {
      name: "Lifting masaža lica",
      slug: "lifting-masaza-lica",
      description:
        "Lifting masaža lica koja podiže i zateže kožu, smanjuje bore i poboljšava tonus lica.",
      categoryId: kozmeticki.id,
      image:
        "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80",
      sequence: 1,
      durations: {
        create: [{ minutes: 30, price: 3000 }],
      },
    },
  });

  await prisma.service.create({
    data: {
      name: "Limfna drenaža lica",
      slug: "limfna-drenaza-lica",
      description:
        "Limfna drenaža lica za smanjenje otoka, detoksikaciju i osvežavanje tena.",
      categoryId: kozmeticki.id,
      image:
        "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&q=80",
      sequence: 2,
      durations: {
        create: [{ minutes: 30, price: 3000 }],
      },
    },
  });

  await prisma.service.create({
    data: {
      name: "Brzi tretman lica",
      slug: "brzi-tretman-lica",
      description:
        "Brzi tretman lica koji uključuje piling, masažu i masku za osvežen i negovan izgled.",
      categoryId: kozmeticki.id,
      image:
        "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&q=80",
      sequence: 3,
      durations: {
        create: [{ minutes: 30, price: 3000 }],
      },
    },
  });

  await prisma.service.create({
    data: {
      name: "Klasičan higijenski tretman",
      slug: "klasican-higijenski-tretman",
      description:
        "Kompletan higijenski tretman lica: čišćenje, piling, masaža, komedoekspresija, serum/maska i krema.",
      categoryId: kozmeticki.id,
      image:
        "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80",
      sequence: 4,
      durations: {
        create: [{ minutes: 70, price: 4000 }],
      },
    },
  });

  await prisma.service.create({
    data: {
      name: "Mezoporacija",
      slug: "mezoporacija",
      description:
        "Mezoporacija za duboku hidrataciju i revitalizaciju kože lica, vrata i dekoltea.",
      categoryId: kozmeticki.id,
      image:
        "https://images.unsplash.com/photo-1612908689889-67223c62f40c?w=800&q=80",
      sequence: 5,
      durations: {
        create: [
          { minutes: 30, price: 4500 }, // Lice
          { minutes: 40, price: 6000 }, // Vrat & dekolte
        ],
      },
    },
  });

  await prisma.service.create({
    data: {
      name: "Dermapen",
      slug: "dermapen",
      description:
        "Dermapen tretman mikroiglicama za stimulaciju kolagena, smanjenje bora i poboljšanje teksture kože.",
      categoryId: kozmeticki.id,
      image:
        "https://images.unsplash.com/photo-1598524374912-6b0b0bdd29b5?w=800&q=80",
      sequence: 6,
      durations: {
        create: [
          { minutes: 45, price: 6000 }, // Lice
          { minutes: 60, price: 9000 }, // Vrat & dekolte
        ],
      },
    },
  });

  console.log("Added all Kozmetički tretmani!");
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
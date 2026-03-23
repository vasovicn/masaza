import { PrismaClient } from "../src/generated/prisma";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const url = process.env.TURSO_DATABASE_URL || "file:./prisma/dev.db";
const authToken = process.env.TURSO_AUTH_TOKEN;
const adapter = new PrismaLibSql({ url, authToken });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Create categories
  const terapijska = await prisma.serviceCategory.create({
    data: {
      name: "Terapijska masaža",
      sequence: 1,
    },
  });

  const anticelulit = await prisma.serviceCategory.create({
    data: {
      name: "Anticelulit program",
      sequence: 2,
    },
  });

  const kozmeticki = await prisma.serviceCategory.create({
    data: {
      name: "Kozmetički tretmani",
      sequence: 3,
    },
  });

  // --- TERAPIJSKA MASAŽA ---

  await prisma.service.create({
    data: {
      name: "Terapijska masaža",
      slug: "terapijska-masaza",
      description: "Terapijska masaža za otklanjanje bolova i napetosti u mišićima.",
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",
      categoryId: terapijska.id,
      sequence: 1,
      durations: {
        create: [
          { minutes: 30, price: 3000 },
          { minutes: 45, price: 4000 },
          { minutes: 60, price: 5000 },
        ],
      },
    },
  });

  await prisma.service.create({
    data: {
      name: "MFR tretman (leđa, vrat i ruke)",
      slug: "mfr-tretman",
      description: "Myofascial Release tretman za leđa, vrat i ruke.",
      image: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800&q=80",
      categoryId: terapijska.id,
      sequence: 2,
      durations: {
        create: [{ minutes: 60, price: 5000 }],
      },
    },
  });

  await prisma.service.create({
    data: {
      name: "Masaža + Cupping",
      slug: "masaza-cupping",
      description: "Kombinacija klasične masaže i cupping terapije.",
      image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&q=80",
      categoryId: terapijska.id,
      sequence: 3,
      durations: {
        create: [{ minutes: 30, price: 3500 }],
      },
    },
  });

  await prisma.service.create({
    data: {
      name: "Relax celog tela",
      slug: "relax-celog-tela",
      description: "Opuštajuća masaža celog tela za potpunu relaksaciju.",
      image: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800&q=80",
      categoryId: terapijska.id,
      sequence: 4,
      durations: {
        create: [{ minutes: 90, price: 8000 }],
      },
    },
  });

  await prisma.service.create({
    data: {
      name: "Antistres masaža",
      slug: "antistres-masaza",
      description: "Masaža za smanjenje stresa i opuštanje tela i uma.",
      image: "https://images.unsplash.com/photo-1591343395082-e120087004b4?w=800&q=80",
      categoryId: terapijska.id,
      sequence: 5,
      durations: {
        create: [{ minutes: 60, price: 4000 }],
      },
    },
  });

  await prisma.service.create({
    data: {
      name: "Masaža trudnica",
      slug: "masaza-trudnica",
      description: "Prilagođena masaža za trudnice za olakšanje tegoba u trudnoći.",
      image: "https://images.unsplash.com/photo-1519824145371-296894a0daa9?w=800&q=80",
      categoryId: terapijska.id,
      sequence: 6,
      durations: {
        create: [{ minutes: 40, price: 4000 }],
      },
    },
  });

  await prisma.service.create({
    data: {
      name: "Refleksologija stopala",
      slug: "refleksologija-stopala",
      description: "Refleksološka masaža stopala za poboljšanje opšteg zdravlja.",
      image: "https://images.unsplash.com/photo-1519824145371-296894a0daa9?w=800&q=80",
      categoryId: terapijska.id,
      sequence: 7,
      durations: {
        create: [{ minutes: 40, price: 4000 }],
      },
    },
  });

  // --- ANTICELULIT PROGRAM ---

  await prisma.service.create({
    data: {
      name: "Maderoterapija",
      slug: "maderoterapija",
      description: "Anticelulit tretman drvenim instrumentima za smanjenje celulita.",
      image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80",
      categoryId: anticelulit.id,
      sequence: 1,
      durations: {
        create: [
          { minutes: 30, price: 3200 },
          { minutes: 300, price: 30000 }, // 10 x 30 min paket
        ],
      },
    },
  });

  await prisma.service.create({
    data: {
      name: "Ručna anticelulit masaža",
      slug: "rucna-anticelulit-masaza",
      description: "Ručna masaža za redukciju celulita i poboljšanje cirkulacije.",
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
      categoryId: anticelulit.id,
      sequence: 2,
      durations: {
        create: [
          { minutes: 30, price: 3500 },
          { minutes: 300, price: 32000 }, // 10 x 30 min paket
        ],
      },
    },
  });

  await prisma.service.create({
    data: {
      name: "Limfna drenaža",
      slug: "limfna-drenaza",
      description: "Limfna drenaža za detoksikaciju i smanjenje otoka.",
      image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&q=80",
      categoryId: anticelulit.id,
      sequence: 3,
      durations: {
        create: [
          { minutes: 40, price: 4000 },
          { minutes: 60, price: 5000 },
        ],
      },
    },
  });

  // Mezoterapija tela - each area as separate duration option
  await prisma.service.create({
    data: {
      name: "Mezoterapija tela",
      slug: "mezoterapija-tela",
      description: "Mezoterapija za tretman različitih zona tela.",
      image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80",
      categoryId: anticelulit.id,
      sequence: 4,
      durations: {
        create: [
          { minutes: 60, price: 12000 }, // Noge & gluteus
          { minutes: 30, price: 6000 },  // Ruke / Stomak & struk
        ],
      },
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

  // --- RADIONICE ---

  const radionice = await prisma.serviceCategory.create({
    data: {
      name: "Radionice",
      sequence: 4,
    },
  });

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

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

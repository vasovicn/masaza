import { PrismaClient } from "../generated/prisma";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";
import path from "path";

const dbPath = path.resolve(process.cwd(), "prisma", "dev.db");
const dbUrl = `file:${dbPath}`;

const adapter = new PrismaLibSql({ url: dbUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");
  console.log("DB URL:", dbUrl);

  // Clean up
  await prisma.booking.deleteMany();
  await prisma.serviceDuration.deleteMany();
  await prisma.service.deleteMany();
  await prisma.serviceCategory.deleteMany();
  await prisma.staffUser.deleteMany();
  await prisma.clientUser.deleteMany();
  await prisma.galleryImage.deleteMany();

  // Admin staff
  const adminPassword = await bcrypt.hash("admin123", 12);
  await prisma.staffUser.create({
    data: {
      email: "olivera73@gmail.com",
      password: adminPassword,
      firstName: "Admin",
      lastName: "Somatic",
      role: "admin",
      active: true,
      sequence: 0,
    },
  });

  // Masseurs
  const maserPassword = await bcrypt.hash("maser123", 12);

  const ana = await prisma.staffUser.create({
    data: {
      email: "ana@somaticbalans.rs",
      password: maserPassword,
      firstName: "Ana",
      lastName: "Jovanovic",
      role: "maser",
      phone: "+381 60 111 2222",
      bio: "Ana je sertifikovani maser sa vise od 5 godina iskustva u relaksacionim i terapeutskim masazama. Specijalizovana je za sportsku masazu i rad sa hronicnim bolovima.",
      active: true,
      sequence: 1,
    },
  });

  const marko = await prisma.staffUser.create({
    data: {
      email: "marko@somaticbalans.rs",
      password: maserPassword,
      firstName: "Marko",
      lastName: "Petrovic",
      role: "maser",
      phone: "+381 60 333 4444",
      bio: "Marko je diplomirao fizioterapiju i ima 7 godina iskustva u radu sa sportistima i osobama sa povredama. Specijalista za duboku tkivnu masazu i limfnu drazu.",
      active: true,
      sequence: 2,
    },
  });

  // Categories
  const relaksacionaKat = await prisma.serviceCategory.create({
    data: {
      name: "Relaksacione masaze",
      description: "Opustajuce masaze koje smanjuju stres i napetost misica",
      sequence: 1,
      active: true,
    },
  });

  const terapeutskakKat = await prisma.serviceCategory.create({
    data: {
      name: "Terapeutske masaze",
      description: "Ciljane terapeutske tehnike za tretman specificnih tegoba",
      sequence: 2,
      active: true,
    },
  });

  // Services
  await prisma.service.create({
    data: {
      name: "Klasicna relaksaciona masaza",
      slug: "klasicna-relaksaciona-masaza",
      description:
        "Klasicna svedska masaza kombinuje nozne i srednje jake poteze koji opustaju misice, poboljsavaju cirkulaciju i smanjuju stres. Idealna za prvu masazu ili svakodnevno opustanje.",
      categoryId: relaksacionaKat.id,
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",
      active: true,
      sequence: 1,
      durations: {
        create: [
          { minutes: 30, price: 2500 },
          { minutes: 60, price: 4500 },
          { minutes: 90, price: 6500 },
        ],
      },
    },
  });

  await prisma.service.create({
    data: {
      name: "Aromaterapijska masaza",
      slug: "aromaterapijska-masaza",
      description:
        "Kombinacija masaze sa etericknim uljima koja deluju na telo i um. Koristimo premium etericna ulja lavande, eukaliptusa i bergamota koji pojacavaju efekat opustanja i podsticu regeneraciju.",
      categoryId: relaksacionaKat.id,
      image: "https://images.unsplash.com/photo-1591343395082-e120087004b4?w=800&q=80",
      active: true,
      sequence: 2,
      durations: {
        create: [
          { minutes: 60, price: 5500 },
          { minutes: 90, price: 7500 },
        ],
      },
    },
  });

  await prisma.service.create({
    data: {
      name: "Hot stone masaza",
      slug: "hot-stone-masaza",
      description:
        "Terapija toplim kamenim oblucima koji se postavljaju na kljucne tacke tela. Toplota prodire duboko u misice, opusta napete i bolne partije i poboljsava protok energije kroz telo.",
      categoryId: relaksacionaKat.id,
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80",
      active: true,
      sequence: 3,
      durations: {
        create: [
          { minutes: 60, price: 6000 },
          { minutes: 90, price: 8500 },
        ],
      },
    },
  });

  await prisma.service.create({
    data: {
      name: "Duboka tkivna masaza",
      slug: "duboka-tkivna-masaza",
      description:
        "Intenzivna masaza usmerena na dublje slojeve misicnog tkiva. Korisna za hronicne bolove, napetost misica i ogranicenu pokretljivost. Posebno preporucena za sportiste i fizicki aktivne osobe.",
      categoryId: terapeutskakKat.id,
      image: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800&q=80",
      active: true,
      sequence: 1,
      durations: {
        create: [
          { minutes: 45, price: 4000 },
          { minutes: 60, price: 5500 },
          { minutes: 90, price: 7800 },
        ],
      },
    },
  });

  await prisma.service.create({
    data: {
      name: "Sportska masaza",
      slug: "sportska-masaza",
      description:
        "Specijalizovana masaza za sportiste i fizicki aktivne osobe. Kombinuje tehnike istezanja, kompresije i trljanja za brzi oporavak od treninga, prevenciju povreda i poboljsanje performansi.",
      categoryId: terapeutskakKat.id,
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
      active: true,
      sequence: 2,
      durations: {
        create: [
          { minutes: 45, price: 4500 },
          { minutes: 60, price: 6000 },
        ],
      },
    },
  });

  await prisma.service.create({
    data: {
      name: "Limfna draza",
      slug: "limfna-draza",
      description:
        "Nozna manuelna limfna draza stimulise limfni sistem, pomaze u eliminaciji toksina i visaka tecnosti iz tela. Idealna za osobe sa otokom, celuliton ili oslabljenim imunim sistemom.",
      categoryId: terapeutskakKat.id,
      image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&q=80",
      active: true,
      sequence: 3,
      durations: {
        create: [
          { minutes: 60, price: 5000 },
          { minutes: 90, price: 7000 },
        ],
      },
    },
  });

  // Gallery images
  const galleryImages = [
    { url: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80", alt: "Relaksaciona masaza" },
    { url: "https://images.unsplash.com/photo-1591343395082-e120087004b4?w=800&q=80", alt: "Aromaterapija" },
    { url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80", alt: "Hot stone terapija" },
    { url: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800&q=80", alt: "Terapeutska masaza" },
    { url: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80", alt: "Sportska masaza" },
    { url: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&q=80", alt: "Limfna draza" },
    { url: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800&q=80", alt: "Enterijer salona" },
    { url: "https://images.unsplash.com/photo-1567602805638-1b069bcecd7e?w=800&q=80", alt: "Opremljeni kabinet" },
  ];

  for (let i = 0; i < galleryImages.length; i++) {
    await prisma.galleryImage.create({
      data: { ...galleryImages[i], sequence: i + 1 },
    });
  }

  console.log("\nDatabase seeded successfully!");
  console.log("Admin login: admin@admin.rs / admin123");
  console.log("Maser Ana: ana@somaticbalans.rs / maser123");
  console.log("Maser Marko: marko@somaticbalans.rs / maser123");
  console.log("\nStaff IDs:");
  console.log("Ana Jovanovic:", ana.id);
  console.log("Marko Petrovic:", marko.id);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

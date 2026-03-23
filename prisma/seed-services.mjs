import { createClient } from "@libsql/client";
import { randomBytes } from "crypto";

const client = createClient({ url: "file:./prisma/dev.db" });

function cuid() {
  return "c" + randomBytes(12).toString("hex");
}

const now = new Date().toISOString();

// Create categories
const cat1Id = cuid();
const cat2Id = cuid();

await client.execute({
  sql: `INSERT INTO ServiceCategory (id, name, description, sequence, active, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)`,
  args: [cat1Id, "Terapijska masaža", null, 1, 1, now, now],
});

await client.execute({
  sql: `INSERT INTO ServiceCategory (id, name, description, sequence, active, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)`,
  args: [cat2Id, "Anticelulit program", null, 2, 1, now, now],
});

const services = [
  // Terapijska masaža
  {
    name: "Terapijska masaža",
    slug: "terapijska-masaza",
    description: "Terapijska masaža za otklanjanje bolova i napetosti u mišićima.",
    categoryId: cat1Id,
    sequence: 1,
    durations: [
      { minutes: 30, price: 3000 },
      { minutes: 45, price: 4000 },
      { minutes: 60, price: 5000 },
    ],
  },
  {
    name: "MFR tretman (leđa, vrat & ruke)",
    slug: "mfr-tretman",
    description: "Myofascial Release tretman za leđa, vrat i ruke.",
    categoryId: cat1Id,
    sequence: 2,
    durations: [{ minutes: 60, price: 5000 }],
  },
  {
    name: "Masaža + Cupping",
    slug: "masaza-cupping",
    description: "Kombinacija klasične masaže i cupping terapije.",
    categoryId: cat1Id,
    sequence: 3,
    durations: [{ minutes: 30, price: 3500 }],
  },
  {
    name: "Relax celog tela",
    slug: "relax-celog-tela",
    description: "Opuštajuća masaža celog tela za potpunu relaksaciju.",
    categoryId: cat1Id,
    sequence: 4,
    durations: [{ minutes: 90, price: 8000 }],
  },
  {
    name: "Antistres masaža",
    slug: "antistres-masaza",
    description: "Masaža za smanjenje stresa i opuštanje tela i uma.",
    categoryId: cat1Id,
    sequence: 5,
    durations: [{ minutes: 60, price: 4000 }],
  },
  {
    name: "Masaža trudnica",
    slug: "masaza-trudnica",
    description: "Prilagođena masaža za trudnice za olakšanje tegoba u trudnoći.",
    categoryId: cat1Id,
    sequence: 6,
    durations: [{ minutes: 40, price: 4000 }],
  },
  {
    name: "Refleksologija stopala",
    slug: "refleksologija-stopala",
    description: "Refleksološka masaža stopala za poboljšanje opšteg zdravlja.",
    categoryId: cat1Id,
    sequence: 7,
    durations: [{ minutes: 40, price: 4000 }],
  },
  // Anticelulit program
  {
    name: "Maderoterapija",
    slug: "maderoterapija",
    description: "Anticelulit tretman drvenim instrumentima za smanjenje celulita.",
    categoryId: cat2Id,
    sequence: 1,
    durations: [
      { minutes: 30, price: 3200 },
      { minutes: 300, price: 30000 },
    ],
  },
  {
    name: "Ručna anticelulit masaža",
    slug: "rucna-anticelulit-masaza",
    description: "Ručna masaža za redukciju celulita i poboljšanje cirkulacije.",
    categoryId: cat2Id,
    sequence: 2,
    durations: [
      { minutes: 30, price: 3500 },
      { minutes: 300, price: 32000 },
    ],
  },
  {
    name: "Limfna drenaža",
    slug: "limfna-drenaza",
    description: "Limfna drenaža za detoksikaciju i smanjenje otoka.",
    categoryId: cat2Id,
    sequence: 3,
    durations: [
      { minutes: 40, price: 4000 },
      { minutes: 60, price: 5000 },
    ],
  },
  {
    name: "Mezoterapija tela",
    slug: "mezoterapija-tela",
    description: "Mezoterapija za tretman različitih zona tela.",
    categoryId: cat2Id,
    sequence: 4,
    durations: [
      { minutes: 60, price: 12000 },
      { minutes: 30, price: 6000 },
    ],
  },
];

for (const svc of services) {
  const svcId = cuid();
  await client.execute({
    sql: `INSERT INTO Service (id, name, slug, description, image, categoryId, active, popular, sequence, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [svcId, svc.name, svc.slug, svc.description, null, svc.categoryId, 1, 0, svc.sequence, now, now],
  });

  for (const dur of svc.durations) {
    const durId = cuid();
    await client.execute({
      sql: `INSERT INTO ServiceDuration (id, serviceId, minutes, price, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)`,
      args: [durId, svcId, dur.minutes, dur.price, now, now],
    });
  }

  console.log(`Created: ${svc.name}`);
}

console.log("\nSeed completed successfully!");

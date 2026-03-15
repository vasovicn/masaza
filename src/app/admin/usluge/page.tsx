import UslugeClient from "./UslugeClient";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Usluge - Admin",
};

export default async function AdminUslugePage() {
  const [services, categories] = await Promise.all([
    prisma.service.findMany({
      include: {
        category: true,
        durations: { orderBy: { minutes: "asc" } },
      },
      orderBy: [{ category: { sequence: "asc" } }, { sequence: "asc" }],
    }),
    prisma.serviceCategory.findMany({ orderBy: { sequence: "asc" } }),
  ]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
          Usluge
        </h1>
        <p className="text-gray-500 mt-1">Upravljajte ponudom usluga</p>
      </div>
      <UslugeClient initialServices={services} initialCategories={categories} />
    </div>
  );
}

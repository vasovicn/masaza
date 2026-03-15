import KategorijeClient from "./KategorijeClient";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Kategorije - Admin",
};

export default async function AdminKategorijePage() {
  const categories = await prisma.serviceCategory.findMany({
    orderBy: { sequence: "asc" },
    include: {
      _count: { select: { services: true } },
    },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
          Kategorije usluga
        </h1>
        <p className="text-gray-500 mt-1">Organizujte usluge po kategorijama</p>
      </div>
      <KategorijeClient initialCategories={categories} />
    </div>
  );
}

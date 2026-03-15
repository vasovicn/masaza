import GalerijaClient from "./GalerijaClient";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Galerija - Admin",
};

export default async function AdminGalerijaPage() {
  const images = await prisma.galleryImage.findMany({
    orderBy: { sequence: "asc" },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
          Galerija
        </h1>
        <p className="text-gray-500 mt-1">Upravljajte slikama na sajtu</p>
      </div>
      <GalerijaClient initialImages={images} />
    </div>
  );
}

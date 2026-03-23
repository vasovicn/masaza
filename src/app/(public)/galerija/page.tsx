import type { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { SALON_NAME } from "@/lib/constants";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://masazabalans.rs";

export const metadata: Metadata = {
  title: "Galerija",
  description: "Pogledajte fotografije salona za masažu Somatic Balans u Beogradu. Upoznajte naš prostor.",
  alternates: { canonical: `${baseUrl}/galerija` },
  openGraph: {
    title: `Galerija | ${SALON_NAME}`,
    description: "Pogledajte fotografije našeg salona.",
    url: `${baseUrl}/galerija`,
    type: "website",
    siteName: SALON_NAME,
    locale: "sr_RS",
  },
};

async function getImages() {
  try {
    return await prisma.galleryImage.findMany({ orderBy: { sequence: "asc" } });
  } catch {
    return [];
  }
}

export default async function GalerijaPage() {
  const images = await getImages();

  return (
    <div>
      <div
        className="py-16 text-center"
        style={{ background: "linear-gradient(135deg, #f0f9f4 0%, #d9f0e4 60%, #b5e2cc 100%)" }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Galerija
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Dodjite i licno osetite atmosferu Somatic Balans salona.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {images.length > 0 ? (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {images.map((image) => (
              <div key={image.id} className="break-inside-avoid rounded-2xl overflow-hidden group relative">
                <Image
                  src={image.url}
                  alt={image.alt || "Somatic Balans galerija"}
                  width={400}
                  height={300}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {image.alt && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm">{image.alt}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <p>Galerija se ucitava...</p>
          </div>
        )}
      </div>
    </div>
  );
}

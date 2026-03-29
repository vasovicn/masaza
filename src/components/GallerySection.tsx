import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface GalleryImage {
  id: string;
  url: string;
  alt: string | null;
  sequence: number;
}

async function getGalleryImages(): Promise<GalleryImage[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://masazabalans.rs";
    const res = await fetch(`${baseUrl}/api/admin/gallery`, {
      next: { revalidate: 600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.images || []).slice(0, 6);
  } catch {
    return [];
  }
}

export default async function GallerySection() {
  const images = await getGalleryImages();

  if (images.length === 0) return null;

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4" style={{ backgroundColor: "#f0f9f4", color: "#3a8059" }}>
            Naša galerija
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Pogledajte naš salon
          </h2>
          <p className="text-lg text-gray-600">
            Opuštajuća atmosfera i profesionalno opremljeni kabineti čekaju vas.
          </p>
        </div>

        {/* Gallery grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              className={`relative rounded-2xl overflow-hidden group ${
                index === 0 ? "md:col-span-2 md:row-span-2 h-64 md:h-auto" : "h-48"
              }`}
              style={{ minHeight: index === 0 ? "320px" : undefined }}
            >
              <Image
                src={image.url}
                alt={image.alt || "Somatic Balans galerija"}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              {image.alt && (
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-sm font-medium">{image.alt}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Link
            href="/galerija"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full border-2 font-semibold transition-all hover:bg-[#9dceb1] hover:border-[#9dceb1] hover:text-white"
            style={{ borderColor: "#9dceb1", color: "#3a8059" }}
          >
            Pogledaj sve slike
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

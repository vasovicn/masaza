import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Calendar, ArrowRight } from "lucide-react";
import { SALON_NAME, SALON_PHONE } from "@/lib/constants";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://masazabalans.rs";

export const metadata: Metadata = {
  title: "Cenovnik usluga",
  description:
    "Pogledajte cenovnik svih masažnih usluga u salonu Somatic Balans u Beogradu. Relaksacione, terapeutske i specijalizovane masaže.",
  alternates: { canonical: `${baseUrl}/cenovnik` },
  openGraph: {
    title: `Cenovnik usluga | ${SALON_NAME}`,
    description: "Cene svih masažnih usluga na jednom mestu. Bez skrivenih troškova.",
    url: `${baseUrl}/cenovnik`,
    type: "website",
    siteName: SALON_NAME,
    locale: "sr_RS",
  },
};

interface ServiceDuration {
  id: string;
  minutes: number;
  price: number;
  label: string | null;
}

interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  bookableOnline: boolean;
  category: { id: string; name: string };
  durations: ServiceDuration[];
}

export const revalidate = 60;

import { prisma } from "@/lib/prisma";

async function getServices(): Promise<Service[]> {
  try {
    const services = await prisma.service.findMany({
      where: { active: true },
      include: {
        category: true,
        durations: { orderBy: { minutes: "asc" } },
      },
      orderBy: [{ category: { sequence: "asc" } }, { sequence: "asc" }],
    });
    return services as unknown as Service[];
  } catch {
    return [];
  }
}

export default async function CenovnikPage() {
  const services = await getServices();

  const categories = Array.from(
    new Map(services.map((s) => [s.category.id, s.category])).values()
  );

  // minPrice and maxPrice removed because they were unused.

  const priceListJsonLd = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: `Cenovnik - ${SALON_NAME}`,
    description: "Cene svih masažnih usluga",
    provider: {
      "@type": "HealthAndBeautyBusiness",
      name: SALON_NAME,
    },
    itemListElement: services.map((service) => ({
      "@type": "OfferCatalog",
      name: service.name,
      itemListElement: service.durations.map((dur) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.name,
          description: dur.label || `${dur.minutes} minuta`,
        },
        price: dur.price,
        priceCurrency: "RSD",
        availability: "https://schema.org/InStock",
      })),
    })),
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(priceListJsonLd) }}
      />
      {/* Hero */}
      <div
        className="py-16 text-center"
        style={{ background: "linear-gradient(135deg, #f0f9f4 0%, #d9f0e4 60%, #b5e2cc 100%)" }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1
            className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Cenovnik usluga
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Sve cene masažnih usluga na jednom mestu. Bez skrivenih troškova.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {services.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p>Usluge se učitavaju...</p>
          </div>
        )}

        {/* Per-category pricing tables */}
        <div className="space-y-12">
          {categories.map((category) => {
            const categoryServices = services.filter((s) => s.category.id === category.id);
            return (
              <div key={category.id}>
                {/* Category header */}
                <div className="flex items-center gap-3 mb-4">
                  <h2
                    className="text-2xl font-bold text-gray-900"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {category.name}
                  </h2>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Services list */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
                  {categoryServices.map((service) => {
                    return (
                      <div
                        key={service.id}
                        className="p-5 hover:bg-gray-50 transition-colors group"
                      >
                        {/* Top row: name + actions */}
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="min-w-0">
                            <h3
                              className="text-base font-bold text-gray-900 group-hover:text-[#3a8059] transition-colors"
                              style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                              {service.name}
                            </h3>
                            <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mt-0.5">
                              {service.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {service.bookableOnline ? (
                              <Link
                                href={`/zakazivanje?service=${service.id}`}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-white text-sm font-medium transition-all hover:opacity-90 hover:shadow-md whitespace-nowrap"
                                style={{ backgroundColor: "#5a9e78" }}
                              >
                                <Calendar className="w-3.5 h-3.5" />
                                Zakazi
                              </Link>
                            ) : (
                              <a
                                href={`tel:${SALON_PHONE}`}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border border-gray-200 text-gray-500 hover:border-[#9dceb1] hover:text-[#3a8059] whitespace-nowrap transition-colors"
                              >
                                Kontaktirajte nas
                              </a>
                            )}
                            <Link
                              href={`/usluge/${service.slug}`}
                              className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 text-gray-400 hover:border-[#9dceb1] hover:text-[#3a8059] transition-colors shrink-0"
                              title="Više informacija"
                            >
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          </div>
                        </div>

                        {/* Bottom row: duration + price chips */}
                        <div className="flex flex-wrap gap-2 mt-3">
                          {service.durations.map((dur) => (
                            <div
                              key={dur.id}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-100 bg-gray-50"
                            >
                              <Clock className="w-3.5 h-3.5 text-[#9dceb1] shrink-0" />
                              <span className="text-xs text-gray-500">{dur.label || `${dur.minutes} min`}</span>
                              <span className="text-xs font-bold text-gray-900">
                                {dur.price.toLocaleString("sr-RS")}
                                <span className="font-normal text-gray-400 ml-0.5">RSD</span>
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        {services.length > 0 && (
          <div
            className="mt-14 rounded-2xl p-8 text-center"
            style={{ background: "linear-gradient(135deg, #d9f0e4, #9dceb1)" }}
          >
            <h2
              className="text-2xl font-bold text-gray-900 mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Niste sigurni koja usluga je prava za vas?
            </h2>
            <p className="text-gray-700 mb-6 text-sm max-w-md mx-auto">
              Kontaktirajte nas i pomoći ćemo vam da izaberete masažu koja će vam najviše odgovarati.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/zakazivanje"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-gray-900 font-semibold text-sm hover:shadow-md transition-all"
              >
                <Calendar className="w-4 h-4" style={{ color: "#3a8059" }} />
                Zakaži termin
              </Link>
              <a
                href={`tel:${SALON_PHONE}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 border-white text-gray-900 font-semibold text-sm hover:bg-white transition-all"
              >
                Kontaktirajte nas
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

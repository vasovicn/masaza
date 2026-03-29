import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { Clock, ArrowRight, Calendar, Sparkles } from "lucide-react";
import { SALON_NAME } from "@/lib/constants";

export const revalidate = 60;

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://masazabalans.rs";

export const metadata: Metadata = {
  title: "Naše usluge",
  description:
    "Pogledajte sve masažne usluge koje nudimo: relaksacione, terapeutske i specijalizovane masaže u Beogradu.",
  alternates: { canonical: `${baseUrl}/usluge` },
  openGraph: {
    title: `Naše usluge | ${SALON_NAME}`,
    description: "Relaksacione, terapeutske i specijalizovane masaže u Beogradu.",
    url: `${baseUrl}/usluge`,
    type: "website",
    siteName: SALON_NAME,
    locale: "sr_RS",
  },
};

interface ServiceDuration {
  id: string;
  minutes: number;
  price: number;
  packageCount: number;
}

interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  popular: boolean;
  bookableOnline: boolean;
  category: { id: string; name: string };
  durations: ServiceDuration[];
}

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

export default async function UsluiePage() {
  const services = await getServices();

  const categories = Array.from(
    new Map(services.map((s) => [s.category.id, s.category])).values()
  );

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Masažne usluge",
    numberOfItems: services.length,
    itemListElement: services.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${baseUrl}/usluge/${service.slug}`,
      name: service.name,
    })),
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <div
        className="py-16 text-center"
        style={{ background: "linear-gradient(135deg, #f0f9f4 0%, #d9f0e4 60%, #b5e2cc 100%)" }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Naše usluge
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Biramo iz bogatog spektra masažnih tehnika za opuštanje, terapiju i oporavak.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Categories */}
        {categories.map((category) => {
          const categoryServices = services.filter((s) => s.category.id === category.id);
          return (
            <div key={category.id} className="mb-14">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-[#9dceb1]" style={{ fontFamily: "'Playfair Display', serif" }}>
                {category.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryServices.map((service) => {
                  // prices shown per duration row below
                  return (
                    <div
                      key={service.id}
                      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col"
                    >
                      <div className="relative h-48 overflow-hidden" style={{ background: "linear-gradient(135deg, #d9f0e4, #9dceb1)" }}>
                        {service.image ? (
                          <Image src={service.image} alt={service.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-30">💆</div>
                        )}
                        {service.popular && (
                          <div className="absolute top-3 left-3">
                            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: "#4da070" }}>
                              <Sparkles className="w-3 h-3" />
                              Popularno
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                          {service.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed min-h-[3.75rem]">
                          {service.description}
                        </p>

                        {/* Duration options */}
                        {service.durations.length > 0 && (
                          <div className="space-y-1.5 mb-4">
                            {service.durations.map((dur) => (
                              <div key={dur.id} className="flex justify-between items-center text-sm">
                                <span className="flex items-center gap-1.5 text-gray-500">
                                  <Clock className="w-3.5 h-3.5 text-[#9dceb1]" />
                                  {dur.packageCount > 1 ? `${dur.packageCount} x ${dur.minutes} min` : `${dur.minutes} min`}
                                </span>
                                <span className="font-semibold" style={{ color: "#3a8059" }}>
                                  {dur.price.toLocaleString("sr-RS")} RSD
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center gap-2 mt-auto">
                          {service.bookableOnline ? (
                            <Link
                              href={`/zakazivanje?service=${service.id}`}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full text-white text-sm font-medium transition-all hover:opacity-90"
                              style={{ backgroundColor: "#5a9e78" }}
                            >
                              <Calendar className="w-4 h-4" />
                              Zakazi
                            </Link>
                          ) : (
                            <span className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full text-sm font-medium border border-gray-200 text-gray-500">
                              Kontaktirajte nas za info
                            </span>
                          )}
                          <Link
                            href={`/usluge/${service.slug}`}
                            className="flex items-center justify-center gap-1 px-3 py-2 rounded-full border border-gray-200 text-gray-600 hover:border-[#9dceb1] hover:text-[#3a8059] text-sm transition-colors"
                          >
                            Više
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {services.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p>Usluge se učitavaju...</p>
          </div>
        )}
      </div>
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";

import { Clock, ArrowRight, Calendar, Sparkles } from "lucide-react";

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

export default async function ServicesSection() {
  const services = await getServices();
  const displayServices = services.slice(0, 6);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4" style={{ backgroundColor: "#f0f9f4", color: "#3a8059" }}>
            Šta nudimo
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Naše usluge
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Izaberite između različitih vrsta masaža, prilagođenih vašim potrebama za opuštanjem i terapijom.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayServices.map((service) => {
            const hasDurations = service.durations.length > 0;
            const minPrice = hasDurations ? Math.min(...service.durations.map((d) => d.price)) : 0;
            const minDuration = hasDurations ? Math.min(...service.durations.map((d) => d.minutes)) : 0;

            return (
              <div
                key={service.id}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                {/* Image */}
                <div className="relative h-48 bg-gradient-to-br overflow-hidden" style={{ background: "linear-gradient(135deg, #d9f0e4, #9dceb1)" }}>
                  {service.image ? (
                    <Image
                      src={service.image}
                      alt={service.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl opacity-30">💆</span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium text-white" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
                      {service.category.name}
                    </span>
                    {service.popular && (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: "#4da070" }}>
                        <Sparkles className="w-3 h-3" />
                        Popularno
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#3a8059] transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {service.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed min-h-[3.75rem]">
                    {service.description}
                  </p>

                  {/* Meta */}
                  {hasDurations && (
                    <div className="flex items-center gap-3 mb-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" style={{ color: "#9dceb1" }} />
                        od {minDuration} min
                      </span>
                      <span className="text-gray-300">|</span>
                      <span className="font-semibold" style={{ color: "#3a8059" }}>
                        od {minPrice.toLocaleString("sr-RS")} RSD
                      </span>
                    </div>
                  )}

                  {/* Actions */}
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
                        Kontaktirajte nas
                      </span>
                    )}
                    <Link
                      href={`/usluge/${service.slug}`}
                      className="flex items-center justify-center p-2 rounded-full border border-gray-200 hover:border-[#9dceb1] hover:text-[#9dceb1] transition-colors text-gray-500"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        {services.length > 6 && (
          <div className="text-center mt-10">
            <Link
              href="/usluge"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full border-2 font-semibold transition-all hover:bg-[#9dceb1] hover:border-[#9dceb1] hover:text-white"
              style={{ borderColor: "#9dceb1", color: "#3a8059" }}
            >
              Pogledaj sve usluge
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

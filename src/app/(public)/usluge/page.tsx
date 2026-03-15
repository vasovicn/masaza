import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight, Calendar } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Nase usluge - Somatic Balans",
  description:
    "Pogledajte sve masazne usluge koje nudimo: relaksacione, terapeutske i specijalizovane masaze u Beogradu.",
};

interface ServiceDuration {
  id: string;
  minutes: number;
  price: number;
}

interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  category: { id: string; name: string };
  durations: ServiceDuration[];
}

async function getServices(): Promise<Service[]> {
  try {
    return await prisma.service.findMany({
      where: { active: true },
      include: {
        category: true,
        durations: { orderBy: { minutes: "asc" } },
      },
      orderBy: [{ category: { sequence: "asc" } }, { sequence: "asc" }],
    });
  } catch {
    return [];
  }
}

export default async function UsluiePage() {
  const services = await getServices();

  const categories = Array.from(
    new Map(services.map((s) => [s.category.id, s.category])).values()
  );

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4" style={{ backgroundColor: "#f0f9f4", color: "#3a8059" }}>
            Nase usluge
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Masazne usluge
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Biramo iz bogatog spektra masaznih tehnika za opustanje, terapiju i oporavak.
          </p>
        </div>

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
                      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1"
                    >
                      <div className="relative h-48 overflow-hidden" style={{ background: "linear-gradient(135deg, #d9f0e4, #9dceb1)" }}>
                        {service.image ? (
                          <Image src={service.image} alt={service.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-30">💆</div>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                          {service.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                          {service.description}
                        </p>

                        {/* Duration options */}
                        <div className="space-y-1.5 mb-4">
                          {service.durations.map((dur) => (
                            <div key={dur.id} className="flex justify-between items-center text-sm">
                              <span className="flex items-center gap-1.5 text-gray-500">
                                <Clock className="w-3.5 h-3.5 text-[#9dceb1]" />
                                {dur.minutes} min
                              </span>
                              <span className="font-semibold" style={{ color: "#3a8059" }}>
                                {dur.price.toLocaleString("sr-RS")} RSD
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            href={`/zakazivanje?service=${service.id}`}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full text-white text-sm font-medium transition-all hover:opacity-90"
                            style={{ backgroundColor: "#9dceb1" }}
                          >
                            <Calendar className="w-4 h-4" />
                            Zakazi
                          </Link>
                          <Link
                            href={`/usluge/${service.slug}`}
                            className="flex items-center justify-center gap-1 px-3 py-2 rounded-full border border-gray-200 text-gray-600 hover:border-[#9dceb1] hover:text-[#3a8059] text-sm transition-colors"
                          >
                            Vise
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
            <p>Usluge se ucitavaju...</p>
          </div>
        )}
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Calendar, ArrowRight, Tag } from "lucide-react";

export const metadata: Metadata = {
  title: "Cenovnik - Somatic Balans",
  description:
    "Pogledajte cenovnik svih masaznih usluga u salonu Somatic Balans u Beogradu. Relaksacione, terapeutske i specijalizovane masaze.",
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
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/services`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.services || [];
  } catch {
    return [];
  }
}

export default async function CenovnikPage() {
  const services = await getServices();

  const categories = Array.from(
    new Map(services.map((s) => [s.category.id, s.category])).values()
  );

  return (
    <div>
      {/* Hero */}
      <div
        className="py-16 text-center"
        style={{ background: "linear-gradient(135deg, #f0f9f4 0%, #d9f0e4 60%, #b5e2cc 100%)" }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <span
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium mb-5"
            style={{ backgroundColor: "rgba(255,255,255,0.7)", color: "#3a8059" }}
          >
            <Tag className="w-3.5 h-3.5" />
            Cenovnik usluga
          </span>
          <h1
            className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Transparentne cene
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Sve cene masaznih usluga na jednom mestu. Bez skrivenih troskova.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {services.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p>Usluge se ucitavaju...</p>
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
                    const minPrice = Math.min(...service.durations.map((d) => d.price));
                    const maxPrice = Math.max(...service.durations.map((d) => d.price));
                    const priceRange =
                      minPrice === maxPrice
                        ? `${minPrice.toLocaleString("sr-RS")} RSD`
                        : `${minPrice.toLocaleString("sr-RS")} – ${maxPrice.toLocaleString("sr-RS")} RSD`;

                    return (
                      <div
                        key={service.id}
                        className="flex flex-col sm:flex-row sm:items-start gap-4 p-5 hover:bg-gray-50 transition-colors group"
                      >
                        {/* Left: name + description */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3
                              className="text-base font-bold text-gray-900 group-hover:text-[#3a8059] transition-colors"
                              style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                              {service.name}
                            </h3>
                            <span
                              className="hidden sm:inline text-xs font-semibold px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: "#f0f9f4", color: "#3a8059" }}
                            >
                              od {minPrice.toLocaleString("sr-RS")} RSD
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                            {service.description}
                          </p>
                          {/* Mobile price range */}
                          <p className="sm:hidden mt-1 text-sm font-semibold" style={{ color: "#3a8059" }}>
                            {priceRange}
                          </p>
                        </div>

                        {/* Middle: duration + price chips */}
                        <div className="flex flex-wrap gap-2 sm:justify-end sm:min-w-[200px]">
                          {service.durations.map((dur) => (
                            <div
                              key={dur.id}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-100 bg-gray-50 text-sm"
                            >
                              <Clock className="w-3.5 h-3.5 text-[#9dceb1] shrink-0" />
                              <span className="text-gray-600">{dur.minutes} min</span>
                              <span className="font-bold text-gray-900">
                                {dur.price.toLocaleString("sr-RS")}
                                <span className="text-xs font-normal text-gray-400 ml-0.5">RSD</span>
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Right: actions */}
                        <div className="flex items-center gap-2 sm:shrink-0">
                          <Link
                            href={`/zakazivanje?service=${service.id}`}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-white text-sm font-medium transition-all hover:opacity-90 hover:shadow-md"
                            style={{ backgroundColor: "#9dceb1" }}
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            Zakazi
                          </Link>
                          <Link
                            href={`/usluge/${service.slug}`}
                            className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 text-gray-400 hover:border-[#9dceb1] hover:text-[#3a8059] transition-colors"
                            title="Vise informacija"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </Link>
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
              Kontaktirajte nas i pomoci cemo vam da izaberete masazu koja ce vam najvise odgovarati.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/zakazivanje"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-gray-900 font-semibold text-sm hover:shadow-md transition-all"
              >
                <Calendar className="w-4 h-4" style={{ color: "#3a8059" }} />
                Zakazi termin
              </Link>
              <Link
                href="/kontakt"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 border-white text-gray-900 font-semibold text-sm hover:bg-white transition-all"
              >
                Kontaktirajte nas
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

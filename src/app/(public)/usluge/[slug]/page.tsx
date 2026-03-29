import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Clock, Calendar } from "lucide-react";
export const revalidate = 60;

import { prisma } from "@/lib/prisma";
import { SALON_NAME, SALON_PHONE } from "@/lib/constants";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getService(slug: string) {
  try {
    return await prisma.service.findUnique({
      where: { slug, active: true },
      include: {
        category: true,
        durations: { orderBy: { minutes: "asc" } },
      },
    });
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const services = await prisma.service.findMany({
      where: { active: true },
      select: { slug: true },
    });
    return services.map((s) => ({ slug: s.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return { title: "Usluga nije pronađena" };

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://masazabalans.rs";
  const url = `${baseUrl}/usluge/${service.slug}`;

  return {
    title: `${service.name}`,
    description: service.description,
    alternates: { canonical: url },
    openGraph: {
      title: `${service.name} | ${SALON_NAME}`,
      description: service.description,
      url,
      type: "website",
      siteName: SALON_NAME,
      locale: "sr_RS",
      ...(service.image && { images: [{ url: service.image, alt: service.name }] }),
    },
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) notFound();

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://masazabalans.rs";
  const hasDurations = service.durations.length > 0;
  const minPrice = hasDurations ? Math.min(...service.durations.map((d) => d.price)) : 0;

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    provider: {
      "@type": "HealthAndBeautyBusiness",
      name: SALON_NAME,
    },
    areaServed: { "@type": "City", name: "Beograd" },
    ...(service.image && { image: service.image }),
    ...(hasDurations && {
      offers: service.durations.map((dur) => ({
        "@type": "Offer",
        price: dur.price,
        priceCurrency: "RSD",
        description: dur.label || `${dur.minutes} minuta`,
        availability: "https://schema.org/InStock",
      })),
    }),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Početna", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Usluge", item: `${baseUrl}/usluge` },
      { "@type": "ListItem", position: 3, name: service.name, item: `${baseUrl}/usluge/${service.slug}` },
    ],
  };

  return (
    <div className="py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-1.5 text-sm text-gray-500">
            <li><Link href="/" className="hover:text-[#3a8059] transition-colors">Početna</Link></li>
            <li>/</li>
            <li><Link href="/usluge" className="hover:text-[#3a8059] transition-colors">Usluge</Link></li>
            <li>/</li>
            <li className="text-gray-900 font-medium">{service.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Image */}
          <div className="relative h-72 lg:h-auto rounded-3xl overflow-hidden" style={{ background: "linear-gradient(135deg, #d9f0e4, #9dceb1)", minHeight: "300px" }}>
            {service.image ? (
              <Image src={service.image} alt={service.name} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-8xl opacity-30">💆</div>
            )}
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-full text-xs font-medium text-white" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
                {service.category.name}
              </span>
            </div>
          </div>

          {/* Content */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              {service.name}
            </h1>
            <p className="text-gray-600 leading-relaxed mb-8">
              {service.description}
            </p>

            {/* Pricing table */}
            {hasDurations && (
              <div className="bg-gray-50 rounded-2xl p-5 mb-6">
                <h3 className="font-bold text-gray-900 mb-4">Trajanje i cene</h3>
                <div className="space-y-3">
                  {service.durations.map((dur) => (
                    <div
                      key={dur.id}
                      className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#f0f9f4" }}>
                          <Clock className="w-4 h-4" style={{ color: "#4da070" }} />
                        </div>
                        <span className="font-medium text-gray-900">{dur.label || `${dur.minutes} minuta`}</span>
                      </div>
                      <span className="font-bold text-xl" style={{ color: "#3a8059" }}>
                        {dur.price.toLocaleString("sr-RS")} RSD
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            {service.bookableOnline ? (
              <Link
                href={`/zakazivanje?service=${service.id}`}
                className="flex items-center justify-center gap-2 w-full py-4 rounded-full text-white text-base font-semibold shadow-lg hover:shadow-xl hover:opacity-95 transition-all"
                style={{ backgroundColor: "#5a9e78" }}
              >
                <Calendar className="w-5 h-5" />
                Zakaži termin{hasDurations ? ` – od ${minPrice.toLocaleString("sr-RS")} RSD` : ""}
              </Link>
            ) : (
              <a
                href={`tel:${SALON_PHONE}`}
                className="flex items-center justify-center gap-2 w-full py-4 rounded-full text-base font-semibold border-2 border-gray-200 text-gray-500 hover:border-[#9dceb1] hover:text-[#3a8059] transition-colors"
              >
                Kontaktirajte nas za više informacija
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

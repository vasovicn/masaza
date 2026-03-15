import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Clock, Calendar, ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";

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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return { title: "Usluga nije pronadjena" };
  return {
    title: `${service.name} - Somatic Balans`,
    description: service.description,
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) notFound();

  const minPrice = Math.min(...service.durations.map((d) => d.price));

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Link href="/usluge" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#3a8059] mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Nazad na usluge
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Image */}
          <div className="relative h-72 lg:h-auto rounded-3xl overflow-hidden" style={{ background: "linear-gradient(135deg, #d9f0e4, #9dceb1)", minHeight: "300px" }}>
            {service.image ? (
              <Image src={service.image} alt={service.name} fill className="object-cover" />
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
                      <span className="font-medium text-gray-900">{dur.minutes} minuta</span>
                    </div>
                    <span className="font-bold text-xl" style={{ color: "#3a8059" }}>
                      {dur.price.toLocaleString("sr-RS")} RSD
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <Link
              href={`/zakazivanje?service=${service.id}`}
              className="flex items-center justify-center gap-2 w-full py-4 rounded-full text-white text-base font-semibold shadow-lg hover:shadow-xl hover:opacity-95 transition-all"
              style={{ backgroundColor: "#5a9e78" }}
            >
              <Calendar className="w-5 h-5" />
              Zakazi termin – od {minPrice.toLocaleString("sr-RS")} RSD
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

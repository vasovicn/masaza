import type { Metadata } from "next";
import FaqSection, { faqs } from "@/components/FaqSection";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { SALON_NAME } from "@/lib/constants";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://masazabalans.rs";

export const metadata: Metadata = {
  title: "Često postavljana pitanja",
  description: "Pronađite odgovore na najčešća pitanja o masažama, zakazivanju, cenama i uslugama salona Somatic Balans.",
  alternates: { canonical: `${baseUrl}/faq` },
  openGraph: {
    title: `Često postavljana pitanja | ${SALON_NAME}`,
    description: "Odgovori na najčešća pitanja o masažama, zakazivanju i cenama.",
    url: `${baseUrl}/faq`,
    type: "website",
    siteName: SALON_NAME,
    locale: "sr_RS",
  },
};

export default function FaqPage() {
  const allQuestions = faqs.flatMap((group) => group.items);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allQuestions.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div
        className="py-16 text-center"
        style={{ background: "linear-gradient(135deg, #f0f9f4 0%, #d9f0e4 60%, #b5e2cc 100%)" }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Česta pitanja
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Odgovori na sve što vas zanima pre prvog termina.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <FaqSection />

        {/* CTA */}
        <div className="mt-14 text-center bg-gradient-to-br from-[#f0f9f4] to-[#d9f0e4] rounded-2xl p-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Niste pronašli odgovor?
          </h2>
          <p className="text-gray-600 mb-6">
            Kontaktirajte nas ili odmah zakažite termin — rado ćemo odgovoriti na sva vaša pitanja.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/kontakt"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 font-semibold transition-all hover:bg-white text-sm"
              style={{ borderColor: "#9dceb1", color: "#3a8059" }}
            >
              Kontaktirajte nas
            </Link>
            <Link
              href="/zakazivanje"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-white font-semibold transition-all hover:opacity-90 text-sm"
              style={{ backgroundColor: "#5a9e78" }}
            >
              <Calendar className="w-4 h-4" />
              Zakažite termin
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

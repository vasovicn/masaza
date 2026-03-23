import type { Metadata } from "next";
import ContactSection from "@/components/ContactSection";
import { SALON_NAME } from "@/lib/constants";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Kontaktirajte salon Somatic Balans za informacije o uslugama, zakazivanje i sve ostalo. Radimo ponedeljak-subota 8-22h.",
  alternates: { canonical: `${baseUrl}/kontakt` },
  openGraph: {
    title: `Kontakt | ${SALON_NAME}`,
    description: "Kontaktirajte nas za zakazivanje i informacije.",
    url: `${baseUrl}/kontakt`,
    type: "website",
    siteName: SALON_NAME,
    locale: "sr_RS",
  },
};

export default function KontaktPage() {
  return (
    <div>
      <div
        className="py-16 text-center"
        style={{ background: "linear-gradient(135deg, #f0f9f4 0%, #d9f0e4 60%, #b5e2cc 100%)" }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Kontakt
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Tu smo za sva vaša pitanja i nedoumice.
          </p>
        </div>
      </div>
      <ContactSection />
    </div>
  );
}

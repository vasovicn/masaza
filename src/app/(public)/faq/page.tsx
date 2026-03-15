import type { Metadata } from "next";
import FaqSection from "@/components/FaqSection";
import Link from "next/link";
import { Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Često postavljana pitanja - Somatic Balans",
  description: "Pronađite odgovore na najčešća pitanja o masažama, zakazivanju, cenama i uslugama salona Somatic Balans.",
};

export default function FaqPage() {
  return (
    <div className="py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4" style={{ backgroundColor: "#f0f9f4", color: "#3a8059" }}>
            Pitanja i odgovori
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Česta pitanja
          </h1>
          <p className="text-lg text-gray-600">
            Odgovori na sve što vas zanima pre prvog termina.
          </p>
        </div>

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
              style={{ backgroundColor: "#9dceb1" }}
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

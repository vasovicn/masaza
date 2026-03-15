import type { Metadata } from "next";
import ContactSection from "@/components/ContactSection";

export const metadata: Metadata = {
  title: "Kontakt - Somatic Balans",
  description: "Kontaktirajte nas za informacije o uslugama, zakazivanje i sve ostalo. Radimo od ponedeljka do subote 8-22h.",
};

export default function KontaktPage() {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Kontaktirajte nas
          </h1>
          <p className="text-lg text-gray-600">
            Tu smo za sva vasa pitanja i nedoumice.
          </p>
        </div>
      </div>
      <ContactSection />
    </div>
  );
}

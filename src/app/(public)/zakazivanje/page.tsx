import type { Metadata } from "next";
import { Suspense } from "react";
import BookingWizard from "@/components/booking/BookingWizard";
import { SALON_NAME } from "@/lib/constants";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "Zakažite termin",
  description: "Zakažite masažni tretman online u salonu Somatic Balans. Izaberite uslugu, termin i terapeuta.",
  alternates: { canonical: `${baseUrl}/zakazivanje` },
  openGraph: {
    title: `Zakažite termin | ${SALON_NAME}`,
    description: "Online zakazivanje masaže u Beogradu. Brzo i jednostavno.",
    url: `${baseUrl}/zakazivanje`,
    type: "website",
    siteName: SALON_NAME,
    locale: "sr_RS",
  },
};

export default function ZakazivanjePage() {
  return (
    <div>
      <div
        className="py-16 text-center"
        style={{ background: "linear-gradient(135deg, #f0f9f4 0%, #d9f0e4 60%, #b5e2cc 100%)" }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Zakaži termin
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Nekoliko koraka do vašeg savršenog termina.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <Suspense fallback={
          <div className="flex items-center justify-center py-16">
            <div className="w-10 h-10 rounded-full border-3 border-t-transparent animate-spin" style={{ borderColor: "#9dceb1", borderTopColor: "transparent", borderWidth: 3 }} />
          </div>
        }>
          <BookingWizard />
        </Suspense>
      </div>
    </div>
  );
}

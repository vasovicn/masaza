import type { Metadata } from "next";
import { Suspense } from "react";
import BookingWizard from "@/components/booking/BookingWizard";

export const metadata: Metadata = {
  title: "Zakazi termin - Somatic Balans",
  description: "Zakazite masazni tretman online. Izaberite uslugu, termin i maserologa koji vam odgovara.",
};

export default function ZakazivanjePage() {
  return (
    <div className="py-12" style={{ background: "linear-gradient(to bottom, #f0f9f4, white)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4" style={{ backgroundColor: "#f0f9f4", color: "#3a8059" }}>
            Online zakazivanje
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Zakazi termin
          </h1>
          <p className="text-lg text-gray-600">
            Nekoliko koraka do vaseg savrsenog termina
          </p>
        </div>

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

import Link from "next/link";
import { Calendar, ChevronRight, Leaf } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "linear-gradient(135deg, #f0f9f4 0%, #d9f0e4 40%, #b5e2cc 100%)",
        }}
      />
      {/* Decorative circles */}
      <div className="absolute top-20 right-0 w-96 h-96 rounded-full opacity-20 z-0" style={{ background: "#9dceb1", transform: "translate(30%, -20%)" }} />
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-15 z-0" style={{ background: "#4da070", transform: "translate(-30%, 30%)" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6" style={{ backgroundColor: "rgba(157,206,177,0.3)", color: "#2e6345" }}>
            <Leaf className="w-4 h-4" />
            Profesionalni salon masaze u Beogradu
          </div>

          {/* Headline */}
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Pronadjite ravnotezu{" "}
            <span style={{ color: "#4da070" }}>tela i duha</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Dozivite duboko opustanje i oporavak uz nase strucne masazne terapeute. Prilagodjavamo svaki tretman vasim individualnim potrebama.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/zakazivanje"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-white text-base font-semibold shadow-lg transition-all hover:shadow-xl hover:scale-105"
              style={{ backgroundColor: "#9dceb1" }}
            >
              <Calendar className="w-5 h-5" />
              Zakazi termin
            </Link>
            <Link
              href="/usluge"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-gray-800 text-base font-semibold border-2 border-gray-300 hover:border-[#9dceb1] hover:text-[#4da070] transition-all bg-white"
            >
              Nase usluge
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-6 max-w-sm">
            {[
              { value: "500+", label: "Zadovoljnih klijenata" },
              { value: "6+", label: "Vrsta masaza" },
              { value: "5+", label: "God. iskustva" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold" style={{ color: "#3a8059" }}>
                  {stat.value}
                </div>
                <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import { Gift, Phone, Mail, Heart, Star, Sparkles } from "lucide-react";
import { SALON_PHONE, SALON_EMAIL, SALON_NAME } from "@/lib/constants";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://masazabalans.rs";

export const metadata: Metadata = {
  title: "Poklon vaučer",
  description: "Poklonite iskustvo opuštanja. Poklon vaučeri salona Somatic Balans — savršen poklon za svaku priliku.",
  alternates: { canonical: `${baseUrl}/poklon-vaucer` },
  openGraph: {
    title: `Poklon vaučer | ${SALON_NAME}`,
    description: "Poklonite nekome masažu — savršen poklon za svaku priliku.",
    url: `${baseUrl}/poklon-vaucer`,
    type: "website",
    siteName: SALON_NAME,
    locale: "sr_RS",
  },
};

const voucherOptions = [
  {
    label: "Kratki odmor",
    duration: "30 min",
    description: "Idealno za brzo opuštanje i regeneraciju",
    icon: "🌿",
  },
  {
    label: "Potpuno opuštanje",
    duration: "60 min",
    description: "Najpopularniji izbor — pun doživljaj tretmana",
    icon: "✨",
    popular: true,
  },
  {
    label: "Luksuzni tretman",
    duration: "90 min",
    description: "Najkompletniji tretman za potpunu regeneraciju",
    icon: "👑",
  },
];

const occasions = [
  { icon: "🎂", label: "Rođendan" },
  { icon: "💝", label: "Godišnjica" },
  { icon: "🎄", label: "Praznici" },
  { icon: "💼", label: "Poslovni poklon" },
  { icon: "👩", label: "Dan žena" },
  { icon: "🌸", label: "Majčin dan" },
];

export default function PouklonVaucerPage() {
  return (
    <div>
      <div
        className="py-16 text-center"
        style={{ background: "linear-gradient(135deg, #f0f9f4 0%, #d9f0e4 60%, #b5e2cc 100%)" }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Poklon vaučer
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Poklonite nekome iskustvo dubokog opuštanja i brige o sebi.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Gift box visual */}
        <div className="relative max-w-2xl mx-auto mb-16">
          <div className="rounded-3xl p-10 text-center" style={{ background: "linear-gradient(135deg, #d9f0e4, #9dceb1)" }}>
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Gift className="w-12 h-12" style={{ color: "#3a8059" }} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Somatic Balans
            </h2>
            <p className="text-gray-700 mb-1 font-medium">Poklon vaučer za masažu</p>
            <p className="text-sm text-gray-600">Važeći 6 meseci od datuma kupovine</p>

            <div className="flex items-center justify-center gap-1 mt-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" style={{ color: "#3a8059" }} />
              ))}
            </div>
          </div>
        </div>

        {/* Voucher options */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
            Izaberite trajanje tretmana
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {voucherOptions.map((opt) => (
              <div
                key={opt.label}
                className={`relative rounded-2xl border-2 p-6 text-center transition-all ${
                  opt.popular
                    ? "border-[#9dceb1] shadow-lg"
                    : "border-gray-100 hover:border-[#9dceb1]"
                }`}
              >
                {opt.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: "#4da070" }}>
                      <Sparkles className="w-3 h-3" />
                      Najpopularnije
                    </span>
                  </div>
                )}
                <div className="text-4xl mb-3">{opt.icon}</div>
                <h3 className="font-bold text-gray-900 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {opt.label}
                </h3>
                <p className="text-2xl font-bold mb-2" style={{ color: "#3a8059" }}>
                  {opt.duration}
                </p>
                <p className="text-sm text-gray-500">{opt.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Occasions */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
            Savršen za svaku priliku
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {occasions.map((occ) => (
              <div key={occ.label} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white border border-gray-100 hover:border-[#9dceb1] transition-colors">
                <span className="text-3xl">{occ.icon}</span>
                <span className="text-xs font-medium text-gray-700 text-center">{occ.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
            Kako funkcioniše?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                title: "Kontaktirajte nas",
                desc: "Pozovite nas ili pošaljite email. Recite nam za koga je poklon i koje trajanje želite.",
              },
              {
                step: "2",
                title: "Preuzmite vaučer",
                desc: "Lično preuzmite vaučer u salonu ili dogovorite dostavu. Vaučer važi 6 meseci.",
              },
              {
                step: "3",
                title: "Poklonite iskustvo",
                desc: "Obradujte nekoga posebnim iskustvom opuštanja i brige o sebi u Somatic Balans.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white font-bold" style={{ backgroundColor: "#5a9e78" }}>
                  {item.step}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-3xl p-10 text-center" style={{ background: "linear-gradient(135deg, #f0f9f4, #d9f0e4)" }}>
          <Heart className="w-10 h-10 mx-auto mb-4" style={{ color: "#9dceb1" }} />
          <h2 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Naručite poklon vaučer
          </h2>
          <p className="text-gray-600 mb-8 max-w-lg mx-auto">
            Kontaktirajte nas telefonom ili emailom i dogovorite sve detalje. Rado ćemo vam pomoći da napravite savršen poklon.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${SALON_PHONE}`}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-white font-semibold text-sm transition-all hover:opacity-90 shadow-md"
              style={{ backgroundColor: "#5a9e78" }}
            >
              <Phone className="w-4 h-4" />
              {SALON_PHONE}
            </a>
            <a
              href={`mailto:${SALON_EMAIL}?subject=Poklon vaučer&body=Zdravo, zanima me poklon vaučer za masažu.`}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border-2 font-semibold text-sm transition-all hover:bg-white"
              style={{ borderColor: "#9dceb1", color: "#3a8059" }}
            >
              <Mail className="w-4 h-4" />
              Pošaljite email
            </a>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Vaučer važi 6 meseci od datuma kupovine · Prenosiv na drugu osobu
          </p>
        </div>
      </div>
    </div>
  );
}

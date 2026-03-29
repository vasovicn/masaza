import type { Metadata } from "next";
import { Heart, Shield, Sparkles, Award } from "lucide-react";
import { SALON_NAME } from "@/lib/constants";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://masazabalans.rs";

export const metadata: Metadata = {
  title: "O nama",
  description: "Upoznajte tim Somatic Balans salona za masažu u Beogradu. Naši stručni maseri su tu da vam pruže nezaboravno iskustvo.",
  alternates: { canonical: `${baseUrl}/o-nama` },
  openGraph: {
    title: `O nama | ${SALON_NAME}`,
    description: "Upoznajte naš tim i našu priču.",
    url: `${baseUrl}/o-nama`,
    type: "website",
    siteName: SALON_NAME,
    locale: "sr_RS",
  },
};

export default function ONamaPage() {

  return (
    <div>
      <div
        className="py-16 text-center"
        style={{ background: "linear-gradient(135deg, #f0f9f4 0%, #d9f0e4 60%, #b5e2cc 100%)" }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            O nama
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Upoznajte Somatic Balans i našu priču.
          </p>
        </div>
      </div>

      {/* Story */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                Naša priča
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Moj život se deli na period pre i posle prve obuke za masažu. Pre nego što me je masaža privukla bavila sam se administracijom a najveći deo socijalnih veština sam upravo tada izbrusila.
                </p>
                <p>
                  Masaža mi je pomogla da razvijem intuiciju i zahvaljujući njoj prepustim se pozivu duše. Slušajući šta mi srce ište upisujem obuku za telesnog psihoterapeuta u IPD centru i uporedo sa tim i edukaciju Somatic experiencing Pitera Levina. Moj put učenja će trajati dok sam živa jer planiram i studije tradicionalne kineske medicine.
                </p>
                <p>
                  Puno je puteva do istine koja je jedna i uvek ista - čovek je izvanredno biće, a priroda je svakom od nas dala potencijale da to i dostignemo.
                </p>
                <p>
                  Moje nastojanje je da drugome budem podrška u tom procesu na sve, meni dostupne, načine.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Heart, title: "Strast", desc: "Svaki tretman radimo sa punom posvećenošću i ljubavlju prema poslu" },
                { icon: Shield, title: "Profesionalnost", desc: "Sertifikovani terapeuti sa godinama iskustva u masažnim tehnikama" },
                { icon: Sparkles, title: "Kvalitet", desc: "Koristimo isključivo premium prirodne preparate i eterična ulja" },
                { icon: Award, title: "Iskustvo", desc: "Više od 1000 zadovoljnih klijenata govori o našem poslu" },
              ].map((item) => (
                <div key={item.title} className="bg-white rounded-2xl p-5 border border-gray-100">
                  <item.icon className="w-8 h-8 mb-3" style={{ color: "#4da070" }} />
                  <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="py-16" style={{ background: "linear-gradient(135deg, #f0f9f4, #d9f0e4)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Naša filozofija
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
            Verujemo da svaka osoba zaslužuje da se oseća bolje - u svom telu, u svom umu, u svom životu.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { icon: "🌿", title: "Prirodno", desc: "Samo prirodni preparati" },
              { icon: "🤝", title: "Individualno", desc: "Prilagođen tebi" },
              { icon: "✨", title: "Transformativno", desc: "Promena koja traje" },
            ].map((val) => (
              <div key={val.title} className="bg-white/70 rounded-2xl p-6 backdrop-blur-sm">
                <div className="text-4xl mb-3">{val.icon}</div>
                <h3 className="font-bold text-gray-900 mb-1">{val.title}</h3>
                <p className="text-sm text-gray-600">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { Heart, Shield, Sparkles, Award, Star } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "O nama - Somatic Balans",
  description: "Upoznajte tim Somatic Balans salona masaze u Beogradu. Nasi strucni maseri su tu da vam pruze nezaboravno iskustvo.",
};

async function getStaff() {
  try {
    return await prisma.staffUser.findMany({
      where: { active: true, role: "maser" },
      orderBy: { sequence: "asc" },
    });
  } catch {
    return [];
  }
}

export default async function ONamaPage() {
  const staff = await getStaff();

  return (
    <div className="py-12">
      {/* Hero section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4" style={{ backgroundColor: "#f0f9f4", color: "#3a8059" }}>
            Ko smo mi
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            O salonu Somatic Balans
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Somatic Balans je osnovan sa jednom vizijom: da svakom klijentu pruzi savrseno prilagodjeni tretman koji obnavlja telo i um.
          </p>
        </div>
      </div>

      {/* Story */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                Nasa prica
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Somatic Balans je nastao iz duboke strasti prema holistickom zdravlju i blagostanju. Nasi osnivaci su verovali da profesionalna masaza nije luksuz - vec esencijalna potreba modernog coveka koji se suocava sa svakodnevnim stresom i fizickim naprezanjima.
                </p>
                <p>
                  Naziv &quot;Somatic Balans&quot; dolazi od grcke reci &quot;soma&quot; (telo) i latinskog &quot;balans&quot; (ravnoteza). Ova filozofija prozdire sve sto radimo - trazimo ravnotezu izmedju tela i uma, izmedju napetosti i opustanja, izmedju bola i komfora.
                </p>
                <p>
                  Danas, sa timom iskusnih terapeuta i savremeno opremljenim kabinetima, nastavljamo da gradimo nasu reputaciju kao jedno od vodecih mesta za masazu u Beogradu.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Heart, title: "Strast", desc: "Svaki tretman radimo sa punom posvacenoscu i ljubavlju prema poslu" },
                { icon: Shield, title: "Profesionalnost", desc: "Sertifikovani terapeuti sa godinama iskustva u masaznim tehnikama" },
                { icon: Sparkles, title: "Kvalitet", desc: "Koristimo iskljucivo premium prirodne preparate i etericna ulja" },
                { icon: Award, title: "Iskustvo", desc: "Vise od 500 zadovoljnih klijenata govori o nasem poslu" },
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

      {/* Team */}
      {staff.length > 0 && (
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4" style={{ backgroundColor: "#f0f9f4", color: "#3a8059" }}>
                Nas tim
              </span>
              <h2 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                Upoznajte nase terapeute
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {staff.map((member) => (
                <div key={member.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all text-center p-6">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4" style={{ backgroundColor: "#5a9e78" }}>
                    {member.firstName[0]}{member.lastName[0]}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {member.firstName} {member.lastName}
                  </h3>
                  <div className="flex items-center justify-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-current" style={{ color: "#f59e0b" }} />
                    ))}
                  </div>
                  {member.bio && (
                    <p className="text-sm text-gray-600 leading-relaxed">{member.bio}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Values */}
      <div className="py-16" style={{ background: "linear-gradient(135deg, #f0f9f4, #d9f0e4)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Nasa filosofija
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
            Verujemo da svaka osoba zasluzuje da se oseca bolje - u svom telu, u svom umu, u svom zivotu.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { icon: "🌿", title: "Prirodno", desc: "Samo prirodni preparati" },
              { icon: "🤝", title: "Individualno", desc: "Prilagodjen svakome" },
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

import { Heart, Shield, Sparkles, Users, Award, Leaf } from "lucide-react";

const benefits = [
  {
    icon: Heart,
    title: "Holistički pristup",
    description: "Tretiramo celog čoveka - telo i um zajedno, za dugoročne rezultate.",
  },
  {
    icon: Shield,
    title: "Stručni terapeuti",
    description: "Svi naši terapeuti su sertifikovani i imaju više godina iskustva.",
  },
  {
    icon: Sparkles,
    title: "Premium proizvodi",
    description: "Koristimo samo prirodna eterična ulja i premium masažne kreme.",
  },
  {
    icon: Users,
    title: "Individualni tretman",
    description: "Svaki tretman prilagođavamo vašim specifičnim potrebama i zdravstvenom stanju.",
  },
  {
    icon: Award,
    title: "Proverena kvaliteta",
    description: "Više od 1000 zadovoljnih klijenata koji nam se redovno vraćaju.",
  },
  {
    icon: Leaf,
    title: "Opuštajuća atmosfera",
    description: "Nasmijani kabineti su opremljeni za maksimalan komfor i privatnost.",
  },
];

export default function AboutSection() {
  return (
    <section className="py-20" style={{ background: "linear-gradient(to bottom, #f0f9f4, white)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left - Text */}
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4" style={{ backgroundColor: "#f0f9f4", color: "#3a8059" }}>
              Ko smo mi
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Somatic Balans – <br />
              <span style={{ color: "#4da070" }}>Vaša oaza mira u Zemunu</span>
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

          {/* Right - Visual */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl" style={{ background: "linear-gradient(135deg, #9dceb1, #4da070)" }}>
              <div className="p-12 text-center text-white">
                <div className="text-8xl mb-6">🌿</div>
                <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Više od masaže
                </h3>
                <p className="opacity-90 text-lg">
                  Doživite potpuno oživljavanje tela i duha kroz našu stručnu njegu
                </p>
              </div>
            </div>
            {/* Floating card */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-5 shadow-xl border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "#f0f9f4" }}>
                  <Award className="w-6 h-6" style={{ color: "#4da070" }} />
                </div>
                <div>
                  <div className="font-bold text-gray-900">1000+ klijenata</div>
                  <div className="text-sm text-gray-500">Zadovoljnih korisnika</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits grid */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-gray-100 hover:border-[#9dceb1] hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "#f0f9f4" }}>
                <benefit.icon className="w-6 h-6" style={{ color: "#4da070" }} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

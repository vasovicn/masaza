import Link from "next/link";
import { Phone, Mail, MapPin, Clock, Instagram, Leaf } from "lucide-react";
import { SALON_NAME, SALON_PHONE, SALON_EMAIL, SALON_ADDRESS, SALON_INSTAGRAM } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: "#9dceb1" }}>
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                {SALON_NAME}
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Profesionalni salon masaze u Beogradu. Pronađite ravnotezu tela i duha uz nase strucne terapeute.
            </p>
            <a
              href={SALON_INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm hover:text-[#9dceb1] transition-colors"
            >
              <Instagram className="w-4 h-4" />
              @somaticbalans
            </a>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Brze veze</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/usluge", label: "Usluge" },
                { href: "/cenovnik", label: "Cenovnik" },
                { href: "/o-nama", label: "O nama" },
                { href: "/galerija", label: "Galerija" },
                { href: "/kontakt", label: "Kontakt" },
                { href: "/faq", label: "Česta pitanja" },
                { href: "/poklon-vaucer", label: "Poklon vaučer" },
                { href: "/zakazivanje", label: "Zakaži termin" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-[#9dceb1] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Kontakt</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href={`tel:${SALON_PHONE}`} className="flex items-start gap-2 hover:text-[#9dceb1] transition-colors">
                  <Phone className="w-4 h-4 mt-0.5 shrink-0 text-[#9dceb1]" />
                  {SALON_PHONE}
                </a>
              </li>
              <li>
                <a href={`mailto:${SALON_EMAIL}`} className="flex items-start gap-2 hover:text-[#9dceb1] transition-colors">
                  <Mail className="w-4 h-4 mt-0.5 shrink-0 text-[#9dceb1]" />
                  {SALON_EMAIL}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-[#9dceb1]" />
                {SALON_ADDRESS}
              </li>
            </ul>
          </div>

          {/* Working hours */}
          <div>
            <h3 className="text-white font-semibold mb-4">Radno vreme</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 mt-0.5 shrink-0 text-[#9dceb1]" />
                <div>
                  <p className="text-gray-300">Ponedeljak – Subota</p>
                  <p className="text-white font-medium">08:00 – 22:00</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 mt-0.5 shrink-0 text-gray-600" />
                <div>
                  <p className="text-gray-400">Nedelja</p>
                  <p className="text-gray-500 font-medium">Zatvoreno</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} {SALON_NAME}. Sva prava zadrzana.</p>
          <p>Salon masaze u Beogradu</p>
        </div>
      </div>
    </footer>
  );
}

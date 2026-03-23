import type { Metadata } from "next";
import { SALON_NAME, SALON_EMAIL, SALON_ADDRESS } from "@/lib/constants";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://masazabalans.rs";

export const metadata: Metadata = {
  title: "Politika privatnosti",
  description: `Politika privatnosti salona ${SALON_NAME}. Saznajte kako prikupljamo, koristimo i štitimo vaše lične podatke.`,
  alternates: { canonical: `${baseUrl}/politika-privatnosti` },
  robots: { index: true, follow: true },
};

export default function PolitikaPrivatnostiPage() {
  return (
    <div>
      <div
        className="py-16 text-center"
        style={{ background: "linear-gradient(135deg, #f0f9f4 0%, #d9f0e4 60%, #b5e2cc 100%)" }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1
            className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Politika privatnosti
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Poslednje ažuriranje: mart 2025.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 prose prose-gray max-w-none">
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            1. Ko smo mi
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {SALON_NAME} je salon masaže koji pruža usluge relaksacione i terapeutske masaže. Naša adresa je{" "}
            {SALON_ADDRESS}. Možete nas kontaktirati putem e-pošte: {SALON_EMAIL}.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            2. Koje podatke prikupljamo
          </h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Prikupljamo sledeće lične podatke kada koristite naše usluge:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Ime i prezime</li>
            <li>E-mail adresa</li>
            <li>Broj telefona</li>
            <li>Informacije o zakazanim terminima (usluga, datum, vreme)</li>
            <li>Informacije o nalogu (ako se registrujete)</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            3. Kako koristimo vaše podatke
          </h2>
          <p className="text-gray-700 leading-relaxed mb-3">Vaše podatke koristimo isključivo za:</p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Zakazivanje i upravljanje terminima</li>
            <li>Slanje potvrda i podsetnika za termine putem e-pošte</li>
            <li>Komunikaciju u vezi sa vašim rezervacijama</li>
            <li>Upravljanje korisničkim nalogom</li>
            <li>Poboljšanje kvaliteta naših usluga</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            4. Prijava putem Google naloga
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Nudimo mogućnost prijave putem Google naloga (Google OAuth). Kada se prijavite putem Google-a, dobijamo
            pristup vašem imenu i e-mail adresi koje ste registrovali na Google nalogu. Ove informacije koristimo
            isključivo za kreiranje i upravljanje vašim nalogom na našoj platformi. Ne dobijamo pristup vašoj lozinci
            niti drugim podacima sa Google naloga. Možete u svakom trenutku opozvati pristup putem{" "}
            <a
              href="https://myaccount.google.com/permissions"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-700 underline"
            >
              Google podešavanja naloga
            </a>
            .
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            5. Deljenje podataka sa trećim stranama
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Ne prodajemo, ne iznajmljujemo niti delimo vaše lične podatke sa trećim stranama u komercijalne svrhe.
            Vaši podaci mogu biti obrađeni od strane pouzdanih tehničkih partnera (hosting, e-mail servis) isključivo u
            svrhu pružanja naših usluga, uz obavezu čuvanja poverljivosti.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            6. Čuvanje podataka
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Vaše podatke čuvamo samo onoliko dugo koliko je potrebno za pružanje usluga ili koliko je propisano
            zakonom. Kada zatvorite nalog, vaši lični podaci biće izbrisani u razumnom roku.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            7. Vaša prava
          </h2>
          <p className="text-gray-700 leading-relaxed mb-3">U skladu sa važećim propisima o zaštiti podataka, imate pravo da:</p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Zatražite uvid u podatke koje čuvamo o vama</li>
            <li>Zatražite ispravku netačnih podataka</li>
            <li>Zatražite brisanje vaših podataka</li>
            <li>Povučete pristanak za obradu podataka</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-3">
            Za ostvarivanje ovih prava, kontaktirajte nas na: {SALON_EMAIL}
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            8. Bezbednost podataka
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Primenjujemo odgovarajuće tehničke i organizacione mere zaštite kako bismo zaštitili vaše lične podatke od
            neovlašćenog pristupa, gubitka ili zloupotrebe. Sva komunikacija sa našim serverom je šifrovana putem HTTPS
            protokola.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            9. Izmene politike privatnosti
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Zadržavamo pravo da ažuriramo ovu politiku privatnosti. O značajnim izmenama bićete obavešteni putem
            e-pošte ili obaveštenjem na našoj veb stranici. Preporučujemo da povremeno proverite ovu stranicu.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            10. Kontakt
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Ako imate bilo kakva pitanja u vezi sa ovom politikom privatnosti ili načinom na koji obrađujemo vaše
            podatke, kontaktirajte nas:
          </p>
          <div className="mt-4 p-6 bg-gradient-to-br from-[#f0f9f4] to-[#d9f0e4] rounded-2xl">
            <p className="font-semibold text-gray-900">{SALON_NAME}</p>
            <p className="text-gray-700">{SALON_ADDRESS}</p>
            <p className="text-gray-700">
              E-mail:{" "}
              <a href={`mailto:${SALON_EMAIL}`} className="text-green-700 underline">
                {SALON_EMAIL}
              </a>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

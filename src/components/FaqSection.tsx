"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    category: "Zakazivanje",
    items: [
      {
        question: "Da li je potrebna rezervacija?",
        answer: "Preporučujemo zakazivanje unapred kako bismo osigurali termin koji vam odgovara. Možete zakazati online u bilo koje doba dana ili nas kontaktirati telefonom tokom radnog vremena.",
      },
      {
        question: "Kako mogu da zakažem termin?",
        answer: "Termin možete zakazati online klikom na dugme 'Zakaži termin', telefonom tokom radnog vremena, ili nam pišite na email. Online zakazivanje je dostupno 24/7.",
      },
      {
        question: "Kako da otkazem ili promenim termin?",
        answer: "Termin možete otkazati ili promeniti najkasnije 24 sata pre zakazanog termina. Ako imate nalog, to možete uraditi iz sekcije 'Moj nalog'. U suprotnom, kontaktirajte nas telefonom.",
      },
      {
        question: "Koliko unapred treba da zakažem?",
        answer: "Preporučujemo zakazivanje 2-3 dana unapred, posebno vikendom. Za hitne termine, pokušajte nas kontaktirati telefonom — često imamo slobodnih mesta.",
      },
    ],
  },
  {
    category: "Masaže i tretmani",
    items: [
      {
        question: "Koliko traje masaža?",
        answer: "Tretmani traju 30, 60 ili 90 minuta, u zavisnosti od vrste masaže i vašeg izbora. Preporučujemo 60-minutni tretman za potpuno iskustvo opuštanja.",
      },
      {
        question: "Koja masaža je prava za mene?",
        answer: "Ako niste sigurni, naši terapeuti će vam pomoći pri izboru. Relaksaciona masaža je idealna za opuštanje i stres, sportska masaža za oporavak mišića, a duboka tkivna za hronične napetosti.",
      },
      {
        question: "Da li je masaža bolna?",
        answer: "Masaža ne bi trebalo da bude bolna. Pritisak uvek prilagođavamo vašim potrebama i toleranciji. Tokom tretmana slobodno recite terapeutu ako vam je neprijatno.",
      },
      {
        question: "Treba li mi posebna priprema pre masaže?",
        answer: "Dođite odmorno i nemojte jesti obilno sat vremena pre tretmana. Preporučujemo da pijete dosta vode dan pre i posle masaže. Sve ostalo prepustite našim terapeutima.",
      },
      {
        question: "Mogu li da biram terapeuta?",
        answer: "Da, pri zakazivanju možete odabrati željenog terapeuta. Ako nemate preferenciju, naš sistem automatski dodeljuje dostupnog terapeuta.",
      },
    ],
  },
  {
    category: "Cene i plaćanje",
    items: [
      {
        question: "Koje načine plaćanja prihvatate?",
        answer: "Prihvatamo gotovinu i kartice (Visa, Mastercard). Plaćanje se vrši u salonu po završetku tretmana.",
      },
      {
        question: "Da li nudite poklon vaučere?",
        answer: "Da! Poklon vaučeri su dostupni u različitim vrednostima. Kontaktirajte nas telefonom ili emailom za više informacija o kupovini vaučera.",
      },
      {
        question: "Da li postoje popusti?",
        answer: "Pratite nas na Instagramu za aktualne akcije i promotivne ponude. Registrovani korisnici su prvi obavešteni o specijalnim ponudama.",
      },
    ],
  },
  {
    category: "Salon i lokacija",
    items: [
      {
        question: "Gde se nalazite?",
        answer: "Nalazimo se u Beogradu. Tačnu adresu i uputstvo za dolazak možete pronaći na stranici Kontakt.",
      },
      {
        question: "Kada ste otvoreni?",
        answer: "Radimo od ponedeljka do subote, od 08:00 do 22:00 sata. Nedeljom ne radimo.",
      },
      {
        question: "Da li ima parking?",
        answer: "Da, u blizini salona postoje parking mesta. Detaljnije informacije potražite na stranici Kontakt.",
      },
    ],
  },
];

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors gap-4"
      >
        <span className="font-medium text-gray-900 text-sm sm:text-base">{question}</span>
        <ChevronDown
          className="w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      {open && (
        <div className="px-5 pb-5">
          <p className="text-gray-600 text-sm leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function FaqSection() {
  return (
    <div className="space-y-10">
      {faqs.map((group) => (
        <div key={group.category}>
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-1 h-5 rounded-full inline-block" style={{ backgroundColor: "#9dceb1" }} />
            {group.category}
          </h2>
          <div className="space-y-2">
            {group.items.map((item) => (
              <FaqItem key={item.question} question={item.question} answer={item.answer} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

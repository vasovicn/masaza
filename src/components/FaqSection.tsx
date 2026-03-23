"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export const faqs = [
  {
    category: "Masaže i tretmani",
    items: [
      {
        question: "Da li sme da se radi masaža tokom trudnoće i dok dojim?",
        answer: "Da, od prvog dana trudnoće sme da se radi masaža jer je prilagođena vašem stanju i bezbedna za plod i vas.",
      },
      {
        question: "Koliko često sme da se ide na masažu?",
        answer: "Onoliko često koliko vama prija! Ako ste stalno izloženi stresu čak svakodnevno opuštanje pomaže da se oslobodite nakupljene tenzije. Ipak, optimalno je bar jednom nedeljno ili u dve nedelje opustiti svoj nervni sistem a time i mišiće i fasciju.",
      },
      {
        question: "Koja je razlika između relaks i antistres masaže?",
        answer: "Relaks je blaga i opuštajuća masaža dok je antistres dubljih hvatova, a opet ne toliko jakih da bi bilo prejako.",
      },
      {
        question: "Da li anticelulit masaža stvarno pomaže da se smanji efekat \"pomorandžine kore\"?",
        answer: "Apsolutno, ali nije dovoljno samo masiranje. Mora se povesti računa o ishrani i uvesti bar šetnja. Naravno, od stanja potkožnog tkiva zavisi i broj tretmana pa ako se tkivo redovno tretira u dovoljnom broju moguće je \"ispeglati\" kožu, tj. razgraditi celulit i dobiti željeni glatki(ji) izgled kože.",
      },
    ],
  },
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
        answer: "Preporučujemo zakazivanje 2-3 dana unapred, posebno vikendom.",
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
        answer: "Nalazimo se u Zemunu. Tačnu adresu i uputstvo za dolazak možete pronaći na stranici Kontakt.",
      },
      {
        question: "Kada ste otvoreni?",
        answer: "Radimo od ponedeljka do subote, od 08:00 do 22:00 sata. Nedeljom ne radimo.",
      },
      {
        question: "Da li ima parking?",
        answer: "Da, u blizini salona postoje parking mesta.",
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
            <span className="w-1 h-5 rounded-full inline-block" style={{ backgroundColor: "#5a9e78" }} />
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

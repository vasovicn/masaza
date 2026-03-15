import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Milica Stankovic",
    role: "Marketing menadzer",
    text: "Neverovatno iskustvo! Aromaterapijska masaza u Somatic Balansu je potpuno promenila moj pogled na relaksaciju. Dolazim svake dve nedelje i ne mogu zamisliti zivot bez toga.",
    rating: 5,
    initials: "MS",
  },
  {
    name: "Stefan Nikolic",
    role: "Sportista",
    text: "Kao aktivni sportista, redovno koristim sportsku masazu. Marko je pravi strucnjak - tacno zna gde je problem i kako da pomogne. Oporavak posle treninga je sada duplo brzi.",
    rating: 5,
    initials: "SN",
  },
  {
    name: "Jelena Popovic",
    role: "IT inzenjer",
    text: "Dolazim na duboku tkivnu masazu zbog bolova u ledjima od sedenja za kompjuterom. Ana je fantasticna - nakon samo 3 tretmana bolovi su se znacajno smanjili. Toplo preporucujem!",
    rating: 5,
    initials: "JP",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4" style={{ backgroundColor: "#f0f9f4", color: "#3a8059" }}>
            Utisci klijenata
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Sta kazu nasi klijenti
          </h2>
          <p className="text-lg text-gray-600">
            Zadovoljstvo nasih klijenata je nase najvece postignuce.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-[#9dceb1] hover:shadow-md transition-all"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" style={{ color: "#f59e0b" }} />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-700 leading-relaxed mb-6 italic">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ backgroundColor: "#5a9e78" }}
                >
                  {testimonial.initials}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{testimonial.name}</div>
                  <div className="text-xs text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

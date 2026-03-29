"use client";

import { useState } from "react";
import Image from "next/image";
import { Clock, ArrowRight } from "lucide-react";

interface ServiceDuration {
  id: string;
  minutes: number;
  price: number;
}

interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  category: { id: string; name: string };
  durations: ServiceDuration[];
}

interface Props {
  services: Service[];
  onSelect: (service: Service) => void;
}

export default function StepService({ services, onSelect }: Props) {
  const categories = Array.from(new Set(services.map((s) => s.category.name)));
  const [activeCategory, setActiveCategory] = useState<string>("sve");

  const filtered =
    activeCategory === "sve"
      ? services
      : services.filter((s) => s.category.name === activeCategory);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
        Izaberite uslugu
      </h2>
      <p className="text-gray-500 mb-6">Odaberite masažu koja odgovara vašim potrebama</p>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveCategory("sve")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            activeCategory === "sve"
              ? "text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
          style={activeCategory === "sve" ? { backgroundColor: "#5a9e78" } : {}}
        >
          Sve
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat
                ? "text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            style={activeCategory === cat ? { backgroundColor: "#5a9e78" } : {}}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Service cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((service) => {
          if (service.durations.length === 0) return null;
          const minPrice = Math.min(...service.durations.map((d) => d.price));
          const minDuration = Math.min(...service.durations.map((d) => d.minutes));

          return (
            <button
              key={service.id}
              onClick={() => onSelect(service)}
              className="text-left group bg-white border-2 border-gray-100 rounded-2xl overflow-hidden hover:border-[#9dceb1] hover:shadow-md transition-all"
            >
              <div className="relative h-36 overflow-hidden" style={{ background: "linear-gradient(135deg, #d9f0e4, #9dceb1)" }}>
                {service.image ? (
                  <Image src={service.image} alt={service.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-40">💆</div>
                )}
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-400 mb-1">{service.category.name}</p>
                <h3 className="font-bold text-gray-900 mb-1 group-hover:text-[#3a8059] transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {service.name}
                </h3>
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{service.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="flex items-center gap-1 text-gray-400">
                      <Clock className="w-3.5 h-3.5" />
                      od {minDuration} min
                    </span>
                    <span className="font-semibold" style={{ color: "#3a8059" }}>
                      od {minPrice.toLocaleString("sr-RS")} RSD
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#9dceb1] transition-colors" />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

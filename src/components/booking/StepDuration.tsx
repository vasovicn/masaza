"use client";

import { Clock } from "lucide-react";

interface ServiceDuration {
  id: string;
  minutes: number;
  price: number;
  packageCount?: number;
}

interface Props {
  serviceName: string;
  durations: ServiceDuration[];
  onSelect: (duration: ServiceDuration) => void;
  onBack: () => void;
}

export default function StepDuration({ serviceName, durations, onSelect, onBack }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
        Izaberite trajanje
      </h2>
      <p className="text-gray-500 mb-6">
        Izaberite zeljeno trajanje za <span className="font-medium text-gray-700">{serviceName}</span>
      </p>

      <div className="space-y-3">
        {durations.map((duration) => (
          <button
            key={duration.id}
            onClick={() => onSelect(duration)}
            className="w-full flex items-center justify-between p-5 bg-white border-2 border-gray-100 rounded-2xl hover:border-[#9dceb1] hover:shadow-md transition-all group text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{ backgroundColor: "#f0f9f4" }}>
                <Clock className="w-6 h-6" style={{ color: "#4da070" }} />
              </div>
              <div>
                <div className="font-bold text-gray-900 text-lg">{duration.packageCount && duration.packageCount > 1 ? `${duration.packageCount} x ${duration.minutes} minuta` : `${duration.minutes} minuta`}</div>
              </div>
            </div>
            <div className="font-bold text-xl" style={{ color: "#3a8059" }}>
              {duration.price.toLocaleString("sr-RS")} RSD
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={onBack}
        className="mt-6 text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1"
      >
        ← Nazad na izbor usluge
      </button>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface Props {
  date: string;
  durationId: string;
  durationMinutes: number;
  onSelect: (time: string) => void;
  onBack: () => void;
}

export default function StepTime({ date, durationId, durationMinutes, onSelect, onBack }: Props) {
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError("");
    fetch(`/api/slots?date=${date}&durationId=${durationId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setSlots(d.slots || []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [date, durationId]);

  const displayDate = new Date(date + "T12:00:00").toLocaleDateString("sr-Latn-RS", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
        Izaberite termin
      </h2>
      <p className="text-gray-500 mb-6">
        Dostupni termini za <span className="font-medium text-gray-700">{displayDate}</span>
        {" "}· trajanje: {durationMinutes} min
      </p>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-3 border-[#9dceb1] border-t-transparent rounded-full animate-spin" style={{ borderWidth: 3 }} />
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm">{error}</div>
      )}

      {!loading && !error && slots.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-600 font-medium">Nema dostupnih termina za ovaj datum</p>
          <p className="text-sm text-gray-400 mt-1">Pokusajte sa drugim datumom</p>
        </div>
      )}

      {!loading && slots.length > 0 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {slots.map((slot) => {
            const isSelected = selected === slot;
            return (
              <button
                key={slot}
                onClick={() => {
                  setSelected(slot);
                  onSelect(slot);
                }}
                className={`py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-105 ${
                  isSelected ? "text-white shadow-md" : "bg-gray-50 text-gray-700 hover:bg-[#f0f9f4] hover:text-[#3a8059] border border-gray-100"
                }`}
                style={isSelected ? { backgroundColor: "#5a9e78" } : {}}
              >
                {slot}
              </button>
            );
          })}
        </div>
      )}

      <button
        onClick={onBack}
        className="mt-6 text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1"
      >
        ← Nazad
      </button>
    </div>
  );
}

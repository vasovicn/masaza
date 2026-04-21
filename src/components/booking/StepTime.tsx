"use client";

import { useEffect, useState } from "react";
import { Clock, Send } from "lucide-react";
import { DIRECT_BOOKING_TIMES } from "@/lib/constants";

interface Props {
  date: string;
  durationId: string;
  durationMinutes: number;
  isToday: boolean;
  onSelect: (time: string, isInquiry: boolean) => void;
  onBack: () => void;
}

export default function StepTime({ date, durationId, durationMinutes, isToday, onSelect, onBack }: Props) {
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

  const isDirectSlot = (slot: string) => !isToday && DIRECT_BOOKING_TIMES.includes(slot);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
        Izaberite termin
      </h2>
      <p className="text-gray-500 mb-6">
        Dostupni termini za <span className="font-medium text-gray-700">{displayDate}</span>
        {" "}· trajanje: {durationMinutes} min
      </p>

      {isToday && (
        <div className="mb-4 p-3 rounded-xl text-sm" style={{ backgroundColor: "#fef9e7", color: "#92700c" }}>
          Za danas je moguće samo slanje upita. Potvrdu termina dobićete u najkraćem mogućem roku.
        </div>
      )}

      {!isToday && !loading && slots.length > 0 && !slots.some(isDirectSlot) && (
        <div className="mb-4 p-3 rounded-xl text-sm flex items-start gap-2" style={{ backgroundColor: "#fef9e7", color: "#92700c" }}>
          <Send className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>
            Svi termini su trenutno <span className="font-semibold">na upit</span> — ne rezerviše se direktno. Potvrdu termina dobićete od salona u najkraćem mogućem roku.
          </span>
        </div>
      )}

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
          <p className="text-sm text-gray-400 mt-1">Pokušajte sa drugim datumom</p>
        </div>
      )}

      {!loading && slots.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {slots.map((slot) => {
            const isDirect = isDirectSlot(slot);
            const isSelected = selected === slot;
            return (
              <button
                key={slot}
                onClick={() => {
                  setSelected(slot);
                  onSelect(slot, !isDirect);
                }}
                className={`py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-105 flex flex-col items-center gap-0.5 ${
                  isSelected
                    ? "text-white shadow-md"
                    : isDirect
                    ? "text-[#3a8059] hover:bg-[#e0f2e8] border border-[#c3e4cf]"
                    : "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
                }`}
                style={isSelected ? { backgroundColor: isDirect ? "#5a9e78" : "#b8860b" } : isDirect && !isSelected ? { backgroundColor: "#f0f9f4" } : {}}
              >
                <span>{slot}</span>
                {!isDirect && !isSelected && (
                  <span className="text-[10px] flex items-center gap-0.5 opacity-80">
                    <Send className="w-2.5 h-2.5" />
                    upit
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {!loading && slots.length > 0 && !isToday && slots.some(isDirectSlot) && (
        <div className="mt-4 p-3 rounded-xl text-xs text-gray-500 bg-gray-50">
          Termini u <span className="font-medium" style={{ color: "#3a8059" }}>zelenom</span> su dostupni za direktno zakazivanje.
          Za termine označene sa <span className="font-medium text-amber-700">"upit"</span> potrebna je potvrda salona.
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

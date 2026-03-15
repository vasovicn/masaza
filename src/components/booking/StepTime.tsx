"use client";

import { useEffect, useState } from "react";
import { User, Clock } from "lucide-react";

interface Slot {
  staffId: string;
  staffName: string;
  slots: string[];
}

interface Props {
  date: string;
  durationId: string;
  durationMinutes: number;
  onSelect: (time: string, staffId: string, staffName: string) => void;
  onBack: () => void;
}

export default function StepTime({ date, durationId, durationMinutes, onSelect, onBack }: Props) {
  const [data, setData] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<{ time: string; staffId: string } | null>(null);

  useEffect(() => {
    setLoading(true);
    setError("");
    fetch(`/api/slots?date=${date}&durationId=${durationId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setData(d.slots || []);
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

      {!loading && !error && data.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-600 font-medium">Nema dostupnih termina za ovaj datum</p>
          <p className="text-sm text-gray-400 mt-1">Pokusajte sa drugim datumom</p>
        </div>
      )}

      {!loading && data.length > 0 && (
        <div className="space-y-6">
          {data.map((staffSlot) => (
            <div key={staffSlot.staffId}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: "#9dceb1" }}>
                  {staffSlot.staffName.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-gray-900 text-sm">{staffSlot.staffName}</span>
                </div>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {staffSlot.slots.map((slot) => {
                  const isSelected = selected?.time === slot && selected?.staffId === staffSlot.staffId;
                  return (
                    <button
                      key={slot}
                      onClick={() => {
                        setSelected({ time: slot, staffId: staffSlot.staffId });
                        onSelect(slot, staffSlot.staffId, staffSlot.staffName);
                      }}
                      className={`py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-105 ${
                        isSelected ? "text-white shadow-md" : "bg-gray-50 text-gray-700 hover:bg-[#f0f9f4] hover:text-[#3a8059] border border-gray-100"
                      }`}
                      style={isSelected ? { backgroundColor: "#9dceb1" } : {}}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
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

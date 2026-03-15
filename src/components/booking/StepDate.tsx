"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  selectedDate: string;
  onSelect: (date: string) => void;
  onBack: () => void;
}

const DAYS = ["Ned", "Pon", "Uto", "Sre", "Cet", "Pet", "Sub"];
const MONTHS = [
  "Januar", "Februar", "Mart", "April", "Maj", "Jun",
  "Jul", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar",
];

function isSunday(date: Date) {
  return date.getDay() === 0;
}

function isPast(date: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function StepDate({ selectedDate, onSelect, onBack }: Props) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1);
  const lastDay = new Date(viewYear, viewMonth + 1, 0);
  const startPad = firstDay.getDay(); // 0=Sun
  const daysInMonth = lastDay.getDate();

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const canPrev = !(viewYear === today.getFullYear() && viewMonth <= today.getMonth());

  const cells: (Date | null)[] = Array(startPad).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(viewYear, viewMonth, d));
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
        Izaberite datum
      </h2>
      <p className="text-gray-500 mb-6">Radimo od ponedeljka do subote</p>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        {/* Calendar header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <button
            onClick={prevMonth}
            disabled={!canPrev}
            className="p-2 rounded-lg disabled:opacity-30 hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-bold text-gray-900">
            {MONTHS[viewMonth]} {viewYear}
          </span>
          <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-gray-100">
          {DAYS.map((day) => (
            <div
              key={day}
              className={`py-2 text-center text-xs font-medium ${day === "Ned" ? "text-red-400" : "text-gray-500"}`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-7 p-3 gap-1">
          {cells.map((date, i) => {
            if (!date) {
              return <div key={`pad-${i}`} />;
            }

            const dateStr = formatDate(date);
            const disabled = isSunday(date) || isPast(date);
            const isSelected = dateStr === selectedDate;
            const isToday = formatDate(today) === dateStr;

            return (
              <button
                key={dateStr}
                onClick={() => !disabled && onSelect(dateStr)}
                disabled={disabled}
                className={`
                  aspect-square rounded-xl text-sm font-medium transition-all
                  ${disabled ? "opacity-30 cursor-not-allowed text-gray-400" : "hover:scale-105"}
                  ${isSelected ? "text-white shadow-md" : ""}
                  ${isToday && !isSelected ? "ring-2 font-bold" : ""}
                  ${!disabled && !isSelected ? "hover:bg-[#f0f9f4] text-gray-700" : ""}
                `}
                style={{
                  backgroundColor: isSelected ? "#9dceb1" : undefined,
                  outline: isToday && !isSelected ? "2px solid #9dceb1" : undefined,
                }}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div className="mt-4 p-3 rounded-xl text-sm font-medium" style={{ backgroundColor: "#f0f9f4", color: "#3a8059" }}>
          Izabrani datum: {new Date(selectedDate + "T12:00:00").toLocaleDateString("sr-Latn-RS", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </div>
      )}

      <button
        onClick={onBack}
        className="mt-4 text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1"
      >
        ← Nazad
      </button>
    </div>
  );
}

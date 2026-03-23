"use client";

import { useState } from "react";
import { CalendarDays, List } from "lucide-react";
import BookingList from "@/components/admin/BookingList";
import BookingCalendar from "@/components/admin/BookingCalendar";

interface Staff {
  id: string;
  firstName: string;
  lastName: string;
}

export default function RezervacijeClient({ staff }: { staff: Staff[] }) {
  const [view, setView] = useState<"calendar" | "list">("calendar");

  return (
    <div>
      {/* View toggle */}
      <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setView("calendar")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            view === "calendar" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <CalendarDays className="w-3.5 h-3.5" />
          Kalendar
        </button>
        <button
          onClick={() => setView("list")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            view === "list" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <List className="w-3.5 h-3.5" />
          Lista
        </button>
      </div>

      {view === "calendar" ? (
        <BookingCalendar staff={staff} />
      ) : (
        <BookingList staff={staff} />
      )}
    </div>
  );
}

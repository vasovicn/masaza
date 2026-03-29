"use client";

import Link from "next/link";
import { CheckCircle, Calendar, Home, User } from "lucide-react";

interface BookingData {
  service: { name: string };
  duration: { minutes: number; price: number };
  date: string;
  time: string;
  endTime: string;
  contact: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  };
}

interface Props {
  booking: BookingData;
  isLoggedIn: boolean;
  onNewBooking: () => void;
}

export default function StepSuccess({ booking, isLoggedIn, onNewBooking }: Props) {
  const displayDate = new Date(booking.date + "T12:00:00").toLocaleDateString("sr-Latn-RS", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="text-center">
      {/* Success icon */}
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: "#f0f9f4" }}>
          <CheckCircle className="w-10 h-10" style={{ color: "#4da070" }} />
        </div>
      </div>

      <h2 className="text-3xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
        Rezervacija potvrđena!
      </h2>
      <p className="text-gray-500 mb-8">
        Vaš termin je uspešno zakazan. Vidimo se uskoro!
        {booking.contact.email && (
          <span className="block mt-1 text-sm">
            Potvrda je poslata na <span className="font-medium">{booking.contact.email}</span>
          </span>
        )}
      </p>

      {/* Booking details card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8 text-left shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4 text-center">Detalji termina</h3>
        <div className="space-y-3">
          {[
            { label: "Usluga", value: booking.service.name },
            { label: "Trajanje", value: `${booking.duration.minutes} min` },
            { label: "Cena", value: `${booking.duration.price.toLocaleString("sr-RS")} RSD` },
            { label: "Datum", value: displayDate },
            { label: "Vreme", value: `${booking.time} – ${booking.endTime}` },
            { label: "Ime", value: `${booking.contact.firstName} ${booking.contact.lastName}` },
            { label: "Telefon", value: booking.contact.phone },
          ].map((row) => (
            <div key={row.label} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-500">{row.label}:</span>
              <span className="text-sm font-semibold text-gray-900">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onNewBooking}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full border-2 border-gray-200 text-gray-700 font-semibold hover:border-[#9dceb1] hover:text-[#3a8059] transition-all text-sm"
        >
          <Calendar className="w-4 h-4" />
          Novi termin
        </button>
        {isLoggedIn && (
          <Link
            href="/moj-nalog"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full border-2 font-semibold transition-all text-sm"
            style={{ borderColor: "#9dceb1", color: "#3a8059" }}
          >
            <User className="w-4 h-4" />
            Moj nalog
          </Link>
        )}
        <Link
          href="/"
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-white font-semibold transition-all hover:opacity-90 text-sm"
          style={{ backgroundColor: "#5a9e78" }}
        >
          <Home className="w-4 h-4" />
          Početna
        </Link>
      </div>
    </div>
  );
}

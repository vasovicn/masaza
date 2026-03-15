"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, Clock, User, Phone, Loader, CheckCircle, XCircle } from "lucide-react";

interface Booking {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  customerName: string;
  customerPhone: string;
  service: { name: string };
  serviceDuration: { minutes: number; price: number };
  staffUser: { firstName: string; lastName: string };
}

interface Props {
  user: { id: string; email: string; firstName: string; lastName: string };
  upcomingBookings: Booking[];
  pastBookings: Booking[];
}

export default function ClientDashboard({ user, upcomingBookings, pastBookings }: Props) {
  const [upcoming, setUpcoming] = useState(upcomingBookings);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const handleCancel = async (id: string) => {
    if (!confirm("Da li zelite da otkazete ovu rezervaciju?")) return;
    setCancellingId(id);
    try {
      const res = await fetch(`/api/client/bookings/${id}/cancel`, { method: "POST" });
      if (res.ok) {
        setUpcoming((prev) => prev.filter((b) => b.id !== id));
      }
    } finally {
      setCancellingId(null);
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr + "T12:00:00").toLocaleDateString("sr-Latn-RS", {
      weekday: "short",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const statusColors: Record<string, string> = {
    confirmed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    completed: "bg-blue-100 text-blue-700",
  };

  const statusLabels: Record<string, string> = {
    confirmed: "Potvrdjena",
    cancelled: "Otkazana",
    completed: "Zavrsena",
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Welcome */}
      <div className="mb-8 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold" style={{ backgroundColor: "#9dceb1" }}>
          {user.firstName[0]}{user.lastName[0]}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            Dobrodosli, {user.firstName}!
          </h1>
          <p className="text-gray-500 text-sm">{user.email}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Predstojeciih", value: upcoming.length, icon: Calendar, color: "#9dceb1" },
          { label: "Ukupno", value: upcoming.length + pastBookings.length, icon: CheckCircle, color: "#4da070" },
          { label: "Proteklih", value: pastBookings.length, icon: Clock, color: "#6b7280" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
            <stat.icon className="w-6 h-6 mx-auto mb-2" style={{ color: stat.color }} />
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mb-8">
        <Link
          href="/zakazivanje"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold text-sm"
          style={{ backgroundColor: "#9dceb1" }}
        >
          <Calendar className="w-4 h-4" />
          Zakazi novi termin
        </Link>
      </div>

      {/* Upcoming bookings */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
          Predstojecihi termini
        </h2>
        {upcoming.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-2xl">
            <Calendar className="w-10 h-10 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">Nemate predstojeciih termina</p>
            <Link href="/zakazivanje" className="inline-block mt-3 text-sm font-medium" style={{ color: "#3a8059" }}>
              Zakazite termin →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.map((booking) => (
              <div key={booking.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-[#9dceb1] transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-gray-900 text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {booking.service.name}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[booking.status]}`}>
                        {statusLabels[booking.status]}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#9dceb1]" />
                        {formatDate(booking.date)}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#9dceb1]" />
                        {booking.startTime} – {booking.endTime}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#9dceb1]" />
                        {booking.staffUser.firstName} {booking.staffUser.lastName}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#9dceb1]" />
                        {booking.serviceDuration.price.toLocaleString("sr-RS")} RSD
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCancel(booking.id)}
                    disabled={cancellingId === booking.id}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-60 shrink-0"
                  >
                    {cancellingId === booking.id ? (
                      <Loader className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5" />
                    )}
                    Otkaži
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past bookings */}
      {pastBookings.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Istorija termina
          </h2>
          <div className="space-y-3">
            {pastBookings.slice(0, 10).map((booking) => (
              <div key={booking.id} className="bg-gray-50 rounded-2xl border border-gray-100 p-4 opacity-80">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-700">{booking.service.name}</div>
                    <div className="text-sm text-gray-500 mt-0.5">
                      {formatDate(booking.date)} · {booking.startTime} – {booking.endTime}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[booking.status] || "bg-gray-100 text-gray-600"}`}>
                      {statusLabels[booking.status] || booking.status}
                    </span>
                    <div className="text-sm text-gray-500 mt-1">
                      {booking.serviceDuration.price.toLocaleString("sr-RS")} RSD
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, Clock, Banknote, Loader, CheckCircle, XCircle, Save, Edit2 } from "lucide-react";

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
  user: { id: string; email: string; firstName: string; lastName: string; phone?: string };
  upcomingBookings: Booking[];
  pastBookings: Booking[];
}

export default function ClientDashboard({ user, upcomingBookings, pastBookings }: Props) {
  const [upcoming, setUpcoming] = useState(upcomingBookings);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone || "",
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState("");

  const handleProfileSave = async () => {
    if (!profileForm.firstName || !profileForm.lastName) {
      setProfileError("Ime i prezime su obavezni");
      return;
    }
    setProfileLoading(true);
    setProfileError("");
    setProfileSuccess(false);
    try {
      const res = await fetch("/api/client/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Greška");
      }
      setProfileSuccess(true);
      setEditing(false);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : "Greška");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    setCancellingId(id);
    setConfirmCancelId(null);
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
    confirmed: "Potvrđena",
    cancelled: "Otkazana",
    completed: "Završena",
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Welcome */}
      <div className="mb-8 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold" style={{ backgroundColor: "#5a9e78" }}>
          {user.firstName[0]}{user.lastName[0]}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            Dobro došli, {user.firstName}!
          </h1>
          <p className="text-gray-500 text-sm">{user.email}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Predstojeći", value: upcoming.length, icon: Calendar, color: "#9dceb1" },
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

      {/* Profile edit */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            Moji podaci
          </h2>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
              style={{ backgroundColor: "#f0f9f4", color: "#3a8059" }}
            >
              <Edit2 className="w-3.5 h-3.5" />
              Izmeni
            </button>
          )}
        </div>

        {profileSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-100 text-green-700 text-sm">
            Podaci su uspešno ažurirani.
          </div>
        )}
        {profileError && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">
            {profileError}
          </div>
        )}

        {editing ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Ime</label>
                <input
                  type="text"
                  value={profileForm.firstName}
                  onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9dceb1] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Prezime</label>
                <input
                  type="text"
                  value={profileForm.lastName}
                  onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9dceb1] text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Telefon</label>
              <input
                type="tel"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9dceb1] text-sm"
                placeholder="+381 ..."
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Email</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-3 py-2.5 rounded-xl border border-gray-100 bg-gray-50 text-sm text-gray-400"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleProfileSave}
                disabled={profileLoading}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm font-medium transition-all hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: "#5a9e78" }}
              >
                {profileLoading ? (
                  <Loader className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                Sačuvaj
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setProfileForm({ firstName: user.firstName, lastName: user.lastName, phone: user.phone || "" });
                  setProfileError("");
                }}
                className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Otkaži
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-xs text-gray-400">Ime</span>
              <div className="font-medium text-gray-900">{profileForm.firstName}</div>
            </div>
            <div>
              <span className="text-xs text-gray-400">Prezime</span>
              <div className="font-medium text-gray-900">{profileForm.lastName}</div>
            </div>
            <div>
              <span className="text-xs text-gray-400">Telefon</span>
              <div className="font-medium text-gray-900">{profileForm.phone || "—"}</div>
            </div>
            <div>
              <span className="text-xs text-gray-400">Email</span>
              <div className="font-medium text-gray-900">{user.email}</div>
            </div>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="mb-8">
        <Link
          href="/zakazivanje"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold text-sm"
          style={{ backgroundColor: "#5a9e78" }}
        >
          <Calendar className="w-4 h-4" />
          Zakaži novi termin
        </Link>
      </div>

      {/* Upcoming bookings */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
          Predstojeći termini
        </h2>
        {upcoming.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-2xl">
            <Calendar className="w-10 h-10 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">Nemate predstojećih termina</p>
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
                        <Banknote className="w-3.5 h-3.5 text-[#9dceb1]" />
                        {booking.serviceDuration.price.toLocaleString("sr-RS")} RSD
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#9dceb1]" />
                        {booking.startTime} – {booking.endTime}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setConfirmCancelId(booking.id)}
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
      {/* Cancel confirmation modal */}
      {confirmCancelId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setConfirmCancelId(null)} />
          <div className="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Otkazivanje termina</h3>
            <p className="text-sm text-gray-600 mb-5">
              Da li ste sigurni da želite da otkažete ovaj termin?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmCancelId(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Ne, zadrži
              </button>
              <button
                onClick={() => handleCancel(confirmCancelId)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
              >
                Da, otkaži
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

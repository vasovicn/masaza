"use client";

import { useState, useEffect } from "react";
import { Filter, X, Loader, Calendar } from "lucide-react";

interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  service: { id: string; name: string };
  serviceDuration: { minutes: number; price: number };
  staffUser: { id: string; firstName: string; lastName: string };
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  notes: string | null;
  createdAt: string;
}

interface Staff {
  id: string;
  firstName: string;
  lastName: string;
}

interface Props {
  staff: Staff[];
}

export default function BookingList({ staff }: Props) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    dateFrom: new Date().toISOString().split("T")[0],
    dateTo: "",
    status: "",
    staffId: "",
  });

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
      if (filters.dateTo) params.set("dateTo", filters.dateTo);
      if (filters.status) params.set("status", filters.status);
      if (filters.staffId) params.set("staffId", filters.staffId);

      const res = await fetch(`/api/admin/bookings?${params}`);
      const data = await res.json();
      setBookings(data.bookings || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCancel = async (id: string) => {
    if (!confirm("Otkazati ovu rezervaciju?")) return;
    setCancellingId(id);
    try {
      await fetch(`/api/admin/bookings/${id}`, { method: "DELETE" });
      fetchBookings();
    } finally {
      setCancellingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr + "T12:00:00").toLocaleDateString("sr-Latn-RS", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

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
    <div>
      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filteri</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Od datuma</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#9dceb1]"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Do datuma</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#9dceb1]"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Maser</label>
            <select
              value={filters.staffId}
              onChange={(e) => setFilters({ ...filters, staffId: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#9dceb1]"
            >
              <option value="">Svi maseri</option>
              {staff.map((s) => (
                <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#9dceb1]"
            >
              <option value="">Svi statusi</option>
              <option value="confirmed">Potvrdjena</option>
              <option value="cancelled">Otkazana</option>
              <option value="completed">Zavrsena</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <button
            onClick={fetchBookings}
            className="px-4 py-2 rounded-lg text-white text-sm font-medium"
            style={{ backgroundColor: "#9dceb1" }}
          >
            Primeni
          </button>
          <button
            onClick={() => {
              setFilters({ dateFrom: "", dateTo: "", status: "", staffId: "" });
            }}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Count */}
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-500">
          {loading ? "Ucitavanje..." : `${bookings.length} rezervacija`}
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 animate-spin" style={{ color: "#9dceb1" }} />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-medium text-gray-600">Datum i vreme</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Klijent</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Usluga</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Maser</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Cena</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Akcije</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{formatDate(booking.date)}</div>
                    <div className="text-xs text-gray-500">{booking.startTime} – {booking.endTime}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{booking.customerName}</div>
                    <div className="text-xs text-gray-500">{booking.customerPhone}</div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="text-gray-900">{booking.service.name}</div>
                    <div className="text-xs text-gray-500">{booking.serviceDuration.minutes} min</div>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-gray-600">
                    {booking.staffUser.firstName} {booking.staffUser.lastName}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-gray-900 font-medium">
                    {booking.serviceDuration.price.toLocaleString("sr-RS")} RSD
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[booking.status] || "bg-gray-100 text-gray-700"}`}>
                      {statusLabels[booking.status] || booking.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {booking.status === "confirmed" && (
                      <button
                        onClick={() => handleCancel(booking.id)}
                        disabled={cancellingId === booking.id}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-60"
                      >
                        {cancellingId === booking.id ? (
                          <Loader className="w-3 h-3 animate-spin" />
                        ) : (
                          "Otkaži"
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                    Nema rezervacija za izabrane filtere.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

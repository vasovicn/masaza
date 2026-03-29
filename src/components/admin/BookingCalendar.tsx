"use client";

import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, Loader, X, Plus, Save } from "lucide-react";

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
}

interface Staff {
  id: string;
  firstName: string;
  lastName: string;
}

interface ServiceOption {
  id: string;
  name: string;
  durations: { id: string; minutes: number; price: number }[];
}

interface Props {
  staff: Staff[];
}

const HOUR_START = 8;
const HOUR_END = 22;
const TOTAL_HOURS = HOUR_END - HOUR_START; // 14 hours

const DAY_NAMES = ["Ned", "Pon", "Uto", "Sre", "Čet", "Pet", "Sub"];
const MONTH_NAMES = [
  "januar", "februar", "mart", "april", "maj", "jun",
  "jul", "avgust", "septembar", "oktobar", "novembar", "decembar",
];

function formatDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getWeekDates(centerDate: Date): Date[] {
  const dates: Date[] = [];
  for (let i = -3; i <= 3; i++) {
    const d = new Date(centerDate);
    d.setDate(d.getDate() + i);
    dates.push(d);
  }
  return dates;
}

const STAFF_COLORS = [
  { bg: "#dcfce7", border: "#4ade80", text: "#166534" },
  { bg: "#dbeafe", border: "#60a5fa", text: "#1e3a8a" },
  { bg: "#fce7f3", border: "#f472b6", text: "#831843" },
  { bg: "#fef3c7", border: "#fbbf24", text: "#78350f" },
  { bg: "#e0e7ff", border: "#818cf8", text: "#312e81" },
  { bg: "#ccfbf1", border: "#2dd4bf", text: "#134e4a" },
];

export default function BookingCalendar({ staff }: Props) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  // Create booking state
  const [createModal, setCreateModal] = useState<{ staffId: string; time: string } | null>(null);
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [createForm, setCreateForm] = useState({
    serviceId: "",
    serviceDurationId: "",
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    notes: "",
  });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const dateStr = formatDateStr(selectedDate);
  const weekDates = useMemo(() => getWeekDates(selectedDate), [selectedDate]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ date: dateStr });
      const res = await fetch(`/api/admin/bookings?${params}`);
      const data = await res.json();
      setBookings((data.bookings || []).filter((b: Booking) => b.status !== "cancelled"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateStr]);

  // Fetch services when create modal opens
  useEffect(() => {
    if (createModal && services.length === 0) {
      fetch("/api/admin/services")
        .then((r) => r.json())
        .then((data) => {
          const svc = (data.services || [])
            .filter((s: { active: boolean }) => s.active)
            .map((s: { id: string; name: string; durations: { id: string; minutes: number; price: number }[] }) => ({
              id: s.id,
              name: s.name,
              durations: s.durations,
            }));
          setServices(svc);
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createModal]);

  const handleCancel = async (id: string) => {
    if (!confirm("Otkazati ovu rezervaciju?")) return;
    setCancellingId(id);
    try {
      await fetch(`/api/admin/bookings/${id}`, { method: "DELETE" });
      setSelectedBooking(null);
      fetchBookings();
    } finally {
      setCancellingId(null);
    }
  };

  const handleConfirmInquiry = async (id: string) => {
    setConfirmingId(id);
    try {
      await fetch(`/api/admin/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "confirmed" }),
      });
      setSelectedBooking(null);
      fetchBookings();
    } finally {
      setConfirmingId(null);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createModal) return;
    setCreating(true);
    setCreateError("");

    try {
      const res = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...createForm,
          date: dateStr,
          startTime: createModal.time,
          staffUserId: createModal.staffId,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Greška");
      }
      setCreateModal(null);
      setCreateForm({ serviceId: "", serviceDurationId: "", customerName: "", customerPhone: "", customerEmail: "", notes: "" });
      fetchBookings();
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Greška");
    } finally {
      setCreating(false);
    }
  };

  const handleSlotClick = (staffId: string, slotIndex: number) => {
    const totalMin = slotIndex * 30;
    const h = HOUR_START + Math.floor(totalMin / 60);
    const m = totalMin % 60;
    const time = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    setCreateModal({ staffId, time });
    setCreateForm({ serviceId: "", serviceDurationId: "", customerName: "", customerPhone: "", customerEmail: "", notes: "" });
    setCreateError("");
  };

  const goDay = (offset: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + offset);
    setSelectedDate(d);
  };

  const goToday = () => setSelectedDate(new Date());

  const slotCount = TOTAL_HOURS * 2; // 28 slots of 30min

  // Group bookings by staff
  const bookingsByStaff = useMemo(() => {
    const map: Record<string, Booking[]> = {};
    staff.forEach((s) => {
      map[s.id] = bookings.filter((b) => b.staffUser.id === s.id);
    });
    return map;
  }, [bookings, staff]);

  // Position as percentage of total height
  const getBookingStyle = (booking: Booking) => {
    const [sh, sm] = booking.startTime.split(":").map(Number);
    const [eh, em] = booking.endTime.split(":").map(Number);
    const startMin = (sh - HOUR_START) * 60 + sm;
    const endMin = (eh - HOUR_START) * 60 + em;
    const totalMin = TOTAL_HOURS * 60;
    const topPct = (startMin / totalMin) * 100;
    const heightPct = ((endMin - startMin) / totalMin) * 100;
    return { top: `${topPct}%`, height: `calc(${heightPct}% - 1px)` };
  };

  const todayStr = formatDateStr(new Date());
  const isToday = dateStr === todayStr;

  // Current time indicator
  const now = new Date();
  const currentMin = (now.getHours() - HOUR_START) * 60 + now.getMinutes();
  const showNowLine = isToday && currentMin >= 0 && currentMin < TOTAL_HOURS * 60;
  const nowPct = (currentMin / (TOTAL_HOURS * 60)) * 100;

  const selectedService = services.find((s) => s.id === createForm.serviceId);

  return (
    <div>
      {/* Date carousel */}
      <div className="bg-white rounded-xl border border-gray-100 p-3 mb-3">
        <div className="flex items-center justify-between mb-2">
          <button onClick={() => goDay(-7)} className="p-1 rounded-lg hover:bg-gray-100 text-gray-500">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-semibold text-gray-900 capitalize">
            {MONTH_NAMES[selectedDate.getMonth()]} {selectedDate.getFullYear()}
          </span>
          <button onClick={() => goDay(7)} className="p-1 rounded-lg hover:bg-gray-100 text-gray-500">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-0.5">
          <button onClick={() => goDay(-1)} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 shrink-0">
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <div className="flex-1 grid grid-cols-7 gap-0.5">
            {weekDates.map((d) => {
              const ds = formatDateStr(d);
              const sel = ds === dateStr;
              const tdy = ds === todayStr;
              return (
                <button
                  key={ds}
                  onClick={() => setSelectedDate(new Date(d))}
                  className={`flex flex-col items-center py-1.5 rounded-lg text-xs transition-all ${
                    sel ? "text-white font-bold" : tdy ? "bg-green-50 text-green-700 font-medium" : "hover:bg-gray-50 text-gray-600"
                  }`}
                  style={sel ? { backgroundColor: "#5a9e78" } : {}}
                >
                  <span className="text-[9px] uppercase">{DAY_NAMES[d.getDay()]}</span>
                  <span className="text-base leading-tight">{d.getDate()}</span>
                </button>
              );
            })}
          </div>
          <button onClick={() => goDay(1)} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 shrink-0">
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {!isToday && (
          <div className="text-center mt-1">
            <button onClick={goToday} className="text-xs font-medium px-2 py-0.5 rounded-full hover:bg-green-50" style={{ color: "#3a8059" }}>
              Danas
            </button>
          </div>
        )}
      </div>

      {/* Calendar grid - fits viewport */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader className="w-8 h-8 animate-spin" style={{ color: "#9dceb1" }} />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden flex flex-col" style={{ height: "calc(100vh - 280px)", minHeight: 400 }}>
          {/* Staff header */}
          <div className="flex border-b border-gray-100 shrink-0">
            <div className="w-10 shrink-0 border-r border-gray-100" />
            {staff.map((s, i) => {
              const color = STAFF_COLORS[i % STAFF_COLORS.length];
              const cnt = (bookingsByStaff[s.id] || []).length;
              return (
                <div key={s.id} className="flex-1 min-w-[100px] px-1 py-2 text-center border-r border-gray-100 last:border-r-0">
                  <div className="font-semibold text-xs text-gray-900">{s.firstName}</div>
                  <div className="text-[9px] text-gray-400">{cnt} {cnt === 1 ? "termin" : "termina"}</div>
                  <div className="w-full h-0.5 rounded-full mt-1" style={{ backgroundColor: color.border }} />
                </div>
              );
            })}
          </div>

          {/* Grid body - stretches to fill */}
          <div className="flex flex-1 overflow-hidden py-2">
            {/* Time labels */}
            <div className="w-10 shrink-0 border-r border-gray-100 relative">
              {Array.from({ length: TOTAL_HOURS + 1 }, (_, i) => {
                const h = HOUR_START + i;
                const pct = (i / TOTAL_HOURS) * 100;
                return (
                  <div key={h} className="absolute w-full text-right pr-1 text-[9px] text-gray-400 -translate-y-1/2" style={{ top: `${pct}%` }}>
                    {`${h}:00`}
                  </div>
                );
              })}
            </div>

            {/* Staff columns */}
            {staff.map((s, staffIdx) => {
              const color = STAFF_COLORS[staffIdx % STAFF_COLORS.length];
              const staffBookings = bookingsByStaff[s.id] || [];
              return (
                <div key={s.id} className="flex-1 min-w-[100px] relative border-r border-gray-100 last:border-r-0">
                  {/* Hour grid lines */}
                  {Array.from({ length: TOTAL_HOURS }, (_, i) => {
                    const pct = (i / TOTAL_HOURS) * 100;
                    const halfPct = ((i + 0.5) / TOTAL_HOURS) * 100;
                    return (
                      <div key={i}>
                        <div className="absolute w-full border-t border-gray-100" style={{ top: `${pct}%` }} />
                        <div className="absolute w-full border-t border-gray-50" style={{ top: `${halfPct}%` }} />
                      </div>
                    );
                  })}

                  {/* Clickable slot areas */}
                  {Array.from({ length: slotCount }, (_, i) => {
                    const pct = (i / slotCount) * 100;
                    const hPct = (1 / slotCount) * 100;
                    return (
                      <div
                        key={i}
                        className="absolute w-full cursor-pointer hover:bg-green-50/50 transition-colors group"
                        style={{ top: `${pct}%`, height: `${hPct}%` }}
                        onClick={() => handleSlotClick(s.id, i)}
                      >
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Plus className="w-3 h-3 text-green-400" />
                        </div>
                      </div>
                    );
                  })}

                  {/* Bookings */}
                  {staffBookings.map((booking) => {
                    const style = getBookingStyle(booking);
                    const isInquiry = booking.status === "inquiry";
                    const bookingColor = isInquiry
                      ? { bg: "#f3f4f6", border: "#9ca3af", text: "#4b5563" }
                      : color;
                    return (
                      <div
                        key={booking.id}
                        onClick={(e) => { e.stopPropagation(); setSelectedBooking(booking); }}
                        className="absolute left-0.5 right-0.5 rounded px-1 py-0.5 cursor-pointer overflow-hidden hover:opacity-90 transition-opacity"
                        style={{
                          ...style,
                          backgroundColor: bookingColor.bg,
                          borderLeft: `2px solid ${bookingColor.border}`,
                          borderStyle: isInquiry ? "dashed" : "solid",
                          zIndex: 5,
                        }}
                      >
                        <div className="text-[10px] font-semibold truncate leading-tight" style={{ color: bookingColor.text }}>
                          {isInquiry && <span className="text-[8px] font-normal">[UPIT] </span>}
                          {booking.customerName}
                        </div>
                        <div className="text-[9px] truncate leading-tight" style={{ color: bookingColor.text, opacity: 0.8 }}>
                          {booking.service.name}
                        </div>
                        <div className="text-[8px] leading-tight" style={{ color: bookingColor.text, opacity: 0.7 }}>
                          {booking.startTime}–{booking.endTime}
                        </div>
                      </div>
                    );
                  })}

                  {/* Now indicator */}
                  {showNowLine && (
                    <div className="absolute left-0 right-0 z-10 pointer-events-none" style={{ top: `${nowPct}%` }}>
                      <div className="h-0.5 bg-red-400 relative">
                        <div className="absolute -left-1 -top-1 w-2 h-2 rounded-full bg-red-400" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Booking detail modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedBooking(null)} />
          <div className="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl max-h-[90vh] overflow-y-auto">
            <button onClick={() => setSelectedBooking(null)} className="absolute top-3 right-3 p-1 rounded-lg hover:bg-gray-100 text-gray-400">
              <X className="w-4 h-4" />
            </button>
            <h3 className="font-bold text-gray-900 text-lg mb-4">
              {selectedBooking.status === "inquiry" ? "Detalji upita" : "Detalji rezervacije"}
            </h3>
            {selectedBooking.status === "inquiry" && (
              <div className="mb-4 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">
                Upit — čeka potvrdu
              </div>
            )}
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Klijent</span><span className="font-medium text-gray-900">{selectedBooking.customerName}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Telefon</span><span className="font-medium text-gray-900">{selectedBooking.customerPhone}</span></div>
              {selectedBooking.customerEmail && <div className="flex justify-between"><span className="text-gray-500">Email</span><span className="font-medium text-gray-900 text-right">{selectedBooking.customerEmail}</span></div>}
              <div className="flex justify-between"><span className="text-gray-500">Usluga</span><span className="font-medium text-gray-900">{selectedBooking.service.name}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Vreme</span><span className="font-medium text-gray-900">{selectedBooking.startTime} – {selectedBooking.endTime}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Trajanje</span><span className="font-medium text-gray-900">{selectedBooking.serviceDuration.minutes} min</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Cena</span><span className="font-medium text-gray-900">{selectedBooking.serviceDuration.price.toLocaleString("sr-RS")} RSD</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Maser</span><span className="font-medium text-gray-900">{selectedBooking.staffUser.firstName} {selectedBooking.staffUser.lastName}</span></div>
              {selectedBooking.notes && <div><span className="text-gray-500 block mb-1">Napomena</span><p className="text-gray-900 bg-gray-50 rounded-lg p-2 text-xs">{selectedBooking.notes}</p></div>}
            </div>
            {selectedBooking.status === "inquiry" && (
              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => handleConfirmInquiry(selectedBooking.id)}
                  disabled={confirmingId === selectedBooking.id}
                  className="flex-1 py-2.5 rounded-xl text-white text-sm font-medium hover:opacity-90 transition-colors disabled:opacity-60"
                  style={{ backgroundColor: "#5a9e78" }}
                >
                  {confirmingId === selectedBooking.id ? <Loader className="w-4 h-4 animate-spin mx-auto" /> : "Potvrdi termin"}
                </button>
                <button
                  onClick={() => handleCancel(selectedBooking.id)}
                  disabled={cancellingId === selectedBooking.id}
                  className="flex-1 py-2.5 rounded-xl bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-60"
                >
                  {cancellingId === selectedBooking.id ? <Loader className="w-4 h-4 animate-spin mx-auto" /> : "Odbij"}
                </button>
              </div>
            )}
            {selectedBooking.status === "confirmed" && (
              <button onClick={() => handleCancel(selectedBooking.id)} disabled={cancellingId === selectedBooking.id} className="mt-5 w-full py-2.5 rounded-xl bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-60">
                {cancellingId === selectedBooking.id ? <Loader className="w-4 h-4 animate-spin mx-auto" /> : "Otkaži rezervaciju"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Create booking modal */}
      {createModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setCreateModal(null)} />
          <div className="relative bg-white rounded-2xl p-6 max-w-md w-full shadow-xl max-h-[90vh] overflow-y-auto">
            <button onClick={() => setCreateModal(null)} className="absolute top-3 right-3 p-1 rounded-lg hover:bg-gray-100 text-gray-400">
              <X className="w-4 h-4" />
            </button>
            <h3 className="font-bold text-gray-900 text-lg mb-1">Nova rezervacija</h3>
            <p className="text-sm text-gray-500 mb-4">
              {staff.find((s) => s.id === createModal.staffId)?.firstName} · {createModal.time} · {new Date(dateStr + "T12:00:00").toLocaleDateString("sr-Latn-RS")}
            </p>

            {createError && <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{createError}</div>}

            <form onSubmit={handleCreate} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Ime i prezime *</label>
                  <input
                    required
                    value={createForm.customerName}
                    onChange={(e) => setCreateForm({ ...createForm, customerName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#9dceb1]"
                    placeholder="Ime Prezime"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Telefon *</label>
                  <input
                    required
                    value={createForm.customerPhone}
                    onChange={(e) => setCreateForm({ ...createForm, customerPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#9dceb1]"
                    placeholder="06x..."
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Email</label>
                <input
                  type="email"
                  value={createForm.customerEmail}
                  onChange={(e) => setCreateForm({ ...createForm, customerEmail: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#9dceb1]"
                  placeholder="email@..."
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Usluga *</label>
                <select
                  required
                  value={createForm.serviceId}
                  onChange={(e) => setCreateForm({ ...createForm, serviceId: e.target.value, serviceDurationId: "" })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#9dceb1]"
                >
                  <option value="">Izaberi uslugu...</option>
                  {services.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              {selectedService && selectedService.durations.length > 0 && (
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Trajanje *</label>
                  <select
                    required
                    value={createForm.serviceDurationId}
                    onChange={(e) => setCreateForm({ ...createForm, serviceDurationId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#9dceb1]"
                  >
                    <option value="">Izaberi trajanje...</option>
                    {selectedService.durations.map((d) => (
                      <option key={d.id} value={d.id}>{d.minutes} min — {d.price.toLocaleString("sr-RS")} RSD</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Napomena</label>
                <input
                  value={createForm.notes}
                  onChange={(e) => setCreateForm({ ...createForm, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#9dceb1]"
                  placeholder="Opciono..."
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setCreateModal(null)} className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">
                  Otkaži
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-60"
                  style={{ backgroundColor: "#5a9e78" }}
                >
                  {creating ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Zakaži
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

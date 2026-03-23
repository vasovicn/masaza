"use client";

import { useState } from "react";
import {
  Search,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  Edit2,
  Save,
  X,
  ShieldCheck,
  ShieldOff,
  UserCog,
} from "lucide-react";

interface ClientUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  emailVerified: boolean;
  googleId: string | null;
  createdAt: string | Date;
  _count: { bookings: number };
}

export default function KorisniciClient({ initialClients }: { initialClients: ClientUser[] }) {
  const [clients, setClients] = useState(initialClients);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ firstName: "", lastName: "", phone: "" });
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const filtered = clients.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.firstName.toLowerCase().includes(q) ||
      c.lastName.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.phone && c.phone.includes(q))
    );
  });

  const startEdit = (client: ClientUser) => {
    setEditingId(client.id);
    setEditForm({
      firstName: client.firstName,
      lastName: client.lastName,
      phone: client.phone || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ firstName: "", lastName: "", phone: "" });
  };

  const saveEdit = async (id: string) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/clients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error();
      const { client } = await res.json();
      setClients((prev) => prev.map((c) => (c.id === id ? client : c)));
      setEditingId(null);
    } catch {
      alert("Greška pri čuvanju");
    } finally {
      setSaving(false);
    }
  };

  const toggleVerified = async (client: ClientUser) => {
    const newStatus = !client.emailVerified;
    const action = newStatus ? "aktivirati" : "deaktivirati";
    if (!confirm(`Da li ste sigurni da želite da ${action} korisnika ${client.firstName} ${client.lastName}?`)) return;

    setTogglingId(client.id);
    try {
      const res = await fetch(`/api/admin/clients/${client.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailVerified: newStatus }),
      });
      if (!res.ok) throw new Error();
      const { client: updated } = await res.json();
      setClients((prev) => prev.map((c) => (c.id === client.id ? updated : c)));
    } catch {
      alert("Greška");
    } finally {
      setTogglingId(null);
    }
  };

  const formatDate = (d: string | Date) => {
    return new Date(d).toLocaleDateString("sr-RS", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div>
      {/* Search */}
      <div className="mb-4 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pretraži po imenu, emailu, telefonu..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9dceb1] text-sm"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
          <p className="text-sm text-gray-500">Ukupno korisnika</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-2xl font-bold" style={{ color: "#3a8059" }}>
            {clients.filter((c) => c.emailVerified).length}
          </p>
          <p className="text-sm text-gray-500">Aktivnih</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-2xl font-bold text-gray-400">
            {clients.filter((c) => c.googleId).length}
          </p>
          <p className="text-sm text-gray-500">Google nalozi</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Korisnik</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Kontakt</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase">Rezervacije</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Registracija</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase">Akcije</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((client) => (
                <tr key={client.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  {/* User info */}
                  <td className="py-3 px-4">
                    {editingId === client.id ? (
                      <div className="flex gap-2">
                        <input
                          value={editForm.firstName}
                          onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                          className="w-24 px-2 py-1 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#9dceb1]"
                          placeholder="Ime"
                        />
                        <input
                          value={editForm.lastName}
                          onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                          className="w-24 px-2 py-1 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#9dceb1]"
                          placeholder="Prezime"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ backgroundColor: "#5a9e78" }}>
                          {client.firstName[0]}{client.lastName[0]}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{client.firstName} {client.lastName}</p>
                          {client.googleId && <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-medium">Google</span>}
                        </div>
                      </div>
                    )}
                  </td>

                  {/* Contact */}
                  <td className="py-3 px-4">
                    {editingId === client.id ? (
                      <input
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        className="w-32 px-2 py-1 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#9dceb1]"
                        placeholder="Telefon"
                      />
                    ) : (
                      <div className="space-y-0.5">
                        <p className="text-sm text-gray-600 flex items-center gap-1.5">
                          <Mail className="w-3 h-3 text-gray-400" />
                          {client.email}
                        </p>
                        {client.phone && (
                          <p className="text-sm text-gray-500 flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-gray-400" />
                            {client.phone}
                          </p>
                        )}
                      </div>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4 text-center">
                    {client.emailVerified ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-green-50 text-green-700">
                        <CheckCircle className="w-3 h-3" />
                        Aktivan
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-red-50 text-red-600">
                        <XCircle className="w-3 h-3" />
                        Neaktivan
                      </span>
                    )}
                  </td>

                  {/* Bookings */}
                  <td className="py-3 px-4 text-center">
                    <span className="text-sm font-medium text-gray-700">{client._count.bookings}</span>
                  </td>

                  {/* Date */}
                  <td className="py-3 px-4">
                    <p className="text-sm text-gray-500 flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      {formatDate(client.createdAt)}
                    </p>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-1">
                      {editingId === client.id ? (
                        <>
                          <button
                            onClick={() => saveEdit(client.id)}
                            disabled={saving}
                            className="p-1.5 rounded-lg text-white transition-colors disabled:opacity-60"
                            style={{ backgroundColor: "#5a9e78" }}
                            title="Sačuvaj"
                          >
                            <Save className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                            title="Otkaži"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(client)}
                            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                            title="Izmeni podatke"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => toggleVerified(client)}
                            disabled={togglingId === client.id}
                            className={`p-1.5 rounded-lg transition-colors disabled:opacity-60 ${
                              client.emailVerified
                                ? "text-red-500 hover:bg-red-50"
                                : "text-green-600 hover:bg-green-50"
                            }`}
                            title={client.emailVerified ? "Deaktiviraj" : "Aktiviraj"}
                          >
                            {client.emailVerified ? (
                              <ShieldOff className="w-3.5 h-3.5" />
                            ) : (
                              <ShieldCheck className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <UserCog className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-400 text-sm">
                      {search ? "Nema rezultata pretrage" : "Nema registrovanih korisnika"}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Plus, Pencil, ToggleLeft, ToggleRight, Loader } from "lucide-react";
import StaffForm from "./StaffForm";

interface Staff {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: string;
  isAdmin: boolean;
  bio: string | null;
  image: string | null;
  active: boolean;
  sequence: number;
}

interface Props {
  staff: Staff[];
  onRefresh: () => void;
}

export default function StaffList({ staff, onRefresh }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Staff | null>(null);
  const [loading, setLoading] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleSave = async (data: Partial<Staff & { password: string }>) => {
    setLoading(true);
    try {
      const url = editing ? `/api/admin/staff/${editing.id}` : "/api/admin/staff";
      const method = editing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Greška");
      }

      setShowForm(false);
      setEditing(null);
      onRefresh();
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (member: Staff) => {
    setTogglingId(member.id);
    try {
      await fetch(`/api/admin/staff/${member.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !member.active }),
      });
      onRefresh();
    } finally {
      setTogglingId(null);
    }
  };

  if (showForm || editing) {
    return (
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-6">
          {editing ? "Uredi masera" : "Novi maser"}
        </h2>
        <StaffForm
          initial={editing ? {
            email: editing.email,
            firstName: editing.firstName,
            lastName: editing.lastName,
            phone: editing.phone || "",
            role: editing.role,
            bio: editing.bio || "",
            image: editing.image || "",
            sequence: editing.sequence,
            active: editing.active,
            isAdmin: editing.isAdmin,
          } : undefined}
          isNew={!editing}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditing(null); }}
          loading={loading}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">Osoblje ({staff.length})</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium transition-all hover:opacity-90"
          style={{ backgroundColor: "#5a9e78" }}
        >
          <Plus className="w-4 h-4" />
          Novi maser
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-4 py-3 font-medium text-gray-600">Ime i prezime</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Email</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Uloga</th>
              <th className="text-center px-4 py-3 font-medium text-gray-600">Admin</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Telefon</th>
              <th className="text-center px-4 py-3 font-medium text-gray-600 hidden sm:table-cell" title="Redosled dodeljivanja rezervacija">Redosled</th>
              <th className="text-center px-4 py-3 font-medium text-gray-600">Status</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Akcije</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((member) => (
              <tr key={member.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ backgroundColor: "#5a9e78" }}>
                      {member.firstName[0]}{member.lastName[0]}
                    </div>
                    <span className="font-medium text-gray-900">{member.firstName} {member.lastName}</span>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-gray-600">{member.email}</td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${member.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                    {member.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${member.isAdmin ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}>
                    {member.isAdmin ? "Da" : "Ne"}
                  </span>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell text-gray-600">{member.phone || "-"}</td>
                <td className="px-4 py-3 text-center hidden sm:table-cell">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold text-white" style={{ backgroundColor: "#5a9e78" }}>
                    {member.sequence}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleToggle(member)}
                    disabled={togglingId === member.id}
                  >
                    {togglingId === member.id ? (
                      <Loader className="w-4 h-4 animate-spin text-gray-400" />
                    ) : member.active ? (
                      <ToggleRight className="w-5 h-5" style={{ color: "#9dceb1" }} />
                    ) : (
                      <ToggleLeft className="w-5 h-5 text-gray-300" />
                    )}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => setEditing(member)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Uredi
                  </button>
                </td>
              </tr>
            ))}
            {staff.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                  Nema članova osoblja.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

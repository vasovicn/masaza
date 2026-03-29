"use client";

import { useState } from "react";
import { Send } from "lucide-react";

interface ContactInfo {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  notes: string;
}

interface Props {
  onSubmit: (contact: ContactInfo) => Promise<void>;
  onBack: () => void;
  loading: boolean;
  prefill?: { firstName?: string; lastName?: string; email?: string; phone?: string };
  isInquiry?: boolean;
}

export default function StepContact({ onSubmit, onBack, loading, prefill, isInquiry }: Props) {
  const [form, setForm] = useState<ContactInfo>({
    firstName: prefill?.firstName || "",
    lastName: prefill?.lastName || "",
    phone: prefill?.phone || "",
    email: prefill?.email || "",
    notes: "",
  });
  const [errors, setErrors] = useState<Partial<ContactInfo>>({});

  const validate = () => {
    const e: Partial<ContactInfo> = {};
    if (!form.firstName.trim()) e.firstName = "Ime je obavezno";
    if (!form.lastName.trim()) e.lastName = "Prezime je obavezno";
    if (!form.phone.trim()) e.phone = "Telefon je obavezan";
    else if (!/^[+\d\s\-()]{7,}$/.test(form.phone)) e.phone = "Unesite ispravan broj telefona";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Unesite ispravan email";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(form);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
        Vaši podaci
      </h2>
      <p className="text-gray-500 mb-6">Unesite kontakt informacije za potvrdu rezervacije</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Ime <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#9dceb1] ${
                errors.firstName ? "border-red-300" : "border-gray-200"
              }`}
              placeholder="Vaše ime"
            />
            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Prezime <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#9dceb1] ${
                errors.lastName ? "border-red-300" : "border-gray-200"
              }`}
              placeholder="Vaše prezime"
            />
            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Telefon <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#9dceb1] ${
              errors.phone ? "border-red-300" : "border-gray-200"
            }`}
            placeholder="+381 ..."
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Email <span className="text-gray-400 text-xs">(opciono)</span>
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#9dceb1] ${
              errors.email ? "border-red-300" : "border-gray-200"
            }`}
            placeholder="vasa@email.com (za potvrdu)"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Napomena <span className="text-gray-400 text-xs">(opciono)</span>
          </label>
          <textarea
            rows={3}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#9dceb1] resize-none"
            placeholder="Eventualne napomene ili posebni zahtevi..."
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 py-3 rounded-full border-2 border-gray-200 text-gray-600 font-semibold hover:border-gray-300 transition-colors text-sm"
          >
            Nazad
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-2 flex items-center justify-center gap-2 px-8 py-3 rounded-full text-white font-semibold transition-all hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: "#5a9e78", flex: 2 }}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                {isInquiry ? "Pošalji upit" : "Potvrdi rezervaciju"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

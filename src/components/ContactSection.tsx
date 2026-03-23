"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { SALON_PHONE, SALON_EMAIL, SALON_ADDRESS } from "@/lib/constants";

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Greska pri slanju poruke");
      }

      setSuccess(true);
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Greska pri slanju poruke");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left - Contact info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="font-bold text-gray-900 text-lg mb-5">Kontakt informacije</h3>
              <div className="space-y-4">
                <a href={`tel:${SALON_PHONE}`} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#f0f9f4" }}>
                    <Phone className="w-5 h-5" style={{ color: "#4da070" }} />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Telefon</div>
                    <div className="font-semibold text-gray-900 group-hover:text-[#3a8059] transition-colors">{SALON_PHONE}</div>
                  </div>
                </a>
                <a href={`mailto:${SALON_EMAIL}`} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#f0f9f4" }}>
                    <Mail className="w-5 h-5" style={{ color: "#4da070" }} />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Email</div>
                    <div className="font-semibold text-gray-900 group-hover:text-[#3a8059] transition-colors">{SALON_EMAIL}</div>
                  </div>
                </a>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#f0f9f4" }}>
                    <MapPin className="w-5 h-5" style={{ color: "#4da070" }} />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Adresa</div>
                    <div className="font-semibold text-gray-900">{SALON_ADDRESS}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#f0f9f4" }}>
                  <Clock className="w-5 h-5" style={{ color: "#4da070" }} />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Radno vreme</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ponedeljak – Subota</span>
                  <span className="font-semibold text-gray-900">08:00 – 22:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Nedelja</span>
                  <span className="text-gray-400">Zatvoreno</span>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="rounded-2xl overflow-hidden h-48 bg-gray-200 relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2831.5!2d20.3708!3d44.8048!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x475a6f21c3e738a5%3A0x1!2sLaze%20Jovanovi%C4%87a%20Porcija%207a%2C%20Belgrade%2011080!5e0!3m2!1sen!2srs!4v1699900000000!5m2!1sen!2srs"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Right - Form */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100">
            {success ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: "#f0f9f4" }}>
                  <CheckCircle className="w-8 h-8" style={{ color: "#4da070" }} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Poruka je poslata!</h3>
                <p className="text-gray-600 mb-6">Odgovoriti cemo vam u najkracem mogucem roku.</p>
                <button
                  onClick={() => setSuccess(false)}
                  className="px-6 py-2.5 rounded-full text-white text-sm font-medium"
                  style={{ backgroundColor: "#5a9e78" }}
                >
                  Posalji novu poruku
                </button>
              </div>
            ) : (
              <>
                <h3 className="font-bold text-gray-900 text-xl mb-6">Posaljite nam poruku</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Vase ime <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9dceb1] focus:border-transparent text-sm"
                      placeholder="Ime i prezime"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9dceb1] focus:border-transparent text-sm"
                      placeholder="vasa@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9dceb1] focus:border-transparent text-sm"
                      placeholder="+381 ..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Poruka <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9dceb1] focus:border-transparent text-sm resize-none"
                      placeholder="Vasa poruka..."
                    />
                  </div>

                  {error && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-full text-white font-semibold transition-all hover:opacity-90 disabled:opacity-60"
                    style={{ backgroundColor: "#5a9e78" }}
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Posalji poruku
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

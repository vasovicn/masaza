"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";

export default function ZaboravljenaLozinkaPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Greška");

      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Greška");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12" style={{ background: "linear-gradient(135deg, #f0f9f4, white)" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Zaboravljena lozinka</h1>
          <p className="text-gray-500 mt-1">Unesite email da biste resetovali lozinku</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          {sent ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#f0f9f4" }}>
                <Mail className="w-8 h-8" style={{ color: "#4da070" }} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Proverite vaš email</h2>
              <p className="text-gray-600 text-sm mb-4">
                Ako nalog sa ovim emailom postoji, poslali smo vam link za resetovanje lozinke. Link važi 1 sat.
              </p>
              <p className="text-xs text-gray-400">
                Ako ne vidite email, proverite spam folder.
              </p>
              <Link href="/login" className="inline-block mt-6 text-sm font-semibold" style={{ color: "#3a8059" }}>
                Nazad na prijavu →
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9dceb1] text-sm"
                    placeholder="vasa@email.com"
                  />
                </div>

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
                      <Mail className="w-4 h-4" />
                      Pošalji link za resetovanje
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-sm text-gray-500 mt-6">
                Setili ste se lozinke?{" "}
                <Link href="/login" className="font-semibold hover:underline" style={{ color: "#3a8059" }}>
                  Prijavite se
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

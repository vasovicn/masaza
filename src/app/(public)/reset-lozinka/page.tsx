"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, KeyRound, CheckCircle } from "lucide-react";
import { Suspense } from "react";

function ResetForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Lozinka mora imati najmanje 6 karaktera");
      return;
    }

    if (password !== confirmPassword) {
      setError("Lozinke se ne poklapaju");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Greška pri resetovanju lozinke");

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Greška pri resetovanju lozinke");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center py-6">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-red-50">
          <KeyRound className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Nevažeći link</h2>
        <p className="text-gray-600 text-sm mb-4">
          Link za resetovanje lozinke nije validan. Pokušajte ponovo.
        </p>
        <Link href="/zaboravljena-lozinka" className="inline-block mt-2 text-sm font-semibold" style={{ color: "#3a8059" }}>
          Zatražite novi link →
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center py-6">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#f0f9f4" }}>
          <CheckCircle className="w-8 h-8" style={{ color: "#4da070" }} />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Lozinka je promenjena</h2>
        <p className="text-gray-600 text-sm mb-4">
          Vaša lozinka je uspešno resetovana. Sada se možete prijaviti sa novom lozinkom.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center gap-2 mt-2 px-6 py-3 rounded-full text-white font-semibold transition-all hover:opacity-90"
          style={{ backgroundColor: "#5a9e78" }}
        >
          Prijavi se
        </Link>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Nova lozinka</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9dceb1] text-sm"
              placeholder="Najmanje 6 karaktera"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Potvrdite lozinku</label>
          <input
            type={showPassword ? "text" : "password"}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9dceb1] text-sm"
            placeholder="Ponovite lozinku"
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
              <KeyRound className="w-4 h-4" />
              Postavi novu lozinku
            </>
          )}
        </button>
      </form>
    </>
  );
}

export default function ResetLozinkaPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12" style={{ background: "linear-gradient(135deg, #f0f9f4, white)" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Nova lozinka</h1>
          <p className="text-gray-500 mt-1">Unesite novu lozinku za vaš nalog</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <Suspense fallback={<div className="text-center py-6 text-gray-400">Učitavanje...</div>}>
            <ResetForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

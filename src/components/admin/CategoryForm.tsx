"use client";

import { useState } from "react";
import { Save, X } from "lucide-react";

interface CategoryData {
  id?: string;
  name: string;
  description: string;
  sequence: number;
}

interface Props {
  initial?: CategoryData;
  onSave: (data: Omit<CategoryData, "id">) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function CategoryForm({ initial, onSave, onCancel, loading }: Props) {
  const [form, setForm] = useState({
    name: initial?.name || "",
    description: initial?.description || "",
    sequence: initial?.sequence || 0,
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) {
      setError("Naziv kategorije je obavezan");
      return;
    }
    try {
      await onSave(form);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Greska pri cuvanju");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm border border-red-100">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Naziv <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9dceb1] text-sm"
          placeholder="npr. Relaksacione masaze"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Opis</label>
        <textarea
          rows={2}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9dceb1] text-sm resize-none"
          placeholder="Kratki opis kategorije..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Redosled</label>
        <input
          type="number"
          value={form.sequence}
          onChange={(e) => setForm({ ...form, sequence: Number(e.target.value) })}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9dceb1] text-sm"
          min={0}
        />
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          <X className="w-4 h-4" />
          Otkazi
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-medium transition-all hover:opacity-90 disabled:opacity-60"
          style={{ backgroundColor: "#9dceb1" }}
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Sacuvaj
        </button>
      </div>
    </form>
  );
}

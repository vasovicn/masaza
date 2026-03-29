"use client";

import { useState } from "react";
import { Plus, Trash2, Save, X } from "lucide-react";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/š/g, "s").replace(/č/g, "c").replace(/ć/g, "c")
    .replace(/ž/g, "z").replace(/đ/g, "dj")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface Category {
  id: string;
  name: string;
}

interface Duration {
  id?: string;
  minutes: number;
  price: number;
  label: string;
}

interface ServiceData {
  id?: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  categoryId: string;
  active: boolean;
  popular: boolean;
  bookableOnline: boolean;
  sequence: number;
  durations: Duration[];
}

interface Props {
  initial?: ServiceData;
  categories: Category[];
  onSave: (data: Omit<ServiceData, "id">) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function ServiceForm({ initial, categories, onSave, onCancel, loading }: Props) {
  const [form, setForm] = useState<ServiceData>({
    name: initial?.name || "",
    slug: initial?.slug || "",
    description: initial?.description || "",
    image: initial?.image || "",
    categoryId: initial?.categoryId || (categories[0]?.id || ""),
    active: initial?.active !== undefined ? initial.active : true,
    popular: initial?.popular !== undefined ? initial.popular : false,
    bookableOnline: initial?.bookableOnline !== undefined ? initial.bookableOnline : true,
    sequence: initial?.sequence || 0,
    durations: initial?.durations || [{ minutes: 60, price: 3000, label: "" }],
  });
  const [error, setError] = useState("");

  // Auto-generate slug when name changes (only for new services)
  const handleNameChange = (name: string) => {
    setForm((prev) => ({
      ...prev,
      name,
      slug: initial ? prev.slug : generateSlug(name),
    }));
  };

  const addDuration = () => {
    setForm((prev) => ({
      ...prev,
      durations: [...prev.durations, { minutes: 60, price: 3000, label: "" }],
    }));
  };

  const removeDuration = (index: number) => {
    if (form.durations.length <= 1) return;
    setForm((prev) => ({
      ...prev,
      durations: prev.durations.filter((_, i) => i !== index),
    }));
  };

  const updateDuration = (index: number, field: "minutes" | "price" | "label", value: number | string) => {
    setForm((prev) => ({
      ...prev,
      durations: prev.durations.map((d, i) => (i === index ? { ...d, [field]: value } : d)),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.slug || !form.description || !form.categoryId) {
      setError("Naziv, slug, opis i kategorija su obavezni");
      return;
    }
    if (form.bookableOnline && form.durations.length === 0) {
      setError("Potrebno je dodati najmanje jedno trajanje za usluge koje se zakazuju online");
      return;
    }

    try {
      await onSave(form);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Greška pri čuvanju");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm border border-red-100">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Naziv <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9dceb1] text-sm"
            placeholder="npr. Klasična relaksaciona masaža"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Slug <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9dceb1] text-sm font-mono"
            placeholder="klasicna-relaksaciona-masaza"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Kategorija <span className="text-red-500">*</span>
          </label>
          <select
            required
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9dceb1] text-sm bg-white"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Opis <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9dceb1] text-sm resize-none"
            placeholder="Opis usluge..."
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">URL slike</label>
          <input
            type="url"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9dceb1] text-sm"
            placeholder="https://..."
          />
          {form.image && (
            <div className="mt-2 relative w-full max-w-xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.image}
                alt="Preview slike"
                className="w-full h-40 object-cover rounded-xl border border-gray-200"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            </div>
          )}
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

        <div className="flex items-center gap-3 pt-6">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#9dceb1]"></div>
          </label>
          <span className="text-sm text-gray-700">Aktivna usluga</span>
        </div>

        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={form.popular}
              onChange={(e) => setForm({ ...form, popular: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4da070]"></div>
          </label>
          <span className="text-sm text-gray-700">Popularna usluga <span className="text-gray-400 text-xs">(prikazuje se badge)</span></span>
        </div>

        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={form.bookableOnline}
              onChange={(e) => setForm({ ...form, bookableOnline: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4da070]"></div>
          </label>
          <span className="text-sm text-gray-700">Online zakazivanje <span className="text-gray-400 text-xs">(prikazuje dugme za zakazivanje)</span></span>
        </div>
      </div>

      {/* Durations */}
      {form.bookableOnline && <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">
            Trajanja i cene <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            onClick={addDuration}
            className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
            style={{ backgroundColor: "#f0f9f4", color: "#3a8059" }}
          >
            <Plus className="w-4 h-4" />
            Dodaj
          </button>
        </div>
        <div className="space-y-2">
          {form.durations.map((dur, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="flex-1">
                <label className="text-xs text-gray-500 mb-1 block">Trajanje (min)</label>
                <input
                  type="number"
                  value={dur.minutes}
                  onChange={(e) => updateDuration(index, "minutes", Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#9dceb1]"
                  min={15}
                  step={15}
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-500 mb-1 block">Cena (RSD)</label>
                <input
                  type="number"
                  value={dur.price}
                  onChange={(e) => updateDuration(index, "price", Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#9dceb1]"
                  min={0}
                  step={100}
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-500 mb-1 block">Naziv (opciono)</label>
                <input
                  type="text"
                  value={dur.label}
                  onChange={(e) => updateDuration(index, "label", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#9dceb1]"
                  placeholder="npr. lice vrat i dekolte"
                />
              </div>
              <button
                type="button"
                onClick={() => removeDuration(index)}
                disabled={form.durations.length <= 1}
                className="mt-5 p-2 rounded-lg text-red-400 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          <X className="w-4 h-4" />
          Otkaži
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-medium transition-all hover:opacity-90 disabled:opacity-60"
          style={{ backgroundColor: "#5a9e78" }}
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Sačuvaj
        </button>
      </div>
    </form>
  );
}

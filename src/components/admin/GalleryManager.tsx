"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Trash2, Loader, Image as ImageIcon } from "lucide-react";

interface GalleryImage {
  id: string;
  url: string;
  alt: string | null;
  sequence: number;
}

interface Props {
  images: GalleryImage[];
  onRefresh: () => void;
}

export default function GalleryManager({ images, onRefresh }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, alt }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Greska");
      }
      setUrl("");
      setAlt("");
      setShowForm(false);
      onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Greska");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Obrisati sliku iz galerije?")) return;
    setDeletingId(id);
    try {
      await fetch("/api/admin/gallery", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      onRefresh();
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">Galerija ({images.length} slika)</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium transition-all hover:opacity-90"
          style={{ backgroundColor: "#9dceb1" }}
        >
          <Plus className="w-4 h-4" />
          Dodaj sliku
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleAdd} className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
          <h3 className="font-medium text-gray-900 mb-4">Dodaj sliku</h3>
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>
          )}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                URL slike <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9dceb1] text-sm"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Opis slike (alt tekst)
              </label>
              <input
                type="text"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9dceb1] text-sm"
                placeholder="npr. Relaksaciona masaza"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50"
              >
                Otkazi
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 rounded-xl text-white text-sm font-medium disabled:opacity-60"
                style={{ backgroundColor: "#9dceb1" }}
              >
                {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Dodaj
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Gallery grid */}
      {images.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <ImageIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-400">Galerija je prazna. Dodajte slike klikom na &quot;Dodaj sliku&quot;.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image.id} className="group relative rounded-xl overflow-hidden bg-gray-100 aspect-square">
              <Image
                src={image.url}
                alt={image.alt || "Gallery image"}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                <button
                  onClick={() => handleDelete(image.id)}
                  disabled={deletingId === image.id}
                  className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-full transition-all hover:bg-red-600 disabled:opacity-60"
                >
                  {deletingId === image.id ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
              {image.alt && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs truncate">{image.alt}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

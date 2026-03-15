"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Loader } from "lucide-react";
import CategoryForm from "./CategoryForm";

interface Category {
  id: string;
  name: string;
  description: string | null;
  sequence: number;
  active: boolean;
  _count: { services: number };
}

interface Props {
  categories: Category[];
  onRefresh: () => void;
}

export default function CategoryList({ categories, onRefresh }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleSave = async (data: { name: string; description: string; sequence: number }) => {
    setLoading(true);
    try {
      const url = editing ? `/api/admin/categories/${editing.id}` : "/api/admin/categories";
      const method = editing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Greska");
      }

      setShowForm(false);
      setEditing(null);
      onRefresh();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (category: Category) => {
    if (category._count.services > 0) {
      setDeleteError(`Kategorija "${category.name}" ima ${category._count.services} uslug(e) i ne moze biti obrisana.`);
      return;
    }
    if (!confirm(`Obrisati kategoriju "${category.name}"?`)) return;

    setDeletingId(category.id);
    setDeleteError(null);
    try {
      const res = await fetch(`/api/admin/categories/${category.id}`, { method: "DELETE" });
      if (!res.ok) {
        const d = await res.json();
        setDeleteError(d.error || "Greska pri brisanju");
        return;
      }
      onRefresh();
    } finally {
      setDeletingId(null);
    }
  };

  if (showForm || editing) {
    return (
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-6">
          {editing ? "Uredi kategoriju" : "Nova kategorija"}
        </h2>
        <CategoryForm
          initial={editing ? {
            id: editing.id,
            name: editing.name,
            description: editing.description || "",
            sequence: editing.sequence,
          } : undefined}
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
        <h2 className="text-lg font-bold text-gray-900">Kategorije ({categories.length})</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium transition-all hover:opacity-90"
          style={{ backgroundColor: "#9dceb1" }}
        >
          <Plus className="w-4 h-4" />
          Nova kategorija
        </button>
      </div>

      {deleteError && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-sm border border-red-100">
          {deleteError}
        </div>
      )}

      <div className="space-y-3">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-[#9dceb1] transition-colors">
            <div className="flex-1">
              <div className="font-medium text-gray-900">{cat.name}</div>
              {cat.description && <div className="text-sm text-gray-500 mt-0.5">{cat.description}</div>}
              <div className="text-xs text-gray-400 mt-1">{cat._count.services} uslug(a)</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setEditing(cat); setDeleteError(null); }}
                className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(cat)}
                disabled={deletingId === cat.id || cat._count.services > 0}
                className="p-2 rounded-lg text-red-400 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title={cat._count.services > 0 ? "Kategorija ima usluge" : "Obrisi"}
              >
                {deletingId === cat.id ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-xl text-gray-400">
            Nema kategorija. Kliknite &quot;Nova kategorija&quot; da dodate prvu.
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Plus, Pencil, ToggleLeft, ToggleRight, Loader } from "lucide-react";
import ServiceForm from "./ServiceForm";

interface ServiceDurationItem {
  id: string;
  minutes: number;
  price: number;
}

interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  categoryId: string;
  category: { id: string; name: string };
  durations: ServiceDurationItem[];
  active: boolean;
  sequence: number;
}

interface Category {
  id: string;
  name: string;
}

interface Props {
  services: Service[];
  categories: Category[];
  onRefresh: () => void;
}

export default function ServiceList({ services, categories, onRefresh }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [loading, setLoading] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleSave = async (data: Omit<Service, "id" | "category">) => {
    setLoading(true);
    try {
      const url = editing ? `/api/admin/services/${editing.id}` : "/api/admin/services";
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

  const handleToggle = async (service: Service) => {
    setTogglingId(service.id);
    try {
      await fetch(`/api/admin/services/${service.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !service.active }),
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
          {editing ? "Uredi uslugu" : "Nova usluga"}
        </h2>
        <ServiceForm
          initial={editing ? {
            id: editing.id,
            name: editing.name,
            slug: editing.slug,
            description: editing.description,
            image: editing.image || "",
            categoryId: editing.categoryId,
            active: editing.active,
            sequence: editing.sequence,
            durations: editing.durations,
          } : undefined}
          categories={categories}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onSave={handleSave as any}
          onCancel={() => { setShowForm(false); setEditing(null); }}
          loading={loading}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">Usluge ({services.length})</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium transition-all hover:opacity-90"
          style={{ backgroundColor: "#5a9e78" }}
        >
          <Plus className="w-4 h-4" />
          Nova usluga
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-4 py-3 font-medium text-gray-600">Naziv</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Kategorija</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Trajanja</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Cene</th>
              <th className="text-center px-4 py-3 font-medium text-gray-600">Status</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Akcije</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => {
              const minPrice = Math.min(...service.durations.map((d) => d.price));
              const maxPrice = Math.max(...service.durations.map((d) => d.price));
              return (
                <tr key={service.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{service.name}</div>
                    <div className="text-xs text-gray-400 font-mono">{service.slug}</div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-gray-600">{service.category.name}</td>
                  <td className="px-4 py-3 hidden sm:table-cell text-gray-600">{service.durations.length}x</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-gray-600">
                    {minPrice === maxPrice
                      ? `${minPrice.toLocaleString("sr-RS")} RSD`
                      : `${minPrice.toLocaleString("sr-RS")} – ${maxPrice.toLocaleString("sr-RS")} RSD`}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleToggle(service)}
                      disabled={togglingId === service.id}
                      className="inline-flex items-center gap-1"
                    >
                      {togglingId === service.id ? (
                        <Loader className="w-4 h-4 animate-spin text-gray-400" />
                      ) : service.active ? (
                        <ToggleRight className="w-5 h-5" style={{ color: "#9dceb1" }} />
                      ) : (
                        <ToggleLeft className="w-5 h-5 text-gray-300" />
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setEditing(service)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Uredi
                    </button>
                  </td>
                </tr>
              );
            })}
            {services.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                  Nema usluga. Kliknite &quot;Nova usluga&quot; da dodate prvu.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

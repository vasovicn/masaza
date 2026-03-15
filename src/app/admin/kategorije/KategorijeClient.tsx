"use client";

import { useState } from "react";
import CategoryList from "@/components/admin/CategoryList";

interface Category {
  id: string;
  name: string;
  description: string | null;
  sequence: number;
  active: boolean;
  _count: { services: number };
}

export default function KategorijeClient({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState(initialCategories);

  const handleRefresh = async () => {
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    setCategories(data.categories || []);
  };

  return <CategoryList categories={categories} onRefresh={handleRefresh} />;
}

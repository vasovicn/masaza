"use client";

import { useState } from "react";
import ServiceList from "@/components/admin/ServiceList";

interface Duration {
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
  durations: Duration[];
  active: boolean;
  bookableOnline: boolean;
  sequence: number;
}

interface Category {
  id: string;
  name: string;
}

interface Props {
  initialServices: Service[];
  initialCategories: Category[];
}

export default function UslugeClient({ initialServices, initialCategories }: Props) {
  const [services, setServices] = useState(initialServices);
  const [categories] = useState(initialCategories);

  const handleRefresh = async () => {
    const res = await fetch("/api/admin/services");
    const data = await res.json();
    setServices(data.services || []);
  };

  return <ServiceList services={services} categories={categories} onRefresh={handleRefresh} />;
}

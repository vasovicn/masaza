"use client";

import { useState } from "react";
import StaffList from "@/components/admin/StaffList";

interface Staff {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: string;
  isAdmin: boolean;
  bio: string | null;
  image: string | null;
  active: boolean;
  sequence: number;
}

export default function MaseriClient({ initialStaff }: { initialStaff: Staff[] }) {
  const [staff, setStaff] = useState(initialStaff);

  const handleRefresh = async () => {
    const res = await fetch("/api/admin/staff");
    const data = await res.json();
    setStaff(data.staff || []);
  };

  return <StaffList staff={staff} onRefresh={handleRefresh} />;
}

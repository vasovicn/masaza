import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import RezervacijeClient from "./RezervacijeClient";

export const metadata = {
  title: "Rezervacije - Admin",
};

export default async function AdminRezervacijePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("staff_token")?.value;
  const payload = token ? await verifyAdminToken(token) : null;
  const isAdmin = payload?.isAdmin === true;
  const currentStaffId = payload?.id as string;

  const staff = await prisma.staffUser.findMany({
    where: {
      active: true,
      // If not admin, only show themselves in the staff filter
      ...(isAdmin ? { role: "maser" } : { id: currentStaffId }),
    },
    orderBy: { sequence: "asc" },
    select: { id: true, firstName: true, lastName: true },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
          Rezervacije
        </h1>
        <p className="text-gray-500 mt-1">Upravljajte svim rezervacijama</p>
      </div>
      <RezervacijeClient staff={staff} />
    </div>
  );
}

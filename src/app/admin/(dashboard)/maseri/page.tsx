import MaseriClient from "./MaseriClient";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Maseri - Admin",
};

export default async function AdminMaseriPage() {
  const staff = await prisma.staffUser.findMany({
    orderBy: [{ sequence: "asc" }, { firstName: "asc" }],
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      role: true,
      isAdmin: true,
      bio: true,
      image: true,
      active: true,
      sequence: true,
    },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
          Osoblje i maseri
        </h1>
        <p className="text-gray-500 mt-1">Upravljajte korisnickim nalozima osoblja</p>
      </div>
      <MaseriClient initialStaff={staff} />
    </div>
  );
}

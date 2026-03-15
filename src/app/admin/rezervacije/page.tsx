import { prisma } from "@/lib/prisma";
import BookingList from "@/components/admin/BookingList";

export const metadata = {
  title: "Rezervacije - Admin",
};

export default async function AdminRezervacijePage() {
  const staff = await prisma.staffUser.findMany({
    where: { active: true },
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
      <BookingList staff={staff} />
    </div>
  );
}

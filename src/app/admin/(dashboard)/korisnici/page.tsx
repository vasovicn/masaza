import { prisma } from "@/lib/prisma";
import KorisniciClient from "./KorisniciClient";

export default async function KorisniciPage() {
  const clients = await prisma.clientUser.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      emailVerified: true,
      googleId: true,
      createdAt: true,
      _count: { select: { bookings: true } },
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Korisnici</h1>
      <KorisniciClient initialClients={clients} />
    </div>
  );
}

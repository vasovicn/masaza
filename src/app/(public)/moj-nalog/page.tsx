import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyClientToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ClientDashboard from "./ClientDashboard";

export const metadata = {
  title: "Moj nalog - Somatic Balans",
};

export default async function MojNalogPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("client_token")?.value;

  if (!token) redirect("/login");

  const payload = await verifyClientToken(token);
  if (!payload) redirect("/login");

  const userId = payload.id as string;

  const clientUser = await prisma.clientUser.findUnique({
    where: { id: userId },
    select: { phone: true },
  });

  const bookings = await prisma.booking.findMany({
    where: { clientUserId: userId },
    include: {
      service: true,
      serviceDuration: true,
      staffUser: { select: { firstName: true, lastName: true } },
    },
    orderBy: [{ date: "desc" }, { startTime: "desc" }],
  });

  const today = new Date().toISOString().split("T")[0];
  const upcoming = bookings.filter((b) => b.date >= today && b.status === "confirmed");
  const past = bookings.filter((b) => b.date < today || b.status !== "confirmed");

  return (
    <ClientDashboard
      user={{
        id: userId,
        email: payload.email as string,
        firstName: payload.firstName as string,
        lastName: payload.lastName as string,
        phone: clientUser?.phone || undefined,
      }}
      upcomingBookings={upcoming}
      pastBookings={past}
    />
  );
}

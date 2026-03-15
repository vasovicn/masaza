import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyClientToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("client_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Neautorizovano" }, { status: 401 });
    }

    const payload = await verifyClientToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Neautorizovano" }, { status: 401 });
    }

    const bookings = await prisma.booking.findMany({
      where: { clientUserId: payload.id as string },
      include: {
        service: true,
        serviceDuration: true,
        staffUser: {
          select: { firstName: true, lastName: true },
        },
      },
      orderBy: [{ date: "desc" }, { startTime: "desc" }],
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("Client bookings error:", error);
    return NextResponse.json({ error: "Greska pri ucitavanju rezervacija" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyClientToken } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = request.cookies.get("client_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Neautorizovano" }, { status: 401 });
    }

    const payload = await verifyClientToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Neautorizovano" }, { status: 401 });
    }

    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      return NextResponse.json({ error: "Rezervacija nije pronadjena" }, { status: 404 });
    }

    if (booking.clientUserId !== payload.id) {
      return NextResponse.json({ error: "Nemate dozvolu za ovu rezervaciju" }, { status: 403 });
    }

    if (booking.status === "cancelled") {
      return NextResponse.json({ error: "Rezervacija je vec otkazana" }, { status: 400 });
    }

    const today = new Date().toISOString().split("T")[0];
    if (booking.date < today) {
      return NextResponse.json({ error: "Ne mozete otkazati prosle rezervacije" }, { status: 400 });
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { status: "cancelled" },
    });

    return NextResponse.json({ booking: updated });
  } catch (error) {
    console.error("Cancel booking error:", error);
    return NextResponse.json({ error: "Greska pri otkazivanju rezervacije" }, { status: 500 });
  }
}

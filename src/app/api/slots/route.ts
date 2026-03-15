import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAvailableSlots } from "@/lib/slots";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const durationId = searchParams.get("durationId");

    if (!date || !durationId) {
      return NextResponse.json({ error: "date i durationId su obavezni" }, { status: 400 });
    }

    const duration = await prisma.serviceDuration.findUnique({
      where: { id: durationId },
    });

    if (!duration) {
      return NextResponse.json({ error: "Trajanje nije pronadjeno" }, { status: 404 });
    }

    const slots = await getAvailableSlots(date, duration.minutes);
    return NextResponse.json({ slots });
  } catch (error) {
    console.error("Slots error:", error);
    return NextResponse.json({ error: "Greska pri ucitavanju termina" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { addMinutes } from "@/lib/slots";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const status = searchParams.get("status");
    const staffId = searchParams.get("staffId");

    const where: Record<string, unknown> = {};

    if (date) where.date = date;
    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) (where.date as Record<string, string>).gte = dateFrom;
      if (dateTo) (where.date as Record<string, string>).lte = dateTo;
    }
    if (status) where.status = status;
    if (staffId) where.staffUserId = staffId;

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        service: true,
        serviceDuration: true,
        staffUser: { select: { id: true, firstName: true, lastName: true } },
        clientUser: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
      orderBy: [{ date: "desc" }, { startTime: "asc" }],
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("Admin bookings GET error:", error);
    return NextResponse.json({ error: "Greska pri ucitavanju rezervacija" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      serviceId,
      serviceDurationId,
      date,
      startTime,
      staffUserId,
      customerName,
      customerPhone,
      customerEmail,
      notes,
      status = "confirmed",
    } = body;

    if (!serviceId || !serviceDurationId || !date || !startTime || !staffUserId || !customerName || !customerPhone) {
      return NextResponse.json({ error: "Sva obavezna polja moraju biti popunjena" }, { status: 400 });
    }

    const duration = await prisma.serviceDuration.findUnique({ where: { id: serviceDurationId } });
    if (!duration) {
      return NextResponse.json({ error: "Trajanje nije pronadjeno" }, { status: 404 });
    }

    const endTime = addMinutes(startTime, duration.minutes);

    const booking = await prisma.booking.create({
      data: {
        customerName,
        customerPhone,
        customerEmail: customerEmail || null,
        serviceId,
        serviceDurationId,
        date,
        startTime,
        endTime,
        staffUserId,
        notes: notes || null,
        status,
      },
      include: {
        service: true,
        serviceDuration: true,
        staffUser: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    console.error("Admin bookings POST error:", error);
    return NextResponse.json({ error: "Greska pri kreiranju rezervacije" }, { status: 500 });
  }
}

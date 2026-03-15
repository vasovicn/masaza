import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { addMinutes, timeToMinutes } from "@/lib/slots";
import { sendBookingConfirmation } from "@/lib/mailer";
import { verifyClientToken } from "@/lib/auth";
import { WORKING_HOURS } from "@/lib/constants";

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
    } = body;

    // Validate required fields
    if (!serviceId || !serviceDurationId || !date || !startTime || !customerName || !customerPhone) {
      return NextResponse.json({ error: "Sva obavezna polja moraju biti popunjena" }, { status: 400 });
    }

    // Get duration
    const duration = await prisma.serviceDuration.findUnique({
      where: { id: serviceDurationId },
      include: { service: true },
    });

    if (!duration) {
      return NextResponse.json({ error: "Trajanje nije pronadjeno" }, { status: 404 });
    }

    const endTime = addMinutes(startTime, duration.minutes);

    // Validate time is within working hours
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);
    if (
      startMinutes < WORKING_HOURS.start * 60 ||
      endMinutes > WORKING_HOURS.end * 60
    ) {
      return NextResponse.json({ error: "Termin je van radnog vremena" }, { status: 400 });
    }

    // Determine staff
    let selectedStaffId = staffUserId;

    if (!selectedStaffId) {
      // Auto-assign least busy staff
      const allStaff = await prisma.staffUser.findMany({
        where: { active: true, role: "maser" },
        orderBy: { sequence: "asc" },
      });

      const bookingCounts = await prisma.booking.groupBy({
        by: ["staffUserId"],
        where: { date, status: "confirmed" },
        _count: { id: true },
      });

      const countMap: Record<string, number> = {};
      bookingCounts.forEach((b) => {
        countMap[b.staffUserId] = b._count.id;
      });

      // Find available staff
      for (const staff of allStaff) {
        const conflicts = await prisma.booking.findFirst({
          where: {
            staffUserId: staff.id,
            date,
            status: "confirmed",
            OR: [
              {
                AND: [
                  { startTime: { lte: startTime } },
                  { endTime: { gt: startTime } },
                ],
              },
              {
                AND: [
                  { startTime: { lt: endTime } },
                  { endTime: { gte: endTime } },
                ],
              },
              {
                AND: [
                  { startTime: { gte: startTime } },
                  { endTime: { lte: endTime } },
                ],
              },
            ],
          },
        });

        if (!conflicts) {
          selectedStaffId = staff.id;
          break;
        }
      }

      if (!selectedStaffId) {
        return NextResponse.json({ error: "Nema dostupnih masera za izabrani termin" }, { status: 409 });
      }
    } else {
      // Verify selected staff is available
      const conflict = await prisma.booking.findFirst({
        where: {
          staffUserId: selectedStaffId,
          date,
          status: "confirmed",
          OR: [
            {
              AND: [
                { startTime: { lte: startTime } },
                { endTime: { gt: startTime } },
              ],
            },
            {
              AND: [
                { startTime: { lt: endTime } },
                { endTime: { gte: endTime } },
              ],
            },
            {
              AND: [
                { startTime: { gte: startTime } },
                { endTime: { lte: endTime } },
              ],
            },
          ],
        },
      });

      if (conflict) {
        return NextResponse.json({ error: "Izabrani termin je zauzet" }, { status: 409 });
      }
    }

    // Get client user if logged in
    let clientUserId: string | null = null;
    const clientToken = request.cookies.get("client_token")?.value;
    if (clientToken) {
      const payload = await verifyClientToken(clientToken);
      if (payload) {
        clientUserId = payload.id as string;
      }
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        customerName,
        customerPhone,
        customerEmail: customerEmail || null,
        clientUserId,
        serviceId,
        serviceDurationId,
        date,
        startTime,
        endTime,
        staffUserId: selectedStaffId,
        notes: notes || null,
        status: "confirmed",
      },
      include: {
        service: true,
        serviceDuration: true,
        staffUser: true,
      },
    });

    // Send email notification (non-blocking)
    sendBookingConfirmation({
      customerName: booking.customerName,
      customerPhone: booking.customerPhone,
      customerEmail: booking.customerEmail,
      serviceName: booking.service.name,
      durationMinutes: booking.serviceDuration.minutes,
      price: booking.serviceDuration.price,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
      staffName: `${booking.staffUser.firstName} ${booking.staffUser.lastName}`,
    }).catch(console.error);

    return NextResponse.json({ booking, success: true }, { status: 201 });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json({ error: "Greska pri kreiranju rezervacije" }, { status: 500 });
  }
}

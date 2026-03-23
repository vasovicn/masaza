import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { addMinutes, timeToMinutes, roundUpToSlot, createBookingSafe } from "@/lib/slots";
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
      // Auto-assign: find first available staff
      const allStaff = await prisma.staffUser.findMany({
        where: { active: true, role: "maser" },
        orderBy: { sequence: "asc" },
      });

      const allBookings = await prisma.booking.findMany({
        where: { date, status: "confirmed" },
      });

      const newStart = timeToMinutes(startTime);
      const newEndRounded = roundUpToSlot(timeToMinutes(endTime));

      for (const staff of allStaff) {
        const staffBookings = allBookings.filter((b) => b.staffUserId === staff.id);
        const overlap = staffBookings.some((b) => {
          const bStart = timeToMinutes(b.startTime);
          const bEndRounded = roundUpToSlot(timeToMinutes(b.endTime));
          return newStart < bEndRounded && newEndRounded > bStart;
        });
        if (!overlap) {
          selectedStaffId = staff.id;
          break;
        }
      }

      if (!selectedStaffId) {
        return NextResponse.json({ error: "Nema dostupnih masera za izabrani termin" }, { status: 409 });
      }
    }

    // Get client user if logged in
    let clientUserId: string | null = null;
    const clientToken = request.cookies.get("client_token")?.value;
    if (clientToken) {
      const payload = await verifyClientToken(clientToken);
      if (payload) {
        clientUserId = payload.id as string;

        // Save phone number to profile if the user doesn't have one yet
        if (customerPhone) {
          const client = await prisma.clientUser.findUnique({
            where: { id: clientUserId },
            select: { phone: true },
          });
          if (client && !client.phone) {
            await prisma.clientUser.update({
              where: { id: clientUserId },
              data: { phone: customerPhone },
            });
          }
        }
      }
    }

    // Atomically check + create inside transaction to prevent race conditions
    let booking;
    try {
      booking = await createBookingSafe({
        staffUserId: selectedStaffId,
        date,
        startTime,
        endTime,
        serviceId,
        serviceDurationId,
        customerName,
        customerPhone,
        customerEmail: customerEmail || null,
        clientUserId,
        notes: notes || null,
      });
    } catch (err) {
      if (err instanceof Error && err.message === "SLOT_TAKEN") {
        return NextResponse.json(
          { error: "Izabrani termin je upravo zauzet. Molimo izaberite drugi termin." },
          { status: 409 }
        );
      }
      throw err;
    }

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

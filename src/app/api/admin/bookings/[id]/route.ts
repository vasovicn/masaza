import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { addMinutes } from "@/lib/slots";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        service: true,
        serviceDuration: true,
        staffUser: { select: { id: true, firstName: true, lastName: true } },
        clientUser: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Rezervacija nije pronadjena" }, { status: 404 });
    }

    return NextResponse.json({ booking });
  } catch (error) {
    console.error("Admin booking GET error:", error);
    return NextResponse.json({ error: "Greska pri ucitavanju rezervacije" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.booking.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Rezervacija nije pronadjena" }, { status: 404 });
    }

    let endTime = existing.endTime;
    if (body.startTime && body.serviceDurationId) {
      const duration = await prisma.serviceDuration.findUnique({ where: { id: body.serviceDurationId } });
      if (duration) {
        endTime = addMinutes(body.startTime, duration.minutes);
      }
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: {
        ...(body.customerName && { customerName: body.customerName }),
        ...(body.customerPhone && { customerPhone: body.customerPhone }),
        ...(body.customerEmail !== undefined && { customerEmail: body.customerEmail }),
        ...(body.serviceId && { serviceId: body.serviceId }),
        ...(body.serviceDurationId && { serviceDurationId: body.serviceDurationId }),
        ...(body.date && { date: body.date }),
        ...(body.startTime && { startTime: body.startTime }),
        endTime,
        ...(body.staffUserId && { staffUserId: body.staffUserId }),
        ...(body.status && { status: body.status }),
        ...(body.notes !== undefined && { notes: body.notes }),
      },
      include: {
        service: true,
        serviceDuration: true,
        staffUser: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    return NextResponse.json({ booking });
  } catch (error) {
    console.error("Admin booking PUT error:", error);
    return NextResponse.json({ error: "Greska pri azuriranju rezervacije" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.booking.update({
      where: { id },
      data: { status: "cancelled" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin booking DELETE error:", error);
    return NextResponse.json({ error: "Greska pri otkazivanju rezervacije" }, { status: 500 });
  }
}

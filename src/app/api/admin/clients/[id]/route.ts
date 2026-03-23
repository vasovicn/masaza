import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { firstName, lastName, phone, emailVerified } = body;

    const updated = await prisma.clientUser.update({
      where: { id },
      data: {
        ...(firstName !== undefined && { firstName }),
        ...(lastName !== undefined && { lastName }),
        ...(phone !== undefined && { phone: phone || null }),
        ...(emailVerified !== undefined && { emailVerified }),
      },
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

    return NextResponse.json({ client: updated });
  } catch (error) {
    console.error("Admin client PUT error:", error);
    return NextResponse.json({ error: "Greška pri ažuriranju korisnika" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    await prisma.clientUser.update({
      where: { id },
      data: { emailVerified: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin client DELETE error:", error);
    return NextResponse.json({ error: "Greška pri deaktivaciji korisnika" }, { status: 500 });
  }
}

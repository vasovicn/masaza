import { NextRequest, NextResponse } from "next/server";
import { verifyClientToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(request: NextRequest) {
  const token = request.cookies.get("client_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Niste prijavljeni" }, { status: 401 });
  }

  const payload = await verifyClientToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Niste prijavljeni" }, { status: 401 });
  }

  const body = await request.json();
  const { firstName, lastName, phone } = body;

  if (!firstName || !lastName) {
    return NextResponse.json({ error: "Ime i prezime su obavezni" }, { status: 400 });
  }

  try {
    const updated = await prisma.clientUser.update({
      where: { id: payload.id as string },
      data: {
        firstName,
        lastName,
        phone: phone || null,
      },
    });

    return NextResponse.json({
      user: {
        id: updated.id,
        email: updated.email,
        firstName: updated.firstName,
        lastName: updated.lastName,
        phone: updated.phone,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Greška pri ažuriranju profila" }, { status: 500 });
  }
}

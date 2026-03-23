import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function GET() {
  try {
    const staff = await prisma.staffUser.findMany({
      orderBy: [{ sequence: "asc" }, { firstName: "asc" }],
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isAdmin: true,
        bio: true,
        image: true,
        active: true,
        sequence: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ staff });
  } catch (error) {
    console.error("Admin staff GET error:", error);
    return NextResponse.json({ error: "Greska pri ucitavanju masera" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, phone, role, isAdmin, bio, image, sequence } = body;

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: "Email, lozinka, ime i prezime su obavezni" }, { status: 400 });
    }

    const existing = await prisma.staffUser.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email adresa je vec registrovana" }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);

    const staff = await prisma.staffUser.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone: phone || null,
        role: role || "maser",
        isAdmin: isAdmin || false,
        bio: bio || null,
        image: image || null,
        sequence: sequence || 0,
        active: true,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isAdmin: true,
        bio: true,
        image: true,
        active: true,
        sequence: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ staff }, { status: 201 });
  } catch (error) {
    console.error("Admin staff POST error:", error);
    return NextResponse.json({ error: "Greska pri kreiranju masera" }, { status: 500 });
  }
}

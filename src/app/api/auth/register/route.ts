import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signClientToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, phone } = await request.json();

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: "Sva obavezna polja moraju biti popunjena" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Lozinka mora imati najmanje 6 karaktera" }, { status: 400 });
    }

    const existing = await prisma.clientUser.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email adresa je vec registrovana" }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);

    const client = await prisma.clientUser.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone: phone || null,
      },
    });

    const token = await signClientToken({
      id: client.id,
      email: client.email,
      firstName: client.firstName,
      lastName: client.lastName,
    });

    const response = NextResponse.json({
      user: {
        id: client.id,
        email: client.email,
        firstName: client.firstName,
        lastName: client.lastName,
      },
    });

    response.cookies.set("client_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Greska pri registraciji" }, { status: 500 });
  }
}

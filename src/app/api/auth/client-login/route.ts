import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signClientToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email i lozinka su obavezni" }, { status: 400 });
    }

    const client = await prisma.clientUser.findUnique({ where: { email } });
    if (!client) {
      return NextResponse.json({ error: "Pogresni podaci za prijavu" }, { status: 401 });
    }

    if (!client.password) {
      return NextResponse.json({ error: "Ovaj nalog koristi Google prijavu" }, { status: 401 });
    }

    const valid = await verifyPassword(password, client.password);
    if (!valid) {
      return NextResponse.json({ error: "Pogresni podaci za prijavu" }, { status: 401 });
    }

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
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Client login error:", error);
    return NextResponse.json({ error: "Greska pri prijavi" }, { status: 500 });
  }
}

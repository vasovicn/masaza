import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/mailer";
import { randomBytes } from "crypto";

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
    const verifyToken = randomBytes(32).toString("hex");

    await prisma.clientUser.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone: phone || null,
        emailVerified: false,
        verifyToken,
      },
    });

    try {
      await sendVerificationEmail(email, verifyToken);
    } catch {
      // Email sending failed but user is created
    }

    return NextResponse.json({
      message: "Registracija uspešna! Proverite email za potvrdu naloga.",
      needsVerification: true,
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Greska pri registraciji" }, { status: 500 });
  }
}

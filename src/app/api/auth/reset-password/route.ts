import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Token i lozinka su obavezni" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Lozinka mora imati najmanje 6 karaktera" }, { status: 400 });
    }

    const user = await prisma.clientUser.findFirst({
      where: { resetToken: token },
    });

    if (!user || !user.resetTokenExp || user.resetTokenExp < new Date()) {
      return NextResponse.json({ error: "Link za resetovanje je istekao ili nije validan" }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    await prisma.clientUser.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExp: null,
        emailVerified: true,
      },
    });

    return NextResponse.json({ message: "Lozinka je uspešno promenjena" });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Greška pri resetovanju lozinke" }, { status: 500 });
  }
}

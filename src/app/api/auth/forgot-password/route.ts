import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendResetPasswordEmail } from "@/lib/mailer";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email je obavezan" }, { status: 400 });
    }

    let user;
    try {
      user = await prisma.clientUser.findUnique({ where: { email } });
    } catch (dbError) {
      console.error("DB findUnique error:", dbError);
      return NextResponse.json({ error: "Greška pri pristupu bazi" }, { status: 500 });
    }

    // Always return success to prevent email enumeration
    if (!user || !user.password) {
      return NextResponse.json({ message: "Ako nalog postoji, email za resetovanje je poslat." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExp = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    try {
      await prisma.clientUser.update({
        where: { id: user.id },
        data: { resetToken, resetTokenExp },
      });
    } catch (updateError) {
      console.error("DB update error:", updateError);
      return NextResponse.json({ error: "Greška pri ažuriranju naloga" }, { status: 500 });
    }

    try {
      await sendResetPasswordEmail(email, resetToken);
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      // Still return success - token is saved, user can retry
    }

    return NextResponse.json({ message: "Ako nalog postoji, email za resetovanje je poslat." });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Greška" }, { status: 500 });
  }
}

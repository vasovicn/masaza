import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signAdminToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email i lozinka su obavezni" }, { status: 400 });
    }

    const staff = await prisma.staffUser.findUnique({ where: { email } });
    if (!staff || !staff.active) {
      return NextResponse.json({ error: "Pogresni podaci za prijavu" }, { status: 401 });
    }

    const valid = await verifyPassword(password, staff.password);
    if (!valid) {
      return NextResponse.json({ error: "Pogresni podaci za prijavu" }, { status: 401 });
    }

    const token = await signAdminToken({
      id: staff.id,
      email: staff.email,
      role: staff.role,
      isAdmin: staff.isAdmin,
      firstName: staff.firstName,
      lastName: staff.lastName,
    });

    const response = NextResponse.json({
      user: {
        id: staff.id,
        email: staff.email,
        firstName: staff.firstName,
        lastName: staff.lastName,
        role: staff.role,
        isAdmin: staff.isAdmin,
      },
    });

    response.cookies.set("staff_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8, // 8 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json({ error: "Greska pri prijavi" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signClientToken } from "@/lib/auth";

function getSiteUrl() {
  return process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://masazabalans.rs";
}

export async function GET(request: NextRequest) {
  const baseUrl = getSiteUrl();
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(`${baseUrl}/login?error=invalid-token`);
  }

  const user = await prisma.clientUser.findFirst({
    where: { verifyToken: token },
  });

  if (!user) {
    return NextResponse.redirect(`${baseUrl}/login?error=invalid-token`);
  }

  await prisma.clientUser.update({
    where: { id: user.id },
    data: { emailVerified: true, verifyToken: null },
  });

  const jwt = await signClientToken({
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  });

  const response = NextResponse.redirect(`${baseUrl}/moj-nalog?verified=1`);
  response.cookies.set("client_token", jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return response;
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signClientToken } from "@/lib/auth";

interface GoogleTokenResponse {
  access_token: string;
  id_token: string;
  error?: string;
}

interface GoogleUserInfo {
  id: string;
  email: string;
  given_name: string;
  family_name: string;
  picture: string;
  verified_email: boolean;
}

export async function GET(request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const errorRedirect = (msg: string) =>
    NextResponse.redirect(`${baseUrl}/login?error=${encodeURIComponent(msg)}`);

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    return errorRedirect("Prijava sa Google nalogom je otkazana");
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return errorRedirect("Google OAuth nije konfigurisan");
  }

  const redirectUri = `${baseUrl}/api/auth/google/callback`;

  // Exchange code for tokens
  let tokens: GoogleTokenResponse;
  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });
    tokens = await tokenRes.json();
  } catch {
    return errorRedirect("Greska pri komunikaciji sa Google servisom");
  }

  if (tokens.error || !tokens.access_token) {
    return errorRedirect("Nije moguce dobiti Google token");
  }

  // Get user profile
  let googleUser: GoogleUserInfo;
  try {
    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    googleUser = await userRes.json();
  } catch {
    return errorRedirect("Nije moguce ucitati Google profil");
  }

  if (!googleUser.email || !googleUser.verified_email) {
    return errorRedirect("Google nalog nema verifikovan email");
  }

  // Find or create client user
  let client = await prisma.clientUser.findUnique({
    where: { googleId: googleUser.id },
  });

  if (!client) {
    // Check if email already exists (registered with email/password)
    const existingByEmail = await prisma.clientUser.findUnique({
      where: { email: googleUser.email },
    });

    if (existingByEmail) {
      // Link Google account to existing email account
      client = await prisma.clientUser.update({
        where: { id: existingByEmail.id },
        data: { googleId: googleUser.id },
      });
    } else {
      // Create new account
      client = await prisma.clientUser.create({
        data: {
          email: googleUser.email,
          googleId: googleUser.id,
          firstName: googleUser.given_name || googleUser.email.split("@")[0],
          lastName: googleUser.family_name || "",
          password: null,
        },
      });
    }
  }

  const token = await signClientToken({
    id: client.id,
    email: client.email,
    firstName: client.firstName,
    lastName: client.lastName,
  });

  const response = NextResponse.redirect(`${baseUrl}/moj-nalog`);
  response.cookies.set("client_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return response;
}

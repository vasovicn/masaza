import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, verifyClientToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  // Check staff token first
  const staffToken = request.cookies.get("staff_token")?.value;
  if (staffToken) {
    const payload = await verifyAdminToken(staffToken);
    if (payload) {
      return NextResponse.json({
        user: {
          id: payload.id,
          email: payload.email,
          firstName: payload.firstName,
          lastName: payload.lastName,
          role: payload.role,
          isAdmin: payload.isAdmin,
          type: "staff",
        },
      });
    }
  }

  // Check client token
  const clientToken = request.cookies.get("client_token")?.value;
  if (clientToken) {
    const payload = await verifyClientToken(clientToken);
    if (payload) {
      const client = await prisma.clientUser.findUnique({
        where: { id: payload.id as string },
        select: { phone: true },
      });
      return NextResponse.json({
        user: {
          id: payload.id,
          email: payload.email,
          firstName: payload.firstName,
          lastName: payload.lastName,
          phone: client?.phone || undefined,
          type: "client",
        },
      });
    }
  }

  return NextResponse.json({ user: null });
}

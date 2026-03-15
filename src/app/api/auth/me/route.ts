import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, verifyClientToken } from "@/lib/auth";

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
      return NextResponse.json({
        user: {
          id: payload.id,
          email: payload.email,
          firstName: payload.firstName,
          lastName: payload.lastName,
          type: "client",
        },
      });
    }
  }

  return NextResponse.json({ user: null });
}

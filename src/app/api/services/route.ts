import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: { active: true },
      include: {
        category: true,
        durations: {
          orderBy: { minutes: "asc" },
        },
      },
      orderBy: [{ category: { sequence: "asc" } }, { sequence: "asc" }],
    });

    return NextResponse.json({ services });
  } catch (error) {
    console.error("Services error:", error);
    return NextResponse.json({ error: "Greska pri ucitavanju usluga" }, { status: 500 });
  }
}

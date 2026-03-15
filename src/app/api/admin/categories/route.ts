import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.serviceCategory.findMany({
      orderBy: { sequence: "asc" },
      include: {
        _count: { select: { services: true } },
      },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Admin categories GET error:", error);
    return NextResponse.json({ error: "Greska pri ucitavanju kategorija" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, sequence } = await request.json();

    if (!name) {
      return NextResponse.json({ error: "Naziv kategorije je obavezan" }, { status: 400 });
    }

    const category = await prisma.serviceCategory.create({
      data: {
        name,
        description: description || null,
        sequence: sequence || 0,
        active: true,
      },
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error("Admin categories POST error:", error);
    return NextResponse.json({ error: "Greska pri kreiranju kategorije" }, { status: 500 });
  }
}

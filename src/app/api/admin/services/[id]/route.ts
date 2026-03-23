import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        category: true,
        durations: { orderBy: { minutes: "asc" } },
      },
    });

    if (!service) {
      return NextResponse.json({ error: "Usluga nije pronadjena" }, { status: 404 });
    }

    return NextResponse.json({ service });
  } catch (error) {
    console.error("Admin service GET error:", error);
    return NextResponse.json({ error: "Greska pri ucitavanju usluge" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, slug, description, image, categoryId, durations, active, popular, bookableOnline, sequence } = body;

    const existing = await prisma.service.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Usluga nije pronadjena" }, { status: 404 });
    }

    // Update service basic info
    await prisma.service.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(slug !== undefined && { slug }),
        ...(description !== undefined && { description }),
        ...(image !== undefined && { image }),
        ...(categoryId !== undefined && { categoryId }),
        ...(active !== undefined && { active }),
        ...(popular !== undefined && { popular }),
        ...(bookableOnline !== undefined && { bookableOnline }),
        ...(sequence !== undefined && { sequence }),
      },
    });

    // Update durations if provided
    if (durations && durations.length > 0) {
      await prisma.serviceDuration.deleteMany({ where: { serviceId: id } });
      await prisma.serviceDuration.createMany({
        data: durations.map((d: { minutes: number; price: number; packageCount?: number }) => ({
          serviceId: id,
          minutes: Number(d.minutes),
          price: Number(d.price),
          packageCount: Number(d.packageCount || 1),
        })),
      });
    }

    const updated = await prisma.service.findUnique({
      where: { id },
      include: {
        category: true,
        durations: { orderBy: { minutes: "asc" } },
      },
    });

    return NextResponse.json({ service: updated });
  } catch (error) {
    console.error("Admin service PUT error:", error);
    return NextResponse.json({ error: "Greska pri azuriranju usluge" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.service.update({
      where: { id },
      data: { active: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin service DELETE error:", error);
    return NextResponse.json({ error: "Greska pri deaktiviranju usluge" }, { status: 500 });
  }
}

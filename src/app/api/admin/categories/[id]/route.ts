import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, description, sequence, active } = await request.json();

    const category = await prisma.serviceCategory.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(sequence !== undefined && { sequence }),
        ...(active !== undefined && { active }),
      },
    });

    return NextResponse.json({ category });
  } catch (error) {
    console.error("Admin categories PUT error:", error);
    return NextResponse.json({ error: "Greska pri azuriranju kategorije" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if category has services
    const serviceCount = await prisma.service.count({ where: { categoryId: id } });
    if (serviceCount > 0) {
      return NextResponse.json(
        { error: "Kategorija ima usluge i ne moze biti obrisana. Najpre obrisite ili premestite sve usluge." },
        { status: 400 }
      );
    }

    await prisma.serviceCategory.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin categories DELETE error:", error);
    return NextResponse.json({ error: "Greska pri brisanju kategorije" }, { status: 500 });
  }
}

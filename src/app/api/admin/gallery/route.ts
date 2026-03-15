import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: { sequence: "asc" },
    });

    return NextResponse.json({ images });
  } catch (error) {
    console.error("Admin gallery GET error:", error);
    return NextResponse.json({ error: "Greska pri ucitavanju galerije" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url, alt } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL slike je obavezan" }, { status: 400 });
    }

    const maxSeq = await prisma.galleryImage.aggregate({ _max: { sequence: true } });
    const sequence = (maxSeq._max.sequence || 0) + 1;

    const image = await prisma.galleryImage.create({
      data: { url, alt: alt || null, sequence },
    });

    return NextResponse.json({ image }, { status: 201 });
  } catch (error) {
    console.error("Admin gallery POST error:", error);
    return NextResponse.json({ error: "Greska pri dodavanju slike" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "ID slike je obavezan" }, { status: 400 });
    }

    await prisma.galleryImage.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin gallery DELETE error:", error);
    return NextResponse.json({ error: "Greska pri brisanju slike" }, { status: 500 });
  }
}

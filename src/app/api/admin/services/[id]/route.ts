import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
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
      return NextResponse.json({ error: "Usluga nije pronađena" }, { status: 404 });
    }

    return NextResponse.json({ service });
  } catch (error) {
    console.error("Admin service GET error:", error);
    return NextResponse.json({ error: "Greška pri učitavanju usluge" }, { status: 500 });
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
      return NextResponse.json({ error: "Usluga nije pronađena" }, { status: 404 });
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
      const existingDurations = await prisma.serviceDuration.findMany({ where: { serviceId: id } });
      const incomingIds = durations.filter((d: { id?: string }) => d.id).map((d: { id: string }) => d.id);
      // Delete durations that are no longer in the list (only those without bookings)
      const toDelete = existingDurations.filter((d) => !incomingIds.includes(d.id));
      for (const d of toDelete) {
        try {
          await prisma.serviceDuration.delete({ where: { id: d.id } });
        } catch {
          // Has bookings, keep it but it won't be in the response
        }
      }
      // Update existing and create new
      for (const d of durations) {
        const dur = d as { id?: string; minutes: number; price: number; label?: string };
        if (dur.id && existingDurations.some((e) => e.id === dur.id)) {
          await prisma.serviceDuration.update({
            where: { id: dur.id },
            data: { minutes: Number(dur.minutes), price: Number(dur.price), label: dur.label || null },
          });
        } else {
          await prisma.serviceDuration.create({
            data: { serviceId: id, minutes: Number(dur.minutes), price: Number(dur.price), label: dur.label || null },
          });
        }
      }
    }

    const updated = await prisma.service.findUnique({
      where: { id },
      include: {
        category: true,
        durations: { orderBy: { minutes: "asc" } },
      },
    });

    revalidatePath("/usluge");
    revalidatePath("/cenovnik");
    if (updated?.slug) revalidatePath(`/usluge/${updated.slug}`);
    return NextResponse.json({ service: updated });
  } catch (error) {
    console.error("Admin service PUT error:", error);
    return NextResponse.json({ error: "Greška pri ažuriranju usluge" }, { status: 500 });
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

    revalidatePath("/usluge");
    revalidatePath("/cenovnik");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin service DELETE error:", error);
    return NextResponse.json({ error: "Greška pri deaktiviranju usluge" }, { status: 500 });
  }
}

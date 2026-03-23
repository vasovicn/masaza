import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      include: {
        category: true,
        durations: { orderBy: { minutes: "asc" } },
      },
      orderBy: [{ category: { sequence: "asc" } }, { sequence: "asc" }],
    });

    return NextResponse.json({ services });
  } catch (error) {
    console.error("Admin services GET error:", error);
    return NextResponse.json({ error: "Greska pri ucitavanju usluga" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, description, image, categoryId, durations, active, popular, bookableOnline, sequence } = body;

    if (!name || !slug || !description || !categoryId) {
      return NextResponse.json({ error: "Naziv, slug, opis i kategorija su obavezni" }, { status: 400 });
    }

    const service = await prisma.service.create({
      data: {
        name,
        slug,
        description,
        image: image || null,
        categoryId,
        active: active !== undefined ? active : true,
        popular: popular !== undefined ? popular : false,
        bookableOnline: bookableOnline !== undefined ? bookableOnline : true,
        sequence: sequence || 0,
        ...(durations && durations.length > 0
          ? {
              durations: {
                create: durations.map((d: { minutes: number; price: number; packageCount?: number }) => ({
                  minutes: Number(d.minutes),
                  price: Number(d.price),
                  packageCount: Number(d.packageCount || 1),
                })),
              },
            }
          : {}),
      },
      include: {
        category: true,
        durations: { orderBy: { minutes: "asc" } },
      },
    });

    return NextResponse.json({ service }, { status: 201 });
  } catch (error) {
    console.error("Admin services POST error:", error);
    return NextResponse.json({ error: "Greska pri kreiranju usluge" }, { status: 500 });
  }
}

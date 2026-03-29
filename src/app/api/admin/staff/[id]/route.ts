import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { email, password, firstName, lastName, phone, role, isAdmin, bio, image, active, sequence } = body;

    const existing = await prisma.staffUser.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Maser nije pronađen" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (email !== undefined) updateData.email = email;
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (phone !== undefined) updateData.phone = phone;
    if (role !== undefined) updateData.role = role;
    if (isAdmin !== undefined) updateData.isAdmin = isAdmin;
    if (bio !== undefined) updateData.bio = bio;
    if (image !== undefined) updateData.image = image;
    if (active !== undefined) updateData.active = active;
    if (sequence !== undefined) updateData.sequence = sequence;

    if (password) {
      updateData.password = await hashPassword(password);
    }

    const staff = await prisma.staffUser.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isAdmin: true,
        bio: true,
        image: true,
        active: true,
        sequence: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ staff });
  } catch (error) {
    console.error("Admin staff PUT error:", error);
    return NextResponse.json({ error: "Greška pri ažuriranju masera" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.staffUser.update({
      where: { id },
      data: { active: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin staff DELETE error:", error);
    return NextResponse.json({ error: "Greška pri deaktiviranju masera" }, { status: 500 });
  }
}

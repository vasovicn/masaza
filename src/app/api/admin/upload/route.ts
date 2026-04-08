import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "Nijedna slika nije poslata" }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    const maxSize = 10 * 1024 * 1024; // 10MB

    const urls: string[] = [];

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: `Nedozvoljen tip fajla: ${file.name}. Dozvoljeni: JPG, PNG, WebP, AVIF` },
          { status: 400 }
        );
      }

      if (file.size > maxSize) {
        return NextResponse.json(
          { error: `Fajl ${file.name} je prevelik. Maksimum je 10MB.` },
          { status: 400 }
        );
      }

      const ext = path.extname(file.name) || ".jpg";
      const uniqueName = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;
      const folderParam = request.nextUrl.searchParams.get("folder");
      const folder = folderParam === "services" ? "services" : "gallery";
      const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
      const filePath = path.join(uploadDir, uniqueName);

      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(filePath, buffer);

      urls.push(`/uploads/${folder}/${uniqueName}`);
    }

    return NextResponse.json({ urls });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Greška pri uploadu" }, { status: 500 });
  }
}

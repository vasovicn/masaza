import { NextRequest, NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/mailer";

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Ime, email i poruka su obavezni" }, { status: 400 });
    }

    await sendContactEmail({ name, email, phone, message });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact error:", error);
    return NextResponse.json({ error: "Greska pri slanju poruke. Pokusajte ponovo ili nas kontaktirajte telefonom." }, { status: 500 });
  }
}

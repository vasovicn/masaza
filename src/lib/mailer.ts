import nodemailer from "nodemailer";
import { SALON_NAME, SALON_EMAIL, ADMIN_EMAIL } from "./constants";

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER || SALON_EMAIL,
      pass: process.env.SMTP_PASS || "",
    },
  });
}

export async function sendBookingConfirmation(booking: {
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  serviceName: string;
  durationMinutes: number;
  price: number;
  date: string;
  startTime: string;
  endTime: string;
  staffName: string;
}) {
  const transporter = getTransporter();

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #9dceb1; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">${SALON_NAME}</h1>
        <p style="color: white; margin: 5px 0;">Potvrda rezervacije</p>
      </div>
      <div style="padding: 30px; background: #f9f9f9;">
        <h2 style="color: #333;">Vasa rezervacija je potvrdjena!</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">Ime i prezime:</td><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">${booking.customerName}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">Telefon:</td><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">${booking.customerPhone}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">Usluga:</td><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">${booking.serviceName}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">Trajanje:</td><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">${booking.durationMinutes} min</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">Cena:</td><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">${booking.price.toLocaleString("sr-RS")} RSD</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">Datum:</td><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">${booking.date}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">Vreme:</td><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">${booking.startTime} - ${booking.endTime}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">Maser:</td><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">${booking.staffName}</td></tr>
        </table>
        <p style="color: #666; margin-top: 20px;">Za otkazivanje ili promenu termina kontaktirajte nas na ${SALON_EMAIL} ili pozovite ${"+381 65 443 231"}.</p>
      </div>
    </div>
  `;

  // Send to admin
  try {
    await transporter.sendMail({
      from: `"${SALON_NAME}" <${process.env.SMTP_USER || SALON_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `Nova rezervacija - ${booking.customerName} - ${booking.date} ${booking.startTime}`,
      html,
    });
  } catch (e) {
    console.error("Failed to send admin email:", e);
  }

  // Send to client if email provided
  if (booking.customerEmail) {
    try {
      await transporter.sendMail({
        from: `"${SALON_NAME}" <${process.env.SMTP_USER || SALON_EMAIL}>`,
        to: booking.customerEmail,
        subject: `Potvrda rezervacije - ${SALON_NAME}`,
        html,
      });
    } catch (e) {
      console.error("Failed to send client email:", e);
    }
  }
}

export async function sendContactEmail(data: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}) {
  const transporter = getTransporter();

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #9dceb1; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">${SALON_NAME}</h1>
        <p style="color: white; margin: 5px 0;">Nova poruka sa kontakt forme</p>
      </div>
      <div style="padding: 30px; background: #f9f9f9;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">Ime:</td><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">${data.name}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">Email:</td><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">${data.email}</td></tr>
          ${data.phone ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">Telefon:</td><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">${data.phone}</td></tr>` : ""}
        </table>
        <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 8px;">
          <p style="color: #666; margin: 0 0 8px;">Poruka:</p>
          <p style="color: #333; margin: 0; white-space: pre-wrap;">${data.message}</p>
        </div>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"${SALON_NAME}" <${process.env.SMTP_USER || SALON_EMAIL}>`,
      to: ADMIN_EMAIL,
      replyTo: data.email,
      subject: `Kontakt forma - ${data.name}`,
      html,
    });
  } catch (e) {
    console.error("Failed to send contact email:", e);
    throw e;
  }
}

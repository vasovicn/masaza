// @ts-ignore
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
        <h2 style="color: #333;">Vaša rezervacija je potvrđena!</h2>
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

export async function sendBookingInquiry(booking: {
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  serviceName: string;
  durationMinutes: number;
  price: number;
  date: string;
  startTime: string;
  endTime: string;
}) {
  const transporter = getTransporter();

  const adminHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #b8860b; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">${SALON_NAME}</h1>
        <p style="color: white; margin: 5px 0;">Nov upit za termin</p>
      </div>
      <div style="padding: 30px; background: #f9f9f9;">
        <h2 style="color: #333;">Nov upit za termin</h2>
        <p style="color: #666;">Klijent je poslao upit za termin koji zahteva vašu potvrdu.</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">Ime i prezime:</td><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">${booking.customerName}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">Telefon:</td><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">${booking.customerPhone}</td></tr>
          ${booking.customerEmail ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">Email:</td><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">${booking.customerEmail}</td></tr>` : ""}
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">Usluga:</td><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">${booking.serviceName}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">Trajanje:</td><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">${booking.durationMinutes} min</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">Cena:</td><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">${booking.price.toLocaleString("sr-RS")} RSD</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">Željeni datum:</td><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">${booking.date}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">Željeno vreme:</td><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">${booking.startTime} - ${booking.endTime}</td></tr>
        </table>
      </div>
    </div>
  `;

  // Send to admin
  try {
    await transporter.sendMail({
      from: `"${SALON_NAME}" <${process.env.SMTP_USER || SALON_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `Nov upit za termin - ${booking.customerName} - ${booking.date} ${booking.startTime}`,
      html: adminHtml,
    });
  } catch (e) {
    console.error("Failed to send admin inquiry email:", e);
  }

  // Send to client if email provided
  if (booking.customerEmail) {
    const clientHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #9dceb1; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">${SALON_NAME}</h1>
          <p style="color: white; margin: 5px 0;">Vaš upit je primljen</p>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333;">Vaš upit je primljen!</h2>
          <p style="color: #666;">Javićemo vam u najkraćem mogućem roku sa potvrdom termina.</p>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">Usluga:</td><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">${booking.serviceName}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">Trajanje:</td><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">${booking.durationMinutes} min</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">Željeni datum:</td><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">${booking.date}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">Željeno vreme:</td><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">${booking.startTime} - ${booking.endTime}</td></tr>
          </table>
          <p style="color: #666; margin-top: 20px;">Za sva pitanja kontaktirajte nas na ${SALON_EMAIL}.</p>
        </div>
      </div>
    `;

    try {
      await transporter.sendMail({
        from: `"${SALON_NAME}" <${process.env.SMTP_USER || SALON_EMAIL}>`,
        to: booking.customerEmail,
        subject: `Vaš upit je primljen - ${SALON_NAME}`,
        html: clientHtml,
      });
    } catch (e) {
      console.error("Failed to send client inquiry email:", e);
    }
  }
}

export async function sendVerificationEmail(email: string, token: string) {
  const transporter = getTransporter();
  const baseUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://masazabalans.rs";
  const verifyUrl = `${baseUrl}/api/auth/verify?token=${token}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #9dceb1; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">${SALON_NAME}</h1>
        <p style="color: white; margin: 5px 0;">Potvrda email adrese</p>
      </div>
      <div style="padding: 30px; background: #f9f9f9; text-align: center;">
        <h2 style="color: #333;">Dobro došli u ${SALON_NAME}!</h2>
        <p style="color: #666;">Kliknite na dugme ispod da potvrdite vašu email adresu i aktivirate nalog.</p>
        <a href="${verifyUrl}" style="display: inline-block; background-color: #5a9e78; color: white; padding: 14px 32px; border-radius: 30px; text-decoration: none; font-weight: bold; margin: 20px 0;">
          Potvrdi email
        </a>
        <p style="color: #999; font-size: 12px; margin-top: 20px;">Ako niste kreirali nalog, ignorišite ovaj email.</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"${SALON_NAME}" <${process.env.SMTP_USER || SALON_EMAIL}>`,
      to: email,
      subject: `Potvrdite email adresu - ${SALON_NAME}`,
      html,
    });
  } catch (e) {
    console.error("Failed to send verification email:", e);
    throw e;
  }
}

export async function sendResetPasswordEmail(email: string, token: string) {
  const transporter = getTransporter();
  const baseUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://masazabalans.rs";
  const resetUrl = `${baseUrl}/reset-lozinka?token=${token}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #9dceb1; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">${SALON_NAME}</h1>
        <p style="color: white; margin: 5px 0;">Resetovanje lozinke</p>
      </div>
      <div style="padding: 30px; background: #f9f9f9; text-align: center;">
        <h2 style="color: #333;">Zaboravili ste lozinku?</h2>
        <p style="color: #666;">Kliknite na dugme ispod da postavite novu lozinku. Link važi 1 sat.</p>
        <a href="${resetUrl}" style="display: inline-block; background-color: #5a9e78; color: white; padding: 14px 32px; border-radius: 30px; text-decoration: none; font-weight: bold; margin: 20px 0;">
          Nova lozinka
        </a>
        <p style="color: #999; font-size: 12px; margin-top: 20px;">Ako niste tražili resetovanje lozinke, ignorišite ovaj email.</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"${SALON_NAME}" <${process.env.SMTP_USER || SALON_EMAIL}>`,
      to: email,
      subject: `Resetovanje lozinke - ${SALON_NAME}`,
      html,
    });
  } catch (e) {
    console.error("Failed to send reset password email:", e);
    throw e;
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

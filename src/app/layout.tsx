import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { SALON_NAME, SALON_PHONE, SALON_EMAIL, SALON_ADDRESS } from "@/lib/constants";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${SALON_NAME} - Profesionalni salon masaze u Beogradu`,
    template: `%s | ${SALON_NAME}`,
  },
  description:
    "Somatic Balans je premium salon masaze u Beogradu koji nudi sirok spektar relaksacionih i terapeutskih masaza. Zakazite termin online i osetite razliku profesionalne masaze.",
  keywords: [
    "masaza",
    "relaksacija",
    "masazni salon",
    "Beograd",
    "sportska masaza",
    "terapeutska masaza",
    "aromaterapija",
    "hot stone masaza",
    "limfna draza",
    "Somatic Balans",
    "wellness",
    "opustanje",
  ],
  authors: [{ name: SALON_NAME }],
  openGraph: {
    type: "website",
    locale: "sr_RS",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    siteName: SALON_NAME,
    title: `${SALON_NAME} - Profesionalni salon masaze u Beogradu`,
    description:
      "Premium salon masaze u Beogradu. Relaksacione i terapeutske masaze prilagodjene vasim potrebama. Zakazite termin online.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HealthAndBeautyBusiness",
  name: SALON_NAME,
  description: "Profesionalni salon masaze u Beogradu",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Beograd",
    addressCountry: "RS",
    streetAddress: SALON_ADDRESS,
  },
  telephone: SALON_PHONE,
  email: SALON_EMAIL,
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "08:00",
      closes: "22:00",
    },
  ],
  priceRange: "2500-8500 RSD",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sr" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}

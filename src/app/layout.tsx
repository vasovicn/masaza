import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import Script from "next/script";
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

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://masazabalans.rs";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `${SALON_NAME} - Salon za masažu u Zemunu, Beograd`,
    template: `%s | ${SALON_NAME}`,
  },
  description:
    "Somatic Balans je premium salon za masažu u Zemunu, Beograd. Širok spektar relaksacionih i terapeutskih masaža. Zakažite termin online i osetite razliku profesionalne masaže.",
  keywords: [
    "masaža",
    "masaža Beograd",
    "masaža Zemun",
    "masažni salon",
    "masažni salon Zemun",
    "masažni salon Beograd",
    "salon za masažu Zemun",
    "salon za masažu Beograd",
    "Somatic Balans",
    "Somatic Balans masaža",
    "Somatic Balans Zemun",
    "Somatic masaža",
    "relaksacija",
    "relaks masaža",
    "relaks masaža Zemun",
    "sportska masaža",
    "sportska masaža Zemun",
    "terapeutska masaža",
    "terapeutska masaža Zemun",
    "aromaterapija",
    "hot stone masaža",
    "limfna drenaža",
    "anticelulit masaža",
    "masaža za trudnice",
    "wellness Zemun",
    "opuštanje",
  ],
  authors: [{ name: SALON_NAME }],
  alternates: { canonical: baseUrl },
  openGraph: {
    type: "website",
    locale: "sr_RS",
    url: baseUrl,
    siteName: SALON_NAME,
    title: `${SALON_NAME} - Salon za masažu u Zemunu, Beograd`,
    description:
      "Salon za masažu u Zemunu, Beograd. Relaksacione i terapeutske masaže prilagođene vašim potrebama. Zakažite termin online.",
    images: [
      {
        url: `${baseUrl}/logo.png`,
        width: 512,
        height: 512,
        alt: SALON_NAME,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: `${SALON_NAME} - Salon za masažu u Beogradu`,
    description: "Relaksacione i terapeutske masaže. Zakažite termin online.",
    images: [`${baseUrl}/logo.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Google Search Console verification - replace with actual value
    // google: "your-verification-code",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: SALON_NAME,
  },
  formatDetection: {
    telephone: false,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HealthAndBeautyBusiness",
  "@id": `${baseUrl}/#business`,
  name: SALON_NAME,
  description: "Profesionalni salon za masažu u Zemunu, Beograd. Relaksacione, terapeutske i specijalizovane masaže.",
  url: baseUrl,
  logo: `${baseUrl}/logo.png`,
  image: `${baseUrl}/logo.png`,
  address: {
    "@type": "PostalAddress",
    streetAddress: SALON_ADDRESS,
    addressLocality: "Beograd",
    addressRegion: "Zemun",
    postalCode: "11080",
    addressCountry: "RS",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 44.8456,
    longitude: 20.4013,
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
  priceRange: "$$",
  currenciesAccepted: "RSD",
  paymentAccepted: "Cash, Credit Card",
  areaServed: {
    "@type": "City",
    name: "Beograd",
  },
  sameAs: [
    "https://www.instagram.com/masaza_balans/",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sr" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <meta name="theme-color" content="#ffffff" />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-V00FNRBND8"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-V00FNRBND8');
          `}
        </Script>
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

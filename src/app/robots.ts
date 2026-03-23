import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/login", "/registracija", "/reset-lozinka", "/zaboravljena-lozinka"],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || "https://masazabalans.rs"}/sitemap.xml`,
  };
}

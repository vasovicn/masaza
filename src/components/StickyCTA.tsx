"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { usePathname } from "next/navigation";

export default function StickyCTA() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  // Hide on booking page — no need to show CTA there
  const isBookingPage = pathname === "/zakazivanje";

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isBookingPage) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-40 transition-all duration-300"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <Link
        href="/zakazivanje"
        className="flex items-center gap-2 px-5 py-3.5 rounded-full text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all hover:opacity-90 hover:-translate-y-0.5"
        style={{ backgroundColor: "#4da070" }}
      >
        <Calendar className="w-4 h-4" />
        Zakaži masažu
      </Link>
    </div>
  );
}

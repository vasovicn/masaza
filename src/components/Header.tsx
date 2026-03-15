"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, Leaf, ChevronDown, User, LogOut, Calendar } from "lucide-react";

interface UserInfo {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  type: string;
  role?: string;
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => setUser(data.user || null))
      .catch(() => setUser(null));
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "DELETE" });
    setUser(null);
    setUserMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  const navLinks = [
    { href: "/", label: "Pocetna" },
    { href: "/usluge", label: "Usluge" },
    { href: "/cenovnik", label: "Cenovnik" },
    { href: "/o-nama", label: "O nama" },
    { href: "/galerija", label: "Galerija" },
    { href: "/faq", label: "FAQ" },
    { href: "/poklon-vaucer", label: "Poklon vaučer" },
    { href: "/kontakt", label: "Kontakt" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: "#9dceb1" }}>
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              Somatic Balans
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-[#9dceb1]"
                    : "text-gray-600 hover:text-[#9dceb1]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {user && user.type === "client" ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: "#9dceb1" }}>
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <span>{user.firstName}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                    <Link
                      href="/moj-nalog"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      Moj nalog
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Odjavi se
                    </button>
                  </div>
                )}
              </div>
            ) : !user ? (
              <Link
                href="/login"
                className="text-sm font-medium text-gray-600 hover:text-[#9dceb1] transition-colors"
              >
                Prijava
              </Link>
            ) : null}

            <Link
              href="/zakazivanje"
              className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-semibold transition-all hover:opacity-90 hover:shadow-md"
              style={{ backgroundColor: "#9dceb1" }}
            >
              <Calendar className="w-4 h-4" />
              Zakazi termin
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4">
          <nav className="pt-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-[#f0f9f4] text-[#9dceb1]"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
            {user && user.type === "client" ? (
              <>
                <Link
                  href="/moj-nalog"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setMobileOpen(false)}
                >
                  <User className="w-4 h-4" />
                  Moj nalog ({user.firstName})
                </Link>
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  Odjavi se
                </button>
              </>
            ) : !user ? (
              <Link
                href="/login"
                className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setMobileOpen(false)}
              >
                Prijava / Registracija
              </Link>
            ) : null}
            <Link
              href="/zakazivanje"
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-full text-white text-sm font-semibold"
              style={{ backgroundColor: "#9dceb1" }}
              onClick={() => setMobileOpen(false)}
            >
              <Calendar className="w-4 h-4" />
              Zakazi termin
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

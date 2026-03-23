"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import NextImage from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Sparkles,
  Tag,
  Image,
  LogOut,
  ChevronRight,
  UserCog,
  Menu,
  X,
} from "lucide-react";

interface Props {
  user: { firstName: string; lastName: string; email: string; role: string };
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/rezervacije", label: "Rezervacije", icon: Calendar },
  { href: "/admin/maseri", label: "Maseri", icon: Users },
  { href: "/admin/usluge", label: "Usluge", icon: Sparkles },
  { href: "/admin/kategorije", label: "Kategorije", icon: Tag },
  { href: "/admin/galerija", label: "Galerija", icon: Image },
  { href: "/admin/korisnici", label: "Korisnici", icon: UserCog },
];

export default function AdminSidebar({ user }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Close sidebar on navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  };

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const handleNavClick = (href: string, active: boolean, e: React.MouseEvent) => {
    if (active) {
      e.preventDefault();
      window.dispatchEvent(new CustomEvent("admin-nav-reset"));
    }
    setOpen(false);
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="p-4 lg:p-6 border-b border-gray-800">
        <Link href="/admin" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <NextImage src="/logo.png" alt="Somatic Balans" width={36} height={36} className="rounded-full" />
          <div>
            <div className="font-bold text-sm" style={{ fontFamily: "'Playfair Display', serif" }}>
              Somatic Balans
            </div>
            <div className="text-xs text-gray-400">Admin panel</div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 lg:p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              onClick={(e) => handleNavClick(href, active, e)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                active
                  ? "text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
              style={active ? { backgroundColor: "#5a9e78" } : {}}
            >
              <Icon className="shrink-0" style={{ width: 18, height: 18 }} />
              <span>{label}</span>
              {active && <ChevronRight className="w-4 h-4 ml-auto opacity-70" />}
            </Link>
          );
        })}
      </nav>

      {/* User & Logout */}
      <div className="p-3 lg:p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ backgroundColor: "#5a9e78" }}>
            {user.firstName[0]}{user.lastName[0]}
          </div>
          <div className="overflow-hidden">
            <div className="text-sm font-medium text-white truncate">{user.firstName} {user.lastName}</div>
            <div className="text-xs text-gray-400 capitalize">{user.role}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm font-medium text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Odjavi se
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-gray-900 flex items-center justify-between px-4 h-14">
        <Link href="/admin" className="flex items-center gap-2">
          <NextImage src="/logo.png" alt="Somatic Balans" width={28} height={28} className="rounded-full" />
          <span className="font-bold text-sm text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
            Somatic Balans
          </span>
        </Link>
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar - mobile: slide-out, desktop: always visible */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-50 lg:z-auto
          w-64 bg-gray-900 text-white flex flex-col h-screen shrink-0
          transition-transform duration-200 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Mobile close button inside sidebar */}
        <button
          onClick={() => setOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
        >
          <X className="w-4 h-4" />
        </button>
        {sidebarContent}
      </aside>
    </>
  );
}

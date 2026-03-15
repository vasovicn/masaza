"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Sparkles,
  Tag,
  Image,
  LogOut,
  Leaf,
  ChevronRight,
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
];

export default function AdminSidebar({ user }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  };

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col h-screen sticky top-0 shrink-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: "#9dceb1" }}>
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-sm" style={{ fontFamily: "'Playfair Display', serif" }}>
              Somatic Balans
            </div>
            <div className="text-xs text-gray-400">Admin panel</div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                active
                  ? "text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
              style={active ? { backgroundColor: "#9dceb1" } : {}}
            >
              <Icon className="w-4.5 h-4.5 shrink-0" style={{ width: 18, height: 18 }} />
              <span>{label}</span>
              {active && <ChevronRight className="w-4 h-4 ml-auto opacity-70" />}
            </Link>
          );
        })}
      </nav>

      {/* User & Logout */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ backgroundColor: "#9dceb1" }}>
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
    </aside>
  );
}

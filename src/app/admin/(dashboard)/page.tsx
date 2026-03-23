import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Calendar, Users, TrendingUp, Clock } from "lucide-react";

export const metadata = {
  title: "Dashboard - Admin",
};

async function getStats() {
  const today = new Date().toISOString().split("T")[0];
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
  const weekStartStr = weekStart.toISOString().split("T")[0];

  const [todayCount, weekCount, totalCount, todayBookings] = await Promise.all([
    prisma.booking.count({ where: { date: today, status: "confirmed" } }),
    prisma.booking.count({ where: { date: { gte: weekStartStr }, status: "confirmed" } }),
    prisma.booking.count({ where: { status: "confirmed" } }),
    prisma.booking.findMany({
      where: { date: today, status: "confirmed" },
      include: {
        service: true,
        serviceDuration: true,
        staffUser: { select: { firstName: true, lastName: true } },
      },
      orderBy: { startTime: "asc" },
    }),
  ]);

  return { todayCount, weekCount, totalCount, todayBookings };
}

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get("staff_token")?.value;
  const payload = token ? await verifyAdminToken(token) : null;

  if (payload && payload.isAdmin !== true) {
    redirect("/admin/rezervacije");
  }

  const { todayCount, weekCount, totalCount, todayBookings } = await getStats();

  const today = new Date();
  const todayFormatted = today.toLocaleDateString("sr-Latn-RS", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
          Dashboard
        </h1>
        <p className="text-gray-500 mt-1">
          Dobrodosli, {payload?.firstName as string}! Danas je {todayFormatted}.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Danas", value: todayCount, icon: Calendar, color: "#9dceb1", href: "/admin/rezervacije" },
          { label: "Ova nedelja", value: weekCount, icon: TrendingUp, color: "#4da070", href: "/admin/rezervacije" },
          { label: "Ukupno potvrdjenih", value: totalCount, icon: Users, color: "#3a8059", href: "/admin/rezervacije" },
        ].map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-[#9dceb1] hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-500">{stat.label}</span>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#f0f9f4" }}>
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-400 mt-1">rezervacija</div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { href: "/admin/rezervacije", label: "Nova rezervacija", icon: Calendar },
          { href: "/admin/maseri", label: "Maseri", icon: Users },
          { href: "/admin/usluge", label: "Usluge", icon: TrendingUp },
          { href: "/admin/galerija", label: "Galerija", icon: Clock },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="flex items-center gap-2 p-4 bg-white rounded-xl border border-gray-100 hover:border-[#9dceb1] hover:shadow-sm transition-all text-sm font-medium text-gray-700 hover:text-[#3a8059]"
          >
            <action.icon className="w-4 h-4 text-[#9dceb1]" />
            {action.label}
          </Link>
        ))}
      </div>

      {/* Today's bookings */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">
            Rezervacije za danas ({todayCount})
          </h2>
        </div>
        {todayBookings.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            <Calendar className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            <p>Nema rezervacija za danas</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {todayBookings.map((booking) => (
              <div key={booking.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                <div className="text-center min-w-[50px]">
                  <div className="font-bold text-gray-900">{booking.startTime}</div>
                  <div className="text-xs text-gray-400">{booking.endTime}</div>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{booking.customerName}</div>
                  <div className="text-sm text-gray-500">{booking.service.name} · {booking.serviceDuration.minutes} min</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-700">
                    {booking.staffUser.firstName} {booking.staffUser.lastName}
                  </div>
                  <div className="text-sm text-gray-400">
                    {booking.serviceDuration.price.toLocaleString("sr-RS")} RSD
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { WORKING_HOURS, SLOT_INTERVAL } from "./constants";
import { prisma } from "./prisma";

export function generateSlots(date: string): string[] {
  const dayOfWeek = new Date(date).getDay();
  if (!WORKING_HOURS.workDays.includes(dayOfWeek)) return [];

  const slots: string[] = [];
  const totalMinutes = (WORKING_HOURS.end - WORKING_HOURS.start) * 60;

  for (let m = 0; m < totalMinutes; m += SLOT_INTERVAL) {
    const hour = WORKING_HOURS.start + Math.floor(m / 60);
    const min = m % 60;
    slots.push(`${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}`);
  }
  return slots;
}

export function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const newH = Math.floor(total / 60);
  const newM = total % 60;
  return `${String(newH).padStart(2, "0")}:${String(newM).padStart(2, "0")}`;
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export async function getAvailableSlots(
  date: string,
  durationMinutes: number
): Promise<{ staffId: string; staffName: string; slots: string[] }[]> {
  const dayOfWeek = new Date(date).getDay();
  if (!WORKING_HOURS.workDays.includes(dayOfWeek)) return [];

  const allStaff = await prisma.staffUser.findMany({
    where: { active: true, role: "maser" },
    orderBy: { sequence: "asc" },
  });

  const bookings = await prisma.booking.findMany({
    where: { date, status: "confirmed" },
  });

  const endOfDay = WORKING_HOURS.end * 60;
  const startOfDay = WORKING_HOURS.start * 60;

  const result = allStaff.map((staff) => {
    const staffBookings = bookings.filter((b) => b.staffUserId === staff.id);
    const allSlots = generateSlots(date);

    const availableSlots = allSlots.filter((slot) => {
      const slotStart = timeToMinutes(slot);
      const slotEnd = slotStart + durationMinutes;

      if (slotEnd > endOfDay) return false;
      if (slotStart < startOfDay) return false;

      // Check if this slot is in the past for today
      const today = new Date().toISOString().split("T")[0];
      if (date === today) {
        const now = new Date();
        const nowMinutes = now.getHours() * 60 + now.getMinutes();
        if (slotStart <= nowMinutes) return false;
      }

      return staffBookings.every((booking) => {
        const bookingStart = timeToMinutes(booking.startTime);
        const bookingEnd = timeToMinutes(booking.endTime);
        return slotEnd <= bookingStart || slotStart >= bookingEnd;
      });
    });

    return {
      staffId: staff.id,
      staffName: `${staff.firstName} ${staff.lastName}`,
      slots: availableSlots,
    };
  });

  return result.filter((s) => s.slots.length > 0);
}

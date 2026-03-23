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

/** Round up minutes to next 30-min boundary (e.g. 14:40 → 15:00, 14:30 → 14:30) */
export function roundUpToSlot(minutes: number): number {
  return Math.ceil(minutes / SLOT_INTERVAL) * SLOT_INTERVAL;
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
        // Round up booking end to next 30-min slot boundary
        const bookingEndRounded = roundUpToSlot(bookingEnd);
        return slotEnd <= bookingStart || slotStart >= bookingEndRounded;
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

/**
 * Atomically check for overlap and create a booking inside a transaction.
 * Prevents race conditions where two users book the same slot simultaneously.
 */
export async function createBookingSafe(data: {
  staffUserId: string;
  date: string;
  startTime: string;
  endTime: string;
  serviceId: string;
  serviceDurationId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  clientUserId?: string | null;
  notes?: string | null;
  status?: string;
}) {
  const newStart = timeToMinutes(data.startTime);
  const newEndRounded = roundUpToSlot(timeToMinutes(data.endTime));

  return await prisma.$transaction(async (tx) => {
    // Re-check for conflicts inside the transaction
    const existing = await tx.booking.findMany({
      where: {
        staffUserId: data.staffUserId,
        date: data.date,
        status: "confirmed",
      },
    });

    const conflict = existing.some((b) => {
      const bStart = timeToMinutes(b.startTime);
      const bEndRounded = roundUpToSlot(timeToMinutes(b.endTime));
      return newStart < bEndRounded && newEndRounded > bStart;
    });

    if (conflict) {
      throw new Error("SLOT_TAKEN");
    }

    return await tx.booking.create({
      data: {
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail || null,
        clientUserId: data.clientUserId || null,
        serviceId: data.serviceId,
        serviceDurationId: data.serviceDurationId,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        staffUserId: data.staffUserId,
        notes: data.notes || null,
        status: data.status || "confirmed",
      },
      include: {
        service: true,
        serviceDuration: true,
        staffUser: true,
      },
    });
  });
}

// Returns unique time slots where at least one therapist is available
export async function getAvailableTimeSlotsAggregated(
  date: string,
  durationMinutes: number
): Promise<string[]> {
  const perStaff = await getAvailableSlots(date, durationMinutes);
  const slotSet = new Set<string>();
  for (const staffSlot of perStaff) {
    for (const slot of staffSlot.slots) {
      slotSet.add(slot);
    }
  }
  return Array.from(slotSet).sort();
}

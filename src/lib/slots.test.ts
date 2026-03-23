import { describe, it, expect } from "vitest";
import {
  generateSlots,
  addMinutes,
  timeToMinutes,
  roundUpToSlot,
} from "./slots";

// ────────────────────────────────────────────
// Helpers – pure overlap check extracted from
// createBookingSafe / getAvailableSlots logic
// ────────────────────────────────────────────

interface Booking {
  startTime: string;
  endTime: string;
}

/** Returns true when two bookings overlap (same logic as createBookingSafe) */
function hasOverlap(a: Booking, b: Booking): boolean {
  const aStart = timeToMinutes(a.startTime);
  const aEndRounded = roundUpToSlot(timeToMinutes(a.endTime));
  const bStart = timeToMinutes(b.startTime);
  const bEndRounded = roundUpToSlot(timeToMinutes(b.endTime));
  return aStart < bEndRounded && aEndRounded > bStart;
}

/** Returns true when a new booking conflicts with any existing booking */
function conflictsWithAny(
  newBooking: Booking,
  existing: Booking[]
): boolean {
  return existing.some((b) => hasOverlap(newBooking, b));
}

/** Check that a slot (startTime + durationMinutes) is free for a staff member */
function isSlotAvailable(
  slot: string,
  durationMinutes: number,
  staffBookings: Booking[]
): boolean {
  const slotStart = timeToMinutes(slot);
  const slotEnd = slotStart + durationMinutes;

  return staffBookings.every((booking) => {
    const bookingStart = timeToMinutes(booking.startTime);
    const bookingEnd = timeToMinutes(booking.endTime);
    const bookingEndRounded = roundUpToSlot(bookingEnd);
    return slotEnd <= bookingStart || slotStart >= bookingEndRounded;
  });
}

// ─────────────────
// Utility functions
// ─────────────────

describe("timeToMinutes", () => {
  it("converts HH:MM to minutes from midnight", () => {
    expect(timeToMinutes("00:00")).toBe(0);
    expect(timeToMinutes("08:00")).toBe(480);
    expect(timeToMinutes("14:30")).toBe(870);
    expect(timeToMinutes("22:00")).toBe(1320);
  });
});

describe("addMinutes", () => {
  it("adds minutes to a time string", () => {
    expect(addMinutes("08:00", 30)).toBe("08:30");
    expect(addMinutes("08:00", 60)).toBe("09:00");
    expect(addMinutes("14:30", 90)).toBe("16:00");
    expect(addMinutes("21:00", 60)).toBe("22:00");
  });

  it("handles crossing hour boundaries", () => {
    expect(addMinutes("08:45", 30)).toBe("09:15");
    // addMinutes does not wrap around midnight (not needed for 08:00-22:00 salon hours)
    expect(addMinutes("23:30", 60)).toBe("24:30");
  });
});

describe("roundUpToSlot", () => {
  it("rounds up to the nearest 30-minute boundary", () => {
    expect(roundUpToSlot(870)).toBe(870);  // 14:30 → 14:30 (already on boundary)
    expect(roundUpToSlot(880)).toBe(900);  // 14:40 → 15:00
    expect(roundUpToSlot(900)).toBe(900);  // 15:00 → 15:00 (already on boundary)
    expect(roundUpToSlot(481)).toBe(510);  // 08:01 → 08:30
    expect(roundUpToSlot(480)).toBe(480);  // 08:00 → 08:00
  });
});

describe("generateSlots", () => {
  it("generates 30-minute slots from 08:00 to 21:30 on a workday", () => {
    // 2026-03-23 is Monday
    const slots = generateSlots("2026-03-23");
    expect(slots[0]).toBe("08:00");
    expect(slots[slots.length - 1]).toBe("21:30");
    expect(slots.length).toBe(28); // 14 hours * 2 slots
  });

  it("returns empty array for Sunday", () => {
    // 2026-03-22 is Sunday
    const slots = generateSlots("2026-03-22");
    expect(slots).toEqual([]);
  });

  it("returns slots for Saturday", () => {
    // 2026-03-28 is Saturday
    const slots = generateSlots("2026-03-28");
    expect(slots.length).toBe(28);
  });
});

// ──────────────────────────────────────────────
// Core overlap detection – the most important tests
// ──────────────────────────────────────────────

describe("hasOverlap – two bookings", () => {
  it("detects exact same time slot", () => {
    const a: Booking = { startTime: "10:00", endTime: "11:00" };
    const b: Booking = { startTime: "10:00", endTime: "11:00" };
    expect(hasOverlap(a, b)).toBe(true);
  });

  it("detects partial overlap – new booking starts during existing", () => {
    const existing: Booking = { startTime: "10:00", endTime: "11:00" };
    const newBooking: Booking = { startTime: "10:30", endTime: "11:30" };
    expect(hasOverlap(existing, newBooking)).toBe(true);
  });

  it("detects partial overlap – new booking ends during existing", () => {
    const existing: Booking = { startTime: "10:00", endTime: "11:00" };
    const newBooking: Booking = { startTime: "09:00", endTime: "10:30" };
    expect(hasOverlap(existing, newBooking)).toBe(true);
  });

  it("detects when new booking fully contains existing", () => {
    const existing: Booking = { startTime: "10:00", endTime: "11:00" };
    const newBooking: Booking = { startTime: "09:00", endTime: "12:00" };
    expect(hasOverlap(existing, newBooking)).toBe(true);
  });

  it("detects when existing fully contains new booking", () => {
    const existing: Booking = { startTime: "09:00", endTime: "12:00" };
    const newBooking: Booking = { startTime: "10:00", endTime: "11:00" };
    expect(hasOverlap(existing, newBooking)).toBe(true);
  });

  it("allows booking immediately after (no gap needed if on 30-min boundary)", () => {
    const existing: Booking = { startTime: "10:00", endTime: "11:00" };
    const newBooking: Booking = { startTime: "11:00", endTime: "12:00" };
    expect(hasOverlap(existing, newBooking)).toBe(false);
  });

  it("allows booking immediately before", () => {
    const existing: Booking = { startTime: "11:00", endTime: "12:00" };
    const newBooking: Booking = { startTime: "10:00", endTime: "11:00" };
    expect(hasOverlap(existing, newBooking)).toBe(false);
  });

  it("allows non-adjacent bookings with gap", () => {
    const existing: Booking = { startTime: "10:00", endTime: "11:00" };
    const newBooking: Booking = { startTime: "13:00", endTime: "14:00" };
    expect(hasOverlap(existing, newBooking)).toBe(false);
  });

  it("detects overlap when booking end is not on 30-min boundary (rounded up)", () => {
    // Booking ends at 10:45, rounded up to 11:00
    const existing: Booking = { startTime: "10:00", endTime: "10:45" };
    // New booking starts at 10:45 – but existing rounds to 11:00, so overlap!
    const newBooking: Booking = { startTime: "10:45", endTime: "11:30" };
    expect(hasOverlap(existing, newBooking)).toBe(true);
  });

  it("allows booking after rounded-up end time", () => {
    // Booking ends at 10:45, rounded up to 11:00
    const existing: Booking = { startTime: "10:00", endTime: "10:45" };
    // Booking starts at 11:00 – exactly at rounded boundary
    const newBooking: Booking = { startTime: "11:00", endTime: "12:00" };
    expect(hasOverlap(existing, newBooking)).toBe(false);
  });
});

describe("conflictsWithAny – multiple existing bookings", () => {
  const schedule: Booking[] = [
    { startTime: "08:00", endTime: "09:00" },
    { startTime: "10:00", endTime: "11:30" },
    { startTime: "14:00", endTime: "15:00" },
  ];

  it("detects conflict with first booking", () => {
    expect(conflictsWithAny({ startTime: "08:00", endTime: "09:00" }, schedule)).toBe(true);
  });

  it("detects conflict with middle booking", () => {
    expect(conflictsWithAny({ startTime: "10:30", endTime: "11:00" }, schedule)).toBe(true);
  });

  it("detects conflict with last booking", () => {
    expect(conflictsWithAny({ startTime: "14:30", endTime: "15:30" }, schedule)).toBe(true);
  });

  it("allows booking in gap between first and second", () => {
    expect(conflictsWithAny({ startTime: "09:00", endTime: "10:00" }, schedule)).toBe(false);
  });

  it("allows booking in gap between second and third", () => {
    // Second ends at 11:30 → rounds to 11:30 (on boundary)
    expect(conflictsWithAny({ startTime: "12:00", endTime: "13:00" }, schedule)).toBe(false);
  });

  it("allows booking after all existing", () => {
    expect(conflictsWithAny({ startTime: "16:00", endTime: "17:00" }, schedule)).toBe(false);
  });

  it("rejects booking that spans two existing bookings", () => {
    expect(conflictsWithAny({ startTime: "08:30", endTime: "10:30" }, schedule)).toBe(true);
  });
});

// ──────────────────────────────────
// isSlotAvailable – slot-level check
// ──────────────────────────────────

describe("isSlotAvailable", () => {
  const staffBookings: Booking[] = [
    { startTime: "09:00", endTime: "10:00" },
    { startTime: "13:00", endTime: "14:30" },
  ];

  it("rejects slot that overlaps with an existing booking (60 min service)", () => {
    expect(isSlotAvailable("09:00", 60, staffBookings)).toBe(false);
    expect(isSlotAvailable("09:30", 60, staffBookings)).toBe(false);
  });

  it("rejects slot that starts before and extends into a booking", () => {
    expect(isSlotAvailable("08:30", 60, staffBookings)).toBe(false);
  });

  it("allows slot immediately after booking on 30-min boundary", () => {
    // Booking 09:00-10:00, rounded end = 10:00
    expect(isSlotAvailable("10:00", 60, staffBookings)).toBe(true);
  });

  it("allows slot in free window between bookings", () => {
    // Between 10:00 and 13:00 there's a 3-hour gap
    expect(isSlotAvailable("10:30", 60, staffBookings)).toBe(true);
    expect(isSlotAvailable("11:00", 90, staffBookings)).toBe(true);
  });

  it("rejects slot where service duration extends into next booking", () => {
    // 90min service starting at 12:00 → ends 13:30, conflicts with 13:00
    expect(isSlotAvailable("12:00", 90, staffBookings)).toBe(false);
  });

  it("rejects slot within booking that has non-30-min end time", () => {
    // Booking 13:00-14:30 rounded end = 14:30
    expect(isSlotAvailable("14:00", 60, staffBookings)).toBe(false);
  });

  it("allows slot after rounded-up end of non-boundary booking", () => {
    // Booking ends at 14:30, rounds to 14:30
    expect(isSlotAvailable("14:30", 60, staffBookings)).toBe(true);
  });

  it("handles 30-minute service correctly", () => {
    expect(isSlotAvailable("08:00", 30, staffBookings)).toBe(true);
    expect(isSlotAvailable("08:30", 30, staffBookings)).toBe(true);
    expect(isSlotAvailable("09:00", 30, staffBookings)).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────
// Scenario tests – full day booking without overlaps
// ─────────────────────────────────────────────────────────

describe("full day scenario – no overlaps allowed", () => {
  it("sequential 60-minute bookings never overlap", () => {
    const bookings: Booking[] = [];
    const times = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00"];

    for (const time of times) {
      const newBooking: Booking = {
        startTime: time,
        endTime: addMinutes(time, 60),
      };
      // Must not conflict with anything already booked
      expect(conflictsWithAny(newBooking, bookings)).toBe(false);
      bookings.push(newBooking);
    }

    // Verify every pair is non-overlapping
    for (let i = 0; i < bookings.length; i++) {
      for (let j = i + 1; j < bookings.length; j++) {
        expect(hasOverlap(bookings[i], bookings[j])).toBe(false);
      }
    }
  });

  it("mixed-duration bookings never overlap when placed in sequence", () => {
    const schedule: { start: string; duration: number }[] = [
      { start: "08:00", duration: 90 },  // 08:00-09:30
      { start: "09:30", duration: 60 },  // 09:30-10:30
      { start: "10:30", duration: 45 },  // 10:30-11:15 → rounded to 11:30
      { start: "11:30", duration: 30 },  // 11:30-12:00
      { start: "12:00", duration: 120 }, // 12:00-14:00
      { start: "14:00", duration: 60 },  // 14:00-15:00
    ];

    const bookings: Booking[] = schedule.map((s) => ({
      startTime: s.start,
      endTime: addMinutes(s.start, s.duration),
    }));

    // No pair should overlap
    for (let i = 0; i < bookings.length; i++) {
      for (let j = i + 1; j < bookings.length; j++) {
        expect(hasOverlap(bookings[i], bookings[j])).toBe(false);
      }
    }
  });

  it("rejects any attempt to double-book within a fully packed schedule", () => {
    const bookings: Booking[] = [
      { startTime: "08:00", endTime: "09:00" },
      { startTime: "09:00", endTime: "10:00" },
      { startTime: "10:00", endTime: "11:00" },
      { startTime: "11:00", endTime: "12:00" },
      { startTime: "12:00", endTime: "13:00" },
    ];

    // Try every 30-min slot within the packed range
    const allSlots = generateSlots("2026-03-23"); // Monday
    const packedSlots = allSlots.filter(
      (s) => timeToMinutes(s) >= 480 && timeToMinutes(s) < 780
    );

    for (const slot of packedSlots) {
      for (const duration of [30, 60, 90]) {
        const attempt: Booking = {
          startTime: slot,
          endTime: addMinutes(slot, duration),
        };
        expect(conflictsWithAny(attempt, bookings)).toBe(true);
      }
    }
  });
});

// ──────────────────────────────────────────
// Edge cases with rounding
// ──────────────────────────────────────────

describe("rounding edge cases", () => {
  it("45-min booking blocks the entire rounded slot", () => {
    // 10:00-10:45 rounds to 10:00-11:00
    const existing: Booking = { startTime: "10:00", endTime: "10:45" };

    // 10:45-11:15 should be blocked because existing rounds to 11:00
    expect(hasOverlap(existing, { startTime: "10:45", endTime: "11:15" })).toBe(true);

    // 11:00-11:30 should be free
    expect(hasOverlap(existing, { startTime: "11:00", endTime: "11:30" })).toBe(false);
  });

  it("booking ending exactly on boundary does not block next slot", () => {
    const existing: Booking = { startTime: "10:00", endTime: "11:00" };
    const next: Booking = { startTime: "11:00", endTime: "12:00" };
    expect(hasOverlap(existing, next)).toBe(false);
  });

  it("1-minute booking still blocks the full 30-minute slot due to rounding", () => {
    // 10:00-10:01 → rounds to 10:00-10:30
    const existing: Booking = { startTime: "10:00", endTime: "10:01" };
    const attempt: Booking = { startTime: "10:00", endTime: "10:30" };
    expect(hasOverlap(existing, attempt)).toBe(true);
  });

  it("booking at 10:29 rounds end to 10:30", () => {
    const existing: Booking = { startTime: "10:00", endTime: "10:29" };
    // 10:29 → roundUpToSlot(629) = 630 = 10:30
    // So slot at 10:30 should be free
    const next: Booking = { startTime: "10:30", endTime: "11:00" };
    expect(hasOverlap(existing, next)).toBe(false);
  });
});

// ──────────────────────────────────────────
// Multi-staff scenarios
// ──────────────────────────────────────────

describe("multi-staff – bookings are per-staff", () => {
  it("same time slot is valid for different staff members", () => {
    const staff1Bookings: Booking[] = [
      { startTime: "10:00", endTime: "11:00" },
    ];
    const staff2Bookings: Booking[] = [];

    // Staff 1 at 10:00 is taken
    expect(isSlotAvailable("10:00", 60, staff1Bookings)).toBe(false);
    // Staff 2 at 10:00 is free
    expect(isSlotAvailable("10:00", 60, staff2Bookings)).toBe(true);
  });

  it("each staff has independent schedule", () => {
    const staff1Bookings: Booking[] = [
      { startTime: "08:00", endTime: "09:00" },
      { startTime: "11:00", endTime: "12:00" },
    ];
    const staff2Bookings: Booking[] = [
      { startTime: "09:00", endTime: "10:00" },
      { startTime: "13:00", endTime: "14:00" },
    ];

    // Staff 1 free at 09:00, Staff 2 busy
    expect(isSlotAvailable("09:00", 60, staff1Bookings)).toBe(true);
    expect(isSlotAvailable("09:00", 60, staff2Bookings)).toBe(false);

    // Staff 1 busy at 11:00, Staff 2 free
    expect(isSlotAvailable("11:00", 60, staff1Bookings)).toBe(false);
    expect(isSlotAvailable("11:00", 60, staff2Bookings)).toBe(true);
  });
});

// ──────────────────────────────────────────
// Boundary / stress tests
// ──────────────────────────────────────────

describe("boundary tests", () => {
  it("booking at very start of day (08:00)", () => {
    const bookings: Booking[] = [{ startTime: "08:00", endTime: "09:00" }];
    expect(isSlotAvailable("08:00", 30, bookings)).toBe(false);
    expect(isSlotAvailable("07:30", 60, bookings)).toBe(false); // extends into 08:00
  });

  it("booking at very end of day (21:00-22:00)", () => {
    const bookings: Booking[] = [{ startTime: "21:00", endTime: "22:00" }];
    expect(isSlotAvailable("21:00", 60, bookings)).toBe(false);
    expect(isSlotAvailable("21:30", 30, bookings)).toBe(false);
  });

  it("back-to-back bookings fill the entire day without gaps", () => {
    const bookings: Booking[] = [];
    for (let hour = 8; hour < 22; hour++) {
      bookings.push({
        startTime: `${String(hour).padStart(2, "0")}:00`,
        endTime: `${String(hour + 1).padStart(2, "0")}:00`,
      });
    }

    // 14 bookings, no pair should overlap
    for (let i = 0; i < bookings.length; i++) {
      for (let j = i + 1; j < bookings.length; j++) {
        expect(hasOverlap(bookings[i], bookings[j])).toBe(false);
      }
    }

    // Every 30-min slot in the day should be taken
    const allSlots = generateSlots("2026-03-23");
    for (const slot of allSlots) {
      expect(isSlotAvailable(slot, 30, bookings)).toBe(false);
    }
  });
});

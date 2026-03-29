import { describe, it, expect } from "vitest";
import { DIRECT_BOOKING_TIMES } from "./constants";

/**
 * Helper: determines if a given time slot on a given date should be an inquiry
 * (same logic used by StepTime component)
 */
function isInquirySlot(time: string, isToday: boolean): boolean {
  if (isToday) return true;
  return !DIRECT_BOOKING_TIMES.includes(time);
}

/**
 * Helper: checks if a date string is today
 */
function checkIsToday(dateStr: string): boolean {
  return dateStr === new Date().toISOString().split("T")[0];
}

// ─────────────────────────────────────────
// DIRECT_BOOKING_TIMES constant
// ─────────────────────────────────────────

describe("DIRECT_BOOKING_TIMES", () => {
  it("contains exactly the three allowed direct booking times", () => {
    expect(DIRECT_BOOKING_TIMES).toEqual(["11:00", "15:00", "16:30"]);
  });

  it("does not include common times that should be inquiry-only", () => {
    expect(DIRECT_BOOKING_TIMES).not.toContain("09:00");
    expect(DIRECT_BOOKING_TIMES).not.toContain("10:00");
    expect(DIRECT_BOOKING_TIMES).not.toContain("12:00");
    expect(DIRECT_BOOKING_TIMES).not.toContain("14:00");
    expect(DIRECT_BOOKING_TIMES).not.toContain("17:00");
  });
});

// ─────────────────────────────────────────
// Inquiry slot determination
// ─────────────────────────────────────────

describe("isInquirySlot", () => {
  describe("when date is NOT today", () => {
    it("returns false for direct booking times (11:00, 15:00, 16:30)", () => {
      expect(isInquirySlot("11:00", false)).toBe(false);
      expect(isInquirySlot("15:00", false)).toBe(false);
      expect(isInquirySlot("16:30", false)).toBe(false);
    });

    it("returns true for all other times", () => {
      const inquiryTimes = [
        "09:00", "09:30", "10:00", "10:30",
        "11:30", "12:00", "12:30", "13:00", "13:30",
        "14:00", "14:30", "15:30", "16:00",
        "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
      ];
      for (const time of inquiryTimes) {
        expect(isInquirySlot(time, false)).toBe(true);
      }
    });
  });

  describe("when date IS today", () => {
    it("returns true for ALL times, including direct booking times", () => {
      expect(isInquirySlot("11:00", true)).toBe(true);
      expect(isInquirySlot("15:00", true)).toBe(true);
      expect(isInquirySlot("16:30", true)).toBe(true);
    });

    it("returns true for non-direct times as well", () => {
      expect(isInquirySlot("09:00", true)).toBe(true);
      expect(isInquirySlot("12:00", true)).toBe(true);
      expect(isInquirySlot("14:00", true)).toBe(true);
    });
  });
});

// ─────────────────────────────────────────
// isToday check
// ─────────────────────────────────────────

describe("checkIsToday", () => {
  it("returns true for today's date", () => {
    const today = new Date().toISOString().split("T")[0];
    expect(checkIsToday(today)).toBe(true);
  });

  it("returns false for tomorrow", () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];
    expect(checkIsToday(tomorrowStr)).toBe(false);
  });

  it("returns false for yesterday", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];
    expect(checkIsToday(yesterdayStr)).toBe(false);
  });
});

// ─────────────────────────────────────────
// Booking API request body scenarios
// ─────────────────────────────────────────

describe("booking request body construction", () => {
  function buildRequestBody(opts: {
    isInquiry: boolean;
    serviceId: string;
    date: string;
    startTime: string;
  }) {
    return {
      serviceId: opts.serviceId,
      serviceDurationId: "dur-1",
      date: opts.date,
      startTime: opts.startTime,
      customerName: "Test User",
      customerPhone: "0612345678",
      ...(opts.isInquiry ? { status: "inquiry" } : {}),
    };
  }

  it("includes status: inquiry for inquiry bookings", () => {
    const body = buildRequestBody({
      isInquiry: true,
      serviceId: "svc-1",
      date: "2026-04-01",
      startTime: "13:00",
    });
    expect(body.status).toBe("inquiry");
  });

  it("does not include status field for direct bookings", () => {
    const body = buildRequestBody({
      isInquiry: false,
      serviceId: "svc-1",
      date: "2026-04-01",
      startTime: "11:00",
    });
    expect(body).not.toHaveProperty("status");
  });

  it("inquiry for today's direct booking time still has inquiry status", () => {
    const today = new Date().toISOString().split("T")[0];
    const isToday = true;
    const time = "11:00"; // normally direct, but today = inquiry
    const isInquiry = isInquirySlot(time, isToday);

    const body = buildRequestBody({
      isInquiry,
      serviceId: "svc-1",
      date: today,
      startTime: time,
    });
    expect(body.status).toBe("inquiry");
  });
});

// ─────────────────────────────────────────
// Full scenario coverage
// ─────────────────────────────────────────

describe("full booking flow scenarios", () => {
  it("tomorrow at 11:00 → direct booking", () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split("T")[0];
    const isToday = checkIsToday(dateStr);

    expect(isToday).toBe(false);
    expect(isInquirySlot("11:00", isToday)).toBe(false);
  });

  it("tomorrow at 13:00 → inquiry", () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split("T")[0];
    const isToday = checkIsToday(dateStr);

    expect(isToday).toBe(false);
    expect(isInquirySlot("13:00", isToday)).toBe(true);
  });

  it("today at 15:00 → inquiry (today overrides direct)", () => {
    const today = new Date().toISOString().split("T")[0];
    const isTodayFlag = checkIsToday(today);

    expect(isTodayFlag).toBe(true);
    expect(isInquirySlot("15:00", isTodayFlag)).toBe(true);
  });

  it("today at 09:30 → inquiry", () => {
    const today = new Date().toISOString().split("T")[0];
    const isTodayFlag = checkIsToday(today);

    expect(isTodayFlag).toBe(true);
    expect(isInquirySlot("09:30", isTodayFlag)).toBe(true);
  });

  it("next week at 16:30 → direct booking", () => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const dateStr = nextWeek.toISOString().split("T")[0];
    const isToday = checkIsToday(dateStr);

    expect(isToday).toBe(false);
    expect(isInquirySlot("16:30", isToday)).toBe(false);
  });

  it("next week at 16:00 → inquiry (not in direct list)", () => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const dateStr = nextWeek.toISOString().split("T")[0];
    const isToday = checkIsToday(dateStr);

    expect(isToday).toBe(false);
    expect(isInquirySlot("16:00", isToday)).toBe(true);
  });
});

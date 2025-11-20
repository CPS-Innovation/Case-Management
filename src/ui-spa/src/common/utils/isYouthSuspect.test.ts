import { isYouthSuspect, isUnder18 } from "./isYouthSuspect";

beforeAll(() => {
  vi.setSystemTime(new Date("2025-11-19T00:00:00Z"));
});

afterAll(() => {
  vi.useRealTimers();
});

describe("isYouthSuspect / isUnder18", () => {
  it("returns true for offender shortCode 'PYO', 'PPO & PYO' and 'YO'", () => {
    const codes = ["PYO", "PPO & PYO", "YO"];
    for (const code of codes) {
      const suspect = {
        suspectOffenderTypesRadio: { shortCode: code },
        suspectDOBDayText: "",
        suspectDOBMonthText: "",
        suspectDOBYearText: "",
      } as any;
      expect(isYouthSuspect(suspect)).toBe(true);
    }
  });

  it("isUnder18 returns true for a clearly under-18 ISO DOB", () => {
    expect(isUnder18("2010-01-01")).toBe(true);
  });

  it("isUnder18 returns false for exactly 18th birthday", () => {
    expect(isUnder18("2007-11-19")).toBe(false);
  });
  it("isUnder18 returns true for exactly one day before 18th birthday", () => {
    expect(isUnder18("2007-11-20")).toBe(true);
  });

  it("isUnder18 returns false for a clearly over-18 ISO DOB", () => {
    expect(isUnder18("")).toBe(false);
  });
  it("isYouthSuspect defers to isUnder18 when offender type is not youth", () => {
    const suspect = {
      suspectOffenderTypesRadio: { shortCode: "" },
      suspectDOBDayText: "5",
      suspectDOBMonthText: "6",
      suspectDOBYearText: "2010",
    } as any;

    expect(isYouthSuspect(suspect)).toBe(true);
  });

  it("isYouthSuspect returns false when offender type is not youth and isUnder18 is false", () => {
    const suspect = {
      suspectOffenderTypesRadio: { shortCode: "" },
      suspectDOBDayText: "1",
      suspectDOBMonthText: "1",
      suspectDOBYearText: "2000",
    } as any;

    expect(isYouthSuspect(suspect)).toBe(false);
  });
});

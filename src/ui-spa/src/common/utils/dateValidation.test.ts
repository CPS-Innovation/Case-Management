import { validateDate } from "./dateValidation";

describe("validateDate", () => {
  it("validates a normal valid date", () => {
    const res = validateDate(15, 6, 2023);
    expect(res.isValid).toBe(true);
    expect(res.errors).toEqual([]);
  });

  it("rejects invalid year", () => {
    const res = validateDate(1, 1, 99);
    expect(res.isValid).toBe(false);
    expect(res.errors).toContain("invalid year");
  });

  it("rejects invalid month", () => {
    const res = validateDate(1, 13, 2023);
    expect(res.isValid).toBe(false);
    expect(res.errors).toContain("invalid month");
  });

  it("rejects invalid day for non-leap february", () => {
    const res = validateDate(29, 2, 2019);
    expect(res.isValid).toBe(false);
    expect(res.errors).toContain("invalid day");
  });

  it("accepts 29 feb on leap year", () => {
    const res = validateDate(29, 2, 2020);
    expect(res.isValid).toBe(true);
    expect(res.errors).toEqual([]);
  });

  it("rejects day out of range ", () => {
    const res = validateDate(32, 1, 2023);
    expect(res.isValid).toBe(false);
    expect(res.errors).toContain("invalid day");
  });

  it("returns multiple errors when multiple parts are invalid", () => {
    const res = validateDate(32, 13, 99);
    expect(res.isValid).toBe(false);
    expect(res.errors).toEqual(
      expect.arrayContaining(["invalid year", "invalid month", "invalid day"]),
    );
  });
});

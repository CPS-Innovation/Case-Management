import { getCurrentAge } from "./getCurrentAge";

describe("getCurrentAge", () => {
  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2020-01-01T00:00:00Z"));
  });

  afterAll(() => {
    vi.useRealTimers();
  });
  it("should return the correct age for a valid date", () => {
    const age = getCurrentAge("2000-01-01");
    expect(age).toBe(20);
  });
  it("should return the correct age for 2010-01-02", () => {
    const age = getCurrentAge("2010-01-02");
    expect(age).toBe(9);
  });
  it("should return the correct age for 1900-01-01", () => {
    const age = getCurrentAge("1900-01-01");
    expect(age).toBe(120);
  });
  it("should return the correct age for 1899-01-01", () => {
    const age = getCurrentAge("1899-01-01");
    expect(age).toBe(121);
  });
  it("should return the correct age for 1899-12-31", () => {
    const age = getCurrentAge("1899-12-31");
    expect(age).toBe(120);
  });
  it("should return null for an invalid date", () => {
    const age = getCurrentAge("invalid-date");
    expect(age).toBeNull();
  });

  it("should return null for an invalid date", () => {
    const age = getCurrentAge("20-00");
    expect(age).toBeNull();
  });
});

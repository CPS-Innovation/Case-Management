import { isValidOnOrAfterDate } from "./isValidOnOrAfterDate";
describe("isValidOnOrAfterDate", () => {
  it("returns true when input equals comparison date", () => {
    expect(isValidOnOrAfterDate("2025-01-02", "2025-01-02")).toBe(true);
  });

  it("returns true when input is after comparison date", () => {
    expect(isValidOnOrAfterDate("2025-01-03", "2025-01-02")).toBe(true);
  });

  it("returns false when input is before comparison date", () => {
    expect(isValidOnOrAfterDate("2025-01-01", "2025-01-02")).toBe(false);
  });

  it("returns false for invalid input date format", () => {
    expect(isValidOnOrAfterDate("2025/01/02", "2025-01-02")).toBe(false);
    expect(isValidOnOrAfterDate("01-02-2025", "2025-01-02")).toBe(false);
  });

  it("returns false when comparison date is invalid", () => {
    expect(isValidOnOrAfterDate("2025-01-02", "not-a-date")).toBe(false);
  });

  describe("when using default comparisonDate (today)", () => {
    beforeAll(() => {
      vi.setSystemTime(new Date("2025-05-10T12:00:00Z"));
    });

    afterAll(() => {
      vi.useRealTimers();
    });

    it("considers tomorrow as future (true)", () => {
      expect(isValidOnOrAfterDate("2025-05-11")).toBe(true);
    });

    it("considers today as on/after (true)", () => {
      expect(isValidOnOrAfterDate("2025-05-10")).toBe(true);
    });

    it("considers yesterday as before (false)", () => {
      expect(isValidOnOrAfterDate("2025-05-09")).toBe(false);
    });
  });
});

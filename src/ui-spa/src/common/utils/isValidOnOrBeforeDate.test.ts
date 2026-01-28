import { isValidOnOrBeforeDate } from "./isValidOnOrBeforeDate";

describe("isValidOnOrBeforeDate", () => {
  it("returns true when input equals comparison date", () => {
    expect(isValidOnOrBeforeDate("2025-01-02", "2025-01-02")).toBe(true);
  });

  it("returns true when input is before comparison date", () => {
    expect(isValidOnOrBeforeDate("2025-01-01", "2025-01-02")).toBe(true);
  });

  it("returns false when input is after comparison date", () => {
    expect(isValidOnOrBeforeDate("2025-01-03", "2025-01-02")).toBe(false);
  });

  it("returns false for invalid input date formats", () => {
    expect(isValidOnOrBeforeDate("2025/01/02", "2025-01-02")).toBe(false);
    expect(isValidOnOrBeforeDate("not-a-date", "2025-01-02")).toBe(false);
  });

  describe("when using default comparisonDate (today)", () => {
    beforeAll(() => {
      vi.setSystemTime(new Date("2025-05-10T12:00:00Z"));
    });

    afterAll(() => {
      vi.useRealTimers();
    });

    it("considers yesterday on or before today (true)", () => {
      expect(isValidOnOrBeforeDate("2025-05-09")).toBe(true);
    });

    it("considers today on or before today (true)", () => {
      expect(isValidOnOrBeforeDate("2025-05-10")).toBe(true);
    });

    it("considers tomorrow after today (false)", () => {
      expect(isValidOnOrBeforeDate("2025-05-11")).toBe(false);
    });
  });
});

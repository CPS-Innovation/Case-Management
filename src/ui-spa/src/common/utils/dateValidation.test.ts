import { type Mock } from "vitest";
import { validateDate } from "./dateValidation";
import { dobValidationConstants } from "../constants/dobValidationConstants";

vi.mock("./getCurrentAge", () => ({
  getCurrentAge: vi.fn(() => 10),
}));
import { getCurrentAge } from "./getCurrentAge";

describe("validateDate", () => {
  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2020-01-01T00:00:00Z"));
  });

  afterAll(() => {
    vi.useRealTimers();
  });
  afterEach(() => {
    (getCurrentAge as Mock).mockClear();
  });

  it("validates a normal valid date", () => {
    const res = validateDate(15, 6, 2000);
    expect(getCurrentAge).toHaveBeenCalledWith("2000-6-15");
    expect(res.isValid).toBe(true);
    expect(res.errors).toEqual([]);
  });

  it("rejects invalid year", () => {
    const res = validateDate(1, 1, 99);
    expect(res.isValid).toBe(false);
    expect(res.errors).toContain(dobValidationConstants.INVALID_YEAR);
    expect(getCurrentAge).not.toHaveBeenCalled();
  });

  it("rejects invalid month", () => {
    const res = validateDate(1, 13, 2023);
    expect(res.isValid).toBe(false);
    expect(res.errors).toContain(dobValidationConstants.INVALID_MONTH);
    expect(getCurrentAge).not.toHaveBeenCalled();
  });

  it("rejects invalid day for non-leap february", () => {
    const res = validateDate(29, 2, 2019);
    expect(res.isValid).toBe(false);
    expect(res.errors).toContain(dobValidationConstants.INVALID_DAY);
    expect(getCurrentAge).not.toHaveBeenCalled();
  });

  it("accepts 29 feb on leap year", () => {
    const res = validateDate(29, 2, 2020);
    expect(res.isValid).toBe(true);
    expect(res.errors).toEqual([]);
    expect(getCurrentAge).toHaveBeenCalledWith("2020-2-29");
  });

  it("rejects day out of range ", () => {
    const res = validateDate(32, 1, 2023);
    expect(res.isValid).toBe(false);
    expect(res.errors).toContain(dobValidationConstants.INVALID_DAY);
    expect(getCurrentAge).not.toHaveBeenCalled();
  });

  it("returns multiple errors when multiple parts are invalid", () => {
    const res = validateDate(32, 13, 99);
    expect(res.isValid).toBe(false);
    expect(res.errors).toEqual(
      expect.arrayContaining([
        dobValidationConstants.INVALID_YEAR,
        dobValidationConstants.INVALID_MONTH,
        dobValidationConstants.INVALID_DAY,
      ]),
    );
    expect(getCurrentAge).not.toHaveBeenCalled();
  });

  it("Should return false and INVALID_AGE if the age is less than 10", () => {
    (getCurrentAge as Mock).mockImplementation(() => 9);
    const res = validateDate(15, 6, 2000);
    expect(getCurrentAge).toHaveBeenCalledWith("2000-6-15");
    expect(res.isValid).toBe(false);
    expect(res.errors).toEqual([dobValidationConstants.INVALID_AGE]);
  });
  it("Should return true if the age is 10", () => {
    (getCurrentAge as Mock).mockImplementation(() => 10);
    const res = validateDate(15, 6, 2000);
    expect(getCurrentAge).toHaveBeenCalledWith("2000-6-15");
    expect(res.isValid).toBe(true);
    expect(res.errors).toEqual([]);
  });

  it("Should return false and INVALID_AGE if the age is greater than 120", () => {
    (getCurrentAge as Mock).mockImplementation(() => 121);
    const res = validateDate(15, 6, 2000);
    expect(getCurrentAge).toHaveBeenCalledWith("2000-6-15");
    expect(res.isValid).toBe(false);
    expect(res.errors).toEqual([dobValidationConstants.INVALID_AGE]);
  });
  it("Should return true if the age is 120", () => {
    (getCurrentAge as Mock).mockImplementation(() => 120);
    const res = validateDate(15, 6, 2000);
    expect(getCurrentAge).toHaveBeenCalledWith("2000-6-15");
    expect(res.isValid).toBe(true);
    expect(res.errors).toEqual([]);
  });
  it("Should return false and INVALID_DATE if getCurrentAge returns null", () => {
    (getCurrentAge as Mock).mockImplementation(() => null);
    const res = validateDate(15, 6, 2000);
    expect(getCurrentAge).toHaveBeenCalledWith("2000-6-15");
    expect(res.isValid).toBe(false);
    expect(res.errors).toEqual([dobValidationConstants.INVALID_DATE]);
  });
});

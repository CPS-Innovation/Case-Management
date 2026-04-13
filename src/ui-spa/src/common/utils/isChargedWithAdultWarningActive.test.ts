import { isChargedWithAdultWarningActive } from "./isChargedWithAdultWarningActive";
import { offenderTypeShortCodes } from "../constants/offenderTypeShortCodes";
describe("isChargedWithAdultWarningActive", () => {
  it("should return true for 'YO' offender type", () => {
    const result = isChargedWithAdultWarningActive(
      offenderTypeShortCodes.YOUTH_OFFENDER,
    );
    expect(result).toBe(true);
  });
  it("should return true for 'YO' offender type", () => {
    const result = isChargedWithAdultWarningActive(
      offenderTypeShortCodes.PROLIFIC_YOUTH_OFFENDER,
    );
    expect(result).toBe(true);
  });

  it("should return false for other offender types", () => {
    const result = isChargedWithAdultWarningActive(
      offenderTypeShortCodes.PROLIFIC_PRIORITY_OFFENDER,
    );
    expect(result).toBe(false);
  });

  it("should return false for any empty string", () => {
    const result = isChargedWithAdultWarningActive("");
    expect(result).toBe(false);
  });

  it("should return false for any other string", () => {
    const result = isChargedWithAdultWarningActive("abc");
    expect(result).toBe(false);
  });
});

import { formatNameUtil } from "./formatNameUtil";

describe("formatNameUtil", () => {
  it("should format name correctly", () => {
    expect(formatNameUtil("John", "Doe")).toBe("DOE, John");
    expect(formatNameUtil("john", "doe")).toBe("DOE, John");
    expect(formatNameUtil("jane", "")).toBe("Jane");
    expect(formatNameUtil("", "Smith")).toBe("SMITH");
  });
});

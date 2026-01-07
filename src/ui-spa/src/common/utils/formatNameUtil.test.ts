import { formatNameUtil } from "./formatNameUtil";

describe("formatNameUtil", () => {
  it("should format name correctly", () => {
    expect(formatNameUtil("John", "Doe")).toBe("DOE, John");
    expect(formatNameUtil("john", "doe")).toBe("DOE, John");
    expect(formatNameUtil("jane", "")).toBe("Jane");
    expect(formatNameUtil("", "Smith")).toBe("SMITH");
    expect(formatNameUtil("a", "b")).toBe("B, A");
    expect(formatNameUtil("J", "")).toBe("J");
    expect(formatNameUtil("123", "Doe")).toBe("DOE, 123");
  });
});

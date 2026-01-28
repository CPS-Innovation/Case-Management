import { sanitizeOperationNameText } from "./sanitizeOperationNameText";

describe("sanitizeOperationNameText", () => {
  it("returns the same string when length is less than max", () => {
    const input = "Short operation name";
    expect(sanitizeOperationNameText(input)).toBe(input);
  });

  it("returns the same string when length is exactly max (50)", () => {
    const input = "A".repeat(50);
    expect(sanitizeOperationNameText(input)).toBe(input);
  });

  it("truncates strings longer than 50 characters", () => {
    const input = "B".repeat(60);
    const out = sanitizeOperationNameText(input);
    expect(out.length).toBe(50);
    expect(out).toBe("B".repeat(50));
  });

  it("returns empty string when given empty input", () => {
    expect(sanitizeOperationNameText("")).toBe("");
  });
});

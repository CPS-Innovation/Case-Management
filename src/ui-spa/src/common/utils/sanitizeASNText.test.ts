import { sanitizeASNText } from "./sanitizeASNText";

describe("sanitizeASNText", () => {
  it("removes non-alphanumeric characters", () => {
    const input = "ABC-123/!@#";
    const out = sanitizeASNText(input);
    expect(out).toBe("ABC123");
  });

  it("preserves letter case and digits", () => {
    const input = "AbC123xYz";
    const out = sanitizeASNText(input);
    expect(out).toBe("AbC123xYz");
  });

  it("enforces maximum length of 30 characters", () => {
    const input = "A".repeat(35);
    const out = sanitizeASNText(input);
    expect(out.length).toBe(30);
    expect(out).toBe("A".repeat(30));
  });

  it("removes accented / non-ASCII letters (only ASCII a-z allowed)", () => {
    const input = "ÁÉÍÓ123-ÄÖÜ";
    const out = sanitizeASNText(input);
    expect(out).toBe("123");
  });

  it("returns empty string for empty input", () => {
    expect(sanitizeASNText("")).toBe("");
  });
});

import { sanitizeNameText } from "./sanitizeNameText";

describe("sanitizeNameText", () => {
  it("preserves ASCII letters, spaces, apostrophe, dot and hyphen", () => {
    const input = "O'Connor Jean-Luc. Anne Marie";
    expect(sanitizeNameText(input)).toBe(input);
  });

  it("preserves accented/unicode letters", () => {
    const input = "José Álvarez";
    expect(sanitizeNameText(input)).toBe(input);
  });

  it("removes disallowed characters (symbols and numbers)", () => {
    const input = "J@ne D0e!";
    expect(sanitizeNameText(input)).toBe("Jne De");
  });

  it("enforces maximum length of 50 characters", () => {
    const input = "A".repeat(60);
    const out = sanitizeNameText(input);
    expect(out.length).toBe(50);
    expect(out).toBe("A".repeat(50));
  });

  it("returns empty string for input with only disallowed chars or digits", () => {
    expect(sanitizeNameText("12345")).toBe("");
    expect(sanitizeNameText("!@#$%")).toBe("");
    expect(sanitizeNameText("")).toBe("");
  });
});

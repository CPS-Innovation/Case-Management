import { getSelectedUnit } from "./getSelectedUnit";

describe("getSelectedUnit", () => {
  const units = [
    { id: 1, description: "Alpha" },
    { id: 2, description: "Bravo" },
    { id: 3, description: "Charlie" },
  ];

  it("returns the matched unit when description matches inputValue", () => {
    const result = getSelectedUnit(units, "Bravo");
    expect(result).toEqual({ id: 2, description: "Bravo" });
  });

  it("returns id as null and description as inputValue when no match", () => {
    const result = getSelectedUnit(units, "Delta");
    expect(result).toEqual({ id: null, description: "Delta" });
  });

  it("returns id as null and description as empty string when inputValue is empty", () => {
    const result = getSelectedUnit(units, "");
    expect(result).toEqual({ id: null, description: "" });
  });
});

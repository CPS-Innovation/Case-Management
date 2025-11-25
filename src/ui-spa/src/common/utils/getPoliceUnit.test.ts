import { getPoliceUnit } from "./getPoliceUnit";

describe("getPoliceUnit", () => {
  const mockPoliceUnits = [
    {
      unitId: 2067,
      unitDescription: "Barrow CJU",
      code: "NN",
      description: "British Transport Police",
    },
    {
      unitId: 2067,
      unitDescription: "Barrow CJU",
      code: "WW",
      description: "British Transport Police",
    },
  ];
  it("should return the correct police unit", () => {
    const result = getPoliceUnit("NN", mockPoliceUnits);
    expect(result).toEqual({
      unitId: 2067,
      unitDescription: "Barrow CJU",
      code: "NN",
      description: "British Transport Police",
    });
  });

  it("should return undefined for an unknown police unit", () => {
    const result = getPoliceUnit("PU999", mockPoliceUnits);
    expect(result).toBeUndefined();
  });
});

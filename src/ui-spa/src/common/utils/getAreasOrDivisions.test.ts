import { getAreasOrDivisions } from "./getAreasOrDivisions";
import type { CaseAreasAndRegisteringUnits } from "../types/responses/CaseAreasAndRegisteringUnits";

describe("getAreasOrDivisions", () => {
  it("returns unique areaId and areaDescription pairs", () => {
    const input: CaseAreasAndRegisteringUnits = [
      { areaId: 1, areaDescription: "North", id: 101, description: "desc1" },
      { areaId: 2, areaDescription: "South", id: 102, description: "desc2" },
      { areaId: 1, areaDescription: "North", id: 103, description: "desc3" }, // duplicate areaId
      { areaId: 3, areaDescription: "East", id: 104, description: "desc4" },
      { areaId: 2, areaDescription: "South", id: 105, description: "desc5" }, // duplicate areaId
    ];

    const result = getAreasOrDivisions(input);

    expect(result).toEqual([
      { areaId: 1, areaDescription: "North" },
      { areaId: 2, areaDescription: "South" },
      { areaId: 3, areaDescription: "East" },
    ]);
  });

  it("returns empty array if input is empty", () => {
    expect(getAreasOrDivisions([])).toEqual([]);
  });

  it("handles single entry", () => {
    const input: CaseAreasAndRegisteringUnits = [
      { areaId: 5, areaDescription: "West", id: 201, description: "desc6" },
    ];
    expect(getAreasOrDivisions(input)).toEqual([
      { areaId: 5, areaDescription: "West" },
    ]);
  });
});

import { getAreasOrDivisions } from "./getAreasOrDivisions";
import type { CaseAreasAndRegisteringUnits } from "../types/responses/CaseAreasAndRegisteringUnits";

describe("getAreasOrDivisions", () => {
  it("returns unique areaId and areaDescription pairs", () => {
    const input: CaseAreasAndRegisteringUnits = {
      allUnits: [
        {
          areaId: 1,
          areaDescription: "North",
          id: 101,
          description: "desc1",
          areaIsSensitive: false,
        },
        {
          areaId: 2,
          areaDescription: "South",
          id: 102,
          description: "desc2",
          areaIsSensitive: false,
        },
        {
          areaId: 1,
          areaDescription: "North",
          id: 103,
          description: "desc3",
          areaIsSensitive: false,
        },
        {
          areaId: 3,
          areaDescription: "East",
          id: 104,
          description: "desc4",
          areaIsSensitive: false,
        },
        {
          areaId: 2,
          areaDescription: "South",
          id: 105,
          description: "desc5",
          areaIsSensitive: false,
        },
      ],
      homeUnit: {
        areaId: 1,
        areaDescription: "North",
        id: 101,
        description: "desc1",
        areaIsSensitive: false,
      },
    };
    const result = getAreasOrDivisions(input);

    expect(result).toEqual([
      { id: 1, description: "North" },
      { id: 2, description: "South" },
      { id: 3, description: "East" },
    ]);
  });

  it("handles single entry", () => {
    const input: CaseAreasAndRegisteringUnits = {
      allUnits: [
        {
          areaId: 5,
          areaDescription: "West",
          id: 201,
          description: "desc6",
          areaIsSensitive: false,
        },
      ],
      homeUnit: {
        areaId: 5,
        areaDescription: "West",
        id: 201,
        description: "desc6",
        areaIsSensitive: false,
      },
    };
    expect(getAreasOrDivisions(input)).toEqual([
      { id: 5, description: "West" },
    ]);
  });
});

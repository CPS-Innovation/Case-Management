import { getRegisteringUnits } from "./getRegisteringUnits";
import type { CaseAreasAndRegisteringUnits } from "../types/responses/CaseAreasAndRegisteringUnits";

describe("getRegisteringUnits", () => {
  it("returns unique unitId and unitDescription for a given area", () => {
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
    const result = getRegisteringUnits(input, "North");

    expect(result).toEqual([
      { id: 101, description: "desc1" },
      { id: 103, description: "desc3" },
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
    expect(getRegisteringUnits(input, "West")).toEqual([
      { id: 201, description: "desc6" },
    ]);
  });
});

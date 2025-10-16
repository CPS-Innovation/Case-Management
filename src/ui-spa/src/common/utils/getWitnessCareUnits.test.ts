import { getWitnessCareUnits } from "./getWitnessCareUnits";
import type { CaseAreasAndWitnessCareUnits } from "../types/responses/CaseAreasAndWitnessCareUnits";

describe("getWitnessCareUnits", () => {
  it("returns unique unitId and unitDescription for a given area", () => {
    const input: CaseAreasAndWitnessCareUnits = [
      {
        areaId: 1,
        areaDescription: "North",
        id: 101,
        description: "desc1",
        isWCU: true,
      },
      {
        areaId: 2,
        areaDescription: "South",
        id: 102,
        description: "desc2",
        isWCU: false,
      },
      {
        areaId: 1,
        areaDescription: "North",
        id: 103,
        description: "desc3",
        isWCU: false,
      },
      {
        areaId: 1,
        areaDescription: "North",
        id: 104,
        description: "desc4",
        isWCU: true,
      },
      {
        areaId: 2,
        areaDescription: "South",
        id: 105,
        description: "desc5",
        isWCU: false,
      },
    ];
    const result = getWitnessCareUnits(input, "North");

    expect(result).toEqual([
      { id: 101, description: "desc1" },
      { id: 104, description: "desc4" },
    ]);
  });

  it("should return an empty array if no witness care units are found", () => {
    const input: CaseAreasAndWitnessCareUnits = [
      {
        areaId: 1,
        areaDescription: "North",
        id: 101,
        description: "desc1",
        isWCU: true,
      },
      {
        areaId: 2,
        areaDescription: "South",
        id: 102,
        description: "desc2",
        isWCU: false,
      },
      {
        areaId: 1,
        areaDescription: "North",
        id: 103,
        description: "desc3",
        isWCU: false,
      },
      {
        areaId: 1,
        areaDescription: "North",
        id: 104,
        description: "desc4",
        isWCU: true,
      },
      {
        areaId: 2,
        areaDescription: "South",
        id: 105,
        description: "desc5",
        isWCU: false,
      },
    ];
    expect(getWitnessCareUnits(input, "South")).toEqual([]);
  });
});

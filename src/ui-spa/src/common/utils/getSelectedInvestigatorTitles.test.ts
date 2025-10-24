import { getSelectedInvestigatorTitle } from "./getSelectedInvestigatorTitle";
describe("getSelectedInvestigatorTitle", () => {
  const titles = [
    { shortCode: "INV1", description: "Investigator One" },
    { shortCode: "INV2", description: "Investigator Two" },
    { shortCode: "INV3", description: "Investigator Three" },
  ];
  it("returns the correct title for a given short code", () => {
    expect(getSelectedInvestigatorTitle(titles, "INV1")).toEqual({
      shortCode: "INV1",
      description: "Investigator One",
    });
    expect(getSelectedInvestigatorTitle(titles, "INV2")).toEqual({
      shortCode: "INV2",
      description: "Investigator Two",
    });
    expect(getSelectedInvestigatorTitle(titles, "INV3")).toEqual({
      shortCode: "INV3",
      description: "Investigator Three",
    });
  });
  it("returns undefined for an unknown short code", () => {
    expect(getSelectedInvestigatorTitle(titles, "INV4")).toEqual({
      shortCode: null,
      description: "INV4",
    });
  });
});

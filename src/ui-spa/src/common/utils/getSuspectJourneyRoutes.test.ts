import {
  getNextSuspectJourneyRoute,
  getPreviousSuspectJourneyRoute,
} from "./getSuspectJourneyRoutes";

describe("getSuspectJourneyRoutes", () => {
  describe("getNextSuspectJourneyRoute", () => {
    it("getNextSuspectJourneyRoute returns summary when no selections", () => {
      const next = getNextSuspectJourneyRoute("suspect-dob", [] as any, 1);
      expect(next).toBe("/case-registration/suspect-summary");
    });

    it("getNextSuspectJourneyRoute returns next route when there is a following selected step", () => {
      const selections = ["Date of birth", "Gender", "Disability"] as any;
      const next = getNextSuspectJourneyRoute("suspect-dob", selections, 3);
      expect(next).toBe("/case-registration/suspect-3/suspect-gender");
    });

    it("getNextSuspectJourneyRoute returns summary when current is the last selected step", () => {
      const selections = ["Date of birth"] as any;
      const next = getNextSuspectJourneyRoute("suspect-dob", selections, 2);
      expect(next).toBe("/case-registration/suspect-summary");
    });
  });

  describe("getPreviousSuspectJourneyRoute", () => {
    it("getPreviousSuspectJourneyRoute returns previous route when available", () => {
      const selections = ["Date of birth", "Gender"] as any;
      const prev = getPreviousSuspectJourneyRoute(
        "suspect-gender",
        selections,
        5,
      );
      expect(prev).toBe("/case-registration/suspect-5/suspect-dob");
    });

    it("getPreviousSuspectJourneyRoute returns add-suspect when current is the first selected step", () => {
      const selections = ["Gender"] as any;
      const prev = getPreviousSuspectJourneyRoute(
        "suspect-gender",
        selections,
        7,
      );
      expect(prev).toBe("/case-registration/suspect-7/add-suspect");
    });

    it("getPreviousSuspectJourneyRoute returns add-suspect when no selections", () => {
      const prev = getPreviousSuspectJourneyRoute("suspect-dob", [] as any, 4);
      expect(prev).toBe("/case-registration/suspect-4/add-suspect");
    });
  });
});

import { http, delay, HttpResponse } from "msw";
import {
  caseAreasAndRegisteringUnitsDev,
  caseAreasAndRegisteringUnitsPlaywright,
} from "../mocks/data";

export const setupHandlers = (baseUrl: string, apiMockSource: string) => {
  const isDevMock = () => apiMockSource === "dev";
  const RESPONSE_DELAY = isDevMock() ? 10 : 0;
  return [
    http.get(`${baseUrl}/api/v1/units`, async () => {
      const results = isDevMock()
        ? caseAreasAndRegisteringUnitsDev
        : caseAreasAndRegisteringUnitsPlaywright;
      await delay(RESPONSE_DELAY);
      return HttpResponse.json(results);
    }),
  ];
};

type caseSearchResult = {
  caseId: number;
  leadDefendantName: string;
  urn: string;
};
export type caseSearchResults = caseSearchResult[];

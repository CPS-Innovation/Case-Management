import { http, delay, HttpResponse } from "msw";
import {
  caseAreasAndRegisteringUnitsDev,
  caseAreasAndRegisteringUnitsPlaywright,
  caseAreasAndWitnessCareUnitsDev,
  caseAreasAndWitnessCareUnitsPlaywright,
  courtLocationsDev,
  courtLocationsPlaywright,
  caseComplexitiesDev,
  caseComplexitiesPlaywright,
  caseMonitoringCodesDev,
  caseMonitoringCodesPlaywright,
  caseCaseworkersDev,
  caseCaseworkersPlaywright,
  caseProsecutorsDev,
  caseProsecutorsPlaywright,
  caseInvestigatorTitlesDev,
  caseInvestigatorTitlesPlaywright,
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
    http.get(`${baseUrl}/api/v1/wms-units`, async () => {
      const results = isDevMock()
        ? caseAreasAndWitnessCareUnitsDev
        : caseAreasAndWitnessCareUnitsPlaywright;
      await delay(RESPONSE_DELAY);
      return HttpResponse.json(results);
    }),
    http.get(`${baseUrl}/api/v1/urns/:urn/exists`, async () => {
      await delay(RESPONSE_DELAY);
      return HttpResponse.json(false);
    }),
    http.get(`${baseUrl}/api/v1/courts/:registeringUnitId`, async () => {
      const results = isDevMock()
        ? courtLocationsDev
        : courtLocationsPlaywright;
      await delay(RESPONSE_DELAY);
      return HttpResponse.json(results);
      // return new HttpResponse(null, { status: 500 });
    }),
    http.get(`${baseUrl}/api/v1/complexities`, async () => {
      const results = isDevMock()
        ? caseComplexitiesDev
        : caseComplexitiesPlaywright;
      await delay(RESPONSE_DELAY);
      return HttpResponse.json(results);
    }),
    http.get(`${baseUrl}/api/v1/monitoring-codes`, async () => {
      const results = isDevMock()
        ? caseMonitoringCodesDev
        : caseMonitoringCodesPlaywright;
      await delay(RESPONSE_DELAY);
      return HttpResponse.json(results);
    }),
    http.get(`${baseUrl}/api/v1/prosecutors/:registeringUnitId`, async () => {
      const results = isDevMock()
        ? caseProsecutorsDev
        : caseProsecutorsPlaywright;
      await delay(RESPONSE_DELAY);
      return HttpResponse.json(results);
    }),
    http.get(`${baseUrl}/api/v1/caseworkers/:registeringUnitId`, async () => {
      const results = isDevMock()
        ? caseCaseworkersDev
        : caseCaseworkersPlaywright;
      await delay(RESPONSE_DELAY);
      return HttpResponse.json(results);
    }),
    http.get(`${baseUrl}/api/v1/titles`, async () => {
      const results = isDevMock()
        ? caseInvestigatorTitlesDev
        : caseInvestigatorTitlesPlaywright;
      await delay(RESPONSE_DELAY);
      return HttpResponse.json(results);
    }),
    http.post(`${baseUrl}/api/v1/cases`, async () => {
      await delay(RESPONSE_DELAY);
      return HttpResponse.json({ caseId: 12345 });
      // return new HttpResponse(null, { status: 500 });
    }),
  ];
};

type caseSearchResult = {
  caseId: number;
  leadDefendantName: string;
  urn: string;
};
export type caseSearchResults = caseSearchResult[];

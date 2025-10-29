import { v4 as uuidv4 } from "uuid";
import { GATEWAY_BASE_URL, GATEWAY_SCOPE } from "../config";
import { getAccessToken } from "../auth";
import type { CaseAreasAndRegisteringUnits } from "../common/types/responses/CaseAreasAndRegisteringUnits";
import type { CaseAreasAndWitnessCareUnits } from "../common/types/responses/CaseAreasAndWitnessCareUnits";
import type { CourtLocations } from "../common/types/responses/CourtLocations";
import type { CaseComplexities } from "../common/types/responses/CaseComplexities";
import type { CaseMonitoringCodes } from "../common/types/responses/CaseMonitoringCodes";
import { ApiError } from "../common/errors/ApiError";
import type { CaseProsecutors } from "../common/types/responses/CaseProsecutors";
import type { CaseCaseworkers } from "../common/types/responses/CaseCaseworkers";
import type { InvestigatorTitles } from "../common/types/responses/InvestigatorTitles";
import type { CaseRegistration } from "../common/types/requests/CaseRegistration";

export const CORRELATION_ID = "Correlation-Id";

const buildCommonHeaders = async (): Promise<Record<string, string>> => {
  return {
    [CORRELATION_ID]: uuidv4(),
    Authorization: `Bearer ${await getAccessToken([GATEWAY_SCOPE])}`,
  };
};

export const getCaseAreasAndRegisteringUnits = async () => {
  const url = `${GATEWAY_BASE_URL}/api/v1/units`;

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      ...(await buildCommonHeaders()),
    },
  });

  if (!response.ok) {
    throw new ApiError(
      `Getting case areas and registering units failed`,
      url,
      response,
    );
  }
  return (await response.json()) as CaseAreasAndRegisteringUnits;
};

export const getCaseAreasAndWitnessCareUnits = async () => {
  const url = `${GATEWAY_BASE_URL}/api/v1/wms-units`;

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      ...(await buildCommonHeaders()),
    },
  });

  if (!response.ok) {
    throw new ApiError(
      `Getting case areas and witness care units failed`,
      url,
      response,
    );
  }
  return (await response.json()) as CaseAreasAndWitnessCareUnits;
};

export const validateUrn = async (urn: string) => {
  const url = `${GATEWAY_BASE_URL}/api/v1/urns/${urn}/exists`;

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      ...(await buildCommonHeaders()),
    },
  });

  if (!response.ok) {
    throw new ApiError(`URN validation failed`, url, response);
  }

  return (await response.json()) as boolean;
};

export const getCourtsByUnitId = async (registeringUnitId: number) => {
  const url = `${GATEWAY_BASE_URL}/api/v1/courts/${registeringUnitId}`;
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      ...(await buildCommonHeaders()),
    },
  });

  if (!response.ok) {
    throw new ApiError(`getting courts by unit ID failed`, url, response);
  }
  return (await response.json()) as CourtLocations;
};

export const getCaseComplexities = async () => {
  const url = `${GATEWAY_BASE_URL}/api/v1/complexities`;
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      ...(await buildCommonHeaders()),
    },
  });

  if (!response.ok) {
    throw new ApiError(`getting complexities failed`, url, response);
  }
  return (await response.json()) as CaseComplexities;
};

export const getCaseMonitoringCodes = async () => {
  const url = `${GATEWAY_BASE_URL}/api/v1/monitoring-codes`;
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      ...(await buildCommonHeaders()),
    },
  });

  if (!response.ok) {
    throw new ApiError(`getting monitoring codes failed`, url, response);
  }
  return (await response.json()) as CaseMonitoringCodes;
};

export const getCaseProsecutors = async (registeringUnitId: number) => {
  const url = `${GATEWAY_BASE_URL}/api/v1/prosecutors/${registeringUnitId}`;
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      ...(await buildCommonHeaders()),
    },
  });

  if (!response.ok) {
    throw new ApiError(`getting prosecutors by unit ID failed`, url, response);
  }
  return (await response.json()) as CaseProsecutors;
};

export const getCaseCaseworkers = async (registeringUnitId: number) => {
  const url = `${GATEWAY_BASE_URL}/api/v1/caseworkers/${registeringUnitId}`;
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      ...(await buildCommonHeaders()),
    },
  });

  if (!response.ok) {
    throw new ApiError(`getting caseworkers by unit ID failed`, url, response);
  }
  return (await response.json()) as CaseCaseworkers;
};

export const getInvestigatorTitles = async () => {
  const url = `${GATEWAY_BASE_URL}/api/v1/titles`;
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      ...(await buildCommonHeaders()),
    },
  });
  if (!response.ok) {
    throw new ApiError(`getting investigator titles failed`, url, response);
  }
  return (await response.json()) as InvestigatorTitles;
};

export const submitCaseRegistration = async (data: CaseRegistration) => {
  const url = `${GATEWAY_BASE_URL}/api/v1/cases`;
  const response = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: {
      ...(await buildCommonHeaders()),
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new ApiError(`registering case api failed `, url, response);
  }
  return (await response.json()) as { success: boolean };
};

import { v4 as uuidv4 } from "uuid";
import { GATEWAY_BASE_URL, GATEWAY_SCOPE } from "../config";
import { getAccessToken } from "../auth";
import { type CaseAreasAndRegisteringUnits } from "../common/types/responses/CaseAreasAndRegisteringUnits";
import { type CaseAreasAndWitnessCareUnits } from "../common/types/responses/CaseAreasAndWitnessCareUnits";
import { type CourtLocations } from "../common/types/responses/CourtLocations";
import { ApiError } from "../common/errors/ApiError";

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
  return (await response.json()) as { exists: boolean };
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
    throw new ApiError(
      `getting courts by unit ID failed`,
      `${registeringUnitId}`,
      response,
    );
  }
  return (await response.json()) as CourtLocations;
};

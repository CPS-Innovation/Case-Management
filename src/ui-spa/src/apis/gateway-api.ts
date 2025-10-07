import { v4 as uuidv4 } from "uuid";
import { GATEWAY_BASE_URL, GATEWAY_SCOPE } from "../config";
import { getAccessToken } from "../auth";
import { type CaseAreasAndRegisteringUnits } from "../common/types/responses/CaseAreasAndRegisteringUnits";
import { type CaseAreasAndWitnessCareUnits } from "../common/types/responses/CaseAreasAndWitnessCareUnits";
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
  const url = `${GATEWAY_BASE_URL}/api/v1/witness-care-units`;

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

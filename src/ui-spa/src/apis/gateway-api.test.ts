import {
  getCaseAreasAndRegisteringUnits,
  getCaseAreasAndWitnessCareUnits,
  validateUrn,
  getCourtsByUnitId,
  getCaseComplexities,
  getCaseMonitoringCodes,
  getCaseProsecutors,
  getCaseCaseworkers,
  getInvestigatorTitles,
  submitCaseRegistration,
} from "./gateway-api";
import { ApiError } from "../common/errors/ApiError";

vi.mock("../auth", () => ({
  getAccessToken: vi.fn().mockResolvedValue("access-token"),
}));

vi.mock("../config", () => ({
  GATEWAY_BASE_URL: "https://mocked-out-api",
  GATEWAY_SCOPE: "gateway_scope",
}));

vi.mock("uuid", () => ({
  v4: () => "mock-uuid",
}));

describe("gateway-api", () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getCaseAreasAndRegisteringUnits - success", async () => {
    const mockBody = [
      { areaId: 1, areaDescription: "A", id: 10, description: "d" },
    ];
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockBody,
    });

    const result = await getCaseAreasAndRegisteringUnits();
    expect(result).toEqual(mockBody);
    expect(fetch).toHaveBeenCalledWith(
      "https://mocked-out-api/api/v1/units",
      expect.objectContaining({
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: "Bearer access-token",
          "Correlation-Id": "mock-uuid",
        },
      }),
    );
  });
  it("getCaseAreasAndRegisteringUnits - failure throws ApiError", async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(getCaseAreasAndRegisteringUnits()).rejects.toBeInstanceOf(
      ApiError,
    );
  });
  it("getCaseAreasAndWitnessCareUnits - success", async () => {
    const mockBody = [
      {
        areaId: 2,
        areaDescription: "B",
        id: 20,
        description: "e",
        isWCU: true,
      },
    ];
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockBody,
    });
    const result = await getCaseAreasAndWitnessCareUnits();
    expect(result).toEqual(mockBody);
    expect(fetch).toHaveBeenCalledWith(
      "https://mocked-out-api/api/v1/wms-units",
      expect.objectContaining({
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: "Bearer access-token",
          "Correlation-Id": "mock-uuid",
        },
      }),
    );
  });
  it("getCaseAreasAndWitnessCareUnits - failure throws ApiError", async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(getCaseAreasAndWitnessCareUnits()).rejects.toBeInstanceOf(
      ApiError,
    );
  });
  it("validateUrn - success", async () => {
    const mockBody = { exists: true };
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockBody,
    });
    const result = await validateUrn("URN123");
    expect(result).toEqual(mockBody);
    expect(fetch).toHaveBeenCalledWith(
      "https://mocked-out-api/api/v1/urns/URN123/exists",
      expect.objectContaining({
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: "Bearer access-token",
          "Correlation-Id": "mock-uuid",
        },
      }),
    );
  });
  it("validateUrn - failure throws ApiError", async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(validateUrn("URN123")).rejects.toBeInstanceOf(ApiError);
  });
  it("getCourtsByUnitId - success", async () => {
    const mockBody = [{ courtId: 1, courtName: "Court A" }];
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockBody,
    });
    const result = await getCourtsByUnitId(20);
    expect(result).toEqual(mockBody);
    expect(fetch).toHaveBeenCalledWith(
      "https://mocked-out-api/api/v1/courts/20",
      expect.objectContaining({
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: "Bearer access-token",
          "Correlation-Id": "mock-uuid",
        },
      }),
    );
  });
  it("getCourtsByUnitId - failure throws ApiError", async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(getCourtsByUnitId(20)).rejects.toBeInstanceOf(ApiError);
  });
  it("getCaseComplexities - success", async () => {
    const mockBody = [
      { shortCode: "A", description: "Low" },
      { shortCode: "B", description: "High" },
    ];
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockBody,
    });
    const result = await getCaseComplexities();
    expect(result).toEqual(mockBody);
    expect(fetch).toHaveBeenCalledWith(
      "https://mocked-out-api/api/v1/complexities",
      expect.objectContaining({
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: "Bearer access-token",
          "Correlation-Id": "mock-uuid",
        },
      }),
    );
  });
  it("getCaseComplexities - failure throws ApiError", async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(getCaseComplexities()).rejects.toBeInstanceOf(ApiError);
  });
  it("getCaseMonitoringCodes - success", async () => {
    const mockBody = [
      { code: "A", description: "Code A" },
      { code: "B", description: "Code B" },
    ];
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockBody,
    });
    const result = await getCaseMonitoringCodes();
    expect(result).toEqual(mockBody);
    expect(fetch).toHaveBeenCalledWith(
      "https://mocked-out-api/api/v1/monitoring-codes",
      expect.objectContaining({
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: "Bearer access-token",
          "Correlation-Id": "mock-uuid",
        },
      }),
    );
  });
  it("getCaseMonitoringCodes - failure throws ApiError", async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(getCaseMonitoringCodes()).rejects.toBeInstanceOf(ApiError);
  });
  it("getCaseProsecutors - success", async () => {
    const mockBody = [
      { id: 1, description: "Prosecutor A" },
      { id: 2, description: "Prosecutor B" },
    ];
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockBody,
    });
    const result = await getCaseProsecutors(20);
    expect(result).toEqual(mockBody);
    expect(fetch).toHaveBeenCalledWith(
      "https://mocked-out-api/api/v1/prosecutors/20",
      expect.objectContaining({
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: "Bearer access-token",
          "Correlation-Id": "mock-uuid",
        },
      }),
    );
  });
  it("getCaseProsecutors - failure throws ApiError", async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(getCaseProsecutors(20)).rejects.toBeInstanceOf(ApiError);
  });
  it("getCaseCaseworkers - success", async () => {
    const mockBody = [
      { id: 1, description: "caseworker A" },
      { id: 2, description: "caseworker B" },
    ];
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockBody,
    });
    const result = await getCaseCaseworkers(20);
    expect(result).toEqual(mockBody);
    expect(fetch).toHaveBeenCalledWith(
      "https://mocked-out-api/api/v1/caseworkers/20",
      expect.objectContaining({
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: "Bearer access-token",
          "Correlation-Id": "mock-uuid",
        },
      }),
    );
  });
  it("getCaseCaseworkers - failure throws ApiError", async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(getCaseCaseworkers(20)).rejects.toBeInstanceOf(ApiError);
  });
  it("getInvestigatorTitles - success", async () => {
    const mockBody = [
      {
        shortCode: "INV_A",
        description: "Investigator A",
        isPoliceTitle: true,
      },
      {
        shortCode: "INV_B",
        description: "Investigator B",
        isPoliceTitle: false,
      },
    ];
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockBody,
    });
    const result = await getInvestigatorTitles();
    expect(result).toEqual(mockBody);
    expect(fetch).toHaveBeenCalledWith(
      "https://mocked-out-api/api/v1/titles",
      expect.objectContaining({
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: "Bearer access-token",
          "Correlation-Id": "mock-uuid",
        },
      }),
    );
  });
  it("getInvestigatorTitles - failure throws ApiError", async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(getInvestigatorTitles()).rejects.toBeInstanceOf(ApiError);
  });
  it("submitCaseRegistration - success", async () => {
    const mockRequest = { mockRequestData: {} } as any;
    const mockResponse = { success: true };
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });
    const result = await submitCaseRegistration(mockRequest);
    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith(
      "https://mocked-out-api/api/v1/cases",
      expect.objectContaining({
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: "Bearer access-token",
          "Correlation-Id": "mock-uuid",
        },
      }),
    );
  });
  it("submitCaseRegistration - failure throws ApiError", async () => {
    const mockRequest = { mockRequestData: {} } as any;
    (globalThis.fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(submitCaseRegistration(mockRequest)).rejects.toBeInstanceOf(
      ApiError,
    );
  });
});

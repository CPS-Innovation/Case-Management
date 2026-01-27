import { type Mock } from "vitest";
import { getChargeDates, isOnOrAfterChargeDates } from "./chargeDatesUtil";
import { getChargesSummaryList } from "./getChargesSummaryList";
import { isValidOnOrAfterDate } from "./isValidOnOrAfterDate";
vi.mock("./getChargesSummaryList", () => ({ getChargesSummaryList: vi.fn() }));
vi.mock("./isValidOnOrAfterDate", () => ({ isValidOnOrAfterDate: vi.fn() }));
const mockedGetChargesSummaryList = getChargesSummaryList as unknown as Mock;
const mockedIsValidOnOrAfterDate = isValidOnOrAfterDate as unknown as Mock;

beforeEach(() => {
  vi.resetAllMocks();
});

describe("getChargeDates", () => {
  it("returns empty array when there are no charges", () => {
    mockedGetChargesSummaryList.mockReturnValueOnce([]);
    const res = getChargeDates([] as any);
    expect(res).toEqual([]);
    expect(mockedGetChargesSummaryList).toHaveBeenCalledWith([]);
  });

  it("collects offenceFromDate and offenceToDate and skips falsy values", () => {
    const mockChargeList = [
      {
        charges: [
          { offenceFromDate: "2025-01-01", offenceToDate: "2025-01-05" },
          { offenceFromDate: "", offenceToDate: "2025-01-10" },
        ],
      },
      {
        charges: [{ offenceFromDate: "2024-12-31", offenceToDate: undefined }],
      },
    ];
    mockedGetChargesSummaryList.mockReturnValueOnce(mockChargeList);

    const dates = getChargeDates([] as any);

    expect(dates).toEqual([
      "2025-01-01",
      "2025-01-05",
      "2025-01-10",
      "2024-12-31",
    ]);
    expect(mockedGetChargesSummaryList).toHaveBeenCalledWith([]);
  });
});

describe("isOnOrAfterChargeDates", () => {
  it("returns true when all charge dates validate on/after inputDate", () => {
    mockedGetChargesSummaryList.mockReturnValueOnce([
      {
        charges: [
          { offenceFromDate: "2025-01-01" },
          { offenceToDate: "2025-02-01" },
        ],
      },
    ]);
    mockedIsValidOnOrAfterDate.mockReturnValue(true);

    const ok = isOnOrAfterChargeDates("2025-03-01", [] as any);
    expect(ok).toBe(true);

    expect(mockedIsValidOnOrAfterDate).toHaveBeenCalledWith(
      "2025-03-01",
      "2025-01-01",
    );
    expect(mockedIsValidOnOrAfterDate).toHaveBeenCalledWith(
      "2025-03-01",
      "2025-02-01",
    );
  });

  it("returns false when any charge date fails validation", () => {
    mockedGetChargesSummaryList.mockReturnValueOnce([
      {
        charges: [
          { offenceFromDate: "2025-01-01" },
          { offenceFromDate: "2025-01-05" },
        ],
      },
    ]);

    // first date ok, second date fails
    mockedIsValidOnOrAfterDate.mockImplementation(
      (_inputDate: string, comparisonDate: string) =>
        comparisonDate !== "2025-01-05",
    );

    const ok = isOnOrAfterChargeDates("2025-02-01", [] as any);
    expect(ok).toBe(false);

    expect(mockedIsValidOnOrAfterDate).toHaveBeenCalledWith(
      "2025-02-01",
      "2025-01-01",
    );
    expect(mockedIsValidOnOrAfterDate).toHaveBeenCalledWith(
      "2025-02-01",
      "2025-01-05",
    );
  });
});

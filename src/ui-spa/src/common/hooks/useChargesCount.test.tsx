import { renderHook } from "@testing-library/react";
import { type Mock } from "vitest";
import { getChargesSummaryList } from "../utils/getChargesSummaryList";
import { type SuspectFormData } from "../reducers/caseRegistrationReducer";
import useChargesCount from "./useChargesCount";

vi.mock("../utils/getChargesSummaryList", () => ({
  getChargesSummaryList: vi.fn(),
}));

afterEach(() => {
  vi.resetAllMocks();
});

describe("useChargesCount", () => {
  it("returns 0 when suspects is undefined and charge list is empty", () => {
    (getChargesSummaryList as Mock).mockReturnValueOnce([]);
    const { result } = renderHook(() => useChargesCount(undefined));
    expect(result.current.chargesCount).toBe(0);
    expect(getChargesSummaryList).toHaveBeenCalledWith([]);
  });

  it("sums charges lengths returned by getChargesSummaryList", () => {
    const mockChargeList = [{ charges: [1, 2] }, { charges: [1] }];
    (getChargesSummaryList as Mock).mockReturnValueOnce(mockChargeList);

    const suspects = [{}, {}] as SuspectFormData[];
    const { result } = renderHook(() => useChargesCount(suspects));

    expect(result.current.chargesCount).toBe(3);
    expect(getChargesSummaryList).toHaveBeenCalledWith(suspects);
  });

  it("recomputes when suspects input changes (rerender)", () => {
    (getChargesSummaryList as Mock).mockReturnValueOnce([{ charges: [1] }]);

    const initialSuspects = [{}] as SuspectFormData[];
    const { result, rerender } = renderHook(
      (props: { s: SuspectFormData[] }) => useChargesCount(props.s),
      { initialProps: { s: initialSuspects } },
    );

    expect(result.current.chargesCount).toBe(1);
    (getChargesSummaryList as Mock).mockReturnValueOnce([
      { charges: [1, 2, 3] },
    ]);

    const newSuspects = [{}, {}] as SuspectFormData[];
    rerender({ s: newSuspects });

    expect(result.current.chargesCount).toBe(3);
    expect(getChargesSummaryList).toHaveBeenCalledWith(newSuspects);
  });
});

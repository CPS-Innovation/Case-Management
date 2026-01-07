import { useMemo } from "react";
import { getChargesSummaryList } from "../utils/getChargesSummaryList";
import { type SuspectFormData } from "../reducers/caseRegistrationReducer";

const useChargesCount = (suspects: SuspectFormData[] | undefined) => {
  return useMemo(() => {
    const chargeList = getChargesSummaryList(suspects ?? []);
    const chargesCount = chargeList.reduce(
      (acc, item) => acc + (item.charges?.length ?? 0),
      0,
    );
    return { chargesCount };
  }, [suspects]);
};

export default useChargesCount;

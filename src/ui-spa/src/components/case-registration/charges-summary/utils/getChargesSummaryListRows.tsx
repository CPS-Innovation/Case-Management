import type { ChargesFormData } from "../../../../common/reducers/caseRegistrationReducer";
import { formatNameUtil } from "../../../../common/utils/formatNameUtil";
export const getChargesSummaryListRows = (
  charge: ChargesFormData,
  addChargeRow: boolean = false,
) => {
  if (!charge) return [];
  const rows = [
    addChargeRow && {
      key: { children: <b>{charge.selectedOffence.code}</b> },
      value: { children: <span>{charge.selectedOffence.description}</span> },
    },
    {
      key: { children: <b>Date of Offence</b> },
      value: {
        children: (
          <span>
            {charge.offenceToDate
              ? `${charge.offenceFromDate}-${charge.offenceToDate}`
              : charge.offenceFromDate}
          </span>
        ),
      },
    },
    charge.victim && {
      key: { children: <b>Victim</b> },
      value: {
        children: (
          <span>
            {formatNameUtil(
              charge.victim?.victimFirstNameText,
              charge.victim?.victimLastNameText,
            )}
          </span>
        ),
      },
    },
  ];

  return rows.filter((row) => !!row);
};

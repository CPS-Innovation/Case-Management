import type { ChargesFormData } from "../../../../common/reducers/caseRegistrationReducer";
import { Tag } from "../../../../components/govuk";
import { formatNameUtil } from "../../../../common/utils/formatNameUtil";
import { formatDate } from "../../../../common/utils/formatDate";
import styles from "./index.module.scss";

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
              ? `${formatDate(charge.offenceFromDate)} to ${formatDate(charge.offenceToDate)}`
              : formatDate(charge.offenceFromDate)}
          </span>
        ),
      },
    },
    charge.victim && {
      key: { children: <b>Victim</b> },
      value: {
        children: (
          <div>
            <span>
              {formatNameUtil(
                charge.victim?.victimFirstNameText,
                charge.victim?.victimLastNameText,
              )}
            </span>
            <div className={styles.tagsContainer}>
              {charge.victim.victimAdditionalDetailsCheckboxes.map(
                (detail, index) => (
                  <Tag key={index} gdsTagColour="blue">
                    {detail}
                  </Tag>
                ),
              )}
            </div>
          </div>
        ),
      },
    },
  ];

  return rows.filter((row) => !!row);
};

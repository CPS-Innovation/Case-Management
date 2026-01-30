import type { ChargesFormData } from "../../../../common/reducers/caseRegistrationReducer";
import { Tag } from "../../../govuk";
import { formatNameUtil } from "../../../../common/utils/formatNameUtil";
import { format } from "date-fns";
import styles from "./index.module.scss";

export const getChargesSummaryListRows = (
  charge: ChargesFormData,
  isCaseSummaryPage: boolean = false,
  suspectId?: string,
  chargeId?: string,
) => {
  const rows = [
    isCaseSummaryPage && {
      key: { children: <b>{charge.selectedOffence.code}</b> },
      value: { children: <span>{charge.selectedOffence.description}</span> },
      actions: {
        items: [
          {
            children: <span>Remove</span>,
            to: `/case-registration/charge-remove-confirmation`,
            state: {
              suspectId,
              chargeId,
              backRoute: isCaseSummaryPage
                ? `/case-registration/case-summary`
                : `/case-registration/charges-summary`,
            },
            visuallyHiddenText: "Remove Charge",
            className: "govuk-link--no-visited-state",
          },
        ],
      },
    },
    {
      key: { children: <b>Date of Offence</b> },
      value: {
        children: (
          <span>
            {charge.offenceToDate
              ? `${format(charge.offenceFromDate, "dd MMMM yyyy")} to ${format(charge.offenceToDate, "dd MMMM yyyy")}`
              : format(charge.offenceFromDate, "dd MMMM yyyy")}
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

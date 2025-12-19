import { useContext, useMemo } from "react";
import { Details, SummaryList, Tag } from "../../govuk";
import { CaseRegistrationFormContext } from "../../../common/providers/CaseRegistrationProvider";
import PersonIcon from "../../svgs/personIcon.svg?react";
import CompanyIcon from "../../svgs/companyIcon.svg?react";
import { type SuspectFormData } from "../../../common/reducers/caseRegistrationReducer";
import { getSuspectDetailsSummaryListRows } from "./utils/getSuspectDetailsSummaryListRows";
import { isYouthSuspect } from "../../../common/utils/isYouthSuspect";
import { formatNameUtil } from "../../../common/utils/formatNameUtil";
import styles from "./SuspectSummary.module.scss";

type SuspectSummaryProps = {
  isCaseSummaryPage?: boolean;
};

const SuspectSummary: React.FC<SuspectSummaryProps> = ({
  isCaseSummaryPage = false,
}) => {
  const { state } = useContext(CaseRegistrationFormContext);

  const suspectSummaryRows = (suspect: SuspectFormData, index: number) => {
    return [
      {
        key: {
          children: (
            <div className={styles.suspectName}>
              {suspect.addSuspectRadio === "person" && (
                <>
                  <PersonIcon />
                  <span>
                    {`${formatNameUtil(
                      suspect.suspectFirstNameText,
                      suspect.suspectLastNameText,
                    )}`}
                  </span>
                  {isYouthSuspect(suspect) && <Tag>Youth</Tag>}
                </>
              )}
              {suspect.addSuspectRadio === "company" && (
                <>
                  <CompanyIcon />
                  <span>{suspect.suspectCompanyNameText}</span>
                </>
              )}
            </div>
          ),
        },
        actions: {
          items: [
            {
              children: <span>Remove</span>,
              to: `/case-registration/suspect-remove-confirmation`,
              state: {
                suspectId: suspect.suspectId,
                backRoute: isCaseSummaryPage
                  ? `/case-registration/case-summary`
                  : `/case-registration/suspect-summary`,
              },
              visuallyHiddenText: "Edit Suspect Details",
            },
            {
              children: <span>Change</span>,
              to: `/case-registration/suspect-${index}/add-suspect`,
              visuallyHiddenText: "Edit Suspect Details",
            },
          ],
        },
      },
    ];
  };

  const suspectDetailsSummaryListRows = useMemo(() => {
    return getSuspectDetailsSummaryListRows(state.formData.suspects);
  }, [state.formData.suspects]);

  const renderSummaryList = () => {
    const {
      formData: { suspects },
    } = state;

    return (
      <dl>
        {suspects.map(
          (suspect, index) =>
            suspect.addSuspectRadio === "person" && (
              <div key={`${index}-${suspect.suspectLastNameText}`}>
                <div className={styles.suspectRowWrapper}>
                  <SummaryList rows={suspectSummaryRows(suspect, index)} />
                </div>

                {suspectDetailsSummaryListRows[index].length > 0 && (
                  <div className={styles.suspectDetailsWrapper}>
                    <dd>
                      <Details
                        summaryChildren={
                          isCaseSummaryPage
                            ? "Details and charges"
                            : "Suspect details"
                        }
                      >
                        {isCaseSummaryPage && <h2> Suspect details</h2>}
                        <SummaryList
                          rows={suspectDetailsSummaryListRows[index]}
                        />
                      </Details>
                    </dd>
                  </div>
                )}
              </div>
            ),
        )}
        {suspects.map(
          (suspect, index) =>
            suspect.addSuspectRadio === "company" && (
              <div key={`${index}-${suspect.suspectCompanyNameText}`}>
                <div className={styles.suspectRowWrapper}>
                  <SummaryList rows={suspectSummaryRows(suspect, index)} />
                </div>
              </div>
            ),
        )}
      </dl>
    );
  };

  return (
    <div className={styles.suspectSummary}>
      <div>{renderSummaryList()}</div>
    </div>
  );
};

export default SuspectSummary;

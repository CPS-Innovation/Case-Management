import { useContext, useMemo } from "react";
import { Details, SummaryList, Tag } from "../../govuk";
import { CaseRegistrationFormContext } from "../../../common/providers/CaseRegistrationProvider";
import PersonIcon from "../../svgs/personIcon.svg?react";
import CompanyIcon from "../../svgs/companyIcon.svg?react";
import { type SuspectFormData } from "../../../common/reducers/caseRegistrationReducer";
import { getSuspectDetailsSummaryListRows } from "./utils/getSuspectDetailsSummaryListRows";
import { getChargesSummaryListRows } from "../charges-summary/utils/getChargesSummaryListRows";
import { isYouthSuspect } from "../../../common/utils/isYouthSuspect";
import { formatNameUtil } from "../../../common/utils/formatNameUtil";
import { useNavigate } from "react-router-dom";
import styles from "./SuspectSummary.module.scss";

type SuspectSummaryProps = {
  isCaseSummaryPage?: boolean;
};

const SuspectSummary: React.FC<SuspectSummaryProps> = ({
  isCaseSummaryPage = false,
}) => {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(CaseRegistrationFormContext);

  const handleAddChargeClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    url: string,
  ) => {
    event.preventDefault();
    dispatch({
      type: "SET_NAVIGATION_DATA",
      payload: { fromCaseSummaryPage: true },
    });
    navigate(url);
    console.log("Add Charge clicked", url);
  };

  const addNewChargeRow = (suspectIndex: number, chargeIndex: number) => {
    return [
      {
        key: {
          children:
            chargeIndex === 0 ? (
              <span>Charges</span>
            ) : (
              <span>Add another charge</span>
            ),
        },
        value: {
          children: chargeIndex === 0 ? <span>No charges added</span> : <></>,
        },
        actions: {
          items: [
            {
              children: <span> Add Charge</span>,
              to: `/case-registration/suspect-${suspectIndex}/charge-${chargeIndex}/charges-offence-search`,
              visuallyHiddenText: "Add new charge",
              onClick: (event: React.MouseEvent<HTMLAnchorElement>) =>
                handleAddChargeClick(
                  event,
                  `/case-registration/suspect-${suspectIndex}/charge-${chargeIndex}/charges-offence-search`,
                ),
            },
          ],
        },
      },
    ];
  };

  const suspectSummaryRow = (suspect: SuspectFormData, index: number) => {
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
        value: isCaseSummaryPage
          ? {
              children: (
                <>
                  {suspect.charges.length ? (
                    <Tag className="govuk-tag--orange">Charges added</Tag>
                  ) : (
                    <Tag className="govuk-tag--grey">Pre-charge</Tag>
                  )}
                </>
              ),
            }
          : undefined,

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

  const getDetailsTitle = (
    isCaseSummaryPage: boolean,
    suspectDetailsSummaryListRowsLength: number,
  ) => {
    if (suspectDetailsSummaryListRowsLength > 0 && !isCaseSummaryPage) {
      return "Suspect details";
    }
    if (isCaseSummaryPage) {
      return "Details and charges";
    }
    return "";
  };

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
                  <SummaryList rows={suspectSummaryRow(suspect, index)} />
                </div>

                {getDetailsTitle(
                  isCaseSummaryPage,
                  suspectDetailsSummaryListRows[index].length,
                ) && (
                  <div className={styles.suspectDetailsWrapper}>
                    <dd>
                      <Details
                        summaryChildren={getDetailsTitle(
                          isCaseSummaryPage,
                          suspectDetailsSummaryListRows[index].length,
                        )}
                      >
                        {suspectDetailsSummaryListRows[index].length > 0 && (
                          <>
                            {" "}
                            {isCaseSummaryPage && (
                              <h3 className="govuk-heading-m">
                                {" "}
                                Suspect details
                              </h3>
                            )}
                            <SummaryList
                              rows={suspectDetailsSummaryListRows[index]}
                            />
                          </>
                        )}
                        {isCaseSummaryPage && (
                          <>
                            <h3>Charges</h3>
                            {suspect.charges.map((charge) => (
                              <div
                                key={`${charge.selectedOffence.code}-${charge.chargeId}`}
                              >
                                <SummaryList
                                  rows={getChargesSummaryListRows(
                                    charge,
                                    isCaseSummaryPage,
                                    suspect.suspectId,
                                    charge.chargeId,
                                  )}
                                />
                              </div>
                            ))}
                            <div>
                              <SummaryList
                                rows={addNewChargeRow(
                                  index,
                                  suspect.charges.length,
                                )}
                              />
                            </div>
                          </>
                        )}
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
                  <SummaryList rows={suspectSummaryRow(suspect, index)} />
                  {isCaseSummaryPage && suspect.charges.length > 0 && (
                    <>
                      <Details summaryChildren={"Charges"}>
                        <h3>Charges</h3>
                        {suspect.charges.map((charge) => (
                          <div
                            key={`${charge.selectedOffence.code}-${charge.chargeId}`}
                          >
                            <SummaryList
                              rows={getChargesSummaryListRows(
                                charge,
                                isCaseSummaryPage,
                              )}
                            />
                          </div>
                        ))}
                        <div>
                          <SummaryList
                            rows={addNewChargeRow(
                              index,
                              suspect.charges.length,
                            )}
                          />
                        </div>
                      </Details>
                    </>
                  )}
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

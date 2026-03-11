import { useContext } from "react";
import { Details, SummaryList } from "../../govuk";
import { CaseRegistrationFormContext } from "../../../common/providers/CaseRegistrationProvider";
import { type ChargesFormData } from "../../../common/reducers/caseRegistrationReducer";
import { getChargesSummaryListRows } from "./utils/getChargesSummaryListRows";
import { formatNameUtil } from "../../../common/utils/formatNameUtil";
import { getChargesSummaryList } from "../../../common/utils/getChargesSummaryList";
import pageStyles from "./index.module.scss";

type ChargesSummaryProps = {
  isCaseSummaryPage?: boolean;
};

const ChargesSummary: React.FC<ChargesSummaryProps> = ({
  isCaseSummaryPage = false,
}) => {
  const { state } = useContext(CaseRegistrationFormContext);

  const chargesSummaryRow = (
    charge: ChargesFormData,
    chargeId: string,
    suspectId: string,
  ) => {
    return [
      {
        key: {
          children: (
            <div>
              <span>
                <b>{charge.selectedOffence.code}</b>
              </span>
            </div>
          ),
        },
        value: {
          children: (
            <div>
              <span>{charge.selectedOffence.description}</span>
            </div>
          ),
        },
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
    ];
  };

  const renderSummaryList = () => {
    const suspectChargesList = getChargesSummaryList(state.formData.suspects);
    return (
      <div>
        {suspectChargesList.map((suspectCharge) => (
          <div
            key={
              suspectCharge.suspectLastNameText
                ? `${suspectCharge.suspectId}-${suspectCharge.suspectLastNameText}`
                : `${suspectCharge.suspectId}-${suspectCharge.suspectCompanyNameText}`
            }
          >
            {suspectCharge.suspectLastNameText ? (
              <h2 className="govuk-!-margin-top-8">
                {`Charges for ${formatNameUtil(
                  suspectCharge.suspectFirstNameText,
                  suspectCharge.suspectLastNameText,
                )}
                `}
              </h2>
            ) : (
              <h2 className="govuk-!-margin-top-8">{`Charges for ${suspectCharge.suspectCompanyNameText}`}</h2>
            )}
            {suspectCharge.charges.map((charge) => (
              <div
                key={`${charge.selectedOffence.code}-${charge.chargeId}`}
                className={pageStyles.chargeWrapper}
              >
                <SummaryList
                  rows={chargesSummaryRow(
                    charge,
                    charge.chargeId,
                    suspectCharge.suspectId,
                  )}
                />
                <div>
                  <Details summaryChildren={"View charge details"}>
                    <SummaryList
                      rows={getChargesSummaryListRows(
                        charge,
                        state.formData.victimsList,
                        isCaseSummaryPage,
                        suspectCharge.suspectId,
                        charge.chargeId,
                      )}
                    />
                  </Details>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return <div>{renderSummaryList()}</div>;
};

export default ChargesSummary;

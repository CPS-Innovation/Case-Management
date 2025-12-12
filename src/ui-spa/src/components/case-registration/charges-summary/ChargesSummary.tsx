import { useContext } from "react";
import { Details, SummaryList } from "../../govuk";
import { CaseRegistrationFormContext } from "../../../common/providers/CaseRegistrationProvider";
import { type ChargesFormData } from "../../../common/reducers/caseRegistrationReducer";
import { getChargesSummaryListRows } from "./utils/getChargesSummaryListRows";
import { formatNameUtil } from "../../../common/utils/formatNameUtil";
import { getChargesSummaryList } from "../../../common/utils/getChargesSummaryList";

type ChargesSummaryProps = {
  isCaseSummaryPage?: boolean;
};

const ChargesSummary: React.FC<ChargesSummaryProps> = ({
  isCaseSummaryPage = false,
}) => {
  const { state } = useContext(CaseRegistrationFormContext);

  const chargesSummaryRow = (
    charge: ChargesFormData,
    chargeIndex: number,
    suspectIndex: number,
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
                suspectIndex,
                chargeIndex,
                backRoute: isCaseSummaryPage
                  ? `/case-registration/case-summary`
                  : `/case-registration/charges-summary`,
              },
              visuallyHiddenText: "Remove Charge",
            },
          ],
        },
      },
    ];
  };

  const renderSummaryList = () => {
    const suspectChargesList = getChargesSummaryList(state.formData.suspects);
    console.log("suspectChargesList", suspectChargesList);
    return (
      <div>
        {suspectChargesList.map((suspectCharge, suspectIndex) => (
          <div
            key={
              suspectCharge.suspectLastNameText
                ? `${suspectIndex}-${suspectCharge.suspectLastNameText}`
                : `${suspectIndex}-${suspectCharge.suspectCompanyNameText}`
            }
          >
            {suspectCharge.suspectLastNameText ? (
              <h2>
                {`Charges for ${formatNameUtil(
                  suspectCharge.suspectFirstNameText,
                  suspectCharge.suspectLastNameText,
                )}
                `}
              </h2>
            ) : (
              <h2>{`Charges for ${suspectCharge.suspectCompanyNameText}`}</h2>
            )}
            {suspectCharge.charges.map((charge, chargeIndex) => (
              <div key={`${charge.selectedOffence.code}-${chargeIndex}`}>
                <SummaryList
                  rows={chargesSummaryRow(charge, chargeIndex, suspectIndex)}
                />
                <div>
                  <Details summaryChildren={"View charge details"}>
                    <SummaryList rows={getChargesSummaryListRows(charge)} />
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

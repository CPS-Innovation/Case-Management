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

  const chargesSummaryRow = (charge: ChargesFormData, index: number) => {
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
                suspectIndex: index,
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
        {suspectChargesList.map((suspectCharge, index) => (
          <div
            key={
              suspectCharge.suspectLastNameText
                ? `${index}-${suspectCharge.suspectLastNameText}`
                : `${index}-${suspectCharge.suspectCompanyNameText}`
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
            {suspectCharge.charges.map((charge, index) => (
              <div key={`${charge.selectedOffence.code}-${index}`}>
                <SummaryList rows={chargesSummaryRow(charge, index)} />
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

  return (
    <div>
      <div>{renderSummaryList()}</div>
    </div>
  );
};

export default ChargesSummary;

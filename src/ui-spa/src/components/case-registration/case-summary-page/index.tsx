import { useContext, useMemo } from "react";
import { Button, BackLink, SummaryList } from "../../govuk";
import { CaseRegistrationFormContext } from "../../../common/providers/CaseRegistrationProvider";
import {
  getCaseDetailsSummaryListRows,
  getSuspectSummaryListRows,
  getCaseComplexityAndMonitoringCodesSummaryListRows,
  getWhoseWorkingOnTheCaseSummaryListRows,
} from "./utils/getSummaryListRows";
import { getCaseRegistrationRequestData } from "../../../common/utils/getCaseRegistrationRequestData";
import { submitCaseRegistration } from "../../../apis/gateway-api";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";

const CaseSummaryPage = () => {
  const { state } = useContext(CaseRegistrationFormContext);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const requestData = getCaseRegistrationRequestData(
      state.formData,
      state.apiData.caseMonitoringCodes!,
    );

    const result = await submitCaseRegistration(requestData);

    if (result.success)
      navigate("/case-registration/case-registration-confirmation");
  };

  const caseDetailsSummaryListRows = useMemo(
    () => getCaseDetailsSummaryListRows(state.formData),
    [state.formData],
  );

  const suspectSummaryListRows = useMemo(
    () => getSuspectSummaryListRows(state.formData),
    [state.formData],
  );

  const caseComplexityAndMonitoringCodesSummaryListRows = useMemo(
    () =>
      getCaseComplexityAndMonitoringCodesSummaryListRows(
        state.formData,
        state.apiData.caseMonitoringCodes!,
      ),
    [state.formData, state.apiData.caseMonitoringCodes],
  );
  const whoseWorkingOnTheCaseSummaryListRows = useMemo(
    () => getWhoseWorkingOnTheCaseSummaryListRows(state.formData),
    [state.formData],
  );
  return (
    <div className={styles.caseComplexityPage}>
      <BackLink
        to="/case-registration/case-assignee"
        replace
        state={{ isRouteValid: true }}
      >
        Back
      </BackLink>

      <h1 className="govuk-heading-xl">
        Check your answers before creating the case
      </h1>
      <form onSubmit={handleSubmit}>
        <h2>Case Details</h2>
        <SummaryList rows={caseDetailsSummaryListRows} />
        <h2>Suspect</h2>
        <SummaryList rows={suspectSummaryListRows} />
        <h2>Case complexity and monitoring codes</h2>
        <SummaryList rows={caseComplexityAndMonitoringCodesSummaryListRows} />
        <h2>Working on the case</h2>
        <SummaryList rows={whoseWorkingOnTheCaseSummaryListRows} />
        <Button type="submit" onClick={() => handleSubmit}>
          Accept and create
        </Button>
      </form>
    </div>
  );
};

export default CaseSummaryPage;

import {
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import { Button, BackLink, SummaryList, ErrorSummary } from "../../govuk";
import { CaseRegistrationFormContext } from "../../../common/providers/CaseRegistrationProvider";
import {
  getCaseDetailsSummaryListRows,
  getSuspectSummaryListRows,
  getCaseComplexityAndMonitoringCodesSummaryListRows,
  getWhosIsWorkingOnTheCaseSummaryListRows,
} from "./utils/getSummaryListRows";
import { getCaseRegistrationRequestData } from "../../../common/utils/getCaseRegistrationRequestData";
import { useMutation, useQuery } from "@tanstack/react-query";
import { submitCaseRegistration, validateUrn } from "../../../apis/gateway-api";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";

const CaseSummaryPage = () => {
  type ErrorText = {
    errorSummaryText: string;
    inputErrorText?: string;
    hasLink: boolean;
    errorIds?: string[];
  };
  type FormDataErrors = {
    urnErrorText?: ErrorText;
  };
  const { state } = useContext(CaseRegistrationFormContext);
  const navigate = useNavigate();

  const submitCaseRegistrationMutation = useMutation({
    mutationFn: submitCaseRegistration,
  });
  const [formDataErrors, setFormDataErrors] = useState<FormDataErrors>({});
  const errorSummaryRef = useRef<HTMLInputElement>(null);

  const errorSummaryProperties = useCallback(
    (errorKey: keyof FormDataErrors) => {
      if (errorKey === "urnErrorText") {
        return {
          children: formDataErrors[errorKey]?.errorSummaryText,
          href: `#${formDataErrors[errorKey]?.errorIds?.[0]}`,
          "data-testid": "urn-error-text-link",
        };
      }
      return null;
    },
    [formDataErrors],
  );

  const errorList = useMemo(() => {
    const validErrorKeys = Object.keys(formDataErrors).filter(
      (errorKey) => formDataErrors[errorKey as keyof FormDataErrors],
    );

    const errorSummary = validErrorKeys.map((errorKey, index) => ({
      reactListKey: `${index}`,
      ...errorSummaryProperties(errorKey as keyof FormDataErrors)!,
    }));

    return errorSummary;
  }, [formDataErrors, errorSummaryProperties]);

  const { refetch: refetchValidateUrn, error: validateUrnError } = useQuery({
    queryKey: ["validate-urn"],
    queryFn: () =>
      validateUrn(
        `${state.formData.urnPoliceForceText}${state.formData.urnPoliceUnitText}${state.formData.urnUniqueReferenceText}${state.formData.urnYearReferenceText}`,
      ),
    enabled: false,
    retry: false,
  });

  useEffect(() => {
    if (submitCaseRegistrationMutation.error) {
      throw submitCaseRegistrationMutation.error;
    }
  }, [submitCaseRegistrationMutation.error]);

  useEffect(() => {
    if (validateUrnError) throw validateUrnError;
  }, [validateUrnError]);

  useEffect(() => {
    if (errorList.length) errorSummaryRef.current?.focus();
  }, [errorList]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const { data } = await refetchValidateUrn();
    if (data) {
      setFormDataErrors((prev) => ({
        ...prev,
        urnErrorText: {
          errorSummaryText:
            "URN already exists, please change urn and try again",
          hasLink: true,
          errorIds: ["change-urn-link"],
        },
      }));
      return;
    }

    const requestData = getCaseRegistrationRequestData(
      state.formData,
      state.apiData.caseMonitoringCodes!,
    );

    submitCaseRegistrationMutation.mutate(requestData, {
      onSuccess: (data) => {
        if (data.success) {
          navigate("/case-registration/case-registration-confirmation");
        }
      },
    });
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
    () => getWhosIsWorkingOnTheCaseSummaryListRows(state.formData),
    [state.formData],
  );
  return (
    <div className={styles.caseSummaryPage}>
      <BackLink
        to="/case-registration/case-assignee"
        disabled={submitCaseRegistrationMutation.isPending}
      >
        Back
      </BackLink>

      <h1 className="govuk-heading-xl">
        Check your answers before creating the case
      </h1>

      {!!errorList.length && (
        <div
          ref={errorSummaryRef}
          tabIndex={-1}
          className={styles.errorSummaryWrapper}
        >
          <ErrorSummary
            data-testid={"case-details-error-summary"}
            errorList={errorList}
            titleChildren="There is a problem"
          />
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <h2>Case Details</h2>
        <SummaryList rows={caseDetailsSummaryListRows} />
        <h2>Suspect</h2>
        <SummaryList rows={suspectSummaryListRows} />
        <h2>Case complexity and monitoring codes</h2>
        <SummaryList rows={caseComplexityAndMonitoringCodesSummaryListRows} />
        <h2>Working on the case</h2>
        <SummaryList rows={whoseWorkingOnTheCaseSummaryListRows} />
        <Button
          type="submit"
          onClick={() => handleSubmit}
          disabled={submitCaseRegistrationMutation.isPending}
        >
          Accept and create
        </Button>
      </form>
    </div>
  );
};

export default CaseSummaryPage;

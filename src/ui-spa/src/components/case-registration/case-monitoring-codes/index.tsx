import {
  useRef,
  useEffect,
  useState,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { Checkboxes, Button, ErrorSummary, BackLink } from "../../govuk";
import { CaseRegistrationFormContext } from "../../../common/providers/CaseRegistrationProvider";
import { type CaseRegistrationState } from "../../../common/reducers/caseRegistrationReducer";
import { getCaseMonitoringCodes } from "../../../apis/gateway-api";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";
const PRE_CHARGE_DECISION_CODE = "CSEA";

const CaseMonitoringCodesPage = () => {
  type ErrorText = {
    errorSummaryText: string;
    inputErrorText?: string;
    hasLink: boolean;
  };
  type FormDataErrors = {
    caseMonitoringCodesCheckboxes?: ErrorText;
  };
  const errorSummaryRef = useRef<HTMLInputElement>(null);
  const { state, dispatch } = useContext(CaseRegistrationFormContext);
  const navigate = useNavigate();

  const {
    data: caseMonitoringCodesData,
    isLoading: isCaseMonitoringCodesLoading,
    error: caseMonitoringCodesError,
  } = useQuery({
    queryKey: ["case-monitoring-codes"],
    queryFn: () => getCaseMonitoringCodes(),
    retry: false,
  });

  const isOptional = useMemo(
    () => state.formData.suspectDetailsRadio === "yes",
    [state.formData.suspectDetailsRadio],
  );

  const [formDataErrors, setFormDataErrors] = useState<FormDataErrors>({});

  const errorSummaryProperties = useCallback(
    (errorKey: keyof FormDataErrors) => {
      if (errorKey === "caseMonitoringCodesCheckboxes") {
        return {
          children: formDataErrors[errorKey]?.errorSummaryText,
          href: "#case-monitoring-codes",
          "data-testid": "case-monitoring-codes-link",
        };
      }
      return null;
    },
    [formDataErrors],
  );

  const caseMonitoringCodes = useMemo(() => {
    if (state.apiData.caseMonitoringCodes) {
      return state.apiData.caseMonitoringCodes;
    }
    return [] as { code: number; description: string }[];
  }, [state.apiData.caseMonitoringCodes]);

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

  useEffect(() => {
    if (caseMonitoringCodesError) throw caseMonitoringCodesError;
  }, [caseMonitoringCodesError]);

  useEffect(() => {
    if (errorList.length) errorSummaryRef.current?.focus();
  }, [errorList]);

  useEffect(() => {
    if (!isCaseMonitoringCodesLoading && caseMonitoringCodesData) {
      dispatch({
        type: "SET_CASE_MONITORING_CODES",
        payload: {
          caseMonitoringCodes: caseMonitoringCodesData,
        },
      });
    }
  }, [caseMonitoringCodesData, dispatch, isCaseMonitoringCodesLoading]);

  useEffect(() => {
    if (!isOptional) {
      dispatch({
        type: "SET_FIELD",
        payload: {
          field: "caseMonitoringCodesCheckboxes",
          value: [PRE_CHARGE_DECISION_CODE],
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setFormValue = (
    fieldName: "caseMonitoringCodesCheckboxes",
    value: string,
  ) => {
    console.log(
      "checkboxes value :",
      state.formData.caseMonitoringCodesCheckboxes,
    );
    const currentValues = state.formData.caseMonitoringCodesCheckboxes ?? [];
    let newValues: string[] = [];
    if (currentValues.includes(value)) {
      newValues = currentValues.filter((item) => item !== value);
    } else {
      newValues = [...currentValues, value];
    }

    dispatch({
      type: "SET_FIELD",
      payload: { field: fieldName, value: newValues },
    });
  };

  const validateFormData = (state: CaseRegistrationState) => {
    const errors: FormDataErrors = {};
    const {
      formData: { caseMonitoringCodesCheckboxes },
    } = state;

    if (!caseMonitoringCodesCheckboxes?.length) {
      errors.caseMonitoringCodesCheckboxes = {
        errorSummaryText: "Please select at least one monitoring code",
        inputErrorText: "Please select an option",
        hasLink: true,
      };
    }

    const isValid = !Object.entries(errors).filter(([, value]) => value).length;

    setFormDataErrors(errors);
    return isValid;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateFormData(state)) return;

    return navigate("/case-registration/case-assignee");
  };

  return (
    <div className={styles.caseMonitoringCodesPage}>
      <BackLink
        to="/case-registration/case-complexity"
        replace
        state={{ isRouteValid: true }}
      >
        Back
      </BackLink>
      {!!errorList.length && (
        <div
          ref={errorSummaryRef}
          tabIndex={-1}
          className={styles.errorSummaryWrapper}
        >
          <ErrorSummary
            data-testid={"monitoring-codes-error-summary"}
            errorList={errorList}
            titleChildren="There is a problem"
          />
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className={styles.inputWrapper}>
          <Checkboxes
            fieldset={{
              legend: {
                children: <h1>Add monitoring codes</h1>,
              },
            }}
            hint={
              isOptional
                ? {
                    children:
                      "These are optional. You can continue without adding monitoring codes.",
                  }
                : undefined
            }
            errorMessage={
              formDataErrors["caseMonitoringCodesCheckboxes"]
                ? {
                    children:
                      formDataErrors["caseMonitoringCodesCheckboxes"]
                        .errorSummaryText,
                  }
                : undefined
            }
            items={caseMonitoringCodes.map((monitoringCodes, index) => ({
              id: `case-monitoring-codes-${index}`,
              children: monitoringCodes.description,
              value: monitoringCodes.code.toString(),
              "data-testid": `case-monitoring-codes-${index}`,
              checked: state.formData.caseMonitoringCodesCheckboxes?.includes(
                monitoringCodes.code.toString(),
              ),
              disabled: !isOptional && monitoringCodes.code === "CSEA",
            }))}
            onChange={(event) => {
              const { value } = event.target;
              if (value) setFormValue("caseMonitoringCodesCheckboxes", value);
            }}
          />
        </div>
        <Button type="submit" onClick={() => handleSubmit}>
          Save and Continue
        </Button>
      </form>
    </div>
  );
};

export default CaseMonitoringCodesPage;

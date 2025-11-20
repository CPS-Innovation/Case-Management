import {
  useRef,
  useEffect,
  useState,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { Radios, Button, ErrorSummary, BackLink } from "../../govuk";
import { CaseRegistrationFormContext } from "../../../common/providers/CaseRegistrationProvider";
import { type CaseRegistrationState } from "../../../common/reducers/caseRegistrationReducer";
import { getCaseComplexities } from "../../../apis/gateway-api";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";

const CaseComplexityPage = () => {
  type ErrorText = {
    errorSummaryText: string;
    inputErrorText?: string;
    hasLink: boolean;
  };
  type FormDataErrors = {
    caseComplexityRadio?: ErrorText;
  };
  const errorSummaryRef = useRef<HTMLInputElement>(null);
  const { state, dispatch } = useContext(CaseRegistrationFormContext);
  const navigate = useNavigate();

  const {
    data: caseComplexitiesData,
    isLoading: isCaseComplexitiesLoading,
    error: caseComplexitiesError,
  } = useQuery({
    queryKey: ["case-complexities"],
    queryFn: () => getCaseComplexities(),
    enabled: !state.apiData.caseComplexities,
    retry: false,
  });

  const [formDataErrors, setFormDataErrors] = useState<FormDataErrors>({});

  const errorSummaryProperties = useCallback(
    (errorKey: keyof FormDataErrors) => {
      if (errorKey === "caseComplexityRadio") {
        return {
          children: formDataErrors[errorKey]?.errorSummaryText,
          href: "#case-complexity-radio-0",
          "data-testid": "case-complexity-radio-link",
        };
      }
      return null;
    },
    [formDataErrors],
  );

  const validateFormData = (state: CaseRegistrationState) => {
    const errors: FormDataErrors = {};
    const {
      formData: { caseComplexityRadio },
    } = state;

    if (!caseComplexityRadio.shortCode) {
      errors.caseComplexityRadio = {
        errorSummaryText: "Please select an option for case complexity",
        inputErrorText: "Please select an option",
        hasLink: true,
      };
    }

    const isValid = !Object.entries(errors).filter(([, value]) => value).length;

    setFormDataErrors(errors);
    return isValid;
  };
  const caseComplexities = useMemo(() => {
    if (state.apiData.caseComplexities) {
      return state.apiData.caseComplexities;
    }
    return [] as { shortCode: number; description: string }[];
  }, [state.apiData.caseComplexities]);

  const backRoute = useMemo(() => {
    if (
      state.formData.suspects.length === 0 &&
      state.formData.suspectDetailsRadio === "yes"
    ) {
      return `/case-registration/suspect-0/add-suspect`;
    }
    if (state.formData.suspects.length > 0) {
      return `/case-registration/suspect-summary`;
    }
    return "/case-registration/case-details";
  }, [state.formData.suspects.length, state.formData.suspectDetailsRadio]);

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
    if (caseComplexitiesError) throw caseComplexitiesError;
  }, [caseComplexitiesError]);

  useEffect(() => {
    if (errorList.length) errorSummaryRef.current?.focus();
  }, [errorList]);

  useEffect(() => {
    if (!isCaseComplexitiesLoading && caseComplexitiesData) {
      dispatch({
        type: "SET_CASE_COMPLEXITIES",
        payload: {
          caseComplexities: caseComplexitiesData,
        },
      });
    }
  }, [caseComplexitiesData, dispatch, isCaseComplexitiesLoading]);

  const setFormValue = (fieldName: "caseComplexityRadio", value: string) => {
    const selectedItem = caseComplexities.find(
      (complexity) => `${complexity.shortCode}` === value,
    );
    if (!selectedItem) return;
    dispatch({
      type: "SET_FIELD",
      payload: {
        field: fieldName,
        value: {
          shortCode: `${selectedItem.shortCode}`,
          description: selectedItem.description,
        },
      },
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateFormData(state)) return;

    return navigate("/case-registration/case-monitoring-codes");
  };

  return (
    <div className={styles.caseComplexityPage}>
      <BackLink to={backRoute}>Back</BackLink>
      {!!errorList.length && (
        <div
          ref={errorSummaryRef}
          tabIndex={-1}
          className={styles.errorSummaryWrapper}
        >
          <ErrorSummary
            data-testid={"case-complexity-error-summary"}
            errorList={errorList}
            titleChildren="There is a problem"
          />
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className={styles.inputWrapper}>
          <Radios
            fieldset={{
              legend: {
                children: <h1>What is the case complexity?</h1>,
              },
            }}
            errorMessage={
              formDataErrors["caseComplexityRadio"]
                ? {
                    children:
                      formDataErrors["caseComplexityRadio"].errorSummaryText,
                  }
                : undefined
            }
            items={caseComplexities.map((complexity, index) => ({
              id: `case-complexity-radio-${index}`,
              children: complexity.description,
              value: complexity.shortCode.toString(),
              "data-testid": `case-complexity-radio-${index}`,
            }))}
            value={state.formData.caseComplexityRadio.shortCode}
            onChange={(value) => {
              if (value) setFormValue("caseComplexityRadio", value);
            }}
          ></Radios>
        </div>
        <Button type="submit" onClick={() => handleSubmit}>
          Save and Continue
        </Button>
      </form>
    </div>
  );
};

export default CaseComplexityPage;

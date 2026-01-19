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
import { getCaseComplexities } from "../../../apis/gateway-api";
import useChargesCount from "../../../common/hooks/useChargesCount";
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
  const { chargesCount } = useChargesCount(state.formData.suspects);

  const [formData, setFormData] = useState<{
    caseComplexityRadio: { shortCode: string; description: string };
  }>({
    caseComplexityRadio: state.formData.caseComplexityRadio || {
      shortCode: "",
      description: "",
    },
  });

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

  const validateFormData = () => {
    const errors: FormDataErrors = {};
    const { caseComplexityRadio } = formData;

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

  const previousRoute = useMemo(() => {
    if (state.formData.navigation.fromCaseSummaryPage) {
      return "/case-registration/case-summary";
    }
    if (chargesCount) {
      return "/case-registration/first-hearing";
    }
    if (state.formData.suspects.length > 0) {
      return "/case-registration/want-to-add-charges";
    }
    return "/case-registration/case-details";
  }, [
    chargesCount,
    state.formData.suspects.length,
    state.formData.navigation.fromCaseSummaryPage,
  ]);

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

  const setFormValue = (value: string) => {
    const selectedItem = caseComplexities.find(
      (complexity) => `${complexity.shortCode}` === value,
    );
    if (!selectedItem) return;
    setFormData({
      caseComplexityRadio: {
        shortCode: `${selectedItem.shortCode}`,
        description: selectedItem.description,
      },
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateFormData()) return;

    dispatch({
      type: "SET_FIELDS",
      payload: {
        data: {
          ...formData,
        },
      },
    });
    if (state.formData.navigation.fromCaseSummaryPage) {
      dispatch({
        type: "SET_NAVIGATION_DATA",
        payload: { fromCaseSummaryPage: false },
      });
      navigate("/case-registration/case-summary");
      return;
    }
    return navigate("/case-registration/case-monitoring-codes");
  };

  const handleBackLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (previousRoute === "/case-registration/case-summary") {
      dispatch({
        type: "SET_NAVIGATION_DATA",
        payload: { fromCaseSummaryPage: false },
      });
    }
    navigate(previousRoute);
  };
  return (
    <div className={styles.caseComplexityPage}>
      <BackLink to={previousRoute} onClick={handleBackLinkClick}>
        Back
      </BackLink>
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
            value={formData.caseComplexityRadio.shortCode}
            onChange={(value) => {
              if (value) setFormValue(value);
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

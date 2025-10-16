import {
  useRef,
  useEffect,
  useState,
  useContext,
  useCallback,
  useMemo,
} from "react";
import {
  AutoComplete,
  Radios,
  Button,
  ErrorSummary,
  BackLink,
} from "../../govuk";
import { CaseRegistrationFormContext } from "../../../common/providers/CaseRegistrationProvider";
import { type CaseRegistrationState } from "../../../common/reducers/caseRegistrationReducer";
import { getSelectedUnit } from "../../../common/utils/getSelectedUnit";
import {
  getCaseProsecutors,
  getCaseCaseworkers,
} from "../../../apis/gateway-api";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";

const CaseAssigneePage = () => {
  type ErrorText = {
    errorSummaryText: string;
    inputErrorText?: string;
    hasLink: boolean;
  };
  type FormDataErrors = {
    caseProsecutorRadio?: ErrorText;
    caseInvestigatorRadio?: ErrorText;
    caseProsecutorText?: ErrorText;
    caseCaseworkerText?: ErrorText;
  };
  const errorSummaryRef = useRef<HTMLInputElement>(null);
  const { state, dispatch } = useContext(CaseRegistrationFormContext);
  const navigate = useNavigate();

  const registeringUnitId = useMemo(() => {
    return state.formData.registeringUnitText?.id;
  }, [state.formData.registeringUnitText]);

  const { data: caseProsecutorsData, isLoading: isCaseProsecutorsLoading } =
    useQuery({
      queryKey: ["case-prosecutors", registeringUnitId],
      enabled: !!registeringUnitId,
      queryFn: () => getCaseProsecutors(registeringUnitId!),
    });

  const { data: caseCaseworkersData, isLoading: isCaseCaseworkersLoading } =
    useQuery({
      queryKey: ["case-caseworkers", registeringUnitId],
      enabled: !!registeringUnitId,
      queryFn: () => getCaseCaseworkers(registeringUnitId!),
    });

  const [formDataErrors, setFormDataErrors] = useState<FormDataErrors>({});

  const errorSummaryProperties = useCallback(
    (errorKey: keyof FormDataErrors) => {
      switch (errorKey) {
        case "caseProsecutorRadio":
          return {
            children: formDataErrors[errorKey]?.errorSummaryText,
            href: "#case-prosecutor-radio-yes",
            "data-testid": "case-prosecutor-radio-link",
          };
        case "caseProsecutorText":
          return {
            children: formDataErrors[errorKey]?.errorSummaryText,
            href: "#case-prosecutor-text",
            "data-testid": "case-prosecutor-text-link",
          };
        case "caseCaseworkerText":
          return {
            children: formDataErrors[errorKey]?.errorSummaryText,
            href: "#case-caseworker-text",
            "data-testid": "case-caseworker-text-link",
          };

        default:
          return null;
      }
    },
    [formDataErrors],
  );

  const validateFormData = (
    state: CaseRegistrationState,
    prosecutors: { id: number; description: string }[],
    inputProsecutorValue: string,
  ) => {
    const errors: FormDataErrors = {};
    const {
      formData: { caseProsecutorRadio, caseProsecutorText },
    } = state;

    if (!caseProsecutorRadio) {
      errors.caseProsecutorRadio = {
        errorSummaryText:
          "Please select an option for case prosecutor or caseworker",
        inputErrorText: "Please select an option",
        hasLink: true,
      };
    }

    if (caseProsecutorRadio === "yes") {
      if (!caseProsecutorText) {
        errors.caseProsecutorText = {
          errorSummaryText: "Please select a court location for first hearing",
          inputErrorText: "Please select a court location",
          hasLink: true,
        };
      } else if (
        prosecutors.findIndex(
          (cl) => cl.description === inputProsecutorValue,
        ) === -1
      ) {
        errors.caseProsecutorText = {
          errorSummaryText: "Prosecutor name is invalid",
          hasLink: true,
        };
      }
    }

    const isValid = !Object.entries(errors).filter(([, value]) => value).length;

    setFormDataErrors(errors);
    return isValid;
  };
  const prosecutors = useMemo(() => {
    if (state.apiData.caseProsecutors) {
      return state.apiData.caseProsecutors;
    }
    return [] as { id: number; description: string }[];
  }, [state.apiData.caseProsecutors]);

  const caseworkers = useMemo(() => {
    if (state.apiData.caseCaseworkers) {
      return state.apiData.caseCaseworkers;
    }
    return [] as { id: number; description: string }[];
  }, [state.apiData.caseCaseworkers]);

  const caseProsecutorSuggest = (
    query: string,
    populateResults: (results: string[]) => void,
  ) => {
    const filteredResults = prosecutors
      .filter((result) =>
        result.description.toLowerCase().includes(query.toLowerCase()),
      )
      .map((r) => r.description);
    populateResults(filteredResults);
  };

  const caseCaseworkerSuggest = (
    query: string,
    populateResults: (results: string[]) => void,
  ) => {
    const filteredResults = caseworkers
      .filter((result) =>
        result.description.toLowerCase().includes(query.toLowerCase()),
      )
      .map((r) => r.description);
    populateResults(filteredResults);
  };

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
    if (errorList.length) errorSummaryRef.current?.focus();
  }, [errorList]);

  useEffect(() => {
    if (!isCaseProsecutorsLoading && caseProsecutorsData) {
      dispatch({
        type: "SET_CASE_PROSECUTORS",
        payload: {
          caseProsecutors: caseProsecutorsData,
        },
      });
    }
  }, [caseProsecutorsData, dispatch, isCaseProsecutorsLoading]);

  useEffect(() => {
    if (!isCaseCaseworkersLoading && caseCaseworkersData) {
      dispatch({
        type: "SET_CASE_CASEWORKERS",
        payload: {
          caseCaseworkers: caseCaseworkersData,
        },
      });
    }
  }, [caseCaseworkersData, dispatch, isCaseCaseworkersLoading]);

  const setFormValue = (
    fieldName: "caseProsecutorRadio" | "caseInvestigatorRadio",
    value: string,
  ) => {
    dispatch({
      type: "SET_FIELD",
      payload: { field: fieldName, value: value },
    });
  };

  const handleCaseProsecutorConfirm = (value: string) => {
    const { id, description } = getSelectedUnit(prosecutors, value);
    dispatch({
      type: "SET_FIELD",
      payload: {
        field: "caseProsecutorText",
        value: { id, description },
      },
    });
  };

  const handleCaseCaseworkerConfirm = (value: string) => {
    const { id, description } = getSelectedUnit(caseworkers, value);
    dispatch({
      type: "SET_FIELD",
      payload: {
        field: "caseCaseworkerText",
        value: { id, description },
      },
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const prosecutorInput = document.getElementById(
      "case-prosecutor-text",
    ) as HTMLInputElement | null;
    const inputCourtLocationValue = prosecutorInput?.value ?? "";
    if (
      inputCourtLocationValue !==
      state.formData.firstHearingCourtLocationText?.description
    ) {
      const { id, description } = getSelectedUnit(
        prosecutors,
        inputCourtLocationValue,
      );
      dispatch({
        type: "SET_FIELD",
        payload: {
          field: "caseCaseworkerText",
          value: { id, description },
        },
      });
    }

    if (!validateFormData(state, prosecutors, inputCourtLocationValue)) return;

    return navigate("/case-registration/case-complexity");
  };

  return (
    <div className={styles.caseAssigneePage}>
      <BackLink
        to="/case-registration/case-monitoring-codes"
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
            data-testid={"case-assignee-error-summary"}
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
                children: <h1>Who is working on the case?</h1>,
              },
            }}
            errorMessage={
              formDataErrors["caseProsecutorRadio"]
                ? {
                    children:
                      formDataErrors["caseProsecutorRadio"].errorSummaryText,
                  }
                : undefined
            }
            name="case-prosecutor-radio"
            items={[
              {
                id: "case-prosecutor-radio-yes",
                children: "Yes",
                value: "yes",
                "data-testid": "case-prosecutor-radio-yes",
                conditional: {
                  children: [
                    <AutoComplete
                      key="case-prosecutor-text"
                      id="case-prosecutor-text"
                      inputClasses={"govuk-input--error"}
                      source={caseProsecutorSuggest}
                      confirmOnBlur={false}
                      onConfirm={handleCaseProsecutorConfirm}
                      defaultValue={
                        state.formData.caseProsecutorText?.description
                      }
                      label={{
                        children: (
                          <h2>What is the first hearing court location?</h2>
                        ),
                      }}
                      errorMessage={
                        formDataErrors["caseProsecutorText"]
                          ? formDataErrors["caseProsecutorText"]
                              .errorSummaryText
                          : undefined
                      }
                    />,
                    <AutoComplete
                      key="case-worker-text"
                      id="case-worker-text"
                      inputClasses={"govuk-input--error"}
                      source={caseCaseworkerSuggest}
                      confirmOnBlur={false}
                      onConfirm={handleCaseCaseworkerConfirm}
                      defaultValue={
                        state.formData.caseCaseworkerText?.description
                      }
                      label={{
                        children: <h2>What is the case worker&#39;s name?</h2>,
                      }}
                      errorMessage={
                        formDataErrors["caseCaseworkerText"]
                          ? formDataErrors["caseCaseworkerText"]
                              .errorSummaryText
                          : undefined
                      }
                    />,
                  ],
                },
              },
              {
                children: "No",
                value: "no",
                "data-testid": "case-prosecutor-radio-no",
              },
            ]}
            value={state.formData.caseProsecutorRadio}
            onChange={(value) => {
              if (value) setFormValue("caseProsecutorRadio", value);
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

export default CaseAssigneePage;

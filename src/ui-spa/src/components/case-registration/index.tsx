import {
  useRef,
  useEffect,
  useState,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { Input, Radios, Button, ErrorSummary } from "../govuk";
import { CaseRegistrationFormContext } from "../../common/providers/CaseRegistrationProvider";
import { type CaseRegistrationState } from "../../common/reducers/caseRegistrationReducer";
import {
  getCaseAreasAndRegisteringUnits,
  getCaseAreasAndWitnessCareUnits,
} from "../../apis/gateway-api";
import { useQuery } from "@tanstack/react-query";
import { useIsAreaSensitive } from "../../common/hooks/useIsAreaSensitive";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";

const CaseRegistrationPage = () => {
  type ErrorText = {
    errorSummaryText: string;
    inputErrorText?: string;
    hasLink: boolean;
  };
  type FormDataErrors = {
    operationNameRadio?: ErrorText;
    suspectDetailsRadio?: ErrorText;
    operationNameText?: ErrorText;
    genericError?: ErrorText;
  };
  const errorSummaryRef = useRef<HTMLInputElement>(null);
  const { state, dispatch } = useContext(CaseRegistrationFormContext);
  const navigate = useNavigate();
  const isAreaSensitive = useIsAreaSensitive();

  const {
    data: areasData,
    isLoading: isAreaDataLoading,
    error: areaDataError,
  } = useQuery({
    queryKey: ["areas"],
    queryFn: getCaseAreasAndRegisteringUnits,
    retry: false,
  });

  const {
    data: witnessCareUnitsData,
    isLoading: isWitnessCareUnitsLoading,
    error: witnessCareUnitsError,
  } = useQuery({
    queryKey: ["witness-care-units"],
    queryFn: getCaseAreasAndWitnessCareUnits,
    retry: false,
  });
  const [formDataErrors, setFormDataErrors] = useState<FormDataErrors>({});

  const errorSummaryProperties = useCallback(
    (errorKey: keyof FormDataErrors) => {
      switch (errorKey) {
        case "operationNameRadio":
          return {
            children: formDataErrors[errorKey]?.errorSummaryText,
            href: "#operation-name-radio-yes",
            "data-testid": "operation-name-radio-link",
          };
        case "suspectDetailsRadio":
          return {
            children: formDataErrors[errorKey]?.errorSummaryText,
            href: "#suspect-details-radio-yes",
            "data-testid": "suspect-details-radio-link",
          };
        case "operationNameText":
          return {
            children: formDataErrors[errorKey]?.errorSummaryText,
            href: "#operation-name-text",
            "data-testid": "operation-name-text-link",
          };
        case "genericError":
          return {
            children: formDataErrors[errorKey]?.errorSummaryText,
            "data-testid": "generic-error-text",
          };
        default:
          return null;
      }
    },
    [formDataErrors],
  );

  const validateFormData = (state: CaseRegistrationState) => {
    const errors: FormDataErrors = {};
    const {
      formData: { operationNameRadio, suspectDetailsRadio, operationNameText },
    } = state;
    if (!operationNameRadio) {
      errors.operationNameRadio = {
        errorSummaryText: "Please select an option for operation name",
        inputErrorText: "Please select an option",
        hasLink: true,
      };
    }
    if (!suspectDetailsRadio) {
      errors.suspectDetailsRadio = {
        errorSummaryText: "Please select an option for suspect details",
        inputErrorText: "Please select an option",
        hasLink: true,
      };
    }
    if (operationNameRadio === "no" && suspectDetailsRadio === "no") {
      errors.genericError = {
        errorSummaryText: "Add an operation name or suspect details",
        hasLink: false,
      };
    }

    if (operationNameRadio == "yes" && !operationNameText) {
      errors.operationNameText = {
        errorSummaryText: "Operation name should not be empty",
        hasLink: true,
      };
    }

    const isValid = !Object.entries(errors).filter(([, value]) => value).length;

    setFormDataErrors(errors);
    return isValid;
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
    if (areaDataError) throw areaDataError;
  }, [areaDataError]);

  useEffect(() => {
    if (witnessCareUnitsError) throw witnessCareUnitsError;
  }, [witnessCareUnitsError]);

  useEffect(() => {
    if (errorList.length) errorSummaryRef.current?.focus();
  }, [errorList]);

  useEffect(() => {
    if (!isAreaDataLoading && areasData) {
      dispatch({
        type: "SET_AREAS_AND_REGISTERING_UNITS",
        payload: {
          areasAndRegisteringUnits: areasData,
        },
      });
    }
  }, [areasData, dispatch, isAreaDataLoading]);

  useEffect(() => {
    if (!isWitnessCareUnitsLoading && witnessCareUnitsData) {
      dispatch({
        type: "SET_AREAS_AND_WITNESS_CARE_UNITS",
        payload: {
          areasAndWitnessCareUnits: witnessCareUnitsData,
        },
      });
    }
  }, [witnessCareUnitsData, dispatch, isWitnessCareUnitsLoading]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateFormData(state)) return;
    if (!isAreaSensitive) return navigate("/case-registration/areas");
    return navigate("/case-registration/case-details");
  };

  const setFormValue = (
    fieldName:
      | "operationNameRadio"
      | "suspectDetailsRadio"
      | "operationNameText",
    value: string,
  ) => {
    dispatch({
      type: "SET_FIELD",
      payload: { field: fieldName, value: value },
    });
  };

  return (
    <div>
      <h1>Register a case</h1>
      {!!errorList.length && (
        <div
          ref={errorSummaryRef}
          tabIndex={-1}
          className={styles.errorSummaryWrapper}
        >
          <ErrorSummary
            data-testid={"case-registration-error-summary"}
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
                children: <h2>{`Do you have an operation name?`}</h2>,
              },
            }}
            errorMessage={
              formDataErrors["operationNameRadio"]
                ? {
                    children:
                      formDataErrors["operationNameRadio"].errorSummaryText,
                  }
                : undefined
            }
            name="`Do you have an operation name?"
            items={[
              {
                id: "operation-name-radio-yes",
                children: "Yes",
                value: "yes",
                "data-testid": "operation-name-radio-yes",
                conditional: {
                  children: [
                    <Input
                      key="operation-name-text"
                      id="operation-name-text"
                      data-testid="operation-name-text"
                      errorMessage={
                        formDataErrors["operationNameText"]
                          ? {
                              children:
                                formDataErrors["operationNameText"]
                                  .errorSummaryText,
                            }
                          : undefined
                      }
                      className="govuk-input--width-20"
                      label={{
                        children: "Operation name",
                      }}
                      name="operation-name"
                      type="text"
                      value={state.formData.operationNameText}
                      onChange={(value: string) => {
                        setFormValue("operationNameText", value);
                      }}
                    />,
                  ],
                },
              },
              {
                children: "No",
                value: "no",
                "data-testid": "radio-operation-name-no",
              },
            ]}
            value={state.formData.operationNameRadio}
            onChange={(value) => {
              if (value) setFormValue("operationNameRadio", value);
            }}
          ></Radios>
          <Radios
            fieldset={{
              legend: {
                children: <h2>{`Do you have any suspect details?`}</h2>,
              },
            }}
            errorMessage={
              formDataErrors["suspectDetailsRadio"]
                ? {
                    children:
                      formDataErrors["suspectDetailsRadio"].errorSummaryText,
                  }
                : undefined
            }
            name="Do you have any suspect details?"
            items={[
              {
                children: "Yes",
                value: "yes",
                "data-testid": "suspect-details-radio-yes",
                id: "suspect-details-radio-yes",
              },
              {
                children: "No",
                value: "no",
                "data-testid": "suspect-details-radio-no",
              },
            ]}
            value={state.formData.suspectDetailsRadio}
            onChange={(value) => {
              if (value) setFormValue("suspectDetailsRadio", value);
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

export default CaseRegistrationPage;

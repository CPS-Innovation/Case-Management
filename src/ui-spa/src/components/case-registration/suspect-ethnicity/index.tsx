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
import { getEthnicities } from "../../../apis/gateway-api";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import {
  getNextSuspectJourneyRoute,
  getPreviousSuspectJourneyRoute,
} from "../../../common/utils/getSuspectJourneyRoutes";
import styles from "./index.module.scss";

const SuspectEthnicityPage = () => {
  type ErrorText = {
    errorSummaryText: string;
    inputErrorText?: string;
  };
  type FormDataErrors = {
    suspectEthnicityRadio?: ErrorText;
  };
  const errorSummaryRef = useRef<HTMLInputElement>(null);
  const { state, dispatch } = useContext(CaseRegistrationFormContext);
  const navigate = useNavigate();
  const { suspectId } = useParams<{ suspectId: string }>() as {
    suspectId: string;
  };

  const suspectIndex = useMemo(() => {
    const index = suspectId.replace("suspect-", "");
    return Number.parseInt(index, 10);
  }, [suspectId]);

  const {
    data: ethnicityData,
    isLoading: isEthnicitysLoading,
    error: ethnicityError,
  } = useQuery({
    queryKey: ["ethnicities"],
    enabled: true,
    queryFn: () => getEthnicities(),
    retry: false,
  });

  useEffect(() => {
    if (ethnicityError) throw ethnicityError;
  }, [ethnicityError]);

  const previousRoute = useMemo(() => {
    return getPreviousSuspectJourneyRoute(
      "suspect-ethnicity",
      state.formData.suspects[suspectIndex].suspectAdditionalDetailsCheckboxes,
      suspectIndex,
    );
  }, [state.formData.suspects, suspectIndex]);

  const [formDataErrors, setFormDataErrors] = useState<FormDataErrors>({});

  const errorSummaryProperties = useCallback(
    (errorKey: keyof FormDataErrors) => {
      if (errorKey === "suspectEthnicityRadio") {
        return {
          children: formDataErrors[errorKey]?.errorSummaryText,
          href: "#suspect-enthinicity-radio-0",
          "data-testid": "suspect-enthinicity-radio-link",
        };
      }

      return null;
    },
    [formDataErrors],
  );

  const validateFormData = (state: CaseRegistrationState) => {
    const errors: FormDataErrors = {};
    const {
      formData: { suspects },
    } = state;
    const { suspectEthnicityRadio = { shortCode: null, description: "" } } =
      suspects[suspectIndex] || {};

    if (!suspectEthnicityRadio.shortCode) {
      errors.suspectEthnicityRadio = {
        errorSummaryText: "Please select an option",
        inputErrorText: "Please select an option",
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
    if (errorList.length) errorSummaryRef.current?.focus();
  }, [errorList]);

  useEffect(() => {
    if (!isEthnicitysLoading && ethnicityData) {
      dispatch({
        type: "SET_CASE_SUSPECT_ETHINICITIES",
        payload: {
          suspectEthinicities: ethnicityData,
        },
      });
    }
  }, [ethnicityData, dispatch, isEthnicitysLoading]);

  const enthinicityItems = useMemo(() => {
    if (!state.apiData.suspectEthinicities) return [];
    return state.apiData.suspectEthinicities.map((enthinicity, index) => ({
      id: `suspect-enthinicity-radio-${index}`,
      children: enthinicity.description,
      value: enthinicity.shortCode,
      "data-testid": `suspect-enthinicity-radio-${index}`,
    }));
  }, [state.apiData.suspectEthinicities]);

  const setFormValue = (value: string) => {
    const selectedEthnicity = state.apiData.suspectEthinicities?.find(
      (enthinicity) => enthinicity.shortCode === value,
    );
    if (selectedEthnicity) {
      dispatch({
        type: "SET_SUSPECT_FIELD",
        payload: {
          index: suspectIndex,
          field: "suspectEthnicityRadio",
          value: selectedEthnicity,
        },
      });
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateFormData(state)) return;

    const nextRoute = getNextSuspectJourneyRoute(
      "suspect-ethnicity",
      state.formData.suspects[suspectIndex].suspectAdditionalDetailsCheckboxes,
      suspectIndex,
    );
    return navigate(nextRoute);
  };

  const {
    formData: { suspects },
  } = state;

  const {
    suspectEthnicityRadio = { shortCode: null, description: "" },
    suspectFirstNameText = "",
    suspectLastNameText = "",
  } = suspects[suspectIndex] || {};

  return (
    <div className={styles.caseDetailsPage}>
      <BackLink to={previousRoute}>Back</BackLink>
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
                children: (
                  <h1>{`What is ${suspectLastNameText} ${suspectFirstNameText}'s ethnicity?`}</h1>
                ),
              },
            }}
            errorMessage={
              formDataErrors["suspectEthnicityRadio"]
                ? {
                    children:
                      formDataErrors["suspectEthnicityRadio"].inputErrorText,
                  }
                : undefined
            }
            items={enthinicityItems}
            value={suspectEthnicityRadio.shortCode || ""}
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

export default SuspectEthnicityPage;

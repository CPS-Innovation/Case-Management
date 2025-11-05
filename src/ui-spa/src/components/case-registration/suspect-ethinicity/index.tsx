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
import styles from "./index.module.scss";

const SuspectEthinicityPage = () => {
  type ErrorText = {
    errorSummaryText: string;
    inputErrorText?: string;
  };
  type FormDataErrors = {
    suspectEthinicityRadio?: ErrorText;
  };
  const errorSummaryRef = useRef<HTMLInputElement>(null);
  const { state, dispatch } = useContext(CaseRegistrationFormContext);
  const navigate = useNavigate();
  const { suspectId } = useParams<{ suspectId: string }>() as {
    suspectId: string;
  };

  const suspectIndex = useMemo(() => {
    const index = suspectId.replace("suspect-", "");
    return Number.parseInt(index, 10) - 1;
  }, [suspectId]);

  const {
    data: ethinicityData,
    isLoading: isEthinicitysLoading,
    error: ethinicityError,
  } = useQuery({
    queryKey: ["ethnicities"],
    enabled: true,
    queryFn: () => getEthnicities(),
    retry: false,
  });

  useEffect(() => {
    if (ethinicityError) throw ethinicityError;
  }, [ethinicityError]);

  const [formDataErrors, setFormDataErrors] = useState<FormDataErrors>({});

  const errorSummaryProperties = useCallback(
    (errorKey: keyof FormDataErrors) => {
      if (errorKey === "suspectEthinicityRadio") {
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
    const { suspectEthinicityRadio = { shortCode: null, description: "" } } =
      suspects[suspectIndex] || {};

    if (!suspectEthinicityRadio.shortCode) {
      errors.suspectEthinicityRadio = {
        errorSummaryText: "Please select an option for suspect ethinicity",
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
    if (!isEthinicitysLoading && ethinicityData) {
      dispatch({
        type: "SET_CASE_SUSPECT_ETHINICITIES",
        payload: {
          suspectEthinicities: ethinicityData,
        },
      });
    }
  }, [ethinicityData, dispatch, isEthinicitysLoading]);

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
    const selectedEthinicity = state.apiData.suspectEthinicities?.find(
      (enthinicity) => enthinicity.shortCode === value,
    );
    if (selectedEthinicity) {
      dispatch({
        type: "SET_SUSPECT_FIELD",
        payload: {
          index: suspectIndex,
          field: "suspectEthinicityRadio",
          value: selectedEthinicity,
        },
      });
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateFormData(state)) return;

    console.log("rrrrrrrrr");
    return navigate(`/case-registration/suspect-1/suspect-religion`);
  };

  const {
    formData: { suspects },
  } = state;

  const { suspectEthinicityRadio = { shortCode: null, description: "" } } =
    suspects[suspectIndex] || {};

  return (
    <div className={styles.caseDetailsPage}>
      <BackLink to={`/case-registration/${suspectId}/suspect-DOB`}>
        Back
      </BackLink>
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
                children: <h1>What is ethnicity?</h1>,
              },
            }}
            errorMessage={
              formDataErrors["suspectEthinicityRadio"]
                ? {
                    children:
                      formDataErrors["suspectEthinicityRadio"].errorSummaryText,
                  }
                : undefined
            }
            items={enthinicityItems}
            value={suspectEthinicityRadio.shortCode || ""}
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

export default SuspectEthinicityPage;

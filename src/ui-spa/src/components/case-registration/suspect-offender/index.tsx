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

const SuspectOffenderPage = () => {
  type ErrorText = {
    errorSummaryText: string;
    inputErrorText?: string;
  };
  type FormDataErrors = {
    suspectOffenderRadio?: ErrorText;
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
    data: offenderData,
    isLoading: isOffendersLoading,
    error: offenderError,
  } = useQuery({
    queryKey: ["offenders"],
    enabled: true,
    queryFn: () => getEthnicities(),
    retry: false,
  });

  useEffect(() => {
    if (offenderError) throw offenderError;
  }, [offenderError]);

  const [formDataErrors, setFormDataErrors] = useState<FormDataErrors>({});

  const errorSummaryProperties = useCallback(
    (errorKey: keyof FormDataErrors) => {
      if (errorKey === "suspectOffenderRadio") {
        return {
          children: formDataErrors[errorKey]?.errorSummaryText,
          href: "#suspect-offender-radio-0",
          "data-testid": "suspect-offender-radio-link",
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
    const { suspectOffenderRadio = { shortCode: null, description: "" } } =
      suspects[suspectIndex] || {};

    if (!suspectOffenderRadio.shortCode) {
      errors.suspectOffenderRadio = {
        errorSummaryText: "Please select an option for suspect offender",
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
    if (!isOffendersLoading && offenderData) {
      dispatch({
        type: "SET_CASE_SUSPECT_OFFENDERS",
        payload: {
          suspectOffenders: offenderData,
        },
      });
    }
  }, [offenderData, dispatch, isOffendersLoading]);

  const offenderItems = useMemo(() => {
    if (!state.apiData.suspectOffenders) return [];
    return state.apiData.suspectOffenders.map((offender, index) => ({
      id: `suspect-offender-radio-${index}`,
      children: offender.description,
      value: offender.shortCode,
      "data-testid": `suspect-offender-radio-${index}`,
    }));
  }, [state.apiData.suspectOffenders]);

  const setFormValue = (value: string) => {
    const selectedOffender = state.apiData.suspectOffenders?.find(
      (offender) => offender.shortCode === value,
    );
    if (selectedOffender) {
      dispatch({
        type: "SET_SUSPECT_FIELD",
        payload: {
          index: suspectIndex,
          field: "suspectOffenderRadio",
          value: selectedOffender,
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

  const { suspectOffenderRadio = { shortCode: null, description: "" } } =
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
              formDataErrors["suspectOffenderRadio"]
                ? {
                    children:
                      formDataErrors["suspectOffenderRadio"].errorSummaryText,
                  }
                : undefined
            }
            items={offenderItems}
            value={suspectOffenderRadio.shortCode || ""}
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

export default SuspectOffenderPage;

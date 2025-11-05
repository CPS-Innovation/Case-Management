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
import { useNavigate, useParams } from "react-router-dom";
import styles from "./index.module.scss";

const SuspectDisabilityPage = () => {
  type ErrorText = {
    errorSummaryText: string;
    inputErrorText?: string;
  };
  type FormDataErrors = {
    suspectDisabilityRadio?: ErrorText;
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

  const [formDataErrors, setFormDataErrors] = useState<FormDataErrors>({});

  const errorSummaryProperties = useCallback(
    (errorKey: keyof FormDataErrors) => {
      if (errorKey === "suspectDisabilityRadio") {
        return {
          children: formDataErrors[errorKey]?.errorSummaryText,
          href: "#suspect-disability-radio-yes",
          "data-testid": "suspect-disability-radio-link",
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
    const { suspectDisabilityRadio = "" } = suspects[suspectIndex] || {};

    if (!suspectDisabilityRadio) {
      errors.suspectDisabilityRadio = {
        errorSummaryText: "Please select an option for suspect disability",
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

  const setFormValue = (value: string) => {
    dispatch({
      type: "SET_SUSPECT_FIELD",
      payload: {
        index: suspectIndex,
        field: "suspectDisabilityRadio",
        value: value,
      },
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateFormData(state)) return;

    console.log("rrrrrrrrr");
    return navigate(`/case-registration/suspect-1/suspect-sdo`);
  };

  const {
    formData: { suspects },
  } = state;

  const { suspectDisabilityRadio = "" } = suspects[suspectIndex] || {};

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
                children: <h1>Does the suspect have a disability?</h1>,
              },
            }}
            errorMessage={
              formDataErrors["suspectDisabilityRadio"]
                ? {
                    children:
                      formDataErrors["suspectDisabilityRadio"].errorSummaryText,
                  }
                : undefined
            }
            items={[
              {
                id: `suspect-disability-radio-yes`,
                children: "Yes",
                value: "yes",
                "data-testid": `suspect-disability-radio-yes`,
              },
              {
                id: `suspect-disability-radio-no`,
                children: "No",
                value: "no",
                "data-testid": `suspect-disability-radio-no`,
              },
            ]}
            value={suspectDisabilityRadio}
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

export default SuspectDisabilityPage;

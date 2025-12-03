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
import { useNavigate } from "react-router-dom";
import styles from "../index.module.scss";

const WantToAddCharges = () => {
  type ErrorText = {
    errorSummaryText: string;
    inputErrorText?: string;
  };
  type FormDataErrors = {
    wantToAddChargesRadio?: ErrorText;
  };
  const errorSummaryRef = useRef<HTMLInputElement>(null);
  const { state, dispatch } = useContext(CaseRegistrationFormContext);
  const navigate = useNavigate();

  const [formDataErrors, setFormDataErrors] = useState<FormDataErrors>({});

  const errorSummaryProperties = useCallback(
    (errorKey: keyof FormDataErrors) => {
      if (errorKey === "wantToAddChargesRadio") {
        return {
          children: formDataErrors[errorKey]?.errorSummaryText,
          href: "#add-radio-yes",
          "data-testid": "add-charges-radio-link",
        };
      }

      return null;
    },
    [formDataErrors],
  );

  const validateFormData = (state: CaseRegistrationState) => {
    let isValid = true;
    const errors: FormDataErrors = {};
    const {
      formData: { wantToAddChargesRadio },
    } = state;

    if (!wantToAddChargesRadio) {
      errors.wantToAddChargesRadio = {
        errorSummaryText: "Please select an option ",
        inputErrorText: "Please select an option",
      };
      isValid = false;
    }

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
      type: "SET_FIELD",
      payload: {
        field: "wantToAddChargesRadio",
        value: value,
      },
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateFormData(state)) return;
    if (state.formData.suspects.length > 1) {
      return navigate("/case-registration/select-suspect-for-charges");
    }
    return navigate(
      `/case-registration/suspect-0/charge-0/charges-offence-search`,
    );
  };

  const {
    formData: { suspects, wantToAddChargesRadio },
  } = state;

  return (
    <div>
      <BackLink to={"/case-registration/suspect-summary"}>Back</BackLink>
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
                  <h1>
                    {suspects.length > 1
                      ? `Do you want to add charges for any of the suspects?`
                      : `Do you want to add charges for the suspect?`}
                  </h1>
                ),
              },
            }}
            errorMessage={
              formDataErrors["wantToAddChargesRadio"]
                ? {
                    children:
                      formDataErrors["wantToAddChargesRadio"].inputErrorText,
                  }
                : undefined
            }
            items={[
              {
                id: `want-to-add-charges-radio-yes`,
                children: "Yes",
                value: "yes",
                "data-testid": `want-to-add-charges-radio-yes`,
              },
              {
                id: `want-to-add-charges-radio-no`,
                children: "No",
                value: "no",
                "data-testid": `want-to-add-charges-radio-no`,
              },
            ]}
            value={wantToAddChargesRadio}
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

export default WantToAddCharges;

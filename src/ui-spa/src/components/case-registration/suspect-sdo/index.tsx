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

const SuspectSDOPage = () => {
  type ErrorText = {
    errorSummaryText: string;
    inputErrorText?: string;
  };
  type FormDataErrors = {
    suspectSDORadio?: ErrorText;
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
      if (errorKey === "suspectSDORadio") {
        return {
          children: formDataErrors[errorKey]?.errorSummaryText,
          href: "#suspect-SDO-radio-yes",
          "data-testid": "suspect-SDO-radio-link",
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
    const { suspectSDORadio = "" } = suspects[suspectIndex] || {};

    if (!suspectSDORadio) {
      errors.suspectSDORadio = {
        errorSummaryText: "Please select an option ",
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
        field: "suspectSDORadio",
        value: value,
      },
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateFormData(state)) return;

    console.log("rrrrrrrrr");
    return navigate(`/case-registration/suspect-1/suspect-asn`);
  };

  const {
    formData: { suspects },
  } = state;

  const { suspectSDORadio = "" } = suspects[suspectIndex] || {};

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
            data-testid={"case-suspect-SDO-error-summary"}
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
                children: <h1>Is a serious dangerous offender (SDO)?</h1>,
              },
            }}
            errorMessage={
              formDataErrors["suspectSDORadio"]
                ? {
                    children:
                      formDataErrors["suspectSDORadio"].errorSummaryText,
                  }
                : undefined
            }
            items={[
              {
                id: `suspect-SDO-radio-yes`,
                children: "Yes",
                value: "yes",
                "data-testid": `suspect-SDO-radio-yes`,
              },
              {
                id: `suspect-SDO-radio-no`,
                children: "No",
                value: "no",
                "data-testid": `suspect-SDO-radio-no`,
              },
            ]}
            value={suspectSDORadio}
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

export default SuspectSDOPage;

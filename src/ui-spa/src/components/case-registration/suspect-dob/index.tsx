import {
  useRef,
  useEffect,
  useState,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { Button, ErrorSummary, BackLink, DateInput } from "../../govuk";
import { CaseRegistrationFormContext } from "../../../common/providers/CaseRegistrationProvider";
import { type CaseRegistrationState } from "../../../common/reducers/caseRegistrationReducer";
import { validateDate } from "../../../common/utils/dateValidation";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./index.module.scss";

const SuspectDOBPage = () => {
  type ErrorText = {
    errorSummaryText: string;
    inputErrorFields: string[];
  };
  type FormDataErrors = {
    suspectDOBDateError?: ErrorText;
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

  const errorSummaryProperties = useCallback(() => {
    if (formDataErrors.suspectDOBDateError?.inputErrorFields.includes("day")) {
      return {
        href: "#suspect-DOB-day-text",
        "data-testid": "suspect-DOB-day-text-link",
      };
    }
    if (
      formDataErrors.suspectDOBDateError?.inputErrorFields.includes("month")
    ) {
      return {
        href: "#suspect-DOB-month-text",
        "data-testid": "suspect-DOB-month-text-link",
      };
    }
    if (formDataErrors.suspectDOBDateError?.inputErrorFields.includes("year")) {
      return {
        href: "#suspect-DOB-year-text",
        "data-testid": "suspect-DOB-year-text-link",
      };
    }
  }, [formDataErrors]);

  const validateFormData = (state: CaseRegistrationState) => {
    const errors: FormDataErrors = {};
    const {
      formData: { suspects },
    } = state;
    const {
      suspectDOBDayText = "",
      suspectDOBMonthText = "",
      suspectDOBYearText = "",
    } = suspects[suspectIndex] || {};
    const result = validateDate(
      +suspectDOBDayText,
      +suspectDOBMonthText,
      +suspectDOBYearText,
    );
    const inputErrorFields = [];
    if (result.errors.includes("invalid day")) {
      inputErrorFields.push("day");
    }
    if (result.errors.includes("invalid month")) {
      inputErrorFields.push("month");
    }
    if (result.errors.includes("invalid year")) {
      inputErrorFields.push("year");
    }
    if (result.errors.length) {
      errors.suspectDOBDateError = {
        errorSummaryText: "Date of birth must be a valid date",
        inputErrorFields,
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

    const errorSummary = validErrorKeys.map((key) => ({
      reactListKey: `${key}`,
      children: formDataErrors.suspectDOBDateError?.errorSummaryText,
      ...errorSummaryProperties()!,
    }));

    return errorSummary;
  }, [formDataErrors, errorSummaryProperties]);

  useEffect(() => {
    if (errorList.length) errorSummaryRef.current?.focus();
  }, [errorList]);

  const setFormValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    let field:
      | "suspectDOBDayText"
      | "suspectDOBMonthText"
      | "suspectDOBYearText" = "suspectDOBDayText";

    if (event.target.name === "suspect-DOB-month") {
      field = "suspectDOBMonthText";
    }
    if (event.target.name === "suspect-DOB-year") {
      field = "suspectDOBYearText";
    }

    console.log("event.target.name", event.target.name);

    const value = event.target.value;

    const newValue = value.replaceAll(/\D/g, "");

    dispatch({
      type: "SET_SUSPECT_FIELD",
      payload: {
        index: suspectIndex,
        field: field,
        value: newValue,
      },
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateFormData(state)) return;

    return navigate(
      `/case-registration/suspect-1/aliases/aliases-1/add-aliases`,
    );
  };

  const {
    formData: { suspects },
  } = state;

  const {
    suspectFirstNameText = "",
    suspectLastNameText = "",
    suspectDOBDayText = "",
    suspectDOBMonthText = "",
    suspectDOBYearText = "",
  } = suspects[suspectIndex] || {};

  return (
    <div className={styles.addSuspectPage}>
      <BackLink to="/case-registration/first-hearing">Back</BackLink>
      {!!errorList.length && (
        <div
          ref={errorSummaryRef}
          tabIndex={-1}
          className={styles.errorSummaryWrapper}
        >
          <ErrorSummary
            data-testid={"add-suspect-error-summary"}
            errorList={errorList}
            titleChildren="There is a problem"
          />
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className={styles.inputWrapper}>
          <DateInput
            errorMessage={
              formDataErrors.suspectDOBDateError
                ? {
                    children:
                      formDataErrors.suspectDOBDateError.errorSummaryText,
                  }
                : undefined
            }
            fieldset={{
              legend: {
                children: (
                  <h1>{`What is ${suspectFirstNameText} ${suspectLastNameText}'s date of birth?`}</h1>
                ),
              },
            }}
            hint={{
              children: <span>For example, 27 3 2007</span>,
            }}
            id="suspect-DOB-date"
            items={[
              {
                id: "suspect-DOB-day-text",
                className: `govuk-input--width-2 ${
                  formDataErrors.suspectDOBDateError?.inputErrorFields.includes(
                    "day",
                  )
                    ? "govuk-input--error"
                    : ""
                }`,
                name: "day",
                value: suspectDOBDayText,
                maxLength: 2,
              },
              {
                id: "suspect-DOB-month-text",
                className: `govuk-input--width-2 ${
                  formDataErrors.suspectDOBDateError?.inputErrorFields.includes(
                    "month",
                  )
                    ? "govuk-input--error"
                    : ""
                }`,
                name: "month",
                value: suspectDOBMonthText,
                maxLength: 2,
              },
              {
                id: "suspect-DOB-year-text",
                className: `govuk-input--width-4 ${
                  formDataErrors.suspectDOBDateError?.inputErrorFields.includes(
                    "year",
                  )
                    ? "govuk-input--error"
                    : ""
                }`,
                name: "year",
                value: suspectDOBYearText,
                maxLength: 4,
              },
            ]}
            namePrefix="suspect-DOB"
            onChange={setFormValue}
          />
        </div>
        <Button type="submit" onClick={() => handleSubmit}>
          Save and Continue
        </Button>
      </form>
    </div>
  );
};

export default SuspectDOBPage;

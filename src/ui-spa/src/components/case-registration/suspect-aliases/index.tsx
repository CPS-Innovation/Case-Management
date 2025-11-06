import {
  useRef,
  useEffect,
  useState,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { Input, Button, ErrorSummary, BackLink } from "../../govuk";
import { CaseRegistrationFormContext } from "../../../common/providers/CaseRegistrationProvider";
import { type CaseRegistrationState } from "../../../common/reducers/caseRegistrationReducer";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./index.module.scss";

const SuspectAliasesPage = () => {
  type ErrorText = {
    errorSummaryText: string;
    inputErrorText?: string;
  };
  type FormDataErrors = {
    suspectAliasesLastNameText?: ErrorText;
  };
  const errorSummaryRef = useRef<HTMLInputElement>(null);
  const { state, dispatch } = useContext(CaseRegistrationFormContext);
  const navigate = useNavigate();
  const { suspectId, aliasesId } = useParams<{
    suspectId: string;
    aliasesId: string;
  }>() as {
    suspectId: string;
    aliasesId: string;
  };

  const suspectIndex = useMemo(() => {
    const index = suspectId.replace("suspect-", "");
    return Number.parseInt(index, 10) - 1;
  }, [suspectId]);

  const aliasesIndex = useMemo(() => {
    const index = aliasesId.replace("aliases-", "");
    return Number.parseInt(index, 10) - 1;
  }, [aliasesId]);

  const [formDataErrors, setFormDataErrors] = useState<FormDataErrors>({});

  const errorSummaryProperties = useCallback(
    (errorKey: keyof FormDataErrors) => {
      if (errorKey === "suspectAliasesLastNameText") {
        return {
          children: formDataErrors[errorKey]?.errorSummaryText,
          href: "#suspect-aliases-last-name-text",
          "data-testid": "suspect-aliases-last-name-text",
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
    const { suspectAliases = [] } = suspects[suspectIndex] || {};
    const { lastName } = suspectAliases[aliasesIndex] || {};

    if (!lastName) {
      errors.suspectAliasesLastNameText = {
        errorSummaryText: "Please add the last name",
        inputErrorText: "Please add the last name ",
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

  const setFormValue = (key: "firstName" | "lastName", value: string) => {
    const { suspectAliases = [] } = suspects[suspectIndex] || {};
    const newAliases = [...suspectAliases];
    newAliases[aliasesIndex] = {
      ...newAliases[aliasesIndex],
      [key]: value,
    };
    dispatch({
      type: "SET_SUSPECT_FIELD",
      payload: {
        index: suspectIndex,
        field: "suspectAliases",
        value: newAliases,
      },
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateFormData(state)) return;

    return navigate(`/case-registration/suspect-1/aliases-summary`);
  };

  const {
    formData: { suspects },
  } = state;

  const { suspectAliases = [] } = suspects[suspectIndex] || {};
  const { firstName = "", lastName = "" } = suspectAliases[aliasesIndex] || {};

  return (
    <div className={styles.caseSuspectAliasesPage}>
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
            data-testid={"case-suspect-Aliases-error-summary"}
            errorList={errorList}
            titleChildren="There is a problem"
          />
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <h1>What alias does use?</h1>
        <span className="govuk-hint">
          You can add more aliases on the next page if needed.
        </span>
        <div className={styles.inputWrapper}>
          <Input
            key="suspect-aliases-first-name-text"
            id="suspect-aliases-first-name-text"
            data-testid="suspect-aliases-first-name-text"
            className="govuk-input--width-20"
            label={{
              children: <h2>First name</h2>,
            }}
            hint={{ children: "Leave blank if you only have one name" }}
            type="text"
            value={firstName}
            onChange={(value: string) => {
              setFormValue("firstName", value);
            }}
          />
          <Input
            key="suspect-aliases-last-name-text"
            id="suspect-aliases-last-name-text"
            data-testid="suspect-aliases-last-name-text"
            className="govuk-input--width-20"
            errorMessage={
              formDataErrors["suspectAliasesLastNameText"]
                ? {
                    children:
                      formDataErrors["suspectAliasesLastNameText"]
                        .errorSummaryText,
                  }
                : undefined
            }
            label={{
              children: <h2>Last name</h2>,
            }}
            type="text"
            value={lastName}
            onChange={(value: string) => {
              setFormValue("lastName", value);
            }}
          />
          ,
        </div>
        <Button type="submit" onClick={() => handleSubmit}>
          Save and Continue
        </Button>
      </form>
    </div>
  );
};

export default SuspectAliasesPage;

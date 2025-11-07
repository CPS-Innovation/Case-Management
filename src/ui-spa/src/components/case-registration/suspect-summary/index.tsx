import {
  useRef,
  useEffect,
  useState,
  useContext,
  useCallback,
  useMemo,
} from "react";
import {
  Radios,
  Button,
  ErrorSummary,
  BackLink,
  SummaryList,
} from "../../govuk";
import { CaseRegistrationFormContext } from "../../../common/providers/CaseRegistrationProvider";
import { getNextSuspectJourneyRoute } from "../../../common/utils/getNextSuspectJourneyRoute";
import { useNavigate, useParams } from "react-router-dom";
import { type SuspectFormData } from "../../../common/reducers/caseRegistrationReducer";
import styles from "./index.module.scss";

const SuspectSummaryPage = () => {
  type ErrorText = {
    errorSummaryText: string;
    inputErrorText?: string;
  };
  type FormDataErrors = {
    addMoreAliasesRadio?: ErrorText;
  };
  const errorSummaryRef = useRef<HTMLInputElement>(null);
  const { state, dispatch } = useContext(CaseRegistrationFormContext);
  const navigate = useNavigate();
  const { suspectId } = useParams<{
    suspectId: string;
  }>() as {
    suspectId: string;
  };

  const [addMoreAliasesRadio, setAddMoreAliasesRadio] = useState<string>();
  const suspectIndex = useMemo(() => {
    const index = suspectId.replace("suspect-", "");
    return Number.parseInt(index, 10);
  }, [suspectId]);

  const [formDataErrors, setFormDataErrors] = useState<FormDataErrors>({});

  const errorSummaryProperties = useCallback(
    (errorKey: keyof FormDataErrors) => {
      if (errorKey === "addMoreAliasesRadio") {
        return {
          children: formDataErrors[errorKey]?.errorSummaryText,
          href: "#add-more-aliases-radio-yes",
          "data-testid": "add-more-aliases-radio-yes",
        };
      }
      return null;
    },
    [formDataErrors],
  );

  const validateFormData = () => {
    const errors: FormDataErrors = {};

    if (!addMoreAliasesRadio) {
      errors.addMoreAliasesRadio = {
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

  const getSuspectSummaryListRows = (suspects: SuspectFormData[]) => {
    const rows = suspects.map((suspect, index) => ({
      key: { children: <span>Suspect {index + 1}</span> },
      value: {
        children: (
          <p>
            {suspect.suspectFirstNameText}, {suspect.suspectLastNameText}
          </p>
        ),
      },
      actions: {
        items: [
          {
            children: <span>Change</span>,
            to: `/case-registration/suspect-${index}/add-suspect`,
            visuallyHiddenText: "Edit Suspect Details",
          },
          {
            children: <span>Remove</span>,
            to: "#",
            visuallyHiddenText: "remove suspect",
            role: "button",
            onClick: () => handleRemoveSuspect(index),
          },
        ],
      },
    }));

    return rows;
  };
  const handleRemoveSuspect = (index: number) => {
    const {
      formData: { suspects },
    } = state;
    const newSuspects = suspects.filter((_, i) => i !== index);
    dispatch({
      type: "SET_REMOVE_SUSPECT",
      payload: {
        value: newSuspects,
      },
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateFormData()) return;

    if (addMoreAliasesRadio === "yes") {
      return navigate(`/case-registration/${suspectId}/add-aliases`);
    }

    const nextRoute = getNextSuspectJourneyRoute(
      "add-aliases",
      state.formData.suspects[suspectIndex].suspectAdditionalDetailsCheckboxes,
      suspectIndex,
    );
    return navigate(nextRoute);
  };

  const {
    formData: { suspects },
  } = state;

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
        <h1>Aliases for ws ddd</h1>
        <div>
          <SummaryList rows={getSuspectSummaryListRows(suspects)} />
        </div>
        <div className={styles.inputWrapper}>
          <Radios
            fieldset={{
              legend: {
                children: <h2>Do you need to add another alias for ws ddd?</h2>,
              },
            }}
            errorMessage={
              formDataErrors["addMoreAliasesRadio"]
                ? {
                    children:
                      formDataErrors["addMoreAliasesRadio"].errorSummaryText,
                  }
                : undefined
            }
            items={[
              {
                id: `suspect-add-more-aliases-radio-yes`,
                children: "Yes",
                value: "yes",
                "data-testid": `suspect-add-more-aliases-radio-yes`,
              },
              {
                id: `suspect-add-more-aliases-radio-no`,
                children: "No",
                value: "no",
                "data-testid": `suspect-add-more-aliases-radio-no`,
              },
            ]}
            value={addMoreAliasesRadio}
            onChange={(value) => {
              setAddMoreAliasesRadio(value);
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

export default SuspectSummaryPage;

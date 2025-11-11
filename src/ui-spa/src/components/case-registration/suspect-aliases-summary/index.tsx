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
import { getNextSuspectJourneyRoute } from "../../../common/utils/getSuspectJourneyRoutes";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../index.module.scss";
import pageStyles from "./index.module.scss";

const SuspectAliasesSummaryPage = () => {
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
          href: "#suspect-add-more-aliases-radio-yes",
          "data-testid": "suspect-add-more-aliases-radio-yes",
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

  const getSuspectSummaryListRows = (
    suspectAliases: { firstName?: string; lastName: string }[],
  ) => {
    const rows = suspectAliases.map((alias, index) => ({
      key: { children: <span>Alias {index + 1}</span> },
      value: {
        children: (
          <p>
            {alias.lastName}, {alias.firstName}
          </p>
        ),
      },
      actions: {
        items: [
          {
            children: <span>Change</span>,
            to: `/case-registration/suspect-1/suspect-add-aliases?alias=${index}`,
            visuallyHiddenText: "Edit Suspect Details",
          },
          {
            children: <span>Remove</span>,
            to: "#",
            visuallyHiddenText: "remove a suspect alias",
            role: "button",
            onClick: () => handleRemoveAlias(index),
          },
        ],
      },
    }));

    return rows;
  };
  const handleRemoveAlias = (index: number) => {
    const {
      formData: { suspects },
    } = state;
    const suspectAliases = suspects[suspectIndex]?.suspectAliases || [];
    const newAliases = suspectAliases.filter((_, i) => i !== index);
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

    if (!validateFormData()) return;

    if (addMoreAliasesRadio === "yes") {
      return navigate(`/case-registration/${suspectId}/suspect-add-aliases`);
    }

    const nextRoute = getNextSuspectJourneyRoute(
      "suspect-add-aliases",
      state.formData.suspects[suspectIndex].suspectAdditionalDetailsCheckboxes,
      suspectIndex,
    );
    return navigate(nextRoute);
  };

  const {
    formData: { suspects },
  } = state;
  const { suspectFirstNameText = "", suspectLastNameText = "" } =
    suspects[suspectIndex] || {};
  const suspectAliases = suspects[suspectIndex]?.suspectAliases || [];

  return (
    <div className={pageStyles.caseSuspectAliasesSummaryPage}>
      <BackLink to={`/case-registration/${suspectId}/suspect-add-aliases`}>
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
        <h1>
          Aliases for {suspectLastNameText} {suspectFirstNameText}
        </h1>
        <div className={pageStyles.summaryListWrapper}>
          <SummaryList rows={getSuspectSummaryListRows(suspectAliases)} />
        </div>
        {!suspectAliases.length && <span>There are no aliases</span>}
        <div className={styles.inputWrapper}>
          <Radios
            fieldset={{
              legend: {
                children: (
                  <>
                    {suspectAliases.length ? (
                      <h2>
                        Do you need to add another alias for{" "}
                        {suspectLastNameText} {suspectFirstNameText}?
                      </h2>
                    ) : (
                      <h2>
                        Do you need to add alias for {suspectLastNameText}{" "}
                        {suspectFirstNameText}?
                      </h2>
                    )}
                  </>
                ),
              },
            }}
            errorMessage={
              formDataErrors["addMoreAliasesRadio"]
                ? {
                    children:
                      formDataErrors["addMoreAliasesRadio"].inputErrorText,
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

export default SuspectAliasesSummaryPage;

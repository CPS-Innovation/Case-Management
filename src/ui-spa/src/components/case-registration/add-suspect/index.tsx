import {
  useRef,
  useEffect,
  useState,
  useContext,
  useCallback,
  useMemo,
} from "react";
import {
  Input,
  Radios,
  Button,
  ErrorSummary,
  BackLink,
  Checkboxes,
} from "../../govuk";
import { CaseRegistrationFormContext } from "../../../common/providers/CaseRegistrationProvider";
import {
  type CaseRegistrationState,
  type SuspectAdditionalDetailValue,
} from "../../../common/reducers/caseRegistrationReducer";
import { getNextSuspectJourneyRoute } from "../../../common/utils/getSuspectJourneyRoutes";

import { useNavigate, useParams } from "react-router-dom";
import styles from "../index.module.scss";

const AddSuspectPage = () => {
  type ErrorText = {
    errorSummaryText: string;
    inputErrorText?: string;
    hasLink: boolean;
  };
  type FormDataErrors = {
    addSuspectRadio?: ErrorText;
    suspectLastNameText?: ErrorText;
    suspectCompanyNameText?: ErrorText;
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

  const suspectAdditionalDetails: SuspectAdditionalDetailValue[] = useMemo(
    () => [
      "Date of Birth",
      "Gender",
      "Disability",
      "Religion",
      "Ethnicity",
      "Alias details",
      "Serious dangerous offender (SDO)",
      "Arrest summons number (ASN)",
      "Type of offender",
    ],
    [],
  );

  const [formDataErrors, setFormDataErrors] = useState<FormDataErrors>({});

  const errorSummaryProperties = useCallback(
    (errorKey: keyof FormDataErrors) => {
      switch (errorKey) {
        case "addSuspectRadio":
          return {
            children: formDataErrors[errorKey]?.errorSummaryText,
            href: "#add-suspect-radio-person",
            "data-testid": "add-suspect-radio-link",
          };
        case "suspectLastNameText":
          return {
            children: formDataErrors[errorKey]?.errorSummaryText,
            href: "#suspect-last-name-text",
            "data-testid": "suspect-last-name-text-link",
          };

        case "suspectCompanyNameText":
          return {
            children: formDataErrors[errorKey]?.errorSummaryText,
            href: "#suspect-company-name-text",
            "data-testid": "suspect-company-name-text-link",
          };
        default:
          return null;
      }
    },
    [formDataErrors],
  );

  const validateFormData = (state: CaseRegistrationState) => {
    const errors: FormDataErrors = {};
    const {
      formData: { suspects },
    } = state;
    const { addSuspectRadio = "", suspectLastNameText = "" } =
      suspects[suspectIndex] || {};

    if (!addSuspectRadio) {
      errors.addSuspectRadio = {
        errorSummaryText: "Please select an option for adding a suspect",
        inputErrorText: "Please select an option for adding a suspect",
        hasLink: true,
      };
    }

    if (addSuspectRadio == "person" && !suspectLastNameText) {
      errors.suspectLastNameText = {
        errorSummaryText: "Please add Last name for the suspect",
        inputErrorText: "Please add Last name for the suspect",
        hasLink: true,
      };
    }

    if (addSuspectRadio == "company" && !suspectCompanyNameText) {
      errors.suspectCompanyNameText = {
        errorSummaryText: "Please add Company name for the suspect",
        inputErrorText: "Please add Company name for the suspect",
        hasLink: true,
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

  const setFormValue = (
    fieldName:
      | "addSuspectRadio"
      | "suspectFirstNameText"
      | "suspectLastNameText"
      | "suspectAdditionalDetailsCheckboxes"
      | "suspectCompanyNameText",
    value: string | SuspectAdditionalDetailValue[],
  ) => {
    dispatch({
      type: "SET_SUSPECT_FIELD",
      payload: { index: suspectIndex, field: fieldName, value: value },
    });
  };

  const handleAdditionalDetailsChange = (
    value: SuspectAdditionalDetailValue,
  ) => {
    const currentValues =
      state.formData.suspects[suspectIndex]
        .suspectAdditionalDetailsCheckboxes ?? [];
    let newValues: SuspectAdditionalDetailValue[] = [];
    if (currentValues.includes(value)) {
      newValues = currentValues.filter((item) => item !== value);
    } else {
      newValues = [...currentValues, value];
    }

    setFormValue("suspectAdditionalDetailsCheckboxes", newValues);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateFormData(state)) return;
    dispatch({
      type: "RESET_SUSPECT_FIELD",
      payload: { index: suspectIndex },
    });

    if (state.formData.suspects[suspectIndex].addSuspectRadio === "company") {
      navigate("/case-registration/suspect-summary");
      return;
    }

    const nextRoute = getNextSuspectJourneyRoute(
      "add-suspect",
      state.formData.suspects[suspectIndex].suspectAdditionalDetailsCheckboxes,
      suspectIndex,
      state.formData.suspects[suspectIndex].suspectAliases.length > 0,
    );

    return navigate(nextRoute);
  };

  const {
    formData: { suspects },
  } = state;

  const {
    addSuspectRadio = "",
    suspectFirstNameText = "",
    suspectLastNameText = "",
    suspectCompanyNameText = "",
    suspectAdditionalDetailsCheckboxes = [],
  } = suspects[suspectIndex] || {};
  return (
    <div>
      <BackLink to="/case-registration/case-details">Back</BackLink>
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
          <Radios
            fieldset={{
              legend: {
                children: <h1>{`Add Suspect ${suspectIndex + 1}`}</h1>,
              },
            }}
            errorMessage={
              formDataErrors["addSuspectRadio"]
                ? {
                    children: formDataErrors["addSuspectRadio"].inputErrorText,
                  }
                : undefined
            }
            items={[
              {
                id: "add-suspect-radio-person",
                children: "Person",
                value: "person",
                "data-testid": "add-suspect-radio-person",
                conditional: {
                  children: [
                    <Input
                      key="suspect-first-name-text"
                      id="suspect-first-name-text"
                      data-testid="suspect-first-name-text"
                      className="govuk-input--width-20"
                      label={{
                        children: <b>First name (optional)</b>,
                      }}
                      type="text"
                      value={suspectFirstNameText}
                      onChange={(value: string) => {
                        setFormValue("suspectFirstNameText", value);
                      }}
                    />,
                    <Input
                      key="suspect-last-name-text"
                      id="suspect-last-name-text"
                      data-testid="suspect-last-name-text"
                      className="govuk-input--width-20"
                      label={{
                        children: <b>Last name</b>,
                      }}
                      errorMessage={
                        formDataErrors["suspectLastNameText"]
                          ? {
                              children:
                                formDataErrors["suspectLastNameText"]
                                  .inputErrorText,
                            }
                          : undefined
                      }
                      type="text"
                      value={suspectLastNameText}
                      onChange={(value: string) => {
                        setFormValue("suspectLastNameText", value);
                      }}
                    />,
                    <Checkboxes
                      key="case-additional-details-checkboxes"
                      fieldset={{
                        legend: {
                          children: (
                            <h2>
                              Do you want to add any additional details about
                              this suspect?
                            </h2>
                          ),
                        },
                      }}
                      hint={{
                        children: "Select all that apply.",
                      }}
                      items={suspectAdditionalDetails.map((detail, index) => ({
                        id: `case-additional-details-${index}`,
                        children: detail,
                        value: detail,
                        "data-testid": `case-additional-details-${index}`,
                        checked:
                          suspectAdditionalDetailsCheckboxes?.includes(detail),
                      }))}
                      onChange={(event) => {
                        const { value } = event.target;
                        if (value)
                          handleAdditionalDetailsChange(
                            value as SuspectAdditionalDetailValue,
                          );
                      }}
                    />,
                  ],
                },
              },
              {
                children: "Company",
                value: "company",
                "data-testid": "add-suspect-company-name-text",
                conditional: {
                  children: [
                    <Input
                      key="suspect-company-name-text"
                      id="suspect-company-name-text"
                      data-testid="suspect-company-name-text"
                      className="govuk-input--width-20"
                      label={{
                        children: <b>Company name</b>,
                      }}
                      errorMessage={
                        formDataErrors["suspectCompanyNameText"]
                          ? {
                              children:
                                formDataErrors["suspectCompanyNameText"]
                                  .inputErrorText,
                            }
                          : undefined
                      }
                      type="text"
                      value={suspectCompanyNameText}
                      onChange={(value: string) => {
                        setFormValue("suspectCompanyNameText", value);
                      }}
                    />,
                  ],
                },
              },
            ]}
            value={addSuspectRadio}
            onChange={(value) => {
              if (value) setFormValue("addSuspectRadio", value);
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

export default AddSuspectPage;

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
import { useNavigate } from "react-router-dom";
import { formatNameUtil } from "../../../common/utils/formatNameUtil";
import styles from "../index.module.scss";

const AddChargeSuspectPage = () => {
  type ErrorText = {
    errorSummaryText: string;
    inputErrorText?: string;
  };
  type FormDataErrors = {
    addChargeSuspectRadio?: ErrorText;
  };

  const [addChargeSuspectRadio, setAddChargeSuspectRadio] = useState<{
    suspectId: string;
  }>({ suspectId: "" });

  const errorSummaryRef = useRef<HTMLInputElement>(null);
  const { state } = useContext(CaseRegistrationFormContext);
  const navigate = useNavigate();

  const [formDataErrors, setFormDataErrors] = useState<FormDataErrors>({});

  const errorSummaryProperties = useCallback(
    (errorKey: keyof FormDataErrors) => {
      if (errorKey === "addChargeSuspectRadio") {
        return {
          children: formDataErrors[errorKey]?.errorSummaryText,
          href: "#suspect-religion-radio-0",
          "data-testid": "suspect-religion-radio-link",
        };
      }

      return null;
    },
    [formDataErrors],
  );

  const validateFormData = () => {
    const errors: FormDataErrors = {};
    let isValid = true;

    if (!addChargeSuspectRadio.suspectId) {
      errors.addChargeSuspectRadio = {
        errorSummaryText: "Please select an option",
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

  const suspectItems = useMemo(() => {
    if (!state.formData.suspects) return [];
    return state.formData.suspects.map((suspect, index) => ({
      id: `suspect-radio-${index}`,
      children: suspect.suspectCompanyNameText
        ? suspect.suspectCompanyNameText
        : formatNameUtil(
            suspect.suspectFirstNameText,
            suspect.suspectLastNameText,
          ),
      value: `${index}`,
      "data-testid": `suspect-radio-${index}`,
    }));
  }, [state.formData.suspects]);

  const setFormValue = (value: string) => {
    setAddChargeSuspectRadio({
      suspectId: value,
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateFormData()) return;
    const { suspects } = state.formData;

    const charges =
      suspects[parseInt(addChargeSuspectRadio.suspectId)].charges || [];
    const chargeId =
      charges.length > 0 ? `charge-${charges.length}` : "charge-0";

    const nextRoute = `/case-registration/suspect-${addChargeSuspectRadio.suspectId}/${chargeId}/charges-offence-search`;
    return navigate(nextRoute);
  };

  return (
    <div>
      <BackLink to={"/case-registration/want-to-add-charges"}>Back</BackLink>
      {!!errorList.length && (
        <div
          ref={errorSummaryRef}
          tabIndex={-1}
          className={styles.errorSummaryWrapper}
        >
          <ErrorSummary
            data-testid={"add-charge-suspect-error-summary"}
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
                  <h1>Which suspect to do you want to add charges for?</h1>
                ),
              },
            }}
            errorMessage={
              formDataErrors["addChargeSuspectRadio"]
                ? {
                    children:
                      formDataErrors["addChargeSuspectRadio"].inputErrorText,
                  }
                : undefined
            }
            items={suspectItems}
            value={addChargeSuspectRadio.suspectId || ""}
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

export default AddChargeSuspectPage;

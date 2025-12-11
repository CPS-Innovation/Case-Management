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
import { getChargesSummaryList } from "../../../common/utils/getChargesSummaryList";
import ChargesSummary from "./ChargesSummary";
import styles from "../index.module.scss";

const SuspectSummaryPage = () => {
  type ErrorText = {
    errorSummaryText: string;
    inputErrorText?: string;
  };
  type FormDataErrors = {
    addMoreChargesRadio?: ErrorText;
  };
  const errorSummaryRef = useRef<HTMLInputElement>(null);
  const { state } = useContext(CaseRegistrationFormContext);
  const navigate = useNavigate();

  const [addMoreChargesRadio, setAddMoreChargesRadio] = useState<string>("");

  const [formDataErrors, setFormDataErrors] = useState<FormDataErrors>({});

  const errorSummaryProperties = useCallback(
    (errorKey: keyof FormDataErrors) => {
      if (errorKey === "addMoreChargesRadio") {
        return {
          children: formDataErrors[errorKey]?.errorSummaryText,
          href: "#add-more-charges-radio-yes",
          "data-testid": "add-more-charges-radio-yes",
        };
      }
      return null;
    },
    [formDataErrors],
  );

  const validateFormData = () => {
    const errors: FormDataErrors = {};
    let isValid = true;

    if (!addMoreChargesRadio) {
      errors.addMoreChargesRadio = {
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

  const { chargesCount } = useMemo(() => {
    const chargeList = getChargesSummaryList(state.formData.suspects);
    const chargesCount = chargeList.reduce(
      (acc, item) => acc + item.charges.length,
      0,
    );
    return { chargesCount };
  }, [state.formData.suspects]);

  useEffect(() => {
    if (errorList.length) errorSummaryRef.current?.focus();
  }, [errorList]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateFormData()) return;

    if (addMoreChargesRadio === "yes") {
      navigate(`/case-registration/add-charge-suspect`);
      return;
    }

    navigate("/case-registration/case-complexity");
  };

  return (
    <div>
      <BackLink to={`/case-registration/want-to-add-charges`}>Back</BackLink>
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
        <h1>{`You have added ${chargesCount} charges`}</h1>
        <ChargesSummary />

        <div className={styles.inputWrapper}>
          <Radios
            className="govuk-radios--inline"
            fieldset={{
              legend: {
                children: <h2>Do you need to add another charge? </h2>,
              },
            }}
            errorMessage={
              formDataErrors["addMoreChargesRadio"]
                ? {
                    children:
                      formDataErrors["addMoreChargesRadio"].errorSummaryText,
                  }
                : undefined
            }
            items={[
              {
                id: `add-more-charges-radio-yes`,
                children: "Yes",
                value: "yes",
                "data-testid": `add-more-charges-radio-yes`,
              },
              {
                id: `add-more-charges-radio-no`,
                children: "No",
                value: "no",
                "data-testid": `add-more-charges-radio-no`,
              },
            ]}
            value={addMoreChargesRadio}
            onChange={(value) => {
              if (value) setAddMoreChargesRadio(value);
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

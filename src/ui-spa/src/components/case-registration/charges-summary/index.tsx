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
import useChargesCount from "../../../common/hooks/useChargesCount";
import ChargesSummary from "./ChargesSummary";
import styles from "../index.module.scss";
import pageStyles from "./index.module.scss";

const SuspectSummaryPage = () => {
  type ErrorText = {
    errorSummaryText: string;
    inputErrorText?: string;
  };
  type FormDataErrors = {
    addMoreChargesRadio?: ErrorText;
  };
  const errorSummaryRef = useRef<HTMLInputElement>(null);
  const { state, dispatch } = useContext(CaseRegistrationFormContext);
  const navigate = useNavigate();
  const { chargesCount } = useChargesCount(state.formData.suspects);

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
  const previousRoute = useMemo(() => {
    if (
      state.formData.navigation.fromCaseSummaryPage &&
      !state.formData.navigation.fromChargeSummaryPage
    ) {
      return "/case-registration/case-summary";
    }

    return "/case-registration/suspect-summary";
  }, [
    state.formData.navigation.fromCaseSummaryPage,
    state.formData.navigation.fromChargeSummaryPage,
  ]);

  useEffect(() => {
    if (errorList.length) errorSummaryRef.current?.focus();
  }, [errorList]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateFormData()) return;

    if (addMoreChargesRadio === "yes") {
      dispatch({
        type: "SET_NAVIGATION_DATA",
        payload: { fromChargeSummaryPage: true },
      });
      navigate(`/case-registration/add-charge-suspect`);
      return;
    }
    if (state.formData.navigation.fromChargeSummaryPage) {
      dispatch({
        type: "SET_NAVIGATION_DATA",
        payload: { fromChargeSummaryPage: false },
      });
    }
    if (state.formData.navigation.fromCaseSummaryPage) {
      navigate("/case-registration/case-summary");
      return;
    }
    if (chargesCount) {
      navigate("/case-registration/first-hearing");
      return;
    }
    navigate("/case-registration/case-complexity");
  };

  const handleBackLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (previousRoute === "/case-registration/case-summary") {
      dispatch({
        type: "SET_NAVIGATION_DATA",
        payload: { fromCaseSummaryPage: false, fromChargeSummaryPage: false },
      });
      navigate(previousRoute);
      return;
    }

    navigate(previousRoute);
  };

  return (
    <div className={pageStyles.chargesSummaryPage}>
      <BackLink to={previousRoute} onClick={handleBackLinkClick}>
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
        <h1>{`You have added ${chargesCount} charges`}</h1>
        <div className={pageStyles.chargesSummaryWrapper}>
          <ChargesSummary />
        </div>

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

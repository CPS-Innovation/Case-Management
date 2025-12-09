import {
  useRef,
  useEffect,
  useState,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { Radios, Button, ErrorSummary, BackLink } from "../../govuk";
import DateInputNative from "../../common/DateInputNative";
import { CaseRegistrationFormContext } from "../../../common/providers/CaseRegistrationProvider";
import { type GeneralRadioValue } from "../../../common/reducers/caseRegistrationReducer";
import { formatNameUtil } from "../../../common/utils/formatNameUtil";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../index.module.scss";
import pageStyles from "./index.module.scss";

const AddChargeDetailsPage = () => {
  type ErrorText = {
    errorSummaryText: string;
    inputErrorText?: string;
    hasLink: boolean;
  };
  type FormDataErrors = {
    addVictimRadio?: ErrorText;
    offenceFromDate?: ErrorText;
    offenceToDate?: ErrorText;
  };
  const errorSummaryRef = useRef<HTMLInputElement>(null);
  const { state, dispatch } = useContext(CaseRegistrationFormContext);
  const navigate = useNavigate();
  const { suspectId, chargeId } = useParams<{
    suspectId: string;
    chargeId: string;
  }>() as {
    suspectId: string;
    chargeId: string;
  };

  const suspectIndex = useMemo(() => {
    const index = suspectId.replace("suspect-", "");
    return Number.parseInt(index, 10);
  }, [suspectId]);

  const chargeIndex = useMemo(() => {
    const index = chargeId.replace("charge-", "");
    return Number.parseInt(index, 10);
  }, [chargeId]);

  const suspectCharge = useMemo(() => {
    const {
      formData: { suspects },
    } = state;
    const charges = suspects[suspectIndex].charges || {};
    return charges[chargeIndex];
  }, [state, suspectIndex, chargeIndex]);

  const [formData, setFormData] = useState<{
    offenceFromDate: string;
    offenceToDate: string;
    addVictimRadio: GeneralRadioValue;
  }>({
    offenceFromDate: suspectCharge?.offenceFromDate || "",
    offenceToDate: suspectCharge?.offenceToDate || "",
    addVictimRadio: suspectCharge?.addVictimRadio || "",
  });

  const [showDateRange, setShowDateRange] = useState(
    suspectCharge?.offenceToDate ? true : false,
  );

  const suspectName = useMemo(() => {
    const {
      formData: { suspects },
    } = state;
    const {
      suspectFirstNameText,
      suspectLastNameText,
      suspectCompanyNameText,
    } = suspects[suspectIndex];
    return suspectCompanyNameText
      ? suspectCompanyNameText
      : formatNameUtil(suspectFirstNameText, suspectLastNameText);
  }, [state, suspectIndex]);

  const [formDataErrors, setFormDataErrors] = useState<FormDataErrors>({});

  const errorSummaryProperties = useCallback(
    (errorKey: keyof FormDataErrors) => {
      switch (errorKey) {
        case "addVictimRadio":
          return {
            children: formDataErrors[errorKey]?.errorSummaryText,
            href: "#first-hearing-radio-yes",
            "data-testid": "first-hearing-radio-link",
          };

        case "offenceFromDate":
          return {
            children: formDataErrors[errorKey]?.errorSummaryText,
            href: "#offence-from-date-text",
            "data-testid": "offence-from-date-text-link",
          };

        case "offenceToDate":
          return {
            children: formDataErrors[errorKey]?.errorSummaryText,
            href: "#offence-to-date-text",
            "data-testid": "offence-to-date-text-link",
          };

        default:
          return null;
      }
    },
    [formDataErrors],
  );

  const validateFormData = () => {
    const errors: FormDataErrors = {};
    const { addVictimRadio, offenceFromDate, offenceToDate } = formData;

    if (!addVictimRadio) {
      errors.addVictimRadio = {
        errorSummaryText: "Please select an option for first hearing",
        inputErrorText: "Please select an option",
        hasLink: true,
      };
    }

    if (!offenceFromDate) {
      errors.offenceFromDate = {
        errorSummaryText: "Select an offence from date",
        inputErrorText: "Select a date",
        hasLink: true,
      };
    }

    if (showDateRange && !offenceToDate) {
      errors.offenceToDate = {
        errorSummaryText: "Select an offence to date",
        inputErrorText: "Select a date",
        hasLink: true,
      };
    }

    if (addVictimRadio == "yes" && !offenceFromDate) {
      errors.offenceFromDate = {
        errorSummaryText: "Please select a date for first hearing",
        inputErrorText: "Please select a date",
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
    fieldName: "addVictimRadio" | "offenceFromDate" | "offenceToDate",
    value: string,
  ) => {
    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };

  const handleDateRangeButtonClick = () => {
    setShowDateRange(!showDateRange);
    if (showDateRange) {
      setFormData((prevState) => ({
        ...prevState,
        offenceToDate: "",
      }));
    }
  };

  const handleDateChange = (
    fieldName: "offenceFromDate" | "offenceToDate",
    value: string,
  ) => {
    setFormValue(fieldName, value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateFormData()) return;

    dispatch({
      type: "SET_CHARGE_FIELDS",
      payload: {
        suspectIndex: suspectIndex,
        chargeIndex: chargeIndex,
        data: formData,
      },
    });

    const { addVictimRadio } = formData;
    if (addVictimRadio === "yes")
      return navigate(
        `/case-registration/suspect-${suspectIndex}/charge-${chargeIndex}/add-charge-victim`,
      );

    return navigate("/case-registration/charges-summary");
  };

  return (
    <div className={styles.caseDetailsPage}>
      <BackLink
        to={`/case-registration/suspect-${suspectIndex}/charge-${chargeIndex}/charges-offence-search`}
      >
        Back
      </BackLink>
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

      <h1>Add charges</h1>
      <div>
        <div className={pageStyles.suspectName}>
          <b>{suspectName}</b>
        </div>
        <div>
          <b>
            {suspectCharge.selectedOffence?.code} -{" "}
            {suspectCharge.selectedOffence?.description}
          </b>
        </div>
      </div>
      <hr className={pageStyles.resultsDivider} />
      <form onSubmit={handleSubmit}>
        <div className={styles.inputWrapper}>
          <h2>When was the offence?</h2>
          <div className={pageStyles.dateInputsWrapper}>
            <DateInputNative
              key="offence-from-date-text"
              id="offence-from-date-text"
              className={pageStyles.dateInput}
              value={formData.offenceFromDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleDateChange("offenceFromDate", e.target.value)
              }
              errorMessage={
                formDataErrors["offenceFromDate"]
                  ? formDataErrors["offenceFromDate"].errorSummaryText
                  : undefined
              }
            />
            {showDateRange && (
              <DateInputNative
                key="offence-to-date-text"
                id="offence-to-date-text"
                className={pageStyles.dateInput}
                value={formData.offenceToDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleDateChange("offenceToDate", e.target.value)
                }
                errorMessage={
                  formDataErrors["offenceToDate"]
                    ? formDataErrors["offenceToDate"].errorSummaryText
                    : undefined
                }
              />
            )}
            <Button
              className="govuk-button--secondary"
              name="secondary"
              type="button"
              onClick={() => handleDateRangeButtonClick()}
            >
              {showDateRange ? "Single date" : "Date range"}
            </Button>
          </div>
          <Radios
            fieldset={{
              legend: {
                children: <h2>Is there a victim?</h2>,
              },
            }}
            errorMessage={
              formDataErrors["addVictimRadio"]
                ? {
                    children: formDataErrors["addVictimRadio"].errorSummaryText,
                  }
                : undefined
            }
            items={[
              {
                id: "add-victim-radio-yes",
                children: "Yes",
                value: "yes",
                "data-testid": "add-victim-radio-yes",
              },
              {
                id: "add-victim-radio-no",
                children: "No",
                value: "no",
                "data-testid": "add-victim-radio-no",
              },
            ]}
            value={formData.addVictimRadio || ""}
            onChange={(value) => {
              if (value) setFormValue("addVictimRadio", value);
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

export default AddChargeDetailsPage;

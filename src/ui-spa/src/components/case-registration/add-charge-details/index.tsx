import {
  useRef,
  useEffect,
  useState,
  useContext,
  useCallback,
  useMemo,
  use,
} from "react";
import {
  AutoComplete,
  Radios,
  Button,
  ErrorSummary,
  BackLink,
} from "../../govuk";
import DateInputNative from "../../common/DateInputNative";
import { CaseRegistrationFormContext } from "../../../common/providers/CaseRegistrationProvider";
import { type CaseRegistrationState } from "../../../common/reducers/caseRegistrationReducer";
import { getSelectedUnit } from "../../../common/utils/getSelectedUnit";
import { getCourtsByUnitId } from "../../../apis/gateway-api";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./index.module.scss";

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
  const { suspectId, chargeId, offenceCode } = useParams<{
    suspectId: string;
    chargeId: string;
    offenceCode: string;
  }>() as {
    suspectId: string;
    chargeId: string;
    offenceCode: string;
  };

  const suspectIndex = useMemo(() => {
    const index = suspectId.replace("suspect-", "");
    return Number.parseInt(index, 10);
  }, [suspectId]);

  const chargeIndex = useMemo(() => {
    const index = chargeId.replace("charge-", "");
    return Number.parseInt(index, 10);
  }, [chargeId]);

  const selectedOffenceCode = useMemo(() => {
    const index = offenceCode.replace("offence-", "");
    return Number.parseInt(index, 10);
  }, [offenceCode]);

  const suspectCharge = useMemo(() => {
    const {
      formData: { suspects },
    } = state;
    const charges = suspects[suspectIndex].charges || {};
    return charges[chargeIndex];
  }, [state, suspectIndex, chargeIndex]);

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
    const { addVictimRadio, offenceFromDate, offenceToDate } = suspectCharge;

    if (!addVictimRadio) {
      errors.addVictimRadio = {
        errorSummaryText: "Please select an option for first hearing",
        inputErrorText: "Please select an option",
        hasLink: true,
      };
    }

    if (!offenceFromDate) {
      errors.offenceFromDate = {
        errorSummaryText: "Please select an offence from date",
        inputErrorText: "Please select a date",
        hasLink: true,
      };
    }

    if (!offenceToDate) {
      errors.offenceToDate = {
        errorSummaryText: "Please select an offence to date",
        inputErrorText: "Please select a date",
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
  const selectedOffence = useMemo(() => {
    if (!state.apiData.offencesSearchResults) return;
    return state.apiData.offencesSearchResults.find(
      (offence) => offence.code === selectedOffenceCode.toString(),
    );
  }, [state.apiData.offencesSearchResults, selectedOffenceCode]);

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

  useEffect(() => {
    if (!suspectCharge.selectedOffence && selectedOffence) {
      dispatch({
        type: "SET_CHARGE_FIELD",
        payload: {
          suspectIndex: suspectIndex,
          chargeIndex: chargeIndex,
          field: "selectedOffence",
          value: selectedOffence,
        },
      });
    }
  }, [
    dispatch,
    suspectCharge.selectedOffence,
    selectedOffence,
    suspectIndex,
    chargeIndex,
  ]);

  const setFormValue = (
    fieldName: "addVictimRadio" | "offenceFromDate" | "offenceToDate",
    value: string,
  ) => {
    dispatch({
      type: "SET_CHARGE_FIELD",
      payload: {
        suspectIndex: suspectIndex,
        chargeIndex: chargeIndex,
        field: fieldName,
        value: value,
      },
    });
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

    const { addVictimRadio } = suspectCharge;
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

      <h1 className="govuk-heading-xl govuk-!-margin-bottom-0">Add charges</h1>
      <div>
        <b>
          {suspectCharge.selectedOffence?.code} -{" "}
          {suspectCharge.selectedOffence?.description}
        </b>
      </div>
      <form onSubmit={handleSubmit}>
        <div className={styles.inputWrapper}>
          <DateInputNative
            key="offence-from-date-text"
            id="offence-from-date-text"
            label={<h2>Date</h2>}
            value={suspectCharge.offenceFromDate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleDateChange("offenceFromDate", e.target.value)
            }
            errorMessage={
              formDataErrors["offenceFromDate"]
                ? formDataErrors["offenceFromDate"].errorSummaryText
                : undefined
            }
          />
          <DateInputNative
            key="offence-to-date-text"
            id="offence-to-date-text"
            label={<h2>Date</h2>}
            value={suspectCharge.offenceToDate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleDateChange("offenceToDate", e.target.value)
            }
            errorMessage={
              formDataErrors["offenceToDate"]
                ? formDataErrors["offenceToDate"].errorSummaryText
                : undefined
            }
          />

          <Radios
            fieldset={{
              legend: {
                children: <h1>Is there a victim?</h1>,
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
            value={suspectCharge.addVictimRadio || ""}
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

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
  Input,
  Checkboxes,
} from "../../govuk";
import { CaseRegistrationFormContext } from "../../../common/providers/CaseRegistrationProvider";
import { type VictimAdditionalDetailsValue } from "../../../common/reducers/caseRegistrationReducer";
import { formatNameUtil } from "../../../common/utils/formatNameUtil";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../index.module.scss";
import pageStyles from "./index.module.scss";

const AddChargeVictimPage = () => {
  type ErrorText = {
    errorSummaryText: string;
    inputErrorText?: string;
    hasLink: boolean;
  };
  type FormDataErrors = {
    selectedVictimRadio?: ErrorText;
    victimFirstNameText?: ErrorText;
    victimLastNameText?: ErrorText;
    victimAdditionalDetails?: ErrorText;
  };
  const errorSummaryRef = useRef<HTMLInputElement>(null);
  const { state, dispatch } = useContext(CaseRegistrationFormContext);
  const [victimDetails, setVictimDetails] = useState<{
    selectedVictimRadio: string;
    victimFirstNameText: string;
    victimLastNameText: string;
    victimAdditionalDetailsCheckboxes: VictimAdditionalDetailsValue[];
  }>({
    selectedVictimRadio: "",
    victimFirstNameText: "",
    victimLastNameText: "",
    victimAdditionalDetailsCheckboxes: [],
  });
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
        case "selectedVictimRadio":
          return {
            children: formDataErrors[errorKey]?.errorSummaryText,
            href: "#victim-radio-0",
            "data-testid": "victim-radio-link",
          };

        case "victimFirstNameText":
          return {
            children: formDataErrors[errorKey]?.errorSummaryText,
            href: "#victim-first-name",
            "data-testid": "victim-first-name-link",
          };

        case "victimLastNameText":
          return {
            children: formDataErrors[errorKey]?.errorSummaryText,
            href: "#victim-last-name",
            "data-testid": "victim-last-name-link",
          };

        default:
          return null;
      }
    },
    [formDataErrors],
  );

  const validateFormData = () => {
    const errors: FormDataErrors = {};
    const { selectedVictimRadio, victimFirstNameText, victimLastNameText } =
      victimDetails;
    const victimsList = state.formData.victimsList || [];
    if (victimsList.length > 0 && !selectedVictimRadio) {
      errors.selectedVictimRadio = {
        errorSummaryText: "Please select an option",
        inputErrorText: "Please select an option",
        hasLink: true,
      };
    }

    if (victimsList.length === 0 || selectedVictimRadio !== "add-new-victim") {
      if (!victimFirstNameText) {
        errors.victimFirstNameText = {
          errorSummaryText: "Please enter the victim's first name",
          inputErrorText: "Please enter a first name",
          hasLink: true,
        };
      }

      if (!victimLastNameText) {
        errors.victimLastNameText = {
          errorSummaryText: "Please enter the victim's last name",
          inputErrorText: "Please enter a last name",
          hasLink: true,
        };
      }
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

  const setAdditionalDetailsCheckboxes = useCallback(
    (value: VictimAdditionalDetailsValue) => {
      const currentValues =
        victimDetails.victimAdditionalDetailsCheckboxes ?? [];
      let newValues: VictimAdditionalDetailsValue[] = [];
      if (currentValues.includes(value)) {
        newValues = currentValues.filter((item) => item !== value);
      } else {
        newValues = [...currentValues, value];
      }
      setVictimDetails((prevState) => ({
        ...prevState,
        ["victimAdditionalDetailsCheckboxes"]: newValues,
      }));
    },
    [victimDetails],
  );

  const renderNewVictimFields = useCallback(() => {
    const victimType = [
      "Vulnerable",
      "Intimidated",
      "Witness",
    ] as VictimAdditionalDetailsValue[];
    return (
      <>
        <Input
          key="victim-firstname-text"
          id="victim-firstname-text"
          data-testid="victim-firstname-text"
          className="govuk-input--width-20"
          label={{
            children: <b>Victim first name (optional)</b>,
          }}
          type="text"
          value={victimDetails.victimFirstNameText}
          onChange={(value: string) => {
            setFormValue("victimFirstNameText", value);
          }}
        />

        <Input
          key="case-investigator-lastname-text"
          id="case-investigator-lastname-text"
          data-testid="case-investigator-lastname-text"
          className="govuk-input--width-20"
          label={{
            children: <b>Victim last name</b>,
          }}
          errorMessage={
            formDataErrors["victimLastNameText"]
              ? {
                  children:
                    formDataErrors["victimLastNameText"].errorSummaryText,
                }
              : undefined
          }
          type="text"
          value={victimDetails.victimLastNameText}
          onChange={(value: string) => {
            setFormValue("victimLastNameText", value);
          }}
        />
        <Checkboxes
          fieldset={{
            legend: {
              children: <h2>Victim type (optional)</h2>,
            },
          }}
          items={victimType.map((victimType, index) => ({
            id: `case-victim-type-${index}`,
            children: victimType,
            value: victimType,
            "data-testid": `case-victim-type-${index}`,
            checked:
              victimDetails.victimAdditionalDetailsCheckboxes?.includes(
                victimType,
              ),
          }))}
          onChange={(event) => {
            const { value } = event.target;
            if (value)
              setAdditionalDetailsCheckboxes(
                value as VictimAdditionalDetailsValue,
              );
          }}
        />
      </>
    );
  }, [victimDetails, formDataErrors, setAdditionalDetailsCheckboxes]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateFormData()) return;

    dispatch({
      type: "SET_CHARGE_FIELD",
      payload: {
        suspectIndex: suspectIndex,
        chargeIndex: chargeIndex,
        field: "victims",
        value: {
          victimFirstNameText: victimDetails.victimFirstNameText,
          victimLastNameText: victimDetails.victimLastNameText,
          victimAdditionalDetailsCheckboxes:
            victimDetails.victimAdditionalDetailsCheckboxes,
        },
      },
    });

    return navigate("/case-registration/charges-summary");
  };

  const availableVictimItems = useMemo(() => {
    const availableVictims = state.formData.victimsList.map((victim, index) => {
      return {
        id: `add-victim-radio-${index}`,
        children: formatNameUtil(
          victim.victimFirstNameText,
          victim.victimLastNameText,
        ),
        value: formatNameUtil(
          victim.victimFirstNameText,
          victim.victimLastNameText,
        ),
        "data-testid": `add-victim-radio-${index}`,
      };
    });
    return [
      ...availableVictims,
      {
        id: `add-victim-radio-add-new-victim`,
        children: "Add new victim",
        value: "new-victim",
        "data-testid": `add-victim-radio-add-new-victim`,
        conditional: {
          children: [renderNewVictimFields()],
        },
      },
    ];
  }, [state.formData.victimsList, renderNewVictimFields]);

  const setFormValue = (
    fieldName:
      | "selectedVictimRadio"
      | "victimFirstNameText"
      | "victimLastNameText",
    value: string,
  ) => {
    setVictimDetails((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
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

      <h1>Add a victim to this charge</h1>
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
          {state.formData.victimsList.length !== 0 && (
            <Radios
              fieldset={{
                legend: {
                  children: <h2>Select or add a victim</h2>,
                },
              }}
              errorMessage={
                formDataErrors["selectedVictimRadio"]
                  ? {
                      children:
                        formDataErrors["selectedVictimRadio"].errorSummaryText,
                    }
                  : undefined
              }
              items={availableVictimItems}
              value={victimDetails.selectedVictimRadio || ""}
              onChange={(value) => {
                if (value) setFormValue("selectedVictimRadio", value);
              }}
            ></Radios>
          )}

          <>
            {state.formData.victimsList.length === 0 && renderNewVictimFields()}
          </>
        </div>
        <Button type="submit" onClick={() => handleSubmit}>
          Save and Continue
        </Button>
      </form>
    </div>
  );
};

export default AddChargeVictimPage;

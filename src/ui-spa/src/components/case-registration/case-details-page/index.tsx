import {
  useContext,
  useMemo,
  useRef,
  useCallback,
  useState,
  useEffect,
} from "react";
import {
  AutoComplete,
  BackLink,
  Button,
  ErrorSummary,
  Input,
} from "../../govuk";
import { type CaseRegistrationState } from "../../../common/reducers/caseRegistrationReducer";
import { CaseRegistrationFormContext } from "../../../common/providers/CaseRegistrationProvider";
import { getRegisteringUnits } from "../../../common/utils/getRegisteringUnits";
import { getWitnessCareUnits } from "../../../common/utils/getWitnessCareUnits";
import { useISAreaSensitive } from "../../../common/hooks/useIsAreaSensitive";
import { useQuery } from "@tanstack/react-query";
import { validateUrn } from "../../../apis/gateway-api";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";

const CaseDetailsPage = () => {
  type ErrorText = {
    errorSummaryText: string;
    inputErrorText?: string;
    hasLink: boolean;
    errorIds?: string[];
  };
  type FormDataErrors = {
    urnErrorText?: ErrorText;
    registeringUnitErrorText?: ErrorText;
    witnessCareUnitErrorText?: ErrorText;
  };

  const errorSummaryRef = useRef<HTMLInputElement>(null);
  const { state, dispatch } = useContext(CaseRegistrationFormContext);
  const navigate = useNavigate();
  const isAreaSensitive = useISAreaSensitive();

  const [formDataErrors, setFormDataErrors] = useState<FormDataErrors>({});

  const { refetch: refetchValidationUrn } = useQuery({
    queryKey: ["validate-urn"],
    queryFn: () =>
      validateUrn(
        `${state.formData.urnPoliceForceText}${state.formData.urnPoliceUnitText}${state.formData.urnUniqueReferenceText}${state.formData.urnYearReferenceText}`,
      ),
    enabled: false,
  });
  const errorSummaryProperties = useCallback(
    (errorKey: keyof FormDataErrors) => {
      switch (errorKey) {
        case "urnErrorText":
          return {
            children: formDataErrors[errorKey]?.errorSummaryText,
            href: `#${formDataErrors[errorKey]?.errorIds?.[0]}`,
            "data-testid": "urn-error-text-link",
          };
        case "registeringUnitErrorText":
          return {
            children: formDataErrors[errorKey]?.errorSummaryText,
            href: "#registering-unit-text",
            "data-testid": "registering-unit-error-text-link",
          };
        case "witnessCareUnitErrorText":
          return {
            children: formDataErrors[errorKey]?.errorSummaryText,
            href: "#witness-care-unit-text",
            "data-testid": "witness-care-unit-error-text-link",
          };
        default:
          return null;
      }
    },
    [formDataErrors],
  );
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

  const registeringUnits = useMemo(() => {
    if (state.apiData.areasAndRegisteringUnits) {
      return getRegisteringUnits(
        state.apiData.areasAndRegisteringUnits,
        state.formData.areaOrDivisionText,
      );
    }
    return [] as { unitId: number; unitDescription: string }[];
  }, [
    state.apiData.areasAndRegisteringUnits,
    state.formData.areaOrDivisionText,
  ]);

  const witnessCareUnits = useMemo(() => {
    if (state.apiData.areasAndWitnessCareUnits) {
      return getWitnessCareUnits(
        state.apiData.areasAndWitnessCareUnits,
        state.formData.areaOrDivisionText,
      );
    }
    return [] as { unitId: number; unitDescription: string }[];
  }, [
    state.apiData.areasAndWitnessCareUnits,
    state.formData.areaOrDivisionText,
  ]);
  const registeringUnitSuggest = (
    query: string,
    populateResults: (results: string[]) => void,
  ) => {
    const filteredResults = registeringUnits
      .filter((result) =>
        result.unitDescription.toLowerCase().includes(query.toLowerCase()),
      )
      .map((r) => r.unitDescription);
    populateResults(filteredResults);
  };

  const witnessCareUnitSuggest = (
    query: string,
    populateResults: (results: string[]) => void,
  ) => {
    const filteredResults = witnessCareUnits
      .filter((result) =>
        result.unitDescription.toLowerCase().includes(query.toLowerCase()),
      )
      .map((r) => r.unitDescription);
    populateResults(filteredResults);
  };

  const handleWitnessCareUnitConfirm = (value: string) => {
    console.log("Selected witness care unit:", value);
    dispatch({
      type: "SET_FIELD",
      payload: { field: "witnessCareUnitText", value: value },
    });
  };

  const handleRegisteringUnitConfirm = (value: string) => {
    console.log("Selected registering unit:", value);
    dispatch({
      type: "SET_FIELD",
      payload: { field: "registeringUnitText", value: value },
    });
  };

  const handleUrnValueChange = (
    field:
      | "urnPoliceForceText"
      | "urnPoliceUnitText"
      | "urnUniqueReferenceText"
      | "urnYearReferenceText",
    value: string,
  ) => {
    let newValue = value.replace(/[^0-9a-zA-Z]/g, "");
    if (field !== "urnPoliceUnitText") newValue = newValue.replace(/\D/g, "");
    dispatch({
      type: "SET_FIELD",
      payload: { field, value: newValue },
    });
  };

  const validateFormData = (
    state: CaseRegistrationState,
    registeringUnitInputValue: string,
    witnessCareUnitInputValue: string,
  ) => {
    const errors: FormDataErrors = {};
    const {
      formData: {
        urnPoliceForceText,
        urnPoliceUnitText,
        urnUniqueReferenceText,
        urnYearReferenceText,
      },
    } = state;

    if (!urnPoliceForceText) {
      errors.urnErrorText = {
        errorSummaryText: "All URN fields should be completed",
        hasLink: true,
        errorIds: [
          ...(errors.urnErrorText?.errorIds || []),
          "urn-police-force-text",
        ],
      };
    }
    if (!urnPoliceUnitText) {
      errors.urnErrorText = {
        errorSummaryText: "All URN fields should be completed",
        hasLink: true,
        errorIds: [
          ...(errors.urnErrorText?.errorIds || []),
          "urn-police-unit-text",
        ],
      };
    }
    if (!urnUniqueReferenceText) {
      errors.urnErrorText = {
        errorSummaryText: "All URN fields should be completed",
        hasLink: true,
        errorIds: [
          ...(errors.urnErrorText?.errorIds || []),
          "urn-unique-reference-text",
        ],
      };
    }
    if (!urnYearReferenceText) {
      errors.urnErrorText = {
        errorSummaryText: "All URN fields should be completed",
        hasLink: true,
        errorIds: [
          ...(errors.urnErrorText?.errorIds || []),
          "urn-year-reference-text",
        ],
      };
    }
    if (!isAreaSensitive) {
      if (!registeringUnitInputValue) {
        errors.registeringUnitErrorText = {
          errorSummaryText: "Registering unit should not be empty",
          hasLink: true,
        };
      } else if (
        registeringUnits.findIndex(
          (ru) => ru.unitDescription === registeringUnitInputValue,
        ) === -1
      ) {
        errors.registeringUnitErrorText = {
          errorSummaryText: "Registering unit is invalid",
          hasLink: true,
        };
      }
    }
    if (
      witnessCareUnitInputValue &&
      witnessCareUnits.findIndex(
        (wcu) => wcu.unitDescription === witnessCareUnitInputValue,
      ) === -1
    ) {
      errors.witnessCareUnitErrorText = {
        errorSummaryText: "Witness care unit is invalid",
        hasLink: true,
      };
    }

    const isValid = !Object.entries(errors).filter(([, value]) => value).length;

    setFormDataErrors(errors);
    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const registeringUnitInput = document.getElementById(
      "registering-unit-text",
    ) as HTMLInputElement | null;
    const registeringUnitInputValue = registeringUnitInput?.value ?? "";
    if (state.formData.registeringUnitText !== registeringUnitInputValue)
      dispatch({
        type: "SET_FIELD",
        payload: {
          field: "registeringUnitText",
          value: registeringUnitInputValue,
        },
      });
    const witnessCareUnitInput = document.getElementById(
      "witness-care-unit-text",
    ) as HTMLInputElement;

    const witnessCareUnitInputValue = witnessCareUnitInput?.value ?? "";
    if (state.formData.witnessCareUnitText !== witnessCareUnitInputValue)
      dispatch({
        type: "SET_FIELD",
        payload: {
          field: "witnessCareUnitText",
          value: witnessCareUnitInputValue,
        },
      });

    if (
      !validateFormData(
        state,
        registeringUnitInputValue,
        witnessCareUnitInputValue,
      )
    )
      return;
    const { data } = await refetchValidationUrn();
    if (data?.exists) {
      setFormDataErrors((prev) => ({
        ...prev,
        urnErrorText: {
          errorSummaryText:
            "URN already exists, please change reference text and try again",
          hasLink: true,
          errorIds: ["urn-unique-reference-text"],
        },
      }));
    }
    return navigate("/case-registration/case-details");
  };

  return (
    <div className={styles.caseDetailsPage}>
      <BackLink
        to={`${isAreaSensitive ? "/case-registration" : "/case-registration/areas"}`}
        replace
        state={{ isRouteValid: true }}
      >
        Back
      </BackLink>
      <h1>Case Details</h1>
      {!!errorList.length && (
        <div
          ref={errorSummaryRef}
          tabIndex={-1}
          className={styles.errorSummaryWrapper}
        >
          <ErrorSummary
            data-testid={"case-details-error-summary"}
            errorList={errorList}
            titleChildren="There is a problem"
          />
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <fieldset
          className={`govuk-fieldset  govuk-form-group ${formDataErrors.urnErrorText?.errorSummaryText ? "govuk-form-group--error" : ""}`}
        >
          <legend className="govuk-fieldset__legend ">
            <h2>What is the URN?</h2>
          </legend>
          {formDataErrors.urnErrorText?.errorSummaryText && (
            <p className="govuk-error-message">
              <span className="govuk-visually-hidden">Error:</span>{" "}
              {formDataErrors.urnErrorText?.errorSummaryText}
            </p>
          )}
          <div className={styles.urnInputsWrapper}>
            <Input
              id="urn-police-force-text"
              maxLength={2}
              className={`govuk-input--width-2 ${formDataErrors.urnErrorText?.errorIds?.includes("urn-police-force-text") ? "govuk-input--error" : ""}`}
              data-testid="urn-police-force-text"
              label={{ children: "Police force" }}
              name="urn-part-1"
              value={state.formData.urnPoliceForceText}
              onChange={(val: string) =>
                handleUrnValueChange("urnPoliceForceText", val)
              }
            />
            <Input
              id="urn-police-unit-text"
              maxLength={2}
              className={`govuk-input--width-2 ${formDataErrors.urnErrorText?.errorIds?.includes("urn-police-unit-text") ? "govuk-input--error" : ""}`}
              data-testid="urn-police-unit-text"
              label={{ children: "Police Unit" }}
              name="urn-part-2"
              value={state.formData.urnPoliceUnitText}
              onChange={(val: string) =>
                handleUrnValueChange("urnPoliceUnitText", val)
              }
            />
            <Input
              id="urn-unique-reference-text"
              maxLength={5}
              className={`govuk-input--width-5 ${formDataErrors.urnErrorText?.errorIds?.includes("urn-unique-reference-text") ? "govuk-input--error" : ""}`}
              data-testid="urn-unique-reference-text"
              label={{ children: "Unique Reference" }}
              name="urn-part-3"
              value={state.formData.urnUniqueReferenceText}
              onChange={(val: string) =>
                handleUrnValueChange("urnUniqueReferenceText", val)
              }
            />
            <Input
              id="urn-year-reference-text"
              maxLength={2}
              className={`govuk-input--width-2 ${formDataErrors.urnErrorText?.errorIds?.includes("urn-year-reference-text") ? "govuk-input--error" : ""}`}
              data-testid="urn-year-reference-text"
              label={{ children: "Year Reference" }}
              name="urn-part-4"
              value={state.formData.urnYearReferenceText}
              onChange={(val: string) =>
                handleUrnValueChange("urnYearReferenceText", val)
              }
            />
          </div>
        </fieldset>

        {!isAreaSensitive && (
          <AutoComplete
            id="registering-unit-text"
            inputClasses={"govuk-input--error"}
            source={registeringUnitSuggest}
            confirmOnBlur={false}
            onConfirm={handleRegisteringUnitConfirm}
            defaultValue={state.formData.registeringUnitText}
            label={{ children: <h2>What is the registering unit?</h2> }}
            errorMessage={
              formDataErrors["registeringUnitErrorText"]
                ? formDataErrors["registeringUnitErrorText"].errorSummaryText
                : undefined
            }
          />
        )}

        <AutoComplete
          id="witness-care-unit-text"
          inputClasses={"govuk-input--error"}
          source={witnessCareUnitSuggest}
          confirmOnBlur={false}
          onConfirm={handleWitnessCareUnitConfirm}
          defaultValue={state.formData.witnessCareUnitText}
          label={{ children: <h2>What is the witness care unit (WCU)?</h2> }}
          errorMessage={
            formDataErrors["witnessCareUnitErrorText"]
              ? formDataErrors["witnessCareUnitErrorText"].errorSummaryText
              : undefined
          }
        />

        <Button type="submit" onClick={() => handleSubmit}>
          Save and Continue
        </Button>
      </form>
    </div>
  );
};

export default CaseDetailsPage;

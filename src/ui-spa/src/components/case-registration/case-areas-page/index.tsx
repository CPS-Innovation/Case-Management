import {
  useContext,
  useMemo,
  useRef,
  useCallback,
  useState,
  useEffect,
} from "react";
import { AutoComplete, BackLink, Button, ErrorSummary } from "../../govuk";
import { CaseRegistrationFormContext } from "../../../common/providers/CaseRegistrationProvider";
import { getAreasOrDivisions } from "../../../common/utils/getAreasOrDivisions";
import { getSelectedUnit } from "../../../common/utils/getSelectedUnit";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";

const CaseAreasPage = () => {
  type ErrorText = {
    errorSummaryText: string;
    inputErrorText?: string;
    hasLink: boolean;
  };
  type FormDataErrors = {
    areaOrDivisionText?: ErrorText;
  };
  const errorSummaryRef = useRef<HTMLInputElement>(null);
  const { state, dispatch } = useContext(CaseRegistrationFormContext);
  const navigate = useNavigate();

  const [formDataErrors, setFormDataErrors] = useState<FormDataErrors>({});

  const errorSummaryProperties = useCallback(
    (errorKey: keyof FormDataErrors) => {
      if (errorKey === "areaOrDivisionText") {
        return {
          children: formDataErrors[errorKey]?.errorSummaryText,
          href: "#area-or-division-text",
          "data-testid": "area-or-division-text-link",
        };
      }
      return null;
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

  const areas = useMemo(() => {
    if (state.apiData.areasAndRegisteringUnits) {
      return getAreasOrDivisions(state.apiData.areasAndRegisteringUnits);
    }
    return [];
  }, [state.apiData.areasAndRegisteringUnits]);

  useEffect(() => {
    if (errorList.length) errorSummaryRef.current?.focus();
  }, [errorList]);

  const validateFormData = (
    areas: {
      id: number;
      description: string;
    }[],
    inputAreaValue: string,
  ) => {
    const errors: FormDataErrors = {};

    if (!inputAreaValue) {
      errors.areaOrDivisionText = {
        errorSummaryText: "Case area should not be empty",
        hasLink: true,
      };
    } else if (
      areas.findIndex((area) => area.description === inputAreaValue) === -1
    ) {
      errors.areaOrDivisionText = {
        errorSummaryText: "Case area is invalid",
        hasLink: true,
      };
    }

    const isValid = !Object.entries(errors).filter(([, value]) => value).length;

    setFormDataErrors(errors);
    return isValid;
  };

  const areaSuggests = (
    query: string,
    populateResults: (results: string[]) => void,
  ) => {
    const results = areas || [];
    const filteredResults = results
      .filter((result) =>
        result.description.toLowerCase().includes(query.toLowerCase()),
      )
      .map((r) => r.description);
    populateResults(filteredResults);
  };

  const handleAreaConfirm = (value: string) => {
    const { id, description } = getSelectedUnit(areas, value);
    dispatch({
      type: "SET_FIELD",
      payload: {
        field: "areaOrDivisionText",
        value: { id, description },
      },
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const input = document.getElementById(
      "area-or-division-text",
    ) as HTMLInputElement | null;
    const inputValue = input?.value ?? "";
    if (inputValue !== state.formData.areaOrDivisionText.description) {
      const { id, description } = getSelectedUnit(areas, inputValue);
      dispatch({
        type: "SET_FIELD",
        payload: {
          field: "areaOrDivisionText",
          value: { id, description },
        },
      });
    }

    if (!validateFormData(areas, inputValue)) return;
    return navigate("/case-registration/case-details");
  };
  return (
    <div className={styles.caseAreasPage}>
      <BackLink
        to={"/case-registration"}
        replace
        state={{ isRouteValid: true }}
      >
        Back
      </BackLink>
      <h1>What is the division or area?</h1>
      {!!errorList.length && (
        <div
          ref={errorSummaryRef}
          tabIndex={-1}
          className={styles.errorSummaryWrapper}
        >
          <ErrorSummary
            data-testid={"case-area-error-summary"}
            errorList={errorList}
            titleChildren="There is a problem"
          />
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <AutoComplete
          id="area-or-division-text"
          inputClasses={"govuk-input--error"}
          source={areaSuggests}
          confirmOnBlur={false}
          onConfirm={handleAreaConfirm}
          defaultValue={state.formData.areaOrDivisionText.description}
          errorMessage={
            formDataErrors["areaOrDivisionText"]
              ? formDataErrors["areaOrDivisionText"].errorSummaryText
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

export default CaseAreasPage;

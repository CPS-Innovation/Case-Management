import {
  useRef,
  useEffect,
  useState,
  useContext,
  useCallback,
  useMemo,
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
import { getCourtsByUnitId } from "../../../apis/gateway-api";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";

const FirstHearingPage = () => {
  type ErrorText = {
    errorSummaryText: string;
    inputErrorText?: string;
    hasLink: boolean;
  };
  type FormDataErrors = {
    firstHearingRadio?: ErrorText;
    firstHearingCourtLocationText?: ErrorText;
    firstHearingDateText?: ErrorText;
  };
  const errorSummaryRef = useRef<HTMLInputElement>(null);
  const { state, dispatch } = useContext(CaseRegistrationFormContext);
  const navigate = useNavigate();

  const registeringUnitId = useMemo(() => {
    return state.formData.registeringUnitText?.id;
  }, [state.formData.registeringUnitText]);

  const { data: courtLocationsData, isLoading: isCourtLocationsLoading } =
    useQuery({
      queryKey: ["court-locations", registeringUnitId],
      enabled: !!registeringUnitId,
      queryFn: () => getCourtsByUnitId(registeringUnitId!),
    });

  const [formDataErrors, setFormDataErrors] = useState<FormDataErrors>({});

  const errorSummaryProperties = useCallback(
    (errorKey: keyof FormDataErrors) => {
      switch (errorKey) {
        case "firstHearingRadio":
          return {
            children: formDataErrors[errorKey]?.errorSummaryText,
            href: "#first-hearing-radio-yes",
            "data-testid": "first-hearing-radio-link",
          };
        case "firstHearingCourtLocationText":
          return {
            children: formDataErrors[errorKey]?.errorSummaryText,
            href: "#first-hearing-court-location-text",
            "data-testid": "first-hearing-court-location-text-link",
          };
        case "firstHearingDateText":
          return {
            children: formDataErrors[errorKey]?.errorSummaryText,
            href: "#first-hearing-date-text",
            "data-testid": "first-hearing-date-text-link",
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
      formData: {
        firstHearingRadio,
        firstHearingCourtLocationText,
        firstHearingDateText,
      },
    } = state;
    if (!firstHearingRadio) {
      errors.firstHearingRadio = {
        errorSummaryText: "Please select an option for first hearing",
        inputErrorText: "Please select an option",
        hasLink: true,
      };
    }
    if (firstHearingRadio == "yes" && !firstHearingCourtLocationText) {
      errors.firstHearingCourtLocationText = {
        errorSummaryText: "Please select a court location for first hearing",
        inputErrorText: "Please select a court location",
        hasLink: true,
      };
    }
    if (firstHearingRadio == "yes" && !firstHearingDateText) {
      errors.firstHearingDateText = {
        errorSummaryText: "Please select a date for first hearing",
        inputErrorText: "Please select a date",
        hasLink: true,
      };
    }

    const isValid = !Object.entries(errors).filter(([, value]) => value).length;

    setFormDataErrors(errors);
    return isValid;
  };
  const courtLocations = useMemo(() => {
    if (state.apiData.courtLocations) {
      return state.apiData.courtLocations;
    }
    return [] as { id: number; description: string }[];
  }, [state.apiData.courtLocations]);

  const courtLocationsSuggest = (
    query: string,
    populateResults: (results: string[]) => void,
  ) => {
    const filteredResults = courtLocations
      .filter((result) =>
        result.description.toLowerCase().includes(query.toLowerCase()),
      )
      .map((r) => r.description);
    populateResults(filteredResults);
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

  useEffect(() => {
    if (!isCourtLocationsLoading && courtLocationsData) {
      dispatch({
        type: "SET_COURT_LOCATIONS",
        payload: {
          courtLocations: courtLocationsData,
        },
      });
    }
  }, [courtLocationsData, dispatch, isCourtLocationsLoading]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateFormData(state)) return;

    return navigate("/case-registration/case-details");
  };

  const setFormValue = (
    fieldName:
      | "firstHearingRadio"
      | "firstHearingCourtLocationText"
      | "firstHearingDateText",
    value: string,
  ) => {
    dispatch({
      type: "SET_FIELD",
      payload: { field: fieldName, value: value },
    });
  };

  return (
    <div>
      <BackLink
        to="/case-registration/case-details"
        replace
        state={{ isRouteValid: true }}
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
      <form onSubmit={handleSubmit}>
        <div className={styles.inputWrapper}>
          <Radios
            fieldset={{
              legend: {
                children: <h1>Do you have details of the first hearing?</h1>,
              },
            }}
            errorMessage={
              formDataErrors["firstHearingRadio"]
                ? {
                    children:
                      formDataErrors["firstHearingRadio"].errorSummaryText,
                  }
                : undefined
            }
            name="Do you have details of the first hearing?"
            items={[
              {
                id: "first-hearing-radio-yes",
                children: "Yes",
                value: "yes",
                "data-testid": "first-hearing-radio-yes",
                conditional: {
                  children: [
                    <AutoComplete
                      key="first-hearing-court-location-text"
                      id="first-hearing-court-location-text"
                      inputClasses={"govuk-input--error"}
                      source={courtLocationsSuggest}
                      confirmOnBlur={false}
                      onConfirm={(value) =>
                        setFormValue("firstHearingCourtLocationText", value)
                      }
                      defaultValue={
                        state.formData.firstHearingCourtLocationText
                      }
                      label={{
                        children: (
                          <h2>What is the first hearing court location?</h2>
                        ),
                      }}
                      errorMessage={
                        formDataErrors["firstHearingCourtLocationText"]
                          ? formDataErrors["firstHearingCourtLocationText"]
                              .errorSummaryText
                          : undefined
                      }
                    />,
                    <DateInputNative
                      key="first-hearing-date"
                      id="first-hearing-date"
                      label={<h2>Date</h2>}
                    />,
                  ],
                },
              },
              {
                children: "No",
                value: "no",
                "data-testid": "radio-operation-name-no",
              },
            ]}
            value={state.formData.firstHearingRadio}
            onChange={(value) => {
              if (value) setFormValue("firstHearingRadio", value);
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

export default FirstHearingPage;

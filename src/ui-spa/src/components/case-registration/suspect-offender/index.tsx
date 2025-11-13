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
import { type CaseRegistrationState } from "../../../common/reducers/caseRegistrationReducer";
import { getOffenderTypes } from "../../../apis/gateway-api";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import {
  getNextSuspectJourneyRoute,
  getPreviousSuspectJourneyRoute,
} from "../../../common/utils/getSuspectJourneyRoutes";
import styles from "../index.module.scss";

const SuspectOffenderPage = () => {
  type ErrorText = {
    errorSummaryText: string;
    inputErrorText?: string;
  };
  type FormDataErrors = {
    suspectOffenderTypesRadio?: ErrorText;
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

  const {
    data: offenderData,
    isLoading: isOffendersLoading,
    error: offenderError,
  } = useQuery({
    queryKey: ["offenders"],
    queryFn: () => getOffenderTypes(),
    enabled: !state.apiData.suspectOffenderTypes,
    retry: false,
  });

  useEffect(() => {
    if (offenderError) throw offenderError;
  }, [offenderError]);
  const previousRoute = useMemo(() => {
    return getPreviousSuspectJourneyRoute(
      "suspect-offender",
      state.formData.suspects[suspectIndex].suspectAdditionalDetailsCheckboxes,
      suspectIndex,
    );
  }, [state.formData.suspects, suspectIndex]);

  const [formDataErrors, setFormDataErrors] = useState<FormDataErrors>({});

  const errorSummaryProperties = useCallback(
    (errorKey: keyof FormDataErrors) => {
      if (errorKey === "suspectOffenderTypesRadio") {
        return {
          children: formDataErrors[errorKey]?.errorSummaryText,
          href: "#suspect-offender-radio-0",
          "data-testid": "suspect-offender-radio-link",
        };
      }

      return null;
    },
    [formDataErrors],
  );

  const validateFormData = (state: CaseRegistrationState) => {
    const errors: FormDataErrors = {};
    const {
      formData: { suspects },
    } = state;
    const { suspectOffenderTypesRadio = { shortCode: null, display: "" } } =
      suspects[suspectIndex] || {};

    if (!suspectOffenderTypesRadio.shortCode) {
      errors.suspectOffenderTypesRadio = {
        errorSummaryText: "Please select an option",
        inputErrorText: "Please select an option",
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

  useEffect(() => {
    if (!isOffendersLoading && offenderData) {
      dispatch({
        type: "SET_CASE_SUSPECT_OFFENDER_TYPES",
        payload: {
          suspectOffenderTypes: offenderData,
        },
      });
    }
  }, [offenderData, dispatch, isOffendersLoading]);

  const offenderItems = useMemo(() => {
    if (!state.apiData.suspectOffenderTypes) return [];
    return state.apiData.suspectOffenderTypes
      .filter((offender) => offender.description != "Unspecified")
      .map((offender, index) => ({
        id: `suspect-offender-radio-${index}`,
        children: offender.display,
        value: offender.shortCode,
        "data-testid": `suspect-offender-radio-${index}`,
      }));
  }, [state.apiData.suspectOffenderTypes]);

  const setFormValue = (value: string) => {
    const selectedOffender = state.apiData.suspectOffenderTypes?.find(
      (offender) => offender.shortCode === value,
    );
    if (selectedOffender) {
      dispatch({
        type: "SET_SUSPECT_FIELD",
        payload: {
          index: suspectIndex,
          field: "suspectOffenderTypesRadio",
          value: {
            shortCode: selectedOffender.shortCode,
            display: selectedOffender.display,
          },
        },
      });
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateFormData(state)) return;

    const nextRoute = getNextSuspectJourneyRoute(
      "suspect-offender",
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
    suspectOffenderTypesRadio = { shortCode: null, display: "" },
    suspectFirstNameText = "",
    suspectLastNameText = "",
  } = suspects[suspectIndex] || {};

  return (
    <div>
      <BackLink to={previousRoute}>Back</BackLink>
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
                children: (
                  <h1>
                    What type of offender is {suspectLastNameText}{" "}
                    {suspectFirstNameText}?
                  </h1>
                ),
              },
            }}
            errorMessage={
              formDataErrors["suspectOffenderTypesRadio"]
                ? {
                    children:
                      formDataErrors["suspectOffenderTypesRadio"]
                        .inputErrorText,
                  }
                : undefined
            }
            items={offenderItems}
            value={suspectOffenderTypesRadio.shortCode ?? ""}
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

export default SuspectOffenderPage;

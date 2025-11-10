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
import { getGenders } from "../../../apis/gateway-api";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import {
  getNextSuspectJourneyRoute,
  getPreviousSuspectJourneyRoute,
} from "../../../common/utils/getSuspectJourneyRoutes";
import styles from "./index.module.scss";

const SuspectGenderPage = () => {
  type ErrorText = {
    errorSummaryText: string;
    inputErrorText?: string;
  };
  type FormDataErrors = {
    suspectGenderRadio?: ErrorText;
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
    data: gendersData,
    isLoading: isGendersLoading,
    error: gendersError,
  } = useQuery({
    queryKey: ["genders"],
    enabled: true,
    queryFn: () => getGenders(),
    retry: false,
  });

  useEffect(() => {
    if (gendersError) throw gendersError;
  }, [gendersError]);

  const previousRoute = useMemo(() => {
    return getPreviousSuspectJourneyRoute(
      "suspect-gender",
      state.formData.suspects[suspectIndex].suspectAdditionalDetailsCheckboxes,
      suspectIndex,
    );
  }, [state.formData.suspects, suspectIndex]);

  const [formDataErrors, setFormDataErrors] = useState<FormDataErrors>({});

  const errorSummaryProperties = useCallback(
    (errorKey: keyof FormDataErrors) => {
      if (errorKey === "suspectGenderRadio") {
        return {
          children: formDataErrors[errorKey]?.errorSummaryText,
          href: "#suspect-gender-radio-0",
          "data-testid": "suspect-gender-radio-link",
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
    const { suspectGenderRadio = { shortCode: null, description: "" } } =
      suspects[suspectIndex] || {};

    if (!suspectGenderRadio.shortCode) {
      errors.suspectGenderRadio = {
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
    if (!isGendersLoading && gendersData) {
      dispatch({
        type: "SET_CASE_SUSPECT_GENDERS",
        payload: {
          suspectGenders: gendersData,
        },
      });
    }
  }, [gendersData, dispatch, isGendersLoading]);

  const genderItems = useMemo(() => {
    if (!state.apiData.suspectGenders) return [];
    return state.apiData.suspectGenders
      .filter(
        (gender) =>
          gender.description != "Other" && gender.description != "Unknown",
      )
      .map((gender, index) => ({
        id: `suspect-gender-radio-${index}`,
        children: gender.description,
        value: gender.shortCode,
        "data-testid": `suspect-gender-radio-${index}`,
      }));
  }, [state.apiData.suspectGenders]);

  const setFormValue = (value: string) => {
    const selectedGender = state.apiData.suspectGenders?.find(
      (gender) => gender.shortCode === value,
    );
    if (selectedGender) {
      dispatch({
        type: "SET_SUSPECT_FIELD",
        payload: {
          index: suspectIndex,
          field: "suspectGenderRadio",
          value: selectedGender,
        },
      });
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateFormData(state)) return;

    const nextRoute = getNextSuspectJourneyRoute(
      "suspect-gender",
      state.formData.suspects[suspectIndex].suspectAdditionalDetailsCheckboxes,
      suspectIndex,
    );
    return navigate(nextRoute);
  };

  const {
    formData: { suspects },
  } = state;

  const {
    suspectGenderRadio = { shortCode: null, description: "" },
    suspectFirstNameText = "",
    suspectLastNameText = "",
  } = suspects[suspectIndex] || {};

  return (
    <div className={styles.caseDetailsPage}>
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
                    {`What is ${suspectLastNameText} ${suspectFirstNameText}'s gender?`}
                  </h1>
                ),
              },
            }}
            errorMessage={
              formDataErrors["suspectGenderRadio"]
                ? {
                    children:
                      formDataErrors["suspectGenderRadio"].inputErrorText,
                  }
                : undefined
            }
            items={genderItems}
            value={suspectGenderRadio.shortCode || ""}
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

export default SuspectGenderPage;

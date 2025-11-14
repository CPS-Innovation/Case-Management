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
  LinkButton,
  Details,
  SummaryList,
} from "../../govuk";
import { CaseRegistrationFormContext } from "../../../common/providers/CaseRegistrationProvider";
import { Link, useNavigate } from "react-router-dom";
import { type SuspectFormData } from "../../../common/reducers/caseRegistrationReducer";
import PersonIcon from "../../svgs/personIcon.svg?react";
import { getSuspectSummaryListRows } from "./utils/getSuspectSummaryListRows";
import styles from "./index.module.scss";

const SuspectSummaryPage = () => {
  type ErrorText = {
    errorSummaryText: string;
    inputErrorText?: string;
  };
  type FormDataErrors = {
    addMoreSuspectsRadio?: ErrorText;
  };
  const errorSummaryRef = useRef<HTMLInputElement>(null);
  const { state } = useContext(CaseRegistrationFormContext);
  const navigate = useNavigate();

  const [addMoreSuspectsRadio, setAddMoreSuspectsRadio] = useState<string>();

  const [formDataErrors, setFormDataErrors] = useState<FormDataErrors>({});

  const errorSummaryProperties = useCallback(
    (errorKey: keyof FormDataErrors) => {
      if (errorKey === "addMoreSuspectsRadio") {
        return {
          children: formDataErrors[errorKey]?.errorSummaryText,
          href: "#add-more-suspects-radio-yes",
          "data-testid": "add-more-suspects-radio-yes",
        };
      }
      return null;
    },
    [formDataErrors],
  );

  const validateFormData = () => {
    const errors: FormDataErrors = {};

    if (!addMoreSuspectsRadio) {
      errors.addMoreSuspectsRadio = {
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

  const suspectSummaryRows = useMemo(() => {
    return getSuspectSummaryListRows(state.formData.suspects);
  }, [state.formData.suspects]);

  // const getSuspectSummaryListRows = (suspects: SuspectFormData[]) => {
  //   const rows = suspects.map((suspect, index) => ({
  //     key: {
  //       children: (
  //         <div>
  //           <p>
  //             {suspect.suspectFirstNameText}, {suspect.suspectLastNameText}
  //           </p>
  //         </div>
  //       ),
  //     },

  //     actions: {
  //       items: [
  //         {
  //           children: <span>Change</span>,
  //           to: `/case-registration/suspect-${index}/add-suspect`,
  //           visuallyHiddenText: "Edit Suspect Details",
  //         },
  //         {
  //           children: <span>Remove</span>,
  //           to: "#",
  //           visuallyHiddenText: "remove suspect",
  //           role: "button",
  //           onClick: () => handleRemoveSuspect(index),
  //         },
  //       ],
  //     },
  //   }));

  //   return rows;
  // };

  const renderSummaryList = () => {
    const {
      formData: { suspects },
    } = state;

    return (
      <dl>
        {suspects.map((suspect, index) => (
          <div key={`${index}-${suspect.suspectLastNameText}`}>
            <div className={styles.suspectRowWrapper}>
              <dt className={styles.suspectName}>
                <PersonIcon />{" "}
                {suspect.suspectFirstNameText
                  ? `${suspect.suspectFirstNameText}, ${suspect.suspectLastNameText}`
                  : `${suspect.suspectLastNameText}`}
              </dt>
              <dd>
                <div>
                  <Link to={`/case-registration/suspect-${index}/add-suspect`}>
                    Change
                  </Link>
                  <LinkButton onClick={() => handleRemoveSuspect(index)}>
                    Remove
                  </LinkButton>
                </div>
              </dd>
            </div>
            <div className={styles.suspectDetailsWrapper}>
              <dd>
                <Details summaryChildren="Suspect Details">
                  <SummaryList rows={suspectSummaryRows[index]} />
                </Details>
              </dd>
            </div>
          </div>
        ))}
      </dl>
    );
  };

  const handleRemoveSuspect = (index: number) => {
    // const {
    //   formData: { suspects },
    // } = state;
    // const newSuspects = suspects.filter((_, i) => i !== index);
    // dispatch({
    //   type: "SET_REMOVE_SUSPECT",
    //   payload: {
    //     value: newSuspects,
    //   },
    // });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateFormData()) return;

    if (addMoreSuspectsRadio === "yes") {
      console.log(
        "navigate",
        `/case-registration/suspect-${state.formData.suspects.length}/add-suspect`,
      );
      navigate(
        `/case-registration/suspect-${state.formData.suspects.length}/add-suspect`,
      );
    }
  };

  return (
    <div className={styles.caseSuspectsSummaryPage}>
      <BackLink to={`/case-registration/case-details`}>Back</BackLink>
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
        <h1>{`You have added ${state.formData.suspects.length} suspects`}</h1>
        <div>{renderSummaryList()}</div>
        <div className={styles.inputWrapper}>
          <Radios
            fieldset={{
              legend: {
                children: <h2>Do you need to add another suspect? </h2>,
              },
            }}
            errorMessage={
              formDataErrors["addMoreSuspectsRadio"]
                ? {
                    children:
                      formDataErrors["addMoreSuspectsRadio"].errorSummaryText,
                  }
                : undefined
            }
            items={[
              {
                id: `suspect-add-more-suspects-radio-yes`,
                children: "Yes",
                value: "yes",
                "data-testid": `suspect-add-more-suspects-radio-yes`,
              },
              {
                id: `suspect-add-more-suspects-radio-no`,
                children: "No",
                value: "no",
                "data-testid": `suspect-add-more-suspects-radio-no`,
              },
            ]}
            value={addMoreSuspectsRadio}
            onChange={(value) => {
              setAddMoreSuspectsRadio(value);
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

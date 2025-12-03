import {
  useRef,
  useEffect,
  useState,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { Input, Button, ErrorSummary, BackLink, Table } from "../../govuk";
import { CaseRegistrationFormContext } from "../../../common/providers/CaseRegistrationProvider";
import { type CaseRegistrationState } from "../../../common/reducers/caseRegistrationReducer";
import { type Offence } from "../../../common/types/responses/Offences";
import { getOffences } from "../../../apis/gateway-api";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { formatNameUtil } from "../../../common/utils/formatNameUtil";
import styles from "../index.module.scss";

const ChargesOffenceSearch = () => {
  const errorSummaryRef = useRef<HTMLInputElement>(null);
  const [offencesSearchResult, setOffencesSearchResult] = useState<Offence[]>(
    [],
  );
  const { state, dispatch } = useContext(CaseRegistrationFormContext);
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

  const { refetch: refetchSearchOffences } = useQuery({
    queryKey: ["search-offences"],
    queryFn: () => getOffences(),
    enabled: false,
    retry: false,
    throwOnError: true,
  });
  type ErrorText = {
    errorSummaryText: string;
    inputErrorText?: string;
  };
  type FormDataErrors = {
    offenceSearchText?: ErrorText;
  };

  const previousRoute = useMemo(() => {
    if (state.formData.suspects.length > 1) {
      return "/case-registration/add-charge-suspect";
    }

    return "/case-registration/want-to-add-charges";
  }, [state.formData.suspects]);

  const [formDataErrors, setFormDataErrors] = useState<FormDataErrors>({});

  const errorSummaryProperties = useCallback(
    (errorKey: keyof FormDataErrors) => {
      if (errorKey === "offenceSearchText") {
        return {
          children: formDataErrors[errorKey]?.errorSummaryText,
          href: "#offence-search-text",
          "data-testid": "offence-search-text-link",
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
    const charges = suspects[suspectIndex].charges || {};
    const offenceSearchText = charges[chargeIndex];
    let isValid = true;

    if (!offenceSearchText) {
      errors.offenceSearchText = {
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

  const suspectName = useMemo(() => {
    const {
      suspectFirstNameText,
      suspectLastNameText,
      suspectCompanyNameText,
    } = state.formData.suspects[suspectIndex];
    return suspectCompanyNameText
      ? formatNameUtil(suspectFirstNameText, suspectLastNameText)
      : suspectCompanyNameText;
  }, [state.formData.suspects, suspectIndex]);

  useEffect(() => {
    if (errorList.length) errorSummaryRef.current?.focus();
  }, [errorList]);

  const handleFormChange = (value: string) => {
    dispatch({
      type: "SET_CHARGE_FIELD",
      payload: {
        suspectIndex: suspectIndex,
        chargeIndex: chargeIndex,
        field: "offenceSearchText",
        value: value,
      },
    });
  };

  const getTableRowData = () => {
    return offencesSearchResult.map((data) => {
      return {
        cells: [
          {
            children: (
              <div>
                <b>{data.code}</b>
              </div>
            ),
          },
          {
            children: <div>{data.description}</div>,
          },
          {
            children: <div>{data.legislation}</div>,
          },
          {
            children: <div>{data.effectiveFromDate}</div>,
          },
          {
            children: (
              <Link
                to={`/case-registration/suspect-${suspectIndex}/charge-${chargeIndex}/offence/${data.code}/add-charge-details`}
              >
                Add
              </Link>
            ),
          },
        ],
      };
    });
  };
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const { data } = await refetchSearchOffences();
    if (data) setOffencesSearchResult(data);
    if (!validateFormData(state)) return;
  };

  const { suspects } = state.formData;
  const charges = suspects[suspectIndex].charges || [];
  return (
    <div>
      <BackLink to={previousRoute}>Back</BackLink>

      <div>
        {!!errorList.length && (
          <div
            ref={errorSummaryRef}
            tabIndex={-1}
            className={styles.errorSummaryWrapper}
          >
            <ErrorSummary
              data-testid={"search-error-summary"}
              errorList={errorList}
              titleChildren="There is a problem"
            />
          </div>
        )}
      </div>

      <h1 className="govuk-heading-xl govuk-!-margin-bottom-0">
        Add a charge for {suspectName},
      </h1>

      <form onSubmit={handleSubmit}>
        <div className={styles.inputWrapper}>
          <Input
            id="offence-search-text"
            data-testid="offence-search-text"
            className="govuk-input--width-20"
            label={{
              children: "Search for Offence",
            }}
            hint={{
              children:
                "You can search by part of a CJS code, statute or by offence keyword",
            }}
            errorMessage={
              formDataErrors["offenceSearchText"]
                ? {
                    children:
                      formDataErrors["offenceSearchText"].inputErrorText,
                  }
                : undefined
            }
            type="text"
            value={charges[chargeIndex].offenceSearchText || ""}
            onChange={(value: string) => {
              handleFormChange(value);
            }}
            disabled={false}
          />
          <div className={styles.btnWrapper}>
            <Button type="submit">Search</Button>
          </div>

          <div>
            <Table
              caption="offence search results"
              captionClassName="govuk-visually-hidden"
              head={[
                {
                  children: "CJS code",
                },
                {
                  children: "Description",
                },

                {
                  children: "Statute name and section",
                },
                {
                  children: "Effective dates",
                },
                {
                  children: "Actions",
                },
              ]}
              rows={getTableRowData()}
            />
          </div>
        </div>
      </form>
    </div>
  );
};
export default ChargesOffenceSearch;

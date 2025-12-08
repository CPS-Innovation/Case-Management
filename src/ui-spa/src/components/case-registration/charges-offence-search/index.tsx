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
import { getOffences } from "../../../apis/gateway-api";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams, useNavigate } from "react-router-dom";
import { formatNameUtil } from "../../../common/utils/formatNameUtil";
import styles from "../index.module.scss";
import pageStyles from "./index.module.scss";

const ChargesOffenceSearch = () => {
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

  const currentOffenceSearchText = useMemo(() => {
    const { suspects } = state.formData;
    const charges = suspects[suspectIndex].charges || [];
    return charges[chargeIndex]?.offenceSearchText || "";
  }, [state.formData, suspectIndex, chargeIndex]);
  const [searchText, setSearchText] = useState<string>(
    currentOffenceSearchText,
  );

  const {
    data: offencesSearchResult = [],
    refetch: refetchSearchOffences,
    isFetching,
  } = useQuery({
    queryKey: ["search-offences"],
    queryFn: () => getOffences(),
    enabled: !currentOffenceSearchText ? false : true,

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

  const validateFormData = () => {
    const errors: FormDataErrors = {};

    let isValid = true;

    if (!searchText) {
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
      ? suspectCompanyNameText
      : formatNameUtil(suspectFirstNameText, suspectLastNameText);
  }, [state.formData.suspects, suspectIndex]);

  useEffect(() => {
    if (errorList.length) errorSummaryRef.current?.focus();
  }, [errorList]);

  const handleFormChange = (value: string) => {
    setSearchText(value);
  };

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    value: string,
  ) => {
    event.preventDefault();
    if (!offencesSearchResult) return;
    const selectedOffence = offencesSearchResult.find(
      (offence) => offence.code === value.toString(),
    );
    if (selectedOffence) {
      dispatch({
        type: "SET_CHARGE_FIELD",
        payload: {
          suspectIndex: suspectIndex,
          chargeIndex: chargeIndex,
          field: "selectedOffence",
          value: selectedOffence,
        },
      });
      navigate(
        `/case-registration/suspect-${suspectIndex}/charge-${chargeIndex}/add-charge-details`,
      );
    }
  };

  const getTableRowData = () => {
    if (isFetching) return [];
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
                to={`/case-registration/suspect-${suspectIndex}/charge-${chargeIndex}/add-charge-details`}
                onClick={(event) => handleClick(event, data.code)}
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
    await refetchSearchOffences();
    if (offencesSearchResult) {
      dispatch({
        type: "SET_CHARGE_FIELD",
        payload: {
          suspectIndex: suspectIndex,
          chargeIndex: chargeIndex,
          field: "offenceSearchText",
          value: searchText,
        },
      });
    }
    if (!validateFormData()) return;
  };

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

      <h1>Add a charge for {suspectName}</h1>

      <form onSubmit={handleSubmit}>
        <div className={styles.inputWrapper}>
          <div className={pageStyles.searchWrapper}>
            <Input
              id="offence-search-text"
              data-testid="offence-search-text"
              className="govuk-input--width-30"
              label={{
                children: <b>Search for Offence</b>,
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
              value={searchText}
              onChange={(value: string) => {
                handleFormChange(value);
              }}
              disabled={false}
            />
            <div className={styles.btnWrapper}>
              <Button type="submit" className={pageStyles.btnSearch}>
                Search
              </Button>
            </div>
          </div>

          {!isFetching && (
            <div>
              <span className={pageStyles.resultsCount}>
                {offencesSearchResult.length} results for{" "}
                <strong>{searchText}</strong>
              </span>
              <hr className={pageStyles.resultsDivider} />
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
          )}
        </div>
      </form>
    </div>
  );
};
export default ChargesOffenceSearch;

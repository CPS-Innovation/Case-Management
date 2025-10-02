import { useContext, useMemo } from "react";
import { AutoComplete, BackLink } from "../../govuk";
import { CaseRegistrationFormContext } from "../../../common/providers/CaseRegistrationProvider";
import { getAreasOrDivisions } from "../../../common/utils/getAreasOrDivisions";
import styles from "./index.module.scss";

const CaseAreasPage = () => {
  const { state, dispatch } = useContext(CaseRegistrationFormContext);

  const areas = useMemo(() => {
    if (state.apiData.areasAndRegisteringUnits) {
      return getAreasOrDivisions(state.apiData.areasAndRegisteringUnits);
    }
    return [];
  }, [state.apiData.areasAndRegisteringUnits]);

  const suggest = (
    query: string,
    populateResults: (results: string[]) => void,
  ) => {
    const results = areas || [];
    const filteredResults = results
      .filter((result) =>
        result.areaDescription.toLowerCase().includes(query.toLowerCase()),
      )
      .map((r) => r.areaDescription);
    populateResults(filteredResults);
  };

  const handleAreaConfirm = (value: string) => {
    console.log("Selected area:", value);
    dispatch({
      type: "SET_FIELD",
      payload: { field: "areaOrDivisionText", value: value },
    });
  };
  console.log(
    "state.formData.areaOrDivisionText",
    state.formData.areaOrDivisionText,
  );
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
      <div className={styles.autoCompleteContainer}>
        <AutoComplete
          id="autocomplete"
          source={suggest}
          confirmOnBlur={false}
          onConfirm={handleAreaConfirm}
          defaultValue={state.formData.areaOrDivisionText}
        />
      </div>
    </div>
  );
};

export default CaseAreasPage;

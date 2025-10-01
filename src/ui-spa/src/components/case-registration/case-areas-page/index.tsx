import { AutoComplete, BackLink } from "../../govuk";
import { getCaseAreasAndRegisteringUnits } from "../../../apis/gateway-api";
import { useQuery } from "@tanstack/react-query";
import { getAreasorDivisions } from "./../../../common/utils/getAreasorDivisions";
import styles from "./index.module.scss";

const CaseAreasPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["areas"],
    queryFn: getCaseAreasAndRegisteringUnits,
  });

  if (isLoading) return <div>Loading...</div>;
  const areas = getAreasorDivisions(data || []);

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
  const handleOnConfirm = (value: string) => {
    console.log("Selected value:", value);
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
      <div className={styles.autoCompleteContainer}>
        <AutoComplete
          id="autocomplete"
          source={suggest}
          onConfirm={handleOnConfirm}
        />
      </div>
    </div>
  );
};

export default CaseAreasPage;

import { AutoComplete } from "../govuk";

const CaseRegistrationPage = () => {
  const suggest = (
    query: string,
    populateResults: (results: string[]) => void,
  ) => {
    const results = ["France", "Germany", "United Kingdom"];
    const filteredResults = results.filter((result) =>
      result.toLocaleLowerCase().includes(query.toLowerCase()),
    );
    populateResults(filteredResults);
  };
  const handleOnConfirm = (value: string) => {
    console.log("Selected value:", value);
  };
  return (
    <div>
      <h1>Case Registration</h1>

      <AutoComplete
        id="autocomplete"
        source={suggest}
        onConfirm={handleOnConfirm}
      />
    </div>
  );
};

export default CaseRegistrationPage;

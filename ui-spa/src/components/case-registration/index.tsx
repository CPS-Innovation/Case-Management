import AutoComplete from "../common/AutoComplete";

const CaseRegistrationPage = () => {
  return (
    <div>
      <h1>Case Registration</h1>
      <AutoComplete
        options={[
          { id: "1", value: "Option 1" },
          { id: "2", value: "Option 2" },
          { id: "3", value: "Option 3" },
          { id: "4", value: "Option 4" },
          { id: "5", value: "Option 5" },
          { id: "6", value: "Option 6" },
          { id: "7", value: "Option 7" },
          { id: "8", value: "Option 8" },
          { id: "9", value: "Option 9" },
        ]}
        onInputChange={(value) => console.log("Selected:", value)}
        inputClassName="govuk-input--width-20"
      />
    </div>
  );
};

export default CaseRegistrationPage;

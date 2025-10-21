import { type CaseRegistrationFormData } from "../../../../common/reducers/caseRegistrationReducer";
import { Link } from "react-router";

export const getCaseDetailsSummaryListRows = (
  formData: CaseRegistrationFormData,
) => {
  const urn = `${formData.urnPoliceForceText}${formData.urnPoliceUnitText}${formData.urnUniqueReferenceText}/${formData.urnYearReferenceText}`;
  const rows = [
    {
      key: { children: <span>Area</span> },
      value: {
        children: <p>{formData.areaOrDivisionText?.description}</p>,
      },
      actions: {
        items: [
          {
            children: <Link to={"/case-registration/areas"}>Change</Link>,
            visuallyHiddenText: "Edit Case Area",
          },
        ],
      },
    },

    {
      key: { children: <span>URN</span> },
      value: {
        children: <p>{urn}</p>,
      },
      actions: {
        items: [
          {
            children: (
              <Link to={"/case-registration/case-details"}>Change</Link>
            ),
            visuallyHiddenText: "Edit Case URN",
          },
        ],
      },
    },
    {
      key: { children: <span>Registering Unit</span> },
      value: {
        children: <p>{formData.registeringUnitText?.description}</p>,
      },
      actions: {
        items: [
          {
            children: (
              <Link to={"/case-registration/case-details"}>Change</Link>
            ),
            visuallyHiddenText: "Edit Registering Unit",
          },
        ],
      },
    },
    {
      key: { children: <span>WCU</span> },
      value: {
        children: <p>{formData.witnessCareUnitText?.description}</p>,
      },
      actions: {
        items: [
          {
            children: (
              <Link to={"/case-registration/case-details"}>Change</Link>
            ),
            visuallyHiddenText: "Edit Witness Care Unit",
          },
        ],
      },
    },
    {
      key: { children: <span>Operation Name</span> },
      value: {
        children: <p>{formData.operationNameText}</p>,
      },
      actions: {
        items: [
          {
            children: <Link to={"/case-registration"}>Change</Link>,
            visuallyHiddenText: "Edit Operation Name",
          },
        ],
      },
    },

    {
      key: { children: <span>First Hearing Court Location</span> },
      value: {
        children: <p>{formData.firstHearingCourtLocationText.description}</p>,
      },
      actions: {
        items: [
          {
            children: (
              <Link to={"/case-registration/first-hearing"}>Change</Link>
            ),
            visuallyHiddenText: "Edit First Hearing Court Location",
          },
        ],
      },
    },
    {
      key: { children: <span>First Hearing Date</span> },
      value: {
        children: <p>{formData.firstHearingDateText}</p>,
      },
      actions: {
        items: [
          {
            children: (
              <Link to={"/case-registration/first-hearing"}>Change</Link>
            ),
            visuallyHiddenText: "Edit First Hearing Date",
          },
        ],
      },
    },
  ];
  return rows;
};

export const getSuspectSummaryListRows = (
  formData: CaseRegistrationFormData,
) => {
  const rows = [
    {
      key: { children: <span>Suspects</span> },
      value: {
        children: <p>{formData.suspectDetailsRadio}</p>,
      },
      actions: {
        items: [
          {
            children: <Link to={"/case-registration"}>Change</Link>,
            visuallyHiddenText: "Edit Suspect Details",
          },
        ],
      },
    },
  ];
  return rows;
};

export const getCaseComplexityAndMonitoringCodesSummaryListRows = (
  formData: CaseRegistrationFormData,
  caseMonitoringCodes: { code: string; description: string }[],
) => {
  const getMonitoringCodeDescription = (code: string) => {
    const found = caseMonitoringCodes.find((item) => item.code === code);
    return found ? found.description : code;
  };
  const rows = [
    {
      key: { children: <span>Case Complexity</span> },
      value: {
        children: <p>{formData.caseComplexityRadio}</p>,
      },
      actions: {
        items: [
          {
            children: (
              <Link to={"/case-registration/case-complexity"}>Change</Link>
            ),
            visuallyHiddenText: "Edit Case Complexity",
          },
        ],
      },
    },
    {
      key: { children: <span>Monitoring Codes</span> },
      value: {
        children: (
          <ul className="govuk-list govuk-list--bullet">
            {formData.caseMonitoringCodesCheckboxes.map((code) => (
              <li key={code}>{getMonitoringCodeDescription(code)}</li>
            ))}
          </ul>
        ),
      },
      actions: {
        items: [
          {
            children: (
              <Link to={"/case-registration/case-monitoring-codes"}>
                Change
              </Link>
            ),
            visuallyHiddenText: "Edit Monitoring Codes",
          },
        ],
      },
    },
  ];
  return rows;
};

export const getWhoseWorkingOnTheCaseSummaryListRows = (
  formData: CaseRegistrationFormData,
) => {
  const policeInvestigator = `${formData.caseInvestigatorTitleSelect.description}- ${formData.caseInvestigatorFirstNameText}, ${formData.caseInvestigatorLastNameText}`;
  const rows = [
    {
      key: { children: <span>Prosecutor</span> },
      value: {
        children: <p>{formData.caseProsecutorText?.description}</p>,
      },
      actions: {
        items: [
          {
            children: (
              <Link to={"/case-registration/case-assignee"}>Change</Link>
            ),
            visuallyHiddenText: "Edit Prosecutor",
          },
        ],
      },
    },
    {
      key: { children: <span>Caseworker</span> },
      value: {
        children: <p>{formData.caseCaseworkerText?.description}</p>,
      },
      actions: {
        items: [
          {
            children: (
              <Link to={"/case-registration/case-assignee"}>Change</Link>
            ),
            visuallyHiddenText: "Edit Caseworker",
          },
        ],
      },
    },
    {
      key: { children: <span>Police officer or investigator</span> },
      value: {
        children: <p>{policeInvestigator}</p>,
      },
      actions: {
        items: [
          {
            children: (
              <Link to={"/case-registration/case-assignee"}>Change</Link>
            ),
            visuallyHiddenText: "Edit Police officer or investigator",
          },
        ],
      },
    },
    {
      key: { children: <span>Shoulder number</span> },
      value: {
        children: <p>{formData.caseInvestigatorShoulderNumberText}</p>,
      },
      actions: {
        items: [
          {
            children: (
              <Link to={"/case-registration/case-assignee"}>Change</Link>
            ),
            visuallyHiddenText: "Edit Shoulder Number",
          },
        ],
      },
    },
    {
      key: { children: <span>Police Unit</span> },
      value: {
        children: <p>{formData.caseInvestigatorPoliceUnitText}</p>,
      },
      actions: {
        items: [
          {
            children: (
              <Link to={"/case-registration/case-assignee"}>Change</Link>
            ),
            visuallyHiddenText: "Edit Police Unit",
          },
        ],
      },
    },
  ];
  return rows;
};

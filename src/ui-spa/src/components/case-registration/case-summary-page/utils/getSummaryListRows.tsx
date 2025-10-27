import { format } from "date-fns";
import { type CaseRegistrationFormData } from "../../../../common/reducers/caseRegistrationReducer";

export const getCaseDetailsSummaryListRows = (
  formData: CaseRegistrationFormData,
) => {
  const urn = `${formData.urnPoliceForceText}${formData.urnPoliceUnitText}${formData.urnUniqueReferenceText}/${formData.urnYearReferenceText}`;

  const firstHearingSummary =
    formData.firstHearingRadio === "yes"
      ? [
          {
            key: { children: <span>First Hearing Court Location</span> },
            value: {
              children: (
                <p>{formData.firstHearingCourtLocationText.description}</p>
              ),
            },
            actions: {
              items: [
                {
                  children: <span>Change</span>,
                  to: "/case-registration/first-hearing",
                  visuallyHiddenText: "Edit First Hearing Court Location",
                  state: { isRouteValid: true },
                },
              ],
            },
          },
          {
            key: { children: <span>First Hearing Date</span> },
            value: {
              children: (
                <p>{format(formData.firstHearingDateText, "dd/MM/yyyy")}</p>
              ),
            },
            actions: {
              items: [
                {
                  children: <span>Change</span>,
                  to: "/case-registration/first-hearing",
                  visuallyHiddenText: "Edit First Hearing Date",
                  state: { isRouteValid: true },
                },
              ],
            },
          },
        ]
      : [
          {
            key: { children: <span>First Hearing details</span> },
            value: {
              children: <p>Not entered</p>,
            },
            actions: {
              items: [
                {
                  children: <span>Change</span>,
                  to: "/case-registration/first-hearing",
                  visuallyHiddenText: "Edit First Hearing Date",
                  state: { isRouteValid: true },
                },
              ],
            },
          },
        ];
  const rows = [
    {
      key: { children: <span>Area</span> },
      value: {
        children: <p>{formData.areaOrDivisionText?.description}</p>,
      },
      actions: {
        items: [
          {
            children: <span>Change</span>,
            to: "/case-registration/areas",
            visuallyHiddenText: "Edit Case Area",
            state: { isRouteValid: true },
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
            children: <span>Change</span>,
            to: "/case-registration/case-details",
            visuallyHiddenText: "Edit Case URN",
            state: { isRouteValid: true },
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
            children: <span>Change</span>,
            to: "/case-registration/case-details",
            visuallyHiddenText: "Edit Registering Unit",
            state: { isRouteValid: true },
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
            children: <span>Change</span>,
            to: "/case-registration/case-details",
            visuallyHiddenText: "Edit Witness Care Unit",
            state: { isRouteValid: true },
          },
        ],
      },
    },
    {
      key: { children: <span>Operation Name</span> },
      value: {
        children: (
          <p>
            {formData.operationNameText
              ? formData.operationNameText
              : "Not entered"}
          </p>
        ),
      },
      actions: {
        items: [
          {
            children: <span>Change</span>,
            to: "/case-registration",
            visuallyHiddenText: "Edit Operation Name",
            state: { isRouteValid: true },
          },
        ],
      },
    },
    ...firstHearingSummary,
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
        children: <p>{formData.suspectDetailsRadio === "no" ? "No" : "Yes"}</p>,
      },
      actions: {
        items: [
          {
            children: <span>Change</span>,
            to: "/case-registration",
            visuallyHiddenText: "Edit Suspect Details",
            state: { isRouteValid: true },
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
            children: <span>Change</span>,
            to: "/case-registration/case-complexity",
            visuallyHiddenText: "Edit Case Complexity",
            state: { isRouteValid: true },
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
            children: <span>Change</span>,
            to: "/case-registration/case-monitoring-codes",
            visuallyHiddenText: "Edit Monitoring Codes",
            state: { isRouteValid: true },
          },
        ],
      },
    },
  ];
  return rows;
};

const getInvestigatorSummaryText = (formData: CaseRegistrationFormData) => {
  if (formData.caseInvestigatorTitleSelect) {
    return `${formData.caseInvestigatorTitleSelect.description}(${formData.caseInvestigatorTitleSelect.shortCode}) - ${formData.caseInvestigatorLastNameText}, ${formData.caseInvestigatorFirstNameText}`;
  }
  if (formData.caseInvestigatorFirstNameText) {
    return `${formData.caseInvestigatorLastNameText}, ${formData.caseInvestigatorFirstNameText}`;
  }
  return formData.caseInvestigatorLastNameText;
};

export const getWhosIsWorkingOnTheCaseSummaryListRows = (
  formData: CaseRegistrationFormData,
) => {
  const investigatorDetailsList =
    formData.caseInvestigatorRadio === "yes"
      ? [
          {
            key: { children: <span>Police officer or investigator</span> },
            value: {
              children: <p>{getInvestigatorSummaryText(formData)}</p>,
            },
            actions: {
              items: [
                {
                  children: <span>Change</span>,
                  to: "/case-registration/case-assignee",
                  visuallyHiddenText: "Edit Police officer or investigator",
                  state: { isRouteValid: true },
                },
              ],
            },
          },
          {
            key: { children: <span>Shoulder number</span> },
            value: {
              children: (
                <p>
                  {formData.caseInvestigatorShoulderNumberText
                    ? formData.caseInvestigatorShoulderNumberText
                    : "Not entered"}
                </p>
              ),
            },
            actions: {
              items: [
                {
                  children: <span>Change</span>,
                  to: "/case-registration/case-assignee",
                  visuallyHiddenText: "Edit Shoulder Number",
                  state: { isRouteValid: true },
                },
              ],
            },
          },
          {
            key: { children: <span>Police Unit</span> },
            value: {
              children: (
                <p>
                  {formData.caseInvestigatorPoliceUnitText
                    ? formData.caseInvestigatorPoliceUnitText
                    : "Not entered"}
                </p>
              ),
            },
            actions: {
              items: [
                {
                  children: <span>Change</span>,
                  to: "/case-registration/case-assignee",
                  visuallyHiddenText: "Edit Police Unit",
                  state: { isRouteValid: true },
                },
              ],
            },
          },
        ]
      : [
          {
            key: { children: <span>Police officer or investigator</span> },
            value: {
              children: <p>Not entered</p>,
            },
            actions: {
              items: [
                {
                  children: <span>Change</span>,
                  to: "/case-registration/case-assignee",
                  visuallyHiddenText: "Edit Police officer or investigator",
                  state: { isRouteValid: true },
                },
              ],
            },
          },
        ];

  const rows = [
    {
      key: { children: <span>Prosecutor</span> },
      value: {
        children: (
          <p>
            {formData.caseProsecutorText.description
              ? formData.caseProsecutorText.description
              : "Not entered"}
          </p>
        ),
      },
      actions: {
        items: [
          {
            children: <span>Change</span>,
            to: "/case-registration/case-assignee",
            visuallyHiddenText: "Edit Prosecutor",
            state: { isRouteValid: true },
          },
        ],
      },
    },
    {
      key: { children: <span>Caseworker</span> },
      value: {
        children: (
          <p>
            {formData.caseCaseworkerText?.description
              ? formData.caseCaseworkerText?.description
              : "Not entered"}
          </p>
        ),
      },
      actions: {
        items: [
          {
            children: <span>Change</span>,
            to: "/case-registration/case-assignee",
            visuallyHiddenText: "Edit Caseworker",
            state: { isRouteValid: true },
          },
        ],
      },
    },
    ...investigatorDetailsList,
  ];
  return rows;
};

import { format } from "date-fns";
import { type CaseRegistrationFormData } from "../../../../common/reducers/caseRegistrationReducer";
import { Tag } from "../../../../components/govuk";
import { type CaseMonitoringCodes } from "../../../../common/types/responses/CaseMonitoringCodes";

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
            id: "change-urn-link",
            children: <span>Change</span>,
            to: "/case-registration/case-details",
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
            children: <span>Change</span>,
            to: "/case-registration/case-details",
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
            children: <span>Change</span>,
            to: "/case-registration/case-details",
            visuallyHiddenText: "Edit Witness Care Unit",
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
          },
        ],
      },
    },
    ...firstHearingSummary,
  ];
  return rows;
};

export const getEmptySuspectSummaryRow = () => [
  {
    key: { children: <span>Suspects</span> },
    value: { children: <p>Not entered</p> },
    actions: {
      items: [
        {
          children: <span>Add a suspect</span>,
          to: "/case-registration/suspect-0/add-suspect",
          visuallyHiddenText: "Add Suspect",
        },
      ],
    },
  },
];

export const getCaseComplexityAndMonitoringCodesSummaryListRows = (
  formData: CaseRegistrationFormData,
  caseMonitoringCodes: CaseMonitoringCodes,
) => {
  const sortedMonitoringCodes = () => {
    const mappedCodes = formData.caseMonitoringCodesCheckboxes.map((code) => {
      const item = caseMonitoringCodes.find((item) => item.code === code);
      return item
        ? { code: item.code, display: item.display }
        : { code, display: code };
    });

    return mappedCodes.sort((a, b) => {
      return a.display.localeCompare(b.display);
    });
  };

  const rows = [
    {
      key: { children: <span>Case Complexity</span> },
      value: {
        children: <p>{formData.caseComplexityRadio?.description}</p>,
      },
      actions: {
        items: [
          {
            children: <span>Change</span>,
            to: "/case-registration/case-complexity",
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
            {sortedMonitoringCodes().map(({ code, display }) => (
              <li key={code}>{display}</li>
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
          },
        ],
      },
    },
  ];
  return rows;
};

const getInvestigatorSummaryText = (formData: CaseRegistrationFormData) => {
  if (formData.caseInvestigatorTitleSelect) {
    return (
      <>
        <Tag gdsTagColour="blue">{`${formData.caseInvestigatorTitleSelect.display}`}</Tag>{" "}
        - {formData.caseInvestigatorLastNameText},{" "}
        {formData.caseInvestigatorFirstNameText}
      </>
    );
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
          },
        ],
      },
    },
    ...investigatorDetailsList,
  ];
  return rows;
};

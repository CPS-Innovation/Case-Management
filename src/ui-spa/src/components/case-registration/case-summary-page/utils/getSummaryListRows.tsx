import { format } from "date-fns";
import {
  type CaseRegistrationFormData,
  type CaseRegistrationActions,
} from "../../../../common/reducers/caseRegistrationReducer";
import { Tag } from "../../../../components/govuk";
import { type NavigateFunction } from "react-router-dom";
import { type CaseMonitoringCodes } from "../../../../common/types/responses/CaseMonitoringCodes";
import { type PoliceUnit } from "../../../../common/types/responses/PoliceUnits";

export const getCaseDetailsSummaryListRows = (
  dispatch: React.Dispatch<CaseRegistrationActions>,
  navigate: NavigateFunction,
  formData: CaseRegistrationFormData,
) => {
  const handleAddChangeClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    url: string,
  ) => {
    event.preventDefault();

    const payload: {
      changeCaseArea?: boolean;
      changeCaseDetails?: boolean;
      fromCaseSummaryPage?: boolean;
    } = {};
    if (url === "/case-registration/areas") payload.changeCaseArea = true;
    else if (url === "/case-registration") payload.fromCaseSummaryPage = true;
    else payload.changeCaseDetails = true;

    dispatch({
      type: "SET_NAVIGATION_DATA",
      payload,
    });
    navigate(url);
  };
  const urn = `${formData.urnPoliceForceText}${formData.urnPoliceUnitText}${formData.urnUniqueReferenceText}/${formData.urnYearReferenceText}`;

  const rows = [
    {
      key: { children: <span>Area</span> },
      value: {
        children: <span>{formData.areaOrDivisionText?.description}</span>,
      },
      actions: {
        items: [
          {
            children: <span>Change</span>,
            to: "/case-registration/areas",
            visuallyHiddenText: "Edit Case Area",
            onClick: (event: React.MouseEvent<HTMLAnchorElement>) =>
              handleAddChangeClick(event, "/case-registration/areas"),
          },
        ],
      },
    },

    {
      key: { children: <span>URN</span> },
      value: {
        children: <span>{urn}</span>,
      },
      actions: {
        items: [
          {
            id: "change-urn-link",
            children: <span>Change</span>,
            to: "/case-registration/case-details",
            visuallyHiddenText: "Edit Case URN",
            onClick: (event: React.MouseEvent<HTMLAnchorElement>) =>
              handleAddChangeClick(event, "/case-registration/case-details"),
          },
        ],
      },
    },
    {
      key: { children: <span>Registering unit</span> },
      value: {
        children: <span>{formData.registeringUnitText?.description}</span>,
      },
      actions: {
        items: [
          {
            children: <span>Change</span>,
            to: "/case-registration/case-details",
            visuallyHiddenText: "Edit Registering Unit",
            onClick: (event: React.MouseEvent<HTMLAnchorElement>) =>
              handleAddChangeClick(event, "/case-registration/case-details"),
          },
        ],
      },
    },
    {
      key: { children: <span>WCU</span> },
      value: {
        children: <span>{formData.witnessCareUnitText?.description}</span>,
      },
      actions: {
        items: [
          {
            children: <span>Change</span>,
            to: "/case-registration/case-details",
            visuallyHiddenText: "Edit Witness Care Unit",
            onClick: (event: React.MouseEvent<HTMLAnchorElement>) =>
              handleAddChangeClick(event, "/case-registration/case-details"),
          },
        ],
      },
    },
    {
      key: { children: <span>Operation name</span> },
      value: {
        children: (
          <span>
            {formData.operationNameText
              ? formData.operationNameText
              : "Not entered"}
          </span>
        ),
      },
      actions: {
        items: [
          {
            children: <span>Change</span>,
            to: "/case-registration",
            visuallyHiddenText: "Edit Operation Name",
            onClick: (event: React.MouseEvent<HTMLAnchorElement>) =>
              handleAddChangeClick(event, "/case-registration"),
          },
        ],
      },
    },
  ];
  return rows;
};

export const getFirstHearingSummaryRows = (
  dispatch: React.Dispatch<CaseRegistrationActions>,
  navigate: NavigateFunction,
  formData: CaseRegistrationFormData,
) => {
  const handleAddChangeClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    dispatch({
      type: "SET_NAVIGATION_DATA",
      payload: { fromCaseSummaryPage: true },
    });
    navigate("/case-registration/first-hearing");
  };

  const rows =
    formData.firstHearingRadio === "yes"
      ? [
          {
            key: { children: <span>First hearing court location</span> },
            value: {
              children: (
                <span>
                  {formData.firstHearingCourtLocationText.description}
                </span>
              ),
            },
            actions: {
              items: [
                {
                  children: <span>Change</span>,
                  to: "/case-registration/first-hearing",
                  visuallyHiddenText: "Edit First Hearing Court Location",
                  onClick: (event: React.MouseEvent<HTMLAnchorElement>) =>
                    handleAddChangeClick(event),
                },
              ],
            },
          },
          {
            key: { children: <span>First hearing date</span> },
            value: {
              children: (
                <span>
                  {format(formData.firstHearingDateText, "dd MMMM yyyy")}
                </span>
              ),
            },
            actions: {
              items: [
                {
                  children: <span>Change</span>,
                  to: "/case-registration/first-hearing",
                  visuallyHiddenText: "Edit First Hearing Date",
                  onClick: (event: React.MouseEvent<HTMLAnchorElement>) =>
                    handleAddChangeClick(event),
                },
              ],
            },
          },
        ]
      : [
          {
            key: { children: <span>First hearing details</span> },
            value: {
              children: <span>Not entered</span>,
            },
            actions: {
              items: [
                {
                  children: <span>Change</span>,
                  to: "/case-registration/first-hearing",
                  visuallyHiddenText: "Edit First Hearing Date",
                  onClick: (event: React.MouseEvent<HTMLAnchorElement>) =>
                    handleAddChangeClick(event),
                },
              ],
            },
          },
        ];
  return rows;
};

export const getEmptySuspectSummaryRow = (
  dispatch: React.Dispatch<CaseRegistrationActions>,
  navigate: NavigateFunction,
) => {
  const handleAddSuspectClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    url: string,
  ) => {
    event.preventDefault();
    dispatch({
      type: "SET_NAVIGATION_DATA",
      payload: { fromCaseSummaryPage: true },
    });
    navigate(url);
  };
  return [
    {
      key: { children: <span>Suspects</span> },
      value: { children: <span>Not entered</span> },
      actions: {
        items: [
          {
            children: <span>Add a suspect</span>,
            to: "/case-registration/suspect-0/add-suspect",
            visuallyHiddenText: "Add Suspect",
            onClick: (event: React.MouseEvent<HTMLAnchorElement>) =>
              handleAddSuspectClick(
                event,
                "/case-registration/suspect-0/add-suspect",
              ),
          },
        ],
      },
    },
  ];
};

export const getCaseComplexityAndMonitoringCodesSummaryListRows = (
  dispatch: React.Dispatch<CaseRegistrationActions>,
  navigate: NavigateFunction,
  formData: CaseRegistrationFormData,
  caseMonitoringCodes: CaseMonitoringCodes,
) => {
  const handleAddChargeClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    url: string,
  ) => {
    event.preventDefault();
    dispatch({
      type: "SET_NAVIGATION_DATA",
      payload: { fromCaseSummaryPage: true },
    });
    navigate(url);
  };
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
      key: { children: <span>Case complexity</span> },
      value: {
        children: <span>{formData.caseComplexityRadio?.description}</span>,
      },
      actions: {
        items: [
          {
            children: <span>Change</span>,
            to: "/case-registration/case-complexity",
            visuallyHiddenText: "Edit Case Complexity",
            onClick: (event: React.MouseEvent<HTMLAnchorElement>) =>
              handleAddChargeClick(event, "/case-registration/case-complexity"),
          },
        ],
      },
    },
    {
      key: { children: <span>Monitoring codes</span> },
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
            onClick: (event: React.MouseEvent<HTMLAnchorElement>) =>
              handleAddChargeClick(
                event,
                "/case-registration/case-monitoring-codes",
              ),
          },
        ],
      },
    },
  ];
  return rows;
};

const getInvestigatorSummaryText = (formData: CaseRegistrationFormData) => {
  if (formData.caseInvestigatorTitleSelect.display) {
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
  dispatch: React.Dispatch<CaseRegistrationActions>,
  navigate: NavigateFunction,
  formData: CaseRegistrationFormData,
  policeUnit?: PoliceUnit,
) => {
  const handleAddChangeClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    url: string,
  ) => {
    event.preventDefault();
    dispatch({
      type: "SET_NAVIGATION_DATA",
      payload: { fromCaseSummaryPage: true },
    });
    navigate(url);
  };
  const investigatorDetailsList =
    formData.caseInvestigatorRadio === "yes"
      ? [
          {
            key: { children: <span>Police officer or investigator</span> },
            value: {
              children: <span>{getInvestigatorSummaryText(formData)}</span>,
            },
            actions: {
              items: [
                {
                  children: <span>Change</span>,
                  to: "/case-registration/case-assignee",
                  visuallyHiddenText: "Edit Police officer or investigator",
                  onClick: (event: React.MouseEvent<HTMLAnchorElement>) =>
                    handleAddChangeClick(
                      event,
                      "/case-registration/case-assignee",
                    ),
                },
              ],
            },
          },
          {
            key: { children: <span>Shoulder number</span> },
            value: {
              children: (
                <span>
                  {formData.caseInvestigatorShoulderNumberText
                    ? formData.caseInvestigatorShoulderNumberText
                    : "Not entered"}
                </span>
              ),
            },
            actions: {
              items: [
                {
                  children: <span>Change</span>,
                  to: "/case-registration/case-assignee",
                  visuallyHiddenText: "Edit Shoulder Number",
                  onClick: (event: React.MouseEvent<HTMLAnchorElement>) =>
                    handleAddChangeClick(
                      event,
                      "/case-registration/case-assignee",
                    ),
                },
              ],
            },
          },
          {
            key: { children: <span>Police unit</span> },
            value: {
              children: (
                <span>
                  {policeUnit ? policeUnit.description : "Not entered"}
                </span>
              ),
            },
            actions: {
              items: [
                {
                  children: <span>Change</span>,
                  to: "/case-registration/case-assignee",
                  visuallyHiddenText: "Edit Police Unit",
                  onClick: (event: React.MouseEvent<HTMLAnchorElement>) =>
                    handleAddChangeClick(
                      event,
                      "/case-registration/case-assignee",
                    ),
                },
              ],
            },
          },
        ]
      : [
          {
            key: { children: <span>Police officer or investigator</span> },
            value: {
              children: <span>Not entered</span>,
            },
            actions: {
              items: [
                {
                  children: <span>Change</span>,
                  to: "/case-registration/case-assignee",
                  visuallyHiddenText: "Edit Police officer or investigator",
                  onClick: (event: React.MouseEvent<HTMLAnchorElement>) =>
                    handleAddChangeClick(
                      event,
                      "/case-registration/case-assignee",
                    ),
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
          <span>
            {formData.caseProsecutorText.description
              ? formData.caseProsecutorText.description
              : "Not entered"}
          </span>
        ),
      },
      actions: {
        items: [
          {
            children: <span>Change</span>,
            to: "/case-registration/case-assignee",
            visuallyHiddenText: "Edit Prosecutor",
            onClick: (event: React.MouseEvent<HTMLAnchorElement>) =>
              handleAddChangeClick(event, "/case-registration/case-assignee"),
          },
        ],
      },
    },
    {
      key: { children: <span>Caseworker</span> },
      value: {
        children: (
          <span>
            {formData.caseCaseworkerText?.description
              ? formData.caseCaseworkerText?.description
              : "Not entered"}
          </span>
        ),
      },
      actions: {
        items: [
          {
            children: <span>Change</span>,
            to: "/case-registration/case-assignee",
            visuallyHiddenText: "Edit Caseworker",
            onClick: (event: React.MouseEvent<HTMLAnchorElement>) =>
              handleAddChangeClick(event, "/case-registration/case-assignee"),
          },
        ],
      },
    },
    ...investigatorDetailsList,
  ];
  return rows;
};

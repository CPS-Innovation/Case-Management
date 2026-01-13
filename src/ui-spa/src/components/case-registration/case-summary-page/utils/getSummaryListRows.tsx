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
  const handleAddChargeClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    url: string,
  ) => {
    event.preventDefault();

    const payload =
      url === "/case-registration/areas"
        ? { changeCaseArea: true }
        : { changeCaseDetails: true };

    dispatch({
      type: "SET_NAVIGATION_DATA",
      payload,
    });
    navigate(url);
  };
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
                  onClick: (event: React.MouseEvent<HTMLAnchorElement>) =>
                    handleAddChargeClick(
                      event,
                      "/case-registration/first-hearing",
                    ),
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
                  onClick: (event: React.MouseEvent<HTMLAnchorElement>) =>
                    handleAddChargeClick(
                      event,
                      "/case-registration/first-hearing",
                    ),
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
                  onClick: (event: React.MouseEvent<HTMLAnchorElement>) =>
                    handleAddChargeClick(
                      event,
                      "/case-registration/first-hearing",
                    ),
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
            onClick: (event: React.MouseEvent<HTMLAnchorElement>) =>
              handleAddChargeClick(event, "/case-registration/areas"),
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
            onClick: (event: React.MouseEvent<HTMLAnchorElement>) =>
              handleAddChargeClick(event, "/case-registration/case-details"),
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
            onClick: (event: React.MouseEvent<HTMLAnchorElement>) =>
              handleAddChargeClick(event, "/case-registration/case-details"),
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
            onClick: (event: React.MouseEvent<HTMLAnchorElement>) =>
              handleAddChargeClick(event, "/case-registration/case-details"),
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

export const getEmptySuspectSummaryRow = (
  dispatch: React.Dispatch<CaseRegistrationActions>,
  navigate: NavigateFunction,
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
  return [
    {
      key: { children: <span>Suspects</span> },
      value: { children: <p>Not entered</p> },
      actions: {
        items: [
          {
            children: <span>Add a suspect</span>,
            to: "/case-registration/suspect-0/add-suspect",
            visuallyHiddenText: "Add Suspect",
            onClick: (event: React.MouseEvent<HTMLAnchorElement>) =>
              handleAddChargeClick(
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
            onClick: (event: React.MouseEvent<HTMLAnchorElement>) =>
              handleAddChargeClick(event, "/case-registration/case-complexity"),
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
                  onClick: (event: React.MouseEvent<HTMLAnchorElement>) =>
                    handleAddChargeClick(
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
                  onClick: (event: React.MouseEvent<HTMLAnchorElement>) =>
                    handleAddChargeClick(
                      event,
                      "/case-registration/case-assignee",
                    ),
                },
              ],
            },
          },
          {
            key: { children: <span>Police Unit</span> },
            value: {
              children: (
                <p>{policeUnit ? policeUnit.description : "Not entered"}</p>
              ),
            },
            actions: {
              items: [
                {
                  children: <span>Change</span>,
                  to: "/case-registration/case-assignee",
                  visuallyHiddenText: "Edit Police Unit",
                  onClick: (event: React.MouseEvent<HTMLAnchorElement>) =>
                    handleAddChargeClick(
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
              children: <p>Not entered</p>,
            },
            actions: {
              items: [
                {
                  children: <span>Change</span>,
                  to: "/case-registration/case-assignee",
                  visuallyHiddenText: "Edit Police officer or investigator",
                  onClick: (event: React.MouseEvent<HTMLAnchorElement>) =>
                    handleAddChargeClick(
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
            onClick: (event: React.MouseEvent<HTMLAnchorElement>) =>
              handleAddChargeClick(event, "/case-registration/case-assignee"),
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
            onClick: (event: React.MouseEvent<HTMLAnchorElement>) =>
              handleAddChargeClick(event, "/case-registration/case-assignee"),
          },
        ],
      },
    },
    ...investigatorDetailsList,
  ];
  return rows;
};

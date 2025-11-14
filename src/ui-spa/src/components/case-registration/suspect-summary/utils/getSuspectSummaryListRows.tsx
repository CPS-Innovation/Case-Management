import { type SuspectFormData } from "../../../../common/reducers/caseRegistrationReducer";
export const getSuspectSummaryListRows = (suspects: SuspectFormData[]) => {
  if (!suspects || suspects.length === 0) {
    return [];
  }
  const suspectSummaryList = suspects.map((suspect, index) => [
    {
      key: { children: <span>Date of birth</span> },
      value: {
        children: (
          <>
            {suspect.suspectDOBDayText ? (
              <p>{`${suspect.suspectDOBDayText}/${suspect.suspectDOBMonthText}/${suspect.suspectDOBYearText}`}</p>
            ) : (
              <p>Not entered</p>
            )}
          </>
        ),
      },
      actions: {
        items: [
          {
            children: <span>Change</span>,
            to: `/case-registration/suspect-${index}/suspect-dob`,
            visuallyHiddenText: "Edit Suspect Date of Birth",
          },
        ],
      },
    },
    //   {
    //     key: { children: <span>Shoulder number</span> },
    //     value: {
    //       children: (
    //         <p>
    //           {formData.caseInvestigatorShoulderNumberText
    //             ? formData.caseInvestigatorShoulderNumberText
    //             : "Not entered"}
    //         </p>
    //       ),
    //     },
    //     actions: {
    //       items: [
    //         {
    //           children: <span>Change</span>,
    //           to: "/case-registration/case-assignee",
    //           visuallyHiddenText: "Edit Shoulder Number",
    //         },
    //       ],
    //     },
    //   },
    //   {
    //     key: { children: <span>Police Unit</span> },
    //     value: {
    //       children: (
    //         <p>
    //           {formData.caseInvestigatorPoliceUnitText
    //             ? formData.caseInvestigatorPoliceUnitText
    //             : "Not entered"}
    //         </p>
    //       ),
    //     },
    //     actions: {
    //       items: [
    //         {
    //           children: <span>Change</span>,
    //           to: "/case-registration/case-assignee",
    //           visuallyHiddenText: "Edit Police Unit",
    //         },
    //       ],
    //     },
    //   },
  ]);
  return suspectSummaryList;
};

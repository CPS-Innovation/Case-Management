import { type SuspectFormData } from "../../../../common/reducers/caseRegistrationReducer";
export const getSuspectSummaryListRows = (suspects: SuspectFormData[]) => {
  if (!suspects || suspects.length === 0) {
    return [];
  }
  const suspectSummaryList = suspects.map((suspect) => [
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
    },
    {
      key: { children: <span>Gender</span> },
      value: {
        children: (
          <>
            {suspect.suspectGenderRadio.description ? (
              <p>{suspect.suspectGenderRadio.description}</p>
            ) : (
              <p>Unknown</p>
            )}
          </>
        ),
      },
    },

    {
      key: { children: <span>Disability</span> },
      value: {
        children: (
          <>
            {suspect.suspectDisabilityRadio ? (
              <p>{suspect.suspectDisabilityRadio}</p>
            ) : (
              <p>Unknown</p>
            )}
          </>
        ),
      },
    },
    {
      key: { children: <span>Religion</span> },
      value: {
        children: (
          <>
            {suspect.suspectReligionRadio.description ? (
              <p>{suspect.suspectReligionRadio.description}</p>
            ) : (
              <p>Not provided</p>
            )}
          </>
        ),
      },
    },
    {
      key: { children: <span>Ethnicity</span> },
      value: {
        children: (
          <>
            {suspect.suspectEthnicityRadio.description ? (
              <p>{suspect.suspectEthnicityRadio.description}</p>
            ) : (
              <p>Not provided</p>
            )}
          </>
        ),
      },
    },
    {
      key: { children: <span>Serious dangerous offender (SDO)</span> },
      value: {
        children: (
          <>
            {suspect.suspectSDORadio ? (
              <p>{suspect.suspectSDORadio}</p>
            ) : (
              <p>No</p>
            )}
          </>
        ),
      },
    },
    {
      key: { children: <span>Arrest summons</span> },
      value: {
        children: (
          <>
            {suspect.suspectASNText ? (
              <p>{suspect.suspectASNText}</p>
            ) : (
              <p>Not provided</p>
            )}
          </>
        ),
      },
    },
    {
      key: { children: <span>Type of offender</span> },
      value: {
        children: (
          <>
            {suspect.suspectOffenderTypesRadio.display ? (
              <p>{suspect.suspectOffenderTypesRadio.display}</p>
            ) : (
              <p>Unspecified</p>
            )}
          </>
        ),
      },
    },
  ]);
  return suspectSummaryList;
};

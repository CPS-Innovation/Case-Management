import { type SuspectFormData } from "../../../../common/reducers/caseRegistrationReducer";

const getAliasesList = (aliases: { firstName: string; lastName: string }[]) => {
  if (!aliases || aliases.length === 0) {
    return [
      {
        key: { children: <span>Alias</span> },
        value: {
          children: <span>Not provided</span>,
        },
      },
    ];
  }

  return aliases.map((alias) => ({
    key: { children: <span>Alias</span> },
    value: {
      children: (
        <span>
          {alias.firstName
            ? `${alias.lastName}, ${alias.firstName} `
            : alias.lastName}
        </span>
      ),
    },
  }));
};

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
              <span>{`${suspect.suspectDOBDayText}/${suspect.suspectDOBMonthText}/${suspect.suspectDOBYearText}`}</span>
            ) : (
              <span>Not entered</span>
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
              <span>{suspect.suspectGenderRadio.description}</span>
            ) : (
              <span>Unknown</span>
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
              <span>{suspect.suspectDisabilityRadio}</span>
            ) : (
              <span>Unknown</span>
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
              <span>{suspect.suspectReligionRadio.description}</span>
            ) : (
              <span>Not provided</span>
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
              <span>{suspect.suspectEthnicityRadio.description}</span>
            ) : (
              <span>Not provided</span>
            )}
          </>
        ),
      },
    },
    ...getAliasesList(suspect.suspectAliases),

    {
      key: { children: <span>Serious dangerous offender (SDO)</span> },
      value: {
        children: (
          <>
            {suspect.suspectSDORadio ? (
              <span>{suspect.suspectSDORadio}</span>
            ) : (
              <span>Not provided</span>
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
              <span>{suspect.suspectASNText}</span>
            ) : (
              <span>Not entered</span>
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
              <span>{suspect.suspectOffenderTypesRadio.display}</span>
            ) : (
              <span>Unspecified</span>
            )}
          </>
        ),
      },
    },
  ]);
  return suspectSummaryList;
};

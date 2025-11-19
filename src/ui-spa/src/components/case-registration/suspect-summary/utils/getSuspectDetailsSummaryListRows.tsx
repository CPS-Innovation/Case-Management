import { type SuspectFormData } from "../../../../common/reducers/caseRegistrationReducer";
import { format } from "date-fns";

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

const getOffenderTypeList = (suspectOffenderTypesRadio: {
  shortCode: string;
  display: string;
  arrestDate: string;
}) => {
  if (suspectOffenderTypesRadio.shortCode === "PPO")
    return [
      {
        key: { children: <span>Type of offender</span> },
        value: {
          children: (
            <>
              {suspectOffenderTypesRadio.display ? (
                <span>{suspectOffenderTypesRadio.display}</span>
              ) : (
                <span>Unspecified</span>
              )}
            </>
          ),
        },
      },
    ];
  return [
    {
      key: { children: <span>Type of offender</span> },
      value: {
        children: (
          <>
            {suspectOffenderTypesRadio.display ? (
              <span>{suspectOffenderTypesRadio.display}</span>
            ) : (
              <span>Unspecified</span>
            )}
          </>
        ),
      },
    },
    {
      key: { children: <span>Arrest Date</span> },
      value: {
        children: (
          <>
            {suspectOffenderTypesRadio.arrestDate ? (
              <span>
                {format(suspectOffenderTypesRadio.arrestDate, "dd/MM/yyyy")}
              </span>
            ) : (
              <span>Not entered</span>
            )}
          </>
        ),
      },
    },
  ];
};

export const getSuspectDetailsSummaryListRows = (
  suspects: SuspectFormData[],
) => {
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
    ...getOffenderTypeList(suspect.suspectOffenderTypesRadio),
  ]);
  return suspectSummaryList;
};

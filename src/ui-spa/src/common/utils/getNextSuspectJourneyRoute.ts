import { type SuspectAdditionalDetailValue } from "../reducers/caseRegistrationReducer";

export const getNextSuspectJourneyRoute = (
  currentRoute: string,
  suspectAdditionalDetailsCheckboxes: SuspectAdditionalDetailValue[],
  currentSuspectIndex: number,
): string => {
  const routeSequence: {
    route: string;
    description: SuspectAdditionalDetailValue | "Add suspect";
  }[] = [
    {
      route: "add-suspect",
      description: "Add suspect",
    },
    {
      route: "suspect-dob",
      description: "Date of Birth",
    },
    {
      route: "suspect-gender",
      description: "Gender",
    },
    {
      route: "suspect-disability",
      description: "Disability",
    },
    {
      route: "suspect-religion",
      description: "Religion",
    },
    {
      route: "suspect-ethnicity",
      description: "Ethnicity",
    },
    {
      route: "add-aliases",
      description: "Alias details",
    },
    {
      route: "suspect-sdo",
      description: "Serious dangerous offender (SDO)",
    },
    {
      route: "suspect-asn",
      description: "Arrest summons number (ASN)",
    },
    {
      route: "suspect-offender",
      description: "Type of offender",
    },
  ];

  //   const selected = new Set(suspectAdditionalDetailsCheckboxes || []);

  //   console.log("selected>>>>", selected);

  if (!suspectAdditionalDetailsCheckboxes.length) return "/suspect-summary";

  const shouldInclude = (description: SuspectAdditionalDetailValue) => {
    console.log(
      "suspectAdditionalDetailsCheckboxes>>>>",
      suspectAdditionalDetailsCheckboxes,
    );
    console.log("description>>>>", description);
    return suspectAdditionalDetailsCheckboxes.includes(description);
  };

  const filteredSequence = routeSequence.filter((item) => {
    if (item.description !== "Add suspect") {
      return shouldInclude(item.description);
    }
    return false;
  });

  console.log("filteredSequence>>>>", filteredSequence);

  const currentIndex = filteredSequence.findIndex(
    (item) => item.route === currentRoute,
  );

  if (filteredSequence[currentIndex + 1]?.route) {
    return `/case-registration/suspect-${currentSuspectIndex}/${filteredSequence[currentIndex + 1].route}`;
  }
  return `/case-registration/suspect-summary"}`;
};

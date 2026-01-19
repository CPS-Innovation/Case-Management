import { type Offences } from "../../common/types/responses/Offences";

export const offencesDev: Offences = {
  offences: [
    {
      code: "WC81229",
      description: "Permit to be set trap etc - cause injury to wild bird",
      legislation:
        "Contrary to sections 5(1)(f) and 21(1) of the Wildlife and Countryside Act 1981.",
      effectiveFromDate: "1998-03-17T00:00:00",
      effectiveToDate: "1998-04-17T00:00:00",
    },
    {
      code: "PB92005",
      description: "Attempt to injure a badger",
      legislation:
        "Contrary to sections 1(1) and 12 of the Protection of Badgers Act 1992.",
      effectiveFromDate: "1998-03-17T00:00:00",
      effectiveToDate: null,
    },
    {
      code: "TH68040",
      description: "Burglary dwelling - attempt grievous bodily harm",
      legislation: "Contrary to section 9(1)(b) of the Theft Act 1968.",
      effectiveFromDate: "1998-03-17T00:00:00",
      effectiveToDate: null,
    },
  ],
  total: 3,
};

/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  type CaseRegistrationFormData,
  type GeneralRadioValue,
  type SuspectFormData,
  type Victim,
} from "../reducers/caseRegistrationReducer";
import { type CaseMonitoringCode } from "../types/responses/CaseMonitoringCodes";
import { type CaseRegistration } from "../types/requests/CaseRegistration";
import { type PoliceUnit } from "../types/responses/PoliceUnits";

export const getCaseRegistrationRequestData = (
  formData: CaseRegistrationFormData,
  monitoringCodesData: CaseMonitoringCode[],
  policeUnit?: PoliceUnit,
): CaseRegistration => {
  const monitoringCodes = monitoringCodesData
    .filter((mCode) =>
      formData.caseMonitoringCodesCheckboxes.includes(mCode.code),
    )
    .map((mCode) => {
      return {
        code: mCode.code,
        selected: true,
      };
    });

  return {
    urn: {
      policeForce: formData.urnPoliceForceText,
      policeUnit: formData.urnPoliceUnitText,
      uniqueRef: formData.urnUniqueReferenceText,
      year: Number.parseInt(formData.urnYearReferenceText),
    },
    registeringAreaId: formData.areaOrDivisionText.id!,
    registeringUnitId: formData.registeringUnitText.id!,
    allocatedWcuId: formData.witnessCareUnitText.id! ?? 0,
    operationName: formData.operationNameText,
    courtLocationId: formData.firstHearingCourtLocationText.id ?? 0,
    courtLocationName: formData.firstHearingCourtLocationText.description,
    hearingDate: formData.firstHearingDateText
      ? formData.firstHearingDateText
      : null,
    complexity: formData.caseComplexityRadio.shortCode,
    monitoringCodes,
    prosecutorId: formData.caseProsecutorText.id! ?? 0,
    caseWorker: formData.caseCaseworkerText.id
      ? `${formData.caseCaseworkerText.id}`
      : "",
    oicRank: formData.caseInvestigatorTitleSelect.shortCode ?? "",
    oicSurname: formData.caseInvestigatorLastNameText,
    oicFirstnames: formData.caseInvestigatorFirstNameText,
    oicShoulderNumber: formData.caseInvestigatorShoulderNumberText,
    oicPoliceUnit: policeUnit ? policeUnit.code : "",
    defendants: getSuspectRequestData(formData.suspects, formData.victimsList),
    victims: getVictimRequestData(formData.victimsList),
  };
};

const getVictimRequestData = (victims: Victim[]) => {
  return victims.map((victim) => ({
    forename: victim.victimFirstNameText,
    surname: victim.victimLastNameText,
    isVulnerable:
      victim.victimAdditionalDetailsCheckboxes.includes("Vulnerable"),
    isIntimidated:
      victim.victimAdditionalDetailsCheckboxes.includes("Intimidated"),
    isWitness: victim.victimAdditionalDetailsCheckboxes.includes("Witness"),
  }));
};

const getSuspectRequestData = (
  suspects: SuspectFormData[],
  victims: Victim[],
) => {
  const disability = (suspectDisabilityRadio: GeneralRadioValue) => {
    if (!suspectDisabilityRadio) return "";
    return suspectDisabilityRadio === "yes" ? "Y" : "N";
  };

  const getDOBString = (day: string, month: string, year: string) => {
    if (!day || !month || !year) return null;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  const getVictimIndex = (victim: { victimId: string } | null) => {
    if (!victim) return -1;
    return victims.findIndex(({ victimId }) => victimId === victimId);
  };
  return suspects.map((suspect) => ({
    isDefendant: suspect.addSuspectRadio === "person",
    firstname: suspect.suspectFirstNameText,
    surname: suspect.suspectLastNameText,
    companyName: suspect.suspectCompanyNameText,
    dateOfBirth: getDOBString(
      suspect.suspectDOBDayText,
      suspect.suspectDOBMonthText,
      suspect.suspectDOBYearText,
    ),
    gender: suspect.suspectGenderRadio.shortCode,
    disability: disability(suspect.suspectDisabilityRadio),
    ethnicity: suspect.suspectEthnicityRadio.shortCode,
    religion: suspect.suspectReligionRadio.shortCode,
    type: suspect.suspectOffenderTypesRadio.shortCode,
    arrestDate: suspect.suspectOffenderTypesRadio.arrestDate ?? null,
    seriousDangerousOffender: suspect.suspectSDORadio === "yes",
    arrestSummonsNumber: suspect.suspectASNText,
    isNotYetCharged: suspect.charges.length === 0,
    aliases: suspect.suspectAliases.map((alias) => ({
      firstName: alias.firstName,
      lastName: alias.lastName,
    })),
    charges: suspect.charges.map((charge) => ({
      offenceCode: charge.selectedOffence.code,
      offenceDescription: charge.selectedOffence.description,
      modeOfTrial: charge.selectedOffence.modeOfTrial,
      dateFrom: charge.offenceFromDate ? charge.offenceFromDate : null,
      dateTo: charge.offenceToDate ? charge.offenceToDate : null,
      victimIndexId: getVictimIndex(charge.victim),
    })),
  }));
};

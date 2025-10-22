import { type CaseRegistrationFormData } from "../reducers/caseRegistrationReducer";
import { type CaseMonitoringCode } from "../types/responses/CaseMonitoringCodes";
import { type CaseRegistration } from "../types/requests/CaseRegistration";

export const getCaseRegistrationRequestData = (
  formData: CaseRegistrationFormData,
  monitoringCodesData: CaseMonitoringCode[],
): CaseRegistration => {
  const monitoringCodes = monitoringCodesData.map((mCode) => {
    return {
      code: mCode.code,
      selected: formData.caseMonitoringCodesCheckboxes.includes(mCode.code),
    };
  });
  return {
    urn: {
      policeForce: formData.urnPoliceForceText,
      policeUnit: formData.urnPoliceUnitText,
      uniqueRef: formData.urnUniqueReferenceText,
      year: formData.urnYearReferenceText,
    },
    registeringAreaId: formData.areaOrDivisionText.id!,
    registeringUnitId: formData.registeringUnitText.id!,
    allocateWcuId: formData.witnessCareUnitText.id!,
    operationName: formData.operationNameText,
    courtLocationId: formData.firstHearingCourtLocationText.id!,
    courtLocationName: formData.firstHearingCourtLocationText.description,
    hearingDate: formData.firstHearingDateText,
    monitoringCodes,
    prosecutorId: formData.caseProsecutorText.id!,
    caseWorker: formData.caseCaseworkerText.id!,
    ociRank: formData.caseInvestigatorTitleSelect.shortCode!,
    ociSurname: formData.caseInvestigatorLastNameText,
    ociFirstName: formData.caseInvestigatorFirstNameText,
    ociShoulderNumber: formData.caseInvestigatorShoulderNumberText,
    ociPoliceUnit: formData.caseInvestigatorPoliceUnitText,
  };
};

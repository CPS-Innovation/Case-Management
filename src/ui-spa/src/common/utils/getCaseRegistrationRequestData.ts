import { type CaseRegistrationFormData } from "../reducers/caseRegistrationReducer";
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
    allocateWcuId: formData.witnessCareUnitText.id! ?? 0,
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
    ociRank: formData.caseInvestigatorTitleSelect.shortCode ?? "",
    ociSurname: formData.caseInvestigatorLastNameText,
    ociFirstName: formData.caseInvestigatorFirstNameText,
    ociShoulderNumber: formData.caseInvestigatorShoulderNumberText,
    ociPoliceUnit: policeUnit ? policeUnit.code : "",
  };
};

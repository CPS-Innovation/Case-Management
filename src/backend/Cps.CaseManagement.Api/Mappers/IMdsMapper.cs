namespace Cps.CaseManagement.Api.Mappers;

using Cps.CaseManagement.Api.Models.Dto;
using Cps.CaseManagement.MdsClient.Models.Entities;

public interface IMdsMapper
{
    TitleDto MapTitleEntityToDto(TitleEntity entity);
    ReligionDto MapReligionEntityToDto(ReligionEntity entity);
    GenderDto MapGenderEntityToDto(GenderEntity entity);
    EthnicityDto MapEthnicityEntityToDto(EthnicityEntity entity);
    MonitoringCodeDto MapMonitoringCodeEntityToDto(MonitoringCodeEntity entity);
    ComplexityDto MapComplexityEntityToDto(ComplexitityEntity entity);
    OffenderCategoryDto MapOffenderCategoryEntityToDto(OffenderCategoryEntity entity);
    ProsecutorOrCaseworkerDto MapProsecutorOrCaseworkerEntityToDto(ProsecutorOrCaseworkerEntity entity);
    CourtDto MapCourtEntityToDto(CourtEntity entity);
    WMSUnitDto MapWMSUnitEntityToDto(WMSUnitEntity entity);
    CaseInfoDto MapCaseInfoEntityToDto(CaseInfoEntity entity);
    PoliceUnitDto MapPoliceUnitEntityToDto(PoliceUnitEntity entity);
    OffencesDto MapOffencesEntityToDto(OffencesEntity entity);
    UnitsDto MapUnitsAndUserDataToDto(IEnumerable<UnitEntity> allUnits, long? homeUnitId);
}
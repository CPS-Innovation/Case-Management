
namespace Cps.CaseManagement.MdsClient.Client;

using Cps.CaseManagement.MdsClient.Models.Args;
using Cps.CaseManagement.MdsClient.Models.Entities;

public interface IMdsClient
{
    Task<IEnumerable<TitleEntity>> GetTitlesAsync(MdsBaseArgDto arg);
    Task<IEnumerable<ReligionEntity>> GetReligionsAsync(MdsBaseArgDto arg);
    Task<IEnumerable<GenderEntity>> GetGendersAsync(MdsBaseArgDto arg);
    Task<IEnumerable<EthnicityEntity>> GetEthnicitiesAsync(MdsBaseArgDto arg);
    Task<IEnumerable<MonitoringCodeEntity>> GetMonitoringCodesAsync(MdsBaseArgDto arg);
    Task<IEnumerable<ComplexitityEntity>> GetComplexityCodesAsync(MdsBaseArgDto arg);
    Task<IEnumerable<OffenderCategoryEntity>> GetOffenderCategoriesAsync(MdsBaseArgDto arg);
    Task<IEnumerable<ProsecutorOrCaseworkerEntity>> GetProsecutorsAsync(MdsUnitIdArg arg);
    Task<IEnumerable<ProsecutorOrCaseworkerEntity>> GetCaseworkersAsync(MdsUnitIdArg arg);
    Task<IEnumerable<CourtEntity>> GetCourtsAsync(MdsUnitIdArg arg);
    Task<IEnumerable<UnitEntity>> GetUnitsAsync(MdsBaseArgDto arg);
    Task<UserDataEntity> GetUserDataAsync(MdsBaseArgDto arg);
    Task<IEnumerable<WMSUnitEntity>> GetWMSUnitsAsync(MdsBaseArgDto arg);
    Task<IEnumerable<CaseInfoEntity>> ListCasesByUrnAsync(MdsUrnArg arg);
    Task<string?> GetCmsModernTokenAsync(MdsBaseArgDto arg);
    Task<CaseRegistrationEntity> RegisterCaseAsync(MdsRegisterCaseArg arg);
    Task<IEnumerable<PoliceUnitEntity>> GetPoliceUnitsAsync(MdsBaseArgDto arg);
    Task<OffencesEntity> SearchOffences(MdsOffenceSearchArg arg);
}
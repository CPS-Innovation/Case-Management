
namespace Cps.CaseManagement.Api.Services;

using Cps.CaseManagement.Api.Models;
using Cps.CaseManagement.Api.Models.Dto;
using Cps.CaseManagement.MdsClient.Client;
using Cps.CaseManagement.MdsClient.Models.Args;
using Microsoft.Extensions.Logging;

public interface IMdsService
{
    Task<IEnumerable<TitleDto>> GetTitlesAsync(MdsBaseArgDto arg, bool? isPoliceTitle = null);
    Task<IEnumerable<ReligionDto>> GetReligionsAsync(MdsBaseArgDto arg);
    Task<IEnumerable<GenderDto>> GetGendersAsync(MdsBaseArgDto arg);
    Task<IEnumerable<EthnicityDto>> GetEthnicitiesAsync(MdsBaseArgDto arg);
    Task<IEnumerable<MonitoringCodeDto>> GetMonitoringCodesAsync(MdsBaseArgDto arg);
    Task<IEnumerable<ComplexityDto>> GetComplexityCodesAsync(MdsBaseArgDto arg);
    Task<IEnumerable<OffenderCategoryDto>> GetOffenderCategoriesAsync(MdsBaseArgDto arg);
    Task<IEnumerable<ProsecutorOrCaseworkerDto>> GetProsecutorsAsync(MdsUnitIdArg arg);
    Task<IEnumerable<ProsecutorOrCaseworkerDto>> GetCaseworkersAsync(MdsUnitIdArg arg);
    Task<IEnumerable<CourtDto>> GetCourtsAsync(MdsUnitIdArg arg);
    Task<UnitsDto> GetUnitsAsync(MdsBaseArgDto arg);
    Task<IEnumerable<WMSUnitDto>> GetWMSUnitsAsync(MdsBaseArgDto arg, bool? isWCU = null);
    Task<IEnumerable<CaseInfoDto>> ListCasesByUrnAsync(MdsUrnArg arg);
    Task<string?> GetCmsModernTokenAsync(MdsBaseArgDto arg);
    Task<IEnumerable<PoliceUnitDto>> GetPoliceUnitsAsync(MdsBaseArgDto arg);
    Task<OffencesDto> SearchOffences(MdsOffenceSearchArg arg);
}
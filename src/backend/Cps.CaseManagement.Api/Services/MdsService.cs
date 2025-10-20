namespace Cps.CaseManagement.Api.Services;

using Cps.CaseManagement.Api.Mappers;
using Cps.CaseManagement.Api.Models.Dto;
using Cps.CaseManagement.MdsClient.Client;
using Cps.CaseManagement.MdsClient.Models.Args;
using Microsoft.Extensions.Logging;

public class MdsService(IMdsClient mdsClient, IMdsMapper mdsMapper, ILogger<MdsService> logger) : IMdsService
{
    private readonly IMdsClient _mdsClient = mdsClient;
    private readonly IMdsMapper _mdsMapper = mdsMapper;
    private readonly ILogger<MdsService> _logger = logger;

    public async Task<IEnumerable<TitleDto>> GetTitlesAsync(MdsBaseArgDto arg, bool? isPoliceTitle = null)
    {
        _logger.LogDebug("Fetching titles from MDS");
        var entities = await _mdsClient.GetTitlesAsync(arg);

        if (isPoliceTitle.HasValue)
        {
            entities = entities.Where(e => e.IsPoliceTitle == isPoliceTitle.Value);
        }

        return entities.Select(e => _mdsMapper.MapTitleEntityToDto(e));
    }

    public async Task<IEnumerable<ReligionDto>> GetReligionsAsync(MdsBaseArgDto arg)
    {
        _logger.LogDebug("Fetching religions from MDS");
        var entities = await _mdsClient.GetReligionsAsync(arg);
        return entities.Select(e => _mdsMapper.MapReligionEntityToDto(e));
    }

    public async Task<IEnumerable<GenderDto>> GetGendersAsync(MdsBaseArgDto arg)
    {
        _logger.LogDebug("Fetching genders from MDS");
        var entities = await _mdsClient.GetGendersAsync(arg);
        return entities.Select(e => _mdsMapper.MapGenderEntityToDto(e));
    }

    public async Task<IEnumerable<EthnicityDto>> GetEthnicitiesAsync(MdsBaseArgDto arg)
    {
        _logger.LogDebug("Fetching ethnicities from MDS");
        var entities = await _mdsClient.GetEthnicitiesAsync(arg);
        return entities.Select(e => _mdsMapper.MapEthnicityEntityToDto(e));
    }

    public async Task<IEnumerable<MonitoringCodeDto>> GetMonitoringCodesAsync(MdsBaseArgDto arg)
    {
        _logger.LogDebug("Fetching monitoring codes from MDS");
        var entities = await _mdsClient.GetMonitoringCodesAsync(arg);
        return entities.Select(e => _mdsMapper.MapMonitoringCodeEntityToDto(e));
    }

    public async Task<IEnumerable<ComplexityDto>> GetComplexityCodesAsync(MdsBaseArgDto arg)
    {
        _logger.LogDebug("Fetching complexity codes from MDS");
        var entities = await _mdsClient.GetComplexityCodesAsync(arg);
        return entities.Select(e => _mdsMapper.MapComplexityEntityToDto(e));
    }

    public async Task<IEnumerable<OffenderCategoryDto>> GetOffenderCategoriesAsync(MdsBaseArgDto arg)
    {
        _logger.LogDebug("Fetching offender categories from MDS");
        var entities = await _mdsClient.GetOffenderCategoriesAsync(arg);
        return entities.Select(e => _mdsMapper.MapOffenderCategoryEntityToDto(e));
    }

    public async Task<IEnumerable<ProsecutorOrCaseworkerDto>> GetProsecutorsAsync(MdsUnitIdArg arg)
    {
        _logger.LogDebug("Fetching prosecutors from MDS for unit {UnitId}", arg.UnitId);
        var entities = await _mdsClient.GetProsecutorsAsync(arg);
        return entities.Select(e => _mdsMapper.MapProsecutorOrCaseworkerEntityToDto(e));
    }

    public async Task<IEnumerable<ProsecutorOrCaseworkerDto>> GetCaseworkersAsync(MdsUnitIdArg arg)
    {
        _logger.LogDebug("Fetching caseworkers from MDS for unit {UnitId}", arg.UnitId);
        var entities = await _mdsClient.GetCaseworkersAsync(arg);
        return entities.Select(e => _mdsMapper.MapProsecutorOrCaseworkerEntityToDto(e));
    }

    public async Task<IEnumerable<CourtDto>> GetCourtsAsync(MdsUnitIdArg arg)
    {
        _logger.LogDebug("Fetching courts from MDS for unit {UnitId}", arg.UnitId);
        var entities = await _mdsClient.GetCourtsAsync(arg);
        return entities.Select(e => _mdsMapper.MapCourtEntityToDto(e));
    }

    public async Task<UnitsDto> GetUnitsAsync(MdsBaseArgDto arg)
    {
        _logger.LogDebug("Fetching units and user data from MDS");

        var unitsTask = _mdsClient.GetUnitsAsync(arg);
        var userTask = _mdsClient.GetUserDataAsync(arg);

        await Task.WhenAll(unitsTask, userTask).ConfigureAwait(false);

        var allUnits = await unitsTask.ConfigureAwait(false);
        var userData = await userTask.ConfigureAwait(false);
        var homeUnitId = userData?.HomeUnit?.UnitId;

        return _mdsMapper.MapUnitsAndUserDataToDto(allUnits, homeUnitId);
    }

    public async Task<IEnumerable<WMSUnitDto>> GetWMSUnitsAsync(MdsBaseArgDto arg)
    {
        _logger.LogDebug("Fetching WMS units from MDS");
        var entities = await _mdsClient.GetWMSUnitsAsync(arg);

        return entities.Select(e => _mdsMapper.MapWMSUnitEntityToDto(e));
    }

    public async Task<IEnumerable<CaseInfoDto>> ListCasesByUrnAsync(MdsUrnArg arg)
    {
        _logger.LogDebug("Listing cases by URN {Urn}", arg.Urn);
        var entities = await _mdsClient.ListCasesByUrnAsync(arg);

        return entities.Select(e => _mdsMapper.MapCaseInfoEntityToDto(e));
    }

    public async Task<string?> GetCmsModernTokenAsync(MdsBaseArgDto arg)
    {
        _logger.LogDebug("Fetching CMS Modern token");

        return await _mdsClient.GetCmsModernTokenAsync(arg);
    }

    public async Task<IEnumerable<PoliceUnitDto>> GetPoliceUnitsAsync(MdsBaseArgDto arg)
    {
        _logger.LogDebug("Fetching police units from MDS");
        var entities = await _mdsClient.GetPoliceUnitsAsync(arg);

        return entities.Select(e => _mdsMapper.MapPoliceUnitEntityToDto(e));
    }

    public async Task<OffencesDto> SearchOffences(MdsOffenceSearchArg arg)
    {
        _logger.LogDebug("Searching offences in MDS with provided criteria");
        var entity = await _mdsClient.SearchOffences(arg);

        return _mdsMapper.MapOffencesEntityToDto(entity);
    }
}